import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { main, parseReport, alreadyListed, MARKER } from '../scripts/post-answered-decisions.mjs';
import { readHubIssues, readPrincipal, readTierProject, hubFor, readHubs } from '../scripts/org-config.mjs';

// The promise: NXD-Solutions/.github#409, the hourly report. Invariant: within the hour of a decision maker ticking
// a Decision Request's answer box, the hub of that decision maker has it listed on its standing issue. One test per
// guarantee; fixtures and a recording stand-in for GitHub only. The run of the workflow verifies the real posting.

const CONFIG = `| Manifest Steward — the apex | Peter P |
- **Hub:** Peter P (@peter) — a session
- **Hub:** Dana D (@dana) — a session
- **Hub issue:** Peter P — Org/Plan#339
`;
const REPORT = `Hub: Peter P — 3 waiting on Peter P, 2 answered awaiting the hub
- Org/secret-repo#12 — Choose the vendor for payroll
- Org/other#4 — Keep the draft key (no hub: unassigned)

Hub: Dana D — 1 waiting on Dana D, 1 answered awaiting the hub
- Org/ux#7 — Pick the card layout
`;

function args(report = REPORT, config = CONFIG) {
  const dir = mkdtempSync(join(tmpdir(), 'answered-test-'));
  writeFileSync(join(dir, 'report.txt'), report);
  writeFileSync(join(dir, 'org.config.md'), config);
  return ['--report', join(dir, 'report.txt'), '--config', join(dir, 'org.config.md')];
}
function stand_in(existing = []) {
  const posts = [];
  return { posts, deps: { comments: () => existing, post: (issue, body) => posts.push({ issue, body }) } };
}

test('Per hub: each hub\'s answered requests are posted as one comment on the issue its Hub issue line names', () => {
  const s = stand_in();
  assert.equal(main(args(), s.deps, () => {}), 0);
  assert.deepEqual(s.posts, [{
    issue: { repo: 'Org/Plan', number: 339 },
    body: `${MARKER}\n\nHub: Peter P — 3 waiting on Peter P, 2 answered awaiting the hub\n- Org/secret-repo#12 — Choose the vendor for payroll\n- Org/other#4 — Keep the draft key (no hub: unassigned)`,
  }]);
});

test('Said once: a request already listed on the hub issue is left out, and nothing is posted when nothing is new', () => {
  const earlier = `${MARKER}\n\nHub: Peter P — …\n- Org/secret-repo#12 — Choose the vendor for payroll`;
  const s = stand_in([earlier, 'an unrelated comment naming\n- Org/other#4 — but not posted by this job']);
  main(args(), s.deps, () => {});
  assert.equal(s.posts.length, 1);
  assert.doesNotMatch(s.posts[0].body, /secret-repo#12/);
  assert.match(s.posts[0].body, /Org\/other#4/);

  const all = stand_in([`${MARKER}\n\n- Org/secret-repo#12 — x\n- Org/other#4 — y`]);
  main(args(), all.deps, () => {});
  assert.equal(all.posts.length, 0);
});

test('Said once: a late or skipped run loses nothing, since what is posted depends only on what the issue already lists', () => {
  assert.deepEqual([...alreadyListed([`${MARKER}\n\n- Org/a#1 — t`, `not ours\n- Org/b#2 — t`])], ['Org/a#1']);
});

test('A hub with no Hub issue line gets no report, and the run says so by name', () => {
  const logs = [];
  const s = stand_in();
  main(args(), s.deps, (l) => logs.push(l));
  assert.ok(logs.includes('::warning::Dana D has answered Decision Requests but no **Hub issue:** line: not reported'));
  assert.equal(s.posts.some((p) => p.body.includes('Org/ux#7')), false);
});

test('Reports only: it posts comments and does nothing else to any issue', () => {
  const source = readFileSync(new URL('../scripts/post-answered-decisions.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /'(close|edit|reopen|label|lock|transfer)'|state=|labels/);
});

test('The log names no issue: no title, body, repo or number reaches it, in a real run or a dry run', () => {
  for (const extra of [[], ['--dry-run']]) {
    const logs = [];
    main([...args(), ...extra], stand_in().deps, (l) => logs.push(l));
    const log = logs.join('\n');
    assert.ok(log.length > 0);
    assert.doesNotMatch(log, /#\d|Org\/|vendor|payroll|draft key|card layout/);
  }
});

test('The log names no issue when GitHub fails either', () => {
  const logs = [];
  const failing = { comments: () => { throw Object.assign(new Error('gh: Org/secret-repo#12 Choose the vendor'), { gh: true }); }, post: () => {} };
  assert.equal(main(args(), failing, (l) => logs.push(l)), 6);
  assert.doesNotMatch(logs.join('\n'), /#\d|Org\/|vendor/);
});

test('The report is read by its blocks: each item stays with the hub above it', () => {
  const blocks = parseReport(REPORT);
  assert.deepEqual([...blocks.keys()], ['Peter P', 'Dana D']);
  assert.deepEqual(blocks.get('Dana D').items.map((i) => i.ref), ['Org/ux#7']);
});

test('The role configuration\'s lines are read as stated: hub issues, the principal, a tier project, and where a login reports', () => {
  assert.deepEqual(readHubIssues(CONFIG).get('Peter P'), { repo: 'Org/Plan', number: 339 });
  assert.equal(readPrincipal(CONFIG), 'Peter P');
  assert.equal(readTierProject('- **Tier project:** Priority — #7\n', 'Priority'), 7);
  assert.equal(readTierProject('- **Tier project:** Critical — #6\n', 'Priority'), null);
  const hubs = readHubs(CONFIG);
  assert.equal(hubFor('Dana', hubs, 'Peter P'), 'Dana D');
  assert.equal(hubFor('stranger', hubs, 'Peter P'), 'Peter P');
  assert.equal(hubFor(null, hubs, 'Nobody'), null);
});

test('Hourly: the workflow runs every hour, reads the script and the role configuration from the DNA\'s main, and keeps the report out of the log', () => {
  const wf = readFileSync(new URL('../.github/workflows/answered-decisions.yml', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.match(wf, /schedule:\n\s+- cron: '\d+ \* \* \* \*'/);
  assert.match(wf, /repository: NXD-Solutions\/dna\n\s+ref: main/);
  assert.match(wf, /answered-decisions\.mjs --org NXD-Solutions --hubs [^\n]*org\.config\.md > "\$RUNNER_TEMP\/report\.txt"/);
  assert.doesNotMatch(wf, /--since/);
  assert.doesNotMatch(wf, /cat "\$RUNNER_TEMP\/report\.txt"|GITHUB_STEP_SUMMARY/);
  assert.doesNotMatch(wf, /pull_request/);
});
