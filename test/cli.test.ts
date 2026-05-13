import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const TMP_DIR = join(process.cwd(), "tmp-cli-test");

describe("CLI Integration", () => {
	beforeEach(() => {
		if (existsSync(TMP_DIR)) {
			rmSync(TMP_DIR, { recursive: true, force: true });
		}
		mkdirSync(TMP_DIR, { recursive: true });
	});

	afterEach(() => {
		if (existsSync(TMP_DIR)) {
			rmSync(TMP_DIR, { recursive: true, force: true });
		}
	});

	it("--help exits 0", () => {
		const output = execSync("node dist/cli.js --help").toString();
		expect(output).toContain("Usage: prompttaint");
	});

	it("unknown command exits 1", () => {
		try {
			execSync("node dist/cli.js unknown", { stdio: "pipe" });
			expect(true).toBe(false); // Should not reach here
		} catch (err) {
			const e = err as { status: number; stderr: Buffer };
			expect(e.status).toBe(1);
			expect(e.stderr.toString()).toContain('Unknown command "unknown"');
		}
	});

	it("init creates expected files", () => {
		execSync(`node dist/cli.js init --path ${TMP_DIR} --apps all`);
		expect(existsSync(join(TMP_DIR, ".prompttaint", "policy.yml"))).toBe(true);
		expect(existsSync(join(TMP_DIR, ".cursor", "rules", "prompttaint.mdc"))).toBe(true);
		expect(existsSync(join(TMP_DIR, "AGENTS.md"))).toBe(true);
	});

	it("init does not overwrite AGENTS.md", () => {
		const existing = "existing agents content";
		writeFileSync(join(TMP_DIR, "AGENTS.md"), existing);
		const output = execSync(`node dist/cli.js init --path ${TMP_DIR} --apps antigravity`).toString();
		expect(output).toContain("[ACTION REQUIRED] AGENTS.md already exists");
		expect(readFileSync(join(TMP_DIR, "AGENTS.md"), "utf-8")).toBe(existing);
	});

	it("init --apps codex creates AGENTS.md when missing", () => {
		execSync(`node dist/cli.js init --path ${TMP_DIR} --apps codex`);
		expect(existsSync(join(TMP_DIR, "AGENTS.md"))).toBe(true);
	});

	it("init --apps codex does not overwrite existing AGENTS.md", () => {
		const existing = "existing agents content";
		writeFileSync(join(TMP_DIR, "AGENTS.md"), existing);
		const output = execSync(`node dist/cli.js init --path ${TMP_DIR} --apps codex`).toString();
		expect(output).toContain("[ACTION REQUIRED] AGENTS.md already exists");
		expect(readFileSync(join(TMP_DIR, "AGENTS.md"), "utf-8")).toBe(existing);
	});

	it("init --apps claude creates .claude/CLAUDE.md when missing", () => {
		execSync(`node dist/cli.js init --path ${TMP_DIR} --apps claude`);
		expect(existsSync(join(TMP_DIR, ".claude", "CLAUDE.md"))).toBe(true);
	});

	it("init --apps cursor creates .cursor/rules/prompttaint.mdc", () => {
		execSync(`node dist/cli.js init --path ${TMP_DIR} --apps cursor`);
		expect(existsSync(join(TMP_DIR, ".cursor", "rules", "prompttaint.mdc"))).toBe(true);
	});

	it("scan vulnerable workflow exits 1 with --fail-on high", () => {
		const workflow = `
name: Vulnerable
on: issue_comment
jobs:
  agent:
    runs-on: ubuntu-latest
    steps:
      - name: Ask AI
        run: "npx claude-code 'Fix this: \${{ github.event.comment.body }}'"
`;
		const wfPath = join(TMP_DIR, ".github", "workflows", "vulnerable.yml");
		mkdirSync(join(TMP_DIR, ".github", "workflows"), { recursive: true });
		writeFileSync(wfPath, workflow);

		try {
			execSync(`node dist/cli.js scan --path ${TMP_DIR} --fail-on high`, { stdio: "pipe" });
			expect.fail("Should have exited with status 1");
		} catch (err) {
			if ((err as Error).name === "AssertionError") throw err;
			expect((err as { status: number }).status).toBe(1);
		}
	});

	it("scan safe workflow exits 0 with --fail-on high", () => {
		const workflow = `
name: Safe
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello"
`;
		const wfPath = join(TMP_DIR, "safe.yml");
		mkdirSync(join(TMP_DIR, ".github", "workflows"), { recursive: true });
		writeFileSync(join(TMP_DIR, ".github", "workflows", "safe.yml"), workflow);

		const output = execSync(`node dist/cli.js scan --path ${TMP_DIR} --fail-on high`).toString();
		expect(output).toContain("No findings detected");
	});
});
