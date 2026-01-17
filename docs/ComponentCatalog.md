# Component Catalog Reference

This document provides a comprehensive reference for the **78 UI components** available in the AgentPing `PrimitivesGallery`. These components are designed for high-fidelity, keyboard-first interaction and follow the "Cyber-Premium" design aesthetic.

## 🧭 Navigation & Graph (10)

| Component | Description | Props |
|-----------|-------------|-------|
| `Stepper` | Visual progress tracker with stages. | `steps`: { id, label, status }[], `currentStepId`: string |
| `RadarChart` | Multi-axis data visualization. | `data`: { label, value }[] |
| `Timeline` | Horizontal event sequence. | `events`: { date, title, description }[] |
| `SankeyDiagram` | Flow visualization between nodes. | `nodes`, `links` |
| `NetworkGraph` | Interactive node-link diagram. | `nodes`, `links` |
| `OrgChart` | Organizational hierarchy tree. | `data`: TreeStructure |
| `MindMap` | Brainstorming/logic tree view. | `data`: TreeStructure |
| `RadialNav` | Circular navigation menu. | `items`: { id, label, icon }[] |
| `DockMenu` | macOS-style bottom dock. | `items`: { id, label, icon }[] |
| `SidePanel` | Collapsible side drawer. | `items`: { id, label }[] |

## 📊 Data & Logs (10)

| Component | Description | Props |
|-----------|-------------|-------|
| `LiveLogStream` | Real-time scrolling log viewer. | `lines`: string[], `autoScroll`: boolean |
| `StackTraceProfiler` | Interactive exception explorer. | `exception`: string, `frames`: StackFrame[] |
| `AuditLogTable` | Security and action history. | `logs`: { actor, action, result }[] |
| `HttpInspector` | Request/Response debugger. | `request`, `response` |
| `EventTimeline` | Waterfall performance chart. | `events`: { start, width, label }[] |
| `BuildStatusLogs` | CI/CD pipeline steps view. | `buildId`: string, `steps`: { name, status }[] |
| `DockerStats` | Container resource metrics. | `containers`: { name, cpu, memory }[] |
| `DistributedTrace` | Microservice trace spans. | `traceId`: string, `spans`: { service, duration }[] |
| `LogSearchQuery` | Search results with highlighting. | `query`: string, `results`: { line, content }[] |
| `AlertFeed` | Real-time system notifications. | `alerts`: { severity, message }[] |

## 💰 Finance & Markets (10)

| Component | Description | Props |
|-----------|-------------|-------|
| `OrderBook` | L2 Market Depth view (Bids/Asks). | `bids`, `asks`: { price, size, total }[] |
| `CandleStickChart` | OHLCV Price action chart. | `data`: { time, open, high, low, close }[] |
| `TickerTape` | Scrolling price ticker. | `items`: { symbol, price, change }[] |
| `TradeHistory` | Recent market executions list. | `trades`: { price, size, side }[] |
| `PortfolioPie` | Asset allocation donut chart. | `assets`: { label, value }[] |
| `DepthChart` | Visual market depth graph. | `bids`, `asks`: [price, vol][] |
| `AssetCard` | Single asset performance view. | `asset`, `balance`, `value`, `pnl` |
| `MarketHeatmap` | Sector performance grid. | `sectors`: { name, performance }[] |
| `ForecastingLine` | Predictive trend analysis. | `historical`, `forecast`: { time, value }[] |
| `ExchangeStatus` | Platform operational status. | `status`, `latency`, `services`[] |

## ⚙️ System & Ops (9)

| Component | Description | Props |
|-----------|-------------|-------|
| `EncryptionStatus` | Security posture & algorithm view.| `status`: secure/vulnerable, `algorithm` |
| `SignalMonitor` | Radio frequency/Strength gauge. | `frequency`: number, `strength`: number |
| `ProcessTable` | Task manager style process list. | `processes`: { pid, name, cpu, mem }[] |
| `TerminalConsole` | Interactive command shell output. | `lines`: string[], `prompt`: string |
| `FirewallRules` | Network policy visualization. | `rules`: { type, source, port }[] |
| `SystemHealthGauge` | CPU/Mem/Temp circular gauges. | `cpu`, `memory`, `temp` |
| `PacketInspector` | Network packet analyzer. | `packets`: { source, dest, protocol }[] |
| `ServerRackStatus` | Physical hardware status view. | `racks`: { id, status }[] |
| `AccessPad` | Security access control visual. | `method`, `status` |

## 📝 Content & Diffs (13)

| Component | Description | Props |
|-----------|-------------|-------|
| `PdfPreview` | Native PDF viewer with download. | `file`: string, `url`: string |
| `CodeDiffViewer` | Side-by-side or unified code diff. | `oldCode`, `newCode`, `language` |
| `MarkdownEditor` | Rich text editor with preview. | `initialValue`: string, `readOnly`: boolean |
| `ImageCompare` | Before/After image slider. | `before`, `after`, `labels` |
| `HexInspector` | Binary data explorer. | `data`: Uint8Array |
| `RichMarkdownRenderer` | Advanced Markdown display. | `content`: string |
| `JsonDiff` | Structural JSON comparison. | `oldJson`, `newJson` |
| `CsvViewer` | Tabular CSV data viewer. | `data`: string |
| `ConflictResolver` | Merge conflict decision tool. | `base`, `current`, `incoming` |
| `DiffStatSummary` | Git-style +/- stats line. | `added`, `removed`, `files` |
| `FileMetadataCard` | Detailed file info view. | `file`: { name, size, type } |
| `RegexTester` | Interactive regex debugger. | `pattern`, `testString` |
| `FileAssetPicker` | Grid/List asset selector. | `files`: { name, type }[] |

## 🧱 Core & Feedback (15)

| Component | Description | Props |
|-----------|-------------|-------|
| `PingCard` | Main agent message container. | `title`, `agentName`, `status` |
| `StatusCard` | Operation status indicator. | `status`, `progress`, `eta` |
| `ToastManager` | Flash notification system. | `toasts`: { message, type }[] |
| `Badge` | Small status indicator. | `label`, `type` |
| `AlertBanner` | Inline warning/error alert. | `title`, `message`, `type` |
| `Skeleton` | Loading placeholder state. | `variant`, `width`, `height` |
| `CircularProgress` | Round loading spinner. | `value`, `label` |
| `LoadingProgress` | Linear progress bar. | `value`, `total` |
| `RiskBadge` | Security risk level indicator. | `risk`: low/med/high |
| `EffortBadge` | Work unit estimate indicator. | `effort`: quick/med/deep |
| `ConfirmationModal` | Action verification dialog. | `title`, `message`, `onConfirm` |
| `InfoSidebar` | Contextual help drawer. | `title`, `content` |
| `InlineTutorialTooltip` | Onboarding guidance tip. | `target`, `content` |
| `QuickActionBar` | Bottom shortcut toolbar. | `actions`: { label, icon }[] |
| `EnrichmentPanel` | AI context/metadata sidecar. | `notes`, `directives`[] |

## 🖱️ Interaction & Forms (11)

| Component | Description | Props |
|-----------|-------------|-------|
| `StepChecklist` | Multi-step standard procedure. | `steps`: { id, checked }[] |
| `DirectionPicker` | Strategic choice selector. | `directions`: { rationale, effort }[] |
| `SelectionList` | Options list with preview. | `options`: { label, preview }[] |
| `ApprovalButtons` | Big Approve/Deny controls. | `risk`, `details` |
| `QuestionInput` | Freeform text response field. | `question`, `placeholder` |
| `NotificationBanner` | Top-level system notice. | `message`, `level` |
| `DirectiveChip` | Interactive meta-instruction. | `type`, `value` |
| `DirectiveInput` | New instruction entry field. | `type`, `label` |
| `Checkbox` | Boolean toggle. | `label`, `checked` |
| `DependencyGraph` | Task dependency visualizer. | `nodes`, `dependencies` |
| `ProgressTimeline` | Step-based history view. | `steps`: { label, status }[] |

## usage

All components are registered in `catalog.ts` and can be invoked by Claude Code by specifying the component name and matching props in the `artifact_name` field of the response.
