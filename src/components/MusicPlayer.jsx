import React from 'react';

const MusicPlayer = ({ isPlaying, onToggle }) => {
    return (
        <div 
            id="music-btn" 
            onClick={onToggle} 
            title="Toggle music"
        >
            <div className={`music-bars ${isPlaying ? 'music-playing' : ''}`} id="music-bars">
                <div className="music-bar bar1"></div>
                <div className="music-bar bar2"></div>
                <div className="music-bar bar3"></div>
                <div className="music-bar bar4"></div>
            </div>
            <div id="music-label">{isPlaying ? 'ON' : 'OFF'}</div>
        </div>
    );
};

export default MusicPlayer;
