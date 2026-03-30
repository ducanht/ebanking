

# Project Memory — ebanking
> 289 notes | Score threshold: >40

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

- **⚠️ GOTCHA: Added session cookies authentication — adds runtime type validation before use** — -  * NETLIFY HIGH-FIDELITY APP ENGINE (app.js)
+  * MÃ NGUỒN FRONTEND 
- **⚠️ GOTCHA: Patched security issue VERSION — prevents XSS injection attacks** — -     VERSION: "2.1.1-PATCHED",
+     VERSION: "2.1.2-STABLE",
- 
+ //
- **⚠️ GOTCHA: Patched security issue EVENT — prevents XSS injection attacks** — - 
+ // --- CẤU HÌNH EVENT DELEGATION: XỬ LÝ CLICK XEM CHI TIẾT ---
- 

## Active: `netlify-app/js`

- **Fixed null crash in CCCD — offloads heavy computation off the main thread — confirmed 7x**
- **Fixed null crash in Object — offloads heavy computation off the main thread — confirmed 4x**
- **Fixed null crash in Modal — prevents null/undefined runtime crashes**
- **Fixed null crash in Modal — prevents null/undefined runtime crashes**
- **decision in registration.js**

## Project Standards

- Fixed null crash in CCCD — offloads heavy computation off the main thread — confirmed 7x
- Fixed null crash in Object — offloads heavy computation off the main thread — confirmed 4x
- 🟢 Edited netlify-app/app.js (5 changes, 29min) — confirmed 3x
- Patched security issue Normalization — prevents XSS injection attacks — confirmed 3x
- what-changed in index.html — confirmed 3x
- what-changed in app.js — confirmed 7x
- Patched security issue DataTable — prevents XSS injection attacks — confirmed 3x
- Patched security issue Date — prevents XSS injection attacks — confirmed 3x

## Known Fixes

- ❌ -     result.message = "GAS Backend Error: " + err.toString(); → ✅ Fixed null crash in Truy — hardens HTTP security headers
- ❌ - async function runAPI(action, data = {}, successHandler, errorHandler, loadingMsg = 'Đang xử lý... → ✅ Patched security issue VERSION — offloads heavy computation off the main thread
- ❌ -     } catch(err) { console.error(err); } → ✅ Fixed null crash in DEBUG — adds runtime type validation before use
- ❌ -     - [ ] Add error feedback if a record is not found. → ✅ problem-fix in task.md
- ❌ -     } catch(e) { console.error(e); } → ✅ Fixed null crash in Modal

## Recent Decisions

- decision in registration.js
- Optimized Modal — ensures atomic multi-step database operations
- decision in index.html
- decision in app.js

## Verified Best Practices

- Agent generates new migration for every change (squash related changes)
- Agent installs packages without checking if already installed

## Available Tools (ON-DEMAND only)
- `query(q)` — Deep search when stuck
- `find(query)` — Full-text lookup
> Context above IS your context. Do NOT call load() at startup.
