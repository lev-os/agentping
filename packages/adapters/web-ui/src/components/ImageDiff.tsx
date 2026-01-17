import { useState } from 'react';
import './ImageDiff.css';

interface ImageDiffProps {
    originalUrl: string;
    newUrl: string;
    originalLabel?: string;
    newLabel?: string;
    className?: string; // Add className prop
}

type DiffMode = 'side-by-side' | 'slider' | 'overlay' | 'fade';

export function ImageDiff({
    originalUrl,
    newUrl,
    originalLabel = 'Original',
    newLabel = 'New',
    className
}: ImageDiffProps) {
    const [mode, setMode] = useState<DiffMode>('side-by-side');
    const [sliderPos, setSliderPos] = useState(50);

    return (
        <div className={`image-diff-viewer ${className || ''}`}>
            <div className="image-diff-toolbar">
                <div className="image-diff-modes">
                    <button
                        className={mode === 'side-by-side' ? 'active' : ''}
                        onClick={() => setMode('side-by-side')}
                    >
                        Side-by-Side
                    </button>
                    <button
                        className={mode === 'slider' ? 'active' : ''}
                        onClick={() => setMode('slider')}
                    >
                        Swipe
                    </button>
                    <button
                        className={mode === 'fade' ? 'active' : ''}
                        onClick={() => setMode('fade')}
                    >
                        Onion Skin
                    </button>
                </div>
            </div>

            <div className="image-diff-content">
                {mode === 'side-by-side' && (
                    <div className="diff-sxs">
                        <div className="diff-pane">
                            <span className="pane-label">{originalLabel}</span>
                            <img src={originalUrl} alt={originalLabel} />
                        </div>
                        <div className="diff-pane">
                            <span className="pane-label">{newLabel}</span>
                            <img src={newUrl} alt={newLabel} />
                        </div>
                    </div>
                )}

                {mode === 'slider' && (
                    <div className="diff-slider-container">
                        <div className="diff-slider-img original">
                            <img src={originalUrl} alt={originalLabel} />
                        </div>
                        <div
                            className="diff-slider-img new"
                            style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                        >
                            <img src={newUrl} alt={newLabel} />
                        </div>
                        <div
                            className="diff-slider-handle"
                            style={{ left: `${sliderPos}%` }}
                        >
                            <div className="handle-line" />
                            <div className="handle-knob">↔</div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPos}
                            onChange={(e) => setSliderPos(Number(e.target.value))}
                            className="diff-slider-input"
                        />
                    </div>
                )}

                {mode === 'fade' && (
                    <div className="diff-fade-container">
                        <div
                            className="diff-fade-img"
                            style={{ backgroundImage: `url(${originalUrl})` }}
                        />
                        <div
                            className="diff-fade-img overlay"
                            style={{ backgroundImage: `url(${newUrl})`, opacity: sliderPos / 100 }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPos}
                            onChange={(e) => setSliderPos(Number(e.target.value))}
                            className="diff-slider-control"
                        />
                        <div className="fade-labels">
                            <span>{originalLabel}</span>
                            <span>{newLabel}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
