export const TAINTED_SOURCES: string[] = [
	"github.event.issue.title",
	"github.event.issue.body",
	"github.event.pull_request.title",
	"github.event.pull_request.body",
	"github.event.comment.body",
	"github.event.review.body",
	"github.event.review_comment.body",
	"github.event.head_commit.message",
	"github.event.commits",
	"github.head_ref",
	"github.ref_name",
	"github.event.pull_request.head.ref",
];

export const PROMPT_SINKS: string[] = [
	"prompt",
	"instruction",
	"instructions",
	"custom_instructions",
	"system_prompt",
	"user_prompt",
	"message",
	"task",
	"direct_prompt",
	"claude_args",
	"codex_args",
	"agent_args",
];

export const AGENT_KEYWORDS: string[] = [
	"claude",
	"claude-code",
	"anthropic",
	"codex",
	"openai",
	"copilot",
	"cursor",
	"aider",
	"opencode",
	"gemini",
	"amp",
];

export const DANGEROUS_PERMISSIONS: string[] = [
	"contents: write",
	"pull-requests: write",
	"issues: write",
	"actions: write",
	"id-token: write",
];
