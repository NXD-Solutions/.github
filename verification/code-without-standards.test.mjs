import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isCode, decide, plan, apply, run, readTree, reportTitle, EXEMPTION_KEY, STANDARDS_DOMAIN,
} from '../scripts/code-without-standards.mjs';

// The promise (NXD-Solutions/dna#1387), one test per guarantee. No real gh call anywhere in this suite.

test('code is a file a machine executes or builds, or a CI workflow', () => {
  for (const p of ['src/index.ts', 'scripts/run.sh', 'a/b/tool.py', 'server.mjs', '.github/workflows/test.yml', '.github/workflows/x.yaml']) {
    assert.equal(isCode(p), true, p);
  }
});

test('documents, reports, data, configuration, the distributed copy and build output are not code', () => {
  for (const p of [
    'README.md', 'reports/week-42.html', 'data/people.json', 'config/app.yml', 'package.json',
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

test('a report is closed, with the reason, once the repo is subscribed, holds no code, or is exempt', () => {
  const decisions = [
    decide({ repo: 'o/a', paths: ['x.ts'], override: { domains: [STANDARDS_DOMAIN] } }),
    decide({ repo: 'o/b', paths: ['x.html'], override: undefined }),
    decide({ repo: 'o/c', paths: ['x.ts'], override: { [EXEMPTION_KEY]: 'why' } }),
  ];
  const actions = plan({ decisions, openReports: { 'o/a': 1, 'o/b': 2, 'o/c': 3 } });
  assert.deepEqual(actions.map((a) => [a.type, a.number]), [['close', 1], ['close', 2], ['close', 3]]);
  assert.match(actions[0].comment, /subscribes/);
  assert.match(actions[1].comment, /no code/);
  assert.match(actions[2].comment, /Reason: why/);
});

test('the report is an item on the NXD Work Board, and the report only informs: nothing but issues and the board is touched', () => {
  const calls = [];
  const gh = (args) => { calls.push(args); return args[0] === 'issue' && args[1] === 'create' ? 'https://github.com/o/.github/issues/7\n' : ''; };
  const actions = [
    { type: 'open', repo: 'o/app', title: reportTitle('o/app'), body: 'b' },
    { type: 'close', repo: 'o/old', number: 3, comment: 'c' },
  ];
  const done = apply(actions, { gh, issuesRepo: 'o/.github', boardNumber: 1, owner: 'o' });
  assert.deepEqual(calls.map((c) => c.slice(0, 2).join(' ')), ['issue create', 'project item-add', 'issue close']);
  assert.deepEqual(calls[1], ['project', 'item-add', '1', '--owner', 'o', '--url', 'https://github.com/o/.github/issues/7']);
  assert.deepEqual(done, ['opened https://github.com/o/.github/issues/7', 'closed #3 (o/old)']);
});

test('a failing gh call is loud: apply throws and does not carry on', () => {
  const gh = () => { throw new Error('gh issue create failed: 403'); };
  assert.throws(() => apply([{ type: 'open', repo: 'o/a', title: 't', body: 'b' }], { gh, issuesRepo: 'o/.github', boardNumber: 1, owner: 'o' }), /403/);
});

test('a report that cannot be added to the board is closed again and the failure is loud', () => {
  const calls = [];
  const gh = (args) => {
    calls.push(args);
    if (args[0] === 'issue' && args[1] === 'create') return 'https://github.com/o/.github/issues/8\n';
    if (args[0] === 'project') throw new Error('gh project item-add failed: missing scope');
    return '';
  };
  assert.throws(
    () => apply([{ type: 'open', repo: 'o/a', title: 't', body: 'b' }], { gh, issuesRepo: 'o/.github', boardNumber: 1, owner: 'o' }),
    /missing scope/,
  );
  const close = calls.find((c) => c[0] === 'issue' && c[1] === 'close');
  assert.equal(close[2], '8');
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
    { 'o/app': 'named', 'o/plan': 'no-code', 'o/lib': 'subscribed', 'o/mirror': 'exempt', 'o/.github': 'named' },
  );
  assert.deepEqual(r.actions.map((a) => `${a.type} ${a.repo}`), ['open o/app', 'close o/lib', 'open o/.github']);
  assert.equal(calls.filter((c) => c[0] === 'issue' && c[1] === 'create').length, 2);
});

test('a dry run reports what it would do and calls nothing that writes', () => {
  const { gh, calls } = fakeOrg();
  const r = run({ gh, owner: 'o', issuesRepo: 'o/.github', boardNumber: 1, registry, dryRun: true });
  assert.deepEqual(r.done, ['would open o/app', 'would close o/lib', 'would open o/.github']);
  assert.equal(calls.some((c) => (c[0] === 'issue' && c[1] !== 'list') || c[0] === 'project'), false);
});
