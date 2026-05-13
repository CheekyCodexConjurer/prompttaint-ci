#!/usr/bin/env node
import { formatJson, formatMarkdown, formatTable } from "./reporter/index.js";
import { scanAgentDocs, scanWorkflowFiles } from "./scanner/index.js";
import type { Finding, Severity } from "./scanner/types.js";
import { findAgentDocs, findWorkflowFiles } from "./utils/files.js";

interface ScanOptions {
	path: string;
	format: string;
	failOn: string;
}

function showUsage(): void {
	console.log(`
Usage: prompttaint scan [options]

Options:
  --path <dir>       Directory to scan (default: ".")
  --format <fmt>     Output format: table, json, markdown (default: "table")
  --fail-on <sev>    Minimum severity to fail on: low, medium, high, critical (default: "high")

Examples:
  prompttaint scan
  prompttaint scan --path ./.github/workflows --format json --fail-on critical
`);
}

function parseArgs(argv: string[]): ScanOptions | null {
	const args = argv.slice(2);
	if (args.length === 0 || args[0] !== "scan") {
		return null;
	}

	const options: ScanOptions = {
		command: "scan",
		path: ".",
		format: "table",
		failOn: "high",
	} as unknown as ScanOptions;

	for (let i = 1; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--path" && i + 1 < args.length) {
			options.path = args[++i];
		} else if (arg === "--format" && i + 1 < args.length) {
			options.format = args[++i];
		} else if (arg === "--fail-on" && i + 1 < args.length) {
			options.failOn = args[++i];
		} else if (arg === "--help" || arg === "-h") {
			return null;
		}
	}

	return options;
}

const severityOrder: Record<Severity, number> = {
	low: 1,
	medium: 2,
	high: 3,
	critical: 4,
};

function sortFindings(findings: Finding[]): Finding[] {
	return findings.sort((a, b) => {
		const sevA = severityOrder[a.severity] || 0;
		const sevB = severityOrder[b.severity] || 0;
		return sevB - sevA;
	});
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv);
	if (!options) {
		showUsage();
		process.exit(1);
	}

	const validFormats = ["table", "json", "markdown"];
	if (!validFormats.includes(options.format)) {
		console.error(`Error: Invalid format "${options.format}". Must be one of: ${validFormats.join(", ")}`);
		process.exit(1);
	}

	const validSeverities = ["low", "medium", "high", "critical"];
	if (!validSeverities.includes(options.failOn)) {
		console.error(`Error: Invalid --fail-on "${options.failOn}". Must be one of: ${validSeverities.join(", ")}`);
		process.exit(1);
	}

	try {
		const workflowFiles = await findWorkflowFiles(options.path);
		const agentDocs = await findAgentDocs(options.path);

		const findings: Finding[] = [];

		for (const file of workflowFiles) {
			const workflowFindings = await scanWorkflowFiles(file);
			findings.push(...workflowFindings);
		}

		for (const doc of agentDocs) {
			const docFindings = await scanAgentDocs(doc);
			findings.push(...docFindings);
		}

		const sortedFindings = sortFindings(findings);

		let output = "";
		switch (options.format) {
			case "json":
				output = formatJson(sortedFindings);
				break;
			case "markdown":
				output = formatMarkdown(sortedFindings);
				break;
			default:
				output = formatTable(sortedFindings);
				break;
		}

		if (output) {
			console.log(output);
		}

		const maxSeverity = sortedFindings.length > 0 ? severityOrder[sortedFindings[0].severity] || 0 : 0;

		const threshold = severityOrder[options.failOn as Severity];

		if (maxSeverity >= threshold) {
			process.exit(1);
		} else {
			process.exit(0);
		}
	} catch (err) {
		console.error("Scan failed:", err instanceof Error ? err.message : String(err));
		process.exit(1);
	}
}

main();
