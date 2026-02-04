/**
 * AgentPing CLI Config Commands
 *
 * CLI subcommands for managing configuration:
 * - config init [--global|--project]
 * - config show [--json]
 * - config set <key> <value> [--global|--project]
 * - config paths
 */

import { Command } from 'commander';
import ora from 'ora';

// ============================================================================
// Config Command Group
// ============================================================================

export function registerConfigCommands(program: Command): void {
  const config = program
    .command('config')
    .description('Manage AgentPing configuration');

  // ========================================================================
  // config init
  // ========================================================================

  config
    .command('init')
    .description('Initialize a new config file with defaults')
    .option('--global', 'Create global config (~/.config/agentping/config.yaml)')
    .option('--project', 'Create project-local config (.agents/.agentping/config.yaml)')
    .action(async (options) => {
      const spinner = ora('Initializing config...').start();

      try {
        // Dynamic import to avoid bundling daemon code in CLI
        const { initConfig } = await importConfig();

        const target = options.global ? 'global' : 'project';
        const filePath = initConfig(target);

        spinner.succeed(`Config initialized: ${filePath}`);
      } catch (err) {
        spinner.fail(`Failed to initialize config: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // ========================================================================
  // config show
  // ========================================================================

  config
    .command('show')
    .description('Show the resolved configuration')
    .option('--json', 'Output as JSON instead of YAML')
    .option('--sources', 'Show config sources and resolution order')
    .action(async (options) => {
      const spinner = ora('Loading config...').start();

      try {
        const { resolveConfig } = await importConfig();
        const { config: resolved, sources } = resolveConfig();

        spinner.stop();

        if (options.sources) {
          console.log('\nConfig sources (lowest → highest priority):');
          console.log('─'.repeat(50));

          if (sources.length === 0) {
            console.log('  No config files found, using defaults');
          } else {
            for (const source of sources) {
              console.log(`  ${source.name}: ${source.path}`);
            }
          }
          console.log();
        }

        if (options.json) {
          console.log(JSON.stringify(resolved, null, 2));
        } else {
          const { stringify } = await import('yaml');
          console.log(stringify(resolved, { indent: 2 }));
        }
      } catch (err) {
        spinner.fail(`Failed to load config: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // ========================================================================
  // config set
  // ========================================================================

  config
    .command('set <key> <value>')
    .description('Set a config value (dot-notation, e.g. notification.style toast)')
    .option('--global', 'Set in global config')
    .option('--project', 'Set in project-local config (default)')
    .action(async (key, value, options) => {
      const spinner = ora(`Setting ${key}...`).start();

      try {
        const { setConfigValue } = await importConfig();

        const target = options.global ? 'global' : 'project';
        const filePath = setConfigValue(key, value, target);

        spinner.succeed(`Set ${key} = ${value} in ${filePath}`);
      } catch (err) {
        spinner.fail(`Failed to set config: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // ========================================================================
  // config paths
  // ========================================================================

  config
    .command('paths')
    .description('Show all config search paths')
    .action(async () => {
      try {
        const { getAllConfigSearchPaths, getDataDir, getStateDir, getCacheDir } = await importXdgPaths();
        const { existsSync } = await import('fs');

        console.log('\nConfig search paths (highest → lowest priority):');
        console.log('─'.repeat(55));

        const searchPaths = getAllConfigSearchPaths();
        for (const p of searchPaths) {
          // Extract actual path (before the description in parentheses)
          const actualPath = p.split(' (')[0];
          const exists = existsSync(actualPath);
          const marker = exists ? '✓' : '·';
          console.log(`  ${marker} ${p}`);
        }

        console.log('\nData directories:');
        console.log('─'.repeat(55));
        console.log(`  Data:  ${getDataDir()}`);
        console.log(`  State: ${getStateDir()}`);
        console.log(`  Cache: ${getCacheDir()}`);
        console.log();
      } catch (err) {
        console.error(`Failed: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  // ========================================================================
  // config get
  // ========================================================================

  config
    .command('get <key>')
    .description('Get a specific config value (dot-notation)')
    .option('--json', 'Output as JSON')
    .action(async (key, options) => {
      try {
        const { resolveConfig } = await importConfig();
        const { config: resolved } = resolveConfig();

        // Navigate dot-notation
        const parts = key.split('.');
        let value: unknown = resolved;

        for (const part of parts) {
          if (value && typeof value === 'object' && part in value) {
            value = (value as Record<string, unknown>)[part];
          } else {
            console.error(`Key not found: ${key}`);
            process.exit(1);
          }
        }

        if (options.json) {
          console.log(JSON.stringify(value, null, 2));
        } else if (typeof value === 'object') {
          const { stringify } = await import('yaml');
          console.log(stringify(value, { indent: 2 }));
        } else {
          console.log(String(value));
        }
      } catch (err) {
        console.error(`Failed: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}

// ============================================================================
// Dynamic Import Helpers
// ============================================================================

/**
 * Import config module from daemon package
 */
async function importConfig() {
  return await import('@agentping/daemon/config');
}

/**
 * Import XDG paths module from daemon package
 */
async function importXdgPaths() {
  return await import('@agentping/daemon/xdg-paths');
}
