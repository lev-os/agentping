/**
 * Preview Component
 *
 * Live preview of web applications with device simulation,
 * inspector mode, navigation history, and developer tools.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    RefreshCw, Monitor, Smartphone, Tablet, ExternalLink, ShieldCheck, Globe,
    MousePointer2, ArrowLeft, ArrowRight, Home, Star, Maximize2, ZoomIn, ZoomOut,
    Camera, Clock, ChevronDown, RotateCcw, Bookmark, X, AlertCircle, Check,
    Wifi, WifiOff, History
} from 'lucide-react';
import { IconButton, Kbd } from './ui';
import './Preview.css';

// Check if we're in Electron with webview support
// With contextIsolation, we check for exposed APIs from preload
const isElectron = typeof window !== 'undefined' &&
    (typeof window.claudeCode !== 'undefined' || typeof window.platform !== 'undefined');

interface PreviewProps {
    onElementSelected?: (element: any) => void;
    selectedElement?: any;
    initialUrl?: string;
}

interface HistoryEntry {
    url: string;
    title?: string;
    timestamp: Date;
}

interface DevicePreset {
    id: string;
    name: string;
    width: number;
    height: number;
    icon: typeof Smartphone;
}

const DEVICE_PRESETS: DevicePreset[] = [
    { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, icon: Smartphone },
    { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, icon: Smartphone },
    { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, icon: Smartphone },
    { id: 'ipad', name: 'iPad', width: 768, height: 1024, icon: Tablet },
    { id: 'ipad-pro', name: 'iPad Pro 12.9"', width: 1024, height: 1366, icon: Tablet },
    { id: 'desktop', name: 'Desktop', width: 1920, height: 1080, icon: Monitor },
    { id: 'laptop', name: 'Laptop', width: 1366, height: 768, icon: Monitor },
];

const DEFAULT_BOOKMARKS = [
    { url: 'http://localhost:3000', name: 'Dev Server (3000)' },
    { url: 'http://localhost:5173', name: 'Vite Dev (5173)' },
    { url: 'http://localhost:8080', name: 'Backend (8080)' },
];

export function Preview({ onElementSelected, selectedElement: externalSelectedElement, initialUrl }: PreviewProps) {
    // Debug: Check Electron detection on every render
    console.log('[Preview] isElectron:', isElectron, 'claudeCode:', typeof window.claudeCode, 'platform:', typeof window.platform);

    const [url, setUrl] = useState(initialUrl || 'http://localhost:5173');
    const [previewUrl, setPreviewUrl] = useState(initialUrl || 'http://localhost:5173');

    // Navigation history
    const [history, setHistory] = useState<HistoryEntry[]>([{ url: initialUrl || 'http://localhost:5173', timestamp: new Date() }]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [showHistory, setShowHistory] = useState(false);

    // Bookmarks
    const [bookmarks, setBookmarks] = useState(DEFAULT_BOOKMARKS);
    const [showBookmarks, setShowBookmarks] = useState(false);

    // Device and viewport
    const [device, setDevice] = useState<string>('desktop');
    const [customWidth, setCustomWidth] = useState(1920);
    const [customHeight, setCustomHeight] = useState(1080);
    const [scale, setScale] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showDeviceMenu, setShowDeviceMenu] = useState(false);

    // Inspector
    const [isInspectorActive, setIsInspectorActive] = useState(false);
    const [internalSelectedElement, setInternalSelectedElement] = useState<any>(null);

    // Status
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    const displayElement = externalSelectedElement || internalSelectedElement;
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const webviewRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update URL when initialUrl prop changes
    useEffect(() => {
        if (initialUrl && initialUrl !== previewUrl) {
            setUrl(initialUrl);
            navigateTo(initialUrl);
        }
    }, [initialUrl]);

    // Navigate to URL
    const navigateTo = useCallback((targetUrl: string, addToHistory = true) => {
        let formattedUrl = targetUrl;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            formattedUrl = `http://${targetUrl}`;
        }

        // Reset webview ready state for new page load
        setWebviewDomReady(false);

        setPreviewUrl(formattedUrl);
        setUrl(formattedUrl);
        setIsLoading(true);
        setHasError(false);
        setInternalSelectedElement(null);
        onElementSelected?.(null);

        if (addToHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push({ url: formattedUrl, timestamp: new Date() });
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    }, [history, historyIndex, onElementSelected]);

    // Navigation controls
    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < history.length - 1;

    const goBack = () => {
        if (canGoBack) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setPreviewUrl(history[newIndex].url);
            setUrl(history[newIndex].url);
        }
    };

    const goForward = () => {
        if (canGoForward) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setPreviewUrl(history[newIndex].url);
            setUrl(history[newIndex].url);
        }
    };

    const goHome = () => {
        navigateTo('http://localhost:5173');
    };

    const handleRefresh = () => {
        setIsLoading(true);
        if (isElectron && webviewRef.current) {
            webviewRef.current.reload();
        } else if (iframeRef.current) {
            iframeRef.current.src = previewUrl;
        }
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigateTo(url);
    };

    // Bookmark management
    const isBookmarked = bookmarks.some(b => b.url === previewUrl);

    const toggleBookmark = () => {
        if (isBookmarked) {
            setBookmarks(bookmarks.filter(b => b.url !== previewUrl));
        } else {
            const name = previewUrl.replace(/https?:\/\//, '').split('/')[0];
            setBookmarks([...bookmarks, { url: previewUrl, name }]);
        }
    };

    // Screenshot
    const takeScreenshot = useCallback(async () => {
        if (!iframeRef.current) return;

        try {
            // Create a canvas and draw the iframe content
            const canvas = document.createElement('canvas');
            const iframe = iframeRef.current;
            const rect = iframe.getBoundingClientRect();

            canvas.width = rect.width;
            canvas.height = rect.height;

            // Note: This only works for same-origin content
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // For cross-origin, we'd need a more complex solution
                // For now, just trigger a download prompt
                const dataUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `screenshot-${new Date().toISOString().slice(0, 10)}.png`;
                a.click();
            }
        } catch (err) {
            console.error('Screenshot failed:', err);
        }
    }, []);

    // Zoom controls
    const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.25));
    const resetZoom = () => setScale(1);

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (isFullscreen) {
            document.exitFullscreen();
        } else {
            containerRef.current.requestFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    // Device selection - only apply custom dimensions for mobile/tablet devices
    const isDesktopMode = device === 'desktop' || device === 'laptop';
    const getDeviceStyles = (): React.CSSProperties => {
        if (isDesktopMode) {
            return {}; // Let CSS handle full width/height
        }
        const preset = DEVICE_PRESETS.find(d => d.id === device);
        if (preset) {
            return { width: `${preset.width}px`, height: `${preset.height}px`, flex: 'none' };
        }
        return { width: `${customWidth}px`, height: `${customHeight}px`, flex: 'none' };
    };

    // Loading timeout - detect connection failures
    useEffect(() => {
        if (!isLoading) return;

        const timeout = setTimeout(() => {
            // If still loading after 10 seconds, likely a connection error
            if (isLoading) {
                setIsLoading(false);
                setHasError(true);
            }
        }, 10000);

        return () => clearTimeout(timeout);
    }, [isLoading, previewUrl]);

    // Iframe event handlers
    const handleIframeLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'ELEMENT_SELECTED') {
                setInternalSelectedElement(e.data.payload);
                onElementSelected?.(e.data.payload);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onElementSelected]);

    // Track if webview is ready for script execution (after dom-ready)
    const [webviewReady, setWebviewReady] = useState(false);
    const [webviewDomReady, setWebviewDomReady] = useState(false);

    // Webview ref callback to detect when webview is mounted
    const webviewRefCallback = useCallback((node: any) => {
        webviewRef.current = node;
        if (node && isElectron) {
            setWebviewReady(true);
            console.log('[Preview] Webview mounted');
        } else if (!node) {
            // Webview unmounted
            setWebviewReady(false);
            setWebviewDomReady(false);
        }
    }, [isElectron]);

    // Inspector script that gets injected (defined early so useEffects can reference it)
    const inspectorScript = `
        (function() {
            if (window.STUDIO_BRIDGE_ACTIVE) return;
            window.STUDIO_BRIDGE_ACTIVE = true;

            let highlightedElement = null;

            document.addEventListener('click', (e) => {
                if (!window.STUDIO_INSPECTOR_ENABLED) return;
                e.preventDefault();
                e.stopPropagation();

                const el = e.target;
                const rect = el.getBoundingClientRect();
                const computed = window.getComputedStyle(el);

                // Get more detailed info including attributes
                const attributes = {};
                for (const attr of el.attributes || []) {
                    attributes[attr.name] = attr.value;
                }

                // Build element path (breadcrumb)
                let path = [];
                let parent = el;
                while (parent && parent !== document.body) {
                    let selector = parent.tagName.toLowerCase();
                    if (parent.id) selector += '#' + parent.id;
                    else if (parent.className) selector += '.' + parent.className.split(' ')[0];
                    path.unshift(selector);
                    parent = parent.parentElement;
                }

                const info = {
                    tagName: el.tagName,
                    className: el.className,
                    id: el.id,
                    textContent: (el.textContent || '').substring(0, 100).trim(),
                    innerHTML: (el.innerHTML || '').substring(0, 200),
                    attributes: attributes,
                    path: path.join(' > '),
                    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                    computedStyle: {
                        color: computed.color,
                        backgroundColor: computed.backgroundColor,
                        fontSize: computed.fontSize,
                        fontFamily: computed.fontFamily,
                        fontWeight: computed.fontWeight,
                        padding: computed.padding,
                        margin: computed.margin,
                        border: computed.border,
                        borderRadius: computed.borderRadius,
                        display: computed.display,
                        position: computed.position,
                        width: computed.width,
                        height: computed.height,
                        lineHeight: computed.lineHeight,
                        textAlign: computed.textAlign,
                        flexDirection: computed.flexDirection,
                        justifyContent: computed.justifyContent,
                        alignItems: computed.alignItems,
                        gap: computed.gap,
                        overflow: computed.overflow,
                        zIndex: computed.zIndex,
                        opacity: computed.opacity,
                        boxShadow: computed.boxShadow
                    }
                };

                // For webview: use console.log with special prefix
                // For iframe: use postMessage
                if (window.STUDIO_USE_CONSOLE) {
                    console.log('STUDIO_ELEMENT_SELECTED:' + JSON.stringify(info));
                } else {
                    window.parent.postMessage({ type: 'ELEMENT_SELECTED', payload: info }, '*');
                }
            }, true);

            document.addEventListener('mouseover', (e) => {
                if (!window.STUDIO_INSPECTOR_ENABLED) return;
                if (highlightedElement) {
                    highlightedElement.style.outline = '';
                    highlightedElement.style.outlineOffset = '';
                }
                highlightedElement = e.target;
                e.target.style.outline = '2px solid rgba(0, 255, 170, 0.8)';
                e.target.style.outlineOffset = '-2px';
            }, true);

            document.addEventListener('mouseout', (e) => {
                if (!window.STUDIO_INSPECTOR_ENABLED) return;
                e.target.style.outline = '';
                e.target.style.outlineOffset = '';
            }, true);
        })();
        window.STUDIO_INSPECTOR_ENABLED = true;
    `;

    // Webview event handlers (Electron only)
    useEffect(() => {
        if (!isElectron || !webviewReady || !webviewRef.current) return;

        const webview = webviewRef.current;
        console.log('[Preview] Setting up webview event handlers');

        const handleDidFinishLoad = () => {
            console.log('[Preview] Webview did-finish-load');
            setIsLoading(false);
            setHasError(false);
        };

        const handleDidFailLoad = (_e: any) => {
            console.log('[Preview] Webview did-fail-load');
            setIsLoading(false);
            setHasError(true);
        };

        const handleConsoleMessage = (e: any) => {
            // Check for our special element selection message
            const message = e.message || '';
            if (message.startsWith('STUDIO_ELEMENT_SELECTED:')) {
                console.log('[Preview] Element selected via console message');
                try {
                    const payload = JSON.parse(message.replace('STUDIO_ELEMENT_SELECTED:', ''));
                    setInternalSelectedElement(payload);
                    onElementSelected?.(payload);
                } catch (err) {
                    console.warn('[Preview] Failed to parse element selection:', err);
                }
            }
        };

        const handleDidStartLoading = () => {
            console.log('[Preview] Webview did-start-loading');
            setIsLoading(true);
            setHasError(false);
            // Reset dom-ready state for new page load
            setWebviewDomReady(false);
        };

        // Handle dom-ready - this is when we can safely inject scripts
        const handleDomReady = () => {
            console.log('[Preview] Webview dom-ready event');
            setWebviewDomReady(true);
        };

        // Add event listeners
        webview.addEventListener('did-finish-load', handleDidFinishLoad);
        webview.addEventListener('did-fail-load', handleDidFailLoad);
        webview.addEventListener('console-message', handleConsoleMessage);
        webview.addEventListener('did-start-loading', handleDidStartLoading);
        webview.addEventListener('dom-ready', handleDomReady);

        return () => {
            webview.removeEventListener('did-finish-load', handleDidFinishLoad);
            webview.removeEventListener('did-fail-load', handleDidFailLoad);
            webview.removeEventListener('console-message', handleConsoleMessage);
            webview.removeEventListener('did-start-loading', handleDidStartLoading);
            webview.removeEventListener('dom-ready', handleDomReady);
        };
    }, [isElectron, webviewReady, onElementSelected]);

    // Listen for CSP violations (frame blocked)
    useEffect(() => {
        const handleSecurityError = (e: SecurityPolicyViolationEvent) => {
            if (e.blockedURI && (e.blockedURI.includes('localhost') || e.violatedDirective.includes('frame'))) {
                setIsLoading(false);
                setHasError(true);
            }
        };

        document.addEventListener('securitypolicyviolation', handleSecurityError);
        return () => document.removeEventListener('securitypolicyviolation', handleSecurityError);
    }, []);

    // Inject selection script when inspector is toggled
    useEffect(() => {
        if (!isInspectorActive) return;

        const injectScript = () => {
            // Try webview first (Electron) - MUST wait for webviewDomReady
            if (isElectron && webviewDomReady && webviewRef.current) {
                console.log('[Preview] Injecting inspector script into webview (dom ready)');
                try {
                    const webview = webviewRef.current;
                    // Use executeJavaScript for webview - works regardless of origin
                    webview.executeJavaScript(`window.STUDIO_USE_CONSOLE = true; ${inspectorScript}`)
                        .then(() => console.log('[Preview] Inspector script injected successfully'))
                        .catch((err: Error) => console.warn('[Preview] Webview script injection failed:', err));
                    return;
                } catch (err) {
                    console.warn('[Preview] Webview injection error:', err);
                }
            } else if (isElectron && webviewReady && !webviewDomReady) {
                console.log('[Preview] Webview mounted but dom not ready yet, waiting...');
                return; // Wait for dom-ready event
            }

            // Fallback to iframe (non-Electron or webview not available)
            if (iframeRef.current) {
                console.log('[Preview] Trying iframe script injection (may fail cross-origin)');
                try {
                    const doc = iframeRef.current?.contentDocument;
                    if (doc) {
                        const s = doc.createElement('script');
                        s.textContent = `window.STUDIO_USE_CONSOLE = false; ${inspectorScript}`;
                        doc.head.appendChild(s);
                        console.log('[Preview] Iframe script injected');
                    }
                } catch {
                    console.warn('[Preview] Could not inject inspector script (Cross-Origin). Use Electron for full inspector support.');
                }
            }
        };

        // Small delay to ensure webview/iframe is loaded
        const timeout = setTimeout(injectScript, 100);
        return () => clearTimeout(timeout);
    }, [isInspectorActive, previewUrl, inspectorScript, isElectron, webviewReady, webviewDomReady]);

    // Send toggle state to preview frame
    useEffect(() => {
        const toggleScript = `window.STUDIO_INSPECTOR_ENABLED = ${isInspectorActive};`;
        console.log('[Preview] Toggling inspector:', isInspectorActive, 'domReady:', webviewDomReady);

        // Only execute if webview's dom is ready (prevents "dom-ready not emitted" error)
        if (isElectron && webviewDomReady && webviewRef.current) {
            try {
                webviewRef.current.executeJavaScript(toggleScript)
                    .then(() => console.log('[Preview] Inspector toggled in webview'))
                    .catch((err: Error) => console.warn('[Preview] Toggle script failed:', err));
            } catch (err) {
                console.warn('[Preview] Toggle error:', err);
            }
        } else if (!isElectron && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage({
                type: 'SET_INSPECTOR',
                enabled: isInspectorActive
            }, '*');
        }
    }, [isInspectorActive, isElectron, webviewDomReady]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;

            const isMod = e.metaKey || e.ctrlKey;

            if (isMod && e.key === 'r') { e.preventDefault(); handleRefresh(); }
            if (isMod && e.key === '[') { e.preventDefault(); goBack(); }
            if (isMod && e.key === ']') { e.preventDefault(); goForward(); }
            if (isMod && e.key === '=') { e.preventDefault(); zoomIn(); }
            if (isMod && e.key === '-') { e.preventDefault(); zoomOut(); }
            if (isMod && e.key === '0') { e.preventDefault(); resetZoom(); }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="studio-preview animate-in" ref={containerRef}>
            {/* Header */}
            <header className="preview-header">
                {/* Navigation */}
                <div className="preview-nav-controls">
                    <IconButton
                        icon={<ArrowLeft size={16} />}
                        label="Back"
                        shortcut="Mod+["
                        onClick={goBack}
                        disabled={!canGoBack}
                    />
                    <IconButton
                        icon={<ArrowRight size={16} />}
                        label="Forward"
                        shortcut="Mod+]"
                        onClick={goForward}
                        disabled={!canGoForward}
                    />
                    <IconButton
                        icon={<RefreshCw size={16} className={isLoading ? 'spinning' : ''} />}
                        label="Refresh"
                        shortcut="Mod+R"
                        onClick={handleRefresh}
                    />
                    <IconButton
                        icon={<Home size={16} />}
                        label="Home"
                        onClick={goHome}
                    />
                </div>

                {/* URL Bar */}
                <form onSubmit={handleUrlSubmit} className="url-bar">
                    <div className="url-status">
                        {hasError ? (
                            <AlertCircle size={14} className="status-error" />
                        ) : isLoading ? (
                            <RefreshCw size={14} className="spinning" />
                        ) : (
                            <ShieldCheck size={14} className="status-ok" />
                        )}
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL (e.g. localhost:3000)"
                    />
                    <IconButton
                        icon={isBookmarked ? <Star size={14} fill="currentColor" /> : <Star size={14} />}
                        label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        onClick={toggleBookmark}
                        className={isBookmarked ? 'bookmarked' : ''}
                    />
                    <div className="history-dropdown-wrapper">
                        <IconButton
                            icon={<History size={14} />}
                            label="History"
                            onClick={() => setShowHistory(!showHistory)}
                        />
                        {showHistory && (
                            <div className="history-dropdown">
                                <div className="dropdown-header">
                                    <Clock size={12} />
                                    <span>Recent</span>
                                </div>
                                {history.slice().reverse().slice(0, 10).map((entry, idx) => (
                                    <button
                                        key={idx}
                                        className="history-item"
                                        onClick={() => {
                                            navigateTo(entry.url, false);
                                            setShowHistory(false);
                                        }}
                                    >
                                        <Globe size={12} />
                                        <span>{entry.url}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                {/* Controls */}
                <div className="preview-controls">
                    {/* Inspector Toggle */}
                    <button
                        className={`inspector-toggle ${isInspectorActive ? 'active' : ''}`}
                        onClick={() => setIsInspectorActive(!isInspectorActive)}
                        title="Visual Inspector"
                    >
                        <MousePointer2 size={14} />
                        <span>Inspect</span>
                    </button>

                    <div className="preview-divider" />

                    {/* Device Selector */}
                    <div className="device-selector">
                        <button
                            className="device-selector-btn"
                            onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                        >
                            {device === 'desktop' || device === 'laptop' ? <Monitor size={14} /> :
                             device.includes('ipad') ? <Tablet size={14} /> : <Smartphone size={14} />}
                            <ChevronDown size={12} />
                        </button>
                        {showDeviceMenu && (
                            <div className="device-menu">
                                {DEVICE_PRESETS.map(preset => (
                                    <button
                                        key={preset.id}
                                        className={`device-menu-item ${device === preset.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setDevice(preset.id);
                                            setShowDeviceMenu(false);
                                        }}
                                    >
                                        <preset.icon size={14} />
                                        <span>{preset.name}</span>
                                        <span className="device-size">{preset.width}×{preset.height}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="preview-divider" />

                    {/* Zoom Controls */}
                    <div className="zoom-controls">
                        <IconButton
                            icon={<ZoomOut size={14} />}
                            label="Zoom out"
                            onClick={zoomOut}
                            disabled={scale <= 0.25}
                        />
                        <button className="zoom-level" onClick={resetZoom} title="Reset zoom">
                            {Math.round(scale * 100)}%
                        </button>
                        <IconButton
                            icon={<ZoomIn size={14} />}
                            label="Zoom in"
                            onClick={zoomIn}
                            disabled={scale >= 2}
                        />
                    </div>

                    <div className="preview-divider" />

                    {/* Actions */}
                    <IconButton
                        icon={<Camera size={14} />}
                        label="Screenshot"
                        onClick={takeScreenshot}
                    />
                    <IconButton
                        icon={<Maximize2 size={14} />}
                        label="Fullscreen"
                        onClick={toggleFullscreen}
                    />
                    <IconButton
                        icon={<ExternalLink size={14} />}
                        label="Open in browser"
                        onClick={() => window.open(previewUrl, '_blank')}
                    />
                </div>
            </header>

            {/* Bookmarks Bar */}
            {bookmarks.length > 0 && (
                <div className="bookmarks-bar">
                    {bookmarks.map((bookmark, idx) => (
                        <button
                            key={idx}
                            className="bookmark-item"
                            onClick={() => navigateTo(bookmark.url)}
                            title={bookmark.url}
                        >
                            <Bookmark size={10} />
                            <span>{bookmark.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Viewport */}
            <div className="preview-viewport-container">
                <div
                    className="preview-viewport-wrapper"
                    style={!isDesktopMode ? { transform: `scale(${scale})`, alignItems: 'center', justifyContent: 'center' } : {}}
                >
                    <div className="preview-frame-container" style={getDeviceStyles()}>
                        {/* Frame Header (Browser Chrome) - only show for non-desktop */}
                        {!isDesktopMode && (
                            <div className="preview-frame-header">
                                <div className="frame-dots">
                                    <div className="frame-dot red" />
                                    <div className="frame-dot yellow" />
                                    <div className="frame-dot green" />
                                </div>
                                <span className="frame-url">{previewUrl}</span>
                                {!hasError && <ShieldCheck size={12} className="frame-secure" />}
                            </div>
                        )}

                        {/* Preview Frame - webview for Electron, iframe fallback */}
                        {isElectron ? (
                            <webview
                                ref={webviewRefCallback}
                                src={previewUrl}
                                className="preview-iframe preview-webview"
                                // @ts-ignore - webview attributes
                                allowpopups="true"
                                webpreferences="contextIsolation=no, javascript=yes"
                            />
                        ) : (
                            <iframe
                                ref={iframeRef}
                                src={previewUrl}
                                className="preview-iframe"
                                title="App Preview"
                                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                                onLoad={handleIframeLoad}
                                onError={handleIframeError}
                            />
                        )}

                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="preview-loading-overlay" style={isDesktopMode ? { inset: 0 } : {}}>
                                <RefreshCw size={24} className="spinning" />
                                <span>Loading...</span>
                            </div>
                        )}

                        {/* Error Overlay */}
                        {hasError && (
                            <div className="preview-error-overlay" style={isDesktopMode ? { inset: 0 } : {}}>
                                <AlertCircle size={32} />
                                <h3>Failed to load</h3>
                                <p>Could not connect to {previewUrl}</p>
                                <p className="error-hint">The server may be blocking iframe embedding (CSP)</p>
                                <div className="error-actions">
                                    <button onClick={handleRefresh}>
                                        <RefreshCw size={14} />
                                        Try Again
                                    </button>
                                    <button onClick={() => window.open(previewUrl, '_blank')} className="secondary">
                                        <ExternalLink size={14} />
                                        Open in Browser
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Selection Overlay */}
                        {isInspectorActive && displayElement && (
                            <div
                                className="selection-overlay-box"
                                style={{
                                    top: displayElement.rect.top + (isDesktopMode ? 0 : 32),
                                    left: displayElement.rect.left,
                                    width: displayElement.rect.width,
                                    height: displayElement.rect.height
                                }}
                            >
                                <div className="selection-label">
                                    <span className="tag-name">{displayElement.tagName.toLowerCase()}</span>
                                    {displayElement.className && (
                                        <span className="class-name">.{displayElement.className.split(' ')[0]}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <footer className="preview-status-bar">
                <div className="status-left">
                    {isInspectorActive && (
                        <span className="inspector-status">
                            <MousePointer2 size={10} />
                            Inspector Active - Click elements to select
                        </span>
                    )}
                </div>
                <div className="status-right">
                    <span className="status-device">
                        {DEVICE_PRESETS.find(d => d.id === device)?.name || 'Custom'}
                    </span>
                    <span className="status-zoom">{Math.round(scale * 100)}%</span>
                </div>
            </footer>
        </div>
    );
}
