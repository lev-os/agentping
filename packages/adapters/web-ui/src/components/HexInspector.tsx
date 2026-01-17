import React from 'react';
import './HexInspector.css';

interface HexInspectorProps {
    data: Uint8Array | number[]; // Raw bytes
    className?: string;
}

export function HexInspector({ data, className }: HexInspectorProps) {
    const bytes = Array.from(data);
    const rows = [];
    const BYTES_PER_ROW = 16;

    for (let i = 0; i < bytes.length; i += BYTES_PER_ROW) {
        rows.push(bytes.slice(i, i + BYTES_PER_ROW));
    }

    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    const toAscii = (n: number) => (n >= 32 && n <= 126) ? String.fromCharCode(n) : '.';

    return (
        <div className={`hex-inspector ${className || ''}`}>
            <div className="hex-header">
                <span className="hex-offset-hdr">Offset</span>
                <span className="hex-bytes-hdr">00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</span>
                <span className="hex-ascii-hdr">Decoded Text</span>
            </div>
            <div className="hex-body">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="hex-row">
                        <span className="hex-offset">
                            {(rowIndex * BYTES_PER_ROW).toString(16).padStart(8, '0').toUpperCase()}
                        </span>
                        <span className="hex-bytes">
                            {row.map((b, i) => (
                                <span key={i} className="hex-byte">{toHex(b)}</span>
                            ))}
                            {/* Padding for incomplete rows */}
                            {Array(BYTES_PER_ROW - row.length).fill(0).map((_, i) => (
                                <span key={`pad-${i}`} className="hex-byte empty">--</span>
                            ))}
                        </span>
                        <span className="hex-ascii">
                            {row.map(b => toAscii(b)).join('')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
