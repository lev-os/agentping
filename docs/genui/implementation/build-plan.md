# AgentPing C1 Enhancement Build Plan

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

**Generated**: 2026-02-10  
**Target**: Add Thesys C1 streaming, interactivity, and component capabilities to AgentPing  
**Strategy**: Selective adoption preserving MCP-native advantages

---

## Executive Summary

### What We're Building and Why

AgentPing is an MCP-native human-in-the-loop protocol with superior multi-format rendering (HTML/Pencil/React) and a rich directive taxonomy (11 types) for agent guidance. However, compared to Thesys C1, it lacks three critical capabilities:

1. **Streaming Progressive Rendering** — Components appear atomically after full payload submission, not incrementally as data arrives
2. **Bidirectional Interactivity** — No `onClick`/`onChange` handlers; user interactions can't trigger agent continuation
3. **Component State Persistence** — No thread-scoped state; component UI state lost between renders

This build plan implements these capabilities **while preserving AgentPing's core strengths**:

- **MCP-first design** (skip OpenAI compatibility)
- **Directive-enriched feedback** (11 directive types vs C1's simple approve/reject)
- **Multi-renderer architecture** (HTML/Pencil/React vs C1's React-only)
- **Hexagonal ports & adapters** (pluggable channels, not monolithic API)

### Strategic Approach

**Selective Adoption, Not 100% Parity**

We will NOT implement:
- OpenAI-compatible `/chat/completions` endpoint (preserves MCP focus)
- Conversational message history (AgentPing is ping-centric, not chat-centric)
- Multi-language SDKs (TypeScript MCP ecosystem sufficient)
- Full Thesys SDK surface (`<C1Chat>`, `<C1Component>` wrappers)

We WILL implement:
- SSE streaming with progressive component updates
- Event handlers on primitives (`onClick`, `onChange`, `onSubmit`)
- Thread-scoped component state (`useAgentPingState` hook)
- Custom component registration via Zod schemas
- Extended theming and responsive layouts

### Preserve AgentPing's MCP-Native Advantages

AgentPing's unique strengths (missing in Thesys C1):
- **12 Ping Types** with explicit interaction contracts
- **11 Directive Types** for rich agent guidance
- **Multi-format rendering** (HTML strings, .pen operations, React catalog)
- **Hexagonal architecture** with clean domain/ports/adapters
- **Browser CDP adapter** with secure capability delegation
- **Dashboard runner** for background service orchestration

---

## Phase 1: Streaming Polymorph Renderer (Critical Priority)

**Goal**: Enable progressive component rendering via SSE with incremental DOM updates

**Effort**: L (1-2 weeks) — 760 LOC across 9 files (3 new, 6 modified)

**Dependencies**: None

### Why This Matters

Without streaming, AgentPing feels "stuck in request-response mode" vs C1's fluid real-time updates. Users expect live feedback as agents generate content.

### Files to Create

**1. Stream Buffer Service**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/core/src/services/stream-buffer.ts` (200 LOC)

```typescript
import { PolymorphPrimitive } from '@agentping/canvas';

export interface StreamChunk {
  type: 'primitive_delta' | 'primitive_complete' | 'stream_done';
  primitiveId?: string;
  deltaContent?: Partial<PolymorphPrimitive>;
  finalContent?: PolymorphPrimitive;
}

export class StreamBuffer {
  private chunks: Map<string, Partial<PolymorphPrimitive>> = new Map();
  private completedPrimitives: PolymorphPrimitive[] = [];

  accumulate(chunk: StreamChunk): {
    partialPrimitives: PolymorphPrimitive[];
    isComplete: boolean;
  } {
    if (chunk.type === 'primitive_delta') {
      const existing = this.chunks.get(chunk.primitiveId!) || {};
      this.chunks.set(chunk.primitiveId!, { ...existing, ...chunk.deltaContent });
      return { partialPrimitives: this.buildPartialSnapshot(), isComplete: false };
    }

    if (chunk.type === 'primitive_complete') {
      this.completedPrimitives.push(chunk.finalContent!);
      this.chunks.delete(chunk.primitiveId!);
      return { partialPrimitives: this.completedPrimitives, isComplete: false };
    }

    return { partialPrimitives: this.completedPrimitives, isComplete: true };
  }

  private buildPartialSnapshot(): PolymorphPrimitive[] {
    return [
      ...this.completedPrimitives,
      ...Array.from(this.chunks.values()).map(partial => ({
        type: partial.type || 'container',
        props: partial.props || {},
        children: partial.children || [],
      } as PolymorphPrimitive)),
    ];
  }

  reset(): void {
    this.chunks.clear();
    this.completedPrimitives = [];
  }
}
```

**2. SSE Transport Adapter**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/adapters/sse-transport/src/index.ts` (150 LOC)

```typescript
import { StreamChunk } from '@agentping/core';

export interface SSETransport {
  connect(sessionId: string): AsyncIterable<StreamChunk>;
  disconnect(): void;
}

export class WebSocketSSETransport implements SSETransport {
  private socket?: WebSocket;

  async *connect(sessionId: string): AsyncIterable<StreamChunk> {
    this.socket = new WebSocket(`ws://localhost:3031/stream/${sessionId}`);
    const queue: StreamChunk[] = [];
    let resolveNext: ((value: IteratorResult<StreamChunk>) => void) | null = null;

    this.socket.onmessage = (event) => {
      const chunk = JSON.parse(event.data) as StreamChunk;
      if (resolveNext) {
        resolveNext({ value: chunk, done: false });
        resolveNext = null;
      } else {
        queue.push(chunk);
      }
    };

    this.socket.onclose = () => {
      if (resolveNext) resolveNext({ value: undefined as any, done: true });
    };

    while (true) {
      if (queue.length > 0) {
        yield queue.shift()!;
      } else {
        const result = await new Promise<IteratorResult<StreamChunk>>(
          resolve => { resolveNext = resolve; }
        );
        if (result.done) break;
        yield result.value;
      }
    }
  }

  disconnect(): void {
    this.socket?.close();
  }
}
```

**3. Package Definition**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/adapters/sse-transport/package.json` (30 LOC)

### Files to Modify

**1. HTML Renderer**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/polymorph/renderers/html.ts` (+80 LOC)

```typescript
export interface RenderOptions {
  theme?: Theme;
  size?: SizeScale;
  streaming?: boolean; // NEW
}

export function renderToHTML(
  primitives: PolymorphPrimitive[],
  options?: RenderOptions
): string {
  const { streaming = false } = options || {};

  if (streaming) {
    return `
      <div class="agentping-stream-container" data-streaming="true">
        ${primitives.map(p => renderPrimitive(p, options)).join('')}
      </div>
      <script>
        window.AgentPingStreamHandler = {
          updatePrimitive(id, deltaHTML) {
            const container = document.querySelector('[data-streaming="true"]');
            const existing = container.querySelector(\`[data-primitive-id="\${id}"]\`);
            if (existing) {
              existing.outerHTML = deltaHTML;
            } else {
              container.insertAdjacentHTML('beforeend', deltaHTML);
            }
          }
        };
      </script>
    `;
  }

  return primitives.map(p => renderPrimitive(p, options)).join('');
}
```

**2. React Renderer**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/polymorph/renderers/react.ts` (+120 LOC)

```typescript
import { useState, useEffect } from 'react';
import { WebSocketSSETransport, StreamBuffer } from '@agentping/sse-transport';

export function StreamingRenderer({ sessionId, initialPrimitives = [] }) {
  const [primitives, setPrimitives] = useState(initialPrimitives);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const transport = new WebSocketSSETransport();
    const buffer = new StreamBuffer();

    (async () => {
      for await (const chunk of transport.connect(sessionId)) {
        const { partialPrimitives, isComplete } = buffer.accumulate(chunk);
        setPrimitives(partialPrimitives);
        if (isComplete) {
          setIsComplete(true);
          break;
        }
      }
    })();

    return () => transport.disconnect();
  }, [sessionId]);

  return (
    <div data-complete={isComplete}>
      {primitives.map((primitive, idx) => (
        <PrimitiveRenderer key={idx} primitive={primitive} />
      ))}
      {!isComplete && <LoadingIndicator />}
    </div>
  );
}
```

**3. WebSocket Server**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/dashboard-manager-server/src/websocket.ts` (+50 LOC)

```typescript
export function setupWebSocketServer(httpServer: any) {
  const io = new SocketIOServer(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('subscribe:stream', (sessionId) => {
      socket.join(`stream:${sessionId}`);
    });
  });

  return {
    io,
    emitStreamChunk(sessionId: string, chunk: StreamChunk) {
      io.to(`stream:${sessionId}`).emit('stream:chunk', chunk);
    },
  };
}
```

**4-6. Additional modifications to ping-service.ts, ping.ts, pencil.ts** (+180 LOC total)

### Verification Criteria

- [ ] HTML renderer supports `streaming: true` flag
- [ ] React `<StreamingRenderer>` updates DOM as chunks arrive
- [ ] Pencil renderer emits progressive .pen operations
- [ ] WebSocket emits `stream:chunk` events
- [ ] StreamBuffer accumulates deltas correctly
- [ ] Final render matches non-streaming output
- [ ] No memory leaks on disconnect/reconnect

---

## Phase 2: Bidirectional State + Event Handlers (High Priority)

**Goal**: Add `useOnAction` equivalent for component interactivity

**Effort**: L (1-2 weeks) — 800 LOC across 8 files (2 new, 6 modified)

**Dependencies**: Phase 1 (streaming for action responses)

### Why This Matters

Primitives are currently static. This enables click-to-continue, form submissions, and interactive dashboards.

### Files to Create

**1. Action Service**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/core/src/services/action-service.ts` (180 LOC)

```typescript
export interface ActionContext {
  sessionId: string;
  pingId: string;
  primitiveId: string;
  agentId: string;
}

export class ActionService {
  constructor(
    private pingService: PingService,
    private eventBus: EventBus
  ) {
    this.eventBus.on('ping:action', this.handleAction.bind(this));
  }

  async handleAction(event: {
    context: ActionContext;
    actionType: 'click' | 'change' | 'submit';
    payload: unknown;
  }): Promise<void> {
    const interactionPayload: CanvasInteractionPayload = {
      type: 'canvas_interaction',
      action: event.actionType,
      sourceWidgetId: event.context.primitiveId,
      interactionData: event.payload,
    };

    await this.pingService.submitPing({
      agentId: 'user',
      agentName: 'Human',
      sessionId: event.context.sessionId,
      payload: interactionPayload,
      metadata: { triggeredBy: event.context.pingId },
    });
  }
}
```

**2. React Hook**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/hooks/useOnAction.ts` (60 LOC)

```typescript
export function useOnAction(context: ActionContext, actionService: ActionService) {
  const handleClick = useCallback((data: unknown) => {
    actionService.createActionHandler(context).onClick(data);
  }, [context, actionService]);

  return { onClick: handleClick, onChange: ..., onSubmit: ... };
}
```

### Files to Modify

**1. Primitive Types**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/polymorph/types.ts` (+40 LOC)

```typescript
export interface PrimitiveEvents {
  onClick?: (data: unknown) => void;
  onChange?: (value: unknown) => void;
  onSubmit?: (formData: Record<string, unknown>) => void;
}
```

**2. Primitives**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/polymorph/primitives.ts` (+200 LOC)

```typescript
export function button(
  text: string,
  props?: Record<string, unknown>,
  events?: PrimitiveEvents
): PolymorphPrimitive {
  return {
    type: 'button',
    props: { text, variant: props?.variant || 'primary', ...props },
    events, // NEW
  };
}
```

**3-6. HTML renderer, React renderer, HTTP API, ping.ts** (+320 LOC total)

### Verification Criteria

- [ ] Button with `onClick` creates new ping
- [ ] InputField with `onChange` submits value updates
- [ ] HTML renderer includes client-side event handlers
- [ ] `/api/v1/actions` endpoint works
- [ ] Event deduplication prevents spam
- [ ] Event handlers cleaned up on unmount

---

## Phase 3: Component State & Custom Components (Medium Priority)

**Goal**: Thread-scoped persistent state + Zod-based registration

**Effort**: M (3-5 days) — 840 LOC across 8 files (4 new, 4 modified)

**Dependencies**: Phase 2 (events)

### Files to Create

**1. Thread Entity**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/core/src/domain/thread.ts` (80 LOC)

```typescript
export interface Thread {
  id: string;
  sessionId: string;
  pingIds: string[];
  state: Record<string, unknown>;
  createdAt: Date;
}
```

**2. Component State Service**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/core/src/services/component-state-service.ts` (100 LOC)

**3. useAgentPingState Hook**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/hooks/useAgentPingState.ts` (70 LOC)

```typescript
export function useAgentPingState<T>(
  threadId: string,
  key: string,
  defaultValue: T,
  stateService: ComponentStateService
): [T, (value: T) => Promise<void>] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    stateService.getState(threadId, key, defaultValue).then(setState);
  }, [threadId, key]);

  const updateState = useCallback(async (newValue: T) => {
    setState(newValue);
    await stateService.setState(threadId, key, newValue);
  }, [threadId, key]);

  return [state, updateState];
}
```

**4. Component Registry**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/polymorph/registry.ts` (200 LOC)

```typescript
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class ComponentRegistry {
  private components = new Map<string, CustomComponentDefinition>();

  register(definition: CustomComponentDefinition): void {
    this.components.set(definition.name, definition);
  }

  validate(name: string, props: unknown): { valid: boolean; errors?: any[] } {
    const def = this.components.get(name);
    if (!def) return { valid: false, errors: [{ message: `Unknown: ${name}` }] };
    const result = def.schema.safeParse(props);
    return result.success ? { valid: true } : { valid: false, errors: result.error.errors };
  }
}
```

### Verification Criteria

- [ ] Thread entity stored with state K-V map
- [ ] `useAgentPingState` persists across re-renders
- [ ] Custom components registered via registry
- [ ] Zod validation rejects invalid props
- [ ] MCP tool `register_custom_component` works
- [ ] State cleared when thread deleted

---

## Phase 4: Responsive Layout & Theming (Medium Priority)

**Goal**: Responsive layouts + runtime theme switching

**Effort**: M (3-5 days) — 460 LOC across 4 files (1 new, 3 modified)

**Dependencies**: None (parallel with Phase 2-3)

### Files to Create

**1. Theme Context**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/context/ThemeContext.tsx` (120 LOC)

```typescript
export function ThemeProvider({ children, initialTheme = 'terminal-swiss' }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const themeConfig = getThemeConfig(theme);
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Files to Modify

**1. Sizes System**  
`/Users/jean-patricksmith/digital/leviathan/community/agentping/packages/canvas/src/polymorph/sizes.ts` (+200 LOC)

```typescript
export const responsiveSizes = {
  breakpoints: { mobile: '640px', tablet: '768px', desktop: '1024px' },
  spacing: {
    xs: { mobile: '4px', tablet: '6px', desktop: '8px' },
    sm: { mobile: '8px', tablet: '10px', desktop: '12px' },
  },
};

export function generateResponsiveCSS(): string {
  return `
    .spacing-xs { padding: ${responsiveSizes.spacing.xs.mobile}; }
    @media (min-width: ${responsiveSizes.breakpoints.tablet}) {
      .spacing-xs { padding: ${responsiveSizes.spacing.xs.tablet}; }
    }
  `;
}
```

**2-3. HTML and React renderers** (+140 LOC total)

### Verification Criteria

- [ ] Responsive classes scale at breakpoints
- [ ] HTML includes viewport meta tag
- [ ] `useTheme()` hook works
- [ ] Dark mode toggle functional
- [ ] Existing themes preserved
- [ ] No visual regressions

---

## Phase 5: OpenAI-Compatible API Adapter (SKIP - Low Priority)

**Decision**: DO NOT implement. Preserve MCP-first focus.

**Rationale**:
- Dilutes MCP value proposition
- Adds maintenance burden
- Zero user demand in backlog
- AgentPing's directive system doesn't map to OpenAI metadata

**Alternative**: Market as "Thesys C1 for MCP agents"

---

## Implementation Timeline

### Gantt Overview

```
Phase 1: Streaming          ████████░░░░░░░░  Weeks 1-2
Phase 2: Events                  ████████░░  Weeks 2-4
Phase 3: State + Custom               ████  Weeks 4-5
Phase 4: Theming                      ████  Weeks 4-5 (parallel)
                            ────────────────
Total: 6 weeks
```

### Effort Breakdown

| Phase | Effort | New LOC | Modified LOC | Files |
|---|---|---|---|---|
| Phase 1 | L (1-2 weeks) | 380 | 380 | 9 |
| Phase 2 | L (1-2 weeks) | 240 | 560 | 8 |
| Phase 3 | M (3-5 days) | 450 | 390 | 8 |
| Phase 4 | M (3-5 days) | 120 | 340 | 4 |
| **Total** | **6 weeks** | **1,190** | **1,670** | **29** |

### Team Recommendations

**Minimum**: 1 senior full-stack engineer (6 weeks)

**Optimal**: 2 engineers (3 weeks wall-clock)
- Engineer A: Phase 1 + 4 (streaming + theming)
- Engineer B: Phase 2 + 3 (events + state)

**Full-Speed**: 3 engineers (2 weeks)
- Engineer A: Phase 1
- Engineer B: Phase 2
- Engineer C: Phase 3 + 4

---

## Risk Assessment

### Phase 1: Streaming

**Risks**:
- Partial component trees expose renderer edge cases
- WebSocket connection stability (mobile, proxies)
- Memory leaks on long streams

**Mitigation**:
- Start React-only streaming (defer HTML/Pencil)
- Add reconnection logic with exponential backoff
- Stream timeout + garbage collection
- Throttle DOM updates to 60fps

**Validation**:
- Load test 100 concurrent streams
- Test on 3G networks
- Profile memory for 10-min session
- Verify no visual jank on mobile

### Phase 2: Events

**Risks**:
- Infinite loops (event → ping → event)
- Event handler memory leaks
- Race conditions on rapid clicks

**Mitigation**:
- Event deduplication (track timestamps)
- WeakMap for handlers (auto-GC)
- Debounce/throttle (500ms default)

**Validation**:
- Test rapid-click (10 clicks/sec)
- Verify GC after unmount
- Monitor duplicate pings

### Phase 3: State + Custom Components

**Risks**:
- State storage scalability (large objects)
- Zod validation performance
- XSS in custom HTML templates

**Mitigation**:
- Limit state size (10KB per key)
- Cache validated schemas
- Sanitize HTML with DOMPurify

**Validation**:
- Benchmark Zod with 100 component types
- XSS penetration test
- Test state sync with 2 concurrent clients

### Phase 4: Theming

**Risks**:
- CSS specificity conflicts
- Breakpoints misaligned with devices
- Accessibility regressions

**Mitigation**:
- Namespace CSS with `.agentping-` prefix
- Test on real devices
- WCAG 2.1 AA compliance check

**Validation**:
- Visual regression on 3 viewports
- Manual iOS Safari + Android Chrome
- 100 theme switches (memory leak check)

---

## Success Criteria

### Phase 1

- [ ] SSE chunks arrive at `/api/v1/pings/:id/stream`
- [ ] React updates DOM incrementally
- [ ] StreamBuffer accumulates correctly
- [ ] Final render matches non-streaming
- [ ] No memory leaks after 100 sessions

### Phase 2

- [ ] Button `onClick` creates new ping
- [ ] InputField `onChange` submits values
- [ ] Form submission works end-to-end
- [ ] Event deduplication prevents spam
- [ ] Handlers cleaned up on unmount

### Phase 3

- [ ] Thread stored with K-V state
- [ ] `useAgentPingState` persists
- [ ] Zod validates props
- [ ] MCP tool `register_custom_component` works
- [ ] Custom components support events

### Phase 4

- [ ] Responsive classes scale
- [ ] `useTheme()` hook works
- [ ] Dark mode toggle functional
- [ ] WCAG 2.1 AA compliant
- [ ] No visual regressions

---

## Notes

### Design Philosophy Preservation

This plan **preserves AgentPing's core strengths**:
1. **MCP-first** (Phase 5 OpenAI adapter skipped)
2. **Directive-enriched feedback** (11 types preserved)
3. **Multi-renderer** (HTML/Pencil/React all updated)
4. **Hexagonal architecture** (services follow ports pattern)

### What We're NOT Building

- Conversational message history (ping-centric, not chat)
- Full Thesys SDK wrappers
- Multi-language SDKs
- Server-side LLM orchestration
- Artifact streaming
- Thinking indicators

### Migration Path

All changes are **backward compatible**:
- Existing pings render unchanged
- `streaming: true` is opt-in
- Event handlers optional
- Thread state only if accessed
- Custom components don't affect existing primitives

### Recommended Build Order

1. **Sprint 1 (Weeks 1-2)**: Phase 1 (Streaming)
2. **Sprint 2 (Weeks 3-4)**: Phase 2 (Events)
3. **Sprint 3 (Week 5)**: Phase 3 (State + Custom)
4. **Sprint 4 (Week 6)**: Phase 4 (Theming)

Ship incrementally: beta streaming → interactive pings → custom components → responsive UIs.

---

## Appendix: Key File Paths

All paths relative to `/Users/jean-patricksmith/digital/leviathan/community/agentping/`

### Core Domain
- `packages/core/src/domain/ping.ts`
- `packages/core/src/domain/directives.ts`
- `packages/core/src/domain/thread.ts` (NEW - Phase 3)
- `packages/core/src/services/ping-service.ts`
- `packages/core/src/services/stream-buffer.ts` (NEW - Phase 1)
- `packages/core/src/services/action-service.ts` (NEW - Phase 2)
- `packages/core/src/services/component-state-service.ts` (NEW - Phase 3)

### Polymorph Rendering
- `packages/canvas/src/polymorph/types.ts`
- `packages/canvas/src/polymorph/primitives.ts`
- `packages/canvas/src/polymorph/renderers/html.ts`
- `packages/canvas/src/polymorph/renderers/react.ts`
- `packages/canvas/src/polymorph/renderers/pencil.ts`
- `packages/canvas/src/polymorph/registry.ts` (NEW - Phase 3)

### Hooks & Context
- `packages/canvas/src/hooks/useOnAction.ts` (NEW - Phase 2)
- `packages/canvas/src/hooks/useAgentPingState.ts` (NEW - Phase 3)
- `packages/canvas/src/context/ThemeContext.tsx` (NEW - Phase 4)

### Adapters
- `packages/adapters/http-api/src/index.ts`
- `packages/adapters/sse-transport/src/index.ts` (NEW - Phase 1)

### MCP Integration
- `packages/mcp/src/tools.ts`

### Infrastructure
- `packages/dashboard-manager-server/src/websocket.ts`

---

**END OF BUILD PLAN**

Total Scope (Phases 1-4):
- **6 weeks** (1 engineer) or **2-3 weeks** (3 engineers)
- **1,190 new LOC** + **1,670 modified LOC**
- **29 files** (13 new, 16 modified)
- **0 breaking changes**

