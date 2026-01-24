/**
 * Chat Search Component
 *
 * Search through chat messages with highlighting.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Message } from './ChatMessage';
import { Kbd } from '../ui';

export interface ChatSearchProps {
    messages: Message[];
    isOpen: boolean;
    onClose: () => void;
    onNavigateToMessage: (messageId: string) => void;
}

export interface SearchResult {
    messageId: string;
    content: string;
    matchIndex: number;
    preview: string;
}

export function ChatSearch({ messages, isOpen, onClose, onNavigateToMessage }: ChatSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search messages
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchResults: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();

        messages.forEach(msg => {
            if (!msg.content) return;

            const lowerContent = msg.content.toLowerCase();
            let matchIndex = 0;
            let startIndex = 0;

            while ((startIndex = lowerContent.indexOf(lowerQuery, startIndex)) !== -1) {
                // Extract preview around match
                const previewStart = Math.max(0, startIndex - 30);
                const previewEnd = Math.min(msg.content.length, startIndex + query.length + 30);
                const preview = (previewStart > 0 ? '...' : '') +
                    msg.content.slice(previewStart, previewEnd) +
                    (previewEnd < msg.content.length ? '...' : '');

                searchResults.push({
                    messageId: msg.id,
                    content: msg.content,
                    matchIndex,
                    preview
                });

                matchIndex++;
                startIndex += query.length;
            }
        });

        setResults(searchResults);
        setCurrentIndex(0);
    }, [query, messages]);

    // Navigate to current result
    useEffect(() => {
        if (results.length > 0 && results[currentIndex]) {
            onNavigateToMessage(results[currentIndex].messageId);
        }
    }, [currentIndex, results, onNavigateToMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Previous result
                setCurrentIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
            } else {
                // Next result
                setCurrentIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCurrentIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCurrentIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        }
    }, [results.length, onClose]);

    if (!isOpen) return null;

    return (
        <div className="chat-search" role="search">
            <div className="search-input-wrapper">
                <Search size={14} className="search-icon" />
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Search messages..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Search messages"
                />
                {query && (
                    <span className="search-count">
                        {results.length > 0 ? `${currentIndex + 1}/${results.length}` : '0 results'}
                    </span>
                )}
                <div className="search-nav">
                    <button
                        className="search-nav-btn"
                        onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))}
                        disabled={results.length === 0}
                        aria-label="Previous result"
                    >
                        <ChevronUp size={14} />
                    </button>
                    <button
                        className="search-nav-btn"
                        onClick={() => setCurrentIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))}
                        disabled={results.length === 0}
                        aria-label="Next result"
                    >
                        <ChevronDown size={14} />
                    </button>
                </div>
                <button
                    className="search-close-btn"
                    onClick={onClose}
                    aria-label="Close search"
                >
                    <X size={14} />
                </button>
            </div>
            <div className="search-hint">
                <Kbd keys="Enter" /> next
                <Kbd keys="Shift+Enter" /> previous
                <Kbd keys="Esc" /> close
            </div>
        </div>
    );
}
