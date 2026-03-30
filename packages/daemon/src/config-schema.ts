/**
 * AgentPing Configuration Schema
 *
 * Zod schema for validating and typing configuration files.
 * Supports YAML and JSON config formats.
 */

import { z } from 'zod';

// ============================================================================
// Notification Styles
// ============================================================================

export const NotificationStyleSchema = z.enum(['modal', 'drawer', 'toast']);
export type NotificationStyle = z.infer<typeof NotificationStyleSchema>;

export const NotificationPositionSchema = z.enum(['left', 'right', 'center']);
export type NotificationPosition = z.infer<typeof NotificationPositionSchema>;

// ============================================================================
// Theme Modes
// ============================================================================

export const ThemeModeSchema = z.enum(['light', 'dark', 'system']);
export type ThemeMode = z.infer<typeof ThemeModeSchema>;

// ============================================================================
// Logging Levels
// ============================================================================

export const LogLevelSchema = z.enum(['debug', 'info', 'warn', 'error']);
export type LogLevel = z.infer<typeof LogLevelSchema>;

// ============================================================================
// Webhook Config
// ============================================================================

export const WebhookConfigSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()),
  secret: z.string().optional(),
  filters: z.object({
    types: z.array(z.string()).optional(),
    agents: z.array(z.string()).optional(),
  }).optional(),
});

export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;

// ============================================================================
// Full Config Schema
// ============================================================================

export const AgentPingConfigSchema = z.object({
  // Server
  port: z.number().int().min(1).max(65535).default(7890),

  // Database
  database: z.object({
    path: z.string().default('~/.local/share/agentping/agentping.db'),
  }).default({}),

  // Web UI
  webui: z.object({
    enabled: z.boolean().default(true),
    port: z.number().int().min(1).max(65535).default(7891),
  }).default({}),

  // Notification Settings (Extension)
  notification: z.object({
    style: NotificationStyleSchema.default('modal'),
    position: NotificationPositionSchema.default('right'),
    maxStack: z.number().int().min(1).max(20).default(5),
    soundEnabled: z.boolean().default(true),
    soundVolume: z.number().min(0).max(1).default(0.15),
  }).default({}),

  // Theme Settings (Extension)
  theme: z.object({
    mode: ThemeModeSchema.default('system'),
  }).default({}),

  // Lease Settings
  lease: z.object({
    defaultTtlMinutes: z.number().int().min(1).max(10080).default(5),
    maxTtlMinutes: z.number().int().min(1).max(10080).default(10080),
    requireReason: z.boolean().default(true),
  }).default({}),

  // Slack Integration
  slack: z.object({
    enabled: z.boolean().default(false),
    botToken: z.string().optional(),
    channels: z.record(z.string()).optional(),
  }).default({}),

  // Webhooks
  webhooks: z.array(WebhookConfigSchema).default([]),

  // Parsers
  parsers: z.array(z.string()).default([]),

  // CORS
  cors: z.object({
    origins: z.array(z.string()).default(['*']),
  }).default({}),

  // Logging
  logging: z.object({
    enabled: z.boolean().default(true),
    level: LogLevelSchema.default('info'),
  }).default({}),
});

export type AgentPingConfig = z.infer<typeof AgentPingConfigSchema>;

// ============================================================================
// Config Defaults
// ============================================================================

export const DEFAULT_CONFIG: AgentPingConfig = AgentPingConfigSchema.parse({});

// ============================================================================
// Partial Config (for merging)
// ============================================================================

export const PartialConfigSchema = AgentPingConfigSchema.deepPartial();
export type PartialConfig = z.infer<typeof PartialConfigSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate and parse a config object
 */
export function parseConfig(raw: unknown): AgentPingConfig {
  return AgentPingConfigSchema.parse(raw);
}

/**
 * Safely parse config, returning defaults on error
 */
export function safeParseConfig(raw: unknown): AgentPingConfig {
  const result = AgentPingConfigSchema.safeParse(raw);
  if (result.success) {
    return result.data;
  }
  console.warn('[Config] Validation errors, using defaults:', result.error.format());
  return DEFAULT_CONFIG;
}

/**
 * Deep merge two config objects
 */
export function mergeConfigs(base: AgentPingConfig, override: PartialConfig): AgentPingConfig {
  return AgentPingConfigSchema.parse(deepMerge(base, override));
}

/**
 * Deep merge utility
 */
function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };

  for (const key of Object.keys(override) as (keyof T)[]) {
    const overrideValue = override[key];
    const baseValue = base[key];

    if (
      overrideValue !== undefined &&
      typeof overrideValue === 'object' &&
      overrideValue !== null &&
      !Array.isArray(overrideValue) &&
      typeof baseValue === 'object' &&
      baseValue !== null &&
      !Array.isArray(baseValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>,
      ) as T[keyof T];
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue as T[keyof T];
    }
  }

  return result;
}
