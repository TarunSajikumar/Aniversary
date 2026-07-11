import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/mainPage.css';

const PHRASES = [
    'Every second brings us closer together...',
    'Love grows stronger with every heartbeat...',
    'Counting down to our perfect moment...',
    'Time flies when you\'re in love...',
    'Distance is just a test of how far love can travel...',
    'Missing you is how I know I love you...'
];

const MainPage = () => {
    const navigate = useNavigate();
    const [arrived, setArrived] = useState(false);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [phraseFading, setPhraseFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhraseFading(true);
            setTimeout(() => {
                setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
                setPhraseFading(false);
            }, 600);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const handleOpenCelebration = () => {
        navigate('/celebration');
    };

    return (
        <>
            {/* Particle background */}
            <ParticleBackground count={60} type="main" />

            <div id="ann-root">
                <div className="ann-content" id="main-page">
                    <div className="ann-hearts-row">♥ ♥ ♥</div>
                    <div className="ann-label">Anniversary Countdown</div>
                    <div className="ann-title">Our Special Day</div>
                    <div className="ann-subtitle">8th August, 2026</div>

                    {!arrived ? (
                        <>
                            <CountdownTimer onArrived={setArrived} />
                            
                            <div className="ann-date-chip">
                                <span>♥</span>
                                <span>8 August 2026 · 12:00 AM</span>
                            </div>

                            <div className={`ann-message ${phraseFading ? 'fading' : ''}`} id="ann-msg">
                                {PHRASES[phraseIndex]}
                            </div>
                        </>
                    ) : (
                        <div className="ann-arrived-section" id="arrived-section">
                            <span className="ann-arrived-emoji">💕</span>
                            <div className="ann-arrived-title">Happy Anniversary!</div>
                            <div className="ann-arrived-sub">Today is our special day</div>
                            <button id="open-btn" onClick={handleOpenCelebration}>
                                ♥ &nbsp; Open Our Special Day
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MainPage;
export { PHRASES };
