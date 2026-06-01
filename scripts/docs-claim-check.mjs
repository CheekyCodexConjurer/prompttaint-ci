import fs from "node:fs";
import path from "node:path";

const FILES_TO_CHECK = [
	"README.md",
	"SECURITY.md",
	"CONTRIBUTING.md",
	"docs/codex-for-oss.md",
	"docs/agents/SUBAGENT_ROUTING.md",
	"AGENTS.md",
];

const FORBIDDEN_PATTERNS = [
	{
		regex: /prevents?\s+all\s+prompt\s+injection/i,
		phrase: "prevents all prompt injection",
	},
	{ regex: /guarantees?\s+safety/i, phrase: "guarantees safety" },
	{ regex: /fully\s+secures?\s+agents/i, phrase: "fully secures agents" },
	{ regex: /stops?\s+prompt\s+injection/i, phrase: "stops prompt injection" },
];

let failed = false;

for (const relPath of FILES_TO_CHECK) {
	const fullPath = path.resolve(relPath);
	if (!fs.existsSync(fullPath)) {
		console.warn(`Warning: File ${relPath} does not exist, skipping.`);
		continue;
	}
	const content = fs.readFileSync(fullPath, "utf8");
	const lines = content.split(/\r?\n/);
	for (let lineNum = 1; lineNum <= lines.length; lineNum++) {
		const line = lines[lineNum - 1];
		for (const pattern of FORBIDDEN_PATTERNS) {
			if (pattern.regex.test(line)) {
				// Check if the matched word is part of a quoted rule or example
				const isQuoted =
					/"[^"]*(?:prevent|guarantee|secure|stop)[^"]*"/i.test(line) ||
					/'[^']*(?:prevent|guarantee|secure|stop)[^']*'/i.test(line) ||
					/`[^`]*(?:prevent|guarantee|secure|stop)[^`]*`/i.test(line);

				// Check if the line contains negation/disclaimer context
				const isNegated = /\b(not|no|never|don't|doesn't|forbidden|disclaim|refuse|avoid|allowed:)\b/i.test(line);

				if (isQuoted || isNegated) {
					continue;
				}

				console.error(`Error: Forbidden claim found in ${relPath}:${lineNum}`);
				console.error(`  Line: "${line.trim()}"`);
				console.error(`  Matched pattern: "${pattern.phrase}"`);
				failed = true;
			}
		}
	}
}

if (failed) {
	console.error("Documentation claim validation failed. Please use cautious security language.");
	process.exit(1);
} else {
	console.log("Documentation claim validation passed: No overclaiming language detected.");
	process.exit(0);
}
