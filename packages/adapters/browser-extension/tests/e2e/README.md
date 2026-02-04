# AgentPing Browser Extension E2E Tests

End-to-end tests for the AgentPing browser extension using Playwright with `launchPersistentContext`.

## Quick Start

### Prerequisites

1. Extension must be built:
   ```bash
   pnpm build
   ```

2. Playwright must be installed (done via root package.json):
   ```bash
   pnpm install
   ```

### Running Tests

From the browser-extension directory:

```bash
# Run all tests
pnpm test:e2e

# Run tests with UI (recommended for debugging)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Debug mode (step through with Inspector)
pnpm test:e2e:debug
```

From the root directory:

```bash
# Run browser-extension E2E tests only
pnpm --filter @agentping/browser-extension test:e2e
```

## Test Structure

### `extension.spec.ts` - Main Extension Tests

Core test suite covering:

1. **Extension Loading** - Verifies the extension loads without errors
2. **Service Worker Registration** - Confirms background.js is registered
3. **Manifest Validation** - Checks manifest.json fields and version
4. **Content Script Injection** - Verifies content scripts inject into pages
5. **Multi-Tab Support** - Tests extension works with multiple tabs
6. **Console Error Detection** - Catches runtime errors
7. **Asset Loading** - Verifies icons and resources load
8. **Stability** - Tests extension context remains stable

### `global-setup.ts` - Pre-Test Verification

Runs once before all tests:
- Checks that `.output/chrome-mv3` directory exists
- Verifies manifest.json is present
- Verifies background.js exists
- Smoke test: launches extension and confirms it's visible

### `global-teardown.ts` - Post-Test Cleanup

Runs once after all tests complete for final logging.

## Architecture

### launchPersistentContext Approach

The tests use Playwright's `chromium.launchPersistentContext()` with:

```typescript
const context = await chromium.launchPersistentContext('', {
  headless: false,  // Required: extensions don't load in headless mode
  args: [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
  ],
});
```

**Why persistent context?**
- Maintains browser state across tests
- Extension remains loaded throughout test suite
- Better resource utilization
- More realistic user scenario

**Key constraints:**
- `headless: false` is mandatory for extensions
- Must use Chrome/Chromium (not Firefox for MV3)
- Service worker lives as long as context is open
- No multiple simultaneous contexts per browser

## Debugging

### View the Browser

Run tests in headed mode to see what's happening:
```bash
pnpm test:e2e:headed
```

### Use Playwright Inspector

```bash
pnpm test:e2e:debug
```

Then step through tests with the Inspector UI.

### Enable Playwright Tracing

Tests automatically capture traces on first retry. View with:
```bash
npx playwright show-trace trace.zip
```

### Check Extension State

Visit `chrome://extensions/` in headed mode to see:
- Extension is loaded
- Service worker status
- Any errors or warnings
- ID and version

## Common Issues

### Extension Not Found

```
Error: Extension not found at .../AgentPing/.output/chrome-mv3
```

**Solution:** Run `pnpm build` in the browser-extension directory first.

### Service Worker Failed to Register

Usually indicates an error in `background.ts`. Check:
1. Syntax errors in background.ts
2. Missing permissions in manifest.json
3. Unhandled promise rejections

### Content Script Not Injecting

The content script should inject into all URLs based on manifest:
```json
"content_scripts": [{
  "matches": ["<all_urls>"],
  "run_at": "document_idle"
}]
```

Verify the injection with Playwright Inspector.

### Timeout Waiting for Extensions Page

Chrome extensions can be slow to register. Tests use 10s timeout on visibility checks. Increase if needed:

```typescript
await expect(extensionLocator).toBeVisible({ timeout: 15000 });
```

## Configuration

### playwright.config.ts

Located at: `packages/adapters/browser-extension/playwright.config.ts`

Key settings:
- `workers: 1` - Serial execution (extension context not safe for parallelism)
- `timeout: 60 * 1000` - Increased timeout for extension operations
- `video: 'retain-on-failure'` - Captures video on failures for debugging
- `trace: 'on-first-retry'` - Captures traces for debugging

## Development Workflow

1. Make changes to `entrypoints/background.ts` or `entrypoints/content.ts`
2. Build the extension: `pnpm build`
3. Run tests: `pnpm test:e2e`
4. Debug failures with: `pnpm test:e2e:ui` or headed mode
5. View traces/videos in `test-results/` directory

## Next Steps

After basic extension tests pass:

1. **Notification Tests** - Test modal/drawer/toast notification styles
2. **CDP Bridge Tests** - Test WebSocket communication to daemon
3. **Lease Flow Tests** - Test agent lease request/approval flow
4. **Content Script Tests** - Inject test content and verify interactions
5. **Performance Tests** - Memory usage, message latency, tab impact

## References

- [Playwright Testing Extensions](https://playwright.dev/docs/chrome-extensions)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
