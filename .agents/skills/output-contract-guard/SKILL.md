---
name: output-contract-guard
description: Use for JSON, Markdown, table output, finding schema, CLI exit codes, --fail-on, or GitHub Action output behavior.
---

# Output Contract Guard

Treat output as a public contract. This includes finding IDs, severity mapping, JSON shape, Markdown/table formatting, CLI exit codes, `--fail-on`, and GitHub Action behavior.

Require tests and docs updates for contract changes. Preserve backward compatibility when practical; document migration risk when compatibility changes.

Do not bundle output contract changes with unrelated scanner heuristic changes unless the task requires both.
