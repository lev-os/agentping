import React, { useEffect, useState } from 'react';
import './EncryptionStatus.css';

export const EncryptionStatus: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [decryptedText, setDecryptedText] = useState('');
    const targetText = "ACCESS_GRANTED_LEVEL_V";
    const [scramble, setScramble] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 0;
                return prev + 0.5;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Scramble effect
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        const scrambleInterval = setInterval(() => {
            if (progress < 100) {
                const len = targetText.length;
                let newText = "";
                const revealIndex = Math.floor((progress / 100) * len);

                for (let i = 0; i < len; i++) {
                    if (i < revealIndex) {
                        newText += targetText[i];
                    } else {
                        newText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                setScramble(newText);
            } else {
                setScramble(targetText);
            }
        }, 60);

        return () => clearInterval(scrambleInterval);
    }, [progress]);

    return (
        <div className="encryption-widget">
            <div className="encryption-header">
                <span className="icon">🔒</span>
                <span>SYSTEM_ENCRYPTION</span>
            </div>

            <div className="encryption-ring-container">
                <svg className="encryption-ring" viewBox="0 0 100 100">
                    <circle
                        className="ring-bg"
                        cx="50" cy="50" r="45"
                    />
                    <circle
                        className="ring-progress"
                        cx="50" cy="50" r="45"
                        strokeDasharray={283}
                        strokeDashoffset={283 - (283 * progress / 100)}
                    />
                </svg>
                <div className="encryption-lock">
                    {progress >= 100 ? '🔓' : '🔐'}
                </div>
            </div>

            <div className="encryption-status-text">
                {progress >= 100 ? (
                    <span className="status-success">DECRYPTION COMPLETE</span>
                ) : (
                    <span className="status-active">DECRYPTING...</span>
                )}
            </div>

            <div className="encryption-code">
                {scramble}
            </div>
        </div>
    );
};
