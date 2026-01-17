# Changelog

All notable changes to the `@agentping/web-ui` package will be documented in this file.

## [0.1.0] - 2026-01-16

### Added
- **Component Catalog**: Integrated ~50 new "Cyber-Premium" components into `catalog.ts` for AI consumption.
  - **Data & Logs**: `LiveLogStream`, `StackTraceProfiler`, `AuditLogTable`, `HttpInspector`, `EventTimeline`.
  - **Content & Diffs**: `PdfPreview` (Native PDF support), `CodeDiffViewer`, `MarkdownEditor`, `JsonDiff`.
  - **Navigation**: `Stepper`, `RadarChart`, `Timeline`, `SankeyDiagram`, `NetworkGraph`.
  - **System Ops**: `EncryptionStatus`, `SignalMonitor`, `ProcessTable`, `TerminalConsole`, `FirewallRules`.
  - **Finance**: `OrderBook`, `CandleStickChart`, `TradeHistory`, `TickerTape`, `PortfolioPie`.
- **Design System**: Added "Cyber-Premium" aesthetic guidelines including neon accents, monospace data fonts, and high-density layouts.
- **Documentation**: Updated README with full component gallery list and interaction renderers table.

### Changed
- **PdfPreview**: Updated to support native browser PDF rendering via `<iframe>` for real URLs.
- **Gallery**: Reorganized gallery sections to include dedicated tabs for Logs, Finance, and System.
