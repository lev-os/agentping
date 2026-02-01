/**
 * Dashboard Configuration Validator
 *
 * Validates dashboard configs against the JSON schema
 */

import type { DashboardConfig } from './types.js';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a single dashboard configuration
 */
export function validateDashboardConfig(config: Partial<DashboardConfig>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!config.name || config.name.trim() === '') {
    errors.push({ field: 'name', message: 'name is required and must not be empty' });
  }

  if (!config.id || config.id.trim() === '') {
    errors.push({ field: 'id', message: 'id is required and must not be empty' });
  } else if (!/^[a-z0-9-]+$/.test(config.id)) {
    errors.push({ field: 'id', message: 'id must only contain lowercase letters, numbers, and hyphens' });
  }

  if (config.port === undefined) {
    errors.push({ field: 'port', message: 'port is required' });
  } else if (config.port < 1024 || config.port > 65535) {
    errors.push({ field: 'port', message: 'port must be between 1024 and 65535' });
  }

  if (!config.port_range || !Array.isArray(config.port_range) || config.port_range.length !== 2) {
    errors.push({ field: 'port_range', message: 'port_range must be an array of exactly 2 numbers' });
  } else {
    const [start, end] = config.port_range;
    if (start < 1024 || start > 65535) {
      errors.push({ field: 'port_range', message: 'port_range start must be between 1024 and 65535' });
    }
    if (end < 1024 || end > 65535) {
      errors.push({ field: 'port_range', message: 'port_range end must be between 1024 and 65535' });
    }
    if (start > end) {
      errors.push({ field: 'port_range', message: 'port_range start must be less than or equal to end' });
    }
  }

  if (!config.command || config.command.trim() === '') {
    errors.push({ field: 'command', message: 'command is required and must not be empty' });
  }

  if (!config.cwd || config.cwd.trim() === '') {
    errors.push({ field: 'cwd', message: 'cwd is required and must not be empty' });
  }

  // Optional fields validation
  if (config.health_check) {
    const hc = config.health_check;

    if (!['http', 'process'].includes(hc.type)) {
      errors.push({ field: 'health_check.type', message: 'health_check.type must be "http" or "process"' });
    }

    if (hc.type === 'http' && !hc.path) {
      errors.push({ field: 'health_check.path', message: 'health_check.path is required for http health checks' });
    }

    if (hc.timeout_ms !== undefined && hc.timeout_ms < 100) {
      errors.push({ field: 'health_check.timeout_ms', message: 'health_check.timeout_ms must be at least 100' });
    }

    if (hc.expected_status !== undefined) {
      const statuses = Array.isArray(hc.expected_status) ? hc.expected_status : [hc.expected_status];
      for (const status of statuses) {
        if (status < 100 || status > 599) {
          errors.push({ field: 'health_check.expected_status', message: 'HTTP status codes must be between 100 and 599' });
          break;
        }
      }
    }

    if (hc.interval_ms !== undefined && hc.interval_ms < 1000) {
      errors.push({ field: 'health_check.interval_ms', message: 'health_check.interval_ms must be at least 1000' });
    }
  }

  if (config.restart_policy) {
    const rp = config.restart_policy;

    if (typeof rp.enabled !== 'boolean') {
      errors.push({ field: 'restart_policy.enabled', message: 'restart_policy.enabled must be a boolean' });
    }

    if (rp.max_retries === undefined) {
      errors.push({ field: 'restart_policy.max_retries', message: 'restart_policy.max_retries is required' });
    } else if (rp.max_retries < 0) {
      errors.push({ field: 'restart_policy.max_retries', message: 'restart_policy.max_retries must be at least 0' });
    }

    if (!rp.backoff_ms || !Array.isArray(rp.backoff_ms) || rp.backoff_ms.length === 0) {
      errors.push({ field: 'restart_policy.backoff_ms', message: 'restart_policy.backoff_ms must be a non-empty array' });
    } else {
      for (const backoff of rp.backoff_ms) {
        if (backoff < 0) {
          errors.push({ field: 'restart_policy.backoff_ms', message: 'backoff delays must be non-negative' });
          break;
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate dashboards.yaml config structure
 */
export function validateDashboardsConfig(config: { dashboards?: unknown }): ValidationResult {
  const errors: ValidationError[] = [];

  if (!config.dashboards) {
    errors.push({ field: 'dashboards', message: 'dashboards field is required' });
    return { valid: false, errors };
  }

  if (!Array.isArray(config.dashboards)) {
    errors.push({ field: 'dashboards', message: 'dashboards must be an array' });
    return { valid: false, errors };
  }

  // Validate each dashboard
  for (let i = 0; i < config.dashboards.length; i++) {
    const dashboardResult = validateDashboardConfig(config.dashboards[i] as Partial<DashboardConfig>);
    for (const error of dashboardResult.errors) {
      errors.push({
        field: `dashboards[${i}].${error.field}`,
        message: error.message,
      });
    }
  }

  // Check for duplicate IDs
  const ids = new Set<string>();
  for (let i = 0; i < config.dashboards.length; i++) {
    const dashboard = config.dashboards[i] as Partial<DashboardConfig>;
    if (dashboard.id) {
      if (ids.has(dashboard.id)) {
        errors.push({
          field: `dashboards[${i}].id`,
          message: `Duplicate dashboard ID: ${dashboard.id}`,
        });
      }
      ids.add(dashboard.id);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
