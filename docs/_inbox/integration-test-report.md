# Dashboard Runner Integration Test Report

**Date:** 2026-01-31
**Tester:** integration-tester
**Status:** BLOCKED - Module Loading Error

## Executive Summary

**Tests Passed:** 0/7
**Tests Failed:** 0/7
**Tests Blocked:** 7/7

**Blocking Issue:** ERR_PACKAGE_PATH_NOT_EXPORTED - dashboard-runner package cannot be loaded by Electron main process due to CommonJS/ESM mismatch.

---

## Test Environment

- **Base Path:** `/Users/jean-patricksmith/digital/leviathan/core/agent-harness/vendor/AgentPing/`
- **Electron Version:** 28.3.3
- **Node Version:** (detected from Electron)
- **Platform:** macOS (Darwin 24.6.0)

---

## Blocking Issue Details

### Error
```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in
/Users/jean-patricksmith/digital/leviathan/core/agent-harness/vendor/AgentPing/packages/studio/node_modules/dashboard-runner/package.json
```

### Root Cause
1. **studio/package.json** declares `"type": "commonjs"`
2. **dashboard-runner/package.json** declares `"type": "module"`
3. **dashboard-runner exports** only define "import" path, missing "require" field
4. **Compiled dashboard-manager.js** uses `require("dashboard-runner")` (CommonJS)
5. Node's module loader rejects the require() call for ESM-only package

### Evidence
- **Compiled output:** `/packages/studio/dist/main/dashboard-manager.js` line 8:
  ```javascript
  const dashboard_runner_1 = require("dashboard-runner");
  ```
- **Package exports:** dashboard-runner/package.json exports field has no "require" option
- **Process check:** Electron process started but crashed during main process initialization

---

## Test Results

### Test #1: Dashboard Manager Starts on App Launch
**Status:** BLOCKED
**Expected:** DashboardManager initialized in app.whenReady() hook
**Actual:** Cannot verify - app crashes before dashboard manager initialization

**Code Review:**
- ✅ `packages/studio/src/main/index.ts:323-330` - Proper initialization code exists
- ✅ Error handling with try/catch implemented
- ✅ Logging statements present for debugging
- ❌ **Runtime:** Module loading failure prevents execution

**File:** `packages/studio/src/main/index.ts:323-330`

---

### Test #2: Auto-Restart with Backoff (1s → 2s → 4s)
**Status:** BLOCKED
**Expected:** Process restarts with exponential backoff on crash
**Actual:** Cannot verify runtime behavior

**Code Review:**
- ✅ Dashboard config defines backoff: `[1000, 2000, 4000, 8000, 16000]` ms
- ✅ Event handlers for `process_crashed`, `restart_success`, `restart_failed`
- ✅ DashboardRunner class imported and instantiated correctly in source
- ❌ **Runtime:** Cannot observe actual restart behavior

**Config Evidence:**
- `packages/dashboard-runner/config/dashboards.yaml` - All 6 dashboards have `restart_policy.enabled: true`
- Backoff sequences configured per dashboard

---

### Test #3: Port Conflict Handling
**Status:** BLOCKED
**Expected:** Auto-select next port from port_range on conflict
**Actual:** Cannot verify runtime behavior

**Code Review:**
- ✅ All dashboards define `port_range` arrays in config
- ✅ Example: AgentPing Storybook `port_range: [6006, 6010]`
- ✅ Event handler for `port_changed` event implemented
- ❌ **Runtime:** Cannot trigger port conflicts to test

**Config Evidence:**
- 6 dashboards configured with port ranges
- Navigator: `port_range: [5180, 5184]`
- Flight Deck: `port_range: [3001, 3005]`

---

### Test #4: Restart Button Works from UI
**Status:** BLOCKED
**Expected:** IPC handler `dashboard:restart` calls `dashboardManager.restart(id)`
**Actual:** Cannot verify - UI cannot communicate with crashed main process

**Code Review:**
- ✅ IPC handler registered: `packages/studio/src/main/index.ts:254-262`
- ✅ Handler calls `dashboardManager.restart(dashboardId)`
- ✅ Error handling returns success/error response
- ❌ **Runtime:** Renderer process cannot send IPC messages to crashed main process

**File:** `packages/studio/src/main/index.ts:254-262`

---

### Test #5: Logs Appear in `~/.local/share/lev/dashboard-runner/logs/`
**Status:** BLOCKED
**Expected:** Log files created for each dashboard
**Actual:** Log directory not created - dashboard runner never initializes

**Filesystem Check:**
```
$ ls -la ~/.local/share/lev/
drwxr-xr-x  4 auth
drwxr-xr-x  4 daemon
```

- ❌ No `dashboard-runner/` directory
- ❌ No log files present
- **Reason:** DashboardRunner constructor never executes due to module loading failure

---

### Test #6: Real-Time Status Updates (No Page Refresh)
**Status:** BLOCKED
**Expected:** IPC events forwarded from main to renderer via `sendToAllWindows()`
**Actual:** Cannot verify event forwarding

**Code Review:**
- ✅ All 6 event types forwarded to renderer:
  - `dashboard:process_started`
  - `dashboard:process_crashed`
  - `dashboard:restart_success`
  - `dashboard:restart_failed`
  - `dashboard:health_check_failed`
  - `dashboard:port_changed`
- ✅ `sendToAllWindows()` implementation handles destroyed windows
- ❌ **Runtime:** Events never fire because dashboard runner doesn't start

**File:** `packages/studio/src/main/dashboard-manager.ts:30-68`

---

### Test #7: Graceful Shutdown (All Child Processes Killed)
**Status:** BLOCKED
**Expected:** `dashboardManager.stop()` called on app quit
**Actual:** Cannot verify cleanup behavior

**Code Review:**
- ✅ Cleanup registered in `app.on('before-quit')` hook
- ✅ Cleanup registered in `app.on('window-all-closed')` hook
- ✅ `dashboardManager.stop()` awaited before quit
- ✅ Logging confirms shutdown sequence
- ❌ **Runtime:** Cannot trigger app quit to observe cleanup

**Files:**
- `packages/studio/src/main/index.ts:350-354` - window-all-closed handler
- `packages/studio/src/main/index.ts:356-365` - before-quit handler

---

## Configuration Analysis

### Dashboards Configured (6 Total)
1. **AgentPing Storybook** - Port 6006, backoff: [1s, 2s, 4s, 8s, 16s]
2. **Sofia UI Storybook** - Port 6007, backoff: [1s, 2s, 4s, 8s, 16s]
3. **Flight Deck Dashboard** - Port 3001, backoff: [2s, 4s, 8s]
4. **CEO Stack** - Port 3003, backoff: [2s, 4s, 8s]
5. **Jarvis Voice Dashboard** - Port 8080, backoff: [1s, 2s, 4s, 8s, 16s]
6. **Navigator** - Port 5180, backoff: [1s, 2s, 4s, 8s, 16s]

All dashboards have:
- ✅ HTTP health checks configured
- ✅ Restart policies enabled
- ✅ Port ranges defined
- ✅ Exponential backoff sequences

---

## Code Quality Assessment

### Strengths
1. **Error Handling:** Try/catch blocks in all async methods
2. **Logging:** Comprehensive console.log statements for debugging
3. **Event Forwarding:** All 6 dashboard events properly forwarded to renderer
4. **Lifecycle Management:** Proper cleanup in app quit handlers
5. **Type Safety:** TypeScript used throughout, proper type annotations
6. **Configuration:** Well-structured YAML config with sensible defaults

### Issues Found
1. **CRITICAL:** CommonJS/ESM module mismatch prevents app from running
2. **Missing:** No fallback if dashboard-runner fails to import
3. **Missing:** No validation that config file exists before starting
4. **Missing:** No graceful degradation if dashboards.yaml is invalid

---

## Recommendations

### Immediate (P0)
1. **Fix module loading issue** - Choose one approach:
   - **Option A:** Add "require" field to dashboard-runner package.json exports
   - **Option B:** Convert studio package to ESM (`"type": "module"`)
   - **Option C:** Use dynamic `import()` in dashboard-manager.ts

### Short-term (P1)
2. **Add module loading fallback** - Catch import errors and log warning
3. **Validate config file exists** - Check dashboards.yaml before DashboardRunner()
4. **Add integration tests** - Playwright or Spectron tests for each scenario

### Medium-term (P2)
5. **Add dashboard health dashboard** - Show status of all 6 dashboards in UI
6. **Add manual restart button** - UI button to restart individual dashboards
7. **Add log viewer** - Stream logs from ~/.local/share/lev/dashboard-runner/logs/

---

## Next Steps

1. **Unblock testing:** Resolve ERR_PACKAGE_PATH_NOT_EXPORTED error
2. **Re-run all 7 tests** with working Electron app
3. **Document actual behavior** vs expected behavior
4. **File bugs** for any failing tests
5. **Update this report** with runtime results

---

## Files Modified

None - testing only, no code changes made.

---

## Appendix: Module Error Details

**Full Error Stack:**
```
App threw an error during load
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in
/Users/jean-patricksmith/digital/leviathan/core/agent-harness/vendor/AgentPing/packages/studio/node_modules/dashboard-runner/package.json
    at new NodeError (node:internal/errors:405:5)
    at exportsNotFound (node:internal/modules/esm/resolve:329:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:609:13)
    at resolveExports (node:internal/modules/cjs/loader:574:36)
    at Module._findPath (node:internal/modules/cjs/loader:643:31)
```

**dashboard-runner package.json exports:**
```json
"exports": {
  ".": {
    "import": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

**Missing:** `"require": "./dist/index.js"` field in "." export

---

**Report Generated:** 2026-01-31 19:30 PST
**Report Location:** `/Users/jean-patricksmith/digital/leviathan/core/agent-harness/vendor/AgentPing/docs/integration-test-report.md`
