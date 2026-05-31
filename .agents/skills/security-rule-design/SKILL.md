---
name: security-rule-design
description: Use for changes to scanner rules, tainted sources, prompt sinks, agent keywords, dangerous permissions, secrets detection, severity, remediation, or heuristics.
---

# Security Rule Design

Require vulnerable and safe fixtures for rule behavior changes. State the expected severity, expected source and sink when applicable, remediation text, and false-positive/false-negative reasoning.

Do not add broad keyword-only detections without tests and explanation. Do not weaken existing detection unless explicitly requested and proven by tests.

Validate with `npm run test` and, when relevant, `npm run scan:self`.
