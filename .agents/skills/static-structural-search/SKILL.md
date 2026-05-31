---
name: static-structural-search
description: Use syntax-aware search for TypeScript, TSX, or JavaScript patterns when available.
---

# Static Structural Search

Use syntax-aware search for code-shape questions when a local ast-grep binary is available. Prefer local binaries over global assumptions.

Windows:

```sh
.\node_modules\@ast-grep\cli\ast-grep.exe
```

POSIX:

```sh
./node_modules/@ast-grep/cli/ast-grep
```

Fall back to `rg` when ast-grep is unavailable or when searching literal strings, docs, config keys, or comments.

Search narrows investigation; it is not validation. Still run the tests or project checks that prove the touched behavior.
