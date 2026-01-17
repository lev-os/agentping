/**
 * RichMarkdownRenderer - Render markdown with syntax-highlighted code blocks
 * Pure implementation without external markdown library
 */

import React, { useMemo } from 'react';
import './RichMarkdownRenderer.css';

interface RichMarkdownRendererProps {
    content: string;
    className?: string;
}

interface ParsedBlock {
    type: 'paragraph' | 'heading' | 'code' | 'list' | 'blockquote' | 'hr';
    content: string;
    level?: number; // For headings
    language?: string; // For code blocks
    items?: string[]; // For lists
}

export function RichMarkdownRenderer({ content, className }: RichMarkdownRendererProps) {
    const blocks = useMemo(() => parseMarkdown(content), [content]);

    return (
        <div className={`markdown-renderer ${className || ''}`}>
            {blocks.map((block, i) => renderBlock(block, i))}
        </div>
    );
}

function parseMarkdown(text: string): ParsedBlock[] {
    const lines = text.split('\n');
    const blocks: ParsedBlock[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Code block
        if (line.startsWith('```')) {
            const language = line.slice(3).trim();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            blocks.push({ type: 'code', content: codeLines.join('\n'), language });
            i++;
            continue;
        }

        // Heading
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            blocks.push({
                type: 'heading',
                level: headingMatch[1].length,
                content: headingMatch[2],
            });
            i++;
            continue;
        }

        // Horizontal rule
        if (/^(-{3,}|_{3,}|\*{3,})$/.test(line.trim())) {
            blocks.push({ type: 'hr', content: '' });
            i++;
            continue;
        }

        // Blockquote
        if (line.startsWith('> ')) {
            const quoteLines: string[] = [];
            while (i < lines.length && lines[i].startsWith('> ')) {
                quoteLines.push(lines[i].slice(2));
                i++;
            }
            blocks.push({ type: 'blockquote', content: quoteLines.join('\n') });
            continue;
        }

        // Unordered list
        if (/^[-*+]\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^[-*+]\s+/, ''));
                i++;
            }
            blocks.push({ type: 'list', content: '', items });
            continue;
        }

        // Ordered list
        if (/^\d+\.\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\d+\.\s+/, ''));
                i++;
            }
            blocks.push({ type: 'list', content: '', items });
            continue;
        }

        // Paragraph (collect until empty line)
        if (line.trim()) {
            const paraLines: string[] = [];
            while (i < lines.length && lines[i].trim() && !lines[i].startsWith('#') && !lines[i].startsWith('```')) {
                paraLines.push(lines[i]);
                i++;
            }
            blocks.push({ type: 'paragraph', content: paraLines.join(' ') });
            continue;
        }

        i++;
    }

    return blocks;
}

function renderBlock(block: ParsedBlock, key: number) {
    switch (block.type) {
        case 'heading': {
            const Tag = `h${block.level}` as React.ElementType;
            return <Tag key={key} className="md-heading">{renderInline(block.content)}</Tag>;
        }

        case 'code':
            return (
                <pre key={key} className="md-code-block" data-language={block.language}>
                    <code>{block.content}</code>
                </pre>
            );

        case 'blockquote':
            return (
                <blockquote key={key} className="md-blockquote">
                    {renderInline(block.content)}
                </blockquote>
            );

        case 'list':
            return (
                <ul key={key} className="md-list">
                    {block.items?.map((item, i) => (
                        <li key={i}>{renderInline(item)}</li>
                    ))}
                </ul>
            );

        case 'hr':
            return <hr key={key} className="md-hr" />;

        case 'paragraph':
        default:
            return <p key={key} className="md-paragraph">{renderInline(block.content)}</p>;
    }
}

function renderInline(text: string): React.ReactNode {
    // Simple inline parsing for bold, italic, code, links
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Inline code
        let match = remaining.match(/^`([^`]+)`/);
        if (match) {
            parts.push(<code key={key++} className="md-inline-code">{match[1]}</code>);
            remaining = remaining.slice(match[0].length);
            continue;
        }

        // Bold
        match = remaining.match(/^\*\*([^*]+)\*\*/);
        if (match) {
            parts.push(<strong key={key++}>{match[1]}</strong>);
            remaining = remaining.slice(match[0].length);
            continue;
        }

        // Italic
        match = remaining.match(/^\*([^*]+)\*/);
        if (match) {
            parts.push(<em key={key++}>{match[1]}</em>);
            remaining = remaining.slice(match[0].length);
            continue;
        }

        // Link
        match = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
            parts.push(
                <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer">
                    {match[1]}
                </a>
            );
            remaining = remaining.slice(match[0].length);
            continue;
        }

        // Plain text until next special char
        const nextSpecial = remaining.search(/[`*\[]/);
        if (nextSpecial === -1) {
            parts.push(remaining);
            break;
        } else if (nextSpecial === 0) {
            parts.push(remaining[0]);
            remaining = remaining.slice(1);
        } else {
            parts.push(remaining.slice(0, nextSpecial));
            remaining = remaining.slice(nextSpecial);
        }
    }

    return parts;
}
