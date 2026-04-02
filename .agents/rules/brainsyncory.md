

# Project Memory — ebanking
> 450 notes | Score threshold: >40

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

- **gotcha in implementation_plan.md.resolved** — - # Xử lý Lỗi Cấp Quyền Camera (Screen Overlay Detected) trên Android


## Project Standards

- Fixed null crash in Kinh — filters out falsy/null values explicitly — confirmed 3x
- Replaced auth VIEW — adds runtime type validation before use — confirmed 3x
- what-changed in index.html — confirmed 3x
- Fixed null crash in COMPRESS — offloads heavy computation off the main thread — confirmed 3x
- Fixed null crash in Canvas — confirmed 4x
- Patched security issue Khai — prevents XSS injection attacks — confirmed 3x
- Replaced auth TDND — confirmed 3x
- decision in style.css — confirmed 3x

## Known Fixes

- ❌ -     result.message = "GAS Backend Error: " + err.toString(); → ✅ Fixed null crash in Truy — hardens HTTP security headers
- ❌ - async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý... → ✅ Patched security issue VERSION — offloads heavy computation off the main thread
- ❌ -     } catch(err) { console.error(err); } → ✅ Fixed null crash in DEBUG — adds runtime type validation before use
- ❌ -     - [ ] Add error feedback if a record is not found. → ✅ problem-fix in task.md
- ❌ -     } catch(e) { console.error(e); } → ✅ Fixed null crash in Modal

## Recent Decisions

- Optimized Ebanking — hardens HTTP security headers
- decision in walkthrough.md.resolved
- Optimized Blueprint — hardens HTTP security headers
- Optimized Vercel — offloads heavy computation off the main thread

## Learned Patterns

- When encountering this, fix by: Fixed null crash in DataTable — prevents XSS injection attacks (seen 2x)
- Agent generates new migration for every change (squash related changes)
- Agent installs packages without checking if already installed

## Available Tools (ON-DEMAND only)
- `query(q)` — Deep search when stuck
- `find(query)` — Full-text lookup
> Context above IS your context. Do NOT call load() at startup.
