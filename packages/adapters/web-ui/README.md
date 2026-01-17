# @agentping/web-ui

> 🖥️ **Web UI** – React-based human interface for responding to agent pings.

## Overview

A minimal, keyboard-first React UI designed for fast agent-human interaction. Built with React 19, Vite, and follows strict [UI Skills](https://ui-skills.com) and [Vercel Design Guidelines](https://vercel.com/design).

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `↓` | Next ping |
| `k` / `↑` | Previous ping |
| `a` | Approve all |
| `d` | Deny all |
| `Enter` | Confirm selection |
| `Escape` | Dismiss |
| `Space` | Toggle step |

## 🎨 Primitives Gallery

AgentPing now creates a "Cyber-Premium" dashboard with **78 specialized components** available in `catalog.ts`:

### 📊 Data & Logs
- **LiveLogStream**: Real-time log tailing with auto-scroll.
- **StackTraceProfiler**: Interactive exception analysis.
- **AuditLogTable**: Security event tracking.
- **HttpInspector**: Request/Response debugger.

### 📝 Content & Diffs
- **CodeDiffViewer**: Unified/Split diffs with syntax highlighting.
- **PdfPreview**: Native PDF rendering with download support.
- **MarkdownEditor**: Rich text editing with preview.
- **ImageCompare**: Before/After slider.

### 🧭 Navigation & Interaction
- **Stepper**: Progress tracking with status states.
- **RadarChart**: Multi-axis data visualization.
- **Timeline**: Horizontal event mapping.
- **NetworkGraph**: Node-link visualization.

### ⚙️ System & Ops
- **EncryptionStatus**: Security posture indicators.
- **SignalMonitor**: Real-time frequency analysis.
- **ProcessTable**: Task manager view.
- **TerminalConsole**: Interactive command output.

### 📈 Finance & Markets
- **OrderBook**: L2 market data visualization.
- **CandleStickChart**: Financial price action.
- **TickerTape**: Real-time price updates.
- **PortfolioPie**: Asset allocation view.

## ⌨️ Interaction Renderers

| Renderer | Ping Type | UI |
|----------|-----------|-----|
| `StepApprovalRenderer` | Multi-step approval | Checklist with risk indicators |
| `SelectionRenderer` | Pick from options | Cards or list with preview |
| `ApprovalRenderer` | Yes/no decisions | Big approve/deny buttons |
| `QuestionRenderer` | Freeform questions | Text input with suggestions |
| `ResearchRenderer` | Research direction | Direction cards with effort |

## 🎯 Design Principles

- **Keyboard-first** – Respond in <3 seconds
- **Single column** – No distracting navigation
- **Dark mode** – Developer-focused aesthetic
- **Mobile responsive** – Respond from anywhere
- **Accessible** – WCAG 2.1 compliant

## 📁 Structure

```
src/
├── components/     # UI components
├── renderers/      # Ping type renderers
├── hooks/          # React hooks
├── styles/         # CSS (global, rams)
└── App.tsx         # Main app
```

## 📜 License

**Proprietary** © [Kingly Agency](https://github.com/Kingly-Agency) — All Rights Reserved
