import React, { useState, useMemo } from 'react';
import './RegexTester.css';

interface RegexTesterProps {
    initialPattern?: string;
    initialFlags?: string;
    initialText?: string;
    className?: string;
}

export function RegexTester({ initialPattern = '', initialFlags = 'gm', initialText = '', className }: RegexTesterProps) {
    const [pattern, setPattern] = useState(initialPattern);
    const [flags, setFlags] = useState(initialFlags);
    const [text, setText] = useState(initialText);

    const result = useMemo(() => {
        if (!pattern) return { matches: [], error: null };
        try {
            const regex = new RegExp(pattern, flags);
            const matches = [];
            let match;
            // Limit iterations/matches for safety
            let i = 0;
            // If not global, only one match
            if (!flags.includes('g')) {
                const m = regex.exec(text);
                if (m) matches.push({ index: m.index, match: m[0], groups: m.slice(1) });
            } else {
                while ((match = regex.exec(text)) !== null && i < 100) {
                    matches.push({ index: match.index, match: match[0], groups: match.slice(1) });
                    i++;
                    if (match.index === regex.lastIndex) regex.lastIndex++; // Avoiding infinite loops
                }
            }
            return { matches, error: null };
        } catch (e: any) {
            return { matches: [], error: e.message };
        }
    }, [pattern, flags, text]);

    // Simple highlighting (naive approach for demo)
    const highlightedText = useMemo(() => {
        if (!pattern || result.error || result.matches.length === 0) return text;

        const fragments = [];
        let lastIndex = 0;

        result.matches.forEach((m, i) => {
            // Text before match
            if (m.index > lastIndex) {
                fragments.push(<span key={`text-${i}`}>{text.slice(lastIndex, m.index)}</span>);
            }
            // Match
            fragments.push(
                <span key={`match-${i}`} className="regex-match" title={`Match ${i + 1}`}>
                    {m.match}
                </span>
            );
            lastIndex = m.index + m.match.length;
        });

        if (lastIndex < text.length) {
            fragments.push(<span key="text-end">{text.slice(lastIndex)}</span>);
        }

        return fragments;
    }, [text, result, pattern]);

    return (
        <div className={`regex-tester ${className || ''}`}>
            <div className="regex-input-group">
                <span className="regex-slash">/</span>
                <input
                    type="text"
                    className="regex-pattern"
                    value={pattern}
                    onChange={e => setPattern(e.target.value)}
                    placeholder="Pattern..."
                />
                <span className="regex-slash">/</span>
                <input
                    type="text"
                    className="regex-flags"
                    value={flags}
                    onChange={e => setFlags(e.target.value)}
                    placeholder="flags"
                />
            </div>

            {result.error && <div className="regex-error">{result.error}</div>}

            <div className="regex-body">
                <div className="regex-pane input-pane">
                    <label>Test String</label>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        spellCheck={false}
                    />
                </div>
                <div className="regex-pane output-pane">
                    <label>Matches ({result.matches.length})</label>
                    <div className="regex-highlight">
                        {highlightedText}
                    </div>
                </div>
            </div>
        </div>
    );
}
