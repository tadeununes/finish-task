# Finish Task — Release Notes

This document defines how an agent should draft, and when it may publish, release notes.

## 1. Release Notes Are Not the Changelog

The changelog (see [changelog.md](changelog.md)) is a developer-facing log, updated continuously, one entry per merge.

Release notes are:

- curated, not exhaustive;
- written for users or stakeholders, not primarily for developers;
- produced at a version cut, not at every merge;
- allowed to reorganize, prioritize, and omit changelog entries that do not matter to the audience.

Do not treat release notes as a reformatted copy of the full changelog. Do not treat a changelog update as a substitute for release notes when the repository or user expects both.

## 2. Follow Repository Convention First

Before drafting, discover:

- where release notes are published (GitHub/GitLab Releases, a docs site, a CHANGELOG "Released" section, a separate `RELEASES.md`, an external tool);
- the repository's versioning scheme (SemVer or otherwise) and who or what assigns the next version;
- existing release-notes tooling (e.g. release-please, semantic-release, changesets);
- the tone and level of detail used in past releases.

If tooling generates release notes automatically from the changelog or commit history, prefer using it over hand-authoring.

## 3. Versioning Is Not This Skill's Decision

This skill does not decide whether a release is major, minor, or patch, and does not choose the next version number on its own.

Follow the repository's versioning policy and tooling. If no policy can be established and a version number is required, surface the choice instead of guessing.

Once a version is confirmed, use [version-bump.md](version-bump.md) for the mechanical procedure of computing and writing the bump. This section governs the decision; that document governs the execution.

Do not tag a release as part of drafting notes; tagging is a separate, explicit action.

## 4. Source Content

Source release notes from:

- the `## Unreleased` section of the changelog being cut into this release;
- the pull requests merged since the previous tag, when more narrative detail is useful than the changelog entries provide.

Do not invent a feature, fix, or behavior change that is not reflected in the changelog or a merged PR.

Do not claim a fix or improvement resolves a user-reported issue unless that link is confirmed.

## 5. Structure

Prefer a structure proportional to the release's size. For a typical release:

```markdown
## v1.4.0 — 2026-08-08

### Highlights

- Passkey authentication is now available for sign-in.

### Breaking Changes

- Webhook requests without a signature version are now rejected. See migration notes below.

### Fixed

- Expired refresh tokens are now rejected instead of silently renewed.

### Full Changelog

See [CHANGELOG.md](../CHANGELOG.md#v140).
```

For a small release, a short highlights list without every section is preferable to a ceremonial template full of empty headings.

Breaking changes and required migration steps must be visible near the top, not buried under routine fixes.

## 6. Authority to Publish

Drafting release notes does not authorize publishing them, tagging a version, or announcing a release, for the same reason drafting a PR does not authorize merging it.

Publish or tag only when:

- the user explicitly requested publishing; or
- the active workflow clearly delegated the full release lifecycle;
- the version and its source content have been confirmed against section 3 and section 4.

Otherwise, stop at a **drafted, ready-for-review** release note and report what remains.

## 7. Release Notes Quality Checklist

Before considering release notes complete, verify:

- [ ] repository convention for publishing location and versioning was discovered and followed;
- [ ] the version number came from repository policy, not agent guesswork;
- [ ] content was sourced from the changelog and/or merged PRs, not invented;
- [ ] breaking changes and migration steps are prominent, not buried;
- [ ] structure is proportional to the release's actual size;
- [ ] publishing/tagging authority was confirmed before any publish action.
