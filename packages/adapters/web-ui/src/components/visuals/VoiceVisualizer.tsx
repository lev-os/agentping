import React from 'react';
import './VoiceVisualizer.css';

export const VoiceVisualizer: React.FC = () => {
    return (
        <div className="voice-container">
            <div className="voice-bars">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="voice-bar"
                        style={{ animationDelay: `-${i * 0.1}s` }}
                    ></div>
                ))}
            </div>
            <div className="voice-status">AI LISTENING</div>
        </div>
    );
};
