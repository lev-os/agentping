/**
 * Polymorph Layer — Barrel Export
 *
 * Universal component primitives that render to Pencil (.pen) or React.
 */
export type { PrimitiveKind, PolymorphPrimitive, ThemeName, ThemeMode, TemplateName, ThemeTokens, ThemeVariants, RenderOptions, Template, } from './types.js';
export { THEMES, getThemeTokens } from './types.js';
export { SIZES, type Size } from './sizes.js';
export { StatusDot, Badge, Button, TextBlock, InputField, ProgressBar, CheckItem, MetricValue, ListItem, Card, NavItem, ActionBar, PRIMITIVE_MAP, resetIds, } from './primitives.js';
export { renderToPencil } from './renderers/pencil.js';
export { renderToReact, type ReactCatalogEntry } from './renderers/react.js';
import { designTemplate } from './templates/design.js';
import { dataTemplate } from './templates/data.js';
import { conceptTemplate } from './templates/concept.js';
import { critiqueTemplate } from './templates/critique.js';
import type { Template, TemplateName } from './types.js';
export { designTemplate, dataTemplate, conceptTemplate, critiqueTemplate };
export declare const templates: Record<TemplateName, Template>;
