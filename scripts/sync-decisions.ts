/**
 * sync-decisions.ts
 *
 * Discovers all NXD platform decision pages by querying the Confluence
 * Decision Log space, extracts the "## AI Summary — <role>" section
 * from each, and writes .claude/rules/decisions-<role>.md grouped by
 * classification.
 *
 * A page is treated as a decision page if its At a Glance table has a
 * recognised Status value (Accepted, Proposed, Draft, Deprecated).
 * Structural pages (folders, index pages) are skipped silently.
 * Decision pages without an AI Summary section for the requested role
 * are skipped silently — no error, no exclusion list needed.
 *
 * Usage:
 *   CONFLUENCE_EMAIL=you@example.com CONFLUENCE_API_TOKEN=xxx \
 *     npx tsx scripts/sync-decisions.ts --role Developer
 */

import { writeFileSync, appendFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CONFLUENCE_BASE = "https://nordicexperiencedesign.atlassian.net";
const CONFLUENCE_SPACE = "NSME";

function confluenceUrl(id: number): string {
  return `${CONFLUENCE_BASE}/wiki/spaces/${CONFLUENCE_SPACE}/pages/${id}`;
}

/** Root page of the Decision Log — all descendants are scanned. */
const DECISION_LOG_ROOT = 17104898;

/** Status values that identify a page as a decision (not a folder/index). */
const KNOWN_STATUSES = new Set([
  "Accepted",
  "Proposed",
  "Draft",
  "Deprecated",
]);

function getRole(): string {
  const idx = process.argv.indexOf("--role");
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return "Developer";
}

const ROLE = getRole();

// Output path is relative to the working directory (the calling repository root).
const OUTPUT_PATH = resolve(
  process.cwd(),
  `.claude/rules/decisions-${ROLE.toLowerCase()}.md`
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Classification = "Standard" | "Architectural" | "Strategic" | "Unknown";

interface PageRef {
  id: number;
  title: string;
}

interface DecisionSummary {
  id: number;
  title: string;
  status: string;
  classification: Classification;
  bullets: string[];
}

// ---------------------------------------------------------------------------
// Confluence API helpers
// ---------------------------------------------------------------------------

const FETCH_TIMEOUT_MS = 30_000;

function getAuth(): string {
  const email = process.env.CONFLUENCE_EMAIL;
  const token = process.env.CONFLUENCE_API_TOKEN;
  if (!email || !token) {
    console.error(
      "Error: CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must be set."
    );
    process.exit(1);
  }
  return Buffer.from(`${email}:${token}`).toString("base64");
}

function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

/**
 * Returns all pages that are descendants of DECISION_LOG_ROOT using CQL.
 * Paginates until all results are collected.
 */
async function fetchAllPageRefs(auth: string): Promise<PageRef[]> {
  const pages: PageRef[] = [];
  const limit = 50;
  let start = 0;

  while (true) {
    const cql = encodeURIComponent(`ancestor=${DECISION_LOG_ROOT} AND type=page`);
    const url = `${CONFLUENCE_BASE}/wiki/rest/api/content/search?cql=${cql}&limit=${limit}&start=${start}`;
    console.log(`  GET ${url}`);
    const res = await fetchWithTimeout(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(
        `HTTP ${res.status} fetching page list: ${await res.text()}`
      );
    }
    const data = (await res.json()) as {
      results: Array<{ id: string; title: string }>;
      size: number;
      _links: { next?: string };
    };

    for (const r of data.results) {
      pages.push({ id: parseInt(r.id, 10), title: r.title });
    }

    start += data.size;
    console.log(`  → ${data.size} results (${start} collected so far)`);

    if (!data._links?.next) break;
  }

  return pages;
}

/** Fetches the storage-format body of a single page. */
async function fetchPageBody(id: number, auth: string): Promise<string> {
  const url = `${CONFLUENCE_BASE}/wiki/rest/api/content/${id}?expand=body.storage`;
  const res = await fetchWithTimeout(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching page ${id}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    body: { storage: { value: string } };
  };
  return data.body.storage.value;
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/**
 * Strips Confluence storage-format XML/HTML tags, leaving plain text.
 * Block tags are converted to newlines; everything else is stripped.
 */
function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|li|tr|th|td|h[1-6]|div|ul|ol)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

/**
 * Finds the value cell for a given label in any two-column table.
 *
 * The At a Glance table uses <td><p><strong>Label</strong></p></td> for
 * labels (not <th>), with plain text values in the adjacent <td>.
 * Strips all tags from both cells before comparing / returning.
 */
function extractTableValue(body: string, label: string): string {
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowPattern.exec(body)) !== null) {
    const cells = [...rowMatch[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)];
    if (cells.length < 2) continue;
    const cellLabel = stripTags(cells[0][1]).trim();
    if (cellLabel.toLowerCase() === label.toLowerCase()) {
      return stripTags(cells[1][1]).trim();
    }
  }
  return "";
}

/** Extracts the Status value from the At a Glance table. */
function extractStatus(body: string): string {
  return extractTableValue(body, "Status");
}

/** Extracts the Classification value from the At a Glance table. */
function extractClassification(body: string): Classification {
  const raw = extractTableValue(body, "Classification");
  if (raw.includes("Standard")) return "Standard";
  if (raw.includes("Architectural")) return "Architectural";
  if (raw.includes("Strategic")) return "Strategic";
  return "Unknown";
}

/**
 * Extracts bullet points from the "## AI Summary — <role>" section.
 *
 * In Confluence storage format headings become <h2> elements and list items
 * become <li> elements. Bullets starting with "_" are template placeholders
 * and are ignored.
 */
function extractRoleSummary(body: string, role: string): string[] {
  const escaped = role.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headingPattern = new RegExp(
    `<h2[^>]*>\\s*AI\\s+Summary\\s*(?:&mdash;|&ndash;|[—\\-–])\\s*${escaped}\\s*<\\/h2>`,
    "i"
  );
  const headingMatch = headingPattern.exec(body);
  if (!headingMatch) return [];

  const afterHeading = body.slice(headingMatch.index + headingMatch[0].length);

  // Collect content up to the next heading
  const nextHeading = /<h[1-6][^>]*>/i.exec(afterHeading);
  const section = nextHeading
    ? afterHeading.slice(0, nextHeading.index)
    : afterHeading;

  const bullets: string[] = [];
  const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch: RegExpExecArray | null;
  while ((liMatch = liPattern.exec(section)) !== null) {
    const text = stripTags(liMatch[1]).trim().replace(/\s+/g, " ");
    if (text && !text.startsWith("_")) {
      bullets.push(text);
    }
  }
  return bullets;
}

// ---------------------------------------------------------------------------
// Output formatter
// ---------------------------------------------------------------------------

const CLASSIFICATION_ORDER: Classification[] = [
  "Standard",
  "Architectural",
  "Strategic",
];

function buildMarkdown(decisions: DecisionSummary[], role: string): string {
  const lines: string[] = [
    `# NXD Decision Log — ${role} AI Reference`,
    "",
    "<!-- AUTO-GENERATED — do not edit by hand.",
    "     Regenerated by the 'Sync decisions from Confluence' GitHub Actions workflow. -->",
    "",
    "Contains the actionable constraints extracted from each NXD platform",
    "decision. Read by AI coding assistants to enforce standards.",
    "",
    "---",
    "",
  ];

  for (const classification of CLASSIFICATION_ORDER) {
    const group = decisions.filter((d) => d.classification === classification);
    if (group.length === 0) continue;

    const sectionLabel =
      classification === "Standard"
        ? "Standards — How we implement (binding on all code)"
        : classification === "Architectural"
        ? "Architectural — What we adopt (binding technology choices)"
        : "Strategic — What and why (principles that constrain all decisions)";

    lines.push(`## ${sectionLabel}`, "");

    for (const d of group) {
      lines.push(`**${d.title}** — ${d.status}`);
      for (const bullet of d.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }

    lines.push("---", "");
  }

  // Unknown classification at the end
  const unclassified = decisions.filter(
    (d) => !CLASSIFICATION_ORDER.includes(d.classification)
  );
  if (unclassified.length > 0) {
    lines.push("## Proposed / Unclassified", "");
    for (const d of unclassified) {
      lines.push(`**${d.title}** — ${d.status}`);
      for (const bullet of d.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push("");
    }
    lines.push("---", "");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Step summary (GitHub Actions)
// ---------------------------------------------------------------------------

interface RunStats {
  discovered: number;
  skippedStructural: Array<{ id: number; title: string }>;
  skippedNoSummary: Array<{ id: number; title: string }>;
  decisions: DecisionSummary[];
  errors: string[];
  outputWritten: boolean;
  role: string;
}

function writeStepSummary(stats: RunStats): void {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryFile) return; // not running in GitHub Actions

  const lines: string[] = [];

  const statusLabel = stats.errors.length > 0 ? "Errors encountered" : "Decisions synced";
  const statusIcon = stats.errors.length > 0 ? "❌" : "✅";

  lines.push(
    `## ${statusIcon} Sync decisions — ${statusLabel}`,
    "",
    `**Role:** ${stats.role}`,
    "",
    "| | Count |",
    "|---|---|",
    `| Pages discovered under Decision Log | ${stats.discovered} |`,
    `| Structural pages skipped (no status) | ${stats.skippedStructural.length} |`,
    `| Decision pages without AI Summary — ${stats.role} (skipped) | ${stats.skippedNoSummary.length} |`,
    `| Decisions included in output | ${stats.decisions.length} |`,
    `| Errors | ${stats.errors.length} |`,
    "",
  );

  if (stats.outputWritten) {
    lines.push(`**Output:** \`.claude/rules/decisions-${stats.role.toLowerCase()}.md\` updated`, "");
  }

  if (stats.errors.length > 0) {
    lines.push("### ❌ Errors", "");
    for (const e of stats.errors) {
      lines.push(`- ${e}`);
    }
    lines.push("");
  }

  lines.push(
    "<details>",
    "<summary>Decisions included</summary>",
    "",
    "| Title | Classification | Status |",
    "|---|---|---|",
  );
  for (const d of stats.decisions) {
    lines.push(`| [${d.title}](${confluenceUrl(d.id)}) | ${d.classification} | ${d.status} |`);
  }
  lines.push("</details>", "");

  if (stats.skippedNoSummary.length > 0) {
    lines.push(
      "<details>",
      `<summary>Decision pages without AI Summary — ${stats.role}</summary>`,
      "",
      "| Title |",
      "|---|",
    );
    for (const { id, title } of stats.skippedNoSummary) {
      lines.push(`| [${title}](${confluenceUrl(id)}) |`);
    }
    lines.push("</details>", "");
  }

  if (stats.skippedStructural.length > 0) {
    lines.push(
      "<details>",
      "<summary>Structural pages skipped</summary>",
      "",
      "| Title |",
      "|---|",
    );
    for (const { title } of stats.skippedStructural) {
      lines.push(`| ${title} |`);
    }
    lines.push("</details>", "");
  }

  appendFileSync(summaryFile, lines.join("\n"), "utf-8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const auth = getAuth();

  console.log(`Role: ${ROLE}`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Discovering pages under Decision Log root (${DECISION_LOG_ROOT})…`);
  const allPages = await fetchAllPageRefs(auth);
  console.log(`Found ${allPages.length} pages. Fetching bodies…`);

  const bodyResults = await Promise.allSettled(
    allPages.map((p) =>
      fetchPageBody(p.id, auth).then((body) => ({ ...p, body }))
    )
  );

  const decisions: DecisionSummary[] = [];
  const skippedStructural: Array<{ id: number; title: string }> = [];
  const skippedNoSummary: Array<{ id: number; title: string }> = [];
  const errors: string[] = [];

  for (const result of bodyResults) {
    if (result.status === "rejected") {
      errors.push(String(result.reason));
      continue;
    }

    const { id, title, body } = result.value;
    const status = extractStatus(body);

    if (!KNOWN_STATUSES.has(status)) {
      console.log(`  SKIP [${id}] ${title} (structural)`);
      if (process.env.SYNC_DEBUG) {
        console.log(`  --- body snippet [${id}] ---`);
        console.log(body.slice(0, 3000));
        console.log(`  --- end snippet ---`);
      }
      skippedStructural.push({ id, title });
      continue;
    }

    const classification = extractClassification(body);
    const bullets = extractRoleSummary(body, ROLE);

    if (bullets.length === 0) {
      console.log(`  SKIP [${id}] ${title} (no AI Summary — ${ROLE})`);
      skippedNoSummary.push({ id, title });
    } else {
      console.log(`  OK   [${id}] ${title} (${classification}, ${status})`);
      decisions.push({ id, title, status, classification, bullets });
    }
  }

  if (errors.length > 0) {
    console.error("\nErrors fetching pages:");
    errors.forEach((e) => console.error("  " + e));
    writeStepSummary({ discovered: allPages.length, skippedStructural, skippedNoSummary, decisions, errors, outputWritten: false, role: ROLE });
    process.exit(1);
  }

  const markdown = buildMarkdown(decisions, ROLE);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, markdown, "utf-8");
  console.log(`\nWrote ${OUTPUT_PATH} (${decisions.length} decisions)`);

  writeStepSummary({ discovered: allPages.length, skippedStructural, skippedNoSummary, decisions, errors, outputWritten: true, role: ROLE });

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
