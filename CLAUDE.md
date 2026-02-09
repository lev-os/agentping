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
- `packages/core` - Core AgentPing SDK (domain logic, ports, services)
- `packages/studio` - Electron-based desktop GUI
- `packages/daemon` - Background HTTP server & orchestrator
- `packages/api-client` - Typed HTTP client for daemon API
- `packages/canvas` - Shared React component library
- `packages/dashboard-runner` - Process management for external apps
- `packages/dashboard-manager-server` - Dashboard HTTP + WebSocket server
- `packages/dashboard-manager-ui` - Dashboard React web UI
- `packages/adapters/http-api` - REST + WebSocket API layer
- `packages/adapters/mcp` - MCP server for Claude/Cursor
- `packages/adapters/web-ui` - React web interface
- `packages/adapters/storage-sqlite` - SQLite persistence
- `packages/adapters/cli` - Terminal interface
- `packages/adapters/slack` - Slack notification channel
- `packages/adapters/webhook` - HTTP webhook delivery
- `packages/adapters/browser-extension` - Chrome extension (CDP bridge)
- `packages/adapters/ext-apps` - MCP UI extensions
