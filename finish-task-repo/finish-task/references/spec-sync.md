# Finish Task — Spec and Context-Doc Sync

This document defines a trigger, not content. It does not own the spec (`/to-spec`'s domain), and it does not own a living context document such as `CLAUDE.md`/`AGENTS.md` (a separate, project-specific concern — see the project's own convention for who curates that file).

Its only job is to make sure the question gets asked before a task is considered finished, and to route the answer to the party that actually knows the content.

## 1. Ask the Question

After implementation is merged and the ticket is resolved (or reported unresolved, per [ticket-closing.md](ticket-closing.md)), ask:

Does this change alter something the spec, `CLAUDE.md`, or `AGENTS.md` currently claims about the project — its public contract, its documented architecture, its current state, or a convention future agents will rely on?

## 2. When to Skip

Skip the update when the change is internal and does not alter any claim those documents make: a refactor with no behavior change, a test-only change, a dependency bump with no contract impact, a fix that restores documented behavior rather than changing it.

Do not update a context document merely because a change happened. A living document loses value if every merge pads it.

## 3. When to Update

Update when the change:

- alters a public interface, API, or user-facing behavior the spec describes;
- introduces, removes, or replaces a convention, tool, or architectural decision the context document currently states as fact;
- makes a documented limitation or TODO obsolete;
- changes something a future agent reading the context document would otherwise act on incorrectly.

## 4. Who Writes the Update

This document does not draft the update itself. The party that implemented the change — the active implementation workflow (e.g. `/implement`) — knows what was actually built and drafts it.

This document's role ends at raising the question and confirming, before the task is reported finished, that it was either answered with an update or explicitly judged unnecessary per section 2.

## 5. Where the Update Lands

Per the project's chosen convention (confirm with the user if unclear for this repository): typically in the same PR as the code change it describes, not a separate one — see [pull-requests.md](pull-requests.md). Splitting it into a later PR reopens the exact staleness window this trigger exists to close.

## 6. Spec-Sync Checklist

- [ ] the question in section 1 was asked, not skipped by default;
- [ ] a skip decision was made deliberately against section 2, not out of convenience;
- [ ] when an update was warranted, it was drafted by the party with actual knowledge of the change, not invented here;
- [ ] the update, when made, landed in the same PR as the change it describes.
