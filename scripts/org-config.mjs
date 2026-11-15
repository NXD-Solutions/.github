// Reads the literal lines NXD-Solutions/dna's role configuration (nxd-practices/rules/org.config.md) states for the
// org's automation: who each hub is, where each hub's standing issue is, who the principal is, and which project
// is a tier. The lines' form is set there; this only reads it (NXD-Solutions/.github#409).

// `- **Hub:** <person> (@login) — <where>`: login (lower case) -> person.
export function readHubs(text) {
  const hubs = new Map();
  for (const m of text.matchAll(/^\s*-\s*\*\*Hub:\*\*\s*(.+?)\s*\(@([\w-]+)\)/gm)) hubs.set(m[2].toLowerCase(), m[1].trim());
  return hubs;
}

// `- **Hub issue:** <person> — <owner/repo#n>`: person -> { repo, number }.
export function readHubIssues(text) {
  const issues = new Map();
  for (const m of text.matchAll(/^\s*-\s*\*\*Hub issue:\*\*\s*(.+?)\s*—\s*([\w.-]+\/[\w.-]+)#(\d+)\s*$/gm)) {
    issues.set(m[1].trim(), { repo: m[2], number: Number(m[3]) });
  }
  return issues;
}

// The person in the role table's `Manifest Steward` row: the principal, whose hub takes what has no hub of its own.
export function readPrincipal(text) {
  const m = text.match(/^\|\s*Manifest Steward[^|]*\|\s*([^|]+?)\s*\|/m);
  return m ? m[1].trim() : null;
}

// `- **Tier project:** <name> — #<n>`: the project's number, or null.
export function readTierProject(text, name) {
  for (const m of text.matchAll(/^\s*-\s*\*\*Tier project:\*\*\s*(.+?)\s*—\s*#(\d+)\s*$/gm)) {
    if (m[1].trim() === name) return Number(m[2]);
  }
  return null;
}

// Where a person's work is reported: the hub of their login, else the principal's. null when the principal has
// no hub either, which the caller treats as a broken configuration.
export function hubFor(login, hubs, principal) {
  const own = login ? hubs.get(login.toLowerCase()) : undefined;
  if (own) return own;
  return [...hubs.values()].includes(principal) ? principal : null;
}
