import type { ComponentType } from 'react';
import ReactMarkdown from 'react-markdown';

const Markdown = ReactMarkdown as unknown as ComponentType<{
  children: string;
}>;

interface MarkdownCardProps {
  content?: string;
  title?: string;
  onRespond: (data: Record<string, unknown>) => void;
}

export function MarkdownCard({ content, title }: MarkdownCardProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 p-4">
      {title && (
        <h2 className="font-mono text-sm text-cyan-400 mb-3">{title}</h2>
      )}

      {content ? (
        <div
          className="
            prose prose-invert prose-sm max-w-none
            prose-headings:text-gray-200 prose-headings:font-mono
            prose-code:text-cyan-400 prose-code:bg-gray-800/60 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
            prose-li:text-gray-300
            prose-p:text-gray-300
          "
        >
          <Markdown>{content}</Markdown>
        </div>
      ) : (
        <p className="text-xs text-gray-600 font-mono">No content</p>
      )}
    </div>
  );
}
