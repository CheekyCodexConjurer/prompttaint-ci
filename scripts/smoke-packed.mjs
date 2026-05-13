import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const TMP_DIR = join(process.cwd(), "tmp-smoke-install");

try {
	console.log("Packing tarball...");
	execSync("npm pack", { stdio: "pipe" });

	const files = readdirSync(process.cwd());
	const tarball = files.find((f) => f.startsWith("prompttaint-") && f.endsWith(".tgz"));

	if (!tarball) {
		throw new Error("Tarball not found after npm pack");
	}

	console.log(`Found tarball: ${tarball}`);

	if (existsSync(TMP_DIR)) {
		rmSync(TMP_DIR, { recursive: true, force: true });
	}
	mkdirSync(TMP_DIR, { recursive: true });

	console.log("Installing tarball in temp directory...");
	execSync("npm init -y", { cwd: TMP_DIR, stdio: "ignore" });
	execSync(`npm install ../${tarball}`, { cwd: TMP_DIR, stdio: "ignore" });

	console.log("Testing npx prompttaint --help...");
	const output = execSync("npx prompttaint --help", { cwd: TMP_DIR }).toString();

	if (!output.includes("Usage: prompttaint")) {
		throw new Error("npx prompttaint --help output did not contain expected text");
	}

	console.log("Smoke test passed successfully.");

	// Cleanup
	rmSync(TMP_DIR, { recursive: true, force: true });
	rmSync(tarball, { force: true });

	process.exit(0);
} catch (err) {
	console.error("Smoke test failed:", err);
	if (existsSync(TMP_DIR)) {
		rmSync(TMP_DIR, { recursive: true, force: true });
	}
	process.exit(1);
}
