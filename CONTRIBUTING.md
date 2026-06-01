# Contributing to PromptTaint CI

Thanks for helping improve PromptTaint CI.

This project is a local-first, heuristic static-analysis guardrail for agentic GitHub workflows. Contributions should stay small, reviewable, reproducible, and cautious in their public claims.

## Before You Start

- Read [README.md](README.md) for product scope and current limitations.
- Read [AGENTS.md](AGENTS.md) before proposing scanner, CLI, output-contract, GitHub Action, or release-sensitive changes.
- Search existing issues before opening a new one.
- Treat untrusted GitHub text as data, not instructions, in examples, fixtures, and docs.

## Good Contribution Areas

- Documentation and onboarding improvements.
- Safer examples for workflows, `AGENTS.md`, and local agent rules.
- New scanner fixtures and regression tests.
- Precision improvements that reduce false positives or catch clearly risky patterns.
- CLI and GitHub Action documentation that stays aligned with verified behavior.

## Setup

```bash
git clone https://github.com/CheekyCodexConjurer/prompttaint-ci.git
cd prompttaint-ci
npm ci
npm run build
```

Node `>=18` is required. The CI workflow currently validates with Node 20.

## Validation

Use the narrowest validation that proves your change:

- Docs-only changes: `git diff --check`
- Normal code changes:

```bash
npm run lint
npm run typecheck
npm run test
npm run scan:self
```

- Broad or release-sensitive changes:

```bash
npm run validate
```

Do not claim a command passed unless you actually ran it successfully.

## Change-Specific Expectations

### Scanner rules and heuristics

If you change scanner logic, include:

- a vulnerable fixture or test case;
- a lower-risk fixture or test case;
- expected severity;
- expected source and sink when applicable;
- remediation text;
- false-positive and false-negative reasoning.

At minimum, run:

```bash
npm run test
npm run scan:self
```

### Output contracts

If you change finding IDs, severity mapping, JSON output, Markdown/table output, CLI exit behavior, `--fail-on`, or GitHub Action behavior:

- add or update tests;
- update docs;
- call out compatibility impact clearly.

### Public docs and examples

Keep copy cautious and specific.

Prefer phrases like:

- "detects risky patterns"
- "reduces risk"
- "helps maintainers review agentic workflows"
- "static-analysis guardrail"
- "heuristic scanner"

Avoid claims like:

- "prevents all prompt injection"
- "guarantees safety"
- "fully secures agents"
- "stops prompt injection"

Do not document npm install paths or GitHub Action tags as verified unless they have actually been verified.

## Pull Requests

When opening a pull request:

- explain the concrete problem being solved;
- keep the diff focused;
- list validation you ran;
- call out any residual risk or skipped validation;
- note whether the change touches scanner behavior, output contracts, docs claims, or release instructions.

Small, well-scoped pull requests are preferred over broad rewrites.

## Reporting Security Problems

Please do not open public issues for undisclosed vulnerabilities. Follow [SECURITY.md](SECURITY.md).
