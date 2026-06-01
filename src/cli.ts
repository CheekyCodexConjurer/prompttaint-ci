#!/usr/bin/env node
import { formatJson, formatMarkdown, formatTable } from "./reporter/index.js";
import { scanAgentDocs, scanWorkflowFiles } from "./scanner/index.js";
import type { Finding, Severity } from "./scanner/types.js";
import { findAgentDocs, findWorkflowFiles } from "./utils/files.js";

interface ScanOptions {
	command: "scan";
	path: string;
	format: string;
	failOn: string;
}

interface InitOptions {
	command: "init";
	apps: string[];
	path: string;
}

type CommandOptions = ScanOptions | InitOptions;

function showUsage(): void {
	console.log(`
Usage: prompttaint <command> [options]

Commands:
  scan               Scan repository for risky agentic workflow patterns
  init               Initialize agent security policies for local AI apps

Scan Options:
  --path <dir>       Directory to scan (default: ".")
  --format <fmt>     Output format: table, json, markdown (default: "table")
  --fail-on <sev>    Minimum severity to fail on: low, medium, high, critical (default: "high")

Init Options:
  --apps <apps>      Comma-separated list of apps: codex,cursor,claude,antigravity,serena,opengrapth,all (default: "all")
  --path <dir>       Directory to initialize (default: ".")

Global Options:
  --help, -h         Show this help message

Examples:
  prompttaint scan
  prompttaint scan --path ./.github/workflows --format json --fail-on critical
  prompttaint init --apps cursor,claude
`);
}

function parseArgs(argv: string[]): CommandOptions | null {
	const args = argv.slice(2);
	if (args.length === 0) return null;

	if (args.includes("--help") || args.includes("-h")) {
		showUsage();
		process.exit(0);
	}

	const command = args[0];
	if (command === "scan") {
		const options: ScanOptions = {
			command: "scan",
			path: ".",
			format: "table",
			failOn: "high",
		};

		for (let i = 1; i < args.length; i++) {
			const arg = args[i];
			if (arg === "--path" && i + 1 < args.length) {
				options.path = args[++i];
			} else if (arg === "--format" && i + 1 < args.length) {
				options.format = args[++i];
			} else if (arg === "--fail-on" && i + 1 < args.length) {
				options.failOn = args[++i];
			} else {
				console.error(`Error: Unknown option "${arg}" for command "scan"`);
				process.exit(1);
			}
		}
		return options;
	}

	if (command === "init") {
		const options: InitOptions = {
			command: "init",
			apps: ["all"],
			path: ".",
		};

		for (let i = 1; i < args.length; i++) {
			const arg = args[i];
			if (arg === "--apps" && i + 1 < args.length) {
				options.apps = args[++i].split(",");
			} else if (arg === "--path" && i + 1 < args.length) {
				options.path = args[++i];
			} else {
				console.error(`Error: Unknown option "${arg}" for command "init"`);
				process.exit(1);
			}
		}
		return options;
	}

	console.error(`Error: Unknown command "${command}"`);
	process.exit(1);
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

async function handleScan(options: ScanOptions): Promise<void> {
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
}

async function main(): Promise<void> {
	const options = parseArgs(process.argv);
	if (!options) {
		showUsage();
		process.exit(1);
	}

	try {
		if (options.command === "scan") {
			await handleScan(options);
		} else if (options.command === "init") {
			const { runInit } = await import("./init.js");
			await runInit(options);
			process.exit(0);
		}
	} catch (err) {
		console.error(`${options.command} failed:`, err instanceof Error ? err.message : String(err));
		process.exit(1);
	}
}

main();
