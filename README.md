# PromptTaint CI

> Stop untrusted GitHub text from becoming agent instructions.

## What it does

PromptTaint CI is a CI guardrail that scans your repository for paths where untrusted GitHub content—like issue titles, PR bodies, comments, and commit messages—can flow into prompts sent to AI agents. It detects risky patterns before Claude, Codex, Copilot, Cursor, Aider, or other agents read that text as instructions.

## Why this exists

Modern agentic workflows let AI tools read GitHub events and act on them. An attacker can inject malicious instructions into seemingly benign text fields. If an agent reads an injected issue title or PR description and follows hidden instructions, it could leak secrets, modify code, or perform unauthorized actions. PromptTaint CI exists to find those injection paths before they are exploited.

## What it catches

- Suspicious patterns in strings passed to LLM prompts
- Variables sourced from GitHub event payloads flowing into agent instructions
- Indirect prompt injection markers in issue titles, PR bodies, comments, and commit messages
- Hardcoded API keys or secrets that should not reach prompts
- Misconfigurations that allow untrusted text to reach high-privilege agent steps

## Install in 60 seconds

```bash
npm install -g prompttaint
```

Or run without installing:

```bash
npx prompttaint scan
```

## CLI usage

```bash
prompttaint scan --path <repo> --format table|json|markdown --fail-on low|medium|high|critical
```

Options:
- `--path`: path to the repository to scan (defaults to current directory)
- `--format`: output format
- `--fail-on`: minimum severity that causes a non-zero exit code

## GitHub Action usage

```yaml
- uses: CheekyCodexConjurer/prompttaint-ci@v0
  with:
    fail-on: medium
```

## Example output

```text
Rule                           Severity   File:Line   Message
─────────────────────────────────────────────────────────────────────────────
github-event-to-prompt         medium     src/bot.ts:42   PR body flows into system prompt without sanitization
indirect-injection-marker      high       lib/parse.ts:15   Detected instruction override sequence in user input
─────────────────────────────────────────────────────────────────────────────
2 issues found
```

## Built for

Claude Code, Codex, Copilot, Cursor, Aider, and agentic GitHub workflows.

## Current status: MVP

This is an early, heuristic-based tool. It uses static analysis patterns to flag risks. It will miss some issues and may flag safe code. Use it as an automated first line of defense, not as a complete security audit.

## Roadmap

- **Scanner accuracy improvements**: more detection rules, fewer false positives
- **GitHub App**: automated PR checks with inline comments
- **SaaS dashboard**: centralized monitoring across repositories
- **Team features**: shared policies, team-managed ignore lists

## Future paid model

- **Public repos**: free forever
- **Private repo monitoring**: paid tier
- **Team dashboards**: paid tier (later)

## Disclaimer

This is a heuristic guardrail, not a complete security product. It detects risky patterns and reduces risk, but does not prevent all prompt injection.

---

*Suggested GitHub repo description: "CI guardrail that finds prompt-injection paths in agentic GitHub workflows before Claude, Codex, or Copilot read untrusted text."*
