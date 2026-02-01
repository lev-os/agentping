# @lev-os/dashboard-runner

Resilient process management for dashboard applications with auto-restart, intelligent port selection, and comprehensive monitoring.

## Features

- **Auto-restart** - Exponential backoff retry strategy
- **Smart port selection** - Automatic port conflict resolution
- **Health monitoring** - Process + HTTP health checks
- **Comprehensive logging** - Structured logs with rotation
- **Event-driven** - React to process lifecycle events
- **Zero config** - Works out of the box with sensible defaults

## Installation

```bash
npm install @lev-os/dashboard-runner
# or
pnpm add @lev-os/dashboard-runner
```

## Quick Start

### 1. Create dashboard configuration

Create `config/dashboards.yaml`:

```yaml
dashboards:
  - name: My Dashboard
    id: my-dashboard
    port: 3000
    port_range: [3000, 3004]
    command: npm run dev -- --port {port}
    cwd: /path/to/dashboard
    health_check:
      type: http
      path: /
      timeout_ms: 5000
    restart_policy:
      enabled: true
      max_retries: 5
      backoff_ms: [1000, 2000, 4000, 8000, 16000]
```

### 2. Start the runner

```typescript
import { DashboardRunner } from '@lev-os/dashboard-runner';

const runner = new DashboardRunner({
  configPath: './config/dashboards.yaml'
});

// Listen for events
runner.on('process_started', ({ dashboardId, port }) => {
  console.log(`Dashboard ${dashboardId} started on port ${port}`);
});

runner.on('process_crashed', ({ dashboardId, reason }) => {
  console.log(`Dashboard ${dashboardId} crashed: ${reason}`);
});

runner.on('restart_failed', ({ dashboardId, attempts }) => {
  console.log(`Dashboard ${dashboardId} failed after ${attempts} retries`);
});

// Start all dashboards
await runner.start();
```

### 3. React to events in UI

```typescript
import { DashboardRunner } from '@lev-os/dashboard-runner';
import { useState, useEffect } from 'react';

function DashboardManager() {
  const [dashboards, setDashboards] = useState([]);
  const [runner] = useState(() => new DashboardRunner({
    configPath: './config/dashboards.yaml'
  }));

  useEffect(() => {
    runner.on('process_started', ({ dashboardId, port }) => {
      setDashboards(prev => prev.map(d =>
        d.id === dashboardId ? { ...d, status: 'online', port } : d
      ));
    });

    runner.on('process_crashed', ({ dashboardId }) => {
      setDashboards(prev => prev.map(d =>
        d.id === dashboardId ? { ...d, status: 'restarting' } : d
      ));
    });

    runner.start();

    return () => runner.stop();
  }, []);

  return (
    <div>
      {dashboards.map(d => (
        <div key={d.id}>
          {d.name} - {d.status} - Port: {d.port}
        </div>
      ))}
    </div>
  );
}
```

## Configuration

### Dashboard Config

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name |
| `id` | string | Unique identifier |
| `port` | number | Preferred port |
| `port_range` | number[] | Ports to try if preferred is occupied |
| `command` | string | Command to run (use `{port}` placeholder) |
| `cwd` | string | Working directory |
| `health_check` | object | Health check configuration |
| `restart_policy` | object | Restart behavior |

### Health Check Config

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | string | `http` | Check type (`http` or `process`) |
| `path` | string | `/` | HTTP endpoint to check |
| `timeout_ms` | number | `5000` | Request timeout |
| `expected_status` | number\|number[] | `200` | Expected HTTP status codes |
| `interval_ms` | number | `10000` | Check interval |

### Restart Policy

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable auto-restart |
| `max_retries` | number | `5` | Max restart attempts |
| `backoff_ms` | number[] | `[1000, 2000, 4000, 8000, 16000]` | Backoff delays |

## Events

The runner emits these events:

| Event | Payload | Description |
|-------|---------|-------------|
| `process_started` | `{ dashboardId, port, pid }` | Process started successfully |
| `process_crashed` | `{ dashboardId, reason, exitCode }` | Process exited unexpectedly |
| `restart_success` | `{ dashboardId, attempts }` | Process restarted successfully |
| `restart_failed` | `{ dashboardId, attempts }` | Max retries exceeded |
| `health_check_failed` | `{ dashboardId, reason }` | Health check failed |
| `port_changed` | `{ dashboardId, oldPort, newPort }` | Port changed due to conflict |

## API

### DashboardRunner

#### `constructor(options)`

Create a new dashboard runner.

**Options:**
- `configPath` (string) - Path to dashboards.yaml
- `logDir` (string) - Log directory (default: `~/.local/share/lev/dashboard-runner/logs`)
- `stateDir` (string) - State directory (default: `~/.local/share/lev/dashboard-runner`)

#### `start(): Promise<void>`

Start all configured dashboards.

#### `stop(): Promise<void>`

Stop all running dashboards gracefully.

#### `restart(dashboardId: string): Promise<void>`

Restart a specific dashboard.

#### `getStatus(dashboardId: string): DashboardStatus`

Get current status of a dashboard.

#### `on(event: string, callback: Function): void`

Listen for events.

## Logging

Logs are written to `~/.local/share/lev/dashboard-runner/logs/`:

- `runner.log` - Main runner log
- `{dashboard-id}.log` - Per-dashboard logs
- Automatic rotation at 10MB
- Structured JSON format

Example log entry:

```json
{
  "timestamp": "2026-01-29T12:34:56.789Z",
  "level": "info",
  "dashboardId": "my-dashboard",
  "message": "Process started",
  "port": 3001,
  "pid": 12345
}
```

## Port Management

The runner intelligently selects ports:

1. Try preferred port
2. Try ports in `port_range`
3. Find any available port in [6000-9000]
4. Avoids ports occupied by other processes

## Health Monitoring

Health checks run on configurable intervals:

- **Process check** - Verify PID exists
- **HTTP check** - Fetch endpoint with timeout
- **Combined** - Both must pass

Failed health checks trigger auto-restart if enabled.

## Restart Strategy

Exponential backoff prevents rapid restart loops:

```
Crash → Wait 1s → Restart
Crash → Wait 2s → Restart
Crash → Wait 4s → Restart
Crash → Wait 8s → Restart
Crash → Wait 16s → Restart
Crash → FAIL (max retries)
```

Successful restart resets the counter.

## License

MIT
