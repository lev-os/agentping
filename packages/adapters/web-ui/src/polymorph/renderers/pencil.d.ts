/**
 * Pencil (.pen) Renderer
 *
 * Renders polymorph primitives to batch_design operation strings.
 */
import type { PolymorphPrimitive, ThemeName } from '../types.js';
/**
 * Render a tree of polymorph primitives into .pen batch_design operations.
 *
 * @returns Array of operation strings ready for batch_design.
 */
export declare function renderToPencil(primitives: PolymorphPrimitive[], parentBinding: string, options: {
    theme: ThemeName;
}): string[];
