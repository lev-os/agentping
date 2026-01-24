import { ReactNode, createContext, useContext, useState, useCallback, KeyboardEvent } from 'react';

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
    defaultTab?: string;
    value?: string;
    onChange?: (tab: string) => void;
    children: ReactNode;
    className?: string;
}

export function Tabs({ defaultTab, value, onChange, children, className = '' }: TabsProps) {
    const [internalTab, setInternalTab] = useState(defaultTab || '');
    const activeTab = value ?? internalTab;

    const setActiveTab = useCallback((id: string) => {
        if (onChange) {
            onChange(id);
        } else {
            setInternalTab(id);
        }
    }, [onChange]);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={`ui-tabs ${className}`}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

export interface TabListProps {
    children: ReactNode;
    'aria-label': string;
}

export function TabList({ children, 'aria-label': ariaLabel }: TabListProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
        const currentIndex = tabs.findIndex(tab => tab === document.activeElement);

        let nextIndex: number;
        switch (e.key) {
            case 'ArrowLeft':
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = tabs.length - 1;
                tabs[nextIndex]?.focus();
                e.preventDefault();
                break;
            case 'ArrowRight':
                nextIndex = currentIndex + 1;
                if (nextIndex >= tabs.length) nextIndex = 0;
                tabs[nextIndex]?.focus();
                e.preventDefault();
                break;
            case 'Home':
                tabs[0]?.focus();
                e.preventDefault();
                break;
            case 'End':
                tabs[tabs.length - 1]?.focus();
                e.preventDefault();
                break;
        }
    };

    return (
        <div
            className="ui-tabs-list"
            role="tablist"
            aria-label={ariaLabel}
            onKeyDown={handleKeyDown}
        >
            {children}
        </div>
    );
}

export interface TabProps {
    id: string;
    children: ReactNode;
    badge?: number | string;
    badgeVariant?: 'default' | 'warning';
    disabled?: boolean;
}

export function Tab({ id, children, badge, badgeVariant = 'default', disabled = false }: TabProps) {
    const context = useContext(TabsContext);
    if (!context) throw new Error('Tab must be used within Tabs');

    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === id;

    return (
        <button
            role="tab"
            id={`tab-${id}`}
            aria-controls={`panel-${id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            className={`ui-tab ${isActive ? 'ui-tab--active' : ''}`}
            onClick={() => setActiveTab(id)}
        >
            {children}
            {badge !== undefined && (
                <span className={`ui-tab-badge ${badgeVariant === 'warning' ? 'ui-tab-badge--warning' : ''}`}>
                    {badge}
                </span>
            )}
        </button>
    );
}

export interface TabPanelProps {
    id: string;
    children: ReactNode;
}

export function TabPanel({ id, children }: TabPanelProps) {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabPanel must be used within Tabs');

    const isActive = context.activeTab === id;

    return (
        <div
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            className={`ui-tab-panel ${isActive ? 'ui-tab-panel--active' : ''}`}
            hidden={!isActive}
        >
            {children}
        </div>
    );
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
