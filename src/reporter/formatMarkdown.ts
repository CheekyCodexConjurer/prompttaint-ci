import type { Finding } from "../scanner/types.js";

export function formatMarkdown(findings: Finding[]): string {
	if (findings.length === 0) {
		return "# PromptTaint Scan Results\n\nNo findings detected.\n";
	}

	const lines: string[] = ["# PromptTaint Scan Results", ""];

	for (const f of findings) {
		const badge = `**${f.severity.toUpperCase()}**`;
		lines.push(`## ${f.id} ${badge}`);
		lines.push(`- **File:** ${f.file}`);
		if (f.line !== undefined) {
			lines.push(`- **Line:** ${f.line}`);
		}
		lines.push(`- **Source:** ${f.source}`);
		lines.push(`- **Sink:** ${f.sink}`);
		lines.push(`- **Reason:** ${f.reason}`);
		lines.push(`- **Remediation:** ${f.remediation}`);
		lines.push("");
	}

	return lines.join("\n");
}
