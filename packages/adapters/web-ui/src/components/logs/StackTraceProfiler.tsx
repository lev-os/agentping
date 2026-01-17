
import React from 'react';
import './StackTraceProfiler.css';

interface StackFrame {
    method: string;
    file: string;
    line: number;
    column: number;
    isInternal?: boolean;
}

interface StackTraceProps {
    exception: string;
    message: string;
    frames: StackFrame[];
}

export const StackTraceProfiler: React.FC<StackTraceProps> = ({ exception, message, frames }) => {
    return (
        <div className="stack-trace-profiler">
            <div className="stack-header">
                <div className="exception-type">{exception}</div>
                <div className="exception-message">{message}</div>
            </div>
            <div className="stack-frames">
                {frames.map((frame, index) => (
                    <div key={index} className={`stack-frame ${frame.isInternal ? 'internal' : 'user'}`}>
                        <div className="frame-method">
                            {frame.method}
                        </div>
                        <div className="frame-file">
                            {frame.file}:{frame.line}:{frame.column}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
