# Pass 27: Studio Minimal-Stack Smoke

Date: 2026-03-10

## Stack started

- `@agentping/daemon` on `http://localhost:7890`
- `@kingly/ui` Storybook on `http://localhost:6007`
- `@agentping/studio` web shell on `http://localhost:5180`

Not started for this smoke:
- dashboard manager server / dashboard runner
- `packages/adapters/web-ui` on `5173`
- `packages/canvas` on `5174`
- Studio Storybook on `6006`

## Verified behavior

### Working

1. Studio root shell loads at `/` with no initial console errors.
2. Components sidebar opens and renders.
3. Chat submit now produces a visible message in the browser shell.
4. Adding `Button` from the component gallery no longer throws.
5. Daemon connectivity is optional for the browser-shell fallback path.
6. `/preview` now shows an explicit unreachable-state message instead of an ambiguous blank shell.
7. `/dashboards` now shows an explicit control-plane error state instead of implying `0/0 ONLINE` is healthy.

### Dependency-bound empty states

1. `/preview` still depends on the target app at `http://localhost:5173`, but the shell now says so directly.
2. `/dashboards` still depends on the dashboard-manager control plane at `3030`, but the shell now surfaces that dependency as an error state.

### Fixed in this pass

1. Chat submit now degrades cleanly in the browser shell.
   - Input accepts text.
   - Submit creates a visible user message plus an explicit fallback assistant response.
   - Fix landed in:
     - `packages/studio/src/renderer/components/ChatPanel.tsx`
     - `packages/studio/src/renderer/App.tsx`

2. Gallery-to-canvas add no longer throws.
   - Previous runtime error: `Cannot read properties of undefined (reading 'split')`
   - Re-tested by opening Components and clicking `Button`.
   - Fix landed in:
     - `packages/studio/src/renderer/App.tsx`

3. Preview route now exposes target availability.
   - Re-tested by navigating to Preview in-app.
   - Current message when `5173` is down:
     `Target unreachable. Start the app for this URL or change the preview target.`
   - Fix landed in:
     - `packages/studio/src/renderer/App.tsx`
     - `packages/ui/src/components/migrations/preview.tsx`

4. Dashboards route now exposes control-plane failure.
   - Re-tested by navigating to `/dashboards` without `3030`.
   - Current message:
     `Dashboard API error: Dashboard control plane unavailable. Failed to fetch`
   - Fix landed in:
     - `packages/studio/src/renderer/App.tsx`

## Artifacts

- `docs/qa/pass27/studio-root-smoke.png`
- `docs/qa/pass27/studio-dashboards-smoke.png`
- `docs/qa/pass27/studio-preview-smoke.png`
- `docs/qa/pass27/studio-components-sidebar-smoke.png`
- `docs/qa/pass27/studio-chat-submit-smoke.png`
- `docs/qa/pass27/studio-chat-submit-fixed.png`
- `docs/qa/pass27/studio-canvas-add-button-smoke.png`
- `docs/qa/pass27/studio-canvas-add-button-fixed.png`
- `docs/qa/pass27/studio-preview-explicit-state.png`
- `docs/qa/pass27/studio-dashboards-explicit-state.png`

## Follow-up

See the work handoff roadmap:
- `.lev/pm/handoffs/20260310-agentping-genui-host-stack-roadmap-session-1.md`
