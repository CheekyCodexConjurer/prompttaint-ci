# Roadmap

PromptTaint CI is local-first open-source software. Roadmap items should improve the CLI, GitHub Action, documentation, fixtures, and local agent guardrails without requiring a hosted backend or paid service.

## Scanner precision

- Add focused detection rules for risky prompt-injection patterns.
- Reduce false positives through better context checks.
- Improve severity calibration and remediation copy.

## Fixtures and tests

- Add vulnerable and lower-risk workflow fixtures.
- Expand regression coverage for `AGENTS.md`, local agent rules, and workflow examples.
- Keep tests deterministic and network-free.

## GitHub Action and CLI outputs

- Improve markdown, JSON, and table output clarity.
- Keep `fail-on` behavior documented and tested.
- Document verified release tags or commit SHA usage only after validation.

## Agent guardrails

- Improve generated `AGENTS.md` and local policy templates.
- Add safer examples for local skills and agent routing files.
- Keep untrusted GitHub text clearly separated from agent instructions.

## Optional local MCP

- Explore a read-only local MCP server for repository review workflows.
- Keep stdout reserved for protocol messages when using stdio.
- Do not add telemetry or hosted dependencies by default.

## Not currently in scope

- Hosted dashboards.
- Private repo monitoring services.
- Billing or Stripe integration.
- Auth services, databases, or cloud infrastructure.
- Telemetry by default.
