import React from 'react';
import './TaskQueue.css';

export interface queueItem {
    id: string;
    name: string;
    priority: 'high' | 'medium' | 'low';
    progress: number;
    eta?: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
}

interface TaskQueueProps {
    tasks: queueItem[];
    className?: string;
}

export function TaskQueue({ tasks, className = '' }: TaskQueueProps) {
    return (
        <div className={`task-queue ${className}`}>
            <div className="task-queue-header">
                <span className="col-name">Task</span>
                <span className="col-progress">Progress</span>
            </div>
            <div className="task-list">
                {tasks.map((task) => (
                    <div key={task.id} className={`task-item priority-${task.priority}`}>
                        <div className="task-main">
                            <div className="task-info">
                                <span className="task-name">{task.name}</span>
                                {task.eta && <span className="task-eta">{task.eta}</span>}
                            </div>
                            <div className="task-progress-track">
                                <div
                                    className={`task-progress-bar status-${task.status}`}
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="task-meta">
                            <span className="task-priority">{task.priority}</span>
                            <span className="task-percent">{task.progress}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
