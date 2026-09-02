# Finish Task — Version Bump

This document defines the mechanical procedure for bumping a project's version number.

It governs execution only. [release-notes.md](release-notes.md) §3 governs the decision of whether and how versioning policy applies to this repository; this document does not override that.

## 1. This Is the Same Event as the Changelog Cut

A version bump happens at the same moment `## Unreleased` in [changelog.md](changelog.md) §4 is retitled into a version heading. Do not bump the manifest on one occasion and cut the changelog on another; they describe the same release.

## 2. Follow Repository Convention First

Before computing anything, discover:

- the manifest file that holds the canonical version (`package.json`, `pyproject.toml`, `Cargo.toml`, `VERSION`, or another repository-specific location);
- existing versioning tooling (e.g. Changesets, release-please, semantic-release, `npm version`, `cargo release`);
- whether the repository follows Semantic Versioning or another scheme.

If tooling already computes and writes the bump, prefer invoking it over hand-editing the manifest.

## 3. Compute the Bump From Commit Types

When no tooling exists, compute the bump size from the commit types recorded since the previous tag, using the same classification `commits.md` already defines:

- any commit with a breaking-change marker (`!` or a `BREAKING CHANGE:` footer) → **MAJOR**;
- otherwise, any `feat` commit → **MINOR**;
- otherwise (only `fix`, `perf`, `refactor`, `docs`, `chore`, etc.) → **PATCH**.

Use the single highest-severity commit found; one breaking commit outweighs any number of `feat`/`fix` commits.

```bash
git log --oneline <previous-tag>..HEAD
```

## 4. Confirm Before Writing

Present the computed bump (current version → proposed version, and the commit(s) that justified the severity) before writing it.

This document does not decide policy on its own behalf; it presents a computed default. Follow the precedence already established in [release-notes.md](release-notes.md) §3: repository policy first, explicit user decision when policy is silent.

## 5. Write the Bump

Update the version field in the discovered manifest file only. Do not touch unrelated fields in the same file.

Do not commit this change bundled with unrelated code changes; it belongs in the release-cut PR alongside the changelog retitle, per [pull-requests.md](pull-requests.md).

## 6. Tagging Is a Separate, Later Action

Writing the bump does not create a Git tag and does not publish anything. Tagging follows the same authority rule as merge (see [safety.md](safety.md) §2 and [release-notes.md](release-notes.md) §6): only when explicitly requested or clearly delegated.

## 7. Version-Bump Checklist

- [ ] repository versioning tooling/convention was discovered and preferred over hand-editing when it exists;
- [ ] the bump size was computed from actual commit classification, not guessed;
- [ ] the computed bump was presented and confirmed before writing;
- [ ] only the version field was changed in the manifest;
- [ ] no tag was created as an automatic consequence of this step.
