import { describe, it, expect, beforeEach } from 'vitest';
import {
  StatusDot, Badge, Button, TextBlock, InputField, ProgressBar,
  CheckItem, MetricValue, ListItem, Card, NavItem, ActionBar,
  resetIds, PRIMITIVE_MAP,
  renderToHTML, renderToPencil, renderToReact,
  THEMES, getThemeTokens,
  templates,
} from '../index.js';
import type { PolymorphPrimitive, ThemeTokens, TemplateName, ReactCatalogEntry } from '../index.js';

beforeEach(() => {
  resetIds();
});

// ---------------------------------------------------------------------------
// 1. Primitive factories
// ---------------------------------------------------------------------------
describe('Primitive factories', () => {
  const cases: Array<{
    name: string;
    factory: () => PolymorphPrimitive;
    kind: string;
    label: string | undefined;
  }> = [
    { name: 'StatusDot', factory: () => StatusDot({ status: 'online', label: 'Up' }), kind: 'status-dot', label: 'Up' },
    { name: 'Badge', factory: () => Badge({ text: 'OK' }), kind: 'badge', label: 'OK' },
    { name: 'Button', factory: () => Button({ text: 'Click' }), kind: 'button', label: 'Click' },
    { name: 'TextBlock', factory: () => TextBlock({ content: 'Hello' }), kind: 'text-block', label: 'Hello' },
    { name: 'InputField', factory: () => InputField({ label: 'Name' }), kind: 'input-field', label: 'Name' },
    { name: 'ProgressBar', factory: () => ProgressBar({ value: 50, label: 'Half' }), kind: 'progress-bar', label: 'Half' },
    { name: 'CheckItem', factory: () => CheckItem({ text: 'Done' }), kind: 'check-item', label: 'Done' },
    { name: 'MetricValue', factory: () => MetricValue({ label: 'CPU', value: 42 }), kind: 'metric-value', label: 'CPU' },
    { name: 'ListItem', factory: () => ListItem({ text: 'Item' }), kind: 'list-item', label: 'Item' },
    { name: 'Card', factory: () => Card({ title: 'Box' }), kind: 'card', label: 'Box' },
    { name: 'NavItem', factory: () => NavItem({ text: 'Home' }), kind: 'nav-item', label: 'Home' },
    { name: 'ActionBar', factory: () => ActionBar({ actions: [{ text: 'Go' }] }), kind: 'action-bar', label: undefined },
  ];

  for (const { name, factory, kind, label } of cases) {
    it(`${name} returns correct kind "${kind}"`, () => {
      const p = factory();
      expect(p.kind).toBe(kind);
    });

    it(`${name} has an id`, () => {
      const p = factory();
      expect(p.id).toBeTruthy();
      expect(typeof p.id).toBe('string');
    });

    it(`${name} label matches expected value`, () => {
      const p = factory();
      expect(p.label).toBe(label);
    });
  }
});

// ---------------------------------------------------------------------------
// 2. resetIds
// ---------------------------------------------------------------------------
describe('resetIds', () => {
  it('resets the counter so IDs are deterministic', () => {
    const a = Button({ text: 'A' });
    const b = Button({ text: 'B' });
    expect(a.id).toBe('button-1');
    expect(b.id).toBe('button-2');

    resetIds();

    const c = Button({ text: 'C' });
    expect(c.id).toBe('button-1');
  });
});

// ---------------------------------------------------------------------------
// 3. PRIMITIVE_MAP
// ---------------------------------------------------------------------------
describe('PRIMITIVE_MAP', () => {
  const expectedKinds = [
    'status-dot', 'badge', 'button', 'text-block', 'input-field',
    'progress-bar', 'check-item', 'metric-value', 'list-item',
    'card', 'nav-item', 'action-bar',
  ] as const;

  it('has all 12 entries', () => {
    expect(Object.keys(PRIMITIVE_MAP)).toHaveLength(12);
  });

  for (const kind of expectedKinds) {
    it(`contains "${kind}"`, () => {
      expect(PRIMITIVE_MAP[kind]).toBeTypeOf('function');
    });
  }
});

// ---------------------------------------------------------------------------
// 4. renderToHTML
// ---------------------------------------------------------------------------
describe('renderToHTML', () => {
  it('produces a string containing <!DOCTYPE html>', () => {
    const primitives = [Button({ text: 'Test' })];
    const html = renderToHTML(primitives, {
      template: 'design',
      topic: 'Unit Test',
      mode: 'html',
      theme: 'agentping',
      themeMode: 'dark',
    });
    expect(html).toContain('<!DOCTYPE html>');
  });

  it('includes theme colors in the output', () => {
    const primitives = [Badge({ text: 'Active', variant: 'success' })];
    const html = renderToHTML(primitives, {
      template: 'design',
      topic: 'Theme Test',
      mode: 'html',
      theme: 'skynet',
      themeMode: 'dark',
    });
    // Skynet bg
    expect(html).toContain(THEMES.skynet.dark.bg);
  });

  it('includes primitive content', () => {
    const primitives = [TextBlock({ content: 'UNIQUE_TEXT_MARKER' })];
    const html = renderToHTML(primitives, {
      template: 'design',
      topic: 'Content Test',
      mode: 'html',
      theme: 'syslog',
      themeMode: 'light',
    });
    expect(html).toContain('UNIQUE_TEXT_MARKER');
  });
});

// ---------------------------------------------------------------------------
// 5. renderToPencil
// ---------------------------------------------------------------------------
describe('renderToPencil', () => {
  it('returns an array of operation strings', () => {
    const primitives = [Button({ text: 'Go' }), Badge({ text: 'X' })];
    const ops = renderToPencil(primitives, '"root"', { theme: 'agentping', themeMode: 'dark' });
    expect(Array.isArray(ops)).toBe(true);
    expect(ops.length).toBeGreaterThan(0);
  });

  it('each operation starts with a binding assignment', () => {
    const primitives = [StatusDot({ status: 'online', label: 'Up' })];
    const ops = renderToPencil(primitives, '"parent"', { theme: 'skynet', themeMode: 'dark' });
    for (const op of ops) {
      expect(op).toMatch(/^[a-zA-Z_][a-zA-Z0-9_]*=/);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. renderToReact
// ---------------------------------------------------------------------------
describe('renderToReact', () => {
  it('returns an array of ReactCatalogEntry objects', () => {
    const primitives = [Button({ text: 'A' }), Badge({ text: 'B' })];
    const entries = renderToReact(primitives);
    expect(Array.isArray(entries)).toBe(true);
    expect(entries).toHaveLength(2);
  });

  it('each entry has kind, id, and props', () => {
    const primitives = [MetricValue({ label: 'CPU', value: 99, unit: '%' })];
    const entries = renderToReact(primitives);
    const entry = entries[0] as ReactCatalogEntry;
    expect(entry.kind).toBe('metric-value');
    expect(entry.id).toBeTruthy();
    expect(entry.props).toBeDefined();
  });

  it('preserves children in nested structures', () => {
    const card = Card({
      title: 'Container',
      children: [Button({ text: 'Inner' })],
    });
    const entries = renderToReact([card]);
    expect(entries[0].children).toHaveLength(1);
    expect(entries[0].children![0].kind).toBe('button');
  });
});

// ---------------------------------------------------------------------------
// 7. Templates
// ---------------------------------------------------------------------------
describe('Templates', () => {
  const templateNames: TemplateName[] = ['design', 'data', 'concept', 'critique'];

  for (const name of templateNames) {
    it(`"${name}" template exists`, () => {
      expect(templates[name]).toBeDefined();
      expect(templates[name].name).toBe(name);
    });

    it(`"${name}" previewRenderer returns non-empty array`, () => {
      resetIds();
      const result = templates[name].previewRenderer({ topic: 'Test' });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it(`"${name}" previewRenderer returns PolymorphPrimitive objects`, () => {
      resetIds();
      const result = templates[name].previewRenderer({ topic: 'Test' });
      for (const prim of result) {
        expect(prim.kind).toBeTruthy();
        expect(prim.id).toBeTruthy();
      }
    });
  }
});

// ---------------------------------------------------------------------------
// 8. THEMES
// ---------------------------------------------------------------------------
describe('THEMES', () => {
  const themeNames = ['agentping', 'skynet', 'syslog'] as const;
  const requiredKeys: (keyof ThemeTokens)[] = [
    'bg', 'surface', 'border', 'text', 'muted',
    'accent', 'warning', 'error', 'success', 'info', 'fontFamily',
  ];

  for (const name of themeNames) {
    it(`"${name}" theme exists`, () => {
      expect(THEMES[name]).toBeDefined();
    });

    for (const key of requiredKeys) {
      it(`"${name}" has token "${key}"`, () => {
        const dark = getThemeTokens(name, 'dark');
        const light = getThemeTokens(name, 'light');
        expect(dark[key]).toBeTruthy();
        expect(typeof dark[key]).toBe('string');
        expect(light[key]).toBeTruthy();
        expect(typeof light[key]).toBe('string');
      });
    }
  }
});

// ---------------------------------------------------------------------------
// 9. Card with children
// ---------------------------------------------------------------------------
describe('Card with children', () => {
  it('preserves children array', () => {
    const child1 = Button({ text: 'A' });
    const child2 = Badge({ text: 'B' });
    const card = Card({ title: 'Parent', children: [child1, child2] });

    expect(card.children).toBeDefined();
    expect(card.children).toHaveLength(2);
    expect(card.children![0].kind).toBe('button');
    expect(card.children![1].kind).toBe('badge');
  });

  it('Card without children has undefined children', () => {
    const card = Card({ title: 'Empty' });
    expect(card.children).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 10. ActionBar auto-generates Button children
// ---------------------------------------------------------------------------
describe('ActionBar', () => {
  it('auto-generates Button children from actions array', () => {
    const bar = ActionBar({
      actions: [
        { text: 'Cancel', variant: 'ghost' },
        { text: 'Save', variant: 'primary' },
      ],
    });

    expect(bar.children).toBeDefined();
    expect(bar.children).toHaveLength(2);
    expect(bar.children![0].kind).toBe('button');
    expect(bar.children![0].label).toBe('Cancel');
    expect(bar.children![1].kind).toBe('button');
    expect(bar.children![1].label).toBe('Save');
  });

  it('empty actions produces empty children', () => {
    const bar = ActionBar({ actions: [] });
    expect(bar.children).toHaveLength(0);
  });
});
