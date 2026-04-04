# AgentPing AGENTS.md

This file is the fast agent-facing truth for `community/agentping` inside the Leviathan workspace.

Use it to avoid the recurring storybook/surface confusion and to separate:

- what is already done,
- what is currently true,
- what is still planned.

If this file conflicts with deeper docs, use this order:

1. `community/agentping/docs/architecture.md`
2. `community/agentping/docs/web-ui-architecture.md`
3. `community/agentping/docs/specs/spec-dashboard-host-runtime.md`
4. `community/agentping/docs/specs/spec-canvas-consolidation.md`
5. `community/agentping/docs/specs/spec-levui-ir-adapter.md`
6. `community/agentping/docs/specs/spec-json-render-provider.md`
7. `community/agentping/docs/component-catalog.md`

## Storybook Truth

Do not say "the AgentPing storybook" as if there is only one.

There are currently three real Storybook roots in this repo:

1. `agentping`
   Source: `packages/studio/.storybook/main.ts`
   Meaning: AgentPing Studio Storybook

2. `sofia`
   Source: `packages/ui/.storybook/main.ts`
   Meaning: Sofia UI Storybook

3. `web-ui-storybook`
   Source: `packages/adapters/web-ui/.storybook/main.ts`
   Meaning: Web UI Storybook

This is the exact provenance of the two previously confused surfaces:

- the old `agentping` runner entry came from `packages/studio/.storybook/main.ts`
- the old `sofia` runner entry came from `packages/ui/.storybook/main.ts`

The missing third one that kept getting lost was:

- `packages/adapters/web-ui/.storybook/main.ts`

If you are naming or discussing storybooks, use the explicit names above.

## Runnable Surface Truth

The runner manifest is the source of truth for runner-managed surfaces:

- `community/agentping/packages/dashboard-runner/config/dashboards.yaml`

Current intended runner-managed surfaces in this workspace:

1. `agentping`
   Name: `AgentPing Studio Storybook`
   Package: `packages/studio`

2. `sofia`
   Name: `Sofia UI Storybook`
   Package: `packages/ui`

3. `web-ui-storybook`
   Name: `Web UI Storybook`
   Package: `packages/adapters/web-ui`

4. `web-ui`
   Name: `AgentPing Web UI`
   Package: `packages/adapters/web-ui`

5. `canvas`
   Name: `AgentPing Canvas`
   Package: `packages/canvas`

6. `dashboard-manager-ui`
   Name: `Dashboard Manager UI`
   Package: `packages/dashboard-manager-ui`

7. `studio`
   Name: `AgentPing Studio`
   Package: `packages/studio`

8. `system-dashboard`
   Name: `System Dashboard`
   Package: external to this repo in the Leviathan workspace
   Path: `plugins/system-dashboard`
   Meaning: this is a Leviathan-hosted ops surface federated into AgentPing's host runtime

Important:

- `system-dashboard` is part of the Leviathan workspace host setup, not a standalone AgentPing-owned package.
- If you are working in `community/agentping` outside the Leviathan super-repo context, treat that entry as workspace-specific and re-check the runner config before assuming it exists.

## What Is Done

These items are implemented in the current Leviathan workspace integration:

1. AgentPing remains the browser-hosted command-center shell.

2. `plugins/system-dashboard` is federated into that shell as the primary ops surface.

3. Dashboard metadata is real runtime contract now, not just UI decoration.
   Shape:
   `metadata: { lane, openMode, description, primary? }`

4. `dashboard-manager-server` now supports metadata-aware create/delete/list/detail behavior.

5. `dashboard-manager-ui` root view is now a command-center landing page:
   - grouped by lane (`ops`, `interaction`, `development`)
   - with a primary ops hero panel

6. `dashboard-manager-ui` detail view can embed a live preview when `openMode=embed`.

7. `lev dashboard build` is now a real CLI path via a concrete handler in `plugins/system-dashboard/src/handlers/dashboard.ts`.

8. The broken `plugins/system-dashboard` flow declaration was repaired with a real:
   `plugins/system-dashboard/flows/build.flow.yaml`

9. The prior storybook ambiguity was corrected by:
   - renaming the existing storybook surfaces explicitly
   - adding `web-ui-storybook` as a separate runner-managed development surface

10. The `system-dashboard` hosted preview path was fixed so the runner-assigned port is passed directly to `vite preview`.

## What Is Not Done Yet

This is still a v1 command center, not the final GenUI architecture.

Not done yet:

1. Full GenUI host convergence across every active host surface.
   Today the host-envelope path exists, but it still enters primarily through the canvas/web-ui lane.

2. One canonical GenUI provider path used everywhere.
   `json-render` is the current concrete provider direction, but it is not yet the universal path across all active surfaces.

3. Full canvas convergence.
   The docs still treat `CanvasRenderer`-style hardcoded switching as transitional, not final architecture.

4. Full component canon convergence.
   `packages/ui` is still the intended canonical shared primitive source, but `packages/adapters/web-ui` still contains a large local component estate and parallel render logic.

5. Studio control-plane cleanup.
   The architectural goal remains: runner/server is the control plane, Studio is a client. Embedded control-plane assumptions should continue to be reduced.

6. Full workflow/approval control center.
   The current command center is a live ops center. It is not yet the full workflow visualization / approval / execution cockpit described in the more ambitious Lev docs.

7. Full LevUI IR host realization.
   Lev owns the abstract IR. AgentPing still needs deeper host-wide consumption of that IR-compatible path rather than lane-local adapters only.

## Future Plans We Already Have

These are not fresh ideas. They are the existing direction already present in the docs and recent implementation work.

### 1. One canonical host path for GenUI surfaces

Source:

- `community/agentping/docs/specs/spec-canvas-consolidation.md`
- `community/agentping/docs/specs/spec-levui-ir-adapter.md`

Direction:

- one canonical host path
- one canonical provider path
- legacy translators kept only as transitional compatibility layers

### 2. One canonical provider path beneath LevUI IR

Source:

- `community/agentping/docs/specs/spec-json-render-provider.md`
- `community/agentping/docs/specs/spec-levui-ir-adapter.md`

Direction:

- `json-render` is the current concrete provider path
- providers are below `LevUI IR`
- providers and transports must stay separate
- AG-UI, MCP Apps, and WebMCP are transport/host concerns, not provider identity

### 3. `packages/ui` as the single reusable primitive canon

Source:

- `community/agentping/docs/architecture.md`
- `community/agentping/docs/web-ui-architecture.md`
- `community/agentping/docs/component-catalog.md`

Direction:

- `packages/ui` is the only long-term shared primitive source
- adapter-local primitive ownership in `packages/adapters/web-ui` should keep shrinking
- Sofia/domain-specific names should be neutralized behind generic primitives

### 4. Canvas convergence into one runtime

Source:

- `community/agentping/docs/specs/spec-canvas-consolidation.md`
- `community/agentping/docs/architecture.md`

Direction:

- one canonical canvas implementation
- one canonical provider path
- no long-term duplicate canvas/runtime logic spread across surfaces

### 5. Command center grows from ops center to richer host

Source:

- `.lev/ux/20260319-153503-leviathan-live-dashboard/**`
- `.lev/pm/specs/spec-agentping-levui-ir-host-slice-20260309.md`

Direction:

- v1 live ops center first
- then stronger GenUI host behavior
- then richer workflow / review / progress / action surfaces

### 6. AgentPing stays standalone even when hosting Lev surfaces

Source:

- `community/agentping/docs/specs/spec-dashboard-host-runtime.md`
- `community/agentping/docs/architecture.md`

Direction:

- AgentPing remains runnable standalone
- Lev integration should strengthen AgentPing as host/runtime, not collapse it into Lev-only assumptions

## Rules For Future Agents

1. Do not use ambiguous storybook names.
   Always refer to `AgentPing Studio Storybook`, `Sofia UI Storybook`, or `Web UI Storybook`.

2. Treat `packages/dashboard-runner/config/dashboards.yaml` and `/api/dashboards` as runtime truth for hosted surfaces.

3. Do not infer that `sofia-widget` means full UI-kit convergence.
   The docs explicitly say it is an envelope contract, not proof of full renderer unification.

4. Do not invent a new `.lev/genui` implementation root inside this repo.
   AgentPing’s active GenUI direction is currently documented under:
   `community/agentping/docs/genui/`
   and implemented through the existing host-envelope / provider seams.

5. When discussing GenUI architecture, keep the boundary straight:
   - Lev owns `LevUI IR`
   - AgentPing owns how its hosts consume it
   - `json-render` is a provider choice
   - AG-UI / MCP Apps / WebMCP are transport or host concerns

6. If you need to answer "what is left?", start from the "What Is Not Done Yet" and "Future Plans We Already Have" sections here before inventing anything new.
