/**
 * Polymorph Primitive Factories
 *
 * 12 universal components that render to any target (HTML, Pencil, React).
 */

import type { PolymorphPrimitive, PrimitiveKind } from './types.js';

let counter = 0;
function uid(kind: PrimitiveKind): string {
  return `${kind}-${++counter}`;
}

/** Reset ID counter (useful for deterministic tests). */
export function resetIds(): void {
  counter = 0;
}

export function StatusDot(props: {
  status: 'online' | 'offline' | 'busy' | 'away';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive {
  return { kind: 'status-dot', id: uid('status-dot'), label: props.label, props };
}

export function Badge(props: {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive {
  return { kind: 'badge', id: uid('badge'), label: props.text, props };
}

export function Button(props: {
  text: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}): PolymorphPrimitive {
  return { kind: 'button', id: uid('button'), label: props.text, props };
}

export function TextBlock(props: {
  content: string;
  variant?: 'heading' | 'body' | 'caption' | 'code';
  size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive {
  return { kind: 'text-block', id: uid('text-block'), label: props.content, props };
}

export function InputField(props: {
  placeholder?: string;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  value?: string;
  size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive {
  return { kind: 'input-field', id: uid('input-field'), label: props.label, props };
}

export function ProgressBar(props: {
  value: number;
  max?: number;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive {
  return { kind: 'progress-bar', id: uid('progress-bar'), label: props.label, props };
}

export function CheckItem(props: {
  text: string;
  checked?: boolean;
  disabled?: boolean;
}): PolymorphPrimitive {
  return { kind: 'check-item', id: uid('check-item'), label: props.text, props };
}

export function MetricValue(props: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  size?: 'sm' | 'md' | 'lg';
}): PolymorphPrimitive {
  return { kind: 'metric-value', id: uid('metric-value'), label: props.label, props };
}

export function ListItem(props: {
  text: string;
  secondary?: string;
  icon?: string;
  active?: boolean;
}): PolymorphPrimitive {
  return { kind: 'list-item', id: uid('list-item'), label: props.text, props };
}

export function Card(props: {
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: PolymorphPrimitive[];
}): PolymorphPrimitive {
  return {
    kind: 'card',
    id: uid('card'),
    label: props.title,
    props,
    children: props.children,
  };
}

export function NavItem(props: {
  text: string;
  icon?: string;
  active?: boolean;
  badge?: string;
}): PolymorphPrimitive {
  return { kind: 'nav-item', id: uid('nav-item'), label: props.text, props };
}

export function ActionBar(props: {
  actions: Array<{ text: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }>;
  align?: 'left' | 'center' | 'right';
}): PolymorphPrimitive {
  return {
    kind: 'action-bar',
    id: uid('action-bar'),
    props,
    children: props.actions.map((a) => Button({ text: a.text, variant: a.variant })),
  };
}

/** All primitive factories indexed by kind. */
export const PRIMITIVE_MAP: Record<PrimitiveKind, (...args: any[]) => PolymorphPrimitive> = {
  'status-dot': StatusDot,
  badge: Badge,
  button: Button,
  'text-block': TextBlock,
  'input-field': InputField,
  'progress-bar': ProgressBar,
  'check-item': CheckItem,
  'metric-value': MetricValue,
  'list-item': ListItem,
  card: Card,
  'nav-item': NavItem,
  'action-bar': ActionBar,
};
