## Summary

Provide a description of the change, the problem it solves, and the motivation.

## Type of Change

Please tick the options that apply:

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Documentation or community file update
- [ ] Config or CI adjustment

## Change Scope & Impact

Please confirm which areas are affected:

* **Scanner behavior changed?** [Yes / No]
* **Output contract changed?** (JSON, Markdown, CLI exit, severity mapping, etc.) [Yes / No]
* **GitHub Action or Release behavior changed?** [Yes / No]

## Validation Run

List the exact commands run and the results:

```bash
# e.g., npm run validate
```

## Security & Cautious-Claims Checklist

Please check all that apply to confirm compliance with our public posture guidelines:

- [ ] I kept the diff focused (no drive-by refactoring or unrelated formatting).
- [ ] I added or updated tests if scanner behavior changed.
- [ ] I included vulnerable and lower-risk fixtures for scanner rule changes.
- [ ] I did not claim that PromptTaint CI "prevents all prompt injection", "guarantees safety", or "stops prompt injection" (used cautious language: "detects risky patterns", "reduces risk", "helps maintainers review agentic workflows", "static-analysis guardrail").
- [ ] I did not document npm package or GitHub Action tag availability unless verified.
- [ ] I listed the exact validation commands and results.

## Residual Risk

Identify any potential side effects, known limitations, or skipped validation.

## Screenshots / CLI Output (if relevant)

Paste any screenshots or CLI outputs showing the validation or behavior.
