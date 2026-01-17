import React from 'react';
import './LandingPage.css';

interface Agent {
    name: string;
    role: string;
    description: string;
}

const SQUAD: Agent[] = [
    { name: 'ARIA', role: 'Voice', description: 'Speaks to users via TTS, providing a human-like interface.' },
    { name: 'CORTEX', role: 'Architect', description: 'Manages the system orchestration and high-level decision making.' },
    { name: 'VISION', role: 'Eyes', description: 'Analyzes visual input from video feeds and images.' },
    { name: 'LEXIS', role: 'Language', description: 'Handles natural language understanding and intent classification.' },
    { name: 'ECHO', role: 'Ears', description: 'Transcribes speech to text using Whisper for accurate input.' },
    { name: 'SENTINEL', role: 'Security', description: 'Tests system integrity and protects against unauthorized access.' },
    { name: 'PRISM', role: 'Learning', description: 'Trains custom models and handles fine-tuning tasks.' },
    { name: 'NEXUS', role: 'Hardware', description: 'Interfaces with physical devices and IoT peripherals.' },
    { name: 'SAGE', role: 'Strategy', description: 'Provides deep reasoning, logic analysis, and long-term planning.' },
    { name: 'VELOCITY', role: 'Coder', description: 'Writes high-performance code and handles implementation tasks.' },
    { name: 'RALPH', role: 'Marine', description: 'Autopilot system for boat navigation and marine operations.' },
    { name: 'ORACLE', role: 'Prediction', description: 'Forecasts future data points and market trends.' },
];

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
    return (
        <div className="landing-page">
            <div className="landing-background">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>
            <div className="landing-content-wrapper">
                <section className="landing-hero">
                    <h1>Turn Agent Output<br />Into Action</h1>
                    <p className="subtitle">
                        The Command Center for your AI Agents. Move beyond text chats and control your workforce with rich, structured interfaces.
                    </p>
                    <button className="cta-button" onClick={onGetStarted}>
                        Enter Command Center
                    </button>
                </section>

                <section className="landing-section">
                    <h2>Commander vs. Worker</h2>
                    <div className="comparison-table-container">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Cursor (The Worker)</th>
                                    <th className="comparison-highlight">AgentPing (The Commander)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Primary Goal</td>
                                    <td>Writing code with AI help</td>
                                    <td className="comparison-highlight">Approving/Managing what the AI did</td>
                                </tr>
                                <tr>
                                    <td>Interaction</td>
                                    <td>Chat-based / Copilot</td>
                                    <td className="comparison-highlight">Decision-based / Mission Control</td>
                                </tr>
                                <tr>
                                    <td>Persona</td>
                                    <td>You are the Workforce</td>
                                    <td className="comparison-highlight">You are the Manager/Director</td>
                                </tr>
                                <tr>
                                    <td>Focus</td>
                                    <td>Deep work, local files</td>
                                    <td className="comparison-highlight">Strategic approvals, oversight</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="landing-section">
                    <h2>The Kingly Agent Squad</h2>
                    <div className="squad-grid">
                        {SQUAD.map((agent) => (
                            <div key={agent.name} className="agent-card">
                                <div className="agent-header">
                                    <span className="agent-role-badge">{agent.role}</span>
                                    <span className="agent-name">{agent.name}</span>
                                </div>
                                <p className="agent-desc">{agent.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="landing-section">
                    <h2>Why AgentPing?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>Structured Payloads</h3>
                            <p>Agents send data, not just text. Automatically turn structured JSON into interactive UI widgets like checklists, direction pickers, and code reviews.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Human-in-the-Loop</h3>
                            <p>Total control over autonomous agents. Nothing dangerous happens without your explicit approval. It's the "Remote Control" for your AI workforce.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
