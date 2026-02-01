# @lev-os/dashboard-manager-server

HTTP server with REST API and WebSocket support for `@lev-os/dashboard-runner`.

## Features

- **REST API** for dashboard management (list, status, restart, metrics)
- **Socket.io WebSocket** for real-time status updates
- **Standalone CLI** for independent server deployment
- **Embeddable** in Electron or Node.js applications

## Installation

```bash
pnpm add @lev-os/dashboard-manager-server
```

## Usage

### Standalone CLI

```bash
# Default (reads ./dashboards.yaml)
dashboard-manager-server

# Custom config
dashboard-manager-server --config ~/dashboards.yaml

# Custom port and host
dashboard-manager-server --port 8080 --host 0.0.0.0
```

### Programmatic API

```typescript
import { DashboardRunner } from '@lev-os/dashboard-runner';
import { createServer } from '@lev-os/dashboard-manager-server';

const runner = new DashboardRunner({
  configPath: './dashboards.yaml',
});

await runner.start();

const server = createServer({
  runner,
  port: 3030,
  host: '127.0.0.1',
  enableWebSocket: true,
});

const { httpServer, wsServer } = server.start();
```

## REST API Endpoints

| Method | Path                           | Description                |
|--------|--------------------------------|----------------------------|
| GET    | `/health`                      | Health check               |
| GET    | `/api/dashboards`              | List all dashboards        |
| GET    | `/api/dashboards/:id`          | Get dashboard status       |
| POST   | `/api/dashboards/:id/restart`  | Restart dashboard          |
| GET    | `/api/dashboards/:id/metrics`  | Get dashboard metrics      |

## WebSocket Events

### Client → Server

- `dashboard:subscribe` - Subscribe to dashboard updates
- `dashboard:unsubscribe` - Unsubscribe from updates

### Server → Client

- `dashboard:status` - Status changes (started, crashed, restarted)
- `dashboard:health-failed` - Health check failures
- `dashboard:port-changed` - Port reassignment events

## Example: WebSocket Client

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3030');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('dashboard:subscribe', { dashboardId: 'grafana' });
});

socket.on('dashboard:status', (data) => {
  console.log('Status update:', data);
});

socket.on('dashboard:health-failed', (data) => {
  console.log('Health check failed:', data);
});
```

## Architecture

- **HTTP Framework:** Hono (lightweight, fast)
- **WebSocket:** Socket.io (room-based subscriptions)
- **Validation:** Zod schemas

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test
```

## License

MIT
