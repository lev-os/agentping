# Integration Guide

## Quick Start

### 1. Install

Already installed in AgentPing packages/studio:

\`\`\`bash
cd ~/digital/leviathan/core/agent-harness/vendor/AgentPing/packages/studio
# dashboard-runner already in package.json
\`\`\`

### 2. Use in Navigator

Replace current Navigator with NavigatorWithRunner:

\`\`\`typescript
// packages/studio/src/renderer/App.tsx
import { NavigatorWithRunner } from './components/NavigatorWithRunner';

// Replace <Navigator /> with:
<NavigatorWithRunner />
\`\`\`

### 3. Enable Backend Integration

Uncomment the runner initialization code in `NavigatorWithRunner.tsx`:

\`\`\`typescript
// Find this section in useEffect
// TODO: Initialize dashboard runner when backend integration is complete

// Uncomment all the commented code to activate
const runner = new DashboardRunner({
    configPath: join(__dirname, '../../../dashboard-runner/config/dashboards.yaml')
});

runner.on('process_started', ({ dashboardId, port, pid }) => {
    // ...
});
// ... rest of event handlers
\`\`\`

### 4. Test Auto-Restart

\`\`\`bash
# Start Navigator
# Kill a dashboard process manually
ps aux | grep storybook | grep 6006
kill <PID>

# Watch logs - should auto-restart with exponential backoff
tail -f ~/.local/share/lev/dashboard-runner/logs/agentping.log
\`\`\`

## Configuration

Dashboards are configured in \`config/dashboards.yaml\`. Edit to:
- Change ports
- Adjust health check settings
- Modify restart policies
- Add new dashboards

## Logs

Check logs for troubleshooting:

\`\`\`bash
# Main runner log
tail -f ~/.local/share/lev/dashboard-runner/logs/runner.log

# Per-dashboard logs
tail -f ~/.local/share/lev/dashboard-runner/logs/agentping.log
tail -f ~/.local/share/lev/dashboard-runner/logs/sofia.log
# etc.
\`\`\`

## Events

Listen for these events to update UI:

- \`process_started\` - Dashboard started successfully
- \`process_crashed\` - Dashboard exited unexpectedly
- \`restart_success\` - Dashboard restarted after crash
- \`restart_failed\` - Max retries exceeded
- \`health_check_failed\` - Health check failed
- \`port_changed\` - Port auto-selected due to conflict

