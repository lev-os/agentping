/**
 * Dashboard Logger
 *
 * Structured logging with automatic rotation
 */

import { existsSync, appendFileSync, mkdirSync, statSync, renameSync } from 'fs';
import { join } from 'path';

export interface LoggerConfig {
  logDir: string;
  maxFileSize?: number;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  dashboardId?: string;
  [key: string]: any;
}

export class DashboardLogger {
  private logDir: string;
  private maxFileSize: number;

  constructor(config: LoggerConfig) {
    this.logDir = config.logDir;
    this.maxFileSize = config.maxFileSize || 10 * 1024 * 1024; // 10MB default

    // Create log directory
    mkdirSync(this.logDir, { recursive: true });
  }

  /**
   * Log a message
   */
  log(level: string, message: string, meta?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    };

    const logFile = meta?.dashboardId
      ? join(this.logDir, `${meta.dashboardId}.log`)
      : join(this.logDir, 'runner.log');

    this.append(logFile, JSON.stringify(entry) + '\n');
    this.rotateIfNeeded(logFile);

    // Also log to console
    const prefix = meta?.dashboardId ? `[${meta.dashboardId}]` : '[runner]';
    console.log(`${prefix} ${level.toUpperCase()}: ${message}`);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: Record<string, any>): void {
    this.log('info', message, meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: Record<string, any>): void {
    this.log('warn', message, meta);
  }

  /**
   * Log error message
   */
  error(message: string, meta?: Record<string, any>): void {
    this.log('error', message, meta);
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: Record<string, any>): void {
    this.log('debug', message, meta);
  }

  /**
   * Append to log file
   */
  private append(logFile: string, content: string): void {
    try {
      appendFileSync(logFile, content, 'utf-8');
    } catch (err) {
      console.error(`Failed to append to log file: ${err}`);
    }
  }

  /**
   * Rotate log file if it exceeds max size
   */
  private rotateIfNeeded(logFile: string): void {
    if (!existsSync(logFile)) return;

    try {
      const stats = statSync(logFile);
      if (stats.size > this.maxFileSize) {
        const timestamp = new Date().toISOString().split('T')[0];
        const rotatedFile = `${logFile}.${timestamp}`;
        renameSync(logFile, rotatedFile);
        console.log(`[Logger] Rotated log file: ${logFile} -> ${rotatedFile}`);
      }
    } catch (err) {
      console.error(`Failed to rotate log file: ${err}`);
    }
  }
}
