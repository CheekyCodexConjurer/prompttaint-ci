import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

async function walkDir(dir: string, predicate: (relPath: string) => boolean): Promise<string[]> {
	const results: string[] = [];
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...(await walkDir(fullPath, predicate)));
		} else if (entry.isFile()) {
			const rel = relative(dir, fullPath);
			if (predicate(rel)) {
				results.push(fullPath);
			}
		}
	}
	return results;
}

export async function findWorkflowFiles(repoPath: string): Promise<string[]> {
	const workflowsDir = join(repoPath, ".github", "workflows");
	const results: string[] = [];
	try {
		await stat(workflowsDir);
		const entries = await readdir(workflowsDir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = join(workflowsDir, entry.name);
			if (entry.isFile() && (entry.name.endsWith(".yml") || entry.name.endsWith(".yaml"))) {
				results.push(resolve(fullPath));
			}
		}
	} catch {
		// directory may not exist
	}
	return results;
}

export async function findAgentDocs(repoPath: string): Promise<string[]> {
	const results: string[] = [];

	// Specific files
	const specificFiles = ["AGENTS.md", "CLAUDE.md", ".mcp.json"];
	for (const file of specificFiles) {
		try {
			const fullPath = join(repoPath, file);
			await stat(fullPath);
			results.push(resolve(fullPath));
		} catch {
			// file may not exist
		}
	}

	// Recursive directories
	const recursiveDirs = [".codex", ".claude"];
	for (const dir of recursiveDirs) {
		const fullDir = join(repoPath, dir);
		try {
			const entries = await walkDir(fullDir, () => true);
			results.push(...entries.map((p) => resolve(p)));
		} catch {
			// directory may not exist
		}
	}

	// .cursor/rules/**
	const cursorRulesDir = join(repoPath, ".cursor", "rules");
	try {
		await stat(cursorRulesDir);
		const entries = await readdir(cursorRulesDir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = join(cursorRulesDir, entry.name);
			if (entry.isFile()) {
				results.push(resolve(fullPath));
			}
		}
	} catch {
		// directory may not exist
	}

	return results;
}
