export type Severity = "low" | "medium" | "high" | "critical";

export interface Finding {
	id: string;
	severity: Severity;
	file: string;
	line?: number;
	source: string;
	sink: string;
	reason: string;
	remediation: string;
}

export interface ScanOptions {
	path: string;
	format: "table" | "json" | "markdown";
	failOn: Severity;
}

export interface ScanResult {
	findings: Finding[];
}
