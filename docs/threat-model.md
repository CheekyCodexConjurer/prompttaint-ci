# Threat Model

## Attacker-controlled GitHub text

An attacker can inject malicious content into multiple GitHub data fields:

- Issue titles and bodies
- Pull request titles and descriptions
- Comments (issue, PR, commit)
- Commit messages
- Branch names

Any of these fields may contain text crafted to manipulate an AI agent that later reads them.

## Prompt sinks

These attacker-controlled texts become dangerous when they flow into prompt sinks—locations where the text is passed to an LLM as part of its instructions. Common sinks include:

- System prompts constructed from event payloads
- User messages built from PR descriptions or issue bodies
- Tool instructions that include commit messages or branch names
- Context windows populated with comment threads

## Permissions risk

If the GitHub workflow or agent has write permissions to the repository, a successful prompt injection can lead to:

- Unauthorized code modifications
- Secret exfiltration
- Malicious workflow changes
- Data destruction

The combination of write access and prompt injection turns a text-formatting bug into a repository compromise.

## Current limitations

PromptTaint CI uses heuristic detection. It can produce:

- **False positives**: safe code flagged as risky
- **False negatives**: real injection paths that the scanner misses

It is not a complete security product. It detects risky patterns and reduces risk, but does not prevent all prompt injection.
