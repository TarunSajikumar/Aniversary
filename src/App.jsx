import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import CelebrationPage from './pages/CelebrationPage';
import MusicPlayer from './components/MusicPlayer';
import TapOverlay from './components/TapOverlay';
import './styles/base.css';
import './styles/shared.css';

const App = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasTapped, setHasTapped] = useState(false);
    const audioRef = useRef(null);

    // Initialize Audio Instance on Mount
    useEffect(() => {
        const audio = new Audio('/song/song.mp3');
        audio.loop = true;
        audio.volume = 0.45;
        audioRef.current = audio;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playMusic = () => {
        if (!audioRef.current) return;
        audioRef.current.play()
            .then(() => {
                setIsPlaying(true);
                setHasTapped(true);
            })
            .catch((err) => {
                console.log("Audio playback failed, requires user interaction first:", err);
                setIsPlaying(false);
            });
    };

    const pauseMusic = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const toggleMusic = () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    };

    const handleDismissOverlay = () => {
        playMusic();
    };

    return (
        <Router>
            {/* Global Music Control */}
            {hasTapped && (
                <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />
            )}

            {/* Tap to Begin Overlay - displayed until user performs the first tap */}
            {!hasTapped && (
                <TapOverlay onDismiss={handleDismissOverlay} />
            )}

            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/celebration" element={<CelebrationPage />} />
            </Routes>
        </Router>
    );
};

export default App;
