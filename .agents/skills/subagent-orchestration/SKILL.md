---
name: subagent-orchestration
description: Use for non-trivial engineering work requiring mapping, implementation, validation, review, checkpoints, or fan-out.
---

# Subagent Orchestration

Subagents are quality tools, not token-saving tools. Use them when they improve mapping, isolated review, validation planning, or risk control.

Use exactly one write-capable implementer in the current working tree. Exploration, review, checkpoint, validation, and final guard agents are read-only. Parallel write experiments require explicit human approval and separate worktrees.

Route classes:

- Trivial direct: obvious one-line docs/config update; no subagent needed.
- Simple isolated: one small area, low behavior risk; one implementer plus narrow validation.
- Normal implementation: explorer, one implementer, validation, and final guard as needed.
- Security rule change: explorer, security reviewer, one implementer, tests, self-scan when relevant, final guard.
- Release/public docs change: release or maintainer reviewer, one implementer, release-sensitive validation.
- Critical security ambiguity: read-only critical guard before implementation.

Checkpoint triggers:

- unclear test failure;
- second or later attempt;
- diff exceeds the plan;
- more than 3 files or about 200 LOC changed;
- new modules;
- scanner severity, output, action, or release behavior changes;
- validation skipped, flaky, or inconclusive;
- implementer uncertainty.

See `docs/agents/SUBAGENT_ROUTING.md` for route cards and prompt examples.
