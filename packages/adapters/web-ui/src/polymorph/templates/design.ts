/**
 * Design Template — Visual Style Explorer
 *
 * Renders all 12 primitives in a showcase layout for design review.
 */

import type { Template, PolymorphPrimitive } from '../types.js';
import * as P from '../primitives.js';

export const designTemplate: Template = {
  name: 'design',
  description: 'Visual style explorer — showcases all 12 polymorph primitives',
  previewRenderer: (values) => {
    const topic = (values.topic as string) ?? 'Component Library';
    const primitives: PolymorphPrimitive[] = [];

    // Status indicators
    primitives.push(P.Card({
      title: 'Status Indicators',
      subtitle: topic,
      children: [
        P.StatusDot({ status: 'online', label: 'Connected' }),
        P.StatusDot({ status: 'busy', label: 'Processing' }),
        P.StatusDot({ status: 'away', label: 'Idle' }),
        P.StatusDot({ status: 'offline', label: 'Disconnected' }),
      ],
    }));

    // Badges
    primitives.push(P.Card({
      title: 'Badges',
      children: [
        P.Badge({ text: 'Active', variant: 'success' }),
        P.Badge({ text: 'Warning', variant: 'warning' }),
        P.Badge({ text: 'Error', variant: 'error' }),
        P.Badge({ text: 'Info', variant: 'info' }),
        P.Badge({ text: 'Default' }),
      ],
    }));

    // Buttons
    primitives.push(P.Card({
      title: 'Buttons',
      children: [
        P.Button({ text: 'Primary', variant: 'primary' }),
        P.Button({ text: 'Secondary', variant: 'secondary' }),
        P.Button({ text: 'Ghost', variant: 'ghost' }),
        P.Button({ text: 'Danger', variant: 'danger' }),
        P.Button({ text: 'Disabled', variant: 'primary', disabled: true }),
      ],
    }));

    // Typography
    primitives.push(P.Card({
      title: 'Typography',
      children: [
        P.TextBlock({ content: 'Heading Text', variant: 'heading' }),
        P.TextBlock({ content: 'Body text for readable paragraphs.', variant: 'body' }),
        P.TextBlock({ content: 'Caption for secondary info', variant: 'caption' }),
        P.TextBlock({ content: 'const code = "inline"', variant: 'code' }),
      ],
    }));

    // Inputs
    primitives.push(P.Card({
      title: 'Input Fields',
      children: [
        P.InputField({ label: 'Agent Name', placeholder: 'Enter name...', type: 'text' }),
        P.InputField({ label: 'Email', placeholder: 'agent@system.ai', type: 'email' }),
      ],
    }));

    // Progress
    primitives.push(P.Card({
      title: 'Progress Bars',
      children: [
        P.ProgressBar({ value: 75, label: 'Task Completion', variant: 'success' }),
        P.ProgressBar({ value: 45, label: 'Memory Usage', variant: 'warning' }),
        P.ProgressBar({ value: 90, label: 'Error Rate', variant: 'error' }),
      ],
    }));

    // Checklist
    primitives.push(P.Card({
      title: 'Checklist',
      children: [
        P.CheckItem({ text: 'Initialize workspace', checked: true }),
        P.CheckItem({ text: 'Run validation suite', checked: true }),
        P.CheckItem({ text: 'Deploy to staging', checked: false }),
        P.CheckItem({ text: 'Manual review', checked: false, disabled: true }),
      ],
    }));

    // Metrics
    primitives.push(P.Card({
      title: 'Metrics',
      children: [
        P.MetricValue({ label: 'Uptime', value: '99.97', unit: '%', trend: 'up' }),
        P.MetricValue({ label: 'Latency', value: '42', unit: 'ms', trend: 'down' }),
        P.MetricValue({ label: 'Throughput', value: '1.2k', unit: 'req/s', trend: 'flat' }),
      ],
    }));

    // Navigation
    primitives.push(P.Card({
      title: 'Navigation',
      children: [
        P.NavItem({ text: 'Dashboard', icon: '◉', active: true, badge: '3' }),
        P.NavItem({ text: 'Agents', icon: '◎' }),
        P.NavItem({ text: 'Settings', icon: '⚙' }),
      ],
    }));

    // Action Bar
    primitives.push(P.Card({
      title: 'Action Bar',
      children: [
        P.ActionBar({
          actions: [
            { text: 'Cancel', variant: 'ghost' },
            { text: 'Save Draft', variant: 'secondary' },
            { text: 'Deploy', variant: 'primary' },
          ],
          align: 'right',
        }),
      ],
    }));

    return primitives;
  },
};
