# Agent Protocol: PromptTaint CI

## Product mission

PromptTaint CI detects paths where attacker-controlled GitHub text can flow into AI agent prompts. It is a static-analysis guardrail for agentic GitHub workflows, not a runtime security monitor.

## Current architecture

- TypeScript CLI tool
- GitHub Action wrapper
- No backend, no database, no auth, no dashboard

## File map

| Path | Purpose |
|------|---------|
| `src/` | TypeScript source code |
| `src/rules/` | Detection rules |
| `src/formatters/` | Output formatters (table, json, markdown) |
| `action.yml` | GitHub Action metadata |
| `.github/workflows/` | CI workflows for this repo |
| `docs/` | Documentation |
| `tests/` | Vitest test suite |

## Coding standards

- TypeScript with `strict` mode enabled
- Biome for formatting and linting
- Minimal dependencies: only add a dependency if the task is impossible with the standard library

## Testing standards

- Vitest for all tests
- Tests must be deterministic
- No network calls in tests; mock all external I/O

## Security language rules

- NEVER claim that PromptTaint CI "prevents all prompt injection"
- ALWAYS say it "detects risky patterns" and "reduces risk"
- Use cautious language in user-facing copy and documentation

## Prohibited changes

Do NOT implement or add the following unless explicitly requested by a human:

- Payments, billing, or Stripe integration
- Backend server or API
- Dashboard or web UI
- Authentication or authorization
- Database
- Cloud deployment infrastructure

## Worktree protocol

- Do not delete or overwrite user files outside the repository
- Check `git status` before making changes to understand the current state

## Commit protocol

- NEVER use `git add .` or `git add -A`
- ALWAYS run `git status --short` before commits
- Stage ONLY explicit files by name
- Commit after each completed logical milestone
- Conventional Commits required
- Do NOT push to remote without explicit human permission

## Validation protocol

- Always run `npm run validate` before committing
- Do not claim validation passed unless the exact command was run and its output shows success

## Release protocol

1. Validate: `npm run validate`
2. Tag with semantic version
3. Do not release if validation fails

## Versioning policy

Semantic Versioning (semver): MAJOR.MINOR.PATCH

## Conventional Commit examples

- `feat: add new scanner rule for X`
- `fix: correct severity mapping for Y`
- `docs: update README with Z`
- `test: add coverage for W`
- `chore: update dependencies`

## Explicit rules

1. **Git rules**
   - NEVER use `git add .` or `git add -A`
   - ALWAYS run `git status --short` before commits
   - Stage ONLY explicit files
   - Commit after each completed logical milestone
   - Conventional Commits required
   - Do NOT push without explicit human permission

2. **Validation rules**
   - Always run `npm run validate` before committing
   - Do not claim validation passed unless exact commands were run and passed

## Next agent quickstart

1. `git status --short`
2. `npm run validate`
3. Make changes
4. `git status --short`
5. `git add <explicit-files>`
6. `git diff --cached --name-only`
7. `git commit -m "type: description"`
