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
