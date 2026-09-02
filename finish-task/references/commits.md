# Finish Task — Commits

This document defines how an agent should prepare, create, format, and verify commits.

The objective is a history that is safe, reviewable, visually scannable on GitHub, understandable to humans, and compatible with Conventional Commits tooling and release automation.

## 1. Follow Repository Convention First

Before creating commits, inspect the repository's existing conventions.

Look for:

- `CONTRIBUTING.md`;
- `AGENTS.md`;
- commit lint configuration;
- release tooling;
- recent commit history;
- issue or ticket conventions;
- signing requirements.

If the repository already defines a commit format, use it.

Otherwise, use the Conventional Commits + standardized emoji profile in this document.

## 2. Commit Only Task-Related Changes

A commit must contain only changes that belong to the same logical unit of work.

Before staging:

```bash
git status --short
git diff
git diff --staged
```

Do not assume that all local changes belong to the task.

Prefer explicit staging:

```bash
git add path/to/file
git add path/to/other-file
```

Use patch staging when a file contains both related and unrelated changes:

```bash
git add -p
```

Do not use broad staging commands when unrelated work may exist.

## 3. Atomic Commits

Prefer commits that represent one coherent reason for change.

A good commit should be understandable as:

> one logical change that could be reviewed or reverted without dragging unrelated work with it.

Split changes when they have independent intent.

Examples of potentially separate units:

- a behavioral feature;
- an unrelated bug fix;
- a refactor not required by the feature;
- documentation unrelated to the implementation;
- dependency maintenance unrelated to the task.

Do not split changes mechanically just to create more commits.

Tests that directly specify the behavior introduced by a change may belong in the same logical commit when that matches repository practice.

## 4. Conventional Commits Default

When the repository has no different convention, use Conventional Commits 1.0.0 with the standardized emoji profile:

```text
<type>[optional scope][optional !]: <emoji> <description>

[optional body]

[optional footer(s)]
```

Preferred types:

- ✨ `feat` — user-visible or externally meaningful new capability;
- 🐛 `fix` — bug correction;
- ♻️ `refactor` — code change that neither adds a feature nor fixes a bug;
- ⚡️ `perf` — performance improvement;
- 🎨 `style` — formatting or code style changes with no behavior change;
- ✅ `test` — test-only change;
- 📝 `docs` — documentation-only change;
- 📦️ `build` — build system or dependency/build tooling change;
- 👷 `ci` — CI/CD configuration or automation;
- 🔧 `chore` — maintenance not better represented by another type;
- ⏪️ `revert` — reverts an earlier change.

The Conventional Commit type MUST remain the first token; the emoji is a visual enhancement, not a replacement for the machine-readable type. Do not place the emoji before the type unless the repository explicitly defines and validates that alternative format.

Use the narrowest accurate type.

Do not label a change `feat` merely because substantial work was involved.

## 5. Scope

A scope is optional.

Use it only when it helps identify the affected subsystem:

```text
feat(auth): ✨ add refresh-token rotation
fix(dispatch): 🐛 prevent duplicate assignment
refactor(api): ♻️ extract request validation
```

Prefer scopes already established by repository history.

Do not invent highly granular scopes that make the convention noisy.

## 6. Subject Line

Write the subject as a concise description of what the commit does.

Prefer:

```text
fix(auth): 🐛 reject expired refresh tokens
```

Avoid:

```text
fix stuff
updates
changes
wip
final fix
more changes
```

Guidelines:

- use imperative or direct action-oriented wording;
- be specific;
- avoid a trailing period unless repository convention uses one;
- do not repeat the type in the description;
- describe the change, not the activity of editing files.

## 7. Commit Body

Use a body when the reason, trade-off, migration impact, or non-obvious behavior matters.

A useful body explains **why**, not a line-by-line summary of the diff.

Example:

```text
fix(auth): 🐛 reject reused refresh tokens

Persist the token family identifier so a replay can invalidate the
remaining family instead of issuing another access token.
```

Do not invent motivations, test results, issue numbers, or operational impact.

## 8. Breaking Changes

When a change is intentionally breaking and the repository uses Conventional Commits, express it using `!` and/or a `BREAKING CHANGE:` footer as appropriate.

Example:

```text
feat(api)!: ✨ require versioned webhook signatures
```

or:

```text
feat(api): ✨ require versioned webhook signatures

BREAKING CHANGE: webhook requests without a signature version are rejected.
```

Do not mark a change as breaking unless its compatibility impact has been established.

## 9. Issue and Ticket References

Reference an issue or ticket when:

- the user provided it;
- the current branch/PR clearly identifies it;
- repository convention requires it.

Do not fabricate identifiers.

Examples:

```text
Refs #123
Fixes #123
```

Use auto-closing keywords only when the commit or PR truly resolves the referenced issue and repository practice supports it.

## 10. Co-Authorship and Attribution

Do not add `Co-authored-by`, generated-by, AI attribution, or similar trailers unless:

- repository policy requires them; or
- the user explicitly asks for them.

Do not impersonate a human contributor.

Preserve existing authorship and signing conventions.

## 11. Signed Commits

If the repository requires signed commits, follow the configured signing mechanism.

Do not disable signing to make a commit succeed.

If signing is required but unavailable in the current environment, report the blocker instead of silently producing a non-compliant commit.

## 12. Validation Before Commit

Before committing:

1. inspect staged files;
2. inspect the staged diff;
3. verify no unrelated changes are staged;
4. check for obvious secrets or generated artifacts that should not be committed;
5. run required pre-commit validation when defined by repository policy.

Useful commands:

```bash
git diff --staged --stat
git diff --staged
```

Do not claim that tests, linting, type checks, or builds passed unless they were actually executed and their result observed.

This file does not prescribe a development testing methodology; it only requires truthful reporting and compliance with repository gates.

## 13. Creating the Commit

Create the commit only after the staged diff matches the intended logical change.

Example:

```bash
git commit -m "fix(auth): 🐛 reject expired refresh tokens"
```

For a body, prefer a mechanism that preserves deliberate formatting rather than constructing an opaque shell one-liner.

Do not use `--no-verify` to bypass hooks unless explicitly authorized and permitted by repository policy.

## 14. Amending Commits

Amending an unpublished commit may be appropriate when it fixes:

- the commit message;
- an accidentally omitted file;
- a small correction that belongs to the same logical unit.

Before amending, determine whether the commit has already been pushed or shared.

Do not amend published/shared history casually.

If an amend requires updating a remote branch, follow the history-rewrite safety rules in `safety.md`.

## 15. Verification After Commit

After committing, verify the result:

```bash
git status --short --branch
git show --stat --oneline HEAD
```

Confirm:

- the intended files are included;
- unrelated files are not included;
- the message is accurate;
- remaining local changes are preserved.

Do not report a clean working tree if unrelated or intentionally uncommitted changes remain.

## 16. Commit Quality Checklist

Before considering the commit complete, verify:

- [ ] repository convention was followed;
- [ ] only task-related changes were staged;
- [ ] the commit is a coherent logical unit;
- [ ] the message describes the actual change;
- [ ] Conventional Commits was used when no stronger repository convention exists;
- [ ] the standardized emoji matches the selected type;
- [ ] the type remains the first token for automation compatibility;
- [ ] no fabricated issue IDs or validation claims were added;
- [ ] required hooks/signing were respected;
- [ ] no obvious secrets were committed;
- [ ] post-commit state was verified.
