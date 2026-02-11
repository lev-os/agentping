import type { ElementType } from 'react';

export interface ActionMetadata {
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
}

export interface ActionDescriptor<T = unknown> {
  type: string;
  label: string;
  callback: (payload?: T) => void | Promise<void>;
  analytics: ActionMetadata;
  ariaLabel: string;
  icon?: ElementType;
  disabled?: boolean;
  shortcut?: string;
}

