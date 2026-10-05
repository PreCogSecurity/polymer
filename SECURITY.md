# Security Policy

## Scope

This repository is a fork of Polymer 1.x, a browser-side Web Components
library. It ships HTML and JavaScript that run in the consumer's browser
context, plus a release build toolchain (`gulpfile.js`, `util/`).

Threat model notes that matter when reviewing this code:

- There is no server, no authentication layer, and no database. Access control
  and credential handling are the responsibility of the application that
  consumes Polymer.
- The library runs with the same privileges as the page that imports it. Any
  injection sink reached through element properties (`innerHTML`,
  `outerHTML`, `dom-if`/`dom-repeat` bindings driven by untrusted data) is
  inherited from the platform `innerHTML` semantics. Callers must not feed
  untrusted strings into markup sinks.
- The release toolchain parses and re-serializes trusted, first-party HTML at
  build time. It is not exposed to end-user input, but it does fail on
  malformed input, so its error handling is covered by unit tests.

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.4.x   | Yes       |
| < 1.4   | No        |

## Reporting a vulnerability

Please report suspected vulnerabilities privately rather than opening a public
issue. Include the affected file, a reproduction, and the impact you observed.

Expect an acknowledgement within 3 business days and a remediation plan within
10 business days. We will credit reporters in the changelog unless you prefer
otherwise.

## Dependency advisories

`npm audit` runs in CI (`.github/workflows/ci.yml`) and Dependabot tracks the
npm and bower ecosystems weekly (`.github/dependabot.yml`). The published
library has no runtime dependencies; everything is a devDependency.

The 2016-era toolchain (gulp 3, web-component-tester 4) carries known
advisories that cannot be cleared without a major toolchain migration. The
audit step therefore reports rather than blocks; it should be flipped to
blocking once that migration lands.

## Hardening already in place

- `npm ci` from a committed `package-lock.json` in CI, so builds cannot
  silently resolve a different dependency tree.
- Dependency install scripts are disabled in the blocking CI jobs and in the
  Dockerfile (`--ignore-scripts`) to limit install-time code execution. The
  lint and unit-test paths are pure JavaScript and need none of them; the only
  packages in the tree that do have install scripts belong to the optional
  browser harness, which is why that workflow leaves them enabled.
- Every git dependency in the lockfile resolves over anonymous HTTPS at a
  pinned commit SHA. No install step needs an SSH identity, so CI never
  handles a deploy key or an `ssh-agent`, and no workflow can be broken by a
  developer's SSH configuration.
- Workflows run on a pinned runner image (`ubuntu-24.04`) rather than the
  floating `ubuntu-latest` label, so a runner-image migration cannot change
  what CI executes underneath a green check.
- Third-party actions are pinned to immutable commit SHAs instead of mutable
  tags, so a repointed tag cannot run unreviewed code with the workflow's
  credentials. Dependabot's `github-actions` ecosystem is what moves them.
- Workflow permissions are `contents: read`, jobs carry a `timeout-minutes`
  budget so a hung step cannot pin a runner for 6 hours, and superseded runs
  are cancelled rather than queued.
- Container builds run as the non-root `node` user.
- No credentials, tokens, or `.env` files are committed; `.gitignore` blocks
  them, and the obsolete Travis configuration that held encrypted Sauce Labs
  credentials has been removed.
