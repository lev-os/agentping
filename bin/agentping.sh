#!/bin/bash
# AgentPing Studio Launcher
# Convenience wrapper for "start agentping"

COMMAND=$1

if [ "$COMMAND" == "start" ] || [ "$COMMAND" == "studio" ]; then
    echo "🚀 Launching AgentPing Studio..."
    pnpm --filter @agentping/studio dev
else
    # Fallback to CLI
    ./packages/adapters/cli/dist/index.js "$@"
fi
