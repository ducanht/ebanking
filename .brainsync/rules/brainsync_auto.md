

# Project Memory — ebanking
> 112 notes | Score threshold: >40

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

## 📝 NOTE: 1 uncommitted file(s) in working tree.\n\n## Active: `.`

- **what-changed in index.html — confirmed 3x**
- **convention in index.html**
- **Replaced auth CCCD — adds runtime type validation before use — confirmed 3x**
- **Strengthened types Kinh — adds runtime type validation before use**
- **Strengthened types GIAN — adds runtime type validation before use**

## Project Standards

- what-changed in index.html — confirmed 3x
- convention in index.html
- Replaced auth CCCD — adds runtime type validation before use — confirmed 3x
- Strengthened types Kinh — adds runtime type validation before use
- Strengthened types GIAN — adds runtime type validation before use
- Strengthened types Nguoi — adds runtime type validation before use
- Strengthened types Modal — adds runtime type validation before use
- Strengthened types Kinh — adds runtime type validation before use

## Known Fixes

- ❌ - async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý... → ✅ Patched security issue VERSION — offloads heavy computation off the main thread

## Recent Decisions

- decision in style.css
- decision in style.css

## Verified Best Practices

- Agent generates new migration for every change (squash related changes)
- Agent installs packages without checking if already installed

## Available Tools (ON-DEMAND only)
- `query(q)` — Deep search when stuck
- `find(query)` — Full-text lookup
> Context above IS your context. Do NOT call load() at startup.
