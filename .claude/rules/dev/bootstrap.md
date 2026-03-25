# Bootstrap Invariant

Every verifiable script declared in `package.json` must pass after `git clone` + `npm install` + documented env setup. Verifiable scripts complete and return an exit code (`build`, `lint`, `test`, `typecheck`). A verifiable script that has never successfully run must not exist.
