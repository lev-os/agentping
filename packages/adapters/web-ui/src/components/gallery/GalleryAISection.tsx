import React, { useState } from 'react';
import {
    TokenStream,
    ConfidenceMeter,
    ModelSelector,
    ContextUsage,
    PromptEditor,
    AgentAvatar,
    MessageBubble,
    BrainActivity,
    ToolInvocation,
    VectorCluster
} from '../index';

export const GalleryAISection = () => {
    const [prompt, setPrompt] = useState('Write a poem about {{subject}} in the style of {{author}}.');
    const [selectedModel, setSelectedModel] = useState('gpt4');

    return (
        <div className="app-grid">
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>Conversation</h3>
                    <p>Agent Interaction</p>
                </div>
                <div className="app-card-body">
                    <MessageBubble
                        role="user"
                        content="Can you explain quantum computing?"
                        timestamp="10:42 AM"
                    />
                    <MessageBubble
                        role="assistant"
                        content="Quantum computing uses phantom principles of quantum mechanics..."
                        senderName="Claude"
                        timestamp="10:42 AM"
                    />
                    <TokenStream
                        text="Here is a more detailed breakdown of the qubits superposition states..."
                        className="mt-4"
                        speed={20}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Intelligence Config</h3>
                    <p>Model Parameters</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <ModelSelector
                        selectedId={selectedModel}
                        onSelect={setSelectedModel}
                        models={[
                            { id: 'gpt4', name: 'GPT-4o', provider: 'OpenAI', capabilities: ['smart', 'vision'], cost: '$$$' },
                            { id: 'claude', name: 'Claude 3.5', provider: 'Anthropic', capabilities: ['code', '100k'], cost: '$$' },
                            { id: 'local', name: 'Llama 3', provider: 'Local', capabilities: ['fast'], cost: 'Free' },
                        ]}
                    />
                    <ContextUsage used={8192} total={32000} />
                    <ConfidenceMeter score={0.92} label="Safety Score" />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Neural Activity</h3>
                    <p>Real-time Inference</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <AgentAvatar name="System" status="speaking" size="md" />
                        <AgentAvatar name="Planner" status="thinking" size="md" />
                        <AgentAvatar name="Critic" status="idle" size="md" />
                    </div>
                    <BrainActivity height={120} color="var(--accent-primary)" />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>Tools & Prompting</h3>
                    <p>Orchestration</p>
                </div>
                <div className="app-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <h4 style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>Prompt Template</h4>
                        <PromptEditor value={prompt} onChange={setPrompt} />
                    </div>
                    <div>
                        <h4 style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>Execution Log</h4>
                        <ToolInvocation
                            toolName="web_search"
                            args={{ query: "latest quantum advances" }}
                            status="completed"
                            result="Found 3 articles..."
                        />
                        <ToolInvocation
                            toolName="calculator"
                            args={{ expression: "42 * 7" }}
                            status="running"
                        />
                    </div>
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Semantic Space</h3>
                    <p>Embeddings</p>
                </div>
                <div className="app-card-body">
                    <VectorCluster
                        points={[
                            { x: 20, y: 30, group: 1 },
                            { x: 25, y: 35, group: 1 },
                            { x: 70, y: 80, group: 2 },
                            { x: 75, y: 75, group: 2 },
                            { x: 50, y: 50, group: 3 },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};
