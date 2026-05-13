import { spawnSync } from "node:child_process";

function runGit(args) {
	const result = spawnSync("git", args, { encoding: "utf-8", shell: true });
	if (result.error) {
		throw result.error;
	}
	return result.stdout.trim();
}

console.log("=== Git Status ===");
const status = runGit(["status", "--short"]);
console.log(status || "(clean)");

console.log("\n=== Latest Commit ===");
const latest = runGit(["log", "-1", "--oneline"]);
console.log(latest || "(no commits)");

console.log("\n=== Changed Files ===");
const changed = runGit(["diff", "--name-only"]);
if (changed) {
	console.log(changed);
} else {
	console.log("(none)");
}

console.log("\n=== Recommended Next Step ===");
if (status) {
	console.log("Run: npm run validate");
} else {
	console.log("Run: git status --short to verify clean state.");
}
