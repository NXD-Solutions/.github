#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const HIERARCHY_PATH = '.claude/hierarchy.md';
const CLAUDE_ROOT = '.claude';

const content = fs.readFileSync(HIERARCHY_PATH, 'utf8');
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
const failures = [];
let match;

while ((match = linkRegex.exec(content)) !== null) {
  const href = match[2];

  if (href.startsWith('http')) continue;

  const [filePart, anchor] = href.split('#');
  const fullPath = path.join(CLAUDE_ROOT, filePart);

  if (!fs.existsSync(fullPath)) {
    failures.push(`File not found: \`${fullPath}\` (linked as \`${href}\`)`);
    continue;
  }

  if (anchor) {
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    // Forward-generate anchors from headings and compare — handles em dashes, parens, dots, etc.
    const headings = fileContent.match(/^#{1,6}\s+(.+)$/gm) || [];
    const anchors = headings.map(h =>
      h.replace(/^#{1,6}\s+/, '')
       .toLowerCase()
       .replace(/[^\w\s-]/g, '')  // remove special chars, preserve spaces and hyphens
       .replace(/ /g, '-')         // each space → hyphen (preserves runs → double hyphens)
    );
    if (!anchors.includes(anchor)) {
      failures.push(`Heading \`#${anchor}\` not found in \`${fullPath}\``);
    }
  }
}

const prNumber = process.env.PR_NUMBER || 'N';
const summaryFile = process.env.GITHUB_STEP_SUMMARY;

if (failures.length > 0) {
  const lines = [
    '## ❌ Hierarchy tree has broken references',
    '',
    'The following nodes in `.claude/hierarchy.md` point to files or headings that do not exist:',
    '',
    ...failures.map(f => `- ${f}`),
    '',
    '**To fix:** run the following command in Claude Code:',
    '',
    `\`/dna-workbench fix PR-${prNumber}\``,
    '',
    'The workbench will repair the broken references and commit the fix to this branch.',
  ].join('\n');

  if (summaryFile) fs.appendFileSync(summaryFile, lines + '\n');
  console.error(lines);
  process.exit(1);
}

const ok = '✅ All hierarchy references resolve.\n';
if (summaryFile) fs.appendFileSync(summaryFile, ok);
console.log(ok.trim());