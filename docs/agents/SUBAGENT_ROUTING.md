# PromptTaint CI Subagent Routing

This guide defines repo-local Codex App routing for PromptTaint CI. Subagents are quality tools, not token-saving tools.

## Route Classes

| Class | Use when | Default route |
| --- | --- | --- |
| Trivial direct | Tiny docs/config change with no behavior risk | No subagent; run narrow validation |
| Simple isolated | One small area, low behavior risk | One implementer; optional read-only reviewer |
| Normal implementation | Multi-file feature/fix/refactor/config/test/docs task | Explorer, one implementer, validator or final guard |
| Security rule change | Scanner sources, sinks, keywords, permissions, severity, remediation, or heuristics | Explorer, security reviewer, one implementer, tests, self-scan, final guard |
| Output contract change | JSON, Markdown, table, finding schema, CLI exit, `--fail-on`, or action behavior | Explorer or output reviewer, one implementer, contract tests, final guard |
| GitHub Action change | `action.yml` or `.github/workflows/` behavior | Explorer, one implementer, validator, output or release reviewer when relevant |
| Release/public docs change | npm metadata, tags, install instructions, release notes, package files, README | Release reviewer, one implementer, release validation when behavior changes |
| Critical security ambiguity | Unclear high-impact scanner semantics or public contract risk | Critical guard before implementation |

## Agents

- `prompttaint-explorer`: read-only mapper for files, flows, docs, tests, scanner rules, fixtures, and risks.
- `prompttaint-worker`: the only write-capable implementer in the current working tree.
- `prompttaint-security-reviewer`: read-only reviewer for scanner rules, severity, source/sink behavior, and false positives.
- `prompttaint-output-reviewer`: read-only reviewer for JSON, Markdown, table, CLI, and GitHub Action contract changes.
- `prompttaint-release-reviewer`: read-only reviewer for npm and GitHub Action release consistency.
- `prompttaint-validator`: read-only validation planner and log interpreter.
- `prompttaint-final-guard`: read-only final safety gate.
- `prompttaint-critical-guard`: read-only xHigh gate for critical security ambiguity.

## Single Writer Rule

Use exactly one write-capable implementer per working tree. Read-only agents may run in parallel for exploration, review, validation planning, checkpoints, and final guards. Parallel write experiments require explicit human approval and separate worktrees.

## Checkpoint Triggers

Start a read-only checkpoint when:

- tests fail unclearly;
- this is the second or later attempt;
- the diff exceeds the planned scope;
- more than 3 files or about 200 LOC changed;
- new modules appear;
- scanner severity, output, action, or release behavior changes;
- validation is skipped, flaky, or inconclusive;
- the implementer is uncertain.

Stop checkpoint loops when findings are resolved, the checkpoint budget is reached, further investigation is low-signal, or final validation/guard is next.

## xHigh Triggers

Use `prompttaint-critical-guard` only for read-only critical reasoning or review involving high-impact security ambiguity, scanner semantics, false-positive/false-negative tradeoffs, release correctness, public contract risk, or ambiguous validation failures.

## Prompt Examples

Explorer:

```text
Read-only. Map files, docs, tests, scanner rules, fixtures, public contracts, and risks relevant to <task>. Do not edit, stage, commit, push, reset, stash, revert, switch branches, create worktrees, delete files, or change git state. Return concise findings with file paths, evidence, uncertainty, and recommended next step.
```

Security reviewer:

```text
Read-only. Review this scanner change for severity, source/sink semantics, false positives, false negatives, remediation text, and fixture coverage. Do not edit or change git state. Return blockers first, then validation gaps and residual risk.
```

Output reviewer:

```text
Read-only. Review this diff for JSON, Markdown, table, CLI exit, --fail-on, and GitHub Action contract regressions. Do not edit or change git state. Return public contract risks and required tests/docs.
```

Release reviewer:

```text
Read-only. Review release-related claims, package metadata, README instructions, action tag consistency, and validation requirements. Do not edit or change git state. Flag any unverified install or tag claim.
```

Final guard:

```text
Read-only final safety gate. Inputs: goal, acceptance criteria, diff summary, changed files, validation evidence, assumptions, known risks. Return PASS, PASS_WITH_NOTES, FAIL_FIX_REQUIRED, or ESCALATE_XHIGH with concise rationale. Do not patch files or change git state.
```

Worker:

```text
You are the single write-capable implementer for this working tree. Inspect current diff first. Apply the smallest safe change for <task>. Do not stage, commit, push, stash, reset, switch branches, create worktrees, delete files, or revert user changes. Report changed files, validation, and residual risk.
```

## Route Cards

Docs-only agent migration:

```text
Route: normal docs/config
Agents: explorer for source mapping, local single writer, final guard read-only
Validation: git diff --check, required skill-file presence check, lint/typecheck/test/self-scan when available
Stop condition: docs/config syntax valid, all referenced skills exist, no product code touched
```

Scanner rule change:

```text
Route: security rule change
Agents: explorer, security reviewer, one worker, validator, final guard
Validation: vulnerable fixture, safe fixture, expected severity/source/sink, npm run test, npm run scan:self when relevant
Stop condition: rule behavior and false-positive tradeoff are documented and tested
```

Output contract change:

```text
Route: output contract change
Agents: output reviewer, one worker, validator, final guard
Validation: formatter/CLI/action tests covering changed contract
Stop condition: public output behavior is tested, documented, and backward-compatible when practical
```

GitHub Action change:

```text
Route: GitHub Action change
Agents: explorer, output or release reviewer when relevant, one worker, validator
Validation: action input/default review, build/check commands, tests for CLI arguments when touched
Stop condition: action behavior is deterministic and no unapproved remote side effects are introduced
```

Release/readme install-instruction change:

```text
Route: release/public docs change
Agents: release reviewer, one worker, validator, final guard
Validation: npm run validate:release when release behavior changes; package metadata and tag claim verification
Stop condition: release claims are verified or explicitly marked as planned
```

Open-source contributor onboarding change:

```text
Route: maintainer docs
Agents: maintainer reviewer if public-facing guidance changes, one worker, final guard when broad
Validation: docs syntax, cautious security language check, relevant project validation
Stop condition: contributor instructions are actionable, accurate, and not overclaimed
```
