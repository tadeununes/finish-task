# Finish Task — Pull Requests

This document defines how an agent should create, update, validate, merge, and clean up pull requests.

The pull request is the collaboration and integration boundary for a short-lived branch. Repository policy remains authoritative.

## 1. Follow Repository Policy First

Before creating or merging a pull request, discover:

- default/base branch;
- branch protection or ruleset requirements;
- required status checks;
- required approving reviews;
- required code-owner reviews;
- conversation-resolution requirements;
- merge queue requirements;
- allowed merge strategies;
- PR templates;
- title conventions;
- issue-linking conventions.

Do not bypass a repository gate because the agent has permission to do so.

## 2. Branch Model

Default to one short-lived branch for one coherent set of related changes.

If the repository has no naming convention, prefer:

```text
feat/<short-description>
fix/<short-description>
refactor/<short-description>
docs/<short-description>
chore/<short-description>
```

When a confirmed issue/ticket identifier is useful:

```text
feat/123-user-auth
fix/187-token-expiration
```

Do not invent ticket numbers.

Do not rename an established active branch solely to match this default.

## 3. Base Branch

Do not assume the base is `main`.

Determine it from repository configuration and current project practice.

Before opening a PR, fetch current remote state and verify that:

- the head branch is correct;
- the base branch is correct;
- the branch contains only intended commits;
- there are no accidental unrelated changes.

Useful inspection:

```bash
git fetch --prune
git log --oneline <base>..HEAD
git diff --stat <base>...HEAD
git diff <base>...HEAD
```

Use the appropriate remote-tracking base when local base state is stale.

## 4. Push

Push the topic branch using its existing upstream when configured.

For a new branch, setting the upstream is appropriate:

```bash
git push -u origin <branch>
```

Never push directly to a protected/default branch merely to avoid creating a PR.

Never use plain `--force`.

If a published topic branch was intentionally rewritten and force update is permitted, follow `safety.md` and use `--force-with-lease`.

## 5. Create or Update — Do Not Duplicate

Before creating a new PR, determine whether an open PR already exists for the current branch.

If one exists:

- update the existing PR when appropriate;
- do not create a duplicate;
- preserve useful human-authored description content unless the requested change supersedes it.

If no PR exists, create one using the repository's supported provider/UI/CLI.

Do not require a provider-specific CLI such as `gh` when another supported interface is available.

## 6. PR Title

Follow a formal rule first (user instruction, PR-title ruleset/CI check, `AGENTS.md`/`CONTRIBUTING.md`). The style of past PR titles is not a formal rule.

Otherwise, use the same Conventional Commit + emoji profile used for commits (if a squash merge turns the title into the final commit message, the same tooling caveats from `safety.md` §5 apply):

```text
<type>[optional scope][optional !]: <emoji> <description>
```

Examples:

```text
feat(auth): ✨ add refresh-token rotation
fix(dispatch): 🐛 prevent duplicate unit assignment
docs(api): 📝 document webhook authentication
refactor(users): ♻️ extract repository layer
chore(deps): 🔧 update development dependencies
```

Keeping the type first preserves compatibility with repositories that parse PR titles for squash merges, changelogs, or release automation.

Use the standardized mapping from `commits.md`.

Do not place the emoji before the type unless repository policy explicitly requires that format.

Avoid:

```text
✨ feat(auth): add refresh-token rotation
updates
WIP
changes from agent
final fixes
```

Use Draft status, not title prefixes such as `WIP`, when the provider supports drafts.

### PR type and emoji should describe the integrated outcome

A PR may contain commits of multiple types.

Choose the PR title based on the principal integrated outcome.

Example:

```text
feat(auth): ✨ add refresh-token rotation
```

may legitimately contain:

```text
feat(auth): ✨ add refresh-token endpoint
test(auth): ✅ cover token replay scenarios
docs(auth): 📝 document refresh-token flow
```

Do not mechanically copy the last commit message into the PR title.

## 7. PR Description

A useful PR description should help a reviewer understand the change without reconstructing the entire development session.

Prefer these sections when relevant:

```markdown
## Summary

- What changed
- Why it changed

## Validation

- Tests/checks actually run
- Important manual verification

## Notes

- Migration, rollout, compatibility, or review context
```

Include only sections that add value.

For small PRs, a short description is better than a ceremonial template full of empty headings.

Never claim validation that was not performed.

If checks were not run, say so explicitly when that fact matters.

## 8. Issue Linking

Link confirmed related issues/tickets according to repository convention.

Use closing keywords only when the PR truly resolves the issue.

Examples:

```text
Fixes #123
Closes #123
Refs #123
```

Do not infer or fabricate issue relationships.

A closing keyword, once merged, closes the linked issue automatically on providers that support it. That satisfies the closing half of ticket resolution on its own.

It does not check off the ticket's acceptance-criteria checkboxes, and it has no equivalent on trackers without automatic closing keywords (e.g. most local Markdown trackers). Use [references/ticket-closing.md](ticket-closing.md) for that remaining work, and to avoid closing a ticket a second time that a keyword already closed.

## 9. Draft Pull Requests

Use a draft PR when the change should be visible or receive early feedback but is not ready to merge.

A draft may be appropriate when:

- implementation is intentionally incomplete;
- required validation is still pending;
- design feedback is requested before completion.

Do not mark a PR ready merely because code has been pushed.

## 10. Review Feedback

When review feedback changes the branch:

1. understand the requested change;
2. modify only relevant code;
3. run appropriate validation;
4. commit the response coherently;
5. push the update;
6. verify the PR updated.

Do not automatically resolve a review conversation merely because code changed.

Resolve conversations only when:

- the concern has actually been addressed; and
- repository workflow allows the author/agent to resolve it.

Do not dismiss or override a blocking review to accelerate merge.

## 11. Status Checks and CI

Treat required checks as merge gates.

Before declaring a PR ready to merge, inspect all required statuses.

A required check must satisfy the repository's accepted successful state.

Do not merge when a required check is:

- failing;
- cancelled in a way the repository does not accept;
- still pending;
- missing;
- stale where repository rules require an updated branch.

If a check fails:

1. inspect the failure;
2. determine whether it is caused by the current change;
3. fix only when within the task's scope;
4. rerun or wait for the provider to rerun according to repository workflow;
5. verify the resulting status.

Do not bypass CI to complete the lifecycle.

## 12. Reviews and Conversations

Before merge, satisfy all repository-required reviews.

Verify:

- required approval count;
- code-owner approval when required;
- latest-push approval requirements when configured;
- unresolved blocking conversations;
- requested changes.

Do not self-approve on behalf of a human reviewer.

Do not use administrator bypass merely because it is technically available.

## 13. Keeping the Branch Current

If repository policy requires the branch to be current with the base branch, update it using the project's preferred strategy.

Possible strategies include:

- rebase;
- merge from base;
- provider-native update-branch operation;
- merge queue.

Do not impose rebase universally.

Before rewriting a published branch, apply the safety rules in `safety.md`.

After updating the branch, re-check CI and review requirements because repository rules may invalidate previous approvals or checks.

## 14. Merge Strategy

The repository chooses the merge strategy.

Do not impose one universal policy.

Use the allowed and preferred strategy discovered from repository settings and conventions:

- merge commit;
- squash merge;
- rebase merge;
- merge queue or provider-managed integration.

If more than one strategy is allowed and no preference can be established, do not choose based on agent taste. Prefer the repository's recent convention or ask only when the choice materially changes history or release semantics.

Do not locally manufacture a merge commit to bypass PR protections.

## 15. Authority to Merge

Creating and updating a PR does not automatically imply permission to merge it.

Merge when:

- the user explicitly requested completion through merge; or
- the active task/instruction clearly delegates the full Git lifecycle to the agent;
- all repository gates are satisfied;
- no blocking human decision remains.

Otherwise, stop at **ready to merge** and report the remaining human action.

Never merge a PR with unresolved required checks or reviews.

## 16. Merge Verification

After merge, verify the provider reports the PR as merged and, when practical, confirm the target branch contains the integrated change.

Do not infer success from a CLI command's invocation alone.

Record or report:

- PR merged or ready-to-merge state;
- target branch;
- merge strategy when relevant;
- any unusual gate or exception.

## 17. Cleanup

After a verified merge, clean up only resources that are no longer needed.

Typical cleanup:

- delete the remote topic branch when repository policy supports it;
- remove the local topic branch when safe;
- remove an associated worktree when safe;
- prune stale remote-tracking references.

Before deleting a local branch or worktree, verify there is no uncommitted or unique work remaining.

Do not use forced branch deletion merely because normal deletion refuses.

If cleanup could destroy unmerged work, preserve it and report the situation.

## 18. PR Lifecycle Checklist

Before considering the lifecycle complete, verify:

- [ ] correct head branch;
- [ ] correct base branch;
- [ ] no duplicate PR;
- [ ] PR title follows a formal rule if one exists;
- [ ] otherwise PR title uses `type(scope): emoji description` (even if past PR titles did not);
- [ ] standardized emoji matches the PR's principal type;
- [ ] type remains first for automation compatibility;
- [ ] title and description accurately describe the change;
- [ ] only intended commits/files are included;
- [ ] confirmed issues are linked correctly;
- [ ] required checks pass;
- [ ] required reviews are satisfied;
- [ ] required conversations are resolved;
- [ ] branch-currentness requirement is satisfied;
- [ ] repository-approved merge strategy is used;
- [ ] merge authority exists;
- [ ] merge result is verified;
- [ ] branch/worktree cleanup preserves all remaining work.
