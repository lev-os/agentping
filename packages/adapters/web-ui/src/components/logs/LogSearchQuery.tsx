
import React, { useState } from 'react';
import './LogSearchQuery.css';

interface SearchResult {
    line: number;
    content: string;
    matches: { start: number; end: number }[];
}

interface LogSearchProps {
    onSearch: (query: string) => void;
    results?: SearchResult[];
}

export const LogSearchQuery: React.FC<LogSearchProps> = ({ onSearch, results = [] }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const highlightSyntax = (text: string) => {
        // Simple syntax highlighting for query
        return text.split(' ').map((part, i) => {
            if (['AND', 'OR', 'NOT'].includes(part.toUpperCase())) {
                return <span key={i} className="syntax-keyword">{part} </span>;
            }
            if (part.startsWith('"') && part.endsWith('"')) {
                return <span key={i} className="syntax-string">{part} </span>;
            }
            if (part.includes(':')) {
                const [key, val] = part.split(':');
                return (
                    <span key={i}>
                        <span className="syntax-field">{key}:</span>
                        <span className="syntax-value">{val} </span>
                    </span>
                );
            }
            return <span key={i}>{part} </span>;
        });
    };

    return (
        <div className="log-search-query">
            <div className="search-header">
                <h3 className="search-title">LOG SEARCH</h3>
            </div>
            <form onSubmit={handleSubmit} className={`search-bar-container ${isFocused ? 'focused' : ''}`}>
                <span className="search-icon">🔍</span>
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="service:api AND status:500..."
                    />
                    <div className="search-overlay">
                        {highlightSyntax(query)}
                    </div>
                </div>
                <button type="submit" className="search-btn">SEARCH</button>
            </form>

            <div className="search-results">
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <div key={index} className="search-result-row">
                            <span className="line-number">{result.line}</span>
                            <span className="line-content">
                                {/* Naive highlighting implementation for demo */}
                                {result.content}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        TYPE QUERY TO SEARCH LOGS
                    </div>
                )}
            </div>
        </div>
    );
};
