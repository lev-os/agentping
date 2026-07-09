import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, MouseEvent, useState } from 'react';
import { Canvas, Rect, Ellipse, IText, FabricObject, Group, Point, util } from 'fabric';
import { createEmptyDocument, ApenDocument, ApenObject } from '../../shared/ApenFormat';
import type { LayerItem, LayerType } from '@/renderer/components/Layers';
import './CanvasWorkspace.css';

// Helper to create visually distinct component representations
const createComponentObject = (type: string, name: string, x: number, y: number): FabricObject => {
    let fill = '#222230';
    let stroke = '#00ffaa';
    let width = 140;
    let height = 80;
    let rx = 8;

    // Theming based on category
    if (['token-stream', 'brain-activity', 'model-selector'].includes(type)) {
        fill = 'rgba(0, 212, 255, 0.15)';
        stroke = '#00d4ff';
    } else if (['health-gauge', 'log-stream', 'docker-stats'].includes(type)) {
        fill = 'rgba(255, 170, 0, 0.1)';
        stroke = '#ffaa00';
    } else if (['order-book', 'candlestick', 'trade-history'].includes(type)) {
        fill = 'rgba(0, 255, 170, 0.1)';
        stroke = '#00ffaa';
    }

    const rect = new Rect({
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        fill,
        stroke,
        strokeWidth: 2,
        rx,
        ry: rx,
        // @ts-ignore
        shadow: { color: 'rgba(0,0,0,0.3)', blur: 10, offsetX: 0, offsetY: 4 }
    });

    const label = new IText(name, {
        left: x - width / 2 + 10,
        top: y - height / 2 + 10,
        fontSize: 12,
        fill: '#ffffff',
        fontFamily: 'Inter',
        fontWeight: 'bold'
    });

    const typeLabel = new IText(type.toUpperCase(), {
        left: x - width / 2 + 10,
        top: y - height / 2 + 30,
        fontSize: 9,
        fill: 'rgba(255,255,255,0.4)',
        fontFamily: 'JetBrains Mono',
    });

    const group = new Group([rect, label, typeLabel], {
        // @ts-ignore
        id: (util as any).uuid?.() || Math.random().toString(36).substring(2, 9),
        name: name,
        // @ts-ignore
        componentType: type
    });

    return group;
};


interface CanvasWorkspaceProps {
    activeTool: 'select' | 'rectangle' | 'ellipse' | 'text';
    onObjectSelected: (object: FabricObject | null) => void;
}

export interface CanvasRef {
    toJSON: () => ApenDocument;
    loadFromJSON: (doc: ApenDocument) => void;
    addComponent: (type: string, name: string) => void;
    deleteSelected: () => void;
    duplicateSelected: () => void;
    undo: () => void;
    redo: () => void;
    resetZoom: () => void;
    fitToContent: () => void;
    // Layer management
    getLayers: () => LayerItem[];
    setLayerVisibility: (id: string, visible: boolean) => void;
    setLayerLock: (id: string, locked: boolean) => void;
    deleteLayer: (id: string) => void;
    selectLayer: (id: string) => void;
    reorderLayers: (orderedIds: string[]) => void;
}

const toLayerType = (type: string | undefined): LayerType => {
    switch (type) {
        case 'rectangle':
        case 'rect':
            return 'rectangle';
        case 'ellipse':
        case 'circle':
            return 'ellipse';
        case 'text':
        case 'i-text':
        case 'textbox':
            return 'text';
        case 'image':
            return 'image';
        case 'frame':
            return 'frame';
        case 'group':
        default:
            return 'group';
    }
};

export const CanvasWorkspace = forwardRef<CanvasRef, CanvasWorkspaceProps>(({ activeTool, onObjectSelected }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<Canvas | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef(-1);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        toJSON: () => {
            if (!fabricRef.current) return createEmptyDocument();

            const canvas = fabricRef.current;
            const doc = createEmptyDocument();
            const objects = canvas.getObjects();

            doc.pages[0].objects = objects.map(obj => {
                const base: any = {
                    id: (obj as any).id || (util as any).uuid?.() || Math.random().toString(36).substring(2, 9),
                    x: obj.left,
                    y: obj.top,
                    rotation: obj.angle,
                    opacity: obj.opacity,
                    locked: obj.lockMovementX,
                    visible: obj.visible,
                    name: (obj as any).name,
                };

                if (obj instanceof Rect) {
                    return {
                        ...base,
                        type: 'rectangle',
                        width: obj.width * obj.scaleX,
                        height: obj.height * obj.scaleY,
                        cornerRadius: obj.rx,
                        fill: { type: 'solid', color: obj.fill as string },
                        stroke: { color: obj.stroke as string, width: obj.strokeWidth }
                    } as ApenObject;
                } else if (obj instanceof Ellipse) {
                    return {
                        ...base,
                        type: 'ellipse',
                        radiusX: obj.rx * obj.scaleX,
                        radiusY: obj.ry * obj.scaleY,
                        fill: { type: 'solid', color: obj.fill as string },
                        stroke: { color: obj.stroke as string, width: obj.strokeWidth }
                    } as ApenObject;
                } else if (obj instanceof IText) {
                    return {
                        ...base,
                        type: 'text',
                        content: obj.text,
                        fontFamily: obj.fontFamily,
                        fontSize: obj.fontSize,
                        fill: obj.fill as string,
                    } as ApenObject;
                }
                return base;
            }).filter(obj => obj.type);

            return doc;
        },
        loadFromJSON: (doc: ApenDocument) => {
            if (!fabricRef.current || !doc.pages[0]) return;
            const canvas = fabricRef.current;
            canvas.clear();

            doc.pages[0].objects.forEach(obj => {
                let fabricObj: FabricObject | null = null;

                if (obj.type === 'rectangle') {
                    fabricObj = new Rect({
                        left: obj.x,
                        top: obj.y,
                        width: obj.width,
                        height: obj.height,
                        fill: (obj as any).fill?.color || '#00ffaa',
                        rx: (obj as any).cornerRadius,
                        ry: (obj as any).cornerRadius,
                        angle: obj.rotation,
                        opacity: obj.opacity,
                    });
                } else if (obj.type === 'ellipse') {
                    fabricObj = new Ellipse({
                        left: obj.x,
                        top: obj.y,
                        rx: obj.radiusX,
                        ry: obj.radiusY,
                        fill: (obj as any).fill?.color || '#00d4ff',
                        angle: obj.rotation,
                        opacity: obj.opacity,
                    });
                } else if (obj.type === 'text') {
                    fabricObj = new IText(obj.content, {
                        left: obj.x,
                        top: obj.y,
                        fontSize: obj.fontSize,
                        fontFamily: obj.fontFamily,
                        fill: obj.fill,
                        angle: obj.rotation,
                    });
                }

                if (fabricObj) {
                    (fabricObj as any).id = obj.id;
                    canvas.add(fabricObj);
                }
            });

            canvas.renderAll();
        },
        addComponent: (type: string, name: string) => {
            if (!fabricRef.current) return;
            const canvas = fabricRef.current;
            const center = canvas.getCenterPoint();
            const obj = createComponentObject(type, name, center.x, center.y);

            if (obj) {
                canvas.add(obj);
                canvas.setActiveObject(obj);
                canvas.requestRenderAll();
                saveHistory();
            }
        },
        deleteSelected: () => {
            if (!fabricRef.current) return;
            const canvas = fabricRef.current;
            const activeObjects = canvas.getActiveObjects();
            if (activeObjects.length > 0) {
                activeObjects.forEach(obj => canvas.remove(obj));
                canvas.discardActiveObject();
                canvas.requestRenderAll();
                saveHistory();
            }
        },
        duplicateSelected: () => {
            if (!fabricRef.current) return;
            const canvas = fabricRef.current;
            const activeObject = canvas.getActiveObject();
            if (!activeObject) return;

            activeObject.clone().then((cloned: FabricObject) => {
                cloned.set({
                    left: (activeObject.left || 0) + 20,
                    top: (activeObject.top || 0) + 20,
                });
                (cloned as any).id = (util as any).uuid?.() || Math.random().toString(36).substring(2, 9);
                canvas.add(cloned);
                canvas.setActiveObject(cloned);
                canvas.requestRenderAll();
                onObjectSelected(cloned);
                saveHistory();
            });
        },
        undo: () => {
            if (historyIndexRef.current > 0) {
                historyIndexRef.current--;
                loadFromHistory();
            }
        },
        redo: () => {
            if (historyIndexRef.current < historyRef.current.length - 1) {
                historyIndexRef.current++;
                loadFromHistory();
            }
        },
        resetZoom: () => {
            if (!fabricRef.current) return;
            const canvas = fabricRef.current;
            canvas.setZoom(1);
            canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
            canvas.requestRenderAll();
            setZoomLevel(100);
        },
        fitToContent: () => {
            if (!fabricRef.current || !containerRef.current) return;
            const canvas = fabricRef.current;
            const objects = canvas.getObjects();
            if (objects.length === 0) return;

            // Get bounding box of all objects
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            objects.forEach(obj => {
                const bounds = obj.getBoundingRect();
                minX = Math.min(minX, bounds.left);
                minY = Math.min(minY, bounds.top);
                maxX = Math.max(maxX, bounds.left + bounds.width);
                maxY = Math.max(maxY, bounds.top + bounds.height);
            });

            const contentWidth = maxX - minX;
            const contentHeight = maxY - minY;
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            const scaleX = (containerWidth - 80) / contentWidth;
            const scaleY = (containerHeight - 80) / contentHeight;
            const zoom = Math.min(scaleX, scaleY, 2);

            canvas.setZoom(zoom);
            const vpCenter = canvas.getCenterPoint();
            const objectCenter = {
                x: (minX + maxX) / 2,
                y: (minY + maxY) / 2
            };
            canvas.viewportTransform![4] = vpCenter.x - objectCenter.x * zoom;
            canvas.viewportTransform![5] = vpCenter.y - objectCenter.y * zoom;
            canvas.requestRenderAll();
            setZoomLevel(Math.round(zoom * 100));
        },
        // Layer management methods
        getLayers: () => {
            if (!fabricRef.current) return [];
            const objects = fabricRef.current.getObjects();
            return objects.map((obj: any): LayerItem => ({
                id: obj.id || 'unknown',
                name: obj.name || '',
                type: toLayerType(obj.type),
                visible: obj.visible !== false,
                locked: obj.lockMovementX === true && obj.lockMovementY === true
            })).reverse(); // Reverse so top layers appear first
        },
        setLayerVisibility: (id: string, visible: boolean) => {
            if (!fabricRef.current) return;
            const objects = fabricRef.current.getObjects();
            const obj = objects.find((o: any) => o.id === id);
            if (obj) {
                obj.set('visible', visible);
                fabricRef.current.requestRenderAll();
            }
        },
        setLayerLock: (id: string, locked: boolean) => {
            if (!fabricRef.current) return;
            const objects = fabricRef.current.getObjects();
            const obj = objects.find((o: any) => o.id === id);
            if (obj) {
                obj.set({
                    lockMovementX: locked,
                    lockMovementY: locked,
                    lockRotation: locked,
                    lockScalingX: locked,
                    lockScalingY: locked,
                    selectable: !locked
                });
                fabricRef.current.requestRenderAll();
            }
        },
        deleteLayer: (id: string) => {
            if (!fabricRef.current) return;
            const objects = fabricRef.current.getObjects();
            const obj = objects.find((o: any) => o.id === id);
            if (obj) {
                fabricRef.current.remove(obj);
                fabricRef.current.requestRenderAll();
                saveHistory();
            }
        },
        selectLayer: (id: string) => {
            if (!fabricRef.current) return;
            const objects = fabricRef.current.getObjects();
            const obj = objects.find((o: any) => o.id === id);
            if (obj && obj.selectable !== false) {
                fabricRef.current.setActiveObject(obj);
                fabricRef.current.requestRenderAll();
                onObjectSelected(obj);
            }
        },
        reorderLayers: (orderedIds: string[]) => {
            if (!fabricRef.current) return;
            const canvas = fabricRef.current;
            const objects = canvas.getObjects();

            // Create a map of id to object
            const objMap = new Map<string, any>();
            objects.forEach((obj: any) => {
                if (obj.id) objMap.set(obj.id, obj);
            });

            // Reorder - IDs come in top-to-bottom order, so reverse for fabric
            const reversedIds = [...orderedIds].reverse();

            // Remove all objects and re-add in new order
            const reorderedObjects = reversedIds
                .map(id => objMap.get(id))
                .filter((obj): obj is any => obj !== undefined);

            // Use sendToBack for each in reverse order to achieve correct stacking
            reorderedObjects.forEach((obj) => {
                canvas.bringObjectToFront(obj);
            });

            canvas.requestRenderAll();
            saveHistory();
        }
    }));

    // History management
    const saveHistory = useCallback(() => {
        if (!fabricRef.current) return;
        const json = JSON.stringify(fabricRef.current.toJSON());
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        historyRef.current.push(json);
        historyIndexRef.current++;
        // Limit history to 50 states
        if (historyRef.current.length > 50) {
            historyRef.current.shift();
            historyIndexRef.current--;
        }
    }, []);

    const loadFromHistory = useCallback(() => {
        if (!fabricRef.current) return;
        const json = historyRef.current[historyIndexRef.current];
        if (!json) return;
        fabricRef.current.loadFromJSON(JSON.parse(json)).then(() => {
            fabricRef.current?.requestRenderAll();
        });
    }, []);

    // Initialize Fabric canvas
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const canvas = new Canvas(canvasRef.current, {
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 'transparent',
            selection: true,
            preserveObjectStacking: true,
            snapAngle: 15,
            selectionColor: 'rgba(0, 255, 170, 0.1)',
            selectionBorderColor: '#00ffaa',
            selectionLineWidth: 1,
        });

        // Set global object styles for "Cyber" look
        // @ts-ignore
        Rect.prototype.set({
            cornerColor: '#00ffaa',
            cornerStyle: 'circle',
            cornerStrokeColor: '#0a0a0f',
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#00ffaa',
            borderScaleFactor: 1.5,
            borderDashArray: [4, 4],
            padding: 5
        });

        // @ts-ignore
        Ellipse.prototype.set({
            cornerColor: '#00d4ff',
            cornerStyle: 'circle',
            cornerStrokeColor: '#0a0a0f',
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#00d4ff',
            borderScaleFactor: 1.5,
            borderDashArray: [4, 4],
            padding: 5
        });

        // @ts-ignore
        IText.prototype.set({
            cornerColor: '#ffffff',
            cornerStyle: 'circle',
            cornerStrokeColor: '#0a0a0f',
            cornerSize: 8,
            transparentCorners: false,
            borderColor: '#ffffff',
            borderScaleFactor: 1.5,
            padding: 5
        });

        fabricRef.current = canvas;

        // Selection events
        canvas.on('selection:created', (e) => {
            onObjectSelected(e.selected?.[0] || null);
        });

        canvas.on('selection:updated', (e) => {
            onObjectSelected(e.selected?.[0] || null);
        });

        canvas.on('selection:cleared', () => {
            onObjectSelected(null);
        });

        canvas.on('object:modified', (e) => {
            if (e.target) {
                onObjectSelected(e.target);
            }
        });

        // Snap to grid logic
        const GRID_SIZE = 20;
        canvas.on('object:moving', (options) => {
            if (options.target) {
                options.target.set({
                    left: Math.round(options.target.left / GRID_SIZE) * GRID_SIZE,
                    top: Math.round(options.target.top / GRID_SIZE) * GRID_SIZE
                });
            }
        });

        canvas.on('object:scaling', (options) => {
            if (options.target) {
                const target = options.target;
                const w = target.width * target.scaleX;
                const h = target.height * target.scaleY;
                const snapW = Math.round(w / GRID_SIZE) * GRID_SIZE;
                const snapH = Math.round(h / GRID_SIZE) * GRID_SIZE;
                target.set({
                    scaleX: snapW / target.width,
                    scaleY: snapH / target.height
                });
            }
        });

        const handleResize = () => {
            if (!containerRef.current) return;
            canvas.setDimensions({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
            });
            canvas.renderAll();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, [onObjectSelected]);

    // Handle drawing new shapes
    const handleCanvasClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (!fabricRef.current || activeTool === 'select') return;

        const canvas = fabricRef.current;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let obj: FabricObject | null = null;

        switch (activeTool) {
            case 'rectangle':
                obj = new Rect({
                    left: x - 50,
                    top: y - 40,
                    fill: '#00ffaa',
                    width: 100,
                    height: 80,
                    rx: 4,
                    ry: 4,
                    stroke: '#00d4ff',
                    strokeWidth: 1,
                });
                break;

            case 'ellipse':
                obj = new Ellipse({
                    left: x - 50,
                    top: y - 40,
                    fill: '#00d4ff',
                    rx: 50,
                    ry: 40,
                    stroke: '#00ffaa',
                    strokeWidth: 1,
                });
                break;

            case 'text':
                obj = new IText('Type here...', {
                    left: x,
                    top: y,
                    fill: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 18,
                });
                break;
        }

        if (obj) {
            canvas.add(obj);
            canvas.setActiveObject(obj);
            canvas.renderAll();
            onObjectSelected(obj);
        }
    }, [activeTool, onObjectSelected]);

    // Handle drag and drop from ComponentGallery
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!fabricRef.current || !containerRef.current) return;

        const data = e.dataTransfer.getData('application/agentping-component');
        if (!data) return;

        try {
            const { type, name } = JSON.parse(data);
            const canvas = fabricRef.current;
            const pointer = canvas.getScenePoint(e.nativeEvent);

            const obj = createComponentObject(type, name, pointer.x, pointer.y);
            if (obj) {
                canvas.add(obj);
                canvas.setActiveObject(obj);
                canvas.requestRenderAll();
            }
        } catch (err) {
            console.error('Failed to parse dropped component data', err);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    // Zoom and Pan Handlers
    const handleWheel = useCallback((e: WheelEvent) => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;

        // Command + Wheel or Ctrl + Wheel for Zoom
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY;
            let zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;

            // Zoom to point
            const point = new Point(e.offsetX, e.offsetY);
            canvas.zoomToPoint(point, zoom);
        } else if (e.altKey) {
            // Alt + Wheel for Panning
            e.preventDefault();
            const vpt = canvas.viewportTransform;
            if (!vpt) return;
            vpt[4] -= e.deltaX; // Pan X
            vpt[5] -= e.deltaY; // Pan Y
            canvas.requestRenderAll();
        } else if (e.ctrlKey || e.metaKey) {
            // Update zoom level state
            setZoomLevel(Math.round(canvas.getZoom() * 100));
        }
    }, []);

    // Attach wheel listener natively to container because React's onWheel is passive by default sometimes
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const wheelHandler = (e: globalThis.WheelEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) {
                e.preventDefault(); // Prevent browser zoom
            }
            // invoke managed handler
            // @ts-ignore
            handleWheel(e);
        };

        container.addEventListener('wheel', wheelHandler, { passive: false });
        return () => container.removeEventListener('wheel', wheelHandler);
    }, [handleWheel]);


    // Zoom buttons
    const handleZoomIn = () => {
        if (!fabricRef.current) return;
        let zoom = fabricRef.current.getZoom();
        zoom *= 1.1;
        if (zoom > 20) zoom = 20;
        fabricRef.current.setZoom(zoom);
        fabricRef.current.requestRenderAll();
        setZoomLevel(Math.round(zoom * 100));
    };

    const handleZoomOut = () => {
        if (!fabricRef.current) return;
        let zoom = fabricRef.current.getZoom();
        zoom /= 1.1;
        if (zoom < 0.01) zoom = 0.01;
        fabricRef.current.setZoom(zoom);
        fabricRef.current.requestRenderAll();
        setZoomLevel(Math.round(zoom * 100));
    };

    const handleResetZoom = () => {
        if (!fabricRef.current) return;
        fabricRef.current.setZoom(1);
        fabricRef.current.viewportTransform = [1, 0, 0, 1, 0, 0];
        fabricRef.current.requestRenderAll();
        setZoomLevel(100);
    };

    return (
        <div
            ref={containerRef}
            className="canvas-workspace"
            onClick={handleCanvasClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <canvas ref={canvasRef} />

            {/* Canvas Grid Overlay */}
            <div className="canvas-grid" style={{ pointerEvents: 'none' }} />

            {/* Zoom Controls */}
            <div className="canvas-zoom-controls">
                <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">−</button>
                <button className="zoom-level" onClick={handleResetZoom} title="Reset Zoom">
                    {zoomLevel}%
                </button>
                <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">+</button>
            </div>
        </div>
    );
});
