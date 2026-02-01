# AgentPing Studio

Electron-based desktop GUI for AgentPing.

## Development Modes

### Web Development (Vite Only - NO Electron)
```bash
pnpm dev
# OR
pnpm dev:web
```
**What happens:**
- Vite dev server starts on http://localhost:5180
- NO Electron window launches
- Use your browser to access the UI
- Hot reload enabled

### Electron Development (Full Desktop App)
```bash
pnpm dev:electron
```
**What happens:**
- Vite dev server starts on http://localhost:5180
- Electron window launches automatically
- Full desktop app experience
- Requires Electron window to interact

## When to Use What

| Mode | Use When |
|------|----------|
| `pnpm dev` | Working on UI/React components, faster iteration |
| `pnpm dev:electron` | Testing Electron-specific features (IPC, native menus, etc.) |

## Build

```bash
pnpm build        # All platforms
pnpm build:mac    # macOS only
pnpm build:win    # Windows only
```
