
import React from 'react';
import './DataPipeline.css';

interface PipelineStage {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    duration?: string;
}

interface DataPipelineProps {
    stages: PipelineStage[];
}

export const DataPipeline: React.FC<DataPipelineProps> = ({ stages }) => {
    return (
        <div className="data-pipeline">
            <h3 className="pipeline-title">ETL PIPELINE STATUS</h3>
            <div className="pipeline-container">
                {stages.map((stage, index) => (
                    <div key={stage.id} className="pipeline-step-wrapper">
                        <div className={`pipeline-node ${stage.status}`}>
                            <div className="node-icon">
                                {stage.status === 'completed' && '✓'}
                                {stage.status === 'failed' && '✕'}
                                {stage.status === 'running' && '⟳'}
                                {stage.status === 'pending' && '⋯'}
                            </div>
                            <div className="node-content">
                                <span className="node-label">{stage.label}</span>
                                {stage.duration && <span className="node-meta">{stage.duration}</span>}
                            </div>
                        </div>
                        {index < stages.length - 1 && (
                            <div className={`pipeline-connector ${stage.status === 'completed' ? 'active' : ''}`}>
                                <div className="connector-line"></div>
                                <div className="connector-arrow">►</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
