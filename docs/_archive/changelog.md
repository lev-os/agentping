# Changelog

All notable changes to AgentPing will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial development version

---

## [0.1.0] - 2024-01-16

### Added
- 🎉 Initial release of AgentPing v2
- Core domain with hexagonal architecture
- **Ping Types**: notification, question, approval, step_approval, research_request, selection
- **Input Adapters**: CLI, HTTP API, MCP Server
- **Output Adapters**: Web UI, Webhook
- **Storage**: SQLite adapter with sql.js
- React Web UI with keyboard navigation
- WebSocket real-time events
- Structured response enrichments (directives, notes, attachments)

### Packages
- `@agentping/core` - Domain models, ports, services
- `@agentping/daemon` - Main orchestrator
- `@agentping/cli` - CLI tool
- `@agentping/http-api` - REST + WebSocket server
- `@agentping/mcp` - MCP server for Claude/Cursor
- `@agentping/storage-sqlite` - SQLite persistence
- `@agentping/web-ui` - React Web UI
- `@agentping/webhook` - Webhook integration

---

<p align="center">
  Built by <a href="https://github.com/Kingly-Agency">Kingly Agency</a>
</p>
