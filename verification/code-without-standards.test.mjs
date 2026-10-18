import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isCode, decide, plan, apply, boardIds, run, readTree, listOpenReports, reportTitle, reportBody,
  EXEMPTION_KEY, STANDARDS_DOMAIN, REPORT_LABEL,
} from '../scripts/code-without-standards.mjs';

// The promise (NXD-Solutions/dna#1387), one test per guarantee. No real gh call anywhere in this suite.

test('code is a file a machine executes or builds, or builds into something it runs, or a CI workflow', () => {
  for (const p of [
    'src/index.ts', 'scripts/run.sh', 'a/b/tool.py', 'server.mjs', '.github/workflows/test.yml', '.github/workflows/x.yaml',
    // What provisions or builds something that runs.
    'infra/bicep/main.bicep', 'infra/main.tf', 'Makefile', 'services/x/Dockerfile', 'Dockerfile.prod',
  ]) {
    assert.equal(isCode(p), true, p);
  }
});

test('documents, reports, data, configuration, the distributed copy and build output are not code', () => {
  for (const p of [
    'README.md', 'reports/week-42.html', 'data/people.json', 'config/app.yml', 'package.json',
    'docker-compose.yml', 'infra/terraform.tfvars', 'Dockerfile.md',
    '.github/PULL_REQUEST_TEMPLATE.md', '.claude/scripts/sync/merge-and-advise.sh', '.claude/commands/dna/sync.md',
    'node_modules/x/index.js', 'dist/index.js', 'types/index.d.ts', 'vendor/lib.js', 'workflows/test.yml',
  ]) {
    assert.equal(isCode(p), false, p);
  }
});

test('a repo is named when it holds code and is not subscribed to the dev standards', () => {
  const d = decide({ repo: 'o/app', paths: ['README.md', 'src/main.ts'], override: undefined });
  assert.deepEqual(d, { repo: 'o/app', status: 'named', example: 'src/main.ts', truncated: false });
});

test('a repo that holds only infrastructure code is named too', () => {
  assert.equal(decide({ repo: 'o/infra', paths: ['README.md', 'infra/bicep/main.bicep'], override: undefined }).status, 'named');
});

test('a repo that holds no code is never named, subscribed or not', () => {
  // Manager-Assistant-Plan's shape: HTML reports, and scripts only in the DNA's distributed copy.
  const paths = ['index.html', 'reports/a.html', '.claude/scripts/sync/x.mjs', 'README.md'];
  assert.equal(decide({ repo: 'o/plan', paths, override: undefined }).status, 'no-code');
  assert.equal(decide({ repo: 'o/empty', paths: [], override: undefined }).status, 'no-code');
  assert.equal(decide({ repo: 'o/plan', paths, override: { domains: [STANDARDS_DOMAIN] } }).status, 'no-code');
});

test('a repo subscribed to the dev standards is not named', () => {
  const d = decide({ repo: 'o/app', paths: ['src/main.ts'], override: { domains: ['security', STANDARDS_DOMAIN] } });
  assert.equal(d.status, 'subscribed');
});

test('a repo receives the dev standards when it builds or consumes enterprise-architecture, by either key name', () => {
  for (const override of [
    { builds: [STANDARDS_DOMAIN] },
    { consumes: [STANDARDS_DOMAIN], builds: [] },
    { domains: [STANDARDS_DOMAIN] },
  ]) {
    assert.equal(decide({ repo: 'o/app', paths: ['src/main.ts'], override }).status, 'subscribed', JSON.stringify(override));
  }
});

test('a repo that only knows of enterprise-architecture, or declares nothing about it, is named', () => {
  for (const override of [{ builds: ['security'], consumes: ['compliance'] }, { builds: [], consumes: [] }, undefined]) {
    assert.equal(decide({ repo: 'o/app', paths: ['src/main.ts'], override }).status, 'named', JSON.stringify(override));
  }
});

test('an excluded repo receives nothing, whatever it declares', () => {
  const d = decide({ repo: 'o/x', paths: ['a.mjs'], override: { exclude: true, consumes: [STANDARDS_DOMAIN] } });
  assert.equal(d.status, 'named');
});

test('an exclusion from the distribution is not an exemption: an excluded repo that holds code is named', () => {
  const d = decide({ repo: 'o/.github', paths: ['scripts/a.mjs'], override: { exclude: true } });
  assert.equal(d.status, 'named');
});

test('an exemption clears the repo, and only with its reason', () => {
  const paths = ['src/main.ts'];
  assert.deepEqual(
    decide({ repo: 'o/app', paths, override: { [EXEMPTION_KEY]: 'a generated mirror; Peter, 2026-10-18' } }),
    { repo: 'o/app', status: 'exempt', reason: 'a generated mirror; Peter, 2026-10-18' },
  );
  for (const reason of ['', '   ', undefined, true, 42]) {
    assert.equal(decide({ repo: 'o/app', paths, override: { [EXEMPTION_KEY]: reason } }).status, 'named', String(reason));
  }
});

test('a file list GitHub cut short counts as holding code, since no-code cannot be shown', () => {
  const d = decide({ repo: 'o/big', paths: ['README.md'], truncated: true, override: undefined });
  assert.deepEqual(d, { repo: 'o/big', status: 'named', example: null, truncated: true });
  assert.equal(decide({ repo: 'o/big', paths: [], truncated: true, override: { domains: [STANDARDS_DOMAIN] } }).status, 'subscribed');
});

test('a repo stays named: an open report is kept, never duplicated and never closed while the repo is named', () => {
  const decisions = [decide({ repo: 'o/app', paths: ['src/main.ts'], override: undefined })];
  assert.deepEqual(plan({ decisions, openReports: { 'o/app': 12 } }), []);
  const first = plan({ decisions, openReports: {} });
  assert.equal(first.length, 1);
  assert.equal(first[0].type, 'open');
  assert.equal(first[0].title, reportTitle('o/app'));
});

test('a report is closed once the repo is subscribed, holds no code, or is exempt, and the comment names the exit', () => {
  const decisions = [
    decide({ repo: 'o/a', paths: ['x.ts'], override: { domains: [STANDARDS_DOMAIN] } }),
    decide({ repo: 'o/b', paths: ['x.html'], override: undefined }),
    decide({ repo: 'o/c', paths: ['x.ts'], override: { [EXEMPTION_KEY]: 'why' } }),
  ];
  const actions = plan({ decisions, openReports: { 'o/a': 1, 'o/b': 2, 'o/c': 3 } });
  assert.deepEqual(actions.map((a) => [a.type, a.number]), [['close', 1], ['close', 2], ['close', 3]]);
  assert.match(actions[0].comment, /receives/);
  assert.match(actions[1].comment, /no code/);
  assert.match(actions[2].comment, /Reason: why/);
});

test('a report follows the issue layout, and says it is a report, not work to build', () => {
  const body = reportBody({ repo: 'o/app', example: 'src/main.ts', truncated: false });
  const order = ['**From session:**', '**The need:**', '## Context', '## What must hold', '**No invariant yet:**', '## Metadata'];
  const at = order.map((h) => body.indexOf(h));
  assert.ok(at.every((i) => i >= 0), 'every part is present');
  assert.deepEqual([...at].sort((a, b) => a - b), at, 'in the layout order');
  assert.match(body, /src\/main\.ts/);
});

// The board, as the hub reads it: Status Proposed, never Ready; label; type Task.
const BOARD = { projectId: 'PVT_1', statusFieldId: 'PVTSSF_1', proposedOptionId: 'opt-proposed' };

function recordingGh({ failOn } = {}) {
  const calls = [];
  const gh = (args) => {
    calls.push(args);
    if (failOn && failOn(args)) throw new Error(`gh ${args[0]} ${args[1]} failed: nope`);
    if (args[0] === 'issue' && args[1] === 'create') return 'https://github.com/o/.github/issues/7\n';
    if (args[0] === 'project' && args[1] === 'item-add') return 'PVTI_9\n';
    return '';
  };
  return { gh, calls };
}

const OPEN = [{ type: 'open', repo: 'o/app', title: reportTitle('o/app'), body: 'b' }];
const CLOSE = [{ type: 'close', repo: 'o/old', number: 3, comment: 'c' }];
const CONTEXT = { issuesRepo: 'o/.github', owner: 'o', boardNumber: 1, board: BOARD };

test('a report is a Task, labelled dev-standards-report, on the NXD Work Board with Status Proposed, never Ready', () => {
  const { gh, calls } = recordingGh();
  const done = apply(OPEN, { gh, ...CONTEXT });
  const create = calls.find((c) => c[0] === 'issue' && c[1] === 'create');
  assert.deepEqual(create.slice(create.indexOf('--label')), ['--label', REPORT_LABEL]);
  assert.ok(calls.some((c) => c[0] === 'label' && c[1] === 'create' && c.includes(REPORT_LABEL)), 'the label exists');
  assert.deepEqual(
    calls.find((c) => c[0] === 'api'),
    ['api', 'repos/o/.github/issues/7', '-X', 'PATCH', '-f', 'type=Task'],
  );
  assert.deepEqual(calls.find((c) => c[1] === 'item-add').slice(0, 7), ['project', 'item-add', '1', '--owner', 'o', '--url', 'https://github.com/o/.github/issues/7']);
  assert.deepEqual(
    calls.find((c) => c[1] === 'item-edit'),
    ['project', 'item-edit', '--id', 'PVTI_9', '--project-id', 'PVT_1', '--field-id', 'PVTSSF_1', '--single-select-option-id', 'opt-proposed'],
  );
  assert.deepEqual(done, ['opened https://github.com/o/.github/issues/7']);
});

test('the report only informs: carrying out the actions touches only issues, a label and the board', () => {
  const { gh, calls } = recordingGh();
  apply([...OPEN, ...CLOSE], { gh, ...CONTEXT });
  const kinds = new Set(calls.map((c) => `${c[0]} ${c[1]}`));
  assert.deepEqual([...kinds].sort(), ['api repos/o/.github/issues/7', 'issue close', 'issue create', 'label create', 'project item-add', 'project item-edit']);
});

test('a report that cannot be set up on the board is closed again, and the failure is loud', () => {
  for (const failing of ['api', 'item-add', 'item-edit']) {
    const { gh, calls } = recordingGh({ failOn: (a) => a[0] === failing || a[1] === failing });
    assert.throws(() => apply(OPEN, { gh, ...CONTEXT }), /nope/, failing);
    const close = calls.find((c) => c[0] === 'issue' && c[1] === 'close');
    assert.equal(close?.[2], '7', `${failing}: the new issue is closed`);
  }
});

test('a failing gh call before anything exists is loud and nothing carries on', () => {
  const { gh, calls } = recordingGh({ failOn: (a) => a[0] === 'issue' && a[1] === 'create' });
  assert.throws(() => apply(OPEN, { gh, ...CONTEXT }), /nope/);
  assert.equal(calls.some((c) => c[0] === 'project'), false);
});

test('the board ids are read from the board, and a board without a Proposed status is refused', () => {
  const gh = (args) => {
    if (args[1] === 'view') return 'PVT_1\n';
    return JSON.stringify({ fields: [{ id: 'F0', name: 'Title' }, { id: 'F1', name: 'Status', options: [{ id: 'o1', name: 'Proposed' }, { id: 'o2', name: 'Ready' }] }] });
  };
  assert.deepEqual(boardIds(gh, 'o', 1), { projectId: 'PVT_1', statusFieldId: 'F1', proposedOptionId: 'o1' });
  const without = (args) => (args[1] === 'view' ? 'PVT_1' : JSON.stringify({ fields: [{ id: 'F1', name: 'Status', options: [{ id: 'o2', name: 'Ready' }] }] }));
  assert.throws(() => boardIds(without, 'o', 1), /Proposed/);
});

test('a list of open issues cut at the limit is refused, since it could hide an open report', () => {
  const issues = Array.from({ length: 200 }, (_, i) => ({ number: i + 1, title: 'unrelated' }));
  assert.throws(() => listOpenReports(() => JSON.stringify(issues), 'o/.github'), /cannot all be read/);
  assert.deepEqual(listOpenReports(() => JSON.stringify([{ number: 4, title: reportTitle('o/app') }]), 'o/.github'), { 'o/app': 4 });
});

test('an empty repo has no files and no code', () => {
  const gh = () => { throw new Error('gh api repos/o/new/git/trees/HEAD failed: Git Repository is empty.'); };
  assert.deepEqual(readTree(gh, 'o/new'), { paths: [], truncated: false });
});

// One organisation, end to end, against a fake gh.
function fakeOrg() {
  const trees = {
    'o/app': ['src/main.ts', 'README.md'],
    'o/plan': ['index.html', '.claude/scripts/x.mjs'],
    'o/lib': ['index.ts'],
    'o/mirror': ['gen.py'],
    'o/.github': ['scripts/a.mjs', '.github/workflows/d.yml'],
    'o/infra': ['bicep/main.bicep'],
  };
  const calls = [];
  const gh = (args) => {
    calls.push(args);
    const [a, b] = args;
    if (a === 'api' && b === 'orgs/o/repos') return Object.keys(trees).join('\n');
    if (a === 'api' && b.startsWith('repos/') && b.includes('/git/trees/')) {
      const repo = b.replace('repos/', '').replace('/git/trees/HEAD?recursive=1', '');
      return JSON.stringify({ truncated: false, tree: trees[repo].map((path) => ({ type: 'blob', path })) });
    }
    if (a === 'issue' && b === 'list') return JSON.stringify([{ number: 5, title: reportTitle('o/lib') }, { number: 6, title: 'unrelated' }]);
    if (a === 'issue' && b === 'create') return 'https://github.com/o/.github/issues/9';
    if (a === 'project' && b === 'view') return 'PVT_1';
    if (a === 'project' && b === 'field-list') return JSON.stringify({ fields: [{ id: 'F1', name: 'Status', options: [{ id: 'o1', name: 'Proposed' }] }] });
    if (a === 'project' && b === 'item-add') return 'PVTI_1';
    return '';
  };
  return { gh, calls };
}

const registry = {
  overrides: {
    'o/lib': { domains: [STANDARDS_DOMAIN] },
    'o/mirror': { [EXEMPTION_KEY]: 'generated mirror' },
    'o/.github': { exclude: true },
  },
};

test('over a whole organisation: names the unsubscribed coders, clears the rest, closes a report no longer due', () => {
  const { gh, calls } = fakeOrg();
  const r = run({ gh, owner: 'o', issuesRepo: 'o/.github', boardNumber: 1, registry, dryRun: false });
  assert.deepEqual(
    Object.fromEntries(r.decisions.map((d) => [d.repo, d.status])),
    { 'o/app': 'named', 'o/plan': 'no-code', 'o/lib': 'subscribed', 'o/mirror': 'exempt', 'o/.github': 'named', 'o/infra': 'named' },
  );
  assert.deepEqual(r.actions.map((a) => `${a.type} ${a.repo}`), ['open o/app', 'close o/lib', 'open o/.github', 'open o/infra']);
  assert.equal(calls.filter((c) => c[0] === 'issue' && c[1] === 'create').length, 3);
});

test('a dry run reports what it would do and calls nothing that writes', () => {
  const { gh, calls } = fakeOrg();
  const r = run({ gh, owner: 'o', issuesRepo: 'o/.github', boardNumber: 1, registry, dryRun: true });
  assert.deepEqual(r.done, ['would open o/app', 'would close o/lib', 'would open o/.github', 'would open o/infra']);
  assert.equal(calls.some((c) => (c[0] === 'issue' && c[1] !== 'list') || c[0] === 'project' || c[0] === 'label'), false);
});
