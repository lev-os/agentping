/**
 * Component Gallery
 * 
 * Sidebar panel for dragging/dropping AgentPing primitives.
 */

import {
    Box, Type, Square, CreditCard, Layout, Table, BarChart2,
    Sparkles, Activity, Zap, Cpu, Terminal, HardDrive,
    Share2, List, Map, BarChart3, LineChart, TrendingUp,
    CheckSquare, MousePointer2, MessageSquare
} from 'lucide-react';
import './ComponentGallery.css';

interface ComponentGalleryProps {
    onAddComponent: (type: string, name: string) => void;
}

export function ComponentGallery({ onAddComponent }: ComponentGalleryProps) {
    const categories = [
        {
            title: 'Layout',
            items: [
                { icon: Square, label: 'Container', type: 'container' },
                { icon: Layout, label: 'Grid', type: 'grid' },
                { icon: Box, label: 'Card', type: 'card' },
                { icon: Table, label: 'TabsContainer', type: 'tabs' },
            ]
        },
        {
            title: 'Intelligence',
            items: [
                { icon: Sparkles, label: 'TokenStream', type: 'token-stream' },
                { icon: Activity, label: 'BrainActivity', type: 'brain-activity' },
                { icon: Zap, label: 'ModelSelector', type: 'model-selector' },
            ]
        },
        {
            title: 'System & Ops',
            items: [
                { icon: Cpu, label: 'HealthGauge', type: 'health-gauge' },
                { icon: Terminal, label: 'LiveLogStream', type: 'log-stream' },
                { icon: HardDrive, label: 'DockerStats', type: 'docker-stats' },
            ]
        },
        {
            title: 'Navigation',
            items: [
                { icon: Share2, label: 'NetworkGraph', type: 'network-graph' },
                { icon: List, label: 'Stepper', type: 'stepper' },
                { icon: Map, label: 'GeoMap', type: 'geo-map' },
            ]
        },
        {
            title: 'Financial',
            items: [
                { icon: BarChart3, label: 'OrderBook', type: 'order-book' },
                { icon: LineChart, label: 'CandleStick', type: 'candlestick' },
                { icon: TrendingUp, label: 'TradeHistory', type: 'trade-history' },
            ]
        },
        {
            title: 'Forms & Interaction',
            items: [
                { icon: CheckSquare, label: 'StepChecklist', type: 'checklist' },
                { icon: MousePointer2, label: 'DirectionPicker', type: 'picker' },
                { icon: MessageSquare, label: 'QuestionInput', type: 'question' },
            ]
        }
    ];

    return (
        <div className="component-gallery">
            <div className="gallery-header">
                <h2>Components</h2>
            </div>

            <div className="gallery-content">
                {categories.map(cat => (
                    <div key={cat.title} className="gallery-category">
                        <h3>{cat.title}</h3>
                        <div className="gallery-grid">
                            {cat.items.map(item => (
                                <button
                                    key={item.label}
                                    className="component-item"
                                    onClick={() => onAddComponent(item.type, item.label)}
                                    title={`Add ${item.label}`}
                                    draggable="true"
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('application/agentping-component', JSON.stringify({ type: item.type, name: item.label }));
                                        e.dataTransfer.effectAllowed = 'copy';
                                    }}
                                >
                                    <div className="component-icon">
                                        <item.icon size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="component-label">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
