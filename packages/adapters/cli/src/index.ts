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
// Lease Commands
// ============================================================================

const lease = program.command('lease').description('Manage capability leases');

lease
    .command('request')
    .description('Request a scoped capability lease')
    .requiredOption('-s, --scope <scope>', 'Lease scope: browser, filesystem, network, shell, custom')
    .requiredOption('--ttl <duration>', 'Time-to-live (e.g. 15m, 1h, 30s)')
    .requiredOption('-r, --reason <reason>', 'Reason for the lease request')
    .option('-w, --wait', 'Block until lease is granted/denied by the daemon lease-manager')
    .option('-t, --timeout <seconds>', 'Timeout in seconds', '300')
    .option('--poll-interval <ms>', 'Poll interval in ms when using --wait', '1000')
    .option('--json', 'Output as JSON')
    .option('--quiet', 'Only output the token')
    .option('--agent <id>', 'Agent ID', 'cli-agent')
    .option('--agent-name <name>', 'Agent name', 'CLI Agent')
    .option('--session <id>', 'Session ID', 'cli-session')
    .option('--constraints <json>', 'JSON constraints object')
    .action(async (options) => {
        const spinner = ora('Requesting lease approval...').start();

        try {
            const constraints = options.constraints ? JSON.parse(options.constraints) : undefined;

            const ping = await sendPing({
                agentId: options.agent,
                agentName: options.agentName,
                sessionId: options.session,
                payload: {
                    type: 'lease_request',
                    scope: options.scope,
                    ttl: options.ttl,
                    reason: options.reason,
                    constraints,
                },
            });

            const timeoutMs = parseInt(options.timeout) * 1000;

            let response: any;
            if (options.wait) {
                spinner.text = 'Waiting for lease activation...';
                response = await waitForLeaseActivation(
                    ping.id,
                    timeoutMs,
                    parseInt(options.pollInterval),
                );
            } else {
                response = await waitForResponse(ping.id, timeoutMs);
            }

            spinner.stop();

            if (!response) {
                console.error('Timeout waiting for lease approval');
                process.exit(2);
            }

            const granted = response.action === 'approved';

            if (options.json) {
                console.log(JSON.stringify({ granted, ...response }, null, 2));
            } else if (options.quiet) {
                if (granted && response.data?.token) {
                    console.log(response.data.token);
                } else {
                    console.error(granted ? 'granted (no token)' : 'denied');
                    process.exit(granted ? 0 : 1);
                }
            } else {
                if (granted) {
                    console.log(`\n✓ Lease granted: ${options.scope} (${options.ttl})`);
                    if (response.data?.token) {
                        console.log(`  Token: ${response.data.token}`);
                    }
                    if (response.data?.expiresAt) {
                        console.log(`  Expires: ${response.data.expiresAt}`);
                    }
                } else {
                    console.log('✗ Lease denied');
                }
            }

            process.exit(granted ? 0 : 1);
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

lease
    .command('status')
    .description('Check active lease status')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
        const spinner = ora('Checking lease status...').start();

        try {
            const res = await fetch(`${API_BASE}/api/v1/pings?status=responded&limit=20`);

            if (!res.ok) {
                throw new Error('Failed to fetch pings');
            }

            const data = await res.json() as { pings: any[] };
            const leases = data.pings.filter(
                (p: any) => p.payload?.type === 'lease_request' && p.response?.action === 'approved'
            );

            spinner.stop();

            if (options.json) {
                console.log(JSON.stringify(leases, null, 2));
            } else if (leases.length === 0) {
                console.log('No active leases');
            } else {
                console.log(`\nActive leases (${leases.length}):\n`);
                for (const l of leases) {
                    const scope = l.payload.scope;
                    const ttl = l.payload.ttl;
                    const expiresAt = l.response?.data?.expiresAt || 'unknown';
                    console.log(`  [${scope}] ttl=${ttl} expires=${expiresAt} ping=${l.id}`);
                }
            }
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

lease
    .command('revoke [pingId]')
    .description('Revoke an active lease')
    .option('--all', 'Revoke all active leases')
    .option('--json', 'Output as JSON')
    .action(async (pingId, options) => {
        if (!pingId && !options.all) {
            console.error('Provide a ping ID or use --all');
            process.exit(1);
        }

        const spinner = ora('Revoking lease...').start();

        try {
            if (options.all) {
                const res = await fetch(`${API_BASE}/api/v1/pings?status=responded&limit=50`);
                if (!res.ok) throw new Error('Failed to fetch pings');

                const data = await res.json() as { pings: any[] };
                const leases = data.pings.filter(
                    (p: any) => p.payload?.type === 'lease_request' && p.response?.action === 'approved'
                );

                let revoked = 0;
                for (const l of leases) {
                    const r = await fetch(`${API_BASE}/api/v1/pings/${l.id}/dismiss`, { method: 'POST' });
                    if (r.ok) revoked++;
                }

                spinner.stop();
                console.log(options.json
                    ? JSON.stringify({ revoked })
                    : `✓ Revoked ${revoked} lease(s)`);
            } else {
                const res = await fetch(`${API_BASE}/api/v1/pings/${pingId}/dismiss`, { method: 'POST' });

                spinner.stop();

                if (!res.ok) {
                    const err = await res.json() as { error?: string };
                    throw new Error(err.error || 'Failed to revoke');
                }

                console.log(options.json
                    ? JSON.stringify({ revoked: true, pingId })
                    : `✓ Lease revoked: ${pingId}`);
            }
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

// ============================================================================
// CDP Passthrough Commands
// ============================================================================

program
    .command('cdp <domainMethod>')
    .description('Execute a CDP command via daemon (e.g. Page.navigate, DOM.getDocument)')
    .option('--param <kv...>', 'Parameters as key=value pairs')
    .option('--lease-token <token>', 'Lease token for authorization')
    .option('--json', 'Output as JSON')
    .action(async (domainMethod, options) => {
        const spinner = ora(`CDP: ${domainMethod}...`).start();

        try {
            const params: Record<string, unknown> = {};
            if (options.param) {
                for (const kv of options.param) {
                    const eqIdx = kv.indexOf('=');
                    if (eqIdx === -1) {
                        params[kv] = true;
                    } else {
                        const key = kv.slice(0, eqIdx);
                        let val: unknown = kv.slice(eqIdx + 1);
                        // Attempt JSON parse for structured values
                        try { val = JSON.parse(val as string); } catch { /* keep as string */ }
                        params[key] = val;
                    }
                }
            }

            const token = options.leaseToken || process.env.AGENTPING_LEASE_TOKEN;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE}/api/v1/cdp`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ method: domainMethod, params }),
            });

            spinner.stop();

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
                throw new Error(err.error || `CDP call failed: ${res.status}`);
            }

            const result = await res.json();

            if (options.json) {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(JSON.stringify(result, null, 2));
            }
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });

// Browser sugar commands
const browser = program.command('browser').description('Browser automation shortcuts (CDP sugar)');

const BROWSER_SUGAR: Record<string, { method: string; paramKey?: string; description: string }> = {
    snapshot: { method: 'Page.captureSnapshot', description: 'Capture page MHTML snapshot' },
    screenshot: { method: 'Page.captureScreenshot', description: 'Capture page screenshot (base64 PNG)' },
    navigate: { method: 'Page.navigate', paramKey: 'url', description: 'Navigate to a URL' },
    click: { method: 'Runtime.evaluate', paramKey: 'expression', description: 'Click element via selector (document.querySelector(sel).click())' },
    type: { method: 'Runtime.evaluate', paramKey: 'expression', description: 'Type into focused element' },
};

for (const [name, config] of Object.entries(BROWSER_SUGAR)) {
    const cmd = browser
        .command(config.paramKey ? `${name} <value>` : name)
        .description(config.description)
        .option('--lease-token <token>', 'Lease token for authorization')
        .option('--json', 'Output as JSON');

    cmd.action(async (valueOrOptions: any, maybeOptions?: any) => {
        const value = typeof valueOrOptions === 'string' ? valueOrOptions : undefined;
        const options = maybeOptions || (typeof valueOrOptions === 'object' ? valueOrOptions : {});

        const spinner = ora(`browser ${name}...`).start();

        try {
            let params: Record<string, unknown> = {};

            if (name === 'click' && value) {
                params.expression = `document.querySelector(${JSON.stringify(value)}).click()`;
            } else if (name === 'type' && value) {
                // value format: "selector|text"
                const [selector, ...textParts] = value.split('|');
                const text = textParts.join('|');
                params.expression = `(() => { const el = document.querySelector(${JSON.stringify(selector)}); el.focus(); el.value = ${JSON.stringify(text)}; el.dispatchEvent(new Event('input', {bubbles:true})); })()`;
            } else if (config.paramKey && value) {
                params[config.paramKey] = value;
            }

            const token = options.leaseToken || process.env.AGENTPING_LEASE_TOKEN;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE}/api/v1/cdp`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ method: config.method, params }),
            });

            spinner.stop();

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
                throw new Error(err.error || `CDP call failed: ${res.status}`);
            }

            const result = await res.json();

            if (options.json) {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(JSON.stringify(result, null, 2));
            }
        } catch (err) {
            spinner.fail(`Failed: ${(err as Error).message}`);
            process.exit(3);
        }
    });
}

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

/**
 * Wait for a lease to be activated by the daemon lease-manager.
 *
 * Tries the dedicated /api/v1/lease/:id/wait endpoint first (long-poll).
 * Falls back to polling /api/v1/pings/:id/wait if the endpoint is unavailable.
 */
async function waitForLeaseActivation(pingId: string, timeoutMs: number, pollIntervalMs = 1000): Promise<any> {
    const deadline = Date.now() + timeoutMs;

    // Try the dedicated lease wait endpoint (added by daemon, long-polls until lease activates)
    try {
        const res = await fetch(
            `${API_BASE}/api/v1/lease/${encodeURIComponent(pingId)}/wait?timeout=${Math.floor(timeoutMs / 1000)}`,
        );

        if (res.ok) {
            const data = await res.json() as { lease?: any; response?: any };
            if (data.lease || data.response) {
                // Normalize to a response-like shape for consistent CLI output
                const lease = data.lease;
                return data.response || {
                    action: lease?.token ? 'approved' : 'denied',
                    data: lease ? {
                        type: 'lease',
                        granted: true,
                        token: lease.token,
                        expiresAt: lease.expiresAt
                            ? new Date(lease.expiresAt).toISOString()
                            : undefined,
                    } : { type: 'lease', granted: false },
                };
            }
        }

        if (res.status === 408) {
            return null; // Timeout
        }

        // If 404 or other non-OK, fall through to polling
        if (res.status !== 404) {
            const error = await res.json().catch(() => ({})) as { error?: string };
            if (error.error) throw new Error(error.error);
        }
    } catch (err) {
        // Endpoint not available yet — fall back to polling
        if ((err as Error).message && !(err as Error).message.includes('fetch')) {
            throw err; // Re-throw real errors, not connection issues
        }
    }

    // Fallback: poll the ping wait endpoint
    while (Date.now() < deadline) {
        const remaining = deadline - Date.now();
        const pollTimeout = Math.min(pollIntervalMs, remaining);

        const response = await waitForResponse(pingId, pollTimeout);
        if (response) return response;

        // If we still have time, sleep before next poll
        if (Date.now() < deadline) {
            await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
        }
    }

    return null; // Overall timeout
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

// Studio GUI Launch
program
    .command('studio')
    .alias('start')
    .description('Launch the AgentPing Studio GUI')
    .action(async () => {
        console.log('🚀 Launching AgentPing Studio...');
        const cp = await import('child_process');

        // Use pnpm to run the studio dev command
        const child = cp.spawn('pnpm', ['--filter', '@agentping/studio', 'dev'], {
            stdio: 'inherit',
            shell: true
        });

        child.on('error', (err) => {
            console.error('Failed to launch Studio:', err.message);
            process.exit(1);
        });
    });

// ============================================================================
// Run
// ============================================================================


program.parse();
