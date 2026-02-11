#!/usr/bin/env node

/**
 * Dashboard Manager CLI
 *
 * Command-line interface for managing dashboards
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { parse, stringify } from 'yaml';
import type { DashboardConfig } from '@lev-os/dashboard-runner';

// ============================================================================
// Configuration Path Resolution
// ============================================================================

function resolveConfigPath(configPath?: string): string {
  if (configPath) {
    return resolve(configPath);
  }

  // Check env variable first
  const envPath = process.env.DASHBOARD_CONFIG_PATH;
  if (envPath) {
    return resolve(envPath.replace('~', homedir()));
  }

  // Default path
  return resolve(
    homedir(),
    'digital/leviathan/community/agentping/packages/dashboard-runner/config/dashboards.yaml'
  );
}

// ============================================================================
// Configuration Management
// ============================================================================

interface DashboardsYaml {
  dashboards: DashboardConfig[];
}

function loadConfig(configPath: string): DashboardsYaml {
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const content = readFileSync(configPath, 'utf-8');
  return parse(content) as DashboardsYaml;
}

function saveConfig(configPath: string, config: DashboardsYaml): void {
  const content = stringify(config, { lineWidth: 0 });
  writeFileSync(configPath, content, 'utf-8');
  console.log(`✅ Configuration saved to ${configPath}`);
}

// ============================================================================
// CLI Commands
// ============================================================================

/**
 * Add a new dashboard to the configuration
 */
function addDashboard(options: {
  id: string;
  name: string;
  port: number;
  portRangeStart: number;
  portRangeEnd: number;
  command: string;
  cwd: string;
  configPath?: string;
  env?: Record<string, string>;
}) {
  const configPath = resolveConfigPath(options.configPath);
  const config = loadConfig(configPath);

  // Check if dashboard with this ID already exists
  if (config.dashboards.some((d) => d.id === options.id)) {
    throw new Error(`Dashboard with id "${options.id}" already exists`);
  }

  // Expand tilde in cwd
  const cwd = options.cwd.replace('~', homedir());

  // Create new dashboard config
  const newDashboard: DashboardConfig = {
    name: options.name,
    id: options.id,
    port: options.port,
    port_range: [options.portRangeStart, options.portRangeEnd],
    command: options.command,
    cwd,
    health_check: {
      type: 'http',
      path: '/',
      timeout_ms: 5000,
      expected_status: 200,
      interval_ms: 10000,
    },
    restart_policy: {
      enabled: true,
      max_retries: 5,
      backoff_ms: [1000, 2000, 4000, 8000, 16000],
    },
    env: options.env,
  };

  config.dashboards.push(newDashboard);
  saveConfig(configPath, config);

  console.log(`✅ Dashboard "${options.name}" (${options.id}) added successfully`);
}

/**
 * Remove a dashboard from the configuration
 */
function removeDashboard(options: { id: string; configPath?: string }) {
  const configPath = resolveConfigPath(options.configPath);
  const config = loadConfig(configPath);

  const originalCount = config.dashboards.length;
  config.dashboards = config.dashboards.filter((d) => d.id !== options.id);

  if (config.dashboards.length === originalCount) {
    throw new Error(`Dashboard with id "${options.id}" not found`);
  }

  saveConfig(configPath, config);
  console.log(`✅ Dashboard "${options.id}" removed successfully`);
}

/**
 * Restart a specific dashboard
 */
async function restartDashboard(options: { id: string; serverUrl?: string }) {
  const serverUrl = options.serverUrl || process.env.DASHBOARD_SERVER_URL || 'http://127.0.0.1:3030';

  console.log(`🔄 Restarting dashboard "${options.id}"...`);

  try {
    const response = await fetch(`${serverUrl}/api/dashboards/${options.id}/restart`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json() as { error?: string };
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json() as { message?: string };
    console.log(`✅ ${result.message}`);
  } catch (error) {
    throw new Error(`Failed to restart dashboard: ${(error as Error).message}`);
  }
}

/**
 * List all dashboards in the configuration
 */
function listDashboards(options: { configPath?: string }) {
  const configPath = resolveConfigPath(options.configPath);
  const config = loadConfig(configPath);

  console.log(`\n📊 Dashboards (${config.dashboards.length}):\n`);

  for (const dashboard of config.dashboards) {
    console.log(`  ${dashboard.id}`);
    console.log(`    Name: ${dashboard.name}`);
    console.log(`    Port: ${dashboard.port} (range: ${dashboard.port_range.join('-')})`);
    console.log(`    Command: ${dashboard.command}`);
    console.log(`    CWD: ${dashboard.cwd}`);
    console.log('');
  }
}

// ============================================================================
// Main CLI Handler
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'add-dashboard': {
        const id = args[1];
        const name = args[2];
        const port = parseInt(args[3], 10);
        const portRangeStart = parseInt(args[4], 10);
        const portRangeEnd = parseInt(args[5], 10);
        const cmd = args[6];
        const cwd = args[7];
        const configPath = args.find((a) => a.startsWith('--config='))?.split('=')[1];

        if (!id || !name || !port || !portRangeStart || !portRangeEnd || !cmd || !cwd) {
          console.error('Usage: dashboard-cli add-dashboard <id> <name> <port> <portRangeStart> <portRangeEnd> <command> <cwd> [--config=<path>]');
          process.exit(1);
        }

        addDashboard({ id, name, port, portRangeStart, portRangeEnd, command: cmd, cwd, configPath });
        break;
      }

      case 'remove-dashboard': {
        const id = args[1];
        const configPath = args.find((a) => a.startsWith('--config='))?.split('=')[1];

        if (!id) {
          console.error('Usage: dashboard-cli remove-dashboard <id> [--config=<path>]');
          process.exit(1);
        }

        removeDashboard({ id, configPath });
        break;
      }

      case 'restart-dashboard': {
        const id = args[1];
        const serverUrl = args.find((a) => a.startsWith('--server='))?.split('=')[1];

        if (!id) {
          console.error('Usage: dashboard-cli restart-dashboard <id> [--server=<url>]');
          process.exit(1);
        }

        await restartDashboard({ id, serverUrl });
        break;
      }

      case 'list': {
        const configPath = args.find((a) => a.startsWith('--config='))?.split('=')[1];
        listDashboards({ configPath });
        break;
      }

      default:
        console.log(`
Dashboard Manager CLI

Commands:
  add-dashboard <id> <name> <port> <portRangeStart> <portRangeEnd> <command> <cwd> [--config=<path>]
    Add a new dashboard to the configuration

  remove-dashboard <id> [--config=<path>]
    Remove a dashboard from the configuration

  restart-dashboard <id> [--server=<url>]
    Restart a running dashboard via the API server

  list [--config=<path>]
    List all dashboards in the configuration

Environment Variables:
  DASHBOARD_CONFIG_PATH - Override default config path
  DASHBOARD_SERVER_URL  - Override default server URL (http://127.0.0.1:3030)

Examples:
  dashboard-cli add-dashboard my-app "My App" 3000 3000 3004 "npm run dev" ~/my-app
  dashboard-cli restart-dashboard my-app
  dashboard-cli remove-dashboard my-app
  dashboard-cli list
        `);
    }
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
