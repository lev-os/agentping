import React, { useState } from 'react';
import './ImageCompare.css';

interface ImageCompareProps {
    before: string;
    after: string;
    height?: number;
}

export function ImageCompare({ before, after, height = 300 }: ImageCompareProps) {
    const [slider, setSlider] = useState(50);

    return (
        <div className="image-compare" style={{ height }}>
            <div className="compare-wrapper">
                <img src={before} alt="Before" className="img-before" />
                <div
                    className="img-after-wrapper"
                    style={{ clipPath: `inset(0 0 0 ${slider}%)` }}
                >
                    <img src={after} alt="After" className="img-after" />
                </div>

                <div
                    className="compare-slider-line"
                    style={{ left: `${slider}%` }}
                >
                    <div className="slider-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8L22 12L18 16" />
                            <path d="M6 8L2 12L6 16" />
                        </svg>
                    </div>
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={slider}
                    onChange={(e) => setSlider(Number(e.target.value))}
                    className="compare-range-input"
                />
            </div>
            <div className="compare-labels">
                <span style={{ opacity: Math.max(0.3, 1 - slider / 100) }}>Before</span>
                <span style={{ opacity: Math.max(0.3, slider / 100) }}>After</span>
            </div>
        </div>
    );
}
