import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import ConfettiEffect from '../components/ConfettiEffect';
import '../styles/celebrationPage.css';

/* --- Slideshow Data Start --- */
const slidesData = [
    'assets/ChatGPT Image Feb 8, 2026, 09_33_37 PM.webp',
    'assets/ChatGPT Image May 31, 2026, 10_43_28 PM.webp',
    'assets/IMG-20241126-WA0052.webp',
    'assets/IMG_20251114_141133386~2_LE_upscale_balanced_tone_enhance_40_color_enhance_60.webp',
    'assets/IMG_20260121_171059266.webp',
    'assets/IMG_20260121_171942117_HDR.webp',
    'assets/IMG_20260121_172158994.webp',
    'assets/IMG_20260121_172204461.webp',
    'assets/IMG_20260202_163522911.webp',
    'assets/IMG_20260211_011240.webp',
    'assets/IMG_20260224_010705.webp',
    'assets/IMG_20260321_162143072.webp',
    'assets/IMG_20260321_162147235.webp',
    'assets/IMG_20260321_162149983.webp',
    'assets/IMG_20260406_193506996_BURST000_COVER.webp',
    'assets/IMG_20260406_221646251.webp',
    'assets/IMG_20260406_221805014_HDR.webp',
    'assets/IMG_20260406_233716480_BURST000_COVER.webp',
    'assets/IMG_20260615_172652752.webp',
    'assets/IMG_20260626_182156143.webp',
    'assets/IMG_20260627_075918335_HDR.webp',
    'assets/IMG_20260627_080029372_BURST000_COVER.webp',
    'assets/IMG_20260627_102215795_HDR.webp',
    'assets/Screenshot_20260118-225855.webp',
    'assets/Screenshot_20260527-202032.webp',
    'assets/Snapchat-1111292778.webp',
    'assets/Snapchat-1384230705.webp',
    'assets/Snapchat-1887889424.webp'
];
/* --- Slideshow Data End --- */

const DEFAULT_LOVE_MSG = `Every love story is beautiful, but ours is my favourite.<br>Here's to another year of laughter, love, and everything in between.`;

const CelebrationPage = () => {
    const confettiRef = useRef(null);
    
    // Slideshow state
    const [slides, setSlides] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);

    // Love lines state
    const [loveSlides, setLoveSlides] = useState([]);
    const [loveIndex, setLoveIndex] = useState(0);
    const [loveFading, setLoveFading] = useState(false);

    // Helper: Shuffle array
    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Helper: Parse love text lines into pairs of 2
    const parseLoveLines = (text) => {
        const paragraphs = text.split(/\r?\n\r?\n+/);
        const list = [];
        paragraphs.forEach(para => {
            const lines = para.split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line.length > 0);

            if (lines.length === 0) return;

            for (let i = 0; i < lines.length; i += 2) {
                const chunk = lines.slice(i, i + 2);
                list.push(chunk.join('<br>'));
            }
        });
        return list;
    };

    // Initialize Slideshow Shuffled list
    useEffect(() => {
        const shuffled = shuffle(slidesData);
        setSlides(shuffled);
    }, []);

    // Slideshow Interval Timer
    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setSlideIndex((prev) => {
                const next = prev + 1;
                if (next >= slides.length) {
                    // Reshuffle slides but ensure the first item is not the same as the last item
                    const lastSlide = slides[slides.length - 1];
                    const reshuffled = shuffle(slides);
                    if (reshuffled[0] === lastSlide && reshuffled.length > 1) {
                        [reshuffled[0], reshuffled[reshuffled.length - 1]] = [reshuffled[reshuffled.length - 1], reshuffled[0]];
                    }
                    setSlides(reshuffled);
                    return 0;
                }
                return next;
            });
        }, 7000);

        return () => clearInterval(interval);
    }, [slides]);

    // Load love lines
    useEffect(() => {
        fetch('/love.txt')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load love.txt');
                return res.text();
            })
            .then(text => {
                if (text.trim()) {
                    const parsed = parseLoveLines(text);
                    if (parsed.length > 0) {
                        setLoveSlides(parsed);
                    } else {
                        setLoveSlides(parseLoveLines(DEFAULT_LOVE_MSG));
                    }
                }
            })
            .catch(() => {
                setLoveSlides(parseLoveLines(DEFAULT_LOVE_MSG));
            });
    }, []);

    // Rotate love lines
    useEffect(() => {
        if (loveSlides.length <= 1) return;

        const interval = setInterval(() => {
            setLoveFading(true);
            setTimeout(() => {
                setLoveIndex((prev) => (prev + 1) % loveSlides.length);
                setLoveFading(false);
            }, 600);
        }, 8000);

        return () => clearInterval(interval);
    }, [loveSlides]);

    // Click handler to trigger bursts on container
    const handleContainerClick = (e) => {
        // Exclude clicks on interactive elements like back button or BGM player
        if (e.target.closest('.cel-back') || e.target.closest('#music-btn')) {
            return;
        }
        if (confettiRef.current) {
            confettiRef.current.triggerBurst(e.clientX, e.clientY);
        }
    };

    return (
        <div 
            className="celebration-view"
            onClick={handleContainerClick}
            style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            {/* Background slideshow */}
            <div id="ann-bg">
                {slides.map((src, index) => {
                    const isActive = index === slideIndex;
                    const isPreload = index === (slideIndex + 1) % slides.length;
                    const shouldLoad = isActive || isPreload;
                    return (
                        <div
                            key={src}
                            className={`bg-slide ${isActive ? 'active' : ''}`}
                            style={{
                                backgroundImage: shouldLoad ? `url('${src}')` : 'none',
                            }}
                        />
                    );
                })}
                <div className="bg-overlay"></div>
            </div>

            {/* Canvas Layers */}
            <ParticleBackground type="celebration" />
            <div className="ann-blur-overlay"></div>
            <ConfettiEffect ref={confettiRef} />

            {/* Back Navigation */}
            <Link to="/" className="cel-back">
                <i>←</i> Back
            </Link>

            {/* Main Container */}
            <div className="container" title="Click anywhere for hearts! ♥">
                <h1 className="cel-title">Happy Anniversary</h1>
                <div className="cel-subtitle">You & Me, Always · 8 August 2026</div>

                <div className="cel-msg-box">
                    <span 
                        className={`cel-msg-text ${loveFading ? 'fade-out' : ''}`}
                        dangerouslySetInnerHTML={{ __html: loveSlides[loveIndex] || DEFAULT_LOVE_MSG }}
                    />
                </div>

                <div className="cel-hearts">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="heart-icon" viewBox="0 0 32 29.6">
                            <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2 c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
                        </svg>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CelebrationPage;
export { slidesData, DEFAULT_LOVE_MSG };
