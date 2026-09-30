# Finish Task — Safety

This document defines the safety rules for any agent performing Git lifecycle operations.

The goal is to preserve user work, repository integrity, automation compatibility, and collaboration history while allowing the agent to manage branches, commits, pushes, pull requests, merges, and cleanup safely.

## 1. Scope

These rules apply to Git lifecycle operations only.

They do not define:

- requirements;
- architecture;
- implementation strategy;
- task decomposition;
- TDD methodology;
- code-review methodology;
- product decisions.

If another project skill or repository instruction owns one of those concerns, defer to it.

## 2. Precedence

Before prescribing a Git convention, discover and follow the repository's existing policy.

Use this precedence order:

1. explicit user instruction for the current task;
2. repository governance and protected-branch/ruleset requirements;
3. repository-local instructions such as `AGENTS.md`, `CONTRIBUTING.md`, or equivalent;
4. established repository conventions observable from branches, PRs, and automation;
5. defaults from this skill.

Never replace a valid repository convention merely because this skill prefers another default — except for commit and PR-title format.

**Commit and PR-title format is decided only by levels 1–3.** The style of existing commit history is weak evidence and does not override this skill's Conventional Commits + emoji default. When no formal rule exists, apply the default and state in the report that history did not conform.

## 3. Inspect Before Mutating

Before a Git operation that changes state, establish the current context.

At minimum inspect:

```bash
git status --short --branch
git branch --show-current
git remote -v
```

When relevant, also inspect:

```bash
git diff
git diff --staged
git log --oneline --decorate -n 10
git worktree list
```

Determine:

- current branch;
- upstream branch;
- whether the working tree is clean;
- staged versus unstaged changes;
- untracked files;
- remotes;
- whether a worktree is already in use;
- whether current changes clearly belong to the active task.

Do not mutate repository state until ambiguity that could cause data loss is resolved.

## 4. Preserve Unrelated Work

A multi-agent or human-plus-agent repository may contain changes created by someone else.

Never assume that all modified, staged, or untracked files belong to the current task.

Do not:

- stage unrelated changes;
- commit unrelated changes;
- revert unrelated changes;
- discard unrelated changes;
- overwrite unrelated staged state;
- move unrelated work between branches;
- include unrelated work in a pull request.

Prefer path-specific staging and explicit inspection over broad commands.

Avoid using:

```bash
git add .
git add -A
```

when the working tree contains changes whose ownership or task relationship is uncertain.

If ownership cannot be established safely, preserve the changes and operate only on files that are clearly in scope.

## 5. Commit-Message Safety and Automation Compatibility

Commit-message decoration must never break repository automation.

When this skill's default commit style is used, the Conventional Commit type MUST remain the first token:

```text
feat(auth): ✨ add refresh-token rotation
fix(api): 🐛 reject expired tokens
docs: 📝 document local setup
```

Do not place the emoji before the type:

```text
✨ feat(auth): add refresh-token rotation
```

unless the repository explicitly defines that format and its tooling supports it.

The standardized emojis are a human-readable visual layer. They must not replace:

- the commit type;
- the optional scope;
- the breaking-change marker;
- machine-readable footers.

Do not introduce arbitrary emojis when a repository uses commit linting or release automation unless the resulting format is known to be accepted.

If commit linting or release automation rejects the emoji, or it is unknown whether it is accepted, keep the Conventional Commit and omit the emoji (`feat(auth): add refresh-token rotation`). If a formal rule requires a different format entirely, follow that rule.

## 6. Protected and Default Branches

Treat the repository's default branch and protected branches as shared infrastructure.

Do not push directly to `main`, `master`, or another protected/default branch unless:

1. repository policy explicitly permits it; and
2. the user's request clearly requires it.

The default workflow is a short-lived topic branch followed by a pull request.

Do not bypass branch protections, required checks, required reviews, merge queues, or other repository gates.

Administrative ability to bypass a rule is not permission to do so.

## 7. Destructive Operations

The following operations are destructive or potentially destructive and require special care:

```bash
git reset --hard
git clean -f
git clean -fd
git checkout -- <path>
git restore <path>
git restore --source=<commit> <path>
git branch -D <branch>
git push --force
git push -f
```

Do not use a destructive operation merely for convenience.

Before using one:

1. identify exactly what data or history will be removed or replaced;
2. verify that the affected work belongs to the current task;
3. prefer a non-destructive alternative;
4. obtain explicit user approval when uncommitted work or published history could be lost.

Never use `git reset --hard` or `git clean -fd` to "get back to a clean state" when unrelated local work exists.

## 8. History Rewrites and Force Push

Never use plain:

```bash
git push --force
git push -f
```

If rewriting a published topic branch is actually necessary and repository policy permits it, use:

```bash
git push --force-with-lease
```

Prefer a form that protects the expected remote ref when practical.

A force update must not be used on:

- the default branch;
- a protected branch;
- a shared long-lived branch;
- a branch that may contain collaborators' unpublished-to-you commits.

If the remote branch has advanced unexpectedly, stop and inspect before pushing again.

## 9. Rebase, Merge, and Shared History

Do not rebase or otherwise rewrite commits that are shared with collaborators unless the repository convention supports it and the consequences are understood.

Before rebasing a published branch:

- fetch the remote;
- inspect divergence;
- verify branch ownership;
- verify whether other contributors are using the branch.

Prefer preserving shared history over producing a cosmetically cleaner history.

## 10. Configuration

Do not modify global Git configuration.

Never change settings such as:

```bash
git config --global ...
```

unless the user explicitly asks for that configuration change.

Repository-local Git configuration may be changed only when:

- it is necessary for the requested Git lifecycle task;
- the effect is understood;
- it does not silently weaken safety or verification.

Do not disable hooks, signing, checks, or protections to make an operation succeed.

Do not use `--no-verify` unless the user explicitly authorizes bypassing the relevant verification and the repository policy allows it.

## 11. Secrets and Sensitive Files

Before committing or pushing, inspect staged changes for accidental credentials or sensitive data.

Watch for:

- API keys;
- access tokens;
- passwords;
- private keys;
- `.env` files;
- cloud credentials;
- authentication cookies;
- generated secrets;
- files explicitly excluded by repository policy.

If a likely secret is detected:

1. do not commit or push it;
2. remove it from the proposed commit without destroying the user's local copy;
3. report the risk clearly.

If a secret was already published, do not assume deleting it in a later commit is sufficient. Treat credential rotation and history remediation as a separate security task.

## 12. Worktrees

Git worktrees are optional isolation tools, not a mandatory workflow.

Consider a worktree when:

- multiple agents are working in parallel;
- unrelated tasks need isolated working directories;
- switching branches would disturb active local changes.

Before creating one:

```bash
git worktree list
```

Do not create nested or redundant worktrees without a clear need.

Do not remove a worktree until:

- its relevant changes are committed or otherwise safely preserved;
- its branch is no longer needed there;
- no active agent or user process still depends on it.

## 13. Fetching and Synchronization

Fetching is normally safe and should be preferred over commands that implicitly merge or rebase.

Prefer:

```bash
git fetch --prune
```

before decisions involving remote state.

Do not run an automatic `git pull` when the merge/rebase behavior is unknown and local changes are present.

Determine the repository's preferred synchronization strategy first.

## 14. Failure Handling

If a Git operation fails:

1. inspect the repository state;
2. explain the cause from observable evidence;
3. preserve local work;
4. choose the least destructive recovery path.

Do not chain increasingly destructive commands merely to make the error disappear.

For conflicts, preserve conflict markers and context until the conflict is intentionally resolved.

## 15. Reporting

Never claim that an operation succeeded unless its resulting state was verified.

Examples:

- after commit, verify the commit exists and inspect status;
- after push, verify upstream state;
- after PR creation/update, verify the PR target and head branches;
- after merge, verify the target branch contains the change;
- after cleanup, verify the intended branch/worktree was removed.

Report material exceptions, skipped gates, unresolved checks, or assumptions.
