---
name: scanner-fixture-safety
description: Use for scanner test fixtures and examples.
---

# Scanner Fixture Safety

Fixtures must be deterministic, local-only, and minimal. No network calls, real secrets, real tokens, or live credentials.

Include safe and vulnerable cases when changing scanner behavior. Prefer small workflow YAML examples that isolate one behavior.

Fixture names and assertions should make the expected severity and finding reason obvious.
