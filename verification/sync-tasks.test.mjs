import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { main, plan, weeksBehind, missedComment, DEPRECATED_COMMENT, HUB_MARKER } from '../scripts/sync-tasks.mjs';

// The promise: NXD-Solutions/.github#409. Invariant: each Monday, every repo that receives the DNA has its one sync
// task open and Ready, and nothing starts a sync on a team's behalf. One test per guarantee; fixtures and a recording
// stand-in for GitHub only, no call to GitHub anywhere in this suite. What the job does to real issues and the real
// project is verified by a run of the workflow.

const CONFIG = `| Manifest Steward — the apex | Peter P |
- **Hub:** Peter P (@peter) — a session
- **Hub:** Dana D (@dana) — a session
- **Hub issue:** Peter P — Org/Plan#339
- **Tier project:** Critical — #6
- **Tier project:** Priority — #7
`;
const NOW = new Date('2026-11-16T06:00:00Z');
const task = (repo, number, state, assignees = ['peter'], createdAt = '2026-11-09T06:00:00Z') => ({ id: `I_${repo}_${number}`, repo, number, state, assignees, createdAt });

function files(subscribers, config = CONFIG) {
  const dir = mkdtempSync(join(tmpdir(), 'sync-tasks-test-'));
  writeFileSync(join(dir, 'subs.json'), JSON.stringify(subscribers));
  writeFileSync(join(dir, 'org.config.md'), config);
  return ['--subscribers', join(dir, 'subs.json'), '--config', join(dir, 'org.config.md')];
}

// Records every write. `status` answers the Ready check: by default an item reads Ready once set.
function stand_in(tasks, { reopened = {}, statusSeq = null } = {}) {
  const calls = [];
  const set = new Map();
  let reads = 0;
  return {
    calls,
    deps: {
      tasks: () => tasks,
      lastReopened: (t) => reopened[`${t.repo}#${t.number}`] ?? null,
      project: (n) => { calls.push(['project', n]); return { id: 'P7', fieldId: 'F', readyId: 'R' }; },
      reopen: (t) => calls.push(['reopen', `${t.repo}#${t.number}`]),
      close: (t) => calls.push(['close', `${t.repo}#${t.number}`]),
      comment: (repo, number, body) => calls.push(['comment', `${repo}#${number}`, body]),
      setReady: (p, t) => { calls.push(['ready', p.id, `${t.repo}#${t.number}`]); set.set(`item:${t.id}`, true); return `item:${t.id}`; },
      status: (item) => (statusSeq ? statusSeq[reads++] ?? 'Ready' : set.has(item) ? 'Ready' : 'Backlog'),
      sleep: async () => {},
      now: () => NOW,
    },
  };
}
const quiet = () => {};

test('Reopens: every closed sync task of a repo that receives the DNA is reopened, also in a week with no DNA change', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED'), task('Org/b', 2, 'CLOSED')]);
  assert.equal(await main(files(['Org/a', 'Org/b']), s.deps, quiet), 0);
  assert.deepEqual(s.calls.filter((c) => c[0] === 'reopen').map((c) => c[1]), ['Org/a#1', 'Org/b#2']);
});

test('Ready: a reopened task is set Ready on the project the Priority tier line names, and on no other project', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED')]);
  assert.equal(await main(files(['Org/a']), s.deps, quiet), 0);
  assert.deepEqual(s.calls.filter((c) => c[0] === 'project'), [['project', 7]]);
  assert.deepEqual(s.calls.filter((c) => c[0] === 'ready'), [['ready', 'P7', 'Org/a#1']]);
});

test('Ready: a reopened task the project automation moved back to Backlog is set Ready again', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED')], { statusSeq: ['Backlog', 'Ready'] });
  assert.equal(await main(files(['Org/a']), s.deps, quiet), 0);
  assert.equal(s.calls.filter((c) => c[0] === 'ready').length, 2);
});

test('Ready: a reopened task that never stays Ready fails the run', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED')], { statusSeq: ['Backlog', 'Backlog', 'Backlog'] });
  assert.equal(await main(files(['Org/a']), s.deps, quiet), 1);
});

test('Missed: a task already open stays open, is told how many weeks behind it is, and its hub is told', async () => {
  const s = stand_in([task('Org/a', 1, 'OPEN', ['peter'])], { reopened: { 'Org/a#1': '2026-11-02T06:00:00Z' } });
  assert.equal(await main(files(['Org/a']), s.deps, quiet), 0);
  assert.equal(s.calls.some((c) => c[0] === 'reopen' || c[0] === 'close'), false);
  assert.deepEqual(s.calls.find((c) => c[1] === 'Org/a#1'), ['comment', 'Org/a#1', missedComment(2)]);
  assert.equal(missedComment(2), '**Missed:** this sync task was still open at this Monday\'s run, 2 weeks behind the DNA. Run `/dna:sync`, then close it (NXD-Solutions/.github#409).');
  const hub = s.calls.find((c) => c[1] === 'Org/Plan#339');
  assert.equal(hub[2], `${HUB_MARKER}\n\n- Org/a#1 — still open, 2 weeks behind`);
});

test('Missed: weeks behind count from the last reopening, else the task\'s creation, never less than one', () => {
  assert.equal(weeksBehind('2026-11-09T06:00:00Z', NOW), 1);
  assert.equal(weeksBehind('2026-10-26T06:00:00Z', NOW), 3);
  assert.equal(weeksBehind('2026-11-15T06:00:00Z', NOW), 1);
});

test('Missed: an assignee whose hub has no issue line is not told, and the run says so without failing', async () => {
  const logs = [];
  const s = stand_in([task('Org/a', 1, 'OPEN', ['dana'])]);
  assert.equal(await main(files(['Org/a']), s.deps, (l) => logs.push(l)), 0);
  assert.equal(s.calls.some((c) => c[1] === 'Org/Plan#339'), false);
  assert.ok(logs.some((l) => l.startsWith('::warning::Dana D has no **Hub issue:** line')));
});

test('Missed: an unassigned task, or one whose assignee has no hub, is told to the principal\'s hub', () => {
  const p = plan({ tasks: [task('Org/a', 1, 'OPEN', []), task('Org/b', 2, 'OPEN', ['stranger'])], subscribers: ['Org/a', 'Org/b'], hubs: new Map([['peter', 'Peter P']]), principal: 'Peter P', lastOpened: () => '2026-11-09T06:00:00Z', now: NOW });
  assert.deepEqual([...p.tell.keys()], ['Peter P']);
  assert.equal(p.tell.get('Peter P').length, 2);
});

test('Complete: a repo that receives the DNA with no sync task, or with more than one, is reported to the principal\'s hub', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED'), task('Org/b', 2, 'CLOSED'), task('Org/b', 3, 'CLOSED')]);
  assert.equal(await main(files(['Org/a', 'Org/b', 'Org/c']), s.deps, quiet), 0);
  const body = s.calls.find((c) => c[1] === 'Org/Plan#339')[2];
  assert.match(body, /- Org\/c receives the DNA but has no sync task under NXD-Solutions\/dna#1892/);
  assert.match(body, /- Org\/b has more than one sync task under NXD-Solutions\/dna#1892/);
});

test('Complete: an open task whose repo no longer receives the DNA is marked deprecated and closed as not planned, never deleted', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED'), task('Org/gone', 9, 'OPEN')]);
  assert.equal(await main(files(['Org/a']), s.deps, quiet), 0);
  assert.deepEqual(s.calls.filter((c) => c[1] === 'Org/gone#9').map((c) => c[0]), ['comment', 'close']);
  assert.equal(s.calls.find((c) => c[1] === 'Org/gone#9')[2], DEPRECATED_COMMENT);
  assert.equal(s.calls.some((c) => c[0] === 'reopen' && c[1] === 'Org/gone#9'), false);
});

test('Complete: a closed task whose repo no longer receives the DNA is left as it is', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED'), task('Org/gone', 9, 'CLOSED')]);
  assert.equal(await main(files(['Org/a']), s.deps, quiet), 0);
  assert.equal(s.calls.some((c) => c[1] === 'Org/gone#9'), false);
});

test('No sync started: the script touches only issues, the hub issue and the Priority project', async () => {
  const s = stand_in([task('Org/a', 1, 'CLOSED'), task('Org/b', 2, 'OPEN')]);
  await main(files(['Org/a', 'Org/b', 'Org/c']), s.deps, quiet);
  assert.deepEqual([...new Set(s.calls.map((c) => c[0]))].sort(), ['comment', 'project', 'ready', 'reopen']);
});

test('No sync started: on the timer the distribution workflow runs this step and never its sync job', () => {
  const wf = readFileSync(new URL('../.github/workflows/distribute-claude-config.yml', import.meta.url), 'utf8');
  const block = (name) => {
    const start = wf.indexOf(`\n  ${name}:\n`);
    assert.notEqual(start, -1, `job ${name} exists`);
    const next = wf.slice(start + 1).search(/\n  [a-z-]+:\n/);
    return wf.slice(start, next === -1 ? undefined : start + 1 + next);
  };
  assert.match(wf, /schedule:\n\s+- cron: '0 6 \* \* 1'/);
  assert.match(block('sync'), /if: github\.event_name != 'schedule' && !inputs\.reopen-sync-tasks/);
  assert.match(block('reopen-sync-tasks'), /if: \(github\.event_name == 'schedule' \|\| inputs\.reopen-sync-tasks\) && inputs\.repo == ''/);
  assert.match(block('reopen-sync-tasks'), /node scripts\/sync-tasks\.mjs/);
});

test('A broken configuration fails loud instead of acting: no subscribers, no principal hub, no Priority line, no catalogue', async () => {
  const none = stand_in([task('Org/a', 1, 'CLOSED')]);
  assert.equal(await main(files([]), none.deps, quiet), 2);
  assert.equal(await main(files(['Org/a'], CONFIG.replace('| Peter P |', '| Someone Else |')), none.deps, quiet), 2);
  assert.equal(await main(files(['Org/a'], CONFIG.replace('- **Tier project:** Priority — #7\n', '')), none.deps, quiet), 2);
  assert.equal(await main(files(['Org/a']), stand_in([]).deps, quiet), 2);
  assert.equal(none.calls.length, 0);
});
