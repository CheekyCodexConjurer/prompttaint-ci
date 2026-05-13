# Release Checklist: v0.1.0

Follow these steps to release PromptTaint CI.

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
- [ ] `git tag v0.1.0`
- [ ] `git tag -f v0 v0.1.0`
- [ ] `git push origin v0.1.0 v0`
- [ ] Create GitHub Release for `v0.1.0` on the web UI.

## 5. Post-release
- [ ] Verify GitHub Action works with `uses: CheekyCodexConjurer/prompttaint-ci@v0`.
- [ ] Share on social media / internal channels.
