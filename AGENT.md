# Agent Instructions

## Session Startup

- Read `plan/plan.md` before starting any implementation work.
- Use `plan/plan.md` as the source of truth for current priorities, status, and scope.
- If the user asks for work that conflicts with `plan/plan.md`, clarify the new priority before editing code.

## Work Discipline

- Focus on exactly one plan step at a time.
- Do not start another plan step until the current one is completed, blocked, or explicitly paused by the user.
- Keep edits scoped to the active step.
- Prefer small, reviewable changes over broad rewrites.
- Preserve a runnable application after every step. If a step cannot be completed without temporarily breaking the app, split it into smaller runnable substeps before editing.
- Prioritize documentation and verification scripts before feature work when the repo lacks a reliable setup/test baseline.

## Plan Maintenance

- Treat `plan/plan.md` as a live TODO list.
- Before starting a step, mark the active TODO as in progress.
- After completing a step, mark it done and add a short note if useful.
- If a step changes because of implementation findings, update `plan/plan.md` immediately.
- If new required work is discovered, add it to `plan/plan.md` under the most relevant section.

## Documentation Maintenance

- Whenever code behavior, setup, environment variables, API usage, or demo flow changes, update the related documentation in the same session.
- Keep README and setup docs aligned with the actual implementation.
- Do not leave docs describing old commands, old URLs, or unfinished behavior as if they are complete.

## Verification

- Run the smallest relevant verification for the active step.
- Verify that the application still runs or builds after each completed step, using the command listed in `plan/plan.md` for that step when available.
- Record important verification commands or manual checks in `plan/plan.md` when they matter for future sessions.
- If verification cannot be run, note the reason in the final response and, when useful, in `plan/plan.md`.
