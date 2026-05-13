import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { formatJson } from "../src/reporter/formatJson.js";
import { formatMarkdown } from "../src/reporter/formatMarkdown.js";
import { formatTable } from "../src/reporter/formatTable.js";
import { scanAgentDocs } from "../src/scanner/scanAgentDocs.js";
import { scanWorkflowFiles } from "../src/scanner/scanWorkflowFiles.js";
import type { Finding, Severity } from "../src/scanner/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(__dirname, "fixtures");

function getExitCode(findings: Finding[], threshold: Severity): number {
	const severityOrder: Severity[] = ["low", "medium", "high", "critical"];
	const highest = findings.reduce((max, f) => {
		return severityOrder.indexOf(f.severity) > severityOrder.indexOf(max) ? f.severity : max;
	}, "low" as Severity);
	return severityOrder.indexOf(highest) >= severityOrder.indexOf(threshold) ? 1 : 0;
}

const sampleFindings: Finding[] = [
	{
		id: "PT-001",
		severity: "critical",
		file: "vulnerable-workflow.yml",
		line: 1,
		source: "github.event.issue.body",
		sink: "instructions",
		reason: "Tainted source used in prompt sink with agent keyword.",
		remediation: "Sanitize input.",
	},
	{
		id: "PT-002",
		severity: "high",
		file: "vulnerable-workflow.yml",
		line: 2,
		source: "github.event.pull_request.body",
		sink: "prompt",
		reason: "Tainted source used in prompt sink with agent keyword.",
		remediation: "Sanitize input.",
	},
	{
		id: "PT-003",
		severity: "medium",
		file: "agent-docs.md",
		line: 5,
		source: "agent-doc",
		sink: "instruction",
		reason: "Agent documentation suggests trusting external content without boundaries.",
		remediation: "Add explicit boundaries.",
	},
	{
		id: "PT-004",
		severity: "low",
		file: "agent-docs.md",
		line: 10,
		source: "agent-doc",
		sink: "instruction",
		reason: "Agent documentation references external user-controlled content without clear sanitization guidance.",
		remediation: "Add explicit boundaries.",
	},
];

describe("scanner", () => {
	it("vulnerable-workflow.yml produces at least one HIGH or CRITICAL finding", async () => {
		const findings = await scanWorkflowFiles(resolve(fixturesDir, "vulnerable-workflow.yml"));
		expect(findings.some((f) => f.severity === "high" || f.severity === "critical")).toBe(true);
	});

	it("safe-workflow.yml produces no HIGH or CRITICAL findings", async () => {
		const findings = await scanWorkflowFiles(resolve(fixturesDir, "safe-workflow.yml"));
		expect(findings.some((f) => f.severity === "high" || f.severity === "critical")).toBe(false);
	});

	it("agent-docs.md scan does not crash", async () => {
		const findings = await scanAgentDocs(resolve(fixturesDir, "agent-docs.md"));
		expect(Array.isArray(findings)).toBe(true);
	});

	it("markdown formatter does not crash", () => {
		const result = formatMarkdown(sampleFindings);
		expect(typeof result).toBe("string");
		expect(result.includes("Scan Results") || result.includes("No findings")).toBe(true);
	});

	it("json formatter does not crash", () => {
		const result = formatJson(sampleFindings);
		expect(typeof result).toBe("string");
		expect(() => JSON.parse(result)).not.toThrow();
	});

	it("table formatter does not crash", () => {
		const result = formatTable(sampleFindings);
		expect(typeof result).toBe("string");
	});

	it("severity threshold logic works", () => {
		const highFinding: Finding = {
			id: "PT-001",
			severity: "high",
			file: "test.yml",
			line: 1,
			source: "github.event.issue.body",
			sink: "instructions",
			reason: "Test",
			remediation: "Fix it",
		};
		const mediumFinding: Finding = {
			id: "PT-002",
			severity: "medium",
			file: "test.yml",
			line: 2,
			source: "github.event.issue.body",
			sink: "prompt",
			reason: "Test",
			remediation: "Fix it",
		};
		const criticalFinding: Finding = {
			id: "PT-003",
			severity: "critical",
			file: "test.yml",
			line: 3,
			source: "github.event.issue.body",
			sink: "instructions",
			reason: "Test",
			remediation: "Fix it",
		};

		expect(getExitCode([highFinding], "high")).toBe(1);
		expect(getExitCode([mediumFinding], "high")).toBe(0);
		expect(getExitCode([criticalFinding], "high")).toBe(1);
		expect(getExitCode([], "high")).toBe(0);
	});
});
