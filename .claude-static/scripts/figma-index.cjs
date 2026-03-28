#!/usr/bin/env node
"use strict";

/**
 * Figma screen index — create or update .figma/screens.json
 *
 * Usage: node .claude/scripts/figma-index.cjs [path/to/.figma]
 *
 * Reads:  .figma/project.json         (fileKey)
 * Writes: .figma/screens.json         (screen index)
 * Env:    FIGMA_TOKEN                  (personal access token)
 *
 * Flow:
 *   1. Fetch full file tree
 *   2. Compare lastModified — stop if unchanged
 *   3. If changed: extract screens with content hashes, diff against stored index
 *   4. Write new screens.json (hashes enable per-screen change detection)
 */

const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// .figma/ lives at the scope it serves — app folder or repo root
const FIGMA_DIR = process.argv[2] || path.join(process.cwd(), ".figma");
const PROJECT_PATH = path.join(FIGMA_DIR, "project.json");
const SCREENS_PATH = path.join(FIGMA_DIR, "screens.json");

function die(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function figmaRequest(urlPath) {
  const token = process.env.FIGMA_TOKEN;
  if (!token) die("FIGMA_TOKEN env var is not set.");

  const url = `https://api.figma.com/v1${urlPath}`;
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "X-Figma-Token": token } }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Figma API ${res.statusCode}: ${body.slice(0, 200)}`));
          return;
        }
        resolve(JSON.parse(body));
      });
    });
    req.on("error", reject);
  });
}

function findExportGallery(fileData) {
  const canvas = fileData.document.children[0];
  if (!canvas) return null;
  const topFrame = canvas.children[0];
  if (!topFrame) return null;
  const gallery = (topFrame.children || []).find((c) => c.name === "ExportGallery");
  return gallery || topFrame;
}

function collectScreens(gallery) {
  const screens = [];
  for (const child of gallery.children || []) {
    if (child.name === "GroupLabel") continue;
    const sl = (child.children || []).find((c) => c.name === "SectionLabel");
    if (!sl) continue;

    const textNode = findTextNode(sl);
    const rawName = textNode || child.name;
    const match = rawName.match(/^(\d+)\s*·\s*(.+)/);

    screens.push({
      nodeId: child.id,
      number: match ? parseInt(match[1], 10) : null,
      name: match ? match[2].trim() : rawName,
      figmaName: child.name,
      contentHash: hashNode(child),
    });
  }
  screens.sort((a, b) => (a.number || 0) - (b.number || 0));
  return screens;
}

function findTextNode(node) {
  if (node.type === "TEXT" && node.characters) return node.characters;
  for (const child of node.children || []) {
    const result = findTextNode(child);
    if (result) return result;
  }
  return null;
}

function hashNode(node) {
  return crypto.createHash("sha256").update(JSON.stringify(node)).digest("hex").slice(0, 12);
}

function diffScreens(oldScreens, newScreens) {
  const oldMap = new Map(oldScreens.map((s) => [s.nodeId, s]));

  return {
    added: newScreens.filter((s) => !oldMap.has(s.nodeId)),
    removed: oldScreens.filter((s) => !new Map(newScreens.map((x) => [x.nodeId, x])).has(s.nodeId)),
    renamed: newScreens.filter((s) => {
      const old = oldMap.get(s.nodeId);
      return old && old.name !== s.name;
    }),
    contentChanged: newScreens.filter((s) => {
      const old = oldMap.get(s.nodeId);
      return old && old.contentHash !== s.contentHash && old.name === s.name;
    }),
  };
}

function printDiff(diff, oldScreens) {
  const oldMap = new Map(oldScreens.map((s) => [s.nodeId, s.name]));
  let changes = 0;

  for (const s of diff.added) {
    console.log(`  + ADDED: #${s.number || "?"} ${s.name} (${s.nodeId})`);
    changes++;
  }
  for (const s of diff.removed) {
    console.log(`  - REMOVED: #${s.number || "?"} ${s.name} (${s.nodeId})`);
    changes++;
  }
  for (const s of diff.renamed) {
    console.log(`  ~ RENAMED: ${oldMap.get(s.nodeId)} → ${s.name} (${s.nodeId})`);
    changes++;
  }
  for (const s of diff.contentChanged) {
    console.log(`  * CONTENT CHANGED: #${s.number || "?"} ${s.name} (${s.nodeId})`);
    changes++;
  }

  if (changes === 0) console.log("  No changes.");
}

async function main() {
  if (!fs.existsSync(PROJECT_PATH)) {
    die(`.figma/project.json not found. Run dev:figma Register first.`);
  }
  const project = JSON.parse(fs.readFileSync(PROJECT_PATH, "utf8"));
  const { fileKey } = project;
  if (!fileKey) die("fileKey missing from .figma/project.json");

  console.log(`Figma file: ${project.projectName || fileKey}`);

  // Load existing index
  let existing = null;
  if (fs.existsSync(SCREENS_PATH)) {
    existing = JSON.parse(fs.readFileSync(SCREENS_PATH, "utf8"));
  }

  // Fetch full file tree
  console.log("Fetching file tree...");
  const fileData = await figmaRequest(`/files/${fileKey}`);

  if (existing && existing.lastModified === fileData.lastModified) {
    console.log(`No changes since ${fileData.lastModified}. Index is current.`);
    process.exit(0);
  }

  console.log(
    existing
      ? `File modified (${existing.lastModified} → ${fileData.lastModified}).`
      : "First run."
  );

  const gallery = findExportGallery(fileData);
  if (!gallery) die("Could not find ExportGallery in the Figma file.");

  const screens = collectScreens(gallery);
  console.log(`Indexed ${screens.length} screens.`);

  if (existing && existing.screens) {
    console.log("Changes:");
    const diff = diffScreens(existing.screens, screens);
    printDiff(diff, existing.screens);
  }

  // Write screen index
  const index = {
    fileKey,
    lastModified: fileData.lastModified,
    indexedAt: new Date().toISOString(),
    screenCount: screens.length,
    screens,
  };
  fs.writeFileSync(SCREENS_PATH, JSON.stringify(index, null, 2) + "\n");
  console.log(`Index written to ${SCREENS_PATH}`);

  // Write full tree snapshot (gitignored — local build reference)
  const snapshotPath = path.join(FIGMA_DIR, "figma.snapshot.json");
  fs.writeFileSync(snapshotPath, JSON.stringify(fileData, null, 2) + "\n");
  const sizeKB = (fs.statSync(snapshotPath).size / 1024).toFixed(0);
  console.log(`Snapshot written to ${snapshotPath} (${sizeKB} KB)`);

}

main().catch((err) => die(err.message));