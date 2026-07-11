import React, { useState, useEffect } from 'react';
import FlipCard from './FlipCard';

const TARGET_DATE = new Date('2026-08-08T00:00:00');
const JOURNEY_START = new Date('2025-08-08T00:00:00');

const CountdownTimer = ({ onArrived }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    });
    const [progressPercent, setProgressPercent] = useState(0);

    const pad = (num) => String(Math.floor(num)).padStart(2, '0');

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const diff = TARGET_DATE - now;

            if (diff <= 0) {
                setProgressPercent(100);
                onArrived(true);
                return false;
            }

            const totalMs = TARGET_DATE - JOURNEY_START;
            const doneMs = now - JOURNEY_START;
            const pct = Math.min(100, Math.max(0, (doneMs / totalMs) * 100));
            setProgressPercent(pct);

            const totalSeconds = Math.floor(diff / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setTimeLeft({
                days: pad(days),
                hours: pad(hours),
                minutes: pad(minutes),
                seconds: pad(seconds)
            });

            return true;
        };

        const isOngoing = calculateTime();
        if (!isOngoing) return;

        const timer = setInterval(() => {
            const ongoing = calculateTime();
            if (!ongoing) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [onArrived]);

    return (
        <>
            {/* Countdown timer cards */}
            <div className="ann-timer" id="ann-timer">
                <FlipCard value={timeLeft.days} label="Days" />
                <div className="ann-sep">:</div>
                <FlipCard value={timeLeft.hours} label="Hours" />
                <div className="ann-sep">:</div>
                <FlipCard value={timeLeft.minutes} label="Minutes" />
                <div className="ann-sep">:</div>
                <FlipCard value={timeLeft.seconds} label="Seconds" />
            </div>

            {/* Progress bar */}
            <div className="ann-progress-wrap" id="progress-wrap">
                <div className="progress-label">Journey so far</div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPercent.toFixed(2)}%` }}></div>
                </div>
            </div>
        </>
    );
};

export default CountdownTimer;
export { TARGET_DATE, JOURNEY_START };
