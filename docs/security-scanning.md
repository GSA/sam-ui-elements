# Security scanning

This repository publishes **raw TypeScript/SCSS source** (`src/ui-kit`,
`src/formly`) — the consumer's own Angular build compiles it, so there is no
standalone published runtime surface to scan. `test-app` doubles as the
Playwright render-harness described in `AGENTS.md` and is the nearest thing to
a runtime surface this repo has, so it is also the DAST target. The `Security`
GitHub Actions workflow complements Dependabot's dependency-update coverage
with static and dynamic application security testing. Dependabot remains
complementary and is not replaced. The workflow runs on every pull request,
every push to `master`, and manual dispatches.

## Gates

- **Analyze (`javascript-typescript`)** and **Analyze (`actions`)** are
  provided by the repository's CodeQL **default setup** (repository
  **Settings > Code security > Code scanning**). It is managed by GitHub, not
  by a committed workflow — do **not** add a committed CodeQL workflow here:
  advanced configuration and default setup cannot run simultaneously, and
  doing so causes the workflow to fail at startup. Code scanning merge
  protection should block pull requests that introduce a new medium- or
  high-severity alert (see "Required status checks" below).
- **DAST (medium/high gate)** builds `test-app` in production mode and serves
  it via `scripts/serve-security-scan.mjs` with representative production
  security headers, then runs the OWASP ZAP baseline scanner. A separate
  report parser (`scripts/check-zap-severity.mjs`) fails the job only for
  unexcepted alerts whose JSON `riskcode` is medium (`2`) or high (`3`);
  low-risk alerts remain visible in the retained `zap-report` artifact. ZAP's
  own rule actions do not decide the outcome (`fail_action: false`); our
  script's exit code does.

**Scope caveat:** `test-app` is internal render-harness tooling — the actual
published artifact is the raw `.ts`/`.scss` source the consumer compiles, and
has no runtime surface of its own to host and scan. This DAST scan is
defense-in-depth on the harness, not a control over the shipped source
directly, mirroring the same caveat recorded for the sibling
`sam-styles`/`ngx-uswds`/`ngx-uswds-icons` DAST scans (GSA/sam-styles#812,
GSA/ngx-uswds-icons#101, GSA/ngx-uswds#275).

## Initial baseline and triage

This was the first security scan run on this repository. Its first CI run
(#614) surfaced two findings that were triaged rather than fixed in that PR,
and baselined in `.zap/rules.tsv` with an owner, a triage issue, and an
expiry:

- **`10003` Vulnerable JS Library (High)** — flags `@angular/core` 19.2.25
  against GHSA-rgjc-h3x7-9mwg (CVE-2026-54267), an Angular client-hydration
  DOM-clobbering advisory. That advisory's exploit path requires
  `provideClientHydration()` (SSR); `test-app` is a pure client-rendered SPA
  with no `platform-server` and no hydration, so the vulnerable path is not
  reachable here. Fixing the underlying version is an Angular
  major/minor upgrade, tracked in #679 (and the broader #574/#562 upgrade
  work), not a CI-gate change.
- **`10055` CSP: style-src unsafe-inline (Medium)** — `test-app`'s Angular
  production build inlines critical CSS and per-component styles that
  require `style-src 'unsafe-inline'` to render on this Angular version; this
  is `test-app` toolchain behavior, not a property of the shipped
  `@gsa-sam/sam-ui-elements` library. Also tracked in #679, to revisit
  alongside the Angular upgrade (newer Angular supports nonce/hash-based
  inline styles).

Both exceptions are rule-wide (`*`) because they are properties of every
page `test-app` currently renders, not of a specific URL; each has a
2027-03-01 expiry and must be reviewed (renewed or removed) by then. Any
_new_ finding surfaced by a future CI run must be triaged the same way: fix
it in `test-app`/library markup where possible, and only add a reviewed
exception row if it cannot be addressed in the current hosting/toolchain
combination. ZAP's rule actions do **not** determine the gate: the JSON
report's risk codes do, so low-risk observations remain report-only while
unexcepted medium/high findings block immediately (new-code gate, not a red
wall — pre-existing findings are triaged/burned down, not blocking initial
rollout). CodeQL's pull-request comparison identifies findings introduced by
changed code; existing default-branch findings remain visible in Security →
Code scanning for separate triage rather than red-walling the rollout.

## Exception policy

For ZAP, use one tab-separated row per exception:

```text
rule-id<TAB>IGNORE<TAB>scope<TAB>issue-url<TAB>owner<TAB>expiry(YYYY-MM-DD)<TAB>rationale
```

The `scope` column is a **URL substring** the exception is limited to (the
narrowest available scope), or a literal `*` for a rule-wide exception that
must be explicitly justified. Matching on plugin id plus scope means a
baseline row suppresses only the reviewed instance(s) of a finding, not every
current and future instance of that ZAP rule across all URLs — preserving the
new-code gate.

The policy validator (`scripts/validate-security-workflow.mjs`, run via
`npm run validate:security-workflow`) rejects malformed rows, rows missing a
scope, and rows whose expiry is not a real calendar date or is in the past.
Every exception must be reviewed in a pull request and include:

1. the scanner rule or alert identifier;
2. the narrowest URL scope it applies to (or `*` with justification);
3. a link to its triage or remediation issue;
4. the technical rationale for accepting or suppressing it; and
5. an owner and an expiry date.

Expired exceptions must be removed or explicitly renewed through review.
Never lower the workflow threshold or broadly ignore medium/high findings to
make CI pass.

## Required status checks (admin-owned)

Branch protection, required status checks, and CodeQL new-alert merge
protection are **admin-owned settings** and cannot be applied by this
repository change alone — this account does not have `admin` on
`GSA/sam-ui-elements`. Repository administrators (or DevSecOps) must add these
required status checks to the `master` branch protection or ruleset:

- `Analyze (javascript-typescript)`
- `Analyze (actions)`
- `DAST (medium/high gate)`

They must also enable the GitHub ruleset option **Code scanning results →
Require code scanning results**, selecting CodeQL and the threshold that
blocks new medium-or-higher alerts.

## Local validation

Run the policy validator whenever the security workflow, baseline, or this
document changes:

```sh
npm run validate:security-workflow
```

The severity gate and server also have their own tests:

```sh
node --test scripts/check-zap-severity.test.mjs
node --test scripts/serve-security-scan.test.mjs
node --test scripts/validate-security-workflow.test.mjs
```

The actual CodeQL and ZAP scans run in GitHub Actions. Download `zap-report`
from a workflow run to inspect DAST evidence.
