# 🏁 finish-task

An [Agent Skill](https://agentskills.io) that safely finishes an already-implemented software change: 🌿 Git lifecycle (branches, commits, pushes, pull requests, CI gates, merges, worktrees, cleanup), 🎫 ticket closing, 📝 spec/context-doc sync triggering, 📓 changelog maintenance, and 🔖 release version bumps/notes at a version cut.

Written to be tool-neutral from the start — the same `SKILL.md` and its `references/` are followed identically by Claude Code, Codex CLI, Antigravity, Cursor, OpenCode, or any other [Agent Skills](https://agentskills.io)-compatible coding agent. See [🧭 Portability](#-portability) for the one thing that does *not* carry over automatically between them.

It does **not** own the software-development lifecycle that produced the change — requirements, planning, implementation strategy, TDD, and code-review methodology stay with whatever workflow you already use for those.

## 📦 Install

Requires [Node.js](https://nodejs.org) 16.7+ (already a prerequisite for every tool below) and `git`. Individual references may expect `gh` (GitHub CLI) if you use its GitHub-specific guidance.

### 🎯 Which command is for me?

| You use... | Run this |
|---|---|
| 🟣 Claude Code, 🖱️ Cursor, or 🟪 OpenCode | `npx github:tadeununes/finish-task` |
| 🟢 Codex CLI | `npx github:tadeununes/finish-task --target=codex` |
| 🔴 Antigravity | `npx github:tadeununes/finish-task --target=antigravity` |

Cursor and OpenCode both read Claude Code's skill directory for compatibility, and also Codex's — so either command above already works for them. No separate target needed. See the [table further down](#-troubleshooting-skill-not-appearing) for the full directory-by-directory breakdown.

### ⚡ Install

```bash
npx github:tadeununes/finish-task
```

npx will ask to confirm the first time it fetches the package — that's normal. This installs at `~/.claude/skills/finish-task`, for **all your projects**.

Other scopes:

```bash
npx github:tadeununes/finish-task --project                # current project only, instead of global
npx github:tadeununes/finish-task --target=codex --project # e.g. Codex, current project only
```

`--target` and `--project`/`--global` combine freely. Run `npx github:tadeununes/finish-task --help` for the full list.

### 🔄 Update

Re-run the same command you used to install, with the same `--target` / `--project` flags:

```bash
npx github:tadeununes/finish-task
```

The installer replaces the existing copy and prints the installed version (`Installed finish-task v2.1.0 ...`). The previous copy is backed up to your OS temp folder (`finish-task-backups/`), **outside** the skills directory, so it can't shadow the new one. Then restart your agent/session.

Upgrading from **2.0.x**: older installer versions left a `finish-task.bak.<timestamp>` folder next to the install. Delete any such folder from your skills directory — it contains its own `SKILL.md` and can cause duplicate or missing skills.

**What's new in 2.1.0:** Conventional Commits + emoji (`feat(scope): ✨ description`) is now the default for commit messages and PR titles. Only an explicit instruction, an enforced rule (commitlint, a ruleset), or written instructions (`AGENTS.md`, `CONTRIBUTING.md`) override it — the style of past commits no longer does. If tooling rejects emoji, it keeps Conventional Commits and drops the emoji.

### 🛠️ Manual (any other Agent Skills-compatible tool)

Clone the repo and copy the `finish-task/` folder into that tool's own skills directory:

```bash
git clone https://github.com/tadeununes/finish-task.git
cp -r finish-task/finish-task /path/to/your/tool/skills/finish-task
```

### 🤝 Alternative: the community `skills` CLI

The [`skills` CLI](https://github.com/Harries/skills-cli) supports installing into many more agents than this repo targets directly:

```bash
npx skills add tadeununes/finish-task
```

This is third-party tooling, not maintained here — worth knowing about, but you're trusting its code to run on your machine. The commands above are self-contained and only touch the directory they tell you about.

### ✅ After installing

1. **Restart** your agent/session — a brand-new top-level skills directory is only picked up at start, not mid-session.
2. **Confirm it loaded** — ask `What skills are available?`, or run `/doctor` in Claude Code. To confirm the version, check `metadata.version` in the installed `SKILL.md` (should be `2.1.0`).
3. **Invoke it explicitly** — `/finish-task` (or your tool's equivalent mention). See [🔒 Why explicit invocation only](#-why-explicit-invocation-only).

## 🗂️ Structure

```
finish-task/
├── SKILL.md                    orchestrator — 18 numbered steps + a separate Release Lifecycle
└── references/
    ├── safety.md                precedence, destructive-operation guardrails, recovery
    ├── commits.md                Conventional Commits + emoji profile (default; only formal rules override it)
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

In **Claude Code**, `disable-model-invocation: true` in `SKILL.md`'s frontmatter enforces this — the skill mechanically cannot fire on its own. On other tools, this behavior is a matter of following the instructions above rather than a mechanical guarantee — see the next section.

## 🧭 Portability

This skill's content — the numbered steps, the reference files, the guardrails — is plain markdown. Any tool that reads `SKILL.md` files gets the same instructions, and several already discover this exact repository automatically without any extra step:

- **Cursor** and **OpenCode** both read `.claude/skills/` and `.agents/skills/` (project and global) for compatibility, alongside their own native skill directories.
- **Antigravity**'s project scope (`.agents/skills/`) is the same directory Codex CLI uses.

What is **not** portable: `disable-model-invocation: true`. It's a Claude Code-specific extension to the Agent Skills spec — outside Claude Code, only `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools` are guaranteed to be honored. Concretely:

- **OpenCode**'s own docs state unrecognized frontmatter fields are silently ignored — `disable-model-invocation` included. Its native skill tool can select `finish-task` on its own if a prompt matches the description.
- **Cursor**'s skill docs describe automatic selection by the agent, with no documented flag to opt a skill out of that. Assume the same until confirmed otherwise.

If you install this on a tool other than Claude Code, **confirm independently how that tool controls automatic skill invocation** before assuming `finish-task` won't fire on its own.

## 🩺 Troubleshooting: skill not appearing

- **Check the path.** The command name comes from the directory name, not the `name:` field in `SKILL.md`. It must be exactly `finish-task/SKILL.md` under one of the directories below — no leftover folder from a previous version alongside it (for example `finish-task.bak.*` left by installer 2.0.x — delete it).

  | Tool | Project scope | Global scope |
  |---|---|---|
  | 🟣 Claude Code | `.claude/skills/` | `~/.claude/skills/` |
  | 🟢 Codex CLI | `.agents/skills/` | `~/.agents/skills/` |
  | 🔴 Antigravity | `.agents/skills/` | `~/.gemini/antigravity/skills/` |
  | 🖱️ Cursor | `.cursor/skills/` or `.agents/skills/` | `~/.cursor/skills/` or `~/.agents/skills/` |
  | 🟪 OpenCode | `.opencode/skills/` or `.agents/skills/` | `~/.config/opencode/skills/` or `~/.agents/skills/` |

  Cursor and OpenCode also read the Claude Code and Codex rows above, which is why the two commands in [Which command is for me?](#-which-command-is-for-me) already cover five tools.

- **Restart after install.** A newly created top-level skills directory needs a session restart to be discovered; edits to an already-watched directory are picked up live.
- **Validate the YAML frontmatter.** A single unquoted `key: value` pair with a stray `: ` inside the value (a colon followed by a space) breaks the whole frontmatter block silently. Claude Code degrades gracefully — the command still works, but `description` and flags like `disable-model-invocation` are lost; other tools reading the same file may not degrade as gracefully. If you edit the description, wrap it in quotes. Verify with:

  ```bash
  python3 -c "import yaml; yaml.safe_load(open('finish-task/SKILL.md').read().split('---')[1])"
  ```

  A silent failure here is the most likely cause of a working `/finish-task` command that mysteriously stopped enforcing `disable-model-invocation`.

## 📄 License

Not yet set — add one before relying on this being reusable by others.
