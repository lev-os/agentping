# AgentPing Documentation

This tree is the canonical documentation surface for AgentPing itself.

AgentPing must remain standalone as a sister project.

At the same time, it is the default dashboard host, UI kit, and human-loop surface system for full Lev experiences.

## Quick Nav

| You want... | Go to |
|---|---|
| Product/runtime architecture | [architecture.md](./architecture.md) |
| UI surface ownership | [web-ui-architecture.md](./web-ui-architecture.md) |
| Component estate and inventory | [component-catalog.md](./component-catalog.md) |
| Canonical implementation specs | [specs/](./specs/) |
| UX and product intent | [ux/](./ux/) |
| Legacy GenUI research inputs | [genui/](./genui/readme.md) |
| QA and historical evidence | [qa/](./qa/) |

## Canonical Layout

```text
docs/
  README.md
  architecture.md
  specs/
  ux/
  genui/        # research/input only until promoted
  _archive/
```

Rules:

- `docs/specs/**` is runtime truth for AgentPing implementation and stays flat.
- `docs/genui/**` is research/input unless promoted into `docs/specs/**` or `docs/ux/**`.
- AgentPing must document itself as standalone.
- AgentPing must also document its role as Lev’s default full-surface host.
