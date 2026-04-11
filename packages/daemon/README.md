# @agentping/daemon

> 🚀 **Daemon** – Main entry point that wires everything together.

## Overview

The daemon is the orchestrator that connects all AgentPing packages: it starts the HTTP server, initializes storage, registers notification channels, and manages the event system.

## 🏃 Quick Start

```bash
# Install dependencies
pnpm install

# Build the daemon
pnpm build

# Start the server
pnpm start
```

## ⚙️ Configuration

Set environment variables or use a config file:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `7890` | HTTP + WebSocket server port |
| `CDP_PROXY_PORT` | `7891` | Raw CDP proxy for Playwright/agent-browser |
| `DATABASE_PATH` | `~/.local/share/agentping/agentping.db` | SQLite database (XDG) |
| `LOG_LEVEL` | `info` | Logging verbosity |

## 📦 What It Does

1. **Initializes Storage** – Sets up SQLite database
2. **Starts HTTP API** – REST + WebSocket endpoints
3. **Registers Channels** – Web UI, webhooks, etc.
4. **Manages Lifecycle** – Graceful startup/shutdown

## 🔗 Dependencies

- `@agentping/core` – Domain logic
- `@agentping/storage-sqlite` – Persistence
- `@agentping/http-api` – REST/WebSocket server

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
