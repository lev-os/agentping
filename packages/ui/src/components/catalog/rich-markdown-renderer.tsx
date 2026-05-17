"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RichMarkdownRendererProps {
  content: string;
  className?: string;
}

interface MdNode {
  type: "h1" | "h2" | "h3" | "h4" | "blockquote" | "code-block" | "ul" | "ol" | "p" | "hr";
  content: string;
  lang?: string;
  items?: string[];
}

function parseBlocks(md: string): MdNode[] {
  const lines = md.split("\n");
  const blocks: MdNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code-block", content: codeLines.join("\n"), lang });
      i++;
      continue;
    }

    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", content: line.slice(5) });
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", content: line.slice(4) });
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", content: line.slice(3) });
    } else if (line.startsWith("# ")) {
      blocks.push({ type: "h1", content: line.slice(2) });
    } else if (line.startsWith("> ")) {
      const quoteLines = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("> ")) {
        i++;
        quoteLines.push(lines[i].slice(2));
      }
      blocks.push({ type: "blockquote", content: quoteLines.join("\n") });
    } else if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "hr", content: "" });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items = [line.slice(2)];
      while (i + 1 < lines.length && (lines[i + 1].startsWith("- ") || lines[i + 1].startsWith("* "))) {
        i++;
        items.push(lines[i].slice(2));
      }
      blocks.push({ type: "ul", content: "", items });
    } else if (/^\d+\.\s/.test(line)) {
      const items = [line.replace(/^\d+\.\s/, "")];
      while (i + 1 < lines.length && /^\d+\.\s/.test(lines[i + 1])) {
        i++;
        items.push(lines[i].replace(/^\d+\.\s/, ""));
      }
      blocks.push({ type: "ol", content: "", items });
    } else if (line.trim()) {
      blocks.push({ type: "p", content: line });
    }

    i++;
  }
  return blocks;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++} className="text-gray-100 font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++} className="text-cyan-300 italic">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(<code key={key++} className="px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[11px]">{match[4]}</code>);
    } else if (match[5] && match[6]) {
      parts.push(<a key={key++} href={match[6]} className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300" target="_blank" rel="noopener noreferrer">{match[5]}</a>);
    }
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

/**
 * RichMarkdownRenderer - Full markdown renderer (no external deps)
 * @source packages/adapters/web-ui/src/components/RichMarkdownRenderer.tsx
 * @catalog-status implemented
 */
export function RichMarkdownRenderer({ content, className }: RichMarkdownRendererProps) {
  const blocks = React.useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-5 font-mono", className)}>
      <div className="space-y-3">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "h1":
              return <h1 key={i} className="text-xl font-bold text-gray-100 border-b border-cyan-500/10 pb-2">{renderInline(block.content)}</h1>;
            case "h2":
              return <h2 key={i} className="text-lg font-bold text-gray-200">{renderInline(block.content)}</h2>;
            case "h3":
              return <h3 key={i} className="text-sm font-bold text-gray-200">{renderInline(block.content)}</h3>;
            case "h4":
              return <h4 key={i} className="text-xs font-bold text-gray-300 uppercase tracking-wider">{renderInline(block.content)}</h4>;
            case "blockquote":
              return (
                <blockquote key={i} className="border-l-2 border-cyan-500/30 pl-3 text-xs text-cyan-300/70 italic">
                  {renderInline(block.content)}
                </blockquote>
              );
            case "code-block":
              return (
                <div key={i} className="rounded bg-black/80 border border-cyan-500/10 overflow-x-auto">
                  {block.lang && (
                    <div className="px-3 py-1 border-b border-cyan-500/5 text-[9px] text-cyan-500/40 uppercase">{block.lang}</div>
                  )}
                  <pre className="p-3 text-xs text-green-300 leading-5 whitespace-pre">{block.content}</pre>
                </div>
              );
            case "ul":
              return (
                <ul key={i} className="space-y-1 pl-4">
                  {block.items?.map((item, j) => (
                    <li key={j} className="text-xs text-gray-300 before:content-['_'] before:text-cyan-500/40 before:mr-1.5 before:font-bold list-none">
                      <span className="before:content-['▸'] before:text-cyan-500/40 before:mr-1">{renderInline(item)}</span>
                    </li>
                  ))}
                </ul>
              );
            case "ol":
              return (
                <ol key={i} className="space-y-1 pl-4">
                  {block.items?.map((item, j) => (
                    <li key={j} className="text-xs text-gray-300 list-none">
                      <span className="text-cyan-500/50 mr-1.5">{j + 1}.</span>
                      {renderInline(item)}
                    </li>
                  ))}
                </ol>
              );
            case "hr":
              return <hr key={i} className="border-cyan-500/10" />;
            case "p":
              return <p key={i} className="text-xs text-gray-300 leading-5">{renderInline(block.content)}</p>;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
