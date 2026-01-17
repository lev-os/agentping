# @agentping/cli

> ⌨️ **CLI Tool** – Command-line interface for sending pings from shell scripts and terminals.

## Overview

The AgentPing CLI is the primary way agents send requests from shell scripts, cron jobs, or any command-line environment.

## 🚀 Installation

```bash
# Install globally
npm install -g @agentping/cli

# Or run via npx
npx @agentping/cli notify "Hello!"
```

## 📖 Commands

### Notifications (fire-and-forget)
```bash
agentping notify "Build complete! ✅"
```

### Questions (wait for answer)
```bash
agentping ask "Which database?" --options "postgres,mysql,sqlite"
```

### Approvals (yes/no)
```bash
agentping approve "Deploy to production?"
```

### Step Approval (structured multi-step)
```bash
agentping approve-steps --file steps.json
```

### Research Requests
```bash
agentping research --file research.json
```

### Selections
```bash
agentping select --file options.json --multi
```

## 🖥️ TUI Console

The CLI includes a full-screen interactive Terminal UI for responding to pings without leaving your terminal.

```bash
# Launch the Console
agentping
# OR
npm run tui
```

### Keyboard Controls
- **Tab / Shift+Tab**: Switch between Queue and Details panes
- **Up / Down**: Navigate ping list or steps
- **Space**: Toggle approval status or multi-select options
- **Enter**: Submit response or select option
- **A**: Quick Approve All (Step Checklists)
- **D**: Quick Deny All (Step Checklists)
- **Ctrl+C**: Exit

---

## 🎛️ Flags

| Flag | Description |
|------|-------------|
| `--json` | Output raw JSON |
| `--quiet` | Only output the value |
| `--verbose` | Full details with enrichments |
| `--timeout <ms>` | Response timeout |
| `--server <url>` | Daemon URL |

## 📤 Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Responded (approved/answered) |
| `1` | Denied |
| `2` | Timeout |
| `3` | Error |

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
