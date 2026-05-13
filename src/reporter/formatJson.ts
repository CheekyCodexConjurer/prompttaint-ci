import type { Finding } from "../scanner/types.js";

export function formatJson(findings: Finding[]): string {
	return JSON.stringify({ findings }, null, 2);
}
