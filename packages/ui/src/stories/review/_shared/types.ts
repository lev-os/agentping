export type GateStatus = "pass" | "fail" | "shell" | "hollow" | "needs-review";
export type Classification = "REAL" | "RE-EXPORT" | "SHELL" | "HOLLOW" | "UNKNOWN";
export type Domain = "webui" | "studio" | "canvas" | "dm-ui" | "shared";

export interface ComponentMeta {
  id: string;
  name: string;
  family: string;
  domain: Domain;
  lanes: string[];
  beadId: string;
  storyPath: string;
  gateStatus: GateStatus;
  classification: Classification;
  markers: string[];
  ownerNotes?: string;
}

// ---------------------------------------------------------------------------
// Component IR — Extended classification for review, absorption, and GenUI
// C4 ratchet: reviewStatus moves forward only (unclassified → canonical)
// ---------------------------------------------------------------------------

/** Where did this component originate? Extracted from @source JSDoc annotation. */
export type OriginCodebase =
  | "webui"              // packages/adapters/web-ui
  | "studio"             // packages/studio
  | "dashboard-manager"  // packages/dashboard-manager-ui
  | "canvas"             // packages/canvas
  | "sofia"              // Sofia candidate (@kingly/ui Sofia lane)
  | "external";          // ClawBuddy, ClawTok, third-party

export interface ComponentOrigin {
  codebase: OriginCodebase;
  sourcePath: string;          // original @source path
  migrationStatus: string;     // @migration-status value
  sourceFile: string;          // current file path (components/migrations/...)
  storyFile: string;           // current story path (stories/migrations/...)
}

/** What can this component do? Multiple capabilities per component. */
export type ComponentCapability =
  | "input"       // forms, text entry, selection
  | "display"     // renders data (text, badges, cards)
  | "layout"      // arranges children (grids, panels, splits)
  | "navigation"  // routes, tabs, menus, breadcrumbs
  | "data-viz"    // charts, graphs, diagrams, maps
  | "feedback"    // toasts, alerts, loading, status
  | "streaming"   // accepts live/real-time updates
  | "crud"        // create/read/update/delete workflows
  | "media"       // audio, video, images
  | "system"      // process/resource monitoring
  | "composite";  // orchestrates multiple sub-components

/** Which surfaces can render this component? */
export interface SurfaceCompat {
  web: boolean;
  levNow: boolean;              // expressible as RenderSpec element
  levNowElement?: string;       // hero | section | card | data-table | etc.
  levNowVariant?: string;       // card variant, section variant, etc.
  tmux: boolean;                // has text-only representation
  native: boolean;              // has SwiftUI equivalent
}

/** C4 ratchet review status — forward only, no rollback */
export type ReviewStatus =
  | "unclassified"   // IR not populated
  | "classified"     // agent-classified, awaiting human review
  | "reviewed"       // human validated
  | "absorbed"       // integrated into canonical registry
  | "canonical"      // THE version, conflict resolved
  | "deprecated";    // superseded, in archive

/** Auto-extracted metrics from source */
export interface ComponentMetrics {
  loc: number;
  propCount: number;
  hookCount: number;
  importCount: number;
  hasTests: boolean;
  hasStory: boolean;
  hasScreenshot: boolean;
  exportName: string;            // the function/const name exported
}

/** lev-now absorption mapping — how this component maps to the GenUI spec */
export interface AbsorptionMapping {
  levNowElement?: string;        // which RenderSpec element type
  levNowVariant?: string;        // which variant (card:kpi, section:card-grid, etc.)
  canAutoGenerate: boolean;      // AI can generate this component via spec
  reactWrapperPath?: string;     // path to React wrapper if absorbed
  absorptionNotes?: string;      // freeform: merge strategy, dependencies needed
}

/** Full Component IR — extends ComponentMeta with origin, capabilities, surfaces */
export interface ComponentIR extends ComponentMeta {
  origin: ComponentOrigin;
  capabilities: ComponentCapability[];
  surfaces: SurfaceCompat;
  reviewStatus: ReviewStatus;
  humanDecision?: "keep" | "merge" | "deprecate";
  metrics: ComponentMetrics;
  absorption: AbsorptionMapping;
}

// ---------------------------------------------------------------------------
// Existing types (unchanged)
// ---------------------------------------------------------------------------

export interface ReviewPageProps {
  title: string;
  category: string;
  description?: string;
  components: ComponentMeta[];
}

export interface CompareLane {
  id: string;
  label: string;
  variant: "agentping" | "sophia" | "combined";
}
