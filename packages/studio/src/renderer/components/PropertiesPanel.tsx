/**
 * Properties Panel Component
 * 
 * Right sidebar showing properties of selected canvas object.
 */

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import './PropertiesPanel.css';

interface PropertiesPanelProps {
    selectedObject: any;
    selectedPreviewElement?: any;
    onRefactor?: (element: any) => void;
}

export function PropertiesPanel({ selectedObject, selectedPreviewElement, onRefactor }: PropertiesPanelProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [fill, setFill] = useState('#ffffff');
    const [stroke, setStroke] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(1);

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
        }
    }, [selectedObject]);

    if (!selectedObject && !selectedPreviewElement) {
        return (
            <div className="properties-panel">
                <div className="properties-header">
                    <h2>Properties</h2>
                </div>
                <div className="properties-empty">
                    <p>Select an element or object to see its properties</p>
                </div>
            </div>
        );
    }

    if (selectedPreviewElement) {
        const { tagName, className, id, rect, textContent } = selectedPreviewElement;
        return (
            <div className="properties-panel animate-in">
                <div className="properties-header">
                    <h2>Inspector</h2>
                    <div className="properties-badge preview-badge">
                        <span>{tagName.toUpperCase()}</span>
                    </div>
                </div>

                <div className="properties-content">
                    <section className="properties-section">
                        <h3>Element Info</h3>
                        <div className="properties-field full">
                            <label>ID</label>
                            <code>{id || 'none'}</code>
                        </div>
                        <div className="properties-field full">
                            <label>CLASSES</label>
                            <code className="text-accent-secondary">{className || 'none'}</code>
                        </div>
                    </section>

                    <section className="properties-section">
                        <h3>Layout (px)</h3>
                        <div className="properties-row">
                            <div className="properties-field">
                                <label>WIDTH</label>
                                <input type="text" value={`${Math.round(rect.width)}px`} readOnly />
                            </div>
                            <div className="properties-field">
                                <label>HEIGHT</label>
                                <input type="text" value={`${Math.round(rect.height)}px`} readOnly />
                            </div>
                        </div>
                    </section>

                    <section className="properties-section">
                        <h3>Content Preview</h3>
                        <div className="properties-text-preview">
                            <p>{textContent || 'No text content'}</p>
                        </div>
                    </section>

                    <button className="edit-element-btn" onClick={() => onRefactor?.(selectedPreviewElement)}>
                        <Sparkles size={14} />
                        <span>Generate Refactor Plan</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="properties-panel animate-in">
            <div className="properties-header">
                <h2>Inspection</h2>
                <div className="properties-badge">
                    <span>{selectedObject.type.toUpperCase()}</span>
                </div>
            </div>

            <div className="properties-content">
                {/* Position */}
                <section className="properties-section">
                    <h3>Position</h3>
                    <div className="properties-row">
                        <div className="properties-field">
                            <label>X</label>
                            <input type="number" value={position.x} readOnly />
                        </div>
                        <div className="properties-field">
                            <label>Y</label>
                            <input type="number" value={position.y} readOnly />
                        </div>
                    </div>
                </section>

                {/* Dimensions */}
                <section className="properties-section">
                    <h3>Dimensions</h3>
                    <div className="properties-row">
                        <div className="properties-field">
                            <label>W</label>
                            <input type="number" value={dimensions.width} readOnly />
                        </div>
                        <div className="properties-field">
                            <label>H</label>
                            <input type="number" value={dimensions.height} readOnly />
                        </div>
                    </div>
                </section>

                {/* Advanced Properties (MCP) */}
                <section className="properties-section">
                    <h3>Metadata & MCP</h3>
                    <div className="properties-mcp-info">
                        <div className="mcp-item">
                            <label>COMPONENT ID</label>
                            <code>{selectedObject.id || 'N/A'}</code>
                        </div>
                        <div className="mcp-item">
                            <label>SYNC STATUS</label>
                            <span className="status-live">LIVE</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
