# Contributing to AgentPing

Thank you for your interest in contributing to AgentPing! 🎉

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 8.12.0

### Setup

```bash
# Clone the repository
git clone https://github.com/Kingly-Agency/agentping.git
cd agentping

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## 📁 Project Structure

```
packages/
├── core/                    # Domain logic (framework-agnostic)
├── daemon/                  # Main orchestrator
└── adapters/
    ├── cli/                 # CLI input adapter
    ├── http-api/            # REST/WebSocket adapter
    ├── mcp/                 # MCP server adapter
    ├── storage-sqlite/      # Storage adapter
    ├── web-ui/              # React UI adapter
    └── webhook/             # Webhook adapter
```

## 🔧 Development Workflow

```bash
# Start all dev servers
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Build for production
pnpm build
```

## 📝 Code Style

- **TypeScript** for all packages
- **ESLint** + **Prettier** for formatting
- Hexagonal architecture: keep core framework-agnostic
- Write tests for new features

## 🔀 Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's proprietary license.

---

<p align="center">
  <strong>Built by <a href="https://github.com/Kingly-Agency">Kingly Agency</a></strong>
</p>
