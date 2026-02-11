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
export declare function renderToReact(primitives: PolymorphPrimitive[]): ReactCatalogEntry[];
