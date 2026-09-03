---
name: finish-task
description: "Safely finishes an already-implemented software change — Git lifecycle (branches, commits, pushes, pull requests, CI gates, merges, worktrees, cleanup), ticket closing, spec/context-doc sync triggering, changelog maintenance, and release version bumps/notes at a version cut. Use when an agent needs to inspect repository state, prepare Conventional Commits, push, create/update a pull request, verify merge readiness, merge when authorized, close the originating ticket, trigger a spec/CLAUDE.md/AGENTS.md sync check, update the changelog, or clean up. This skill governs finishing a task, not the software-development lifecycle that produced it: it does not own requirements, planning, implementation strategy, TDD, or code-review methodology."
disable-model-invocation: true
metadata:
  version: "2.0.0"
---

# Finish Task

Use this skill to move an already-defined software change safely to completion — from repository-state inspection through commit, pull request, merge, ticket closing, spec/context-doc sync triggering, changelog upkeep, and cleanup.

This skill's instructions and references are written to be tool-neutral — the same guidance applies whether followed by Claude Code, Codex, Antigravity, OpenCode, or another Agent Skills-compatible coding agent.

What is **not** guaranteed to carry over is the `disable-model-invocation` control below: it is a Claude Code-specific extension to the [Agent Skills](https://agentskills.io) spec, not part of the open standard. On another tool, confirm independently how that tool controls automatic skill invocation before relying on this skill never firing on its own.

## Core Boundary

This skill owns **finishing a task**: the Git lifecycle plus the closeout work that a merge alone does not complete. It does not own the **software-development lifecycle** that produced the change.

### In scope

- repository-state inspection;
- remote/default-branch discovery;
- branch creation and management;
- short-lived topic branches;
- optional worktree isolation;
- safe synchronization with remotes;
- selective staging;
- commit creation and amendment;
- Conventional Commit formatting;
- standardized commit emojis;
- push operations;
- pull-request creation and updates;
- CI/status-check verification;
- review and merge-gate verification;
- merge execution when authorized;
- branch/worktree cleanup;
- Git safety and recovery decisions;
- changelog maintenance following a merge;
- release-notes drafting at a version cut;
- version-bump execution at a version cut;
- ticket closing and acceptance-criteria resolution, deferring to tracker-native mechanisms;
- triggering (not authoring) a spec/`CLAUDE.md`/`AGENTS.md` sync check.

### Out of scope

Do not use this skill to define or override:

- requirements;
- brainstorming;
- architecture;
- domain modeling;
- specifications;
- task decomposition;
- implementation strategy;
- TDD methodology;
- test-design methodology;
- code-review methodology;
- product decisions.

When another skill, repository instruction, or user workflow owns those concerns, defer to it. If an engineering workflow is already active, this skill should complement it at the Git boundary rather than replace or restart it.

Ticket closing and spec-sync triggering are the two exceptions noted above: this skill executes the closing mechanics and asks the sync question, but it does not author ticket scope, spec content, or context-document content — see [references/ticket-closing.md](references/ticket-closing.md) and [references/spec-sync.md](references/spec-sync.md) for exactly where that line sits.

## Policy Precedence

Observe before prescribing.

Use this precedence order:

1. explicit user instruction for the current task;
2. repository governance, protected-branch rules, and provider rulesets;
3. repository-local instructions such as `AGENTS.md`, `CONTRIBUTING.md`, or equivalent;
4. established repository conventions observable from branches, commits, pull requests, and automation;
5. defaults from this skill.

Do not replace a valid repository convention with this skill's preference.

## Progressive References

Load only the references needed for the current Git operation.

### For state-changing, risky, destructive, multi-agent, or worktree operations

Read [references/safety.md](references/safety.md).

It defines repository inspection, preservation of unrelated work, destructive-operation rules, force-push constraints, secrets handling, multi-agent safety, worktree safety, and recovery.

### For staging, committing, or amending

Read [references/commits.md](references/commits.md).

It defines atomic commits, selective staging, Conventional Commits, scopes, breaking changes, signing, and the standardized type/emoji profile.

### For pushing, PRs, CI gates, merge, or cleanup

Read [references/pull-requests.md](references/pull-requests.md).

It defines branch defaults, push behavior, PR titles/descriptions, CI/review gates, merge strategy, merge authority, and cleanup.

### For updating the changelog after a merge

Read [references/changelog.md](references/changelog.md).

It defines the changelog format, the type-to-category mapping, and when an entry is warranted.

### For drafting release notes at a version cut

Read [references/release-notes.md](references/release-notes.md).

It defines how release notes differ from the changelog, where content is sourced from, and the authority required to publish.

### For bumping the version at a release cut

Read [references/version-bump.md](references/version-bump.md).

It defines how to compute the bump size from commit history and where to write it.

### For closing the originating ticket after merge

Read [references/ticket-closing.md](references/ticket-closing.md).

It defines how closing keywords interact with tracker-native closing, how to resolve acceptance-criteria checkboxes, and what to do when a ticket cannot be fully closed.

### For checking whether spec/context docs need updating

Read [references/spec-sync.md](references/spec-sync.md).

It defines the trigger question and when to skip it. It does not draft content.

Do not load all references merely because the skill activated. Use progressive disclosure.

## Lifecycle Model

A normal change moves approximately through:

```text
inspect repository
        ↓
identify policy and requested endpoint
        ↓
select/create topic branch
        ↓
optional worktree isolation
        ↓
implementation happens elsewhere
        ↓
spec/context-doc sync check
        ↓
inspect diff
        ↓
selective staging
        ↓
atomic commit(s)
        ↓
push topic branch
        ↓
create/update pull request
        ↓
CI + required reviews + conversations
        ↓
repository-approved merge strategy
        ↓
verify merge
        ↓
close originating ticket
        ↓
update changelog
        ↓
safe cleanup
```

This is a lifecycle model, not a requirement to execute every stage on every invocation.

## Respect the Requested Endpoint

Determine how far the user or active workflow asked the agent to go.

Examples:

- `commit these changes` → stop after a verified commit;
- `commit and push` → stop after the verified push;
- `open a PR` → create or update the PR and report its state;
- `get this ready to merge` → satisfy or inspect gates but do not merge without authority;
- `finish the Git lifecycle` → continue through merge and safe cleanup when gates and authority permit it.

Do not silently expand a request into later lifecycle stages.

In particular:

- committing does not automatically authorize pushing;
- pushing does not automatically authorize creating a PR;
- creating a PR does not automatically authorize merging;
- merging does not authorize destructive cleanup of work that has not been verified as safe to delete.

## Step 1 — Establish Repository State

Before mutating Git state, inspect the repository.

At minimum:

```bash
git status --short --branch
git branch --show-current
git remote -v
```

When relevant:

```bash
git diff
git diff --staged
git log --oneline --decorate -n 10
git worktree list
git fetch --prune
```

Determine:

- current branch;
- upstream;
- default/base branch;
- working-tree cleanliness;
- staged, unstaged, and untracked changes;
- remotes;
- existing worktrees;
- whether an open PR already exists when provider access is available;
- whether current changes clearly belong to the active task.

Never assume the working tree contains only the current agent's work.

## Step 2 — Discover Existing Git Policy

Before choosing naming, commit format, merge method, or synchronization behavior, look for repository policy.

Possible evidence includes:

```text
AGENTS.md
CONTRIBUTING.md
README.md
.github/
.gitlab/
commitlint configuration
release tooling
branch protection / rulesets
recent commit history
recent pull requests
CI configuration
```

If the repository already defines branch naming, commit format, signing, required checks, merge strategy, or release conventions, follow them.

Use this skill's defaults only when a stronger convention cannot be established.

## Step 3 — Preserve Existing and Unrelated Work

Treat a dirty working tree as potentially shared state.

Before staging or modifying Git state, identify which changes belong to the active task.

Never stage, commit, revert, discard, or overwrite unrelated work.

Prefer explicit paths or patch staging. Follow [references/safety.md](references/safety.md).

## Step 4 — Choose Branch and Isolation

Prefer a short-lived topic branch unless repository policy says otherwise.

Do not push directly to a protected/default branch merely for convenience.

If the repository has no branch naming convention, prefer:

```text
feat/passkey-auth
fix/token-expiration
refactor/request-validation
docs/local-setup
chore/dependency-update
```

Include a confirmed ticket or issue identifier when useful:

```text
feat/123-passkey-auth
fix/187-token-expiration
```

Do not invent identifiers.

### Worktrees

Worktrees are optional. Consider one when multiple agents operate in parallel, the current working directory contains unrelated active work, branch switching would disrupt another task, or isolation materially reduces risk.

Do not impose a worktree on every task. Follow [references/safety.md](references/safety.md).

## Step 5 — Hand Off Implementation Concerns

Once the appropriate branch/worktree exists, allow the project's engineering workflow to own implementation.

This skill must not:

- create a competing implementation plan;
- replace another planning skill;
- impose its own TDD loop;
- replace an existing code-review workflow.

When implementation is complete or the user explicitly asks for Git operations, resume the Git lifecycle.

## Step 6 — Sync Spec and Context Docs

Use [references/spec-sync.md](references/spec-sync.md).

Before staging, ask whether this change alters something the spec, `CLAUDE.md`, or `AGENTS.md` currently claims. If yes, the update belongs in the same commit/PR as the code change it describes — do this before staging, not after.

This step only asks the question and confirms it was answered; it does not draft the update itself.

## Step 7 — Inspect Before Staging

Before creating a commit:

```bash
git status --short
git diff
git diff --staged
```

Understand the actual change and identify logical units.

Do not derive a commit message from the task description alone when the diff is available. The commit must describe what was actually changed.

## Step 8 — Stage Selectively and Commit Atomically

Use [references/commits.md](references/commits.md).

Prefer path-specific or patch staging when unrelated work exists.

Default commit shape when the repository has no different convention:

```text
<type>[optional scope][optional !]: <emoji> <description>
```

Standardized defaults:

```text
✨ feat      new capability
🐛 fix       bug fix
📝 docs      documentation
♻️ refactor  restructuring without feature/fix intent
🔧 chore     maintenance
✅ test      tests
⚡️ perf      performance
🎨 style     formatting/code style
📦️ build     build/package tooling
👷 ci        CI/CD
⏪️ revert    revert
```

Keep the Conventional Commit type first so machine-readable tooling remains compatible.

Examples:

```text
feat(auth): ✨ add passkey authentication
fix(api): 🐛 reject expired refresh tokens
docs(readme): 📝 add local development instructions
refactor(core): ♻️ extract command dispatcher
ci(github): 👷 add integration test job
```

Do not place the emoji before the type unless repository policy explicitly requires and validates that format.

## Step 9 — Verify the Commit

After committing:

```bash
git status --short --branch
git show --stat --oneline HEAD
```

Verify that intended files were committed, unrelated files were excluded, remaining local work is preserved, and the message matches the actual change.

Never report a clean working tree merely because the intended commit succeeded.

## Step 10 — Push Safely

Push only when the requested lifecycle scope includes pushing.

For a new topic branch:

```bash
git push -u origin <branch>
```

For an established upstream:

```bash
git push
```

Never use plain `git push --force` or `git push -f`.

If a published topic branch was intentionally rewritten and policy permits it, follow [references/safety.md](references/safety.md) and use `--force-with-lease`.

## Step 11 — Create or Update the Pull Request

Use [references/pull-requests.md](references/pull-requests.md).

Before creating a PR:

- determine the correct base;
- inspect branch commits versus the base;
- inspect the aggregate diff;
- check whether an open PR already exists for the branch.

Do not create duplicate PRs.

Default PR title when the repository has no different convention:

```text
<type>[optional scope][optional !]: <emoji> <description>
```

The PR title represents the principal integrated outcome, not necessarily the most recent commit.

## Step 12 — Treat CI and Reviews as Gates

Required status checks, required reviews, code-owner approvals, unresolved conversations, merge queues, and branch-currentness rules are integration gates.

Do not bypass them because the agent has elevated permissions.

Do not claim a PR is ready to merge while required gates are failing, pending, missing, or unresolved.

If validation fails, inspect evidence before changing code. Follow repository and engineering-workflow validation instructions rather than inventing a competing testing methodology.

## Step 13 — Choose Merge Strategy From Repository Policy

Do not impose squash merge, merge commit, rebase merge, or local rebase-before-merge as a universal rule.

Discover the repository's allowed and preferred strategy.

If multiple strategies are permitted and a stable convention exists, follow it. If the choice materially affects history, release automation, or user intent and no convention exists, surface the choice instead of choosing based on agent preference.

When squash merging causes the PR title to become the final commit message, ensure the final PR title still satisfies the commit convention.

## Step 14 — Verify Authority Before Merge

A technically mergeable PR is not automatically authorized to merge.

Merge only when:

- the user explicitly requested merge; or
- the active workflow clearly delegated the full Git lifecycle;
- repository gates are satisfied;
- no blocking human decision remains.

Otherwise stop at **ready to merge**.

Do not use administrative bypass to manufacture merge readiness.

## Step 15 — Verify Merge

After merge, verify the provider reports the PR as merged.

When practical, verify the target branch contains the integrated change.

Do not infer success merely because a merge command was issued.

## Step 16 — Close the Ticket

Use [references/ticket-closing.md](references/ticket-closing.md).

After a verified merge, resolve the originating ticket: confirm whether a closing keyword already closed it, check off genuinely met acceptance criteria, and close by the tracker's actual mechanism when a keyword did not already do so.

If criteria remain unmet, do not close the ticket — report the gap instead.

## Step 17 — Update the Changelog

Use [references/changelog.md](references/changelog.md).

After a verified merge, add an entry when the change is perceptible to changelog consumers (a `feat`, `fix`, breaking change, or repository-specific criterion).

Do not add an entry for changes the repository convention excludes (typically isolated `chore`, `style`, or `test` commits), and do not fabricate impact the change did not have.

If the repository has no changelog file or tooling and does not request one, skip this step.

## Step 18 — Clean Up Safely

Cleanup is the final lifecycle stage, not an excuse for destructive commands.

After a verified merge, and only when safe:

- delete the remote topic branch if repository policy supports it;
- remove the local topic branch;
- remove an associated worktree;
- prune stale remote-tracking references.

Before deletion, verify no uncommitted or unique work remains.

Do not force-delete a branch/worktree simply because normal cleanup refuses.

Use [references/safety.md](references/safety.md) and [references/pull-requests.md](references/pull-requests.md).

## Release Lifecycle

Release notes and version bumps are not part of the per-change flow above. They are produced at a version cut, not at every merge.

Use [references/release-notes.md](references/release-notes.md) and [references/version-bump.md](references/version-bump.md).

Do not draft/publish release notes or bump the version as an automatic consequence of Step 18. Treat a release as its own request with its own trigger — a requested version cut, a tag, or an explicit instruction.

Source release-notes content from the changelog and the merged pull requests since the previous tag. Do not invent delivered functionality. Compute the version bump from commit history per [references/version-bump.md](references/version-bump.md); do not guess it.

Drafting release notes or computing a bump does not authorize publishing or tagging them, for the same reason drafting a PR does not authorize merging it. Confirm authority before publishing, following the precedence order in [references/safety.md](references/safety.md).

## Multi-Agent Rule

Assume another human or agent may be operating on the repository unless evidence proves otherwise.

The central multi-agent invariant is:

> Never stage, commit, revert, discard, overwrite, rewrite, merge, close, or delete work whose ownership and relationship to the current task have not been established.

When parallel agents need independent branch state, prefer isolated worktrees or other repository-supported isolation.

## Provider Neutrality

This skill defines Git lifecycle behavior, not a mandatory provider CLI.

Use whichever interface is available and appropriate, such as Git CLI, GitHub/GitLab/Bitbucket tooling, IDE/provider integrations, or agent-native repository tools.

Do not require `gh` merely because the repository is hosted on GitHub if another supported interface is already available.

Do not weaken safety rules because a provider tool makes a destructive operation easy.

## Failure Rule

If an operation fails:

1. inspect the current repository state;
2. identify the cause from observable evidence;
3. preserve local and remote work;
4. choose the least destructive recovery path;
5. verify the resulting state.

Do not escalate through destructive commands merely to make Git appear clean.

## Completion Report

When reporting completion, state only what was actually verified.

Depending on the requested endpoint, useful facts include branch/worktree used, commits created, push state, PR state, CI/reviews, merge readiness, merge completion, ticket-closing state, whether a spec/context-doc sync was needed and made, cleanup completion, remaining unrelated local changes, and blockers.

Never claim checks passed, a PR merged, or cleanup completed without verifying it.

## Final Lifecycle Checklist

Before declaring the requested Git lifecycle stage complete, verify the applicable items:

- [ ] repository policy was discovered and followed;
- [ ] unrelated work was preserved;
- [ ] correct branch/base were used;
- [ ] worktree isolation was used only when valuable;
- [ ] staged changes matched the intended logical unit;
- [ ] commit format followed repository policy or this skill's default;
- [ ] standardized emoji matched the commit/PR type when defaults applied;
- [ ] type remained first for automation compatibility;
- [ ] push used the correct upstream and no unsafe force operation;
- [ ] no duplicate PR was created;
- [ ] PR title/description accurately represented the integrated change;
- [ ] required CI checks passed;
- [ ] required reviews/conversations were satisfied;
- [ ] repository-approved merge strategy was used;
- [ ] merge authority existed;
- [ ] merge result was verified;
- [ ] cleanup preserved all remaining work;
- [ ] the spec/context-doc sync question was asked, and answered or deliberately skipped;
- [ ] the originating ticket was closed only if genuinely resolved, by the tracker's actual mechanism;
- [ ] changelog entry was added when applicable;
- [ ] release notes, when requested, were sourced from the changelog and merged PRs rather than invented;
- [ ] the agent stopped at the endpoint actually requested.
