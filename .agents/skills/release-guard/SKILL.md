---
name: release-guard
description: Use for npm package, version, GitHub Action tag, release notes, README install instructions, package files, or publishing workflow.
---

# Release Guard

Verify release claims before documenting them. Require `npm run validate:release` when release behavior changes.

Check package metadata, package contents, README consistency, action tag consistency, changelog or release notes when touched, and install instructions.

Do not claim `npx prompttaint scan` or a GitHub Action tag works unless the package or tag exists and has been verified, or the text clearly says it is planned.
