import { readFile } from "node:fs/promises";
import type { Finding } from "./types.js";

let findingCounter = 0;
function nextId(): string {
	findingCounter += 1;
	return `PT-DOC-${String(findingCounter).padStart(3, "0")}`;
}

export async function scanAgentDocs(filePath: string): Promise<Finding[]> {
	const findings: Finding[] = [];
	const content = await readFile(filePath, "utf-8");
	const lines = content.split(/\r?\n/);

	const addFinding = (f: Omit<Finding, "id">) => {
		findings.push({ ...f, id: nextId() });
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lower = line.toLowerCase();

		// MEDIUM: trusting external content without boundaries
		const trustPatterns = [
			/trust\s+(issue|pr|pull\s*request|comment)\s+(content|body|title)/i,
			/use\s+(issue|pr|pull\s*request|comment)\s+(body|title)\s+as\s+(instruction|prompt)/i,
		];

		for (const pattern of trustPatterns) {
			if (pattern.test(line)) {
				addFinding({
					severity: "medium",
					file: filePath,
					line: i + 1,
					source: "agent-doc",
					sink: "instruction",
					reason: "Agent documentation suggests trusting external content without boundaries.",
					remediation: "Add explicit boundaries and do not instruct agents to trust user-controlled content verbatim.",
				});
			}
		}

		// LOW: mentions external content without sanitization/boundary instructions
		const mentionPatterns = [
			/github\.event\.(issue|pull_request|comment)\.(body|title)/i,
			/issue\s+body/i,
			/pr\s+body/i,
			/comment\s+body/i,
		];

		for (const pattern of mentionPatterns) {
			if (pattern.test(line)) {
				// Only flag if not already flagged at this line
				const already = findings.some((f) => f.line === i + 1);
				if (!already) {
					addFinding({
						severity: "low",
						file: filePath,
						line: i + 1,
						source: "agent-doc",
						sink: "instruction",
						reason:
							"Agent documentation references external user-controlled content without clear sanitization guidance.",
						remediation:
							"Add explicit boundaries and do not instruct agents to trust user-controlled content verbatim.",
					});
				}
			}
		}
	}

	return findings;
}
