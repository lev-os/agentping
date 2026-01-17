
import React from 'react';
import './HexDumpView.css';

interface HexDumpProps {
    data: ArrayBuffer | Uint8Array | string;
    title?: string;
}

export const HexDumpView: React.FC<HexDumpProps> = ({ data, title }) => {
    const getBytes = (): Uint8Array => {
        if (typeof data === 'string') {
            return new TextEncoder().encode(data);
        }
        if (data instanceof ArrayBuffer) {
            return new Uint8Array(data);
        }
        return data;
    };

    const bytes = getBytes();
    const rows = [];
    const bytesPerRow = 16;

    for (let i = 0; i < bytes.length; i += bytesPerRow) {
        const rowBytes = bytes.subarray(i, i + bytesPerRow);
        rows.push({
            offset: i,
            bytes: rowBytes,
        });
    }

    const formatOffset = (offset: number) => offset.toString(16).padStart(8, '0').toUpperCase();
    const formatByte = (byte: number) => byte.toString(16).padStart(2, '0').toUpperCase();
    const formatAscii = (byte: number) => (byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.');

    return (
        <div className="hex-dump-view">
            <div className="hex-header">
                <h3 className="hex-title">{title || 'HEX DUMP'}</h3>
                <div className="hex-info">{bytes.length} BYTES</div>
            </div>
            <div className="hex-container">
                {rows.map((row) => (
                    <div key={row.offset} className="hex-row">
                        <span className="hex-offset">{formatOffset(row.offset)}</span>
                        <div className="hex-bytes">
                            {[...Array(bytesPerRow)].map((_, i) => (
                                <span key={i} className={`hex-byte ${i >= row.bytes.length ? 'empty' : ''}`}>
                                    {i < row.bytes.length ? formatByte(row.bytes[i]) : '  '}
                                </span>
                            ))}
                        </div>
                        <div className="hex-ascii">
                            {[...Array(bytesPerRow)].map((_, i) => (
                                <span key={i} className="hex-char">
                                    {i < row.bytes.length ? formatAscii(row.bytes[i]) : ' '}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
