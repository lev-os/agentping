import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, Monitor, Smartphone, Tablet, ExternalLink, ShieldCheck, Globe, MousePointer2 } from 'lucide-react';
import './Preview.css';

interface PreviewProps {
    onElementSelected?: (element: any) => void;
    selectedElement?: any;
}

export function Preview({ onElementSelected, selectedElement: externalSelectedElement }: PreviewProps) {
    const [url, setUrl] = useState('http://localhost:5173');
    const [previewUrl, setPreviewUrl] = useState('http://localhost:5173');
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [scale, setScale] = useState(1);
    const [isInspectorActive, setIsInspectorActive] = useState(false);
    const [internalSelectedElement, setInternalSelectedElement] = useState<any>(null);

    // Prefer external selected element if provided
    const displayElement = externalSelectedElement || internalSelectedElement;
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleRefresh = () => {
        if (iframeRef.current) {
            iframeRef.current.src = previewUrl;
        }
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let formattedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            formattedUrl = `http://${url}`;
        }
        setPreviewUrl(formattedUrl);
        setInternalSelectedElement(null);
        onElementSelected?.(null);
    };

    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'ELEMENT_SELECTED') {
                console.log('Element Selected in Preview:', e.data.payload);
                setInternalSelectedElement(e.data.payload);
                onElementSelected?.(e.data.payload);

                // Notify the agent via global coordinator if available
                if (window.agentPing) {
                    window.coordinator?.createTask(`Focusing on element: <${e.data.payload.tagName.toLowerCase()}> with class "${e.data.payload.className}"`, []);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Inject selection script when inspector is toggled
    useEffect(() => {
        if (!isInspectorActive || !iframeRef.current) return;

        const injectScript = () => {
            try {
                const script = `
                    (function() {
                        if (window.STUDIO_BRIDGE_ACTIVE) return;
                        window.STUDIO_BRIDGE_ACTIVE = true;
                        
                        document.addEventListener('click', (e) => {
                            if (!window.STUDIO_INSPECTOR_ENABLED) return;
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const el = e.target;
                            const rect = el.getBoundingClientRect();
                            const info = {
                                tagName: el.tagName,
                                className: el.className,
                                id: el.id,
                                textContent: (el.textContent || '').substring(0, 50).trim(),
                                rect: {
                                    top: rect.top,
                                    left: rect.left,
                                    width: rect.width,
                                    height: rect.height
                                }
                            };
                            window.parent.postMessage({ type: 'ELEMENT_SELECTED', payload: info }, '*');
                        }, true);

                        document.addEventListener('mouseover', (e) => {
                            if (!window.STUDIO_INSPECTOR_ENABLED) return;
                            e.target.style.outline = '2px solid rgba(0, 255, 170, 0.5)';
                            e.target.style.outlineOffset = '-2px';
                        }, true);

                        document.addEventListener('mouseout', (e) => {
                            if (!window.STUDIO_INSPECTOR_ENABLED) return;
                            e.target.style.outline = '';
                        }, true);
                    })();
                    window.STUDIO_INSPECTOR_ENABLED = true;
                `;
                iframeRef.current?.contentWindow?.postMessage({ type: 'INJECT_SCRIPT', script }, '*');

                // Fallback for same-origin: direct injection
                // This will only work if port/host matches exactly
                const doc = iframeRef.current?.contentDocument;
                if (doc) {
                    const s = doc.createElement('script');
                    s.textContent = script;
                    doc.head.appendChild(s);
                }
            } catch (err) {
                console.warn('Could not directly inject script into preview (Cross-Origin). Ensure the target app has the Studio Bridge or is on the same origin.');
            }
        };

        injectScript();
    }, [isInspectorActive, previewUrl]);

    // Send toggle state to iframe
    useEffect(() => {
        if (!iframeRef.current) return;
        iframeRef.current.contentWindow?.postMessage({
            type: 'SET_INSPECTOR',
            enabled: isInspectorActive
        }, '*');
    }, [isInspectorActive]);

    const getDeviceStyles = () => {
        switch (device) {
            case 'mobile': return { width: '375px', height: '667px' };
            case 'tablet': return { width: '768px', height: '1024px' };
            default: return { width: '100%', height: '100%' };
        }
    };

    return (
        <div className="studio-preview animate-in">
            <div className="preview-header">
                <div className="preview-nav">
                    <form onSubmit={handleUrlSubmit} className="url-bar">
                        <Globe size={14} className="url-icon" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter local URL (e.g. localhost:3000)"
                        />
                    </form>
                    <button className="preview-action-btn" onClick={handleRefresh} title="Refresh">
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className="preview-controls">
                    <button
                        className={`inspector-toggle ${isInspectorActive ? 'active' : ''}`}
                        onClick={() => setIsInspectorActive(!isInspectorActive)}
                        title="Visual Inspector (Click to Select)"
                    >
                        <MousePointer2 size={16} />
                        <span>Inspector</span>
                    </button>

                    <div className="preview-divider" />

                    <div className="device-toggle">
                        <button
                            className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
                            onClick={() => setDevice('mobile')}
                            title="Mobile View"
                        >
                            <Smartphone size={16} />
                        </button>
                        <button
                            className={`device-btn ${device === 'tablet' ? 'active' : ''}`}
                            onClick={() => setDevice('tablet')}
                            title="Tablet View"
                        >
                            <Tablet size={16} />
                        </button>
                        <button
                            className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
                            onClick={() => setDevice('desktop')}
                            title="Desktop View"
                        >
                            <Monitor size={16} />
                        </button>
                    </div>

                    <div className="preview-divider" />

                    <button className="preview-action-btn" onClick={() => window.open(previewUrl, '_blank')} title="Open in Browser">
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>

            <div className="preview-viewport-container">
                <div className="preview-viewport-wrapper" style={{ scale: scale.toString() }}>
                    <div className="preview-frame-container" style={getDeviceStyles()}>
                        <div className="preview-frame-header">
                            <div className="frame-dot red" />
                            <div className="frame-dot yellow" />
                            <div className="frame-dot green" />
                            <span className="frame-url">{previewUrl}</span>
                            <ShieldCheck size={12} className="text-accent-primary" />
                        </div>
                        <iframe
                            ref={iframeRef}
                            src={previewUrl}
                            className="preview-iframe"
                            title="App Preview"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        />

                        {/* Selection Overlay */}
                        {isInspectorActive && displayElement && (
                            <div
                                className="selection-overlay-box"
                                style={{
                                    top: displayElement.rect.top + 32, // +32 for frame header
                                    left: displayElement.rect.left,
                                    width: displayElement.rect.width,
                                    height: displayElement.rect.height
                                }}
                            >
                                <div className="selection-label">
                                    <span className="tag-name">{displayElement.tagName.toLowerCase()}</span>
                                    {displayElement.className && <span className="class-name">.{displayElement.className.split(' ')[0]}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
