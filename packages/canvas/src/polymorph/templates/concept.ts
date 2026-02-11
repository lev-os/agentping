/**
 * Concept Template — Relationship Mapper
 *
 * Playground for mapping concepts, dependencies, and relationships.
 */

import type { Template, PolymorphPrimitive } from '../types.js';
import * as P from '../primitives.js';

export const conceptTemplate: Template = {
  name: 'concept',
  description: 'Relationship mapper — explore concepts, dependencies, and connections',
  previewRenderer: (values) => {
    const topic = (values.topic as string) ?? 'Concept Map';
    const primitives: PolymorphPrimitive[] = [];

    // Overview
    primitives.push(P.Card({
      title: topic,
      subtitle: 'Interactive concept exploration',
      children: [
        P.TextBlock({ content: 'Map relationships between concepts, identify dependencies, and explore connections.', variant: 'body' }),
        P.Badge({ text: '6 nodes', variant: 'info' }),
        P.Badge({ text: '8 edges', variant: 'default' }),
      ],
    }));

    // Core concepts
    primitives.push(P.Card({
      title: 'Core Concepts',
      children: [
        P.NavItem({ text: 'Agent Runtime', icon: '◉', active: true, badge: '4 deps' }),
        P.NavItem({ text: 'Event Bus', icon: '◎', badge: '3 deps' }),
        P.NavItem({ text: 'Config Resolver', icon: '◎', badge: '2 deps' }),
        P.NavItem({ text: 'Plugin System', icon: '◎', badge: '5 deps' }),
      ],
    }));

    // Selected concept detail
    primitives.push(P.Card({
      title: 'Agent Runtime',
      subtitle: 'Core execution engine',
      children: [
        P.TextBlock({ content: 'Manages agent lifecycle, task execution, and resource allocation.', variant: 'body' }),
        P.TextBlock({ content: 'Dependencies', variant: 'heading', size: 'sm' }),
        P.CheckItem({ text: 'Event Bus → Message routing', checked: true }),
        P.CheckItem({ text: 'Config Resolver → Settings', checked: true }),
        P.CheckItem({ text: 'Plugin System → Extensions', checked: true }),
        P.CheckItem({ text: 'Metrics Collector → Telemetry', checked: false }),
        P.TextBlock({ content: 'Properties', variant: 'heading', size: 'sm' }),
        P.MetricValue({ label: 'Complexity', value: 'High', trend: 'up' }),
        P.MetricValue({ label: 'Stability', value: '94', unit: '%', trend: 'flat' }),
      ],
    }));

    // Actions
    primitives.push(P.Card({
      title: 'Actions',
      children: [
        P.ActionBar({
          actions: [
            { text: 'Add Node', variant: 'secondary' },
            { text: 'Add Edge', variant: 'secondary' },
            { text: 'Export Graph', variant: 'primary' },
          ],
          align: 'left',
        }),
      ],
    }));

    return primitives;
  },
};
