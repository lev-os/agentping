# @agentping/dashboard-manager-ui

React web UI for AgentPing Dashboard Manager - browser-based dashboard management interface.

## Features

- **Dashboard List View**: Browse all running dashboards with real-time status
- **Dashboard Detail View**: Deep dive into metrics, logs, and controls
- **Real-time Updates**: WebSocket-based live status and log streaming
- **Kingly Theme**: Cyber-terminal aesthetic matching AgentPing Studio

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (proxies API to localhost:8080)
pnpm dev

# Build for production
pnpm build

# Type check
pnpm typecheck
```

## Architecture

### Components

- **DashboardList**: Main list view with create modal
- **DashboardDetail**: Detail view with metrics and logs
- **StatusBadge**: Status indicator component
- **LogViewer**: Real-time log streaming viewer
- **Charts**: Recharts-based metric visualizations

### API Client

- REST API client for CRUD operations
- WebSocket hook for real-time events

### Routing

- `/` - Dashboard list
- `/dashboard/:id` - Dashboard detail view

## Dependencies

- React 19 + TypeScript
- React Router for navigation
- Socket.io client for WebSocket
- Recharts for metrics visualization
- Lucide React for icons

## Integration

This UI can run:
1. **Standalone** - Development server at http://localhost:3000
2. **Embedded** - Served from Electron Studio or standalone HTTP server

API proxy configuration in `vite.config.ts` routes `/api` and `/socket` to backend.
