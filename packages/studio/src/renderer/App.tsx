import { useState, useRef, useEffect } from 'react';
import { ChatPanel, ChatPanelRef } from '@/renderer/components/ChatPanel';
import { CanvasWorkspace, CanvasRef } from '@/renderer/canvas/CanvasWorkspace';
import { PropertiesPanel } from '@/renderer/components/PropertiesPanel';
import { FooterPanel } from '@/renderer/components/FooterPanel';
import { Toolbar } from '@/renderer/components/Toolbar';
import { FileExplorer } from '@/renderer/components/FileExplorer';
import { AgentStatusOverlay } from '@/renderer/components/AgentStatusOverlay';
import { AgentDropdown } from '@/renderer/components/AgentDropdown';
import { Dashboard } from '@/renderer/components/Dashboard';
import { DashboardDetailView } from '@/renderer/components/DashboardDetailView';
import { NavigatorWithDashboards } from '@/renderer/components/NavigatorWithDashboards';
import { Layers } from '@/renderer/components/Layers';
import { ComponentGallery } from '@/renderer/components/ComponentGallery';
import { FileViewer } from '@/renderer/components/FileViewer';
import { Preview } from '@/renderer/components/Preview';
import { LayoutDashboard, Palette, Layers as LayersIcon, Eye } from 'lucide-react';
import { serializeDocument, parseDocument } from '@/shared/ApenFormat';
import '@/renderer/styles/App.css';

export default function App() {
    // Detect route from URL path
    const getInitialLayoutMode = (): 'design' | 'dashboard' | 'code' | 'preview' | 'dashboards' => {
        const path = window.location.pathname;
        if (path.includes('/dashboards')) return 'dashboards';
        if (path.includes('/navigator')) return 'dashboards';
        if (path.includes('/dashboard')) return 'dashboard';
        if (path.includes('/preview')) return 'preview';
        if (path.includes('/code')) return 'code';
        return 'design';
    };

    // Extract dashboard ID from URL if on detail route
    const getDashboardIdFromUrl = (): string | null => {
        const match = window.location.pathname.match(/^\/dashboard\/([a-z0-9-]+)$/i);
        return match ? match[1] : null;
    };

    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(getDashboardIdFromUrl());
    const [selectedPreviewElement, setSelectedPreviewElement] = useState<any>(null);
    const [activeTool, setActiveTool] = useState<'select' | 'rectangle' | 'ellipse' | 'text'>('select');
    const [activeSidebar, setActiveSidebar] = useState<'chat' | 'components' | 'files' | 'layers'>('chat');
    const [layoutMode, setLayoutMode] = useState<'design' | 'dashboard' | 'code' | 'preview' | 'dashboards'>(getInitialLayoutMode());
    const [isSyncing, setIsSyncing] = useState(false);
    const [workspacePath, setWorkspacePath] = useState<string | null>(null);
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const [fileRevision, setFileRevision] = useState(0);
    const [isBridgeReady, setIsBridgeReady] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [currentFileName, setCurrentFileName] = useState<string>('Untitled.apen');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [canvasLayers, setCanvasLayers] = useState<Array<{ id: string; name: string; type: string; visible: boolean; locked: boolean }>>([]);
    const [previewUrl, setPreviewUrl] = useState<string>('http://localhost:5173');
    const canvasRef = useRef<CanvasRef>(null);
    const chatPanelRef = useRef<ChatPanelRef>(null);

    // Resizable Panel State
    const [leftWidth, setLeftWidth] = useState(380);
    const [rightWidth, setRightWidth] = useState(320);
    const [footerHeight, setFooterHeight] = useState(250);
    const [isFooterExpanded, setIsFooterExpanded] = useState(false);
    const [resizing, setResizing] = useState<'left' | 'right' | 'footer' | null>(null);

    useEffect(() => {
        if (!resizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();

            if (resizing === 'left') {
                const newWidth = Math.max(200, Math.min(600, e.clientX));
                setLeftWidth(newWidth);
            } else if (resizing === 'right') {
                const newWidth = Math.max(200, Math.min(600, window.innerWidth - e.clientX));
                setRightWidth(newWidth);
            } else if (resizing === 'footer') {
                const newHeight = Math.max(40, Math.min(window.innerHeight * 0.6, window.innerHeight - e.clientY));
                setFooterHeight(newHeight);
                if (newHeight > 60) setIsFooterExpanded(true);
                if (newHeight <= 40) setIsFooterExpanded(false);
            }
        };

        const handleMouseUp = () => {
            setResizing(null);
        };

        // Set cursor on body for consistent UX during drag
        document.body.style.cursor = resizing === 'footer' ? 'row-resize' : 'col-resize';
        document.body.style.userSelect = 'none';

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing]);

    // Bridge Status Check
    useEffect(() => {
        const checkBridge = () => {
            const ready = !!(window.coordinator && window.claudeCode);
            setIsBridgeReady(ready);
            return ready;
        };

        if (!checkBridge()) {
            const timer = setInterval(checkBridge, 1000);
            return () => clearInterval(timer);
        }
    }, []);

    // Session Tracking
    useEffect(() => {
        if (!window.claudeCode) return;
        const unsub = window.claudeCode.onSessionCreated(({ sessionId }: { sessionId: string }) => {
            setActiveSessionId(sessionId);
        });
        return unsub;
    }, []);

    // Studio Control API - Claude Code can control the UI
    useEffect(() => {
        if (!window.studioControl) return;

        const unsubLayout = window.studioControl.onLayoutModeChange((mode) => {
            console.log('[StudioControl] Layout mode change:', mode);
            setLayoutMode(mode as 'design' | 'dashboard' | 'code' | 'preview' | 'dashboards');
        });

        const unsubOpenFile = window.studioControl.onOpenFile((filePath) => {
            console.log('[StudioControl] Open file:', filePath);
            setSelectedFilePath(filePath);
            setLayoutMode('code');
        });

        const unsubTerminal = window.studioControl.onRunTerminalCommand((command) => {
            console.log('[StudioControl] Run terminal command:', command);
            // Expand footer and send command to terminal
            setIsFooterExpanded(true);
            if (window.terminal) {
                window.terminal.sendInput(command + '\n');
            }
        });

        const unsubRefresh = window.studioControl.onRefreshPreview(() => {
            console.log('[StudioControl] Refresh preview');
            // Increment file revision to trigger preview refresh
            setFileRevision(prev => prev + 1);
        });

        const unsubPreviewUrl = window.studioControl.onPreviewUrlChange((url) => {
            console.log('[StudioControl] Preview URL change:', url);
            setPreviewUrl(url);
            setLayoutMode('preview');
        });

        return () => {
            unsubLayout();
            unsubOpenFile();
            unsubTerminal();
            unsubRefresh();
            unsubPreviewUrl();
        };
    }, []);

    // Update URL when layout mode changes
    useEffect(() => {
        const pathMap: Record<typeof layoutMode, string> = {
            'design': '/',
            'dashboard': selectedDashboardId ? `/dashboard/${selectedDashboardId}` : '/dashboard',
            'code': '/code',
            'preview': '/preview',
            'dashboards': '/dashboards'
        };

        const newPath = pathMap[layoutMode];
        if (window.location.pathname !== newPath) {
            window.history.pushState({}, '', newPath);
        }
    }, [layoutMode, selectedDashboardId]);

    // Handle browser back/forward
    useEffect(() => {
        const handlePopState = () => {
            const newLayoutMode = getInitialLayoutMode();
            const newDashboardId = getDashboardIdFromUrl();
            setLayoutMode(newLayoutMode);
            setSelectedDashboardId(newDashboardId);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if user is typing in an input
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            // Tool shortcuts (only in design mode)
            if (layoutMode === 'design' && !e.metaKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'v':
                        setActiveTool('select');
                        break;
                    case 'r':
                        setActiveTool('rectangle');
                        break;
                    case 'o':
                        setActiveTool('ellipse');
                        break;
                    case 't':
                        setActiveTool('text');
                        break;
                    case 'delete':
                    case 'backspace':
                        if (selectedObject && canvasRef.current) {
                            canvasRef.current.deleteSelected?.();
                            setSelectedObject(null);
                            setHasUnsavedChanges(true);
                        }
                        break;
                }
            }

            // Global shortcuts
            if (e.metaKey || e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        handleSave();
                        break;
                    case 'o':
                        e.preventDefault();
                        handleOpen();
                        break;
                    case 'd':
                        if (layoutMode === 'design' && selectedObject && canvasRef.current) {
                            e.preventDefault();
                            canvasRef.current.duplicateSelected?.();
                            setHasUnsavedChanges(true);
                        }
                        break;
                    case 'z':
                        if (layoutMode === 'design' && canvasRef.current) {
                            e.preventDefault();
                            if (e.shiftKey) {
                                canvasRef.current.redo?.();
                            } else {
                                canvasRef.current.undo?.();
                            }
                        }
                        break;
                }
            }

            // Escape to deselect
            if (e.key === 'Escape') {
                setSelectedObject(null);
                setSelectedPreviewElement(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [layoutMode, selectedObject]);

    // Agent Activity Awareness
    useEffect(() => {
        if (!window.coordinator) return;

        const unsub = window.coordinator.onUpdate((state) => {
            // Increment revision if agents are busy or have locked files
            const isAgentActive = state.agents.some((a: any) => a.status === 'busy' || a.lockedFiles?.length > 0);
            if (isAgentActive) {
                setFileRevision(prev => prev + 1);
            }
        });

        return unsub;
    }, []);

    // MCP Automated Design Actions
    useEffect(() => {
        if (!window.canvas) return;

        const cleanup = window.canvas.onAddAutomated(({ provider, widgetId, name }) => {
            console.log('MCP Automated Add:', provider, widgetId, name);
            if (canvasRef.current) {
                canvasRef.current.addComponent('sofia-widget', name || widgetId);
            }
        });

        const cleanupSelection = window.canvas.onRequestSelection(({ requestId, instruction }) => {
            console.log('MCP Selection Requested:', instruction);
            // If something is already selected, use it. Otherwise, we inform the user.
            if (selectedObject && window.canvas) {
                window.canvas.respondToSelection(requestId, {
                    id: selectedObject.id,
                    name: selectedObject.name,
                    type: selectedObject.componentType
                });
            } else {
                // Show a small notification to the user (optional, they see it in Claude Code usually)
                console.warn('Selection requested but nothing selected. Instruction:', instruction);
            }
        });

        return () => {
            cleanup();
            cleanupSelection();
        };
    }, [selectedObject]);


    // AgentPing Integration
    useEffect(() => {
        if (!window.agentPing) return;

        const cleanup = window.agentPing.onPing(async (ping) => {
            console.log('Received Ping:', ping);

            // Handle Canvas Interactions via MCP
            if (ping.type === 'canvas_interaction') {
                const payload = ping.payload as {
                    action?: string;
                    componentType?: string;
                    componentName?: string;
                    props?: {
                        provider?: string;
                        widgetId?: string;
                    };
                };

                if (
                    payload.action === 'render' &&
                    payload.componentType === 'sofia-widget' &&
                    payload.props?.provider === 'sofia' &&
                    payload.props.widgetId &&
                    canvasRef.current
                ) {
                    // Execute the render on the canvas
                    const widgetId = payload.props.widgetId;
                    canvasRef.current.addComponent('sofia-widget', payload.componentName || widgetId);

                    // Auto-respond to the ping to unblock the agent
                    // In a real app, we might wait for user approval or interaction or return an object ID
                    await window.agentPing?.respond(ping.id, {
                        action: 'custom',
                        data: { success: true, objectId: `sofia-widget-${widgetId}-${Date.now()}` }
                    });
                }
            }
        });

        return cleanup;
    }, []);

    // Sync Canvas State to Coordinator
    const syncCanvasState = async () => {
        if (!window.coordinator || !canvasRef.current || isSyncing) return;
        setIsSyncing(true);
        const doc = canvasRef.current.toJSON();
        // @ts-ignore
        await window.coordinator.createTask('Sync Canvas State', [serializeDocument(doc)]);
        setIsSyncing(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (layoutMode === 'design') syncCanvasState();
        }, 5000); // Sync every 5 seconds if changed
        return () => clearInterval(interval);
    }, [layoutMode]);

    const handleSave = async () => {
        if (!window.fileSystem || !canvasRef.current) return;
        const doc = canvasRef.current.toJSON();
        const content = serializeDocument(doc);
        const result = await window.fileSystem.saveFile(content);
        if (result.success && result.filePath) {
            console.log('Saved to', result.filePath);
            const fileName = result.filePath.split('/').pop() || 'Untitled.apen';
            setCurrentFileName(fileName);
            setHasUnsavedChanges(false);
        }
    };

    const handleOpen = async () => {
        if (!window.fileSystem || !canvasRef.current) return;
        const result = await window.fileSystem.openFile();
        if (result.success && result.content) {
            const doc = parseDocument(result.content);
            canvasRef.current.loadFromJSON(doc);
            if (result.filePath) {
                const fileName = result.filePath.split('/').pop() || 'Untitled.apen';
                setCurrentFileName(fileName);
            }
            setHasUnsavedChanges(false);
        }
    };

    const handleAddComponent = (type: string, name: string) => {
        if (canvasRef.current) {
            canvasRef.current.addComponent(type, name);
            setHasUnsavedChanges(true);
            // Sync layers after adding component
            setTimeout(() => setCanvasLayers(canvasRef.current?.getLayers() || []), 50);
        }
    };

    const handleFileSelect = (path: string) => {
        console.log('Selected file:', path);
        setSelectedFilePath(path);
        setLayoutMode('code'); // Switch to code view when a file is selected
    };

    const handlePreviewElementSelected = (element: any) => {
        setSelectedPreviewElement(element);
        // Clear canvas selection when selecting preview element
        setSelectedObject(null);
    };

    const handleCanvasObjectSelected = (object: any) => {
        setSelectedObject(object);
        // Clear preview selection when selecting canvas object
        setSelectedPreviewElement(null);
        // Sync layers whenever canvas state might have changed
        setCanvasLayers(canvasRef.current?.getLayers() || []);
    };

    const handleCloseFileViewer = () => {
        setSelectedFilePath(null);
        setLayoutMode('design');
    };

    return (
        <div className={`studio-app ${resizing ? 'resizing' : ''}`}>
            {/* Integrated Header with Title and Toolbar */}
            <header className="studio-titlebar">
                <div className="titlebar-drag-region" />
                <span className="titlebar-title">
                    {'AgentPing Studio'.split('').map((letter, index) => (
                        <span
                            key={index}
                            className={`title-letter${letter === ' ' ? ' space' : ''}`}
                            style={{ '--letter-index': index } as React.CSSProperties}
                        >
                            {letter === ' ' ? '\u00A0' : letter}
                        </span>
                    ))}
                </span>
                <Toolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    onSave={handleSave}
                    onOpen={handleOpen}
                    onToggleSidebar={setActiveSidebar}
                    activeSidebar={activeSidebar}
                    layoutMode={layoutMode}
                    onLayoutModeChange={setLayoutMode}
                    onToggleTerminal={() => setIsFooterExpanded(!isFooterExpanded)}
                    isTerminalOpen={isFooterExpanded}
                    fileName={currentFileName}
                    hasUnsavedChanges={hasUnsavedChanges}
                />
                <div className="header-right">
                    <AgentDropdown />
                    <div className={`bridge-status ${isBridgeReady ? 'connected' : 'disconnected'}`}>
                        <div className="status-indicator" />
                        <span>{isBridgeReady ? 'Mission Link Active' : 'Offline'}</span>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="studio-main">

                {/* Left: Chat or Components or Files */}
                <aside className="studio-sidebar studio-sidebar-left" style={{ width: leftWidth }}>
                    {activeSidebar === 'chat' ? (
                        <ChatPanel
                            ref={chatPanelRef}
                            isBridgeReady={isBridgeReady}
                            workspacePath={workspacePath}
                            onGetCanvasState={() => canvasRef.current?.toJSON()}
                            onWorkspaceChange={(path) => {
                                setWorkspacePath(path);
                            }}
                            onToggleSidebar={setActiveSidebar}
                            activeSidebar={activeSidebar}
                        />
                    ) : activeSidebar === 'components' ? (
                        <ComponentGallery onAddComponent={handleAddComponent} />
                    ) : activeSidebar === 'files' ? (
                        <FileExplorer
                            onFileSelect={handleFileSelect}
                            workspacePath={workspacePath}
                            onToggleSidebar={setActiveSidebar}
                            activeSidebar={activeSidebar}
                        />
                    ) : (
                        <Layers
                            canvasObjects={canvasLayers}
                            selectedLayerId={selectedObject?.id}
                            onSelectLayer={(id) => {
                                canvasRef.current?.selectLayer(id);
                            }}
                            onToggleVisibility={(id, visible) => {
                                canvasRef.current?.setLayerVisibility(id, visible);
                                setCanvasLayers(canvasRef.current?.getLayers() || []);
                            }}
                            onToggleLock={(id, locked) => {
                                canvasRef.current?.setLayerLock(id, locked);
                                setCanvasLayers(canvasRef.current?.getLayers() || []);
                            }}
                            onDeleteLayer={(id) => {
                                canvasRef.current?.deleteLayer(id);
                                setCanvasLayers(canvasRef.current?.getLayers() || []);
                                setHasUnsavedChanges(true);
                            }}
                            onReorderLayers={(layers) => {
                                canvasRef.current?.reorderLayers(layers.map(l => l.id));
                                setCanvasLayers(canvasRef.current?.getLayers() || []);
                                setHasUnsavedChanges(true);
                            }}
                        />
                    )}
                </aside>

                {/* Left Resize Handle */}
                <div
                    className={`resize-handle vertical left ${resizing === 'left' ? 'active' : ''}`}
                    onMouseDown={() => setResizing('left')}
                />

                {/* Center: Canvas */}
                <main className="studio-canvas-container">

                    {layoutMode === 'dashboard' ? (
                        selectedDashboardId ? (
                            <DashboardDetailView
                                dashboardId={selectedDashboardId}
                                onBack={() => {
                                    setSelectedDashboardId(null);
                                    setLayoutMode('dashboard');
                                }}
                            />
                        ) : (
                            <Dashboard />
                        )
                    ) : layoutMode === 'dashboards' ? (
                        <NavigatorWithDashboards
                            onSelectDashboard={(dashboardId) => {
                                setSelectedDashboardId(dashboardId);
                                setLayoutMode('dashboard');
                            }}
                        />
                    ) : layoutMode === 'preview' ? (
                        <Preview
                            onElementSelected={handlePreviewElementSelected}
                            selectedElement={selectedPreviewElement}
                            initialUrl={previewUrl}
                        />
                    ) : layoutMode === 'code' ? (
                        <FileViewer
                            filePath={selectedFilePath}
                            onClose={handleCloseFileViewer}
                            revision={fileRevision}
                        />
                    ) : (
                        <CanvasWorkspace
                            ref={canvasRef}
                            activeTool={activeTool}
                            onObjectSelected={handleCanvasObjectSelected}
                        />
                    )}

                </main>

                {/* Right Resize Handle */}
                <div
                    className={`resize-handle vertical right ${resizing === 'right' ? 'active' : ''}`}
                    onMouseDown={() => setResizing('right')}
                />

                {/* Right: Properties Panel */}
                <aside className="studio-sidebar studio-sidebar-right" style={{ width: rightWidth }}>
                    <PropertiesPanel
                        selectedObject={selectedObject}
                        selectedPreviewElement={selectedPreviewElement}
                        onRefactor={(el) => {
                            if (window.coordinator) {
                                window.coordinator.createTask(`Refactor requested for <${el.tagName.toLowerCase()}> with class "${el.className}". User intent: Modify this component.`, []);
                            }
                        }}
                        onEditWithChat={(element, instruction) => {
                            // Switch to chat sidebar if not already there
                            setActiveSidebar('chat');
                            // Use setTimeout to ensure ChatPanel is mounted before calling
                            setTimeout(() => {
                                chatPanelRef.current?.handleEditElement(element, instruction);
                            }, 100);
                        }}
                    />

                </aside>
            </div>

            {/* Horizontal Resize Handle */}
            <div
                className={`resize-handle horizontal ${resizing === 'footer' ? 'active' : ''}`}
                onMouseDown={() => setResizing('footer')}
            />

            {/* Bottom: Footer Panel with Terminal & Diagnostics */}
            <footer className="studio-footer" style={{ height: isFooterExpanded ? footerHeight : 40 }}>
                <FooterPanel
                    isExpanded={isFooterExpanded}
                    onToggleExpand={setIsFooterExpanded}
                    activeSessionId={activeSessionId}
                    workspacePath={workspacePath}
                    onOpenPreviewUrl={(url) => {
                        setPreviewUrl(url);
                        setLayoutMode('preview');
                    }}
                />
            </footer>
        </div>
    );
}
