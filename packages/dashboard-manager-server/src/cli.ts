#!/usr/bin/env node

/**
 * CLI Entry Point for Dashboard Manager Server
 *
 * Standalone HTTP server for dashboard-runner
 */

import { DashboardRunner } from '@lev-os/dashboard-runner';
import { createServer } from './index.js';
import { resolveLevRoot } from './host-root.js';
import type { LevAdapter } from './adapter.js';
import { ensurePortAvailable, formatAddressInUseError } from './port-guard.js';
import { join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'node:url';

// ============================================================================
// Parse CLI Arguments
// ============================================================================

export interface CliConfig {
  configPath: string;
  port: number;
  host: string;
  takeover: boolean;
  stateDir?: string;
}

function isLevAdapterFactoryModule(value: unknown): value is {
  readonly createLevAdapter: (opts: { readonly levRoot: string }) => LevAdapter;
} {
  return (
    value !== null
    && typeof value === 'object'
    && 'createLevAdapter' in value
    && typeof value.createLevAdapter === 'function'
  );
}

async function createConfiguredLevAdapter(levRoot: string): Promise<LevAdapter | undefined> {
  const adapterPackage = '@agentping/adapter-lev';
  let adapterModule: unknown;
  try {
    adapterModule = await import(adapterPackage);
  } catch {
    console.warn(`[CLI] ${adapterPackage} is not installed; continuing headless`);
    return undefined;
  }
  if (!isLevAdapterFactoryModule(adapterModule)) {
    throw new TypeError('The configured Lev adapter package does not export createLevAdapter');
  }
  return adapterModule.createLevAdapter({ levRoot });
}

export function parseArgs(args: string[] = process.argv.slice(2)): CliConfig {
  const config: CliConfig = {
    configPath: join(process.cwd(), 'dashboards.yaml'),
    port: 3030,
    host: '127.0.0.1',
    takeover: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--config' || arg === '-c') {
      config.configPath = args[++i];
    } else if (arg === '--port' || arg === '-p') {
      config.port = parseInt(args[++i], 10);
    } else if (arg === '--host' || arg === '-h') {
      config.host = args[++i];
    } else if (arg === '--state-dir') {
      config.stateDir = args[++i];
    } else if (arg === '--takeover') {
      config.takeover = true;
    } else if (arg === '--help') {
      console.log(`
Dashboard Manager Server

Usage:
  dashboard-manager-server [options]

Options:
  --config, -c <path>    Path to dashboards.yaml config file (default: ./dashboards.yaml)
  --port, -p <number>    HTTP server port (default: 3030)
  --host, -h <address>   Bind address (default: 127.0.0.1)
  --state-dir <path>     DashboardRunner state directory
  --takeover             If the port is occupied, SIGTERM the listener and bind
  --help                 Show this help message

Examples:
  dashboard-manager-server --config ~/dashboards.yaml
  dashboard-manager-server --port 8080 --host 0.0.0.0
  dashboard-manager-server --state-dir ~/.local/share/agentping/dashboard-runner
  dashboard-manager-server --takeover
      `);
      process.exit(0);
    }
  }

  return config;
}

// ============================================================================
// Error Handlers
// ============================================================================

// Prevent server crash on unhandled errors
process.on('uncaughtException', (error) => {
  console.error('[CLI] Uncaught exception:', error);
  console.error('[CLI] Stack:', error.stack);
  // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CLI] Unhandled promise rejection:', reason);
  // Don't exit - keep server running
});

// ============================================================================
// Main
// ============================================================================

async function main() {
  const config = parseArgs();

  console.log('[CLI] Dashboard Manager Server');
  console.log('[CLI] Config path:', config.configPath);

  // Validate config file exists
  if (!existsSync(config.configPath)) {
    console.error(`[CLI] Error: Config file not found: ${config.configPath}`);
    console.error('[CLI] Use --config to specify a valid dashboards.yaml file');
    process.exit(1);
  }

  const configuredHostRoot = process.env.AGENTPING_HOST_ROOT?.trim();
  const levRoot = configuredHostRoot ? await resolveLevRoot(configuredHostRoot) : null;
  const levAdapter = levRoot ? await createConfiguredLevAdapter(levRoot) : undefined;
  if (levAdapter) {
    console.log(`[CLI] Lev projection adapter enabled for ${levRoot}`);
  } else {
    console.log('[CLI] Lev projection adapter disabled: set AGENTPING_HOST_ROOT to a Lev host root');
  }

  try {
    const portCheck = await ensurePortAvailable({
      host: config.host,
      port: config.port,
      takeover: config.takeover,
    });
    if (!portCheck.ok) {
      console.error(portCheck.message);
      process.exit(1);
    }

    // Initialize DashboardRunner
    console.log('[CLI] Initializing DashboardRunner...');
    const runner = new DashboardRunner({
      configPath: config.configPath,
      stateDir: config.stateDir,
    });

    // Start runner
    await runner.start();
    console.log('[CLI] DashboardRunner started successfully');

    // Create HTTP server
    const server = createServer({
      runner,
      port: config.port,
      host: config.host,
      enableWebSocket: true,
      levAdapter,
    });

    // Start server
    const instance = server.start();
    instance.httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(formatAddressInUseError(config.host, config.port));
        process.exit(1);
      }
      console.error('[CLI] Server error:', error);
      process.exit(1);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n[CLI] Received shutdown signal');
      console.log('[CLI] Stopping runner...');
      await runner.stop();
      console.log('[CLI] Stopped successfully');
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    console.log('[CLI] Server ready. Press Ctrl+C to stop.');
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'EADDRINUSE') {
      console.error(formatAddressInUseError(config.host, config.port));
      process.exit(1);
    }
    console.error('[CLI] Fatal error:', error);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  void main();
}
