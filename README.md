# 🏁 finish-task

An [Agent Skill](https://agentskills.io) that safely finishes an already-implemented software change: 🌿 Git lifecycle (branches, commits, pushes, pull requests, CI gates, merges, worktrees, cleanup), 🎫 ticket closing, 📝 spec/context-doc sync triggering, 📓 changelog maintenance, and 🔖 release version bumps/notes at a version cut.

Built and tested against **Claude Code**. Its instructions are written to be tool-neutral, so Codex, Antigravity, OpenCode, and other Agent Skills-compatible agents can follow the same guidance — see [🧭 Portability](#-portability) for the one thing that does *not* carry over automatically.

It does **not** own the software-development lifecycle that produced the change — requirements, planning, implementation strategy, TDD, and code-review methodology stay with whatever workflow you already use for those.

## 📦 Install

Requires [Node.js](https://nodejs.org) 16.7+ (already a prerequisite for Claude Code, Codex, and Antigravity themselves) and `git`. Individual references may expect `gh` (GitHub CLI) if you use its GitHub-specific guidance.

### ⚡ One-liner (recommended)

```bash
npx github:<your-username>/finish-task
```

npx will ask to confirm the first time it fetches the package — that's normal. This installs for **Claude Code**, for **all your projects**, at `~/.claude/skills/finish-task`.

Other tools and scopes:

```bash
npx github:<your-username>/finish-task --target=codex          # OpenAI Codex CLI
npx github:<your-username>/finish-task --target=antigravity    # Google Antigravity
npx github:<your-username>/finish-task --project                # current project only, instead of global
```

`--target` and `--project`/`--global` combine freely. Run `npx github:<your-username>/finish-task --help` for the full list.

### 🛠️ Manual (any other Agent Skills-compatible tool)

Clone the repo and copy the `finish-task/` folder into that tool's own skills directory:

```bash
git clone https://github.com/<your-username>/finish-task.git
cp -r finish-task/finish-task /path/to/your/tool/skills/finish-task
```

### 🤝 Alternative: the community `skills` CLI

The [`skills` CLI](https://github.com/Harries/skills-cli) supports installing into many more agents than this repo targets directly:

```bash
npx skills add <your-username>/finish-task
```

This is third-party tooling, not maintained here — worth knowing about, but you're trusting its code to run on your machine. The one-liner above is self-contained and only touches the directory it tells you about.

### ✅ After installing

1. **Restart** your agent/session — a brand-new top-level skills directory is only picked up at start, not mid-session.
2. **Confirm it loaded** — ask `What skills are available?`, or run `/doctor` in Claude Code.
3. **Invoke it explicitly** — `/finish-task`. It will not trigger on its own in Claude Code (see below).

## 🗂️ Structure

```
finish-task/
├── SKILL.md                    orchestrator — 18 numbered steps + a separate Release Lifecycle
└── references/
    ├── safety.md                precedence, destructive-operation guardrails, recovery
    ├── commits.md                Conventional Commits + emoji profile
    ├── pull-requests.md          branching, push, PR lifecycle, CI/review gates, merge, cleanup
    ├── spec-sync.md               triggers (does not author) a spec/CLAUDE.md/AGENTS.md review
    ├── ticket-closing.md         closes the originating ticket by the tracker's actual mechanism
    ├── changelog.md               maintains an Unreleased section per merge
    ├── release-notes.md          drafts release notes at a version cut
    └── version-bump.md           computes and writes a SemVer bump at a version cut
```

`SKILL.md` uses progressive disclosure: it only reads the reference file relevant to the step it's on, not all of them at once.

## 🔒 Why explicit invocation only

Every side-effectful step here — committing, pushing, opening a PR, merging, closing a ticket, tagging a release — is gated behind an explicit request. The skill stops and reports a "ready" state rather than continuing on its own judgment (see `safety.md` §2 for the full precedence order, and "Respect the Requested Endpoint" in `SKILL.md`). Typical usage is two separate messages, not one:

```
/finish-task
```

review what it reports, then:

```
/finish-task merge PR #<n>
```

## 🧭 Portability

This skill's content — the numbered steps, the reference files, the guardrails — is plain markdown. Any tool that reads `SKILL.md` files gets the same instructions.

What is **not** portable: `disable-model-invocation: true` in `SKILL.md`'s frontmatter, which is what stops Claude Code from ever running this on its own. It's a Claude Code-specific extension to the Agent Skills spec — outside Claude Code, only `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools` are guaranteed to be honored. If you install this on Codex, Antigravity, or another tool, **confirm independently how that tool controls automatic skill invocation** before assuming `finish-task` won't fire on its own.

## 🩺 Troubleshooting: skill not appearing

- **Check the path.** The command name comes from the directory name, not the `name:` field in `SKILL.md`. It must be exactly `finish-task/SKILL.md` under the target directory for your tool (see the table below) — no leftover folder from a previous version alongside it.

  | Tool | Project scope | Global scope |
  |---|---|---|
  | Claude Code | `.claude/skills/` | `~/.claude/skills/` |
  | Codex CLI | `.agents/skills/` | `~/.agents/skills/` |
  | Antigravity | `.agents/skills/` | `~/.gemini/antigravity/skills/` |

- **Restart after install.** A newly created top-level skills directory needs a session restart to be discovered; edits to an already-watched directory are picked up live.
- **Validate the YAML frontmatter.** A single unquoted `key: value` pair with a stray `: ` inside the value (a colon followed by a space) breaks the whole frontmatter block silently. Claude Code degrades gracefully — the command still works, but `description` and flags like `disable-model-invocation` are lost; other tools reading the same file may not degrade as gracefully. If you edit the description, wrap it in quotes. Verify with:

  ```bash
  python3 -c "import yaml; yaml.safe_load(open('finish-task/SKILL.md').read().split('---')[1])"
  ```

  A silent failure here is the most likely cause of a working `/finish-task` command that mysteriously stopped enforcing `disable-model-invocation`.

## 📄 License

Not yet set — add one before relying on this being reusable by others.
