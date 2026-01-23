# AgentPing

This is the Human-in-the-Loop project for agentic workflows.

## Quick Commands

### Start AgentPing Studio GUI
To launch the AgentPing Studio (Electron GUI), run:
```bash
pnpm start
```

### Start Development Mode (All Packages)
To start all packages in development mode:
```bash
pnpm dev
```

## Project Structure
- `packages/studio` - Electron-based desktop GUI
- `packages/core` - Core AgentPing primitives
- `packages/daemon` - Background MCP server
- `packages/adapters/*` - Various adapters (CLI, Web UI, Slack, etc.)
