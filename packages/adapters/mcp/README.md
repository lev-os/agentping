# @agentping/mcp

> 🤖 **MCP Server** – Model Context Protocol adapter for Claude, Cursor, and MCP-compatible agents.

## Overview

This package provides native AgentPing integration for LLM agents via the [Model Context Protocol](https://modelcontextprotocol.io). It enables Claude, Cursor, and other MCP-compatible tools to send rich, structured pings.

## 🛠️ MCP Tools

| Tool | Description |
|------|-------------|
| `notify_human` | Simple notification (fire-and-forget) |
| `ask_human` | Freeform question → string response |
| `request_approval` | Yes/no → `{ approved, notes }` |
| `request_step_approval` | Multi-step checklist with enrichments |
| `request_research_direction` | Guide agent research focus |
| `request_selection` | Pick from options |
| `get_pending_responses` | Check for waiting responses |

## 🚀 Setup

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentping": {
      "command": "npx",
      "args": ["@agentping/mcp"],
      "env": {
        "AGENTPING_URL": "http://localhost:3000"
      }
    }
  }
}
```

### Cursor

Configure in Cursor settings or `.cursor/mcp.json`.

## 💡 Example

When Claude uses `request_step_approval`:

```
Agent: I'll deploy to production in 3 steps...
→ AgentPing shows rich checklist UI
→ Human approves steps 1 & 3, denies step 2
→ Agent receives structured response with enrichments
```

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
