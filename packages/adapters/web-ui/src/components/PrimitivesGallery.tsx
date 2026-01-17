/**
 * PrimitivesGallery - Premium Showcase for AgentPing UI Primitives
 */

import { useState } from 'react';
import {
    InfoSidebar,
    ConfirmationModal,
    CommandPalette,
} from './index';

import './Layout.css';

// Import extracted gallery sections
import { GalleryDashboardSection } from './gallery/GalleryDashboardSection';
import { GalleryNavigationSection } from './gallery/GalleryNavigationSection';
import { GalleryDataSection } from './gallery/GalleryDataSection';
import { GalleryFormsSection } from './gallery/GalleryFormsSection';
import { GallerySchedulingSection } from './gallery/GallerySchedulingSection';
import { GalleryMediaSection } from './gallery/GalleryMediaSection';
import { GalleryContentSection } from './gallery/GalleryContentSection';
import { GalleryInteractionSection } from './gallery/GalleryInteractionSection';
import { GalleryFeedbackSection } from './gallery/GalleryFeedbackSection';
import { GallerySystemSection } from './gallery/GallerySystemSection';
import { GalleryVisualsSection } from './gallery/GalleryVisualsSection';
import { GalleryFinanceSection } from './gallery/GalleryFinanceSection';
// GalleryDataSection imported above
import { GalleryLogsSection } from './gallery/GalleryLogsSection';
import { TabsContainer } from './TabsContainer';

export function PrimitivesGallery() {
    const [activeSection, setActiveSection] = useState('dashboard');

    // Interactive States
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [cmdOpen, setCmdOpen] = useState(false);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard Widgets', content: <GalleryDashboardSection /> },
        { id: 'navigation', label: 'Navigation & Graph', content: <GalleryNavigationSection /> },
        { id: 'data', label: 'Data & Logs', content: <GalleryDataSection /> },
        { id: 'logs', label: 'Logs & Debug', content: <GalleryLogsSection /> },
        { id: 'finance', label: 'Financial Data', content: <GalleryFinanceSection /> },
        { id: 'visuals', label: 'Visuals & FX', content: <GalleryVisualsSection /> },
        { id: 'content', label: 'Content & Diffs', content: <GalleryContentSection /> },
        { id: 'forms', label: 'Forms & Input', content: <GalleryFormsSection /> },
        { id: 'scheduling', label: 'Scheduling', content: <GallerySchedulingSection /> },
        { id: 'media', label: 'Media Playback', content: <GalleryMediaSection /> },
        {
            id: 'interaction', label: 'Overlays & Interaction', content: (
                <GalleryInteractionSection
                    setSidebarOpen={setSidebarOpen}
                    setModalOpen={setModalOpen}
                    setCmdOpen={setCmdOpen}
                />
            )
        },
        { id: 'feedback', label: 'Feedback & Status', content: <GalleryFeedbackSection /> },
        { id: 'system', label: 'System Ops & Security', content: <GallerySystemSection /> },
    ];

    return (
        <div className="app-layout">
            <div className="app-sidebar">
                <div className="app-sidebar-header">
                    <h2>Primitives</h2>
                    <span className="badge">v2.1</span>
                </div>
                <nav className="app-sidebar-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`app-nav-item ${activeSection === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <main className="app-content">
                <header className="app-page-header">
                    <h1 className="app-page-title">{tabs.find(t => t.id === activeSection)?.label}</h1>
                </header>
                <div className="app-canvas">

                    {tabs.find(t => t.id === activeSection)?.content}
                </div>
            </main>

            {/* Global Overlays */}
            <InfoSidebar
                title="Documentation"
                content="The sidebar pattern allows for contextual help without leaving the main workflow. It supports rich text and links."
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(false)}
                links={[
                    { label: 'View Component Source', url: '#' },
                    { label: 'Design Guidelines', url: '#' }
                ]}
            />

            <ConfirmationModal
                isOpen={modalOpen}
                title="Confirm Action"
                message="Are you sure you want to proceed? This action demonstrates the modal pattern."
                confirmLabel="Yes, proceed"
                onConfirm={() => { alert('Action confirmed'); setModalOpen(false); }}
                onCancel={() => setModalOpen(false)}
            />

            <CommandPalette
                isOpen={cmdOpen}
                onClose={() => setCmdOpen(false)}
                commands={[
                    { id: '1', label: 'Go to Dashboard', group: 'Navigation', action: () => setActiveSection('dashboard') },
                    { id: '2', label: 'Go to Settings', group: 'Navigation', action: () => alert('Settings') },
                    { id: '3', label: 'Create New Agent', group: 'Actions', action: () => alert('New Agent') },
                    { id: '4', label: 'View Logs', group: 'Actions', action: () => setActiveSection('logs') },
                    { id: '5', label: 'Toggle Dark Mode', group: 'Preferences', action: () => alert('Toggle Theme'), shortcut: '⌘D' },
                ]}
            />
        </div>
    );
}
