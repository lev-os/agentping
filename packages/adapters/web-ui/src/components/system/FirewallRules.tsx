import React from 'react';
import './FirewallRules.css';

export const FirewallRules: React.FC = () => {
    return (
        <div className="firewall-rules">
            <div className="firewall-header">
                <span className="icon">🛡️</span> ACTIVE_RULES
            </div>
            <div className="firewall-list">
                <div className="firewall-row allowed">
                    <span className="status">ALLOW</span>
                    <span className="ip">192.168.1.0/24</span>
                    <span className="port">TCP:443</span>
                </div>
                <div className="firewall-row allowed">
                    <span className="status">ALLOW</span>
                    <span className="ip">10.0.0.5</span>
                    <span className="port">SSH:22</span>
                </div>
                <div className="firewall-row denied">
                    <span className="status">DENY</span>
                    <span className="ip">10.20.5.112</span>
                    <span className="port">ALL</span>
                </div>
                <div className="firewall-row denied">
                    <span className="status">DENY</span>
                    <span className="ip">*.botnet.ru</span>
                    <span className="port">ALL</span>
                </div>
                <div className="firewall-row allowed">
                    <span className="status">ALLOW</span>
                    <span className="ip">LOCALHOST</span>
                    <span className="port">UDP:53</span>
                </div>
            </div>
            <div className="firewall-footer">
                TOTAL: 42 RULES | BLOCKED: 1,402
            </div>
        </div>
    );
};
