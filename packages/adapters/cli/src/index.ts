#!/usr/bin/env node
/**
 * AgentPing CLI
 * 
 * Command-line interface for agents to interact with humans.
 */

import { Command } from 'commander';
import ora from 'ora';

const API_BASE = process.env.AGENTPING_URL || 'http://localhost:7890';

// ============================================================================
// CLI Setup
// ============================================================================

const program = new Command();

program
    .name('agentping')
    .description('CLI for agent-human interaction')
    .version('0.1.0')
    .action(async () => {
        // Default to TUI if no command provided
        const { runUI } = await import('./ui/App.js');
        runUI();
    });

// ============================================================================
// Commands
// ============================================================================

// TUI Console
program
    .command('ui')
    .description('Launch the AgentPing Console (TUI)')
    .action(async () => {
        const { runUI } = await import('./ui/App.js');
        runUI();
    });

// Notify (fire and forget)
program
    .command('notify <message>')
    .description('Send a notification (no response needed)')
    .option('-l, --level <level>', 'Notification level: info, success, warning, error', 'info')
    .option('--agent <id>', 'Agent ID', 'cli-agent')
    .option('--agent-name <name>', 'Agent name', 'CLI Agent')
    .option('--session <id>', 'Session ID', 'cli-session')
    .action(async (message, options) => {
        const spinner = ora('Sending notification...').start();

        try {
            await sendPing({
                agentId: options.agent,
                agentName: options.agentName,
                sessionId: options.session,
                payload: {
                    type: 'notification',
                    message,
                    level: options.level,
                },
            });

            spinner.succeed('Notification sent');
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

// Ask (freeform question)
program
    .command('ask <question>')
    .description('Ask a question and wait for response')
    .option('-o, --options <options>', 'Comma-separated options', '')
    .option('-t, --timeout <seconds>', 'Timeout in seconds', '300')
    .option('--json', 'Output as JSON')
    .option('--quiet', 'Only output the answer')
    .option('--agent <id>', 'Agent ID', 'cli-agent')
    .option('--agent-name <name>', 'Agent name', 'CLI Agent')
    .option('--session <id>', 'Session ID', 'cli-session')
    .action(async (question, options) => {
        const spinner = ora('Waiting for human response...').start();

        try {
            const pingOptions = options.options ? options.options.split(',').map((s: string) => s.trim()) : undefined;

            const ping = await sendPing({
                agentId: options.agent,
                agentName: options.agentName,
                sessionId: options.session,
                payload: {
                    type: 'question',
                    question,
                    options: pingOptions,
                    allowFreeform: true,
                },
            });

            const response = await waitForResponse(ping.id, parseInt(options.timeout) * 1000);
            spinner.stop();

            if (!response) {
                console.error('Timeout waiting for response');
                process.exit(2);
            }

            if (options.json) {
                console.log(JSON.stringify(response, null, 2));
            } else if (options.quiet) {
                console.log(response.data.value || '');
            } else {
                console.log(`\nAnswer: ${response.data.value}`);
                if (response.enrichment?.notes) {
                    console.log(`Notes: ${response.enrichment.notes}`);
                }
            }
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

// Approve (yes/no)
program
    .command('approve <action>')
    .description('Request approval for an action')
    .option('-t, --timeout <seconds>', 'Timeout in seconds', '300')
    .option('--json', 'Output as JSON')
    .option('--quiet', 'Only output approved/denied')
    .option('--agent <id>', 'Agent ID', 'cli-agent')
    .option('--agent-name <name>', 'Agent name', 'CLI Agent')
    .option('--session <id>', 'Session ID', 'cli-session')
    .action(async (action, options) => {
        const spinner = ora('Waiting for approval...').start();

        try {
            const ping = await sendPing({
                agentId: options.agent,
                agentName: options.agentName,
                sessionId: options.session,
                payload: {
                    type: 'approval',
                    title: action,
                    action,
                },
            });

            const response = await waitForResponse(ping.id, parseInt(options.timeout) * 1000);
            spinner.stop();

            if (!response) {
                console.error('Timeout waiting for response');
                process.exit(2);
            }

            const approved = response.action === 'approved';

            if (options.json) {
                console.log(JSON.stringify({ approved, ...response }, null, 2));
            } else if (options.quiet) {
                console.log(approved ? 'approved' : 'denied');
            } else {
                console.log(approved ? '✓ Approved' : '✗ Denied');
            }

            process.exit(approved ? 0 : 1);
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

// Approve Steps (multi-step approval)
program
    .command('approve-steps')
    .description('Request approval for multiple steps')
    .requiredOption('-f, --file <file>', 'JSON file with steps')
    .option('-t, --timeout <seconds>', 'Timeout in seconds', '300')
    .option('--json', 'Output as JSON')
    .option('--agent <id>', 'Agent ID', 'cli-agent')
    .option('--agent-name <name>', 'Agent name', 'CLI Agent')
    .option('--session <id>', 'Session ID', 'cli-session')
    .action(async (options) => {
        const spinner = ora('Loading steps...').start();

        try {
            const fs = await import('fs');
            const content = fs.readFileSync(options.file, 'utf-8');
            const data = JSON.parse(content);

            spinner.text = 'Waiting for step approval...';

            const ping = await sendPing({
                agentId: options.agent,
                agentName: options.agentName,
                sessionId: options.session,
                payload: {
                    type: 'step_approval',
                    title: data.title || 'Step Approval',
                    context: data.context || '',
                    steps: data.steps,
                    allowPartial: data.allowPartial ?? true,
                    defaultApproved: data.defaultApproved || [],
                },
            });

            const response = await waitForResponse(ping.id, parseInt(options.timeout) * 1000);
            spinner.stop();

            if (!response) {
                console.error('Timeout waiting for response');
                process.exit(2);
            }

            if (options.json) {
                console.log(JSON.stringify(response, null, 2));
            } else {
                const stepData = response.data as any;
                console.log(`\n✓ Approved: ${stepData.approvedSteps?.join(', ') || 'none'}`);
                console.log(`✗ Denied: ${stepData.deniedSteps?.join(', ') || 'none'}`);

                if (response.enrichment?.directives?.length) {
                    console.log('\nDirectives:');
                    response.enrichment.directives.forEach((d: any) => {
                        console.log(`  - ${d.type}: ${JSON.stringify(d)}`);
                    });
                }
            }
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

// ============================================================================
// API Helpers
// ============================================================================

async function sendPing(request: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/pings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const error = await res.json() as { error?: string };
        throw new Error(error.error || 'Failed to send ping');
    }

    const data = await res.json() as { ping: unknown };
    return data.ping;
}

async function waitForResponse(pingId: string, timeoutMs: number): Promise<any> {
    const res = await fetch(`${API_BASE}/api/v1/pings/${pingId}/wait?timeout=${Math.floor(timeoutMs / 1000)}`);

    if (res.status === 408) {
        return null;
    }

    if (!res.ok) {
        const error = await res.json() as { error?: string };
        throw new Error(error.error || 'Failed to wait for response');
    }

    const data = await res.json() as { response: unknown };
    return data.response;
}

// ============================================================================
// Daemon Management Commands
// ============================================================================

import { spawn, execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const PID_FILE = join(homedir(), '.agentping', 'daemon.pid');
const LOG_FILE = join(homedir(), '.agentping', 'daemon.log');

const daemon = program.command('daemon').description('Manage AgentPing daemon');

daemon
    .command('start')
    .description('Start the AgentPing daemon')
    .option('-p, --port <port>', 'Port to listen on', '7890')
    .option('--foreground', 'Run in foreground (don\'t daemonize)')
    .action(async (options) => {
        // Check if already running
        if (existsSync(PID_FILE)) {
            try {
                const pid = parseInt(readFileSync(PID_FILE, 'utf-8').trim());
                process.kill(pid, 0); // Check if process exists
                console.log(`⚠️  Daemon already running (PID: ${pid})`);
                return;
            } catch {
                // PID file exists but process is dead, clean up
                unlinkSync(PID_FILE);
            }
        }

        if (options.foreground) {
            console.log('🚀 Starting daemon in foreground...');
            try {
                execSync('npx tsx packages/daemon/src/index.ts', {
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    env: { ...process.env, AGENTPING_PORT: options.port },
                });
            } catch {
                // Ctrl+C or error
            }
            return;
        }

        console.log('🚀 Starting AgentPing daemon...');

        const child = spawn('npx', ['tsx', 'packages/daemon/src/index.ts'], {
            cwd: process.cwd(),
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, AGENTPING_PORT: options.port },
        });

        if (child.pid) {
            writeFileSync(PID_FILE, String(child.pid));
            console.log(`✅ Daemon started (PID: ${child.pid})`);
            console.log(`   API: http://localhost:${options.port}/api/v1`);
            console.log(`   Logs: ${LOG_FILE}`);
        }

        child.unref();
    });

daemon
    .command('stop')
    .description('Stop the AgentPing daemon')
    .action(() => {
        if (!existsSync(PID_FILE)) {
            console.log('⚠️  Daemon is not running');
            return;
        }

        try {
            const pid = parseInt(readFileSync(PID_FILE, 'utf-8').trim());
            process.kill(pid, 'SIGTERM');
            unlinkSync(PID_FILE);
            console.log(`✅ Daemon stopped (PID: ${pid})`);
        } catch (err) {
            console.log('⚠️  Could not stop daemon:', (err as Error).message);
            try {
                unlinkSync(PID_FILE);
            } catch {
                // ignore
            }
        }
    });

daemon
    .command('status')
    .description('Check daemon status')
    .action(async () => {
        // Check PID file
        let pid: number | null = null;
        if (existsSync(PID_FILE)) {
            try {
                pid = parseInt(readFileSync(PID_FILE, 'utf-8').trim());
                process.kill(pid, 0); // Check if process exists
            } catch {
                pid = null;
                try { unlinkSync(PID_FILE); } catch { /* ignore */ }
            }
        }

        // Check health endpoint
        let healthy = false;
        try {
            const res = await fetch(`${API_BASE}/health`);
            healthy = res.ok;
        } catch {
            healthy = false;
        }

        if (healthy) {
            console.log('🟢 AgentPing daemon is running');
            if (pid) console.log(`   PID: ${pid}`);
            console.log(`   API: ${API_BASE}/api/v1`);

            // Get stats
            try {
                const res = await fetch(`${API_BASE}/api/v1/pings?status=pending`);
                if (res.ok) {
                    const data = await res.json() as { count: number };
                    console.log(`   Pending pings: ${data.count}`);
                }
            } catch {
                // ignore
            }
        } else {
            console.log('🔴 AgentPing daemon is not running');
            if (pid) {
                console.log(`   Stale PID: ${pid}`);
            }
        }
    });

daemon
    .command('restart')
    .description('Restart the AgentPing daemon')
    .option('-p, --port <port>', 'Port to listen on', '7890')
    .action(async (options) => {
        console.log('🔄 Restarting daemon...');

        // Stop
        if (existsSync(PID_FILE)) {
            try {
                const pid = parseInt(readFileSync(PID_FILE, 'utf-8').trim());
                process.kill(pid, 'SIGTERM');
                unlinkSync(PID_FILE);
                await new Promise(r => setTimeout(r, 1000));
            } catch {
                // ignore
            }
        }

        // Start
        const child = spawn('npx', ['tsx', 'packages/daemon/src/index.ts'], {
            cwd: process.cwd(),
            detached: true,
            stdio: 'ignore',
            env: { ...process.env, AGENTPING_PORT: options.port },
        });

        if (child.pid) {
            writeFileSync(PID_FILE, String(child.pid));
            console.log(`✅ Daemon restarted (PID: ${child.pid})`);
        }

        child.unref();
    });

// ============================================================================
// Run
// ============================================================================

program.parse();
