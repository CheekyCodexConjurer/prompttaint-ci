# Agent Protocol: PromptTaint CI

## Scope

These instructions apply to the whole repository. PromptTaint CI is an open-source security-scanner project, so optimize for cautious claims, reproducible validation, small diffs, and no surprise git operations.

## Start-of-task gate

Before meaningful work, inspect:

```sh
git status --short
git branch --show-current
git rev-list --left-right --count origin/master...HEAD || git rev-list --left-right --count origin/main...HEAD
```

Treat uncommitted changes as user work. Do not stage, commit, push, reset, stash, rebase, merge, revert, switch branches, create worktrees, or discard files unless a human explicitly asks.

## Task execution policy

For non-trivial feature, fix, refactor, config, test, docs, scanner, output-contract, or release work, define objective, scope, non-goals, assumptions, affected files, acceptance criteria, validation, stop condition, and risks before editing.

Prefer the smallest robust change. Do not add speculative features, broad rewrites, unrelated cleanup, formatting churn, new dependencies, or product behavior changes that are not required by the task.

## Context and token budget protocol

Read only the files and sections needed for the task. Prefer exact paths, search results, and short summaries over pasting whole files into prompts or reports.

Avoid reading or summarizing `dist/`, `node_modules/`, lockfiles, generated artifacts, and entire docs folders unless the task specifically depends on them. Use targeted search first, then inspect the smallest relevant file section.

When using subagents, pass bounded questions and concrete file lists. Ask read-only agents for summaries, risks, and validation plans instead of broad repository dumps.

## Product mission

PromptTaint CI is an MIT-licensed TypeScript CLI and GitHub Action that detects risky prompt-injection paths in agentic GitHub workflows.

Use cautious language:

- Allowed: "detects risky patterns", "reduces risk", "helps maintainers review agentic workflows", "static-analysis guardrail", "heuristic scanner".
- Not allowed: "prevents all prompt injection", "guarantees safety", "fully secures agents", "stops prompt injection".

PromptTaint CI is a static-analysis guardrail, not a runtime security monitor or a substitute for a full security audit.

## Current architecture

- TypeScript CLI tool.
- GitHub Action wrapper.
- Vitest test suite.
- Biome formatting and linting.
- No backend, database, auth, dashboard, or cloud service.

## File map

| Path | Purpose |
| --- | --- |
| `src/` | TypeScript source code |
| `src/scanner/` | Detection logic, patterns, scanner types |
| `src/reporter/` | JSON, Markdown, and table output formatters |
| `src/cli.ts` | CLI parsing, scan/init command flow, exit behavior |
| `src/init.ts` | Local AI app policy generation |
| `test/` | Vitest tests and fixtures |
| `examples/` | Example workflow files |
| `docs/` | Public and maintainer documentation |
| `docs/agents/` | Agent routing and operating-system documentation |
| `.agents/skills/` | Repo-local agent skills |
| `.github/workflows/` | CI workflows for this repository |
| `action.yml` | GitHub Action metadata |
| `scripts/` | Release, package, and agent helper scripts |

## Skill routing

Use these repo-local skills when the trigger applies:

- `task-planning`: non-trivial feature, fix, refactor, config, test, docs, scanner, output, action, or release work. Path: `.agents/skills/task-planning/SKILL.md`.
- `subagent-orchestration`: non-trivial work needing mapping, implementation, validation, review, checkpoints, or fan-out. Path: `.agents/skills/subagent-orchestration/SKILL.md`.
- `security-rule-design`: scanner rules, tainted sources, prompt sinks, agent keywords, dangerous permissions, secrets detection, severity, remediation, or heuristics. Path: `.agents/skills/security-rule-design/SKILL.md`.
- `scanner-fixture-safety`: test fixtures, example workflows, and minimal scanner examples. Path: `.agents/skills/scanner-fixture-safety/SKILL.md`.
- `output-contract-guard`: JSON, Markdown, table output, finding schema, CLI exit codes, `--fail-on`, or GitHub Action output behavior. Path: `.agents/skills/output-contract-guard/SKILL.md`.
- `command-guard`: meaningful shell commands, especially build, validation, release, or git commands. Path: `.agents/skills/command-guard/SKILL.md`.
- `final-safety-guard`: read-only final review after implementation and validation before handoff, commit, or push. Path: `.agents/skills/final-safety-guard/SKILL.md`.
- `release-guard`: npm package, versioning, GitHub Action tag, release notes, README install instructions, package files, or publishing workflow. Path: `.agents/skills/release-guard/SKILL.md`.
- `open-source-maintainer`: README, CONTRIBUTING, issue templates, labels, examples, onboarding, and public-facing docs. Path: `.agents/skills/open-source-maintainer/SKILL.md`.
- `static-structural-search`: syntax-aware search for TypeScript, TSX, or JavaScript patterns when available. Path: `.agents/skills/static-structural-search/SKILL.md`.
- `serena`: local settings, environment variables, memories, or local conventions for the Serena agent. Path: `.agents/skills/serena/SKILL.md`.
- `opengrapth`: semantic representation, graph-based code understanding, or dependency tracing rules for the OpenGrapth agent. Path: `.agents/skills/opengrapth/SKILL.md`.


## Subagent policy

Subagents are quality tools, not token-saving tools. Use them for non-trivial work when they improve mapping, review depth, validation planning, or risk control.

Use exactly one write-capable implementer in the current working tree. Exploration, review, validation planning, checkpoints, and final guard agents are read-only. Parallel write experiments require explicit human approval and separate worktrees.

See `docs/agents/SUBAGENT_ROUTING.md` for route classes, agent roles, checkpoint triggers, xHigh triggers, prompt examples, and route cards.

## Security rule gate

For scanner rule changes, require:

- vulnerable fixture or test case;
- safe fixture or test case;
- expected severity;
- expected source and sink when applicable;
- remediation text;
- false-positive and false-negative reasoning;
- validation with `npm run test` and, when relevant, `npm run scan:self`.

Do not add broad keyword-only detections without tests and a clear reason. Do not weaken existing detection unless explicitly requested and proven by tests.

## Scanner rule card

Every scanner rule change must declare:

- Rule ID;
- Risk pattern;
- Tainted sources;
- Sinks;
- Required context;
- Privilege or secrets escalation;
- Expected severity;
- Safe examples;
- Known false positives;
- Known false negatives;
- Fixtures added;
- Output or schema impact;
- Validation commands.

## Finding semantics gate

Treat finding semantics as a public contract. Changes to finding IDs, severity mapping, JSON output shape, Markdown/table output, CLI exit code, `--fail-on`, GitHub Action behavior, install instructions, or release instructions require tests and docs updates.

Preserve backward compatibility when practical. If compatibility changes are necessary, document the migration and risk clearly.

## GitHub Action safety gate

For changes to `action.yml` or `.github/workflows/`, verify:

- input defaults and CLI arguments still match;
- `fail-on` behavior is documented and tested when touched;
- checkout/build behavior remains deterministic;
- no secrets, write permissions, publishing, or remote side effects are introduced without explicit approval;
- the action does not claim a tag works unless that tag is verified.

## Coding standards

- TypeScript with strict mode enabled.
- Biome for formatting and linting.
- Minimal dependencies; add a dependency only when the standard library and existing dependencies are insufficient.
- Deterministic tests only; no network calls in tests.
- Keep public copy cautious and specific.

## Validation protocol

Use the narrowest validation that proves the change. For normal code changes, prefer:

```sh
npm run lint
npm run typecheck
npm run test
npm run scan:self
```

For broad or release-sensitive changes, run:

```sh
npm run validate
```

For docs/config-only agent migrations, also run:

```sh
git diff --check
```

Verify every repo-local skill path referenced in this file exists.

Do not claim validation passed unless the exact command ran and returned success. If `npm run scan:self` flags the new docs because of risky example wording, inspect the finding first; do not weaken the scanner to make docs pass.

## Release protocol

For npm package, version, GitHub Action tag, release notes, package contents, install docs, or publishing workflow changes:

1. Run `npm run validate:release`.
2. Verify package metadata and package contents.
3. Check README consistency.
4. Check GitHub Action tag consistency.
5. Do not claim `npx prompttaint scan` or an action tag works unless verified, or clearly mark it as planned.

Use semantic versioning: MAJOR.MINOR.PATCH.

## Open-source maintainer policy

Optimize for contributor trust:

- keep tasks small and reviewable;
- document setup and validation clearly;
- avoid exaggerated security claims;
- separate scanner behavior, public contract, and release claims;
- explain residual risk when validation is partial or skipped.

## MCP local-first policy

Any MCP-related work must stay local-first unless a human explicitly approves a broader product direction. Do not add a backend, database, auth service, hosted dashboard, cloud dependency, billing, or telemetry.

Initial MCP tools should be read-only by default. If an MCP server uses stdio, reserve stdout for the protocol and send logs or diagnostics to stderr.

## Public claim glossary

Allowed public claims:

- "detects risky patterns"
- "reduces risk"
- "helps maintainers review agentic workflows"
- "static-analysis guardrail"
- "heuristic scanner"

Forbidden public claims:

- "prevents all prompt injection"
- "guarantees safety"
- "fully secures agents"
- "stops prompt injection"

When release, npm, or GitHub Action availability is uncertain, state that the path is planned or requires a verified release tag, package version, or commit SHA.

## Prohibited changes

Do not add these unless a human explicitly requests them:

- payments, billing, or Stripe integration;
- backend server or API;
- dashboard or web UI;
- authentication or authorization;
- database;
- cloud deployment infrastructure;
- new product surface outside the TypeScript CLI and GitHub Action.

## Commit protocol

Do not commit unless explicitly asked. If a human asks for a commit:

1. Run `git status --short`.
2. Run required validation, including `npm run validate` unless a narrower command is explicitly justified.
3. Stage only explicit files by name; never use `git add .` or `git add -A`.
4. Run `git diff --cached --name-only`.
5. Use Conventional Commits, for example `docs: update agent operating protocol`.
6. Do not push without explicit human permission.

## Final report

Report compactly:

- outcome;
- files changed or created;
- validation commands and results;
- subagents used;
- final guard result when applicable;
- commits only if explicitly created;
- residual risks;
- exact next action.
