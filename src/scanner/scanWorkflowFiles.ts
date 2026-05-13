import { readFile } from "node:fs/promises";
import { parseAllDocuments } from "yaml";
import { AGENT_KEYWORDS, DANGEROUS_PERMISSIONS, PROMPT_SINKS, TAINTED_SOURCES } from "./patterns.js";
import { type Finding, Severity } from "./types.js";

let findingCounter = 0;
function nextId(): string {
	findingCounter += 1;
	return `PT-${String(findingCounter).padStart(3, "0")}`;
}

function lineNumber(content: string, needle: string): number | undefined {
	const lines = content.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes(needle)) {
			return i + 1;
		}
	}
	return undefined;
}

function containsAny(str: string, arr: string[], caseInsensitive = false): boolean {
	if (caseInsensitive) {
		const lower = str.toLowerCase();
		return arr.some((s) => lower.includes(s.toLowerCase()));
	}
	return arr.some((s) => str.includes(s));
}

function collectValues(node: unknown, values: string[]) {
	if (typeof node === "string") {
		values.push(node);
	} else if (Array.isArray(node)) {
		for (const item of node) {
			collectValues(item, values);
		}
	} else if (node && typeof node === "object") {
		for (const [k, v] of Object.entries(node)) {
			values.push(k);
			collectValues(v, values);
		}
	}
}

function collectKeyValuePairs(node: unknown, pairs: Array<{ key: string; value: string }>) {
	if (node && typeof node === "object" && !Array.isArray(node)) {
		for (const [k, v] of Object.entries(node)) {
			if (typeof v === "string") {
				pairs.push({ key: k, value: v });
			} else {
				collectKeyValuePairs(v, pairs);
			}
		}
	} else if (Array.isArray(node)) {
		for (const item of node) {
			collectKeyValuePairs(item, pairs);
		}
	}
}

export async function scanWorkflowFiles(filePath: string): Promise<Finding[]> {
	const findings: Finding[] = [];
	const content = await readFile(filePath, "utf-8");

	let docs: ReturnType<typeof parseAllDocuments>;
	try {
		docs = parseAllDocuments(content);
	} catch {
		return findings;
	}

	const fileValues: string[] = [];
	const fileKeys: string[] = [];
	const keyValuePairs: Array<{ key: string; value: string }> = [];

	for (const doc of docs) {
		const json = doc.toJSON();
		collectValues(json, fileValues);
		collectKeyValuePairs(json, keyValuePairs);
	}

	for (const { key } of keyValuePairs) {
		fileKeys.push(key);
	}

	const hasTaintedSource = fileValues.some((v) => TAINTED_SOURCES.some((s) => v.includes(s)));
	const hasPromptSink =
		fileValues.some((v) => containsAny(v, PROMPT_SINKS, true)) ||
		fileKeys.some((k) => containsAny(k, PROMPT_SINKS, true));
	const hasAgentKeyword = fileValues.some((v) => containsAny(v, AGENT_KEYWORDS, true));
	const hasDangerousPermissions = fileValues.some((v) => DANGEROUS_PERMISSIONS.some((s) => v.includes(s)));
	const hasWritePermissions = fileValues.some((v) => v.includes("write") || v.includes("contents: write"));
	const hasSecrets = fileValues.some((v) => v.includes("secrets."));

	// Per-occurrence logic
	const seen = new Set<string>();
	const addFinding = (f: Omit<Finding, "id">) => {
		const key = `${f.severity}|${f.file}|${f.line ?? 0}|${f.source}|${f.sink}|${f.reason}`;
		if (seen.has(key)) return;
		seen.add(key);
		findings.push({ ...f, id: nextId() });
	};

	for (const { key, value } of keyValuePairs) {
		const taintedHit = TAINTED_SOURCES.find((s) => value.includes(s));
		if (!taintedHit) continue;

		const keyHasPromptSink = containsAny(key, PROMPT_SINKS, true);
		const valueHasPromptSink = containsAny(value, PROMPT_SINKS, true);
		const valueHasAgent = containsAny(value, AGENT_KEYWORDS, true);

		const ln = lineNumber(content, taintedHit) ?? lineNumber(content, key);

		if (valueHasAgent && (keyHasPromptSink || valueHasPromptSink)) {
			if (hasDangerousPermissions) {
				addFinding({
					severity: "critical",
					file: filePath,
					line: ln,
					source: taintedHit,
					sink: keyHasPromptSink ? key : value,
					reason: "Tainted source used in prompt sink with agent keyword and dangerous permissions.",
					remediation:
						"Do not pass untrusted GitHub event fields directly to agent prompts. Sanitize or use indirection.",
				});
			} else {
				addFinding({
					severity: "high",
					file: filePath,
					line: ln,
					source: taintedHit,
					sink: keyHasPromptSink ? key : value,
					reason: "Tainted source used in prompt sink with agent keyword.",
					remediation:
						"Do not pass untrusted GitHub event fields directly to agent prompts. Sanitize or use indirection.",
				});
			}
		} else if (valueHasAgent) {
			addFinding({
				severity: "medium",
				file: filePath,
				line: ln,
				source: taintedHit,
				sink: key,
				reason: "Tainted source appears near agent keyword.",
				remediation:
					"Do not pass untrusted GitHub event fields directly to agent prompts. Sanitize or use indirection.",
			});
		} else if (keyHasPromptSink && hasAgentKeyword) {
			addFinding({
				severity: "high",
				file: filePath,
				line: ln,
				source: taintedHit,
				sink: key,
				reason: "Tainted source used in a prompt sink key and agent keyword present in file.",
				remediation:
					"Do not pass untrusted GitHub event fields directly to agent prompts. Sanitize or use indirection.",
			});
		}
	}

	// File-level high for secrets + agent + tainted
	if (hasTaintedSource && hasSecrets && hasAgentKeyword && findings.length === 0) {
		addFinding({
			severity: "high",
			file: filePath,
			source: "github.event.*",
			sink: "secrets.*",
			reason: "Tainted source, secrets usage, and agent keyword present in workflow.",
			remediation: "Do not pass untrusted GitHub event fields directly to agent prompts. Sanitize or use indirection.",
		});
	}

	return findings;
}
