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
} from "./migrations";

// Canvas package migrations
export {
  CanvasRenderer,
  type CanvasRendererProps,
} from "./migrations";
export {
  ConnectionStatus,
  type ConnectionStatusProps,
} from "./migrations";
export {
  KanbanBoard,
  type KanbanBoardProps,
  type KanbanItem,
  type KanbanColumn,
} from "./migrations";
export {
  MarkdownCard,
  type MarkdownCardProps,
} from "./migrations";
export {
  PolymorphPlayground,
  type PolymorphPlaygroundProps,
} from "./migrations";
export {
  TodoList,
  type TodoListProps,
  type TodoItem,
} from "./migrations";

// Dashboard-manager-ui package migrations
export {
  DmAnalyticsPanel,
  type DmAnalyticsPanelProps,
} from "./migrations";
export {
  DmCreateDashboardModal,
  type DmCreateDashboardModalProps,
  type DashboardFormData,
} from "./migrations";
export {
  DmDashboardDetail,
  type DmDashboardDetailProps,
  type DmDashboardConfig,
  type DmDashboardStatus,
  type DmDashboard,
  type DmDashboardMetrics,
} from "./migrations";
export {
  DmDashboardList,
  type DmDashboardListProps,
  type DmDashboardSummary,
} from "./migrations";
export {
  DmLogViewer,
  type DmLogViewerProps,
  type DmLogLine,
} from "./migrations";
export {
  DmStatusBadge,
  type DmStatusBadgeProps,
  type DmStatusType,
} from "./migrations";
export {
  DmRestartHistogram,
  type DmRestartHistogramProps,
} from "./migrations";
export {
  DmUptimeChart,
  type DmUptimeChartProps,
} from "./migrations";

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
} from "./migrations";
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
} from "./migrations";

// =============================================================================
// WEB-UI MIGRATION MODULES
// Standard component migrations re-exported for shim consumers (Pass 4).
// =============================================================================

export { AccessPad } from "./migrations/access-pad";
export type { AccessPadProps } from "./migrations/access-pad";
export { AccordionList } from "./migrations/accordion-list";
export type { AccordionItem, AccordionListProps } from "./migrations/accordion-list";
export { ActiveSessions } from "./migrations/active-sessions";
export type { Session, ActiveSessionsProps } from "./migrations/active-sessions";
export { ActivityFeed } from "./migrations/activity-feed";
export type { ActivityItem, ActivityFeedProps } from "./migrations/activity-feed";
export { AdvancedDataGrid } from "./migrations/advanced-data-grid";
export type { DataGridColumn, AdvancedDataGridProps } from "./migrations/advanced-data-grid";
export { AgentAvatar } from "./migrations/agent-avatar";
export type { AgentAvatarProps } from "./migrations/agent-avatar";
export { AlertBanner } from "./migrations/alert-banner";
export type { AlertBannerProps } from "./migrations/alert-banner";
export { AlertFeed } from "./migrations/alert-feed";
export type { Alert, AlertFeedProps } from "./migrations/alert-feed";
export { AssetCard } from "./migrations/asset-card";
export type { AssetCardProps } from "./migrations/asset-card";
export { AudioPlayer } from "./migrations/audio-player";
export type { AudioPlayerProps } from "./migrations/audio-player";
export { AuditLogTable } from "./migrations/audit-log-table";
export type { AuditEntry, AuditLogTableProps } from "./migrations/audit-log-table";
export { AuditLogViewer } from "./migrations/audit-log-viewer";
export type { AuditLogViewerProps } from "./migrations/audit-log-viewer";
export { BatteryMeter } from "./migrations/battery-meter";
export type { BatteryMeterProps } from "./migrations/battery-meter";
export { BrainActivity } from "./migrations/brain-activity";
export type { BrainActivityProps } from "./migrations/brain-activity";
export { Breadcrumbs } from "./migrations/breadcrumbs";
export type { BreadcrumbsProps } from "./migrations/breadcrumbs";
export { BuildStatusLogs } from "./migrations/build-status-logs";
export type { BuildStep, BuildStatusLogsProps } from "./migrations/build-status-logs";
export { CalendarView } from "./migrations/calendar-view";
export type { CalendarEvent, CalendarViewProps } from "./migrations/calendar-view";
export { CandleStickChart } from "./migrations/candlestick-chart";
export type { CandleData, CandleStickChartProps } from "./migrations/candlestick-chart";
export { CircuitPattern } from "./migrations/circuit-pattern";
export type { CircuitPatternProps } from "./migrations/circuit-pattern";
export { CircularProgress } from "./migrations/circular-progress";
export type { CircularProgressProps } from "./migrations/circular-progress";
export { ColorPicker } from "./migrations/color-picker";
export type { ColorPickerProps } from "./migrations/color-picker";
export { CommandPalette } from "./migrations/command-palette";
export type { CommandItem, CommandPaletteProps } from "./migrations/command-palette";
export { ConfidenceMeter } from "./migrations/confidence-meter";
export type { ConfidenceMeterProps } from "./migrations/confidence-meter";
export { ConfirmationModal } from "./migrations/confirmation-modal";
export type { ConfirmationModalProps } from "./migrations/confirmation-modal";
export { ConflictResolver } from "./migrations/conflict-resolver";
export type { ConflictResolverProps } from "./migrations/conflict-resolver";
export { ConnectionSignal } from "./migrations/connection-signal";
export type { ConnectionSignalProps } from "./migrations/connection-signal";
export { ContextUsage } from "./migrations/context-usage";
export type { ContextUsageProps } from "./migrations/context-usage";
export { CountdownWidget } from "./migrations/countdown-widget";
export type { CountdownWidgetProps } from "./migrations/countdown-widget";
export { CsvPreview } from "./migrations/csv-preview";
export type { CsvPreviewProps } from "./migrations/csv-preview";
export { CsvViewer } from "./migrations/csv-viewer";
export type { CsvViewerProps } from "./migrations/csv-viewer";
export { DailyAgenda } from "./migrations/daily-agenda";
export type { AgendaItem, DailyAgendaProps } from "./migrations/daily-agenda";
export { DataMetricsBoard } from "./migrations/data-metrics-board";
export type { DataMetric, DataMetricsBoardProps } from "./migrations/data-metrics-board";
export { DataPipeline } from "./migrations/data-pipeline";
export type { PipelineStage, DataPipelineProps } from "./migrations/data-pipeline";
export { DataTable } from "./migrations/data-table";
export type { DataTableColumn, DataTableProps } from "./migrations/data-table";
export { DatePicker } from "./migrations/date-picker";
export type { DatePickerProps } from "./migrations/date-picker";
export { DatePickerPro } from "./migrations/date-picker-pro";
export type { DatePickerProProps } from "./migrations/date-picker-pro";
export { DependencyGraph } from "./migrations/dependency-graph";
export type { DependencyNode, DependencyGraphProps } from "./migrations/dependency-graph";
export { DepthChart } from "./migrations/depth-chart";
export type { DepthLevel, DepthChartProps } from "./migrations/depth-chart";
export { DiffStatSummary } from "./migrations/diff-stat-summary";
export type { DiffStatSummaryProps } from "./migrations/diff-stat-summary";
export { DistributedTrace } from "./migrations/distributed-trace";
export type { TraceSpan, DistributedTraceProps } from "./migrations/distributed-trace";
export { DockMenu } from "./migrations/dock-menu";
export type { DockItem, DockMenuProps } from "./migrations/dock-menu";
export { DockerStats } from "./migrations/docker-stats";
export type { ContainerStats, DockerStatsProps } from "./migrations/docker-stats";
export { DraggableList } from "./migrations/draggable-list";
export type { DraggableItem, DraggableListProps } from "./migrations/draggable-list";
export { EditableText } from "./migrations/editable-text";
export type { EditableTextProps } from "./migrations/editable-text";
export { EncryptionStatus } from "./migrations/encryption-status";
export type { EncryptionChannel, EncryptionStatusProps } from "./migrations/encryption-status";
export { EnrichmentPanel } from "./migrations/enrichment-panel";
export type { EnrichmentPanelProps } from "./migrations/enrichment-panel";
export type { ErrorBoundaryProps } from "./migrations/error-boundary";
export { ErrorCluster } from "./migrations/error-cluster";
export type { ErrorGroup, ErrorClusterProps } from "./migrations/error-cluster";
export { EventCard } from "./migrations/event-card";
export type { Attendee, EventCardProps } from "./migrations/event-card";
export { EventTimeline } from "./migrations/event-timeline";
export type { TimelineEvent, EventTimelineProps } from "./migrations/event-timeline";
export { ExchangeStatus } from "./migrations/exchange-status";
export type { Exchange, ExchangeStatusProps } from "./migrations/exchange-status";
export { FileAssetPicker } from "./migrations/file-asset-picker";
export type { FileAsset, FileAssetPickerProps } from "./migrations/file-asset-picker";
export { FileMetadataCard } from "./migrations/file-metadata-card";
export type { FileMetadata, FileMetadataCardProps } from "./migrations/file-metadata-card";
export { FirewallRules } from "./migrations/firewall-rules";
export type { FirewallRule, FirewallRulesProps } from "./migrations/firewall-rules";
export { ForecastingLine } from "./migrations/forecasting-line";
export type { ForecastPoint, ForecastingLineProps } from "./migrations/forecasting-line";
export { GalleryAISection } from "./migrations/gallery-ai-section";
export type { GalleryAISectionProps } from "./migrations/gallery-ai-section";
export { GalleryContentSection } from "./migrations/gallery-content-section";
export type { GalleryContentSectionProps } from "./migrations/gallery-content-section";
export { GalleryDashboardSection } from "./migrations/gallery-dashboard-section";
export type { GalleryDashboardSectionProps } from "./migrations/gallery-dashboard-section";
export { GalleryDataSection } from "./migrations/gallery-data-section";
export type { GalleryDataSectionProps } from "./migrations/gallery-data-section";
export { GalleryFeedbackSection } from "./migrations/gallery-feedback-section";
export type { GalleryFeedbackSectionProps } from "./migrations/gallery-feedback-section";
export { GalleryFinanceSection } from "./migrations/gallery-finance-section";
export type { GalleryFinanceSectionProps } from "./migrations/gallery-finance-section";
export { GalleryFormsSection } from "./migrations/gallery-forms-section";
export type { GalleryFormsSectionProps } from "./migrations/gallery-forms-section";
export { GalleryInteractionSection } from "./migrations/gallery-interaction-section";
export type { GalleryInteractionSectionProps } from "./migrations/gallery-interaction-section";
export { GalleryLogsSection } from "./migrations/gallery-logs-section";
export type { GalleryLogsSectionProps } from "./migrations/gallery-logs-section";
export { GalleryMediaSection } from "./migrations/gallery-media-section";
export type { GalleryMediaSectionProps } from "./migrations/gallery-media-section";
export { GalleryNavigationSection } from "./migrations/gallery-navigation-section";
export type { GalleryNavigationSectionProps } from "./migrations/gallery-navigation-section";
export { GallerySchedulingSection } from "./migrations/gallery-scheduling-section";
export type { GallerySchedulingSectionProps } from "./migrations/gallery-scheduling-section";
export { GallerySofiaSection } from "./migrations/gallery-sofia-section";
export type { GallerySofiaSectionProps } from "./migrations/gallery-sofia-section";
export { GallerySystemSection } from "./migrations/gallery-system-section";
export type { GallerySystemSectionProps } from "./migrations/gallery-system-section";
export { GalleryVisualsSection } from "./migrations/gallery-visuals-section";
export type { GalleryVisualsSectionProps } from "./migrations/gallery-visuals-section";
export { GeoMap } from "./migrations/geo-map";
export type { MapMarker, GeoMapProps } from "./migrations/geo-map";
export { GeoRequestMap } from "./migrations/geo-request-map";
export type { GeoLocation, GeoRequestMapProps } from "./migrations/geo-request-map";
export { GlobeWireframe } from "./migrations/globe-wireframe";
export type { GlobeWireframeProps } from "./migrations/globe-wireframe";
export { HeatmapGrid } from "./migrations/heatmap-grid";
export type { HeatmapGridProps } from "./migrations/heatmap-grid";
export { HexDumpView } from "./migrations/hex-dump-view";
export type { HexDumpViewProps } from "./migrations/hex-dump-view";
export { HexGridBackground } from "./migrations/hex-grid-background";
export type { HexGridBackgroundProps } from "./migrations/hex-grid-background";
export { HexInspector } from "./migrations/hex-inspector";
export type { HexInspectorProps } from "./migrations/hex-inspector";
export { HistoryView } from "./migrations/history-view";
export type { HistoryEntry, HistoryViewProps } from "./migrations/history-view";
export { HoverCard } from "./migrations/hover-card";
export type { HoverCardProps } from "./migrations/hover-card";
export { HttpInspector } from "./migrations/http-inspector";
export type { HttpRequest, HttpInspectorProps } from "./migrations/http-inspector";
export { ImageCompare } from "./migrations/image-compare";
export type { ImageCompareProps } from "./migrations/image-compare";
export { ImageDiff } from "./migrations/image-diff";
export type { ImageDiffProps } from "./migrations/image-diff";
export { InfoSidebar } from "./migrations/info-sidebar";
export type { SidebarLink, InfoSidebarProps } from "./migrations/info-sidebar";
export { InlineTutorialTooltip } from "./migrations/inline-tutorial-tooltip";
export type { InlineTutorialTooltipProps } from "./migrations/inline-tutorial-tooltip";
export { JsonDiff } from "./migrations/json-diff";
export type { JsonDiffProps } from "./migrations/json-diff";
export { JsonEditor } from "./migrations/json-editor";
export type { JsonEditorProps } from "./migrations/json-editor";
export { JsonTreeViewer } from "./migrations/json-tree-viewer";
export type { JsonTreeViewerProps } from "./migrations/json-tree-viewer";
export { KeyValueStore } from "./migrations/key-value-store";
export type { KeyValueEntry, KeyValueStoreProps } from "./migrations/key-value-store";
export { Knob } from "./migrations/knob";
export type { KnobProps } from "./migrations/knob";
export { LandingPage } from "./migrations/landing-page";
export type { LandingPageProps } from "./migrations/landing-page";
export { LatencyHistogram } from "./migrations/latency-histogram";
export type { LatencyBucket, LatencyHistogramProps } from "./migrations/latency-histogram";
export { LcarsButton } from "./migrations/lcars-button";
export type { LcarsButtonVariant, LcarsButtonSize, LcarsButtonColor, LcarsButtonProps } from "./migrations/lcars-button";
export { LcarsElbow } from "./migrations/lcars-elbow";
export type { ElbowPosition, ElbowSize, LcarsElbowProps } from "./migrations/lcars-elbow";
export { LcarsPanel } from "./migrations/lcars-panel";
export type { LcarsPanelVariant, LcarsPanelProps } from "./migrations/lcars-panel";
export { LeaseApproval } from "./migrations/lease-approval";
export type { LeaseStatus, LeaseApprovalProps } from "./migrations/lease-approval";
export { LiveBadge } from "./migrations/live-badge";
export type { LiveBadgeProps } from "./migrations/live-badge";
export { LiveLogStream } from "./migrations/live-log-stream";
export type { LogLine, LiveLogStreamProps } from "./migrations/live-log-stream";
export { LoadingProgress } from "./migrations/loading-progress";
export type { LoadingStage, LoadingProgressProps } from "./migrations/loading-progress";
export { LogHistogram } from "./migrations/log-histogram";
export type { LogBucket, LogHistogramProps } from "./migrations/log-histogram";
export { LogSearchQuery } from "./migrations/log-search-query";
export type { LogSearchQueryProps } from "./migrations/log-search-query";
export { LogStream } from "./migrations/log-stream";
export type { LogStreamProps } from "./migrations/log-stream";
export { MarkdownEditor } from "./migrations/markdown-editor";
export type { MarkdownEditorProps } from "./migrations/markdown-editor";
export { MarketHeatmap } from "./migrations/market-heatmap";
export type { MarketCell, MarketHeatmapProps } from "./migrations/market-heatmap";
export { MemoryUsageChart } from "./migrations/memory-usage-chart";
export type { MemoryPoint, MemoryUsageChartProps } from "./migrations/memory-usage-chart";
export { MessageBubble } from "./migrations/message-bubble";
export type { MessageBubbleProps } from "./migrations/message-bubble";
export { MetricChart } from "./migrations/metric-chart";
export type { MetricPoint, MetricChartProps } from "./migrations/metric-chart";
export { MindMap } from "./migrations/mind-map";
export type { MindMapNode, MindMapProps } from "./migrations/mind-map";
export { MiniMap } from "./migrations/mini-map";
export type { MiniMapProps } from "./migrations/mini-map";
export { ModelSelector } from "./migrations/model-selector";
export type { ModelOption, ModelSelectorProps } from "./migrations/model-selector";
export { MultiSelect } from "./migrations/multi-select";
export type { MultiSelectOption, MultiSelectProps } from "./migrations/multi-select";
export { NetworkGraph } from "./migrations/network-graph";
export type { NetworkNode, NetworkLink, NetworkGraphProps } from "./migrations/network-graph";
export { NetworkTopology } from "./migrations/network-topology";
export type { TopologyNode, TopologyLink, NetworkTopologyProps } from "./migrations/network-topology";
export { ObjectProperties } from "./migrations/object-properties";
export type { ObjectProperty, ObjectPropertiesProps } from "./migrations/object-properties";
export { OrderBook } from "./migrations/order-book";
export type { OrderLevel, OrderBookProps } from "./migrations/order-book";
export { OrgChart } from "./migrations/org-chart";
export type { OrgNode, OrgChartProps } from "./migrations/org-chart";
export { PacketInspector } from "./migrations/packet-inspector";
export type { Packet, PacketInspectorProps } from "./migrations/packet-inspector";
export { Pagination } from "./migrations/pagination";
export type { PaginationProps } from "./migrations/pagination";
export { ParticleStream } from "./migrations/particle-stream";
export type { ParticleStreamProps } from "./migrations/particle-stream";
export { PdfPreview } from "./migrations/pdf-preview";
export type { PdfPreviewProps } from "./migrations/pdf-preview";
export { PinInput } from "./migrations/pin-input";
export type { PinInputProps } from "./migrations/pin-input";
export { PingCard } from "./migrations/ping-card";
export type { PingCardPing, PingCardProps } from "./migrations/ping-card";
export { PortfolioPie } from "./migrations/portfolio-pie";
export type { PortfolioAsset, PortfolioPieProps } from "./migrations/portfolio-pie";
export { PrimitivesGallery } from "./migrations/primitives-gallery";
export type { PrimitivesGalleryProps } from "./migrations/primitives-gallery";
export { ProcessTable } from "./migrations/process-table";
export type { ProcessInfo, ProcessTableProps } from "./migrations/process-table";
export { ProgressBar } from "./migrations/progress-bar";
export type { ProgressBarProps } from "./migrations/progress-bar";
export { ProgressTimeline } from "./migrations/progress-timeline";
export type { ProgressStep, ProgressTimelineProps } from "./migrations/progress-timeline";
export { PromptEditor } from "./migrations/prompt-editor";
export type { PromptEditorProps } from "./migrations/prompt-editor";
export { PropertyGrid } from "./migrations/property-grid";
export type { PropertyGridItem, PropertyGridProps } from "./migrations/property-grid";
export { QuickActions } from "./migrations/quick-actions";
export type { QuickActionsProps } from "./migrations/quick-actions";
export { RadarChart } from "./migrations/radar-chart";
export type { RadarAxis, RadarChartProps } from "./migrations/radar-chart";
export { RadarSweep } from "./migrations/radar-sweep";
export type { RadarBlip, RadarSweepProps } from "./migrations/radar-sweep";
export { RadialNav } from "./migrations/radial-nav";
export type { RadialNavItem, RadialNavProps } from "./migrations/radial-nav";
export { RangeSlider } from "./migrations/range-slider";
export type { RangeSliderProps } from "./migrations/range-slider";
export { Rating } from "./migrations/rating";
export type { RatingProps } from "./migrations/rating";
export { RecurringEventEditor } from "./migrations/recurring-event-editor";
export type { RecurringEventEditorProps } from "./migrations/recurring-event-editor";
export { RegexTester } from "./migrations/regex-tester";
export type { RegexTesterProps } from "./migrations/regex-tester";
export { ResourceGauge } from "./migrations/resource-gauge";
export type { ResourceGaugeProps } from "./migrations/resource-gauge";
export { ResourceView } from "./migrations/resource-view";
export type { ResourceEntry, ResourceViewProps } from "./migrations/resource-view";
export { RichMarkdownRenderer } from "./migrations/rich-markdown-renderer";
export type { RichMarkdownRendererProps } from "./migrations/rich-markdown-renderer";
export { SankeyDiagram } from "./migrations/sankey-diagram";
export type { SankeyNode, SankeyLink, SankeyDiagramProps } from "./migrations/sankey-diagram";
export { SchemaGraph } from "./migrations/schema-graph";
export type { SchemaNode, SchemaRelation, SchemaGraphProps } from "./migrations/schema-graph";
export { SecretInput } from "./migrations/secret-input";
export type { SecretInputProps } from "./migrations/secret-input";
export { SegmentedControl } from "./migrations/segmented-control";
export type { SegmentedControlProps } from "./migrations/segmented-control";
export { SelectionList } from "./migrations/selection-list";
export type { SelectionItem, SelectionOption, SelectionListProps } from "./migrations/selection-list";
export { ServerRackStatus } from "./migrations/server-rack-status";
export type { RackUnit, ServerRackStatusProps } from "./migrations/server-rack-status";
export { cn, SharedComponents } from "./migrations/shared-components";
export type { SharedComponentsProps } from "./migrations/shared-components";
export { SidePanel } from "./migrations/side-panel";
export type { SidePanelProps } from "./migrations/side-panel";
export { SignalMonitor } from "./migrations/signal-monitor";
export type { SignalChannel, SignalMonitorProps } from "./migrations/signal-monitor";
export { Skeleton } from "./migrations/skeleton";
export { Slider } from "./migrations/slider";
export type { SliderProps } from "./migrations/slider";
export { SmartActionResult } from "./migrations/smart-action-result";
export type { SmartActionResultProps } from "./migrations/smart-action-result";
export { SonarDisplay } from "./migrations/sonar-display";
export type { SonarDisplayProps } from "./migrations/sonar-display";
export { SplitView } from "./migrations/split-view";
export type { SplitViewProps } from "./migrations/split-view";
export { SqlResultTable } from "./migrations/sql-result-table";
export type { SqlResultTableProps } from "./migrations/sql-result-table";
export { StackTraceProfiler } from "./migrations/stack-trace-profiler";
export type { StackFrame, StackTraceProfilerProps } from "./migrations/stack-trace-profiler";
export { StarField } from "./migrations/star-field";
export type { StarFieldProps } from "./migrations/star-field";
export { StatsGrid } from "./migrations/stats-grid";
export type { StatItem, StatsGridProps } from "./migrations/stats-grid";
export type { StatusCardProps } from "./migrations/status-card";
export { StatusIndicator } from "./migrations/status-indicator";
export type { StatusIndicatorProps } from "./migrations/status-indicator";
export { StepChecklist } from "./migrations/step-checklist";
export type { ChecklistItem, StepDef, StepChecklistProps } from "./migrations/step-checklist";
export { StepTracker } from "./migrations/step-tracker";
export type { Step, StepTrackerProps } from "./migrations/step-tracker";
export { Stepper } from "./migrations/stepper";
export type { StepperProps } from "./migrations/stepper";
export { StorageDistribution } from "./migrations/storage-distribution";
export type { StorageSegment, StorageDistributionProps } from "./migrations/storage-distribution";
export { SystemHealthGauge } from "./migrations/system-health-gauge";
export type { SystemMetric, SystemHealthGaugeProps } from "./migrations/system-health-gauge";
export { TabsContainer } from "./migrations/tabs-container";
export type { TabsContainerTab, TabsContainerProps } from "./migrations/tabs-container";
export { TagInput } from "./migrations/tag-input";
export type { TagInputProps } from "./migrations/tag-input";
export { TaskQueue } from "./migrations/task-queue";
export type { Task, TaskQueueProps } from "./migrations/task-queue";
export { TaskWorkflow } from "./migrations/task-workflow";
export type { WorkflowTask, WorkflowStage, TaskWorkflowStep, TaskWorkflowProps } from "./migrations/task-workflow";
export { TeamRoster } from "./migrations/team-roster";
export type { TeamMember, TeamRosterProps } from "./migrations/team-roster";
export { TerminalConsole } from "./migrations/terminal-console";
export type { TerminalConsoleLine, TerminalConsoleProps } from "./migrations/terminal-console";
export { TerminalView } from "./migrations/terminal-view";
export type { TerminalLine, TerminalViewProps } from "./migrations/terminal-view";
export { TextArea } from "./migrations/text-area";
export type { TextAreaProps } from "./migrations/text-area";
export { ThemeToggle } from "./migrations/theme-toggle";
export type { ThemeToggleProps } from "./migrations/theme-toggle";
export { TickerTape } from "./migrations/ticker-tape";
export type { TickerItem, TickerTapeProps } from "./migrations/ticker-tape";
export { TimeSlotPicker } from "./migrations/time-slot-picker";
export type { TimeSlot, TimeSlotPickerProps } from "./migrations/time-slot-picker";
export { TimezoneSlider } from "./migrations/timezone-slider";
export type { TimezoneSliderProps } from "./migrations/timezone-slider";
export { ToastManager } from "./migrations/toast-manager";
export type { ToastMessage, ToastManagerProps } from "./migrations/toast-manager";
export { ToggleSwitch } from "./migrations/toggle-switch";
export type { ToggleSwitchProps } from "./migrations/toggle-switch";
export { TokenStream } from "./migrations/token-stream";
export type { TokenStreamProps } from "./migrations/token-stream";
export { ToolInvocation } from "./migrations/tool-invocation";
export type { ToolInvocationProps } from "./migrations/tool-invocation";
export { TradeHistory } from "./migrations/trade-history";
export type { Trade, TradeHistoryProps } from "./migrations/trade-history";
export { TransferList } from "./migrations/transfer-list";
export type { TransferItem, TransferListProps } from "./migrations/transfer-list";
export { TreeBrowser } from "./migrations/tree-browser";
export type { TreeNode, TreeBrowserProps } from "./migrations/tree-browser";
export { TypingIndicator } from "./migrations/typing-indicator";
export type { TypingIndicatorProps } from "./migrations/typing-indicator";
export { VectorCluster } from "./migrations/vector-cluster";
export type { ClusterPoint, VectorClusterProps } from "./migrations/vector-cluster";
export { VideoPlayer } from "./migrations/video-player";
export type { VideoPlayerProps } from "./migrations/video-player";
export { VoiceVisualizer } from "./migrations/voice-visualizer";
export type { VoiceVisualizerProps } from "./migrations/voice-visualizer";
export { WeatherCard } from "./migrations/weather-card";
export type { WeatherCondition, WeatherCardProps } from "./migrations/weather-card";
export { WeeklySchedule } from "./migrations/weekly-schedule";
export type { ScheduleEvent, WeeklyScheduleProps } from "./migrations/weekly-schedule";
export { WizardStep } from "./migrations/wizard-step";
export type { WizardStepProps } from "./migrations/wizard-step";
export { WorldClock } from "./migrations/world-clock";
export type { TimezoneEntry, WorldClockProps } from "./migrations/world-clock";
export { YearHeatmap } from "./migrations/year-heatmap";
export type { HeatmapEntry, YearHeatmapProps } from "./migrations/year-heatmap";

// Additional barrel-missing exports (dashboard skeletons, CRUD dialogs, hero type)
export { StatusBarSkeleton } from "./dashboard/skeletons/StatusBarSkeleton";
export { ArchiveDialog } from "./recipes/crud/dialogs/ArchiveDialog";
export { DeleteDialog } from "./recipes/crud/dialogs/DeleteDialog";
export { RestoreDialog } from "./recipes/crud/dialogs/RestoreDialog";
export type { HeroBgType } from "./recipes/hero";
export { ErrorBoundary } from "./migrations/error-boundary";

// GenUI — lev-now → React bridge layer
export { LevNowElement, LEV_NOW_ELEMENT_MAP } from "./genui";
export type { LevNowElementProps } from "./genui";
