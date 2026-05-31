---
name: final-safety-guard
description: Use after implementation and validation for features, refactors, broad fixes, scanner changes, output contract changes, release changes, or risky docs/config work.
---

# Final Safety Guard

This is read-only. Do not patch files, stage, commit, push, reset, stash, switch branches, create worktrees, delete files, or stop processes.

Inputs: task goal, acceptance criteria, diff summary, changed files, validation evidence, assumptions, and known risks.

Outcomes:

- `PASS`: ready to hand off.
- `PASS_WITH_NOTES`: acceptable with stated residual risk.
- `FAIL_FIX_REQUIRED`: exactly one write-capable implementer must correct the issue, then rerun targeted validation and this guard.
- `ESCALATE_XHIGH`: use critical read-only review for high-impact uncertainty.

Check whether the change matches the task, validation proves the change, scanner semantics are documented and tested when touched, public claims remain cautious, release claims are verified, and subagent instructions preserve the single-writer rule.
