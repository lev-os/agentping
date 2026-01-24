/**
 * Settings Modal Component
 *
 * Modal for configuring Claude Code Studio settings.
 */

import { useState, useEffect } from 'react';
import { X, Cpu, Zap, Brain, Settings, Check } from 'lucide-react';
import './SettingsModal.css';

export interface StudioSettings {
    model: 'sonnet' | 'opus' | 'haiku';
    maxTurns: number;
    allowedTools: string[];
    autoApprove: boolean;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: StudioSettings;
    onSave: (settings: StudioSettings) => void;
}

const MODEL_OPTIONS = [
    {
        value: 'haiku',
        label: 'Haiku',
        description: 'Fast responses, lower cost',
        icon: Zap
    },
    {
        value: 'sonnet',
        label: 'Sonnet',
        description: 'Balanced performance (Recommended)',
        icon: Cpu
    },
    {
        value: 'opus',
        label: 'Opus',
        description: 'Deep reasoning, complex tasks',
        icon: Brain
    }
];

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
    const [model, setModel] = useState<'sonnet' | 'opus' | 'haiku'>(settings.model);
    const [maxTurns, setMaxTurns] = useState(settings.maxTurns);
    const [autoApprove, setAutoApprove] = useState(settings.autoApprove);
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when settings prop changes
    useEffect(() => {
        setModel(settings.model);
        setMaxTurns(settings.maxTurns);
        setAutoApprove(settings.autoApprove);
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave({
            ...settings,
            model,
            maxTurns,
            autoApprove
        });
        setIsSaving(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="settings-modal-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
                <header className="settings-header">
                    <div className="settings-title">
                        <Settings size={18} />
                        <h2>Claude Settings</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </header>

                <div className="settings-content">
                    {/* Model Selection */}
                    <div className="settings-section">
                        <h3>Model</h3>
                        <p className="section-description">Choose the AI model for your chat sessions</p>
                        <div className="model-options">
                            {MODEL_OPTIONS.map(option => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        className={`model-option ${model === option.value ? 'selected' : ''}`}
                                        onClick={() => setModel(option.value as 'sonnet' | 'opus' | 'haiku')}
                                    >
                                        <Icon size={20} />
                                        <span className="model-label">{option.label}</span>
                                        <span className="model-desc">{option.description}</span>
                                        {model === option.value && (
                                            <Check size={16} className="check-icon" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Max Turns */}
                    <div className="settings-section">
                        <h3>Max Turns</h3>
                        <p className="section-description">Maximum number of conversation turns per session</p>
                        <div className="turns-input">
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={maxTurns}
                                onChange={(e) => setMaxTurns(Number(e.target.value))}
                            />
                            <span className="turns-value">{maxTurns}</span>
                        </div>
                    </div>

                    {/* Auto Approve */}
                    <div className="settings-section">
                        <h3>Auto Approve</h3>
                        <p className="section-description">Automatically approve safe tool operations</p>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={autoApprove}
                                onChange={(e) => setAutoApprove(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                            <span className="toggle-label">
                                {autoApprove ? 'Enabled (Use with caution)' : 'Disabled (Manual approval)'}
                            </span>
                        </label>
                    </div>
                </div>

                <footer className="settings-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </footer>
            </div>
        </div>
    );
}
