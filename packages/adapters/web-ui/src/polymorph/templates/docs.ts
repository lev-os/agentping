/**
 * Docs Template — Documentation Explorer
 *
 * Renders a documentation index as an interactive polymorph playground.
 * Designed to process docs/ folder contents into navigable cards.
 */

import type { Template, PolymorphPrimitive } from '../types.js';
import * as P from '../primitives.js';

export const docsTemplate: Template = {
  name: 'docs' as any,
  description: 'Documentation explorer — browse, review, and process doc collections',
  previewRenderer: (values) => {
    const topic = (values.topic as string) ?? 'Documentation';
    const docs = (values.docs as Array<{ title: string; path: string; status: string; words?: number; summary?: string }>) ?? [];
    const inbox = (values.inbox as Array<{ title: string; path: string; status: string; words?: number; summary?: string }>) ?? [];
    const primitives: PolymorphPrimitive[] = [];

    // Header
    primitives.push(P.Card({
      title: topic,
      subtitle: `${docs.length + inbox.length} documents · ${inbox.length} inbox items`,
      children: [
        P.MetricValue({ label: 'Canonical Docs', value: String(docs.length), trend: 'flat' }),
        P.MetricValue({ label: 'Inbox Items', value: String(inbox.length), trend: inbox.length > 5 ? 'up' : 'flat' }),
        P.MetricValue({ label: 'Review Coverage', value: docs.length > 0 ? Math.round((docs.filter(d => d.status === 'reviewed').length / docs.length) * 100).toString() : '0', unit: '%', trend: 'up' }),
      ],
    }));

    // Canonical docs
    if (docs.length > 0) {
      primitives.push(P.Card({
        title: 'Canonical Documentation',
        subtitle: 'Primary reference documents',
        children: docs.map(d => P.ListItem({
          text: d.title,
          secondary: `${d.words ? d.words + ' words' : d.path} · ${d.status}`,
          icon: d.status === 'reviewed' ? '✓' : '◎',
          active: d.status === 'reviewed',
        })),
      }));
    }

    // Inbox
    if (inbox.length > 0) {
      primitives.push(P.Card({
        title: 'Inbox — Pending Review',
        subtitle: `${inbox.length} items to process`,
        children: [
          ...inbox.map(d => P.ListItem({
            text: d.title,
            secondary: d.summary ?? d.path,
            icon: d.status === 'merged' ? '✓' : d.status === 'draft' ? '◉' : '○',
            active: d.status === 'draft',
          })),
          P.ProgressBar({
            value: inbox.filter(i => i.status === 'merged').length,
            max: inbox.length,
            label: 'Inbox Processing',
            variant: 'success',
          }),
        ],
      }));
    }

    // Sections breakdown
    primitives.push(P.Card({
      title: 'Documentation Sections',
      children: [
        P.NavItem({ text: 'Architecture', icon: '◉', active: true, badge: '1' }),
        P.NavItem({ text: 'Concepts', icon: '◎', badge: '4' }),
        P.NavItem({ text: 'Integration', icon: '◎', badge: '3' }),
        P.NavItem({ text: 'Design System', icon: '◎', badge: '3' }),
        P.NavItem({ text: 'Reviews', icon: '◎', badge: '1' }),
        P.NavItem({ text: 'Drafts', icon: '◎', badge: '2' }),
      ],
    }));

    // Review checklist
    primitives.push(P.Card({
      title: 'Inbox Review Checklist',
      children: [
        P.CheckItem({ text: '00-vision.md → Merged into 01-architecture', checked: true }),
        P.CheckItem({ text: '01-entity-lifecycle → Cleanup guidance', checked: false }),
        P.CheckItem({ text: '02-views-are-bd-queries → Template patterns', checked: false }),
        P.CheckItem({ text: '03-bd-already-has-gates → Integration points', checked: false }),
        P.CheckItem({ text: '04-vernacular → Clean state machine names', checked: false }),
        P.CheckItem({ text: '05-primitives-from-conversation → Graph schema', checked: false }),
        P.CheckItem({ text: '06-specs-created → Specs awaiting review', checked: false }),
        P.CheckItem({ text: '07-bd-fields-and-templates → BD CLI reference', checked: false }),
        P.CheckItem({ text: '08-deploy-adapter-conformance → Contract matrix', checked: false }),
        P.CheckItem({ text: '08-next-actions → Action items', checked: false }),
        P.CheckItem({ text: 'graph-foundation-review → 7 TODOs (70/100)', checked: false }),
      ],
    }));

    // Actions
    primitives.push(P.Card({
      title: 'Actions',
      children: [
        P.ActionBar({
          actions: [
            { text: 'Process Inbox', variant: 'primary' },
            { text: 'Generate Index', variant: 'secondary' },
            { text: 'Export Report', variant: 'ghost' },
          ],
          align: 'right',
        }),
      ],
    }));

    return primitives;
  },
};
