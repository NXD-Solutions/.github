import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { callersFor } from '../scripts/caller-workflows.mjs';

// The promise (NXD-Solutions/.github#422), one test per guarantee. The sync copies distributed/landing-gate.yml only to a repository the registry marks
// `landing-gate: true`, only while the global distribute-caller-workflows is true, in the same pull request as the other caller. That the workflow copies what
// these decide is the single-repo run on the scratch repository, recorded on the issue.

const MARKED = 'NXD-Solutions/with-a-landing-branch';
const OTHER = 'NXD-Solutions/without';
const registry = (flag) => ({ 'distribute-caller-workflows': flag, overrides: { [MARKED]: { 'landing-gate': true } } });

test('a marked repository gets the landing-gate caller beside the other caller while the global flag is true', () => {
  assert.deepEqual(callersFor({ registry: registry(true), repo: MARKED }), ['pr-names-issue.yml', 'landing-gate.yml']);
});

test('a marked repository gets no caller while the global flag is false, since no workflow file can be pushed', () => {
  assert.deepEqual(callersFor({ registry: registry(false), repo: MARKED }), []);
  assert.deepEqual(callersFor({ registry: { overrides: registry(true).overrides }, repo: MARKED }), []);
});

test('an unmarked repository gets the other caller and never the landing-gate caller (mutation: copied to an unmarked repository)', () => {
  assert.deepEqual(callersFor({ registry: registry(true), repo: OTHER }), ['pr-names-issue.yml']);
  assert.deepEqual(callersFor({ registry: { 'distribute-caller-workflows': true }, repo: OTHER }), ['pr-names-issue.yml']);
});

test('only the value true marks a repository: false, a string or an empty key does not', () => {
  for (const value of [false, 'true', null, 1]) {
    const r = { 'distribute-caller-workflows': true, overrides: { [MARKED]: { 'landing-gate': value } } };
    assert.deepEqual(callersFor({ registry: r, repo: MARKED }), ['pr-names-issue.yml'], String(value));
  }
});

test('the global flag counts only as the boolean true, as the YAML flag reads', () => {
  for (const flag of ['true', 1, 'yes']) assert.deepEqual(callersFor({ registry: registry(flag), repo: MARKED }), []);
});

test('a second run with the same registry decides the same, so a file already copied leaves no change to open a pull request for', () => {
  assert.deepEqual(callersFor({ registry: registry(true), repo: MARKED }), callersFor({ registry: registry(true), repo: MARKED }));
});

test('every file the script names exists in distributed/, and the landing-gate caller is that file byte for byte as the check names it', () => {
  for (const f of callersFor({ registry: registry(true), repo: MARKED })) assert.ok(existsSync(new URL(`../distributed/${f}`, import.meta.url)), f);
  assert.match(readFileSync(new URL('../distributed/landing-gate.yml', import.meta.url), 'utf8'), /landing-gate-check\.yml@main/);
});

test('the command line prints one file name per line, and nothing when none is copied', () => {
  const dir = mkdtempSync(join(tmpdir(), 'callers-'));
  const file = join(dir, 'registry.json');
  const run = (r, repo) => { writeFileSync(file, JSON.stringify(r)); return execFileSync('node', [new URL('../scripts/caller-workflows.mjs', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), '--registry', file, '--repo', repo], { encoding: 'utf8' }); };
  assert.equal(run(registry(true), MARKED), 'pr-names-issue.yml\nlanding-gate.yml\n');
  assert.equal(run(registry(false), MARKED), '');
});

test('the registry documents the key in its header comment, beside the other keys, and marks no repository itself', () => {
  const text = readFileSync(new URL('../.github/claude-rules-overrides.yml', import.meta.url), 'utf8');
  const header = text.split('distribute-caller-workflows:')[0];
  assert.match(header, /#\s+landing-gate: true/);
  assert.ok(!/^\s{2}NXD-Solutions\/[^\n]*:\n(\s{4}[^\n]*\n)*\s{4}landing-gate:/m.test(text.replace(/^#.*$/gm, '')), 'no repository is marked by this build');
});
