import React from 'react';
import './PdfPreview.css';

export interface PdfPreviewProps {
    file: string; // filename
    url?: string; // Real PDF URL or Base64 data URI
    pages?: number; // Estimated pages for mock view
    className?: string;
}

export function PdfPreview({ file, url, pages = 5, className }: PdfPreviewProps) {
    const isLive = !!url;

    return (
        <div className={`pdf-preview ${isLive ? 'live-mode' : ''} ${className || ''}`}>
            <div className="pdf-toolbar">
                <span className="pdf-filename">{file}</span>
                <div className="pdf-controls">
                    {!isLive && (
                        <>
                            <button>-</button>
                            <span>1 / {pages}</span>
                            <button>+</button>
                        </>
                    )}
                </div>
                {isLive ? (
                    <a
                        href={url}
                        download={file}
                        className="pdf-download"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Download
                    </a>
                ) : (
                    <button className="pdf-download">Download</button>
                )}
            </div>

            <div className={`pdf-viewport ${!isLive ? 'mock-view' : ''}`}>
                {isLive ? (
                    <iframe
                        src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
                        title={file}
                        className="pdf-frame"
                    />
                ) : (
                    <div className="pdf-page">
                        <div className="pdf-page-skeleton">
                            <div className="skeleton-line title" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line" />
                            <div className="skeleton-block" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line" />
                            {/* Mock Text Selection Layer */}
                            <div className="pdf-selection-layer" />
                        </div>
                    </div>
                )}
            </div>

            {!isLive && (
                <div className="pdf-thumbnails">
                    {Array(Math.min(pages, 6)).fill(0).map((_, i) => (
                        <div key={i} className={`pdf-thumb ${i === 0 ? 'active' : ''}`}>
                            <div className="thumb-content" />
                            <span className="thumb-num">{i + 1}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
