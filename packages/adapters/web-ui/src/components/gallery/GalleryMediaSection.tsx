import React from 'react';
import {
    VideoPlayer,
    AudioPlayer
} from '../index';

export const GalleryMediaSection = () => {
    return (
        <div className="app-grid">
            <div className="app-card" style={{ gridColumn: '1 / -1' }}>
                <div className="app-card-header">
                    <h3>VideoPlayer</h3>
                    <p>Session playback</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <VideoPlayer
                        markers={[
                            { time: 20, label: 'Error occurred' },
                            { time: 80, label: 'Resolved' }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: '1 / -1' }}>
                <div className="app-card-header">
                    <h3>AudioPlayer</h3>
                    <p>Voice interaction</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <AudioPlayer src="#" title="Agent Response - Session 42" />
                </div>
            </div>
        </div>
    );
};
