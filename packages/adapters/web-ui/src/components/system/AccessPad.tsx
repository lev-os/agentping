import React, { useState } from 'react';
import './AccessPad.css';

export const AccessPad: React.FC = () => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'denied'>('idle');

    const handlePress = (num: string) => {
        if (status !== 'idle') {
            setCode('');
            setStatus('idle');
        }

        if (code.length < 4) {
            setCode(prev => prev + num);
        }
    };

    const handleSubmit = () => {
        if (code === '1337') {
            setStatus('success');
        } else {
            setStatus('denied');
        }
        setTimeout(() => {
            setCode('');
            setStatus('idle');
        }, 1500);
    };

    return (
        <div className="access-pad">
            <div className={`access-screen ${status}`}>
                {status === 'idle' ? (code.padEnd(4, '_')) : (status === 'success' ? 'GRANTED' : 'DENIED')}
            </div>
            <div className="access-grid">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⏎'].map((key) => (
                    <button
                        key={key}
                        className={`access-btn ${key === 'C' ? 'clear' : ''} ${key === '⏎' ? 'enter' : ''}`}
                        onClick={() => {
                            if (key === 'C') {
                                setCode('');
                                setStatus('idle');
                            } else if (key === '⏎') {
                                handleSubmit();
                            } else {
                                handlePress(key);
                            }
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
};
