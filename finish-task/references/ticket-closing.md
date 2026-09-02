# Finish Task — Ticket Closing

This document defines how an agent should close out a ticket created by `/to-tickets` once its implementation has merged.

This closes the loop the planning layer opened. It does not redefine what the ticket asked for, and it does not reopen scope.

## 1. Check Whether a Closing Keyword Already Handled It

Before doing anything, check whether the merged PR used a closing keyword (see [pull-requests.md](pull-requests.md) §8).

If it did, and the provider supports automatic closing, the ticket/issue is already closed. Do not close it again or treat the absence of a manual close as a problem.

What a closing keyword does **not** do, regardless of provider:

- it does not check off the ticket's acceptance-criteria checkboxes;
- it does not update a `Status:` line on a local Markdown ticket.

The remaining sections in this document apply regardless of whether a closing keyword already fired.

## 2. Resolve Acceptance Criteria

Fetch the ticket body and compare each acceptance-criteria checkbox against what was actually implemented and verified (not merely attempted).

```markdown
- [x] Acceptance criterion 1
- [ ] Acceptance criterion 2
```

Check off only criteria that were genuinely met. If a criterion was not met, do not check it and do not close the ticket as fully resolved — report the gap instead (see section 5).

Do not check a box based on intent or a partial implementation.

## 3. Close by Tracker Convention

Follow whichever tracker convention `/setup-matt-pocock-skills` configured for this repository:

- **GitHub / GitLab (or another provider with native closing):** if a closing keyword did not already close it, close explicitly (e.g. `gh issue close <n> --comment "..."`), referencing the merged PR.
- **Local Markdown tracker:** the `to-tickets` ticket template has no terminal status value defined in `triage-labels.md` today (it only covers `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). Until the project's `triage-labels.md` is extended with a terminal value, record completion as a `Status: done` line directly in the ticket file and note in your report that no canonical label exists yet for this state. Do not invent a different ad hoc label per ticket.

## 4. Preserve the Ticket as a Record

Do not delete a completed local-tracker ticket file. It is historical record, the same way a merged PR is not deleted.

Do not rewrite the ticket's original acceptance criteria to match what was actually built; if scope changed during implementation, note the deviation instead of editing history quietly.

## 5. When a Ticket Cannot Be Fully Closed

If some acceptance criteria remain unmet, or the ticket depends on work not yet merged:

- do not close it;
- report exactly which criteria are unmet;
- leave its status as whatever accurately reflects the remaining work (e.g. still `ready-for-agent` if more implementation is needed).

Do not close a ticket to make a task feel finished when the work it described is not.

## 6. Ticket-Closing Checklist

- [ ] a closing keyword's effect, if any, was checked before acting;
- [ ] acceptance criteria were checked off only when genuinely met;
- [ ] the tracker's actual closing mechanism was used, not an invented one;
- [ ] the ticket record was preserved, not deleted or silently rewritten;
- [ ] any unmet criteria were reported, not hidden by closing anyway.
