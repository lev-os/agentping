import React from 'react';
import './PacketInspector.css';

const SAMPLE_HEX = [
    "45 00 00 3c 1a 2b 40 00 40 06 2a 3f 7f 00 00 01",
    "7f 00 00 01 fa f0 00 50 3e 2f 1a 09 00 00 00 00",
    "a0 02 72 10 3f 1a 00 00 02 04 05 b4 04 02 08 0a",
    "00 23 45 67 00 00 00 00 01 03 03 07 48 54 54 50",
    "2f 31 2e 31 20 32 30 30 20 4f 4b 0d 0a 44 61 74",
    "65 3a 20 4d 6f 6e 2c 20 32 37 20 4a 75 6c 20 32",
    "30 32 39 20 31 32 3a 32 38 3a 35 33 20 47 4d 54",
    "0d 0a 53 65 72 76 65 72 3a 20 41 67 65 6e 74 50",
    "69 6e 67 2f 32 2e 30 0d 0a 43 6f 6e 74 65 6e 74"
];

const SAMPLE_ASCII = [
    "E..@.@.*........",
    ".......P>/......",
    "..r.?...........",
    ".#Eg........HTTP",
    "/1.1 200 OK..Dat",
    "e: Mon, 27 Jul 2",
    "029 12:28:53 GMT",
    "..Server: AgentP",
    "ing/2.0..Content"
];

export const PacketInspector: React.FC = () => {
    return (
        <div className="packet-inspector">
            <div className="packet-header">
                <span>PACKET #9921 [TCP]</span>
                <span>SIZE: 144 bytes</span>
            </div>
            <div className="packet-body">
                <div className="packet-col hex">
                    <div className="col-title">HEX</div>
                    {SAMPLE_HEX.map((row, i) => (
                        <div key={i} className="hex-row">{row}</div>
                    ))}
                </div>
                <div className="packet-col ascii">
                    <div className="col-title">ASCII</div>
                    {SAMPLE_ASCII.map((row, i) => (
                        <div key={i} className="ascii-row">{row}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};
