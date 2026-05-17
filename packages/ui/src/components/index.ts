/**
 * @kingly/ui - Components
 *
 * SKYNET Design System UI Components
 *
 * shadcn/ui primitives with SKYNET theme applied.
 * All components support dark-mode-first, aerospace-inspired styling.
 */

// Badge
export { Badge, badgeVariants } from "./ui/badge";
export type { BadgeProps } from "./ui/badge";

// ShimmerText
export { ShimmerText, shimmerTextVariants } from "./ui/shimmer-text";
export type { ShimmerTextProps } from "./ui/shimmer-text";

// GlowOrb
export { GlowOrb, glowOrbVariants } from "./ui/glow-orb";
export type { GlowOrbProps } from "./ui/glow-orb";

// Button
export { Button, buttonVariants } from "./ui/button";
export type { ButtonProps } from "./ui/button";

// Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
export type { CardProps } from "./ui/card";

// Dialog
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

// AlertDialog
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";

// Sheet (Side Drawer)
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

// Overlay Footer
export { OverlayFooter, type OverlayFooterProps } from "./ui/overlay-footer";

// Progress
export { Progress } from "./ui/progress";

// SearchInput
export { SearchInput } from "./ui/search-input";
export type { SearchInputProps } from "./ui/search-input";

// IconButton
export { IconButton, iconButtonVariants } from "./ui/icon-button";
export type { IconButtonProps } from "./ui/icon-button";

// TabBar
export { TabBar } from "./ui/tab-bar";
export type { TabBarProps, TabItem } from "./ui/tab-bar";

// StatusDot
export { StatusDot, statusDotVariants } from "./ui/status-dot";
export type { StatusDotProps } from "./ui/status-dot";

// MenuList
export { MenuList } from "./ui/menu-list";
export type { MenuListProps, MenuItem } from "./ui/menu-list";

// Animation Utilities
export {
  FadeInOut,
  AnimatedList,
  PulsingDot,
  AnimatedTabIndicator,
} from "./ui/animations";
export type {
  FadeInOutProps,
  AnimatedListProps,
  PulsingDotProps,
  AnimatedTabIndicatorProps,
} from "./ui/animations";

// Switch
export { Switch } from "./ui/switch";
export type { SwitchProps } from "./ui/switch";

// FilteredDropdown
export {
  FilteredDropdown,
  FilteredDropdownItem,
} from "./ui/filtered-dropdown";
export type {
  FilteredDropdownProps,
  FilteredDropdownTab,
  FilteredDropdownItemProps,
} from "./ui/filtered-dropdown";

// Dashboard Components
export {
  DashboardWidget,
  LoadingStateProvider,
  useLoadingState,
  StreamingIndicator,
  WidgetError,
  WidgetHeaderAction,
  WidgetFooter,
  WidgetEmpty,
  WidgetCrashFallback,
  StatGridSkeleton,
  ChartSkeleton,
  TableSkeleton,
  GaugeSkeleton,
  GridSkeleton,
  WidgetWrapper,
  ResponsiveDashboard,
  CollapseButton,
  TreeExpander,
  DocCard,
  SpecPanel,
  GraphView,
  ArtifactBadge,
  SafeDispatchCockpit,
  getSafeDispatchSummary,
} from "./dashboard";
export type {
  DashboardWidgetProps,
  SkeletonProps,
  SkeletonType,
  WidgetPriority,
  WidgetLoadingState,
  LoadingStateContextValue,
  PersistedLoadingState,
  WidgetErrorProps,
  StreamingIndicatorProps,
  WidgetAction,
  EmptyStateType,
  WidgetEmptyProps,
  WidgetHeaderActionProps,
  WidgetFooterProps,
  WidgetCrashFallbackProps,
  Breakpoint,
  Layouts,
  WidgetVariant,
  WidgetWrapperProps,
  Widget,
  ResponsiveDashboardProps,
  CollapseButtonProps,
  TreeExpanderProps,
  DocCardProps,
  SpecPanelProps,
  SpecSection,
  GraphViewProps,
  GraphNode,
  GraphEdge,
  ArtifactBadgeProps,
  SafeDispatchAction,
  SafeDispatchCockpitProps,
  SafeDispatchProvider,
  SafeDispatchSession,
  SafeDispatchState,
  SafeDispatchSummary,
  SafeDispatchWorkstream,
} from "./dashboard";

// Form Components
export { Label } from "./ui/label";
export { Input } from "./ui/input";
export type { InputProps } from "./ui/input";
export { Textarea } from "./ui/textarea";
export type { TextareaProps } from "./ui/textarea";
export { Checkbox } from "./ui/checkbox";
export {
  useFormField,
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
} from "./ui/form";
export type { FormFieldContextValue, FormFieldProps } from "./ui/form";

// =============================================================================
// BASE UI COMPONENTS (Headless/Unstyled)
// Re-exported from @base-ui/react for building recipes
// =============================================================================

export * as Base from "./base";

// =============================================================================
// RECIPE COMPONENTS
// Pre-composed patterns combining base components
// =============================================================================

export { Hero, HeaderStatusDropdown } from "./recipes";
export type {
  HeroProps,
  HeaderStatusDropdownProps,
  StatusItem,
  StatusGroup,
  DropdownPosition,
  CollisionStrategy,
} from "./recipes";

// CRUD Recipe Components
export {
  CrudProvider,
  useCrudContext,
  TileView,
  TileCard,
  ViewSwitcher,
  TableView,
  ListView,
  FilterBar,
  EntityForm,
  FieldRenderer,
  CreateDialog,
  EditDialog,
  CrudListPage,
  CrudDetailPage,
  CrudArchivePage,
} from "./recipes";
export type {
  CrudConfig,
  ViewMode,
  ColumnDef,
  FieldDef,
  FilterDef,
  TileCardConfig,
  ArchiveConfig,
} from "./recipes";

// =============================================================================
// RAW MIGRATION CANDIDATES
// Imported from Studio/Web-UI for consolidation evaluation.
// =============================================================================
export {
  StatusGrid,
  type StatusGridProps,
  type StatusCard,
  type StatusType,
  HolographicCard,
  type HolographicCardProps,
  BadgeStudioRaw,
  BadgeWebUiRaw,
  BadgeCandidate,
  type BadgeConflictProps,
  ButtonStudioRaw,
  ButtonWebUiRaw,
  ButtonCandidate,
  type ButtonConflictProps,
  CodeDiffViewerStudioRaw,
  CodeDiffViewerWebUiRaw,
  CodeDiffViewerCandidate,
  type CodeDiffViewerConflictProps,
  ContextMenuStudioRaw,
  ContextMenuWebUiRaw,
  ContextMenuCandidate,
  type ContextMenuAction,
  type ContextMenuConflictProps,
  EmptyStateStudioRaw,
  EmptyStateWebUiRaw,
  EmptyStateCandidate,
  type EmptyStateConflictProps,
  IconButtonStudioRaw,
  IconButtonWebUiRaw,
  IconButtonCandidate,
  type IconButtonConflictProps,
  InputStudioRaw,
  InputWebUiRaw,
  InputCandidate,
  type InputConflictProps,
  SearchInputStudioRaw,
  SearchInputWebUiRaw,
  SearchInputCandidate,
  type SearchInputConflictProps,
  SpinnerStudioRaw,
  SpinnerWebUiRaw,
  SpinnerCandidate,
  type SpinnerConflictProps,
  TimelineStudioRaw,
  TimelineWebUiRaw,
  TimelineCandidate,
  type TimelineItem,
  type TimelineConflictProps,
  LogViewerStudioRaw,
  LogViewerWebUiRaw,
  LogViewerCandidate,
  type LogEntry,
  type LogViewerConflictProps,
  type LogViewerCandidateProps,
} from "./catalog";

// Canvas package migrations
export {
  CanvasRenderer,
  type CanvasRendererProps,
} from "./catalog";
export {
  ConnectionStatus,
  type ConnectionStatusProps,
} from "./catalog";
export {
  KanbanBoard,
  type KanbanBoardProps,
  type KanbanItem,
  type KanbanColumn,
} from "./catalog";
export {
  MarkdownCard,
  type MarkdownCardProps,
} from "./catalog";
export {
  PolymorphPlayground,
  type PolymorphPlaygroundProps,
} from "./catalog";
export {
  TodoList,
  type TodoListProps,
  type TodoItem,
} from "./catalog";

// Dashboard-manager-ui package migrations
export {
  DmAnalyticsPanel,
  type DmAnalyticsPanelProps,
} from "./catalog";
export {
  DmCreateDashboardModal,
  type DmCreateDashboardModalProps,
  type DashboardFormData,
} from "./catalog";
export {
  DmDashboardDetail,
  type DmDashboardDetailProps,
  type DmDashboardConfig,
  type DmDashboardStatus,
  type DmDashboard,
  type DmDashboardMetrics,
} from "./catalog";
export {
  DmDashboardList,
  type DmDashboardListProps,
  type DmDashboardSummary,
} from "./catalog";
export {
  DmLogViewer,
  type DmLogViewerProps,
  type DmLogLine,
} from "./catalog";
export {
  DmStatusBadge,
  type DmStatusBadgeProps,
  type DmStatusType,
} from "./catalog";
export {
  DmRestartHistogram,
  type DmRestartHistogramProps,
} from "./catalog";
export {
  DmUptimeChart,
  type DmUptimeChartProps,
} from "./catalog";

// =============================================================================
// NON-CONFLICT MIGRATION COMPONENTS (Studio)
// Re-exported for shim consumers (Pass 4)
// =============================================================================
export {
  AgentDropdown,
  AgentStatusOverlay,
  ApprovalQueue,
  AuditFeed,
  ChatHeader,
  ChatInput,
  ChatMessage,
  ChatPanel,
  ChatSearch,
  ComponentGallery,
  CopyButton,
  Dashboard,
  DashboardDetailView,
  DiagnosticPanel,
  Dropdown,
  FileExplorer,
  FileTree,
  FileViewer,
  FooterPanel,
  Kbd,
  Layers,
  Modal,
  Navigator,
  NavigatorWithDashboards,
  Preview,
  PropertiesPanel,
  RestartHistogram,
  SessionTabs,
  SettingsModal,
  StatusPieChart,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TaskChecklist,
  Terminal,
  TerminalLinkPopup,
  ToolCard,
  Toolbar,
  Tooltip,
  UptimeChart,
  VoiceConsole,
  WelcomeScreen,
} from "./catalog";
export type {
  AgentRunStatus,
  AgentState,
  AgentDropdownProps,
  OverlayAgentStatus,
  OverlayAgent,
  AgentStatusOverlayProps,
  PendingApproval,
  ApprovalQueueProps,
  EventType,
  AuditEvent,
  AuditFeedProps,
  ChatHeaderProps,
  SlashCommand,
  ChatInputProps,
  MessageRole,
  ToolUse,
  Message,
  ChatMessageProps,
  ChatPanelMessage,
  ChatPanelProps,
  SearchableMessage,
  ChatSearchProps,
  ComponentPrimitive,
  ComponentGalleryProps,
  CopyButtonProps,
  SystemTelemetry,
  QuickOperation,
  DashboardProps,
  DashboardMetricSummary,
  DashboardDetailViewProps,
  TestStatus,
  TestResult,
  DiagnosticPanelProps,
  DropdownOption,
  DropdownProps,
  SortMode,
  FileExplorerProps,
  FileNodeType,
  FileNode,
  FileTreeProps,
  FileViewerProps,
  FooterTab,
  FooterPanelProps,
  KbdProps,
  LayerType,
  LayerItem,
  LayersProps,
  ModalProps,
  DashboardHealthStatus,
  DashboardItem,
  NavigatorWithDashboardsProps,
  DevicePreset,
  PreviewProps,
  PropertyField,
  PropertySection,
  PropertiesPanelProps,
  RestartDayData,
  RestartHistogramProps,
  AgentStatus,
  SessionAgent,
  SessionTabsProps,
  StudioSettings,
  SettingsModalProps,
  StatusPieData,
  StatusPieChartProps,
  TableColumn,
  TableProps,
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
  TaskStepStatus,
  TaskStep,
  TaskChecklistProps,
  TerminalTab,
  TerminalProps,
  TerminalLinkPopupProps,
  ToolStatus,
  ToolInfo,
  ToolCardProps,
  DrawingTool,
  SidebarMode,
  LayoutMode,
  ToolbarProps,
  TooltipProps,
  UptimeDataPoint,
  UptimeChartProps,
  VoicePresetCommand,
  VoiceConsoleProps,
  QuickAction,
  WelcomeScreenProps,
} from "./catalog";

// =============================================================================
// WEB-UI MIGRATION MODULES
// Standard component migrations re-exported for shim consumers (Pass 4).
// =============================================================================

export { AccessPad } from "./catalog/access-pad";
export type { AccessPadProps } from "./catalog/access-pad";
export { AccordionList } from "./catalog/accordion-list";
export type { AccordionItem, AccordionListProps } from "./catalog/accordion-list";
export { ActiveSessions } from "./catalog/active-sessions";
export type { Session, ActiveSessionsProps } from "./catalog/active-sessions";
export { ActivityFeed } from "./catalog/activity-feed";
export type { ActivityItem, ActivityFeedProps } from "./catalog/activity-feed";
export { AdvancedDataGrid } from "./catalog/advanced-data-grid";
export type { DataGridColumn, AdvancedDataGridProps } from "./catalog/advanced-data-grid";
export { AgentAvatar } from "./catalog/agent-avatar";
export type { AgentAvatarProps } from "./catalog/agent-avatar";
export { AlertBanner } from "./catalog/alert-banner";
export type { AlertBannerProps } from "./catalog/alert-banner";
export { AlertFeed } from "./catalog/alert-feed";
export type { Alert, AlertFeedProps } from "./catalog/alert-feed";
export { AssetCard } from "./catalog/asset-card";
export type { AssetCardProps } from "./catalog/asset-card";
export { AudioPlayer } from "./catalog/audio-player";
export type { AudioPlayerProps } from "./catalog/audio-player";
export { AuditLogTable } from "./catalog/audit-log-table";
export type { AuditEntry, AuditLogTableProps } from "./catalog/audit-log-table";
export { AuditLogViewer } from "./catalog/audit-log-viewer";
export type { AuditLogViewerProps } from "./catalog/audit-log-viewer";
export { BatteryMeter } from "./catalog/battery-meter";
export type { BatteryMeterProps } from "./catalog/battery-meter";
export { BrainActivity } from "./catalog/brain-activity";
export type { BrainActivityProps } from "./catalog/brain-activity";
export { Breadcrumbs } from "./catalog/breadcrumbs";
export type { BreadcrumbsProps } from "./catalog/breadcrumbs";
export { BuildStatusLogs } from "./catalog/build-status-logs";
export type { BuildStep, BuildStatusLogsProps } from "./catalog/build-status-logs";
export { CalendarView } from "./catalog/calendar-view";
export type { CalendarEvent, CalendarViewProps } from "./catalog/calendar-view";
export { CandleStickChart } from "./catalog/candlestick-chart";
export type { CandleData, CandleStickChartProps } from "./catalog/candlestick-chart";
export { CircuitPattern } from "./catalog/circuit-pattern";
export type { CircuitPatternProps } from "./catalog/circuit-pattern";
export { CircularProgress } from "./catalog/circular-progress";
export type { CircularProgressProps } from "./catalog/circular-progress";
export { ColorPicker } from "./catalog/color-picker";
export type { ColorPickerProps } from "./catalog/color-picker";
export { CommandPalette } from "./catalog/command-palette";
export type { CommandItem, CommandPaletteProps } from "./catalog/command-palette";
export { ConfidenceMeter } from "./catalog/confidence-meter";
export type { ConfidenceMeterProps } from "./catalog/confidence-meter";
export { ConfirmationModal } from "./catalog/confirmation-modal";
export type { ConfirmationModalProps } from "./catalog/confirmation-modal";
export { ConflictResolver } from "./catalog/conflict-resolver";
export type { ConflictResolverProps } from "./catalog/conflict-resolver";
export { ConnectionSignal } from "./catalog/connection-signal";
export type { ConnectionSignalProps } from "./catalog/connection-signal";
export { ContextUsage } from "./catalog/context-usage";
export type { ContextUsageProps } from "./catalog/context-usage";
export { CountdownWidget } from "./catalog/countdown-widget";
export type { CountdownWidgetProps } from "./catalog/countdown-widget";
export { CsvPreview } from "./catalog/csv-preview";
export type { CsvPreviewProps } from "./catalog/csv-preview";
export { CsvViewer } from "./catalog/csv-viewer";
export type { CsvViewerProps } from "./catalog/csv-viewer";
export { DailyAgenda } from "./catalog/daily-agenda";
export type { AgendaItem, DailyAgendaProps } from "./catalog/daily-agenda";
export { DataMetricsBoard } from "./catalog/data-metrics-board";
export type { DataMetric, DataMetricsBoardProps } from "./catalog/data-metrics-board";
export { DataPipeline } from "./catalog/data-pipeline";
export type { PipelineStage, DataPipelineProps } from "./catalog/data-pipeline";
export { DataTable } from "./catalog/data-table";
export type { DataTableColumn, DataTableProps } from "./catalog/data-table";
export { DatePicker } from "./catalog/date-picker";
export type { DatePickerProps } from "./catalog/date-picker";
export { DatePickerPro } from "./catalog/date-picker-pro";
export type { DatePickerProProps } from "./catalog/date-picker-pro";
export { DependencyGraph } from "./catalog/dependency-graph";
export type { DependencyNode, DependencyGraphProps } from "./catalog/dependency-graph";
export { DepthChart } from "./catalog/depth-chart";
export type { DepthLevel, DepthChartProps } from "./catalog/depth-chart";
export { DiffStatSummary } from "./catalog/diff-stat-summary";
export type { DiffStatSummaryProps } from "./catalog/diff-stat-summary";
export { DistributedTrace } from "./catalog/distributed-trace";
export type { TraceSpan, DistributedTraceProps } from "./catalog/distributed-trace";
export { DockMenu } from "./catalog/dock-menu";
export type { DockItem, DockMenuProps } from "./catalog/dock-menu";
export { DockerStats } from "./catalog/docker-stats";
export type { ContainerStats, DockerStatsProps } from "./catalog/docker-stats";
export { DraggableList } from "./catalog/draggable-list";
export type { DraggableItem, DraggableListProps } from "./catalog/draggable-list";
export { EditableText } from "./catalog/editable-text";
export type { EditableTextProps } from "./catalog/editable-text";
export { EncryptionStatus } from "./catalog/encryption-status";
export type { EncryptionChannel, EncryptionStatusProps } from "./catalog/encryption-status";
export { EnrichmentPanel } from "./catalog/enrichment-panel";
export type { EnrichmentPanelProps } from "./catalog/enrichment-panel";
export type { ErrorBoundaryProps } from "./catalog/error-boundary";
export { ErrorCluster } from "./catalog/error-cluster";
export type { ErrorGroup, ErrorClusterProps } from "./catalog/error-cluster";
export { EventCard } from "./catalog/event-card";
export type { Attendee, EventCardProps } from "./catalog/event-card";
export { EventTimeline } from "./catalog/event-timeline";
export type { TimelineEvent, EventTimelineProps } from "./catalog/event-timeline";
export { ExchangeStatus } from "./catalog/exchange-status";
export type { Exchange, ExchangeStatusProps } from "./catalog/exchange-status";
export { FileAssetPicker } from "./catalog/file-asset-picker";
export type { FileAsset, FileAssetPickerProps } from "./catalog/file-asset-picker";
export { FileMetadataCard } from "./catalog/file-metadata-card";
export type { FileMetadata, FileMetadataCardProps } from "./catalog/file-metadata-card";
export { FirewallRules } from "./catalog/firewall-rules";
export type { FirewallRule, FirewallRulesProps } from "./catalog/firewall-rules";
export { ForecastingLine } from "./catalog/forecasting-line";
export type { ForecastPoint, ForecastingLineProps } from "./catalog/forecasting-line";
export { GalleryAISection } from "./catalog/gallery-ai-section";
export type { GalleryAISectionProps } from "./catalog/gallery-ai-section";
export { GalleryContentSection } from "./catalog/gallery-content-section";
export type { GalleryContentSectionProps } from "./catalog/gallery-content-section";
export { GalleryDashboardSection } from "./catalog/gallery-dashboard-section";
export type { GalleryDashboardSectionProps } from "./catalog/gallery-dashboard-section";
export { GalleryDataSection } from "./catalog/gallery-data-section";
export type { GalleryDataSectionProps } from "./catalog/gallery-data-section";
export { GalleryFeedbackSection } from "./catalog/gallery-feedback-section";
export type { GalleryFeedbackSectionProps } from "./catalog/gallery-feedback-section";
export { GalleryFinanceSection } from "./catalog/gallery-finance-section";
export type { GalleryFinanceSectionProps } from "./catalog/gallery-finance-section";
export { GalleryFormsSection } from "./catalog/gallery-forms-section";
export type { GalleryFormsSectionProps } from "./catalog/gallery-forms-section";
export { GalleryInteractionSection } from "./catalog/gallery-interaction-section";
export type { GalleryInteractionSectionProps } from "./catalog/gallery-interaction-section";
export { GalleryLogsSection } from "./catalog/gallery-logs-section";
export type { GalleryLogsSectionProps } from "./catalog/gallery-logs-section";
export { GalleryMediaSection } from "./catalog/gallery-media-section";
export type { GalleryMediaSectionProps } from "./catalog/gallery-media-section";
export { GalleryNavigationSection } from "./catalog/gallery-navigation-section";
export type { GalleryNavigationSectionProps } from "./catalog/gallery-navigation-section";
export { GallerySchedulingSection } from "./catalog/gallery-scheduling-section";
export type { GallerySchedulingSectionProps } from "./catalog/gallery-scheduling-section";
export { GallerySofiaSection } from "./catalog/gallery-sofia-section";
export type { GallerySofiaSectionProps } from "./catalog/gallery-sofia-section";
export { GallerySystemSection } from "./catalog/gallery-system-section";
export type { GallerySystemSectionProps } from "./catalog/gallery-system-section";
export { GalleryVisualsSection } from "./catalog/gallery-visuals-section";
export type { GalleryVisualsSectionProps } from "./catalog/gallery-visuals-section";
export { GeoMap } from "./catalog/geo-map";
export type { MapMarker, GeoMapProps } from "./catalog/geo-map";
export { GeoRequestMap } from "./catalog/geo-request-map";
export type { GeoLocation, GeoRequestMapProps } from "./catalog/geo-request-map";
export { GlobeWireframe } from "./catalog/globe-wireframe";
export type { GlobeWireframeProps } from "./catalog/globe-wireframe";
export { HeatmapGrid } from "./catalog/heatmap-grid";
export type { HeatmapGridProps } from "./catalog/heatmap-grid";
export { HexDumpView } from "./catalog/hex-dump-view";
export type { HexDumpViewProps } from "./catalog/hex-dump-view";
export { HexGridBackground } from "./catalog/hex-grid-background";
export type { HexGridBackgroundProps } from "./catalog/hex-grid-background";
export { HexInspector } from "./catalog/hex-inspector";
export type { HexInspectorProps } from "./catalog/hex-inspector";
export { HistoryView } from "./catalog/history-view";
export type { HistoryEntry, HistoryViewProps } from "./catalog/history-view";
export { HoverCard } from "./catalog/hover-card";
export type { HoverCardProps } from "./catalog/hover-card";
export { HttpInspector } from "./catalog/http-inspector";
export type { HttpRequest, HttpInspectorProps } from "./catalog/http-inspector";
export { ImageCompare } from "./catalog/image-compare";
export type { ImageCompareProps } from "./catalog/image-compare";
export { ImageDiff } from "./catalog/image-diff";
export type { ImageDiffProps } from "./catalog/image-diff";
export { InfoSidebar } from "./catalog/info-sidebar";
export type { SidebarLink, InfoSidebarProps } from "./catalog/info-sidebar";
export { InlineTutorialTooltip } from "./catalog/inline-tutorial-tooltip";
export type { InlineTutorialTooltipProps } from "./catalog/inline-tutorial-tooltip";
export { JsonDiff } from "./catalog/json-diff";
export type { JsonDiffProps } from "./catalog/json-diff";
export { JsonEditor } from "./catalog/json-editor";
export type { JsonEditorProps } from "./catalog/json-editor";
export { JsonTreeViewer } from "./catalog/json-tree-viewer";
export type { JsonTreeViewerProps } from "./catalog/json-tree-viewer";
export { KeyValueStore } from "./catalog/key-value-store";
export type { KeyValueEntry, KeyValueStoreProps } from "./catalog/key-value-store";
export { Knob } from "./catalog/knob";
export type { KnobProps } from "./catalog/knob";
export { LandingPage } from "./catalog/landing-page";
export type { LandingPageProps } from "./catalog/landing-page";
export { LatencyHistogram } from "./catalog/latency-histogram";
export type { LatencyBucket, LatencyHistogramProps } from "./catalog/latency-histogram";
export { LcarsButton } from "./catalog/lcars-button";
export type { LcarsButtonVariant, LcarsButtonSize, LcarsButtonColor, LcarsButtonProps } from "./catalog/lcars-button";
export { LcarsElbow } from "./catalog/lcars-elbow";
export type { ElbowPosition, ElbowSize, LcarsElbowProps } from "./catalog/lcars-elbow";
export { LcarsPanel } from "./catalog/lcars-panel";
export type { LcarsPanelVariant, LcarsPanelProps } from "./catalog/lcars-panel";
export { LeaseApproval } from "./catalog/lease-approval";
export type { LeaseStatus, LeaseApprovalProps } from "./catalog/lease-approval";
export { LiveBadge } from "./catalog/live-badge";
export type { LiveBadgeProps } from "./catalog/live-badge";
export { LiveLogStream } from "./catalog/live-log-stream";
export type { LogLine, LiveLogStreamProps } from "./catalog/live-log-stream";
export { LoadingProgress } from "./catalog/loading-progress";
export type { LoadingStage, LoadingProgressProps } from "./catalog/loading-progress";
export { LogHistogram } from "./catalog/log-histogram";
export type { LogBucket, LogHistogramProps } from "./catalog/log-histogram";
export { LogSearchQuery } from "./catalog/log-search-query";
export type { LogSearchQueryProps } from "./catalog/log-search-query";
export { LogStream } from "./catalog/log-stream";
export type { LogStreamProps } from "./catalog/log-stream";
export { MarkdownEditor } from "./catalog/markdown-editor";
export type { MarkdownEditorProps } from "./catalog/markdown-editor";
export { MarketHeatmap } from "./catalog/market-heatmap";
export type { MarketCell, MarketHeatmapProps } from "./catalog/market-heatmap";
export { MemoryUsageChart } from "./catalog/memory-usage-chart";
export type { MemoryPoint, MemoryUsageChartProps } from "./catalog/memory-usage-chart";
export { MessageBubble } from "./catalog/message-bubble";
export type { MessageBubbleProps } from "./catalog/message-bubble";
export { MetricChart } from "./catalog/metric-chart";
export type { MetricPoint, MetricChartProps } from "./catalog/metric-chart";
export { MindMap } from "./catalog/mind-map";
export type { MindMapNode, MindMapProps } from "./catalog/mind-map";
export { MiniMap } from "./catalog/mini-map";
export type { MiniMapProps } from "./catalog/mini-map";
export { ModelSelector } from "./catalog/model-selector";
export type { ModelOption, ModelSelectorProps } from "./catalog/model-selector";
export { MultiSelect } from "./catalog/multi-select";
export type { MultiSelectOption, MultiSelectProps } from "./catalog/multi-select";
export { NetworkGraph } from "./catalog/network-graph";
export type { NetworkNode, NetworkLink, NetworkGraphProps } from "./catalog/network-graph";
export { NetworkTopology } from "./catalog/network-topology";
export type { TopologyNode, TopologyLink, NetworkTopologyProps } from "./catalog/network-topology";
export { ObjectProperties } from "./catalog/object-properties";
export type { ObjectProperty, ObjectPropertiesProps } from "./catalog/object-properties";
export { OrderBook } from "./catalog/order-book";
export type { OrderLevel, OrderBookProps } from "./catalog/order-book";
export { OrgChart } from "./catalog/org-chart";
export type { OrgNode, OrgChartProps } from "./catalog/org-chart";
export { PacketInspector } from "./catalog/packet-inspector";
export type { Packet, PacketInspectorProps } from "./catalog/packet-inspector";
export { Pagination } from "./catalog/pagination";
export type { PaginationProps } from "./catalog/pagination";
export { ParticleStream } from "./catalog/particle-stream";
export type { ParticleStreamProps } from "./catalog/particle-stream";
export { PdfPreview } from "./catalog/pdf-preview";
export type { PdfPreviewProps } from "./catalog/pdf-preview";
export { PinInput } from "./catalog/pin-input";
export type { PinInputProps } from "./catalog/pin-input";
export { PingCard } from "./catalog/ping-card";
export type { PingCardPing, PingCardProps } from "./catalog/ping-card";
export { PortfolioPie } from "./catalog/portfolio-pie";
export type { PortfolioAsset, PortfolioPieProps } from "./catalog/portfolio-pie";
export { PrimitivesGallery } from "./catalog/primitives-gallery";
export type { PrimitivesGalleryProps } from "./catalog/primitives-gallery";
export { ProcessTable } from "./catalog/process-table";
export type { ProcessInfo, ProcessTableProps } from "./catalog/process-table";
export { ProgressBar } from "./catalog/progress-bar";
export type { ProgressBarProps } from "./catalog/progress-bar";
export { ProgressTimeline } from "./catalog/progress-timeline";
export type { ProgressStep, ProgressTimelineProps } from "./catalog/progress-timeline";
export { PromptEditor } from "./catalog/prompt-editor";
export type { PromptEditorProps } from "./catalog/prompt-editor";
export { PropertyGrid } from "./catalog/property-grid";
export type { PropertyGridItem, PropertyGridProps } from "./catalog/property-grid";
export { QuickActions } from "./catalog/quick-actions";
export type { QuickActionsProps } from "./catalog/quick-actions";
export { RadarChart } from "./catalog/radar-chart";
export type { RadarAxis, RadarChartProps } from "./catalog/radar-chart";
export { RadarSweep } from "./catalog/radar-sweep";
export type { RadarBlip, RadarSweepProps } from "./catalog/radar-sweep";
export { RadialNav } from "./catalog/radial-nav";
export type { RadialNavItem, RadialNavProps } from "./catalog/radial-nav";
export { RangeSlider } from "./catalog/range-slider";
export type { RangeSliderProps } from "./catalog/range-slider";
export { Rating } from "./catalog/rating";
export type { RatingProps } from "./catalog/rating";
export { RecurringEventEditor } from "./catalog/recurring-event-editor";
export type { RecurringEventEditorProps } from "./catalog/recurring-event-editor";
export { RegexTester } from "./catalog/regex-tester";
export type { RegexTesterProps } from "./catalog/regex-tester";
export { ResourceGauge } from "./catalog/resource-gauge";
export type { ResourceGaugeProps } from "./catalog/resource-gauge";
export { ResourceView } from "./catalog/resource-view";
export type { ResourceEntry, ResourceViewProps } from "./catalog/resource-view";
export { RichMarkdownRenderer } from "./catalog/rich-markdown-renderer";
export type { RichMarkdownRendererProps } from "./catalog/rich-markdown-renderer";
export { SankeyDiagram } from "./catalog/sankey-diagram";
export type { SankeyNode, SankeyLink, SankeyDiagramProps } from "./catalog/sankey-diagram";
export { SchemaGraph } from "./catalog/schema-graph";
export type { SchemaNode, SchemaRelation, SchemaGraphProps } from "./catalog/schema-graph";
export { SecretInput } from "./catalog/secret-input";
export type { SecretInputProps } from "./catalog/secret-input";
export { SegmentedControl } from "./catalog/segmented-control";
export type { SegmentedControlProps } from "./catalog/segmented-control";
export { SelectionList } from "./catalog/selection-list";
export type { SelectionItem, SelectionOption, SelectionListProps } from "./catalog/selection-list";
export { ServerRackStatus } from "./catalog/server-rack-status";
export type { RackUnit, ServerRackStatusProps } from "./catalog/server-rack-status";
export { cn, SharedComponents } from "./catalog/shared-components";
export type { SharedComponentsProps } from "./catalog/shared-components";
export { SidePanel } from "./catalog/side-panel";
export type { SidePanelProps } from "./catalog/side-panel";
export { SignalMonitor } from "./catalog/signal-monitor";
export type { SignalChannel, SignalMonitorProps } from "./catalog/signal-monitor";
export { Skeleton } from "./catalog/skeleton";
export { Slider } from "./catalog/slider";
export type { SliderProps } from "./catalog/slider";
export { SmartActionResult } from "./catalog/smart-action-result";
export type { SmartActionResultProps } from "./catalog/smart-action-result";
export { SonarDisplay } from "./catalog/sonar-display";
export type { SonarDisplayProps } from "./catalog/sonar-display";
export { SplitView } from "./catalog/split-view";
export type { SplitViewProps } from "./catalog/split-view";
export { SqlResultTable } from "./catalog/sql-result-table";
export type { SqlResultTableProps } from "./catalog/sql-result-table";
export { StackTraceProfiler } from "./catalog/stack-trace-profiler";
export type { StackFrame, StackTraceProfilerProps } from "./catalog/stack-trace-profiler";
export { StarField } from "./catalog/star-field";
export type { StarFieldProps } from "./catalog/star-field";
export { StatsGrid } from "./catalog/stats-grid";
export type { StatItem, StatsGridProps } from "./catalog/stats-grid";
export type { StatusCardProps } from "./catalog/status-card";
export { StatusIndicator } from "./catalog/status-indicator";
export type { StatusIndicatorProps } from "./catalog/status-indicator";
export { StepChecklist } from "./catalog/step-checklist";
export type { ChecklistItem, StepDef, StepChecklistProps } from "./catalog/step-checklist";
export { StepTracker } from "./catalog/step-tracker";
export type { Step, StepTrackerProps } from "./catalog/step-tracker";
export { Stepper } from "./catalog/stepper";
export type { StepperProps } from "./catalog/stepper";
export { StorageDistribution } from "./catalog/storage-distribution";
export type { StorageSegment, StorageDistributionProps } from "./catalog/storage-distribution";
export { SystemHealthGauge } from "./catalog/system-health-gauge";
export type { SystemMetric, SystemHealthGaugeProps } from "./catalog/system-health-gauge";
export { TabsContainer } from "./catalog/tabs-container";
export type { TabsContainerTab, TabsContainerProps } from "./catalog/tabs-container";
export { TagInput } from "./catalog/tag-input";
export type { TagInputProps } from "./catalog/tag-input";
export { TaskQueue } from "./catalog/task-queue";
export type { Task, TaskQueueProps } from "./catalog/task-queue";
export { TaskWorkflow } from "./catalog/task-workflow";
export type { WorkflowTask, WorkflowStage, TaskWorkflowStep, TaskWorkflowProps } from "./catalog/task-workflow";
export { TeamRoster } from "./catalog/team-roster";
export type { TeamMember, TeamRosterProps } from "./catalog/team-roster";
export { TerminalConsole } from "./catalog/terminal-console";
export type { TerminalConsoleLine, TerminalConsoleProps } from "./catalog/terminal-console";
export { TerminalView } from "./catalog/terminal-view";
export type { TerminalLine, TerminalViewProps } from "./catalog/terminal-view";
export { TextArea } from "./catalog/text-area";
export type { TextAreaProps } from "./catalog/text-area";
export { ThemeToggle } from "./catalog/theme-toggle";
export type { ThemeToggleProps } from "./catalog/theme-toggle";
export { TickerTape } from "./catalog/ticker-tape";
export type { TickerItem, TickerTapeProps } from "./catalog/ticker-tape";
export { TimeSlotPicker } from "./catalog/time-slot-picker";
export type { TimeSlot, TimeSlotPickerProps } from "./catalog/time-slot-picker";
export { TimezoneSlider } from "./catalog/timezone-slider";
export type { TimezoneSliderProps } from "./catalog/timezone-slider";
export { ToastManager } from "./catalog/toast-manager";
export type { ToastMessage, ToastManagerProps } from "./catalog/toast-manager";
export { ToggleSwitch } from "./catalog/toggle-switch";
export type { ToggleSwitchProps } from "./catalog/toggle-switch";
export { TokenStream } from "./catalog/token-stream";
export type { TokenStreamProps } from "./catalog/token-stream";
export { ToolInvocation } from "./catalog/tool-invocation";
export type { ToolInvocationProps } from "./catalog/tool-invocation";
export { TradeHistory } from "./catalog/trade-history";
export type { Trade, TradeHistoryProps } from "./catalog/trade-history";
export { TransferList } from "./catalog/transfer-list";
export type { TransferItem, TransferListProps } from "./catalog/transfer-list";
export { TreeBrowser } from "./catalog/tree-browser";
export type { TreeNode, TreeBrowserProps } from "./catalog/tree-browser";
export { TypingIndicator } from "./catalog/typing-indicator";
export type { TypingIndicatorProps } from "./catalog/typing-indicator";
export { VectorCluster } from "./catalog/vector-cluster";
export type { ClusterPoint, VectorClusterProps } from "./catalog/vector-cluster";
export { VideoPlayer } from "./catalog/video-player";
export type { VideoPlayerProps } from "./catalog/video-player";
export { VoiceVisualizer } from "./catalog/voice-visualizer";
export type { VoiceVisualizerProps } from "./catalog/voice-visualizer";
export { WeatherCard } from "./catalog/weather-card";
export type { WeatherCondition, WeatherCardProps } from "./catalog/weather-card";
export { WeeklySchedule } from "./catalog/weekly-schedule";
export type { ScheduleEvent, WeeklyScheduleProps } from "./catalog/weekly-schedule";
export { WizardStep } from "./catalog/wizard-step";
export type { WizardStepProps } from "./catalog/wizard-step";
export { WorldClock } from "./catalog/world-clock";
export type { TimezoneEntry, WorldClockProps } from "./catalog/world-clock";
export { YearHeatmap } from "./catalog/year-heatmap";
export type { HeatmapEntry, YearHeatmapProps } from "./catalog/year-heatmap";

// Additional barrel-missing exports (dashboard skeletons, CRUD dialogs, hero type)
export { StatusBarSkeleton } from "./dashboard/skeletons/StatusBarSkeleton";
export { ArchiveDialog } from "./recipes/crud/dialogs/ArchiveDialog";
export { DeleteDialog } from "./recipes/crud/dialogs/DeleteDialog";
export { RestoreDialog } from "./recipes/crud/dialogs/RestoreDialog";
export type { HeroBgType } from "./recipes/hero";
export { ErrorBoundary } from "./catalog/error-boundary";
