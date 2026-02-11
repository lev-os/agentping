/**
 * React Catalog Renderer
 *
 * Converts polymorph primitives into catalog entries for the CanvasRenderer.
 */

import type { PolymorphPrimitive } from '../types.js';

export interface ReactCatalogEntry {
  id: string;
  kind: string;
  label?: string;
  props: Record<string, unknown>;
  children?: ReactCatalogEntry[];
}

/**
 * Flatten polymorph primitives into React catalog entries
 * that the CanvasRenderer can consume.
 */
export function renderToReact(primitives: PolymorphPrimitive[]): ReactCatalogEntry[] {
  return primitives.map(toEntry);
}

function toEntry(p: PolymorphPrimitive): ReactCatalogEntry {
  return {
    id: p.id,
    kind: p.kind,
    label: p.label,
    props: p.props,
    children: p.children?.map(toEntry),
  };
}
