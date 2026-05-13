import { spawnSync } from "node:child_process";

function parseArgs(argv) {
	const args = argv.slice(2);
	const options = {};
	for (let i = 0; i < args.length; i++) {
		if (args[i] === "--message" && i + 1 < args.length) {
			options.message = args[++i];
		} else if (args[i] === "--files" && i + 1 < args.length) {
			options.files = args[++i];
		}
	}
	return options;
}

function run(cmd, args, opts = {}) {
	const result = spawnSync(cmd, args, { encoding: "utf-8", shell: true, ...opts });
	if (result.error) {
		console.error(`Error running ${cmd} ${args.join(" ")}: ${result.error.message}`);
		process.exit(1);
	}
	return result;
}

const options = parseArgs(process.argv);

if (!options.message) {
	console.error("Error: --message is required.");
	process.exit(1);
}

if (!options.files || options.files.trim().length === 0) {
	console.error("Error: --files is required and must not be empty.");
	process.exit(1);
}

const files = options.files
	.split(",")
	.map((f) => f.trim())
	.filter(Boolean);

for (const file of files) {
	if (file === "." || file === "-A") {
		console.error(`Error: Refusing to stage "${file}". Use explicit file paths.`);
		process.exit(1);
	}
}

console.log("Running validation...");
const validateResult = run("npm", ["run", "validate"]);
if (validateResult.status !== 0) {
	console.error("Validation failed. Fix errors before committing.");
	console.error(validateResult.stderr || validateResult.stdout);
	process.exit(1);
}

console.log("\nGit status:");
const statusResult = run("git", ["status", "--short"]);
console.log(statusResult.stdout || "(clean)");

console.log("\nStaging files...");
for (const file of files) {
	const addResult = run("git", ["add", file]);
	if (addResult.status !== 0) {
		console.error(`Failed to stage ${file}`);
		console.error(addResult.stderr || addResult.stdout);
		process.exit(1);
	}
}

console.log("\nStaged files:");
const stagedResult = run("git", ["diff", "--cached", "--name-only"]);
console.log(stagedResult.stdout || "(none)");

console.log("\nCommitting...");
const commitResult = run("git", ["commit", "-m", options.message]);
if (commitResult.status !== 0) {
	console.error("Commit failed.");
	console.error(commitResult.stderr || commitResult.stdout);
	process.exit(1);
}

console.log("\nSuccess: Commit created.");
