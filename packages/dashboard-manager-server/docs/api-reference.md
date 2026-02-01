# Dashboard Manager API Reference

Complete reference for all REST API endpoints and WebSocket events.

## Base URL

Default: `http://127.0.0.1:3030`

Override with environment variable:
```bash
export DASHBOARD_SERVER_URL=http://custom-host:8080
```

## Authentication

Currently no authentication required. All endpoints are accessible on localhost.

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

HTTP status codes indicate success (2xx) or failure (4xx, 5xx).

---

## Endpoints

### Health Check

Check if the server is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-31T12:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Server is healthy

---

### List All Dashboards

Get status and configuration for all dashboards.

**Endpoint:** `GET /api/dashboards`

**Response:**
```json
[
  {
    "id": "agentping",
    "config": {
      "name": "AgentPing Storybook",
      "id": "agentping",
      "port": 6006,
      "port_range": [6006, 6010],
      "command": "pnpm storybook --port {port}",
      "cwd": "~/digital/leviathan/core/agent-harness/vendor/AgentPing/packages/studio",
      "health_check": {
        "type": "http",
        "path": "/",
        "timeout_ms": 5000,
        "expected_status": 200,
        "interval_ms": 10000
      },
      "restart_policy": {
        "enabled": true,
        "max_retries": 5,
        "backoff_ms": [1000, 2000, 4000, 8000, 16000]
      }
    },
    "status": {
      "status": "online",
      "port": 6006,
      "pid": 12345,
      "startedAt": "2026-01-31T11:30:00.000Z",
      "restartAttempts": 0,
      "healthy": true,
      "lastHealthCheck": "2026-01-31T12:00:00.000Z"
    }
  }
]
```

**Status Values:**
- `starting` - Dashboard is starting up
- `online` - Dashboard is running and healthy
- `restarting` - Dashboard is restarting
- `failed` - Dashboard failed to start or crashed
- `stopped` - Dashboard is intentionally stopped

**Status Codes:**
- `200 OK` - Successfully retrieved dashboards
- `500 Internal Server Error` - Server error

---

### Get Dashboard Status

Get detailed status for a specific dashboard.

**Endpoint:** `GET /api/dashboards/:id`

**Path Parameters:**
- `id` (string, required) - Dashboard ID

**Response:**
```json
{
  "id": "agentping",
  "config": {
    "name": "AgentPing Storybook",
    "id": "agentping",
    "port": 6006,
    "port_range": [6006, 6010],
    "command": "pnpm storybook --port {port}",
    "cwd": "~/digital/leviathan/core/agent-harness/vendor/AgentPing/packages/studio",
    "health_check": {
      "type": "http",
      "path": "/",
      "timeout_ms": 5000,
      "expected_status": 200,
      "interval_ms": 10000
    },
    "restart_policy": {
      "enabled": true,
      "max_retries": 5,
      "backoff_ms": [1000, 2000, 4000, 8000, 16000]
    }
  },
  "status": {
    "status": "online",
    "port": 6006,
    "pid": 12345,
    "startedAt": "2026-01-31T11:30:00.000Z",
    "restartAttempts": 0,
    "healthy": true,
    "lastHealthCheck": "2026-01-31T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved dashboard
- `404 Not Found` - Dashboard ID not found
- `500 Internal Server Error` - Server error

**Example:**
```bash
curl http://127.0.0.1:3030/api/dashboards/agentping
```

---

### Restart Dashboard

Restart a specific dashboard.

**Endpoint:** `POST /api/dashboards/:id/restart`

**Path Parameters:**
- `id` (string, required) - Dashboard ID

**Response:**
```json
{
  "success": true,
  "message": "Dashboard agentping restart initiated"
}
```

**Status Codes:**
- `200 OK` - Restart initiated successfully
- `404 Not Found` - Dashboard ID not found
- `500 Internal Server Error` - Server error

**Example:**
```bash
curl -X POST http://127.0.0.1:3030/api/dashboards/agentping/restart
```

**Notes:**
- Restart is asynchronous; response indicates restart was initiated, not completed
- Check dashboard status endpoint to verify restart completion
- Dashboard goes through `restarting` status before returning to `online`

---

### Get Dashboard Metrics

Get runtime metrics for a specific dashboard.

**Endpoint:** `GET /api/dashboards/:id/metrics`

**Path Parameters:**
- `id` (string, required) - Dashboard ID

**Response:**
```json
{
  "uptime_ms": 3600000,
  "restarts": 0,
  "last_health_check": "2026-01-31T12:00:00.000Z",
  "healthy": true
}
```

**Fields:**
- `uptime_ms` - Milliseconds since dashboard started (0 if not running)
- `restarts` - Number of restart attempts
- `last_health_check` - ISO timestamp of last health check
- `healthy` - Boolean indicating current health status

**Status Codes:**
- `200 OK` - Successfully retrieved metrics
- `404 Not Found` - Dashboard ID not found
- `500 Internal Server Error` - Server error

**Example:**
```bash
curl http://127.0.0.1:3030/api/dashboards/agentping/metrics
```

---

## WebSocket API

The Dashboard Manager supports real-time updates via WebSocket using Socket.io.

### Connection

**URL:** `ws://127.0.0.1:3030/socket.io`

**Example (Socket.io client):**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:3030');

socket.on('connect', () => {
  console.log('Connected to Dashboard Manager');
});
```

### Events

#### Server → Client Events

##### `dashboard:status`
Emitted when a dashboard status changes.

**Payload:**
```json
{
  "id": "agentping",
  "status": {
    "status": "online",
    "port": 6006,
    "pid": 12345,
    "startedAt": "2026-01-31T11:30:00.000Z",
    "restartAttempts": 0,
    "healthy": true,
    "lastHealthCheck": "2026-01-31T12:00:00.000Z"
  }
}
```

**Example:**
```javascript
socket.on('dashboard:status', (data) => {
  console.log(`Dashboard ${data.id} status: ${data.status.status}`);
});
```

##### `dashboard:event`
Emitted for lifecycle events (started, crashed, restarted, etc.).

**Payload:**
```json
{
  "type": "process_started",
  "dashboardId": "agentping",
  "port": 6006,
  "pid": 12345
}
```

**Event Types:**
- `process_started` - Dashboard process started
- `process_crashed` - Dashboard process crashed
- `restart_success` - Dashboard restarted successfully
- `restart_failed` - Dashboard restart failed
- `health_check_failed` - Health check failed
- `port_changed` - Dashboard port changed

**Example:**
```javascript
socket.on('dashboard:event', (event) => {
  console.log(`Event: ${event.type} for ${event.dashboardId}`);
});
```

#### Client → Server Events

##### `subscribe:dashboard`
Subscribe to updates for a specific dashboard.

**Payload:**
```json
{
  "dashboardId": "agentping"
}
```

**Example:**
```javascript
socket.emit('subscribe:dashboard', { dashboardId: 'agentping' });
```

##### `unsubscribe:dashboard`
Unsubscribe from updates for a specific dashboard.

**Payload:**
```json
{
  "dashboardId": "agentping"
}
```

**Example:**
```javascript
socket.emit('unsubscribe:dashboard', { dashboardId: 'agentping' });
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider implementing rate limiting at the reverse proxy level.

## CORS

CORS is enabled for all origins by default (`*`).

Override by setting `corsOrigins` in server configuration:
```typescript
const server = createServer({
  runner,
  corsOrigins: ['http://localhost:3000', 'http://localhost:5173'],
});
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Human-readable error message"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Successful operation
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Data Types

### DashboardConfig

```typescript
interface DashboardConfig {
  name: string;              // Human-readable name
  id: string;                // Unique identifier (kebab-case)
  port: number;              // Default port (1024-65535)
  port_range: [number, number]; // Port range to try
  command: string;           // Command to execute (use {port})
  cwd: string;               // Working directory
  health_check?: HealthCheckConfig;
  restart_policy?: RestartPolicyConfig;
  env?: Record<string, string>; // Environment variables
}
```

### HealthCheckConfig

```typescript
interface HealthCheckConfig {
  type: 'http' | 'process';
  path?: string;             // HTTP endpoint path
  timeout_ms?: number;       // Timeout in milliseconds
  expected_status?: number | number[]; // Acceptable status codes
  interval_ms?: number;      // Check interval in milliseconds
}
```

### RestartPolicyConfig

```typescript
interface RestartPolicyConfig {
  enabled: boolean;          // Enable auto-restart
  max_retries: number;       // Maximum restart attempts
  backoff_ms: number[];      // Exponential backoff delays
}
```

### DashboardStatus

```typescript
interface DashboardStatus {
  id: string;
  status: 'starting' | 'online' | 'restarting' | 'failed' | 'stopped';
  port?: number;             // Current port (if running)
  pid?: number;              // Process ID (if running)
  startedAt?: string;        // ISO timestamp of start time
  restartAttempts: number;   // Number of restart attempts
  lastHealthCheck?: string;  // ISO timestamp of last health check
  healthy?: boolean;         // Current health status
}
```

## Examples

### Monitor All Dashboards (REST)

```bash
#!/bin/bash

# Get all dashboard statuses
dashboards=$(curl -s http://127.0.0.1:3030/api/dashboards)

# Extract unhealthy dashboards
echo "$dashboards" | jq '.[] | select(.status.healthy == false) | {id, status: .status.status}'
```

### Monitor Dashboard (WebSocket)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:3030');

// Subscribe to specific dashboard
socket.emit('subscribe:dashboard', { dashboardId: 'agentping' });

// Listen for status updates
socket.on('dashboard:status', (data) => {
  console.log(`Status update for ${data.id}:`, data.status);
});

// Listen for events
socket.on('dashboard:event', (event) => {
  if (event.type === 'process_crashed') {
    console.error(`Dashboard ${event.dashboardId} crashed!`);
  }
});
```

### Automated Health Check

```bash
#!/bin/bash

# Check health of all dashboards and restart if needed
for dashboard in $(curl -s http://127.0.0.1:3030/api/dashboards | jq -r '.[].id'); do
  metrics=$(curl -s http://127.0.0.1:3030/api/dashboards/$dashboard/metrics)
  healthy=$(echo "$metrics" | jq -r '.healthy')

  if [ "$healthy" != "true" ]; then
    echo "Restarting unhealthy dashboard: $dashboard"
    curl -X POST http://127.0.0.1:3030/api/dashboards/$dashboard/restart
  fi
done
```

---

## Support

For issues or feature requests, see the main README or open an issue in the repository.
