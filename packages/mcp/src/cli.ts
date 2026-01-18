#!/usr/bin/env node
/**
 * AgentPing MCP CLI
 *
 * Runs AgentPing as an MCP server via stdio transport.
 * Usage: agentping-mcp --agent-id <id> --agent-name <name>
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAgentPingMCPServer } from './index.js';

// ============================================================================
// Parse Arguments
// ============================================================================

function parseArgs(): { agentId: string; agentName: string; sessionId?: string } {
    const args = process.argv.slice(2);
    let agentId = 'mcp-agent';
    let agentName = 'MCP Agent';
    let sessionId: string | undefined;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--agent-id':
                agentId = args[++i] || agentId;
                break;
            case '--agent-name':
                agentName = args[++i] || agentName;
                break;
            case '--session-id':
                sessionId = args[++i];
                break;
            case '--help':
            case '-h':
                console.log(`
AgentPing MCP Server

Usage: agentping-mcp [options]

Options:
  --agent-id <id>      Agent identifier (default: mcp-agent)
  --agent-name <name>  Human-readable agent name (default: MCP Agent)
  --session-id <id>    Session identifier (default: auto-generated)
  -h, --help           Show this help message

Example:
  agentping-mcp --agent-id claude --agent-name "Claude Assistant"
`);
                process.exit(0);
        }
    }

    return { agentId, agentName, sessionId };
}

// ============================================================================
// Main
// ============================================================================

async function main() {
    const config = parseArgs();

    const { server } = createAgentPingMCPServer({
        agentId: config.agentId,
        agentName: config.agentName,
        sessionId: config.sessionId,
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);

    // Log to stderr (stdout is reserved for MCP protocol)
    console.error(`AgentPing MCP Server started`);
    console.error(`  Agent: ${config.agentName} (${config.agentId})`);
    console.error(`  Session: ${config.sessionId || 'auto-generated'}`);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
