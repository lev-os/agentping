# 🚀 AgentPing User Starter Pack

**Everything you need to use AgentPing with AI agents like Claude Code, Cursor, or custom systems.**

---

## Quick Reference

| What | Where |
|------|-------|
| **Web UI** | http://localhost:7891 |
| **API** | http://localhost:7890/api/v1 |
| **WebSocket** | ws://localhost:7890/api/v1/ws |

---

## 1. Start the System

```bash
cd /Users/sunny/kingly/Human\ in\ loop

# Start everything (clears ports automatically)
npm run dev
```

This starts:
- **Daemon** (port 7890) - API server
- **Web UI** (port 7891) - React dashboard

---

## 2. Connect Claude Code (MCP)

Add to `~/.config/claude-code/mcp.json`:

```json
{
  "mcpServers": {
    "agentping": {
      "command": "node",
      "args": ["/Users/sunny/kingly/Human in loop/packages/adapters/mcp/dist/index.js"],
      "env": {
        "AGENTPING_URL": "http://localhost:7890",
        "AGENTPING_AGENT_NAME": "Claude Code"
      }
    }
  }
}
```

**Available MCP Tools:**

| Tool | Description |
|------|-------------|
| `ask_human` | Ask a question, wait for answer |
| `request_approval` | Yes/no approval |
| `request_step_approval` | Approve multiple steps individually |
| `assign_task_workflow` | **Reverse Claude Code** - give human a multi-step task |
| `notify_human` | Send notification (no wait) |

---

## 3. Use from Shell Scripts (CLI)

```bash
# Build CLI first
cd packages/adapters/cli && pnpm build && npm link

# Ask a question
agentping ask "Which database should I use?"

# Request approval
agentping approve "Deploy to production?"

# Send notification
agentping notify "Build complete! ✅"
```

---

## 4. Use via HTTP API

### Create a Ping

```bash
curl -X POST http://localhost:7890/api/v1/pings \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "my-agent",
    "agentName": "My Agent",
    "sessionId": "session-1",
    "payload": {
      "type": "question",
      "question": "Which approach should I take?",
      "options": ["Option A", "Option B"]
    }
  }'
```

### Wait for Response

```bash
curl "http://localhost:7890/api/v1/pings/{PING_ID}/wait?timeout=60"
```

### Ping Types

| Type | Purpose |
|------|---------|
| `question` | Get an answer |
| `approval` | Yes/no decision |
| `step_approval` | Approve items from a list |
| `selection` | Pick from options |
| `research_request` | Choose research direction |
| `task_workflow` | Multi-step human task (Reverse Claude Code) |
| `notification` | FYI message |

---

## 5. Web UI Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `↓` | Next ping |
| `k` / `↑` | Previous ping |
| `a` | Approve all |
| `d` | Deny all |
| `Space` | Toggle selection |
| `Esc` | Dismiss |

---

## 6. Reverse Claude Code

Give the AI a task, and **you** complete the steps:

```bash
curl -X POST http://localhost:7890/api/v1/pings \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "reverse-claude",
    "agentName": "Reverse Claude Code",
    "sessionId": "test",
    "payload": {
      "type": "task_workflow",
      "title": "Reverse Claude Code",
      "steps": [
        {"id": "1", "instruction": "Step 1: Do this thing"},
        {"id": "2", "instruction": "Step 2: Then do this"},
        {"id": "3", "instruction": "Step 3: Finally, verify"}
      ],
      "allowNotes": true
    }
  }'
```

A floating orange panel appears in the Web UI for you to complete each step.

---

## 7. Package Structure

```
packages/
├── core/           # Domain logic (types, services, parsers)
├── daemon/         # Main server orchestrator
└── adapters/
    ├── cli/        # Command-line interface
    ├── http-api/   # REST + WebSocket API
    ├── mcp/        # Claude Code / MCP integration
    ├── slack/      # Slack notifications
    ├── storage-sqlite/  # SQLite persistence
    ├── web-ui/     # React dashboard
    └── webhook/    # Webhook notifications
```

---

## 8. Troubleshooting

**Port already in use?**
```bash
lsof -ti:7890,7891 | xargs kill -9
npm run dev
```

**MCP not connecting?**
1. Make sure daemon is running (`npm run dev`)
2. Check the MCP config path is correct
3. Restart Claude Code after config changes

**Pings not appearing?**
1. Check WebSocket connection in browser dev tools
2. Verify API is responding: `curl http://localhost:7890/api/v1/pings`

---

**Built by [Kingly Agency](https://github.com/Kingly-Agency)** ❤️
