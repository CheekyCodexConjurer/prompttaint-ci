import type { Finding } from "../scanner/types.js";

export function formatTable(findings: Finding[]): string {
	if (findings.length === 0) {
		return "No findings detected.";
	}

	const header = ["SEVERITY", "FILE", "LINE", "SOURCE", "SINK"];
	const rows = findings.map((f) => [f.severity, f.file, f.line !== undefined ? String(f.line) : "", f.source, f.sink]);

	const allRows = [header, ...rows];
	const widths = header.map((_, colIdx) => Math.max(...allRows.map((r) => r[colIdx].length)));

	const pad = (str: string, width: number) => str.padEnd(width, " ");
	const sep = widths.map((w) => "-".repeat(w + 2)).join("|");

	const lines: string[] = [];
	lines.push(`| ${header.map((h, i) => pad(h, widths[i])).join(" | ")} |`);
	lines.push(`|${sep}|`);
	for (const row of rows) {
		lines.push(`| ${row.map((cell, i) => pad(cell, widths[i])).join(" | ")} |`);
	}

	return lines.join("\n");
}
