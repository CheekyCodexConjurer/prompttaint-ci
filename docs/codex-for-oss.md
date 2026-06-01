# Codex for Open Source Maintenance Plan

This document describes how Codex (and similar agentic AI coding assistants) will be used to maintain and evolve the PromptTaint CI project, and outlines the safety guardrails governing these interactions.

## Project Summary

PromptTaint CI is an early-stage, local-first, MIT-licensed heuristic static-analysis tool. It detects risky patterns where untrusted GitHub event text (e.g., issue descriptions, pull request comments, branch names, commit messages) flows into instructions or prompt surfaces for AI coding agents in GitHub workflows.

## Why This Project Matters

As more developers integrate agentic coding assistants (like Codex, Claude Code, or custom agent workflows) directly into CI/CD pipelines, they face new attack vectors. If an agent is allowed to execute arbitrary commands, read secrets, or write to the repository, a malicious issue comment or pull request title could trigger untrusted instructions.

PromptTaint CI helps maintainers review agentic workflows and reduces risk by highlighting these dangerous dataflow paths.

## How Codex Will Be Used

Codex will act as an automated maintainer and co-pilot to help perform routine tasks:

1. **Rule & Heuristics Updates**: Codex can help identify new risky prompt-injection sinks/sources and add corresponding regex/static-analysis patterns.
2. **Fixture and Regression Test Management**: Codex can automatically write test fixtures (both vulnerable and lower-risk examples) to ensure scanner reliability.
3. **Documentation Maintenance**: Codex is used to keep documentation (such as `README.md`, `SECURITY.md`, and agent operating protocols) clear, accurate, and aligned.
4. **Issue Triage**: Codex can help analyze reports (false positives/false negatives) and draft remediation plans or PRs.
5. **PR Reviews**: Codex can review pull requests to ensure they adhere to strict agent guidelines, keep diffs focused, and do not introduce overclaims.

## Safety Guardrails: What Codex Should Not Do Automatically

To ensure repository integrity and avoid supply-chain risks, strict boundaries are enforced. **Codex is prohibited from performing the following actions without explicit human approval and review**:

* **NPM Package Publication**: Codex must never publish the npm package to any registry.
* **Release & Tag Mutating**: Codex must never move or push release tags (e.g., `v0.1.0` or `v0`) unless explicitly instructed by a human maintainer.
* **Secrets Management**: Codex must never read, write, or manage repository secrets, deployment tokens, or API credentials.
* **Destructive Git Actions**: Codex is barred from force-pushing, stashing, resetting, or rewriting history on public branches.
* **Unreviewed Code Merges**: Codex may propose pull requests or local changes, but a human maintainer must perform the final audit and merge.

## Current OSS Maturity

PromptTaint CI maintains high open-source hygiene through several structured protocols:
- **`AGENTS.md` and Local Skills**: A formal agent operating protocol that specifies rule-design gates, command guards, and subagent routing rules.
- **Subagent Routing**: Restricts writing capability to a single worker in the working tree, while using read-only subagents for exploration and safety review.
- **Private Vulnerability Reporting**: Enabled natively on GitHub to allow responsible disclosures without public thread leaks.
- **Continuous Integration (CI)**: Automated tests, typechecking, self-scanning, and biome linting run on every push and pull request.
- **Public Release Policy**: Releases (like `v0.1.0`) are generated only after passing dry-run packages and smoke tests locally.

## Near-Term Roadmap

- **Calibrate Heuristics**: Fine-tune existing scanner rules to reduce noise while maintaining strong pattern matching.
- **PR Automation**: Develop a GitHub Action workflow template that uses PromptTaint CI to automatically add comments to PRs when risky patterns are detected.
- **Local Read-only MCP Server**: Explore a read-only Model Context Protocol (MCP) server allowing local agents to query repository structure safely.

## Dogfooding Plan

PromptTaint CI should be run against this repository and selected public repositories controlled by the maintainer before being recommended broadly. Dogfooding targets should include repositories with GitHub Actions, AGENTS.md files, and local agent rules so scanner behavior can be tested on realistic workflows.
