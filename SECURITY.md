# Security Policy

PromptTaint CI is a heuristic static-analysis guardrail. Security reports are welcome, especially when they show:

- a false negative that lets a clearly risky pattern pass unnoticed;
- a false positive severe enough to mislead maintainers;
- unsafe release or action guidance that could cause trust or supply-chain risk;
- a packaging, dependency, or repository configuration issue with real security impact.

## Supported Versions

PromptTaint CI is early-stage software.

Current support posture:

| Version / Branch | Status |
| --- | --- |
| `master` | Best-effort support |
| Older commits or unpublished local snapshots | Not supported |

If verified release tags are published later, this policy should be updated to name the supported release line explicitly.

## How to Report

Please do not disclose unpatched vulnerabilities in a public GitHub issue.

Preferred path:

Report privately using GitHub Private Vulnerability Reporting at:
https://github.com/CheekyCodexConjurer/prompttaint-ci/security/advisories/new

If you are unable to use private reporting, contact the maintainer through the repository owner profile and request a private coordination channel before sharing exploit details.

Include, when possible:

- affected commit SHA or branch;
- impacted file or workflow;
- clear reproduction steps;
- expected behavior versus observed behavior;
- risk explanation;
- any proof-of-concept needed to reproduce safely.

Please keep proof-of-concept material minimal and avoid sharing live secrets, tokens, or destructive payloads.

## What to Expect

- Initial triage on a best-effort basis.
- A request for reproduction details if the report is incomplete.
- Coordination on disclosure timing when the report is valid and non-trivial.

Because this is an open-source project without a hosted backend, response times may vary.

## Scope Notes

This repository does not claim to prevent all prompt injection. Valid reports should show a concrete security weakness, unsafe guidance, or materially misleading scanner behavior, not just the existence of residual risk inherent to heuristic static analysis.

General hardening ideas, feature requests, and non-sensitive improvement suggestions can be opened as normal GitHub issues.
