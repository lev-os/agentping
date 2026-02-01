# Agent Usage Guide

This guide shows AI agents how to interact with the Dashboard Manager system programmatically.

## Overview

The Dashboard Manager is a config-driven system for managing multiple dashboard processes. It provides:
- **JSON Schema validation** for configuration files
- **REST API** for runtime management
- **CLI commands** for config editing
- **Environment variable overrides** for flexible deployment

## Configuration

### Config File Location

The system uses a YAML configuration file located at:

```
~/digital/leviathan/core/agent-harness/vendor/AgentPing/packages/dashboard-runner/config/dashboards.yaml
```

**Environment variable override:**
```bash
export DASHBOARD_CONFIG_PATH=~/custom/path/dashboards.yaml
```

### Config Schema

The configuration is validated against a JSON Schema at:
```
packages/dashboard-runner/src/schemas/dashboard-config.schema.json
```

**Basic structure:**
```yaml
dashboards:
  - name: "Human-readable name"
    id: "unique-kebab-case-id"
    port: 3000
    port_range: [3000, 3004]
    command: "npm run dev --port {port}"
    cwd: ~/path/to/project
    health_check:
      type: http
      path: /
      timeout_ms: 5000
      expected_status: 200
      interval_ms: 10000
    restart_policy:
      enabled: true
      max_retries: 5
      backoff_ms: [1000, 2000, 4000, 8000, 16000]
    env:
      NODE_ENV: development
```

### Required Fields

- `name`: String, human-readable display name
- `id`: String, unique identifier (lowercase, hyphens only)
- `port`: Integer, default port (1024-65535)
- `port_range`: Array of 2 integers, port range to try
- `command`: String, command to execute (use `{port}` placeholder)
- `cwd`: String, working directory (supports tilde expansion)

### Optional Fields

- `health_check`: Health check configuration
  - `type`: "http" or "process"
  - `path`: HTTP endpoint path (for http type)
  - `timeout_ms`: Health check timeout
  - `expected_status`: Number or array of acceptable status codes
  - `interval_ms`: Time between health checks
- `restart_policy`: Automatic restart configuration
  - `enabled`: Boolean, enable auto-restart
  - `max_retries`: Maximum restart attempts
  - `backoff_ms`: Array of backoff delays
- `env`: Object, environment variables for the process

## CLI Commands

### Add Dashboard

```bash
node packages/dashboard-manager-server/src/cli-manage.ts add-dashboard \
  <id> <name> <port> <portRangeStart> <portRangeEnd> <command> <cwd> \
  [--config=<path>]
```

**Example:**
```bash
node packages/dashboard-manager-server/src/cli-manage.ts add-dashboard \
  my-app "My Application" 3000 3000 3004 "npm run dev -- --port {port}" ~/my-app
```

### Remove Dashboard

```bash
node packages/dashboard-manager-server/src/cli-manage.ts remove-dashboard <id> [--config=<path>]
```

**Example:**
```bash
node packages/dashboard-manager-server/src/cli-manage.ts remove-dashboard my-app
```

### Restart Dashboard

```bash
node packages/dashboard-manager-server/src/cli-manage.ts restart-dashboard <id> [--server=<url>]
```

**Example:**
```bash
node packages/dashboard-manager-server/src/cli-manage.ts restart-dashboard my-app
```

### List Dashboards

```bash
node packages/dashboard-manager-server/src/cli-manage.ts list [--config=<path>]
```

## REST API

### Base URL

Default: `http://127.0.0.1:3030`

**Environment variable override:**
```bash
export DASHBOARD_SERVER_URL=http://custom-host:8080
```

### Endpoints

See [API Reference](./api-reference.md) for detailed endpoint documentation.

**Quick reference:**
- `GET /api/dashboards` - List all dashboards
- `GET /api/dashboards/:id` - Get dashboard status
- `POST /api/dashboards/:id/restart` - Restart dashboard
- `GET /api/dashboards/:id/metrics` - Get dashboard metrics

## Agent Workflows

### Workflow 1: Add New Dashboard

1. **Validate input** against schema
2. **Add to config** using CLI command
3. **Verify addition** by listing dashboards
4. **Restart server** if running (to pick up new config)

```bash
# Step 1: Add dashboard
node packages/dashboard-manager-server/src/cli-manage.ts add-dashboard \
  new-app "New App" 4000 4000 4004 "pnpm dev --port {port}" ~/projects/new-app

# Step 2: Verify
node packages/dashboard-manager-server/src/cli-manage.ts list

# Step 3: Restart server (if running)
# Send SIGTERM to running process and restart
```

### Workflow 2: Monitor Dashboard Health

1. **Query status** via REST API
2. **Check health** status
3. **Restart if needed**

```bash
# Step 1: Get status
curl http://127.0.0.1:3030/api/dashboards/my-app

# Step 2: Check metrics
curl http://127.0.0.1:3030/api/dashboards/my-app/metrics

# Step 3: Restart if unhealthy
curl -X POST http://127.0.0.1:3030/api/dashboards/my-app/restart
```

### Workflow 3: Bulk Dashboard Management

```bash
# List all dashboards
curl http://127.0.0.1:3030/api/dashboards | jq '.[] | {id, status: .status.status, healthy: .status.healthy}'

# Restart all unhealthy dashboards
for id in $(curl -s http://127.0.0.1:3030/api/dashboards | jq -r '.[] | select(.status.healthy == false) | .id'); do
  curl -X POST http://127.0.0.1:3030/api/dashboards/$id/restart
done
```

## Environment Variables Reference

| Variable | Purpose | Default |
|----------|---------|---------|
| `DASHBOARD_CONFIG_PATH` | Override config file path | `~/digital/leviathan/.../dashboards.yaml` |
| `DASHBOARD_SERVER_URL` | Override server URL | `http://127.0.0.1:3030` |

## Validation

The system validates configurations using the JSON Schema. Invalid configs are rejected with detailed error messages.

**Common validation errors:**
- Missing required fields (id, name, port, command, cwd)
- Invalid port range (must be 1024-65535)
- Invalid ID format (must be lowercase with hyphens)
- Duplicate dashboard IDs

## Best Practices for Agents

1. **Always validate** before adding dashboards
2. **Use environment variables** for deployment flexibility
3. **Check status** before restarting
4. **Monitor health metrics** for proactive management
5. **Use unique IDs** to avoid conflicts
6. **Set appropriate port ranges** to avoid conflicts
7. **Include health checks** for production dashboards
8. **Configure restart policies** based on dashboard criticality

## Troubleshooting

### Config not found
- Check `DASHBOARD_CONFIG_PATH` environment variable
- Verify file exists at expected location
- Use `--config` flag to specify path explicitly

### Dashboard won't start
- Check port availability
- Verify command is correct
- Check working directory exists
- Review process logs in dashboard-runner

### Health checks failing
- Verify `expected_status` codes are correct
- Increase `timeout_ms` for slow-starting apps
- Check `path` is accessible
- Use `process` type health check for non-HTTP apps

## Examples

### Example 1: Storybook Dashboard

```yaml
- name: Component Library Storybook
  id: storybook-ui
  port: 6006
  port_range: [6006, 6010]
  command: pnpm storybook --port {port}
  cwd: ~/projects/component-library
  health_check:
    type: http
    path: /
    timeout_ms: 5000
    expected_status: 200
    interval_ms: 10000
  restart_policy:
    enabled: true
    max_retries: 5
    backoff_ms: [1000, 2000, 4000, 8000, 16000]
```

### Example 2: Next.js Development Server

```yaml
- name: Next.js App
  id: nextjs-app
  port: 3000
  port_range: [3000, 3004]
  command: npm run dev -- --port {port}
  cwd: ~/projects/nextjs-app
  health_check:
    type: http
    path: /
    timeout_ms: 5000
    expected_status: [200, 307]  # Accept redirects
    interval_ms: 10000
  restart_policy:
    enabled: true
    max_retries: 3
    backoff_ms: [2000, 4000, 8000]
  env:
    NODE_ENV: development
    NEXT_TELEMETRY_DISABLED: "1"
```

### Example 3: Vite Development Server

```yaml
- name: Vite Dashboard
  id: vite-app
  port: 5173
  port_range: [5173, 5177]
  command: bunx vite --port {port}
  cwd: ~/projects/vite-app
  health_check:
    type: http
    path: /
    timeout_ms: 5000
    expected_status: 200
    interval_ms: 10000
  restart_policy:
    enabled: true
    max_retries: 5
    backoff_ms: [1000, 2000, 4000, 8000, 16000]
```
