

# Project Memory — HoKinhDoanh
> 198 notes | Score threshold: >40

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

## 📝 NOTE: 1 uncommitted file(s) in working tree.\n\n## Important Warnings

- **⚠️ GOTCHA: Replaced auth Walkthrough — prevents XSS injection attacks** — - # Walkthrough:### Summary of Definitive Fix: Full ES5 Sanitization
+

## Project Standards

- Strengthened types Khai
- Fixed null crash in NONE — adds runtime type validation before use — confirmed 5x
- Replaced auth Inter — adds runtime type validation before use — confirmed 3x
- Strengthened types Scripts — adds runtime type validation before use
- Strengthened types Module — adds runtime type validation before use
- Fixed null crash in HACK — hardens HTTP security headers — confirmed 3x
- Added session cookies authentication — evolves the database schema to support... — confirmed 3x
- Fixed null crash in HtmlService — confirmed 3x

## Known Fixes

- ❌ +     Logger.log("doGet Error: " + e.message); → ✅ Fixed null crash in TDND — wraps unsafe operation in error boundary
- ❌ -     Logger.log("doGet Error: " + e.message); → ✅ Fixed null crash in HtmlService
- ❌ -     return { status: "error", message: "Lỗi lấy dữ liệu Admin: " + e.message }; → ✅ Fixed null crash in HACK — adds runtime type validation before use

## Recent Decisions

- decision in frmDashboard.html
- decision in frmMyCustomers.html

## Learned Patterns

- When encountering this, fix by: Fixed null crash in AppState — wraps unsafe operation in error boundary (seen 2x)
- Avoid: ⚠️ GOTCHA: Replaced auth Open (seen 2x)
- Always: Strengthened types Scripts — adds runtime type validation before use (seen 2x)
- Agent generates new migration for every change (squash related changes)
- Agent installs packages without checking if already installed

## Available Tools (ON-DEMAND only)
- `query(q)` — Deep search when stuck
- `find(query)` — Full-text lookup
> Context above IS your context. Do NOT call load() at startup.
