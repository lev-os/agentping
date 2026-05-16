"use client";

import * as React from "react";
import { LevNowElement } from "./LevNowElement";

export type LevNowRuntimeIntentMetadata = unknown;

export interface LevNowRenderPacketElement {
  /** RenderSpec element discriminator. */
  type: string;
  /** Optional element recipe variant. */
  variant?: string;
  /** RenderSpec element props. */
  props?: Record<string, unknown>;
  /** Child element ids resolved through the packet element map. */
  children?: readonly string[];
  /** Allows structural compatibility with producer-owned RenderSpec fields. */
  [key: string]: unknown;
}

export interface LevNowRenderPacket {
  meta?: Record<string, unknown>;
  theme?: Record<string, unknown>;
  root: readonly string[];
  elements: Record<string, LevNowRenderPacketElement>;
  /**
   * Inert runtime declarations from producer packets. AgentPing exposes this
   * as data for hosts and never executes or mutates it during render.
   */
  runtime_intent?: LevNowRuntimeIntentMetadata;
  /**
   * Compatibility for older camelCase producer metadata while runtime_intent
   * remains the stable public packet field.
   */
  runtimeIntent?: LevNowRuntimeIntentMetadata;
}

export interface LevNowPacketRendererProps {
  packet: LevNowRenderPacket;
  className?: string;
}

export function getLevNowRuntimeIntentMetadata(
  packet: Pick<LevNowRenderPacket, "runtime_intent" | "runtimeIntent">,
): LevNowRuntimeIntentMetadata | undefined {
  return packet.runtime_intent ?? packet.runtimeIntent;
}

export function LevNowPacketRenderer({
  packet,
  className,
}: LevNowPacketRendererProps): React.ReactElement {
  return (
    <div
      className={className}
      data-lev-now-packet-renderer="true"
      data-lev-now-title={stringAttribute(packet.meta?.title)}
      data-lev-now-theme={stringAttribute(packet.theme?.preset)}
    >
      {packet.root.map((id) => renderPacketElement(packet, id, []))}
    </div>
  );
}

function renderPacketElement(
  packet: LevNowRenderPacket,
  id: string,
  ancestry: readonly string[],
): React.ReactElement {
  const element = packet.elements[id];
  if (!element) {
    return (
      <React.Fragment key={id}>
        {LevNowElement({
          type: "missing-element",
          props: { id },
        })}
      </React.Fragment>
    );
  }

  if (ancestry.includes(id)) {
    return (
      <React.Fragment key={id}>
        {LevNowElement({
          type: "cyclic-element",
          props: { id, path: [...ancestry, id].join(" > ") },
        })}
      </React.Fragment>
    );
  }

  const children = normalizeChildIds(element.children).map((childId) =>
    renderPacketElement(packet, childId, [...ancestry, id]),
  );

  return (
    <React.Fragment key={id}>
      {LevNowElement({
        type: element.type,
        variant: element.variant,
        props: normalizeElementProps(element),
        children: children.length > 0 ? children : undefined,
      })}
    </React.Fragment>
  );
}

function normalizeElementProps(
  element: LevNowRenderPacketElement,
): Record<string, unknown> {
  if (isRecord(element.props)) {
    return element.props;
  }

  const { type: _type, variant: _variant, props: _props, children: _children, ...rest } =
    element;
  return rest;
}

function normalizeChildIds(children: unknown): string[] {
  if (!Array.isArray(children)) {
    return [];
  }
  return children.filter((child): child is string => typeof child === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function stringAttribute(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
