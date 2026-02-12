import React from 'react';
import {
    Breadcrumbs,
    DependencyGraph,
    TreeBrowser,
    TabsContainer,
    Pagination,
    SplitView,
    MiniMap,
    Stepper,
    RadarChart,
    SankeyDiagram,
    NetworkGraph,
    Timeline,
    OrgChart,
    MindMap,
    RadialNav,
    DockMenu,
    SidePanel
} from '../index';

export const GalleryNavigationSection = () => {
    return (
        <div className="app-grid">
            <div className="app-card">
                <div className="app-card-header">
                    <h3>Breadcrumbs</h3>
                    <p>Path navigation</p>
                </div>
                <div className="app-card-body">
                    <Breadcrumbs
                        path={[
                            { label: 'Home', id: 'home' },
                            { label: 'Projects', id: 'projects' },
                            { label: 'Marketing', id: 'marketing' },
                            { label: 'Q4 Campaign', id: 'q4' },
                        ]}
                        onNavigate={(id) => alert(`Navigate to: ${id}`)}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>DependencyGraph</h3>
                    <p>Visualizing task relationships</p>
                </div>
                <div className="app-card-body">
                    <DependencyGraph
                        nodes={[
                            { id: '1', label: 'Core API Specification', status: 'complete', dependencies: [] },
                            { id: '2', label: 'Database Schema', status: 'complete', dependencies: ['1'] },
                            { id: '3', label: 'Auth Middleware', status: 'in_progress', dependencies: ['1'] },
                            { id: '4', label: 'User Dashboard', status: 'pending', dependencies: ['2', '3'] },
                            { id: '5', label: 'Admin Panel', status: 'blocked', dependencies: ['3'] },
                        ]}
                        onNodeClick={(id) => alert(`Clicked node ${id}`)}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>TreeBrowser</h3>
                    <p>Hierarchical navigation</p>
                </div>
                <div className="app-card-body">
                    <TreeBrowser
                        nodes={[
                            {
                                id: '1', label: 'src', type: 'folder', children: [
                                    {
                                        id: '11', label: 'components', type: 'folder', children: [
                                            { id: '111', label: 'Button.tsx', type: 'file' },
                                            { id: '112', label: 'Header.tsx', type: 'file' },
                                        ]
                                    },
                                    { id: '12', label: 'utils.ts', type: 'file' },
                                ]
                            },
                            { id: '2', label: 'package.json', type: 'file' },
                        ]}
                        onNodeSelect={(node) => console.log('Selected:', node.label)}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>TabsContainer</h3>
                    <p>Context switching</p>
                </div>
                <div className="app-card-body">
                    <TabsContainer
                        tabs={[
                            { id: 'code', label: 'Code', content: <div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 8, fontFamily: 'monospace' }}>console.log("Hello")</div> },
                            { id: 'preview', label: 'Preview', content: <div style={{ padding: 16 }}>Preview Content</div> },
                            { id: 'logs', label: 'Logs', content: <div style={{ padding: 16 }}>No logs available.</div> },
                        ]}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Pagination</h3>
                    <p>Data navigation</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        currentPage={3}
                        totalPages={10}
                        onPageChange={(p) => alert(`Go to page ${p}`)}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2', height: '300px' }}>
                <div className="app-card-header">
                    <h3>SplitView & MiniMap</h3>
                    <p>Advanced layout controls</p>
                </div>
                <div className="app-card-body" style={{ height: '220px', padding: 0 }}>
                    <SplitView
                        left={
                            <div style={{ padding: 20 }}>
                                <h4>Main Content</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    This area is resizable. Drag the divider to adjust the width.
                                    Simulated long content follows...
                                </p>
                            </div>
                        }
                        right={
                            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                                <h4>Navigation Map</h4>
                                <MiniMap
                                    contentHeight={800}
                                    viewportHeight={200}
                                    scrollTop={100}
                                    width={100}
                                    onScrollRequest={(top) => alert(`Scroll to ${Math.round(top)}px`)}
                                />
                            </div>
                        }
                        initialSplit={60}
                    />
                </div>
            </div>
            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>Stepper</h3>
                    <p>Process tracking</p>
                </div>
                <div className="app-card-body">
                    <Stepper
                        steps={[
                            { id: '1', label: 'Cart', status: 'completed' },
                            { id: '2', label: 'Shipping', status: 'current', description: 'Enter address' },
                            { id: '3', label: 'Payment', status: 'pending' },
                            { id: '4', label: 'Confirm', status: 'pending' }
                        ]}
                        currentStepId="2"
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>RadarChart</h3>
                    <p>Skill analysis</p>
                </div>
                <div className="app-card-body">
                    <RadarChart
                        data={[
                            { label: 'Speed', value: 80 },
                            { label: 'Power', value: 60 },
                            { label: 'Intel', value: 90 },
                            { label: 'Tech', value: 75 },
                            { label: 'Stamina', value: 70 }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>SankeyDiagram</h3>
                    <p>Flow visualization</p>
                </div>
                <div className="app-card-body">
                    <SankeyDiagram
                        nodes={[
                            { id: 'src1', label: 'Direct' },
                            { id: 'src2', label: 'Social' },
                            { id: 'mid1', label: 'Landing' },
                            { id: 'mid2', label: 'Product' },
                            { id: 'end1', label: 'Purchase' },
                            { id: 'end2', label: 'Drop' }
                        ]}
                        links={[
                            { source: 'src1', target: 'mid1', value: 50 },
                            { source: 'src2', target: 'mid1', value: 30 },
                            { source: 'src2', target: 'mid2', value: 20 },
                            { source: 'mid1', target: 'end1', value: 40 },
                            { source: 'mid1', target: 'end2', value: 40 },
                            { source: 'mid2', target: 'end1', value: 15 },
                            { source: 'mid2', target: 'end2', value: 5 }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>NetworkGraph</h3>
                    <p>Relationship mapping</p>
                </div>
                <div className="app-card-body">
                    <NetworkGraph
                        nodes={[
                            { id: '1', x: 300, y: 200, label: 'Hub', type: 'hub' },
                            { id: '2', x: 200, y: 100, label: 'Node A' },
                            { id: '3', x: 400, y: 100, label: 'Node B' },
                            { id: '4', x: 200, y: 300, label: 'Node C' },
                            { id: '5', x: 400, y: 300, label: 'Node D' },
                            { id: '6', x: 100, y: 200, label: 'Edge 1' },
                            { id: '7', x: 500, y: 200, label: 'Edge 2' },
                        ]}
                        links={[
                            { source: '1', target: '2' },
                            { source: '1', target: '3' },
                            { source: '1', target: '4' },
                            { source: '1', target: '5' },
                            { source: '2', target: '6' },
                            { source: '3', target: '7' },
                            { source: '4', target: '6' },
                            { source: '5', target: '7' },
                        ]}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: '1 / -1' }}>
                <div className="app-card-header">
                    <h3>Timeline</h3>
                    <p>Event history</p>
                </div>
                <div className="app-card-body">
                    <Timeline
                        items={[
                            { id: '1', time: '2024 Q1', title: 'Project Start', detail: 'Initial kickoff', status: 'done' },
                            { id: '2', time: 'Feb 2024', title: 'Design Phase', detail: 'UI/UX Mockups', status: 'done' },
                            { id: '3', time: 'Mar 2024', title: 'Development', detail: 'Core implementation', status: 'done' },
                            { id: '4', time: 'Apr 2024', title: 'Alpha Release', detail: 'Internal testing', status: 'active' },
                            { id: '5', time: 'May 2024', title: 'Beta Release', detail: 'Public beta' },
                            { id: '6', time: 'Jun 2024', title: 'Launch', detail: 'Global rollout' }
                        ]}
                    />
                </div>
            </div>
            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>OrgChart</h3>
                    <p>Hierarchy view</p>
                </div>
                <div className="app-card-body">
                    <OrgChart
                        data={{
                            id: '1', name: 'CEO', role: 'Executive', children: [
                                {
                                    id: '2', name: 'CTO', role: 'Tech', children: [
                                        { id: '4', name: 'Dev Lead', role: 'Engineering' },
                                        { id: '5', name: 'QA Lead', role: 'Quality' }
                                    ]
                                },
                                {
                                    id: '3', name: 'CPO', role: 'Product', children: [
                                        { id: '6', name: 'PM', role: 'Strategy' }
                                    ]
                                }
                            ]
                        }}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>MindMap</h3>
                    <p>Idea branching</p>
                </div>
                <div className="app-card-body">
                    <MindMap
                        data={{
                            id: 'root', label: 'Central Idea', children: [
                                {
                                    id: 'b1', label: 'Branch A', children: [
                                        { id: 'l1', label: 'Leaf 1' },
                                        { id: 'l2', label: 'Leaf 2' }
                                    ]
                                },
                                {
                                    id: 'b2', label: 'Branch B', children: [
                                        { id: 'l3', label: 'Leaf 3' }
                                    ]
                                },
                                { id: 'b3', label: 'Branch C' }
                            ]
                        }}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>RadialNav</h3>
                    <p>Circular menu</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', justifyContent: 'center', minHeight: 200 }}>
                    <RadialNav
                        items={[
                            { id: '1', label: 'Home', icon: '🏠' },
                            { id: '2', label: 'Profile', icon: '👤' },
                            { id: '3', label: 'Settings', icon: '⚙️' },
                            { id: '4', label: 'Messages', icon: '✉️' },
                            { id: '5', label: 'Search', icon: '🔍' },
                        ]}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>DockMenu</h3>
                    <p>MacOS style dock</p>
                </div>
                <div className="app-card-body">
                    <DockMenu
                        items={[
                            { id: 'finder', label: 'Finder', icon: '😊' },
                            { id: 'launch', label: 'Launchpad', icon: '🚀' },
                            { id: 'safari', label: 'Safari', icon: '🧭' },
                            { id: 'messages', label: 'Messages', icon: '💬' },
                            { id: 'mail', label: 'Mail', icon: '✉️' },
                            { id: 'maps', label: 'Maps', icon: '🗺️' },
                            { id: 'photos', label: 'Photos', icon: '🖼️' },
                            { id: 'settings', label: 'Settings', icon: '⚙️' },
                        ]}
                    />
                </div>
            </div>

            <SidePanel
                isOpen={false} // Demo state, usually controlled by state
                onClose={() => { }}
                title="Panel Demo"
            >
                <div>Panel Content...</div>
            </SidePanel>
        </div>
    );
};
