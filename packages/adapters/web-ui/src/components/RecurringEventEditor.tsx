import React, { useState } from 'react';
import './RecurringEventEditor.css';

interface RecurringEventEditorProps {
    onChange?: (rule: string) => void;
}

export const RecurringEventEditor: React.FC<RecurringEventEditorProps> = ({ onChange }) => {
    const [freq, setFreq] = useState('WEEKLY');
    const [interval, setInterval] = useState(1);
    const [byDay, setByDay] = useState<string[]>([]);

    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

    const toggleDay = (d: string) => {
        const newDays = byDay.includes(d)
            ? byDay.filter(day => day !== d)
            : [...byDay, d];
        setByDay(newDays);
        updateRule(freq, interval, newDays);
    };

    const updateRule = (f: string, i: number, d: string[]) => {
        // Simple RRule string construction
        const dayStr = d.length > 0 ? `;BYDAY=${d.join(',')}` : '';
        const rule = `FREQ=${f};INTERVAL=${i}${dayStr}`;
        if (onChange) onChange(rule);
    };

    return (
        <div className="recurring-editor">
            <div className="rule-summary">
                Repeat every {interval} {freq.toLowerCase()}(s) {byDay.length > 0 ? `on ${byDay.join(', ')}` : ''}
            </div>

            <div className="editor-row">
                <label>Frequency</label>
                <select
                    className="editor-select"
                    value={freq}
                    onChange={e => { setFreq(e.target.value); updateRule(e.target.value, interval, byDay); }}
                >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                </select>
            </div>

            <div className="editor-row">
                <label>Every</label>
                <input
                    type="number"
                    className="editor-input"
                    value={interval}
                    min={1}
                    max={99}
                    style={{ width: 60 }}
                    onChange={e => { setInterval(Number(e.target.value)); updateRule(freq, Number(e.target.value), byDay); }}
                />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{freq.toLowerCase()}(s)</span>
            </div>

            {freq === 'WEEKLY' && (
                <div className="editor-row">
                    <label>On days</label>
                    <div className="weekdays-selector">
                        {days.map(d => (
                            <button
                                key={d}
                                className={`weekday-btn ${byDay.includes(d) ? 'selected' : ''}`}
                                onClick={() => toggleDay(d)}
                            >
                                {d.substring(0, 1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
