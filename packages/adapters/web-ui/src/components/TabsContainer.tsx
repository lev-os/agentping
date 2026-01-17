import { useState } from 'react';
import './TabsContainer.css';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsContainerProps {
    tabs: Tab[];
    defaultTabId?: string;
}

export function TabsContainer({ tabs, defaultTabId }: TabsContainerProps) {
    const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);
    const activeContent = tabs.find(t => t.id === activeTab)?.content;

    return (
        <div className="tabs-container">
            <div className="tabs-header" role="tablist">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div
                className="tab-content"
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
            >
                {activeContent}
            </div>
        </div>
    );
}
