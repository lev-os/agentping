import React, { useState } from 'react';
import './AudioPlayer.css';

export interface AudioPlayerProps {
    src: string;
    title?: string;
    duration?: string;
}

export function AudioPlayer({ src, title = "Unknown Track", duration = "0:00" }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(75);

    // Fake waveform bars - more density
    const bars = Array.from({ length: 48 }, () => Math.floor(Math.random() * 60) + 20);

    return (
        <div className="audio-player cyber-audio" role="region" aria-label="Audio Player">
            <div className="audio-dock">
                {/* Controls Left */}
                <div className="audio-controls-left">
                    <button
                        className={`audio-play-btn ${isPlaying ? 'playing' : ''}`}
                        onClick={() => setIsPlaying(!isPlaying)}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" /></svg>
                        ) : (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg>
                        )}
                    </button>
                    <div className="audio-info">
                        <span className="audio-title">{title}</span>
                        <div className="audio-meta-row">
                            <span className="audio-status">{isPlaying ? 'PLAYING' : 'READY'}</span>
                            <span className="audio-format">WAV • 24BIT</span>
                        </div>
                    </div>
                </div>

                {/* Waveform Center */}
                <div className="audio-waveform-container" aria-hidden="true">
                    {bars.map((height, i) => (
                        <div
                            key={i}
                            className={`waveform-bar ${isPlaying ? 'animate' : ''}`}
                            style={{
                                height: `${height * 0.4}px`,
                                animationDelay: `${i * 0.05}s`
                            }}
                        />
                    ))}
                </div>

                {/* Meta Right */}
                <div className="audio-controls-right">
                    <span className="audio-time">0:12 / {duration || "0:30"}</span>
                    <div className="volume-slider-container">
                        <svg className="volume-icon" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                            <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                        </svg>
                        <div className="volume-bar-bg">
                            <div className="volume-bar-fill" style={{ width: `${volume}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
