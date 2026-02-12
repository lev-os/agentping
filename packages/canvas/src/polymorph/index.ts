/**
 * Polymorph Layer — Barrel Export
 *
 * Universal component primitives that render to Pencil (.pen) or React.
 * HTML renderer is deprecated (export-only artifact, not production surface).
 */

// Types
export type {
  PrimitiveKind,
  PolymorphPrimitive,
  ThemeName,
  ThemeMode,
  TemplateName,
  ThemeTokens,
  ThemeVariants,
  RenderOptions,
  Template,
} from './types.js';

export { THEMES, getThemeTokens } from './types.js';

// Sizes
export { SIZES, type Size } from './sizes.js';

// Primitives
export {
  StatusDot,
  Badge,
  Button,
  TextBlock,
  InputField,
  ProgressBar,
  CheckItem,
  MetricValue,
  ListItem,
  Card,
  NavItem,
  ActionBar,
  PRIMITIVE_MAP,
  resetIds,
} from './primitives.js';

// Renderers (production surfaces)
export { renderToPencil } from './renderers/pencil.js';
export { renderToReact, type ReactCatalogEntry } from './renderers/react.js';

// Templates
import { designTemplate } from './templates/design.js';
import { dataTemplate } from './templates/data.js';
import { conceptTemplate } from './templates/concept.js';
import { critiqueTemplate } from './templates/critique.js';
import { docsTemplate } from './templates/docs.js';
import { diffTemplate } from './templates/diff.js';
import type { Template } from './types.js';

export { designTemplate, dataTemplate, conceptTemplate, critiqueTemplate, docsTemplate, diffTemplate };

export const templates: Record<string, Template> = {
  design: designTemplate,
  data: dataTemplate,
  concept: conceptTemplate,
  critique: critiqueTemplate,
  docs: docsTemplate,
  diff: diffTemplate,
};
