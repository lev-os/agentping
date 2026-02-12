/**
 * Diff Template — Git Diff Viewer
 *
 * Renders structured diff hunks as polymorph primitives.
 * Composes Card, Badge, and TextBlock primitives for theme-aware rendering.
 */

import type { Template, PolymorphPrimitive } from '../types.js';
import * as P from '../primitives.js';

interface DiffLine {
  type: 'add' | 'del' | 'ctx';
  num: number;
  content: string;
}

interface DiffHunk {
  file: string;
  additions: number;
  deletions: number;
  lines: DiffLine[];
}

const MOCK_HUNKS: DiffHunk[] = [
  {
    file: 'src/scan.ts',
    additions: 12,
    deletions: 3,
    lines: [
      { type: 'ctx', num: 42, content: 'export function scanDocs(dir: string) {' },
      { type: 'del', num: 43, content: '  const files = readdirSync(dir);' },
      { type: 'add', num: 43, content: '  const files = readdirSync(dir, { recursive: true });' },
      { type: 'add', num: 44, content: '  const filtered = files.filter(f => f.endsWith(".md"));' },
      { type: 'ctx', num: 45, content: '  return files.map(f => ({' },
    ],
  },
  {
    file: 'tooling/pulse/src/cli.ts',
    additions: 8,
    deletions: 1,
    lines: [
      { type: 'ctx', num: 15, content: "switch (command) {" },
      { type: 'add', num: 16, content: "  case 'diff': {" },
      { type: 'add', num: 17, content: '    const hunks = parseDiff(ref);' },
      { type: 'add', num: 18, content: '    console.log(JSON.stringify(hunks, null, 2));' },
      { type: 'add', num: 19, content: '    break;' },
      { type: 'add', num: 20, content: '  }' },
      { type: 'ctx', num: 21, content: '  default:' },
      { type: 'del', num: 22, content: '    usage();' },
    ],
  },
];

function formatLine(line: DiffLine): string {
  const prefix = line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' ';
  return `${prefix} ${String(line.num).padStart(4)} \u2502 ${line.content}`;
}

export const diffTemplate: Template = {
  name: 'diff',
  description: 'Git diff viewer \u2014 renders structured diff hunks with additions and deletions',
  previewRenderer: (values) => {
    const hunks = (values.hunks as DiffHunk[]) ?? MOCK_HUNKS;
    const totalAdded = hunks.reduce((s, h) => s + h.additions, 0);
    const totalDeleted = hunks.reduce((s, h) => s + h.deletions, 0);

    const fileCards: PolymorphPrimitive[] = hunks.map((hunk) =>
      P.Card({
        title: hunk.file,
        children: [
          P.Badge({ text: `+${hunk.additions}`, variant: 'success' }),
          P.Badge({ text: `-${hunk.deletions}`, variant: 'warning' }),
          ...hunk.lines.map((line) =>
            P.TextBlock({
              content: formatLine(line),
              variant: 'code',
              size: 'sm',
            }),
          ),
        ],
      }),
    );

    return [
      P.Card({
        title: '> diff',
        subtitle: `${hunks.length} file${hunks.length !== 1 ? 's' : ''} changed`,
        children: [
          P.MetricValue({ label: 'Additions', value: `+${totalAdded}`, trend: 'up' }),
          P.MetricValue({ label: 'Deletions', value: `-${totalDeleted}`, trend: 'down' }),
        ],
      }),
      ...fileCards,
    ];
  },
};
