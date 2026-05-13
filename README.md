# PromptTaint CI

> Stop untrusted GitHub text from becoming agent instructions.

PromptTaint CI finds risky paths where GitHub issues, PRs, comments, commit messages, or branch names can become instructions for coding agents.

## Quick Start

Run it instantly without installing:

```bash
npx prompttaint scan
```

Or install globally:

```bash
npm install -g prompttaint
```

### From source

Get started in 30 seconds:

```bash
git clone https://github.com/CheekyCodexConjurer/prompttaint-ci.git
cd prompttaint-ci
npm ci
npm run build
node dist/cli.js scan --path . --format markdown
```

## GitHub Action

Add PromptTaint CI to your workflow to catch risky patterns in CI.

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: CheekyCodexConjurer/prompttaint-ci@v0
        with:
          fail-on: high
```

## Local AI Coding App Setup

PromptTaint can generate security policies for your local AI coding apps (Cursor, Claude Code, etc.) to instruct them on how to handle untrusted repository content.

```bash
prompttaint init --apps all
```

This creates:
- `.prompttaint/policy.yml`: Core security policy.
- `.cursor/rules/prompttaint.mdc`: Cursor-specific rules.
- `.claude/CLAUDE.md`: Claude Code instructions.
- `AGENTS.md`: General agent instructions.

## Supported Surfaces

- **Agents**: Claude Code, Codex, Cursor, Antigravity, Aider, Copilot-style agent workflows.
- **CI/CD**: GitHub Actions workflows.
- **Docs**: Agent instructions and READMEs.

## What it detects today

- **Taint tracking**: GitHub event fields (issue body, PR title, etc.) flowing into prompt sinks (instruction, message, prompt, etc.).
- **Dangerous permissions**: Broad write permissions (`contents: write`, `write-all`, etc.) in workflows that handle untrusted text.
- **Agent keywords**: Presence of known agent tools near tainted data.
- **Secrets usage**: Workflows that access `secrets.*` while also processing untrusted event data.

## What it does not detect yet

- **Deep data flow**: It does not track data through complex shell scripts or compiled binaries.
- **Runtime injection**: It is a static analysis tool, not a runtime monitor.
- **Sophisticated obfuscation**: Attackers may use complex encoding to bypass heuristic patterns.

## Example Vulnerable Workflow

This workflow is risky because it passes an untrusted issue comment directly to an AI agent command while having broad write permissions.

```yaml
name: Agent Fixer
on: issue_comment
permissions:
  contents: write
jobs:
  fix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: "npx claude-code 'Fix this issue: ${{ github.event.comment.body }}'"
```

## Example Safe Workflow

A safer approach uses indirection or strictly limited permissions.

```yaml
name: Safe Scanner
on: push
permissions:
  contents: read
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
```

## Current Status

**MVP / Heuristic Scanner.**
PromptTaint CI is currently in early development. It uses static analysis patterns to detect risky configurations. It reduces risk by identifying common pitfalls but is not a substitute for a full security audit.

## Roadmap

- **v0.1.0**: CLI stability, local app support, improved permission detection.
- **v0.2.0**: Enhanced taint tracking for multi-step workflows.
- **v1.0.0**: Private repo monitoring, centralized dashboard, and automated PR remediation.

## Future Paid Model

- **Public Repos**: Free forever.
- **Private Repo Monitoring**: Paid tier for advanced security and compliance.
- **Team Dashboards**: Centralized monitoring for large organizations.

## License

MIT
