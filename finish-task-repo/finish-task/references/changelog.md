# Finish Task — Changelog

This document defines how an agent should maintain a changelog after a merge.

The changelog is a developer-facing, per-merge log. It is distinct from release notes, which are curated, per-version, and user/stakeholder-facing. See [release-notes.md](release-notes.md) for that boundary.

## 1. Follow Repository Convention First

Before adding an entry, inspect the repository's existing conventions.

Look for:

- an existing `CHANGELOG.md` and its current format;
- changelog tooling (e.g. Changesets, release-please, semantic-release, auto-generated changelogs from commit history);
- `CONTRIBUTING.md` or `AGENTS.md` instructions about changelog maintenance;
- CI jobs that generate or validate the changelog.

If the repository already defines a changelog format or generates it automatically from commit history, follow that mechanism rather than hand-editing the file.

Otherwise, use the [Keep a Changelog](https://keepachangelog.com/) structure and the defaults in this document.

## 2. When to Add an Entry

Add a changelog entry after a verified merge when the change is perceptible to changelog consumers.

Typically warrants an entry:

- `feat`;
- `fix`;
- a breaking change of any type;
- `perf` when the improvement is user-perceptible.

Typically does not warrant an entry, unless repository convention says otherwise:

- isolated `chore`, `style`, `ci`, or `build` changes with no externally visible effect;
- `test`-only changes;
- `docs`-only changes, unless the repository treats documentation as changelog-worthy.

When uncertain, prefer omission over a noisy entry. A changelog that lists every commit stops being useful.

## 3. Type-to-Category Mapping

When the repository has no different convention, map the commit type used in `commits.md` to a Keep a Changelog category:

- ✨ `feat` → **Added**
- 🐛 `fix` → **Fixed**
- ♻️ `refactor` / ⚡️ `perf` → **Changed**
- a breaking change (any type) → **Changed**, with the breaking impact called out explicitly in the entry text
- a removed capability → **Removed**
- a security-relevant fix → **Security**

Use the narrowest accurate category. Do not invent a category outside the repository's established set.

## 4. The Unreleased Section

Maintain an `## Unreleased` section at the top of the changelog for merged changes that have not yet been cut into a version.

Add new entries under `## Unreleased`, grouped by category:

```markdown
## Unreleased

### Added

- Passkey authentication for sign-in.

### Fixed

- Reject expired refresh tokens instead of silently renewing them.
```

At a version cut, `## Unreleased` is retitled to the new version heading (see [release-notes.md](release-notes.md) for how that cut is authorized, and [version-bump.md](version-bump.md) for bumping the version manifest as the same event) and a fresh empty `## Unreleased` is opened above it.

Do not cut a version heading as part of routine changelog maintenance; that is a release action.

## 5. Entry Language

Write entries for a changelog reader, not for someone reading the diff.

Prefer:

```markdown
### Fixed

- Reject expired refresh tokens instead of silently renewing them.
```

Avoid:

```markdown
### Fixed

- fix(auth): reject expired refresh tokens
- Updated token validation logic in auth service
```

Guidelines:

- describe the observable effect of the change, not the implementation;
- use plain, direct wording;
- one entry per logical change, matching the atomic commit it came from;
- do not copy the raw commit subject verbatim when it is implementation-focused rather than outcome-focused;
- do not fabricate user impact, metrics, or scope the change did not have.

## 6. Linking Back

When useful and consistent with repository convention, link each entry to its PR or issue:

```markdown
- Reject expired refresh tokens instead of silently renewing them. ([#123](../../pull/123))
```

Do not fabricate PR or issue numbers.

## 7. Changelog Quality Checklist

Before considering the changelog update complete, verify:

- [ ] repository convention or tooling was followed, or discovered to be absent;
- [ ] the entry is warranted by section 2;
- [ ] the category matches the type-to-category mapping;
- [ ] the entry describes observable effect, not implementation;
- [ ] the entry sits under `## Unreleased`, not under an already-cut version;
- [ ] no fabricated impact, metrics, or links were added.
