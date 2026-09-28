# Project instructions

## GitHub PR workflow

- For general GitHub PR triage, use the GitHub plugin `github` skill first.
- For publishing local changes to a PR, use the GitHub plugin `yeet` skill.
- Before changing branches, rewriting PR branches, or force-pushing, check the current PR conflict/merge state with GitHub, for example `gh pr view <pr> --json mergeStateStatus,mergeable,headRefName,headRefOid,url`.
- If conflicts exist, rebase or replay only the intended changes onto the current base branch before pushing, then confirm mergeability again.
- Never reset, revert, or publish unrelated user work.

## Development standards

- Before substantial feature work, define objective, scope, constraints, and verification commands. Establish a baseline when the change is measurable.
- Prefer one hypothesis per focused, reviewable iteration. Keep changes that improve or preserve the intended result without fragile complexity.
- Name in-scope and out-of-scope files before broad edits. Do not modify generated files, secrets, dependency manifests, deployment configuration, or public APIs unless required by the task.
- Keep durable development standards in this file.
- Use a fixed verification budget. This repository has a package-lock.json and no lint script: use `npm run check`, `npm run build`, and a targeted browser check for web changes. Do not add a linter or switch package managers just for copy changes.
- Documentation-only work requires review of references and scope; do not install dependencies or run application builds solely for prose changes.
- Do not install dependencies or alter global environment state without a concrete reason tied to the task.
- Report changes, checks run, and unverified behavior. Distinguish local checks from publication and live verification.

## Content work

- The current repositioning proposal is in `docs/copy-plan.md`. It is a draft, not an approved commercial specification.
- Do not present template logos, testimonials, metrics, pricing, or portfolio items as Peracto evidence.
- Validate names, professional experience, case-study status, outcomes, and publication permission before using them as proof.
- Keep development, embedded engineering, fractional leadership, and executive advisory distinct in responsibility.
- Preserve the current visual identity during content changes unless the user requests a redesign.
- Verify contact destinations and navigation. Never invent email addresses, calendar URLs, clients, or commercial commitments.
