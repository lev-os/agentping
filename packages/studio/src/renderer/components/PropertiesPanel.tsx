/**
 * Properties Panel Component
 *
 * Enhanced right sidebar showing properties of selected canvas object
 * with collapsible sections, computed styles, accessibility audit,
 * and advanced property editing capabilities.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Sparkles, ChevronDown, ChevronRight, Copy, Check, Palette, Hash,
    Move, Maximize2, Eye, EyeOff, Lock, Unlock, RotateCw, Settings,
    Type, Square, Circle, Layers, AlertTriangle, CheckCircle, Info,
    Box, Grid, Code, Download, Search, Accessibility, X, Zap,
    MessageSquare, Smartphone
} from 'lucide-react';
import { IconButton, SearchInput, Badge, Tooltip } from './ui';
import './PropertiesPanel.css';

interface PropertiesPanelProps {
    selectedObject: any;
    selectedPreviewElement?: any;
    onRefactor?: (element: any) => void;
    onPropertyChange?: (property: string, value: any) => void;
    onEditWithChat?: (element: any, instruction: string) => void;
}

type TabType = 'layout' | 'style' | 'advanced';

interface Section {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const SECTIONS: Section[] = [
    { id: 'info', label: 'Element Info', icon: <Info size={12} /> },
    { id: 'layout', label: 'Layout', icon: <Grid size={12} /> },
    { id: 'box', label: 'Box Model', icon: <Box size={12} /> },
    { id: 'style', label: 'Style', icon: <Palette size={12} /> },
    { id: 'typography', label: 'Typography', icon: <Type size={12} /> },
    { id: 'transform', label: 'Transform', icon: <RotateCw size={12} /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Accessibility size={12} /> },
    { id: 'metadata', label: 'Metadata', icon: <Settings size={12} /> },
];

export function PropertiesPanel({
    selectedObject,
    selectedPreviewElement,
    onRefactor,
    onPropertyChange,
    onEditWithChat,
}: PropertiesPanelProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [fill, setFill] = useState('#ffffff');
    const [stroke, setStroke] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [opacity, setOpacity] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [borderRadius, setBorderRadius] = useState({ tl: 0, tr: 0, br: 0, bl: 0 });
    const [isLocked, setIsLocked] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Enhanced features
    const [activeTab, setActiveTab] = useState<TabType>('layout');
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
    const [copiedProperty, setCopiedProperty] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showColorPicker, setShowColorPicker] = useState<'fill' | 'stroke' | null>(null);
    const [accessibilityIssues, setAccessibilityIssues] = useState<string[]>([]);

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedObject) {
            setPosition({ x: Math.round(selectedObject.left || 0), y: Math.round(selectedObject.top || 0) });
            setDimensions({
                width: Math.round(selectedObject.width * (selectedObject.scaleX || 1)),
                height: Math.round(selectedObject.height * (selectedObject.scaleY || 1)),
            });
            setFill(selectedObject.fill || '#ffffff');
            setStroke(selectedObject.stroke || '#000000');
            setStrokeWidth(selectedObject.strokeWidth || 1);
            setOpacity(Math.round((selectedObject.opacity || 1) * 100));
            setRotation(Math.round(selectedObject.angle || 0));
            setIsLocked(selectedObject.lockMovementX && selectedObject.lockMovementY);
            setIsVisible(selectedObject.visible !== false);
        }
    }, [selectedObject]);

    // Run accessibility audit for preview elements
    useEffect(() => {
        if (selectedPreviewElement) {
            const issues: string[] = [];
            const { tagName, textContent, rect } = selectedPreviewElement;

            // Check for common a11y issues
            if (tagName === 'IMG' && !selectedPreviewElement.alt) {
                issues.push('Missing alt attribute on image');
            }
            if (tagName === 'A' && !textContent?.trim()) {
                issues.push('Link has no accessible text');
            }
            if (tagName === 'BUTTON' && !textContent?.trim()) {
                issues.push('Button has no accessible text');
            }
            if (rect.width < 44 || rect.height < 44) {
                issues.push('Touch target too small (< 44px)');
            }

            setAccessibilityIssues(issues);
        }
    }, [selectedPreviewElement]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!panelRef.current?.contains(document.activeElement)) return;

            const isMod = e.metaKey || e.ctrlKey;

            // Export as JSON: Mod+E
            if (e.key === 'e' && isMod) {
                e.preventDefault();
                exportAsJson();
            }

            // Collapse all: Mod+[
            if (e.key === '[' && isMod) {
                e.preventDefault();
                setCollapsedSections(new Set(SECTIONS.map(s => s.id)));
            }

            // Expand all: Mod+]
            if (e.key === ']' && isMod) {
                e.preventDefault();
                setCollapsedSections(new Set());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedObject, selectedPreviewElement]);

    const toggleSection = useCallback((sectionId: string) => {
        setCollapsedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    }, []);

    const copyToClipboard = useCallback(async (value: string, propertyName: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedProperty(propertyName);
        setTimeout(() => setCopiedProperty(null), 2000);
    }, []);

    const exportAsJson = useCallback(() => {
        const data = selectedPreviewElement
            ? {
                  tagName: selectedPreviewElement.tagName,
                  id: selectedPreviewElement.id,
                  className: selectedPreviewElement.className,
                  rect: selectedPreviewElement.rect,
              }
            : selectedObject
            ? {
                  type: selectedObject.type,
                  position: { x: position.x, y: position.y },
                  dimensions: { width: dimensions.width, height: dimensions.height },
                  fill,
                  stroke,
                  strokeWidth,
                  opacity,
                  rotation,
              }
            : null;

        if (data) {
            const json = JSON.stringify(data, null, 2);
            navigator.clipboard.writeText(json);
            setCopiedProperty('json');
            setTimeout(() => setCopiedProperty(null), 2000);
        }
    }, [selectedObject, selectedPreviewElement, position, dimensions, fill, stroke, strokeWidth, opacity, rotation]);

    // Convert px to other units
    const convertUnit = (px: number, unit: 'rem' | 'em' | '%', base = 16) => {
        switch (unit) {
            case 'rem':
            case 'em':
                return (px / base).toFixed(3);
            case '%':
                return ((px / base) * 100).toFixed(1);
            default:
                return px.toString();
        }
    };

    const renderPropertyField = (
        label: string,
        value: string | number,
        propertyKey: string,
        options?: { readOnly?: boolean; suffix?: string; type?: string }
    ) => (
        <div className="properties-field">
            <label>{label}</label>
            <div className="field-value-wrapper">
                <input
                    type={options?.type || 'text'}
                    value={value}
                    readOnly={options?.readOnly !== false}
                    onChange={(e) => {
                        if (!options?.readOnly && onPropertyChange) {
                            onPropertyChange(propertyKey, e.target.value);
                        }
                    }}
                />
                {options?.suffix && <span className="field-suffix">{options.suffix}</span>}
            </div>
            <button
                className={`copy-btn ${copiedProperty === propertyKey ? 'copied' : ''}`}
                onClick={() => copyToClipboard(String(value), propertyKey)}
                title="Copy value"
            >
                {copiedProperty === propertyKey ? <Check size={10} /> : <Copy size={10} />}
            </button>
        </div>
    );

    const renderSection = (section: Section, children: React.ReactNode) => {
        const isCollapsed = collapsedSections.has(section.id);

        return (
            <section key={section.id} className={`properties-section ${isCollapsed ? 'collapsed' : ''}`}>
                <button className="section-header" onClick={() => toggleSection(section.id)}>
                    <span className="section-icon">{section.icon}</span>
                    <h3>{section.label}</h3>
                    <span className="section-chevron">
                        {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                    </span>
                </button>
                {!isCollapsed && <div className="section-content">{children}</div>}
            </section>
        );
    };

    // Empty state
    if (!selectedObject && !selectedPreviewElement) {
        return (
            <div className="properties-panel" ref={panelRef}>
                <div className="properties-header">
                    <h2>Properties</h2>
                </div>
                <div className="properties-empty">
                    <Box size={32} strokeWidth={1.5} />
                    <p>Select an element or object to inspect its properties</p>
                    <span className="empty-hint">Click any element in the canvas or preview</span>
                </div>
            </div>
        );
    }

    // Preview Element Inspector
    if (selectedPreviewElement) {
        const { tagName, className, id, rect, textContent, computedStyle } = selectedPreviewElement;

        return (
            <div className="properties-panel animate-in" ref={panelRef}>
                {/* Header */}
                <div className="properties-header">
                    <h2>Inspector</h2>
                    <div className="header-actions">
                        <button
                            className={`export-btn ${copiedProperty === 'json' ? 'copied' : ''}`}
                            onClick={exportAsJson}
                            title="Export as JSON (Mod+E)"
                        >
                            {copiedProperty === 'json' ? <Check size={12} /> : <Download size={12} />}
                        </button>
                        <div className="properties-badge preview-badge">
                            <span>{tagName.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb Path */}
                {selectedPreviewElement.path && (
                    <div className="element-path">
                        {selectedPreviewElement.path.split(' > ').map((part: string, i: number, arr: string[]) => (
                            <span key={i}>
                                <span className={i === arr.length - 1 ? 'current' : ''}>{part}</span>
                                {i < arr.length - 1 && <span className="path-sep">›</span>}
                            </span>
                        ))}
                    </div>
                )}

                {/* Search */}
                <div className="properties-search">
                    <Search size={12} />
                    <input
                        type="text"
                        placeholder="Filter properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')}>
                            <X size={12} />
                        </button>
                    )}
                </div>

                <div className="properties-content custom-scrollbar">
                    {/* Element Info */}
                    {renderSection({ id: 'info', label: 'Element Info', icon: <Info size={12} /> }, (
                        <>
                            {renderPropertyField('ID', id || 'none', 'id')}
                            {renderPropertyField('Classes', className || 'none', 'className')}
                        </>
                    ))}

                    {/* Layout */}
                    {renderSection({ id: 'layout', label: 'Layout', icon: <Grid size={12} /> }, (
                        <div className="properties-grid">
                            {renderPropertyField('Width', Math.round(rect.width), 'width', { suffix: 'px' })}
                            {renderPropertyField('Height', Math.round(rect.height), 'height', { suffix: 'px' })}
                            {renderPropertyField('Top', Math.round(rect.top), 'top', { suffix: 'px' })}
                            {renderPropertyField('Left', Math.round(rect.left), 'left', { suffix: 'px' })}
                        </div>
                    ))}

                    {/* Box Model Visualization */}
                    {renderSection({ id: 'box', label: 'Box Model', icon: <Box size={12} /> }, (
                        <div className="box-model">
                            <div className="box-model-visual">
                                <div className="box-margin">
                                    <span className="box-label margin">margin</span>
                                    <div className="box-border">
                                        <span className="box-label border">border</span>
                                        <div className="box-padding">
                                            <span className="box-label padding">padding</span>
                                            <div className="box-content">
                                                <span>{Math.round(rect.width)} × {Math.round(rect.height)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Computed Styles */}
                    {computedStyle && renderSection({ id: 'style', label: 'Computed Styles', icon: <Palette size={12} /> }, (
                        <div className="computed-styles">
                            {Object.entries(computedStyle)
                                .filter(([key]) => !searchQuery || key.toLowerCase().includes(searchQuery.toLowerCase()))
                                .slice(0, 20)
                                .map(([key, value]) => (
                                    <div key={key} className="style-row">
                                        <span className="style-key">{key}</span>
                                        <span className="style-value">{String(value)}</span>
                                    </div>
                                ))}
                        </div>
                    ))}

                    {/* Accessibility Audit */}
                    {renderSection({ id: 'accessibility', label: 'Accessibility', icon: <Accessibility size={12} /> }, (
                        <div className="accessibility-audit">
                            {accessibilityIssues.length === 0 ? (
                                <div className="a11y-pass">
                                    <CheckCircle size={14} />
                                    <span>No accessibility issues found</span>
                                </div>
                            ) : (
                                <div className="a11y-issues">
                                    {accessibilityIssues.map((issue, i) => (
                                        <div key={i} className="a11y-issue">
                                            <AlertTriangle size={12} />
                                            <span>{issue}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Quick Actions - Edit with AI */}
                    {onEditWithChat && renderSection({ id: 'quick-actions', label: 'Quick Actions', icon: <Zap size={12} /> }, (
                        <div className="quick-actions-grid">
                            <button
                                className="quick-action-btn"
                                onClick={() => onEditWithChat(selectedPreviewElement, 'Change the background color of this element to')}
                            >
                                <Palette size={12} />
                                <span>Color</span>
                            </button>
                            <button
                                className="quick-action-btn"
                                onClick={() => onEditWithChat(selectedPreviewElement, 'Add padding to this element')}
                            >
                                <Box size={12} />
                                <span>Padding</span>
                            </button>
                            <button
                                className="quick-action-btn"
                                onClick={() => onEditWithChat(selectedPreviewElement, 'Change the font size of this element')}
                            >
                                <Type size={12} />
                                <span>Font</span>
                            </button>
                            <button
                                className="quick-action-btn"
                                onClick={() => onEditWithChat(selectedPreviewElement, 'Make this element responsive')}
                            >
                                <Smartphone size={12} />
                                <span>Responsive</span>
                            </button>
                        </div>
                    ))}

                    {/* Content Preview */}
                    {textContent && renderSection({ id: 'content', label: 'Content', icon: <Type size={12} /> }, (
                        <div className="properties-text-preview">
                            <p>{textContent}</p>
                        </div>
                    ))}
                </div>

                {/* Sticky Footer */}
                <div className="properties-footer">
                    <button className="edit-element-btn" onClick={() => onRefactor?.(selectedPreviewElement)}>
                        <Sparkles size={14} />
                        <span>Refactor Plan</span>
                    </button>
                    {onEditWithChat && (
                        <button
                            className="edit-chat-btn"
                            onClick={() => onEditWithChat(selectedPreviewElement, '')}
                        >
                            <MessageSquare size={14} />
                            <span>Edit with Chat</span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Canvas Object Properties
    return (
        <div className="properties-panel animate-in" ref={panelRef}>
            {/* Header */}
            <div className="properties-header">
                <h2>Properties</h2>
                <div className="header-actions">
                    <button
                        className={`action-btn ${isLocked ? 'active' : ''}`}
                        onClick={() => setIsLocked(!isLocked)}
                        title={isLocked ? 'Unlock' : 'Lock'}
                    >
                        {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                    <button
                        className={`action-btn ${!isVisible ? 'active' : ''}`}
                        onClick={() => setIsVisible(!isVisible)}
                        title={isVisible ? 'Hide' : 'Show'}
                    >
                        {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button
                        className={`export-btn ${copiedProperty === 'json' ? 'copied' : ''}`}
                        onClick={exportAsJson}
                        title="Export as JSON"
                    >
                        {copiedProperty === 'json' ? <Check size={12} /> : <Download size={12} />}
                    </button>
                    <div className="properties-badge">
                        <span>{selectedObject.type?.toUpperCase() || 'OBJECT'}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="properties-tabs">
                <button
                    className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
                    onClick={() => setActiveTab('layout')}
                >
                    <Grid size={12} />
                    Layout
                </button>
                <button
                    className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
                    onClick={() => setActiveTab('style')}
                >
                    <Palette size={12} />
                    Style
                </button>
                <button
                    className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
                    onClick={() => setActiveTab('advanced')}
                >
                    <Settings size={12} />
                    Advanced
                </button>
            </div>

            <div className="properties-content custom-scrollbar">
                {activeTab === 'layout' && (
                    <>
                        {/* Position */}
                        {renderSection({ id: 'position', label: 'Position', icon: <Move size={12} /> }, (
                            <div className="properties-grid">
                                {renderPropertyField('X', position.x, 'x', { suffix: 'px' })}
                                {renderPropertyField('Y', position.y, 'y', { suffix: 'px' })}
                            </div>
                        ))}

                        {/* Dimensions */}
                        {renderSection({ id: 'dimensions', label: 'Dimensions', icon: <Maximize2 size={12} /> }, (
                            <div className="properties-grid">
                                {renderPropertyField('W', dimensions.width, 'width', { suffix: 'px' })}
                                {renderPropertyField('H', dimensions.height, 'height', { suffix: 'px' })}
                            </div>
                        ))}

                        {/* Transform */}
                        {renderSection({ id: 'transform', label: 'Transform', icon: <RotateCw size={12} /> }, (
                            <div className="properties-grid">
                                {renderPropertyField('Rotate', rotation, 'rotation', { suffix: '°' })}
                                <div className="properties-field">
                                    <label>Opacity</label>
                                    <div className="slider-wrapper">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={opacity}
                                            onChange={(e) => setOpacity(Number(e.target.value))}
                                            className="opacity-slider"
                                        />
                                        <span className="slider-value">{opacity}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'style' && (
                    <>
                        {/* Fill & Stroke */}
                        {renderSection({ id: 'colors', label: 'Colors', icon: <Palette size={12} /> }, (
                            <div className="color-controls">
                                <div className="color-field">
                                    <label>Fill</label>
                                    <button
                                        className="color-swatch"
                                        style={{ background: fill }}
                                        onClick={() => setShowColorPicker(showColorPicker === 'fill' ? null : 'fill')}
                                    />
                                    <input
                                        type="text"
                                        value={fill}
                                        onChange={(e) => setFill(e.target.value)}
                                    />
                                    <button
                                        className={`copy-btn ${copiedProperty === 'fill' ? 'copied' : ''}`}
                                        onClick={() => copyToClipboard(fill, 'fill')}
                                    >
                                        {copiedProperty === 'fill' ? <Check size={10} /> : <Copy size={10} />}
                                    </button>
                                </div>
                                {showColorPicker === 'fill' && (
                                    <div className="color-picker-wrapper">
                                        <input
                                            type="color"
                                            value={fill}
                                            onChange={(e) => setFill(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="color-field">
                                    <label>Stroke</label>
                                    <button
                                        className="color-swatch"
                                        style={{ background: stroke }}
                                        onClick={() => setShowColorPicker(showColorPicker === 'stroke' ? null : 'stroke')}
                                    />
                                    <input
                                        type="text"
                                        value={stroke}
                                        onChange={(e) => setStroke(e.target.value)}
                                    />
                                    <button
                                        className={`copy-btn ${copiedProperty === 'stroke' ? 'copied' : ''}`}
                                        onClick={() => copyToClipboard(stroke, 'stroke')}
                                    >
                                        {copiedProperty === 'stroke' ? <Check size={10} /> : <Copy size={10} />}
                                    </button>
                                </div>
                                {showColorPicker === 'stroke' && (
                                    <div className="color-picker-wrapper">
                                        <input
                                            type="color"
                                            value={stroke}
                                            onChange={(e) => setStroke(e.target.value)}
                                        />
                                    </div>
                                )}

                                {renderPropertyField('Stroke Width', strokeWidth, 'strokeWidth', { suffix: 'px' })}
                            </div>
                        ))}

                        {/* Border Radius */}
                        {renderSection({ id: 'border', label: 'Border Radius', icon: <Square size={12} /> }, (
                            <div className="border-radius-controls">
                                <div className="radius-visual">
                                    <input
                                        type="number"
                                        value={borderRadius.tl}
                                        onChange={(e) => setBorderRadius({ ...borderRadius, tl: Number(e.target.value) })}
                                        className="radius-input tl"
                                        title="Top Left"
                                    />
                                    <input
                                        type="number"
                                        value={borderRadius.tr}
                                        onChange={(e) => setBorderRadius({ ...borderRadius, tr: Number(e.target.value) })}
                                        className="radius-input tr"
                                        title="Top Right"
                                    />
                                    <div className="radius-preview" style={{
                                        borderRadius: `${borderRadius.tl}px ${borderRadius.tr}px ${borderRadius.br}px ${borderRadius.bl}px`
                                    }} />
                                    <input
                                        type="number"
                                        value={borderRadius.bl}
                                        onChange={(e) => setBorderRadius({ ...borderRadius, bl: Number(e.target.value) })}
                                        className="radius-input bl"
                                        title="Bottom Left"
                                    />
                                    <input
                                        type="number"
                                        value={borderRadius.br}
                                        onChange={(e) => setBorderRadius({ ...borderRadius, br: Number(e.target.value) })}
                                        className="radius-input br"
                                        title="Bottom Right"
                                    />
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === 'advanced' && (
                    <>
                        {/* Metadata & MCP */}
                        {renderSection({ id: 'metadata', label: 'Metadata & MCP', icon: <Settings size={12} /> }, (
                            <div className="metadata-section">
                                <div className="mcp-item">
                                    <label>COMPONENT ID</label>
                                    <code>{selectedObject.id || 'N/A'}</code>
                                    <button
                                        className={`copy-btn ${copiedProperty === 'componentId' ? 'copied' : ''}`}
                                        onClick={() => copyToClipboard(selectedObject.id || '', 'componentId')}
                                    >
                                        {copiedProperty === 'componentId' ? <Check size={10} /> : <Copy size={10} />}
                                    </button>
                                </div>
                                <div className="mcp-item">
                                    <label>SYNC STATUS</label>
                                    <span className="status-live">
                                        <span className="status-dot"></span>
                                        LIVE
                                    </span>
                                </div>
                                <div className="mcp-item">
                                    <label>OBJECT TYPE</label>
                                    <code>{selectedObject.type || 'Unknown'}</code>
                                </div>
                            </div>
                        ))}

                        {/* Code Export */}
                        {renderSection({ id: 'export', label: 'Export', icon: <Code size={12} /> }, (
                            <div className="export-options">
                                <button
                                    className="export-option"
                                    onClick={exportAsJson}
                                >
                                    <Download size={12} />
                                    Copy as JSON
                                </button>
                                <button
                                    className="export-option"
                                    onClick={() => {
                                        const css = `position: absolute;\nleft: ${position.x}px;\ntop: ${position.y}px;\nwidth: ${dimensions.width}px;\nheight: ${dimensions.height}px;\nbackground: ${fill};\nborder: ${strokeWidth}px solid ${stroke};`;
                                        copyToClipboard(css, 'css');
                                    }}
                                >
                                    <Code size={12} />
                                    Copy as CSS
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
