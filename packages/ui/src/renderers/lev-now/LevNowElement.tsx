"use client";

/**
 * LevNowElement — lev-now renderer adapter.
 *
 * Bridges lev-now RenderSpec JSON elements to AgentPing React components.
 * Renderer-specific metadata, recipes, prop translators, and inline fallback
 * adapters live beside this entry point so normal AgentPing components remain
 * generic and GenUI-capable without a separate component caste.
 *
 * @module @kingly/ui/renderers/lev-now/LevNowElement
 */

import type * as React from "react";
import { Placeholder } from "./inline-adapters";
import { LEV_NOW_ELEMENT_MAP } from "./metadata";
import { LEV_NOW_RENDER_RECIPES } from "./recipes";
import type { LevNowElementProps } from "./types";

export { LEV_NOW_ELEMENT_MAP };
export type { LevNowElementProps };

/**
 * Renders a single lev-now element as a React component.
 *
 * @example
 * ```tsx
 * <LevNowElement
 *   type="data-table"
 *   props={{
 *     columns: [{ key: "name", label: "Name" }],
 *     rows: [{ name: "Alice" }],
 *   }}
 * />
 * ```
 */
export function LevNowElement(
  element: LevNowElementProps,
): React.ReactElement {
  const recipe = LEV_NOW_RENDER_RECIPES[element.type];
  return recipe ? recipe(element) : <Placeholder type={element.type} />;
}
