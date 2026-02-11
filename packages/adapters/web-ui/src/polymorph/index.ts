/**
 * Polymorph Layer — Barrel Export
 *
 * Universal component primitives that render to HTML, Pencil (.pen), or React.
 */

// Types
export type {
  PrimitiveKind,
  PolymorphPrimitive,
  ThemeName,
  TemplateName,
  ThemeTokens,
  RenderOptions,
  Template,
} from './types.js';

export { THEMES } from './types.js';

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

// Renderers
export { renderToHTML } from './renderers/html.js';
export { renderToPencil } from './renderers/pencil.js';
export { renderToReact, type ReactCatalogEntry } from './renderers/react.js';

// Templates
import { designTemplate } from './templates/design.js';
import { dataTemplate } from './templates/data.js';
import { conceptTemplate } from './templates/concept.js';
import { critiqueTemplate } from './templates/critique.js';
import { docsTemplate } from './templates/docs.js';
import type { Template, TemplateName } from './types.js';

export { designTemplate, dataTemplate, conceptTemplate, critiqueTemplate, docsTemplate };

export const templates: Record<string, Template> = {
  design: designTemplate,
  data: dataTemplate,
  concept: conceptTemplate,
  critique: critiqueTemplate,
  docs: docsTemplate,
};
