/**
 * Polymorph Layer — Barrel Export
 *
 * Universal component primitives that render to HTML, Pencil (.pen), or React.
 */
export { THEMES } from './types.js';
// Sizes
export { SIZES } from './sizes.js';
// Primitives
export { StatusDot, Badge, Button, TextBlock, InputField, ProgressBar, CheckItem, MetricValue, ListItem, Card, NavItem, ActionBar, PRIMITIVE_MAP, resetIds, } from './primitives.js';
// Renderers
export { renderToHTML } from './renderers/html.js';
export { renderToPencil } from './renderers/pencil.js';
export { renderToReact } from './renderers/react.js';
// Templates
import { designTemplate } from './templates/design.js';
import { dataTemplate } from './templates/data.js';
import { conceptTemplate } from './templates/concept.js';
import { critiqueTemplate } from './templates/critique.js';
export { designTemplate, dataTemplate, conceptTemplate, critiqueTemplate };
export const templates = {
    design: designTemplate,
    data: dataTemplate,
    concept: conceptTemplate,
    critique: critiqueTemplate,
};
