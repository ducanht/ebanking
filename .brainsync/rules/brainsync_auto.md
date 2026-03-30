

# Project Memory — ebanking
> 232 notes | Score threshold: >40

## Safety — Never Run Destructive Commands

> Dangerous commands are actively monitored.
> Critical/high risk commands trigger error notifications in real-time.

- **NEVER** run `rm -rf`, `del /s`, `rmdir`, `format`, or any command that deletes files/directories without EXPLICIT user approval.
- **NEVER** run `DROP TABLE`, `DELETE FROM`, `TRUNCATE`, or any destructive database operation.
- **NEVER** run `git push --force`, `git reset --hard`, or any command that rewrites history.
- **NEVER** run `npm publish`, `docker rm`, `terraform destroy`, or any irreversible deployment/infrastructure command.
- **NEVER** pipe remote scripts to shell (`curl | bash`, `wget | sh`).
- **ALWAYS** ask the user before running commands that modify system state, install packages, or make network requests.
- When in doubt, **show the command first** and wait for approval.

**Stack:** Unknown stack

## 📝 NOTE: 1 uncommitted file(s) in working tree.\n\n## Project Standards

- Patched security issue CCCD — adds runtime type validation before use — confirmed 4x
- Strengthened types Admin — adds runtime type validation before use
- what-changed in app.js — confirmed 7x
- what-changed in index.html — confirmed 6x
- problem-fix in task.md.resolved — confirmed 4x
- Patched security issue DataTable — prevents XSS injection attacks — confirmed 3x
- Strengthened types Walkthrough
- Patched security issue Date — prevents XSS injection attacks — confirmed 3x

## Known Fixes

- ❌ -     result.message = "GAS Backend Error: " + err.toString(); → ✅ Fixed null crash in Truy — hardens HTTP security headers
- ❌ - async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý... → ✅ Patched security issue VERSION — offloads heavy computation off the main thread
- ❌ -     - [ ] Add error feedback if a record is not found. → ✅ problem-fix in task.md

## Recent Decisions

- Optimized Danh — ensures atomic multi-step database operations
- decision in app.js
- decision in style.css
- decision in style.css

## Verified Best Practices

- Agent generates new migration for every change (squash related changes)
- Agent installs packages without checking if already installed

## Available Tools (ON-DEMAND only)
- `query(q)` — Deep search when stuck
- `find(query)` — Full-text lookup
> Context above IS your context. Do NOT call load() at startup.
