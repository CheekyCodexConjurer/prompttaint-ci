---
name: command-guard
description: Use before meaningful shell command execution to classify risk and avoid unsafe or destructive operations.
---

# Command Guard

Classify commands as read-only, build/check, or mutating. Prefer the least destructive command that proves the point.

Never run destructive git commands, broad staging, reset, stash, revert, rebase, merge, push, recursive delete, or broad overwrite unless explicitly requested.

Use deterministic commands and explicit paths. Report exact command results when they matter for validation or handoff.
