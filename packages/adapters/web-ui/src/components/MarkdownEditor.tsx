import React, { useState } from 'react';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
    initialValue?: string;
    className?: string;
}

export function MarkdownEditor({ initialValue = '', className }: MarkdownEditorProps) {
    const [content, setContent] = useState(initialValue);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    return (
        <div className={`markdown-editor ${className || ''}`}>
            <div className="md-toolbar">
                <button
                    className={activeTab === 'write' ? 'active' : ''}
                    onClick={() => setActiveTab('write')}
                >
                    Write
                </button>
                <button
                    className={activeTab === 'preview' ? 'active' : ''}
                    onClick={() => setActiveTab('preview')}
                >
                    Preview
                </button>
                <div className="md-actions">
                    <button title="Bold">B</button>
                    <button title="Italic">I</button>
                    <button title="Code">{ }</button>
                </div>
            </div>

            <div className="md-content">
                {activeTab === 'write' ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your markdown here..."
                    />
                ) : (
                    <div className="md-preview">
                        {/* Simple placeholder render logic */}
                        {content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
                            if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
                            return <p key={i}>{line || <br />}</p>;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
