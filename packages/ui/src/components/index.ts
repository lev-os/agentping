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
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
} from "./ui/form";

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
} from "./migrations";
