interface KbdProps {
    keys: string;
    className?: string;
}

const KEY_SYMBOLS: Record<string, string> = {
    cmd: '\u2318',
    command: '\u2318',
    ctrl: '\u2303',
    control: '\u2303',
    alt: '\u2325',
    option: '\u2325',
    shift: '\u21E7',
    enter: '\u21B5',
    return: '\u21B5',
    backspace: '\u232B',
    delete: '\u2326',
    escape: '\u238B',
    esc: '\u238B',
    tab: '\u21E5',
    up: '\u2191',
    down: '\u2193',
    left: '\u2190',
    right: '\u2192',
    space: '\u2423',
};

export function Kbd({ keys, className = '' }: KbdProps) {
    const isMac = window.platform?.isMac ?? navigator.platform.includes('Mac');

    const parseKeys = (keyString: string): string[] => {
        return keyString.split('+').map(key => {
            const k = key.trim().toLowerCase();

            // Convert Cmd/Ctrl based on platform
            if (k === 'mod' || k === 'cmdctrl') {
                return isMac ? KEY_SYMBOLS.cmd : 'Ctrl';
            }

            // Look up symbol or capitalize
            return KEY_SYMBOLS[k] || key.trim().toUpperCase();
        });
    };

    const keyParts = parseKeys(keys);

    return (
        <span className={`ui-kbd-group ${className}`}>
            {keyParts.map((key, i) => (
                <kbd key={i} className="ui-kbd">
                    {key}
                </kbd>
            ))}
        </span>
    );
}
