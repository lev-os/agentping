
import React, { useState } from 'react';
import './HttpInspector.css';

interface Header {
    key: string;
    value: string;
}

interface HttpRequest {
    method: string;
    url: string;
    headers: Header[];
    body?: string;
}

interface HttpResponse {
    status: number;
    statusText: string;
    headers: Header[];
    body?: string;
    timing: number;
}

interface HttpInspectorProps {
    request: HttpRequest;
    response: HttpResponse;
}

export const HttpInspector: React.FC<HttpInspectorProps> = ({ request, response }) => {
    const [activeTab, setActiveTab] = useState<'request' | 'response'>('response');

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return '#00ff00';
        if (status >= 300 && status < 400) return '#00bfff';
        if (status >= 400 && status < 500) return '#ffa500';
        return '#ff0000';
    };

    return (
        <div className="http-inspector">
            <div className="http-summary">
                <span className={`method-badge ${request.method.toLowerCase()}`}>{request.method}</span>
                <span className="url-bar" title={request.url}>{request.url}</span>
                <span
                    className="status-badge"
                    style={{ color: getStatusColor(response.status) }}
                >
                    {response.status} {response.statusText}
                </span>
                <span className="timing-badge">{response.timing}ms</span>
            </div>

            <div className="http-tabs">
                <button
                    className={`tab-btn ${activeTab === 'request' ? 'active' : ''}`}
                    onClick={() => setActiveTab('request')}
                >
                    REQUEST
                </button>
                <button
                    className={`tab-btn ${activeTab === 'response' ? 'active' : ''}`}
                    onClick={() => setActiveTab('response')}
                >
                    RESPONSE
                </button>
            </div>

            <div className="http-content">
                {activeTab === 'request' ? (
                    <div className="payload-section">
                        <div className="section-title">HEADERS</div>
                        <div className="headers-list">
                            {request.headers.map((h, i) => (
                                <div key={i} className="header-row">
                                    <span className="header-key">{h.key}:</span>
                                    <span className="header-value">{h.value}</span>
                                </div>
                            ))}
                        </div>
                        {request.body && (
                            <>
                                <div className="section-title">BODY</div>
                                <pre className="body-content">{request.body}</pre>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="payload-section">
                        <div className="section-title">HEADERS</div>
                        <div className="headers-list">
                            {response.headers.map((h, i) => (
                                <div key={i} className="header-row">
                                    <span className="header-key">{h.key}:</span>
                                    <span className="header-value">{h.value}</span>
                                </div>
                            ))}
                        </div>
                        {response.body && (
                            <>
                                <div className="section-title">BODY</div>
                                <pre className="body-content">{response.body}</pre>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
