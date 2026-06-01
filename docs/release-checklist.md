# Release Checklist: v0.1.0

Follow these steps to release PromptTaint CI. This checklist is a runbook, not evidence that npm packages or GitHub Action tags are already available.

Do not document `npx prompttaint`, `npm install -g prompttaint`, `@v0`, or `@v0.1.0` as verified public usage until the matching verification item below has passed.

## 1. Pre-release Validation
- [ ] Run `npm run validate`
- [ ] Ensure all tests pass (including new CLI tests)
- [ ] Check `git status --short` (should be clean)

## 2. NPM Package Preparation
- [ ] Run `npm pack --dry-run` and inspect the output files.
- [ ] Check current version: `npm view prompttaint version` (should be less than 0.1.0 or 404 if not published).
- [ ] Ensure `package.json` version is `0.1.0`.

## 3. Publication
- [ ] `npm publish`
- [ ] Verify installation: `npx prompttaint@latest --help`

## 4. GitHub Release
- [ ] Verify whether `v0.1.0` and `v0` already exist locally or remotely.
- [ ] If needed, create `v0.1.0` at the reviewed release commit.
- [ ] Move `v0` only with explicit maintainer approval, because it is a moving major tag.
- [ ] `git push origin v0.1.0 v0`
- [ ] Create GitHub Release for `v0.1.0` on the web UI.

## 5. Post-release
- [ ] Verify GitHub Action works with `uses: CheekyCodexConjurer/prompttaint-ci@v0.1.0`.
- [ ] Verify GitHub Action works with `uses: CheekyCodexConjurer/prompttaint-ci@v0`.
- [ ] Update public docs to name verified package commands and Action tags only after those checks pass.
- [ ] Share on social media / internal channels.
