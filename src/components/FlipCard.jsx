import React, { useState, useEffect } from 'react';

const FlipCard = ({ value, label }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (value !== displayValue) {
            setIsFlipping(true);
            setDisplayValue(value);
            
            const timer = setTimeout(() => {
                setIsFlipping(false);
            }, 380);
            
            return () => clearTimeout(timer);
        }
    }, [value, displayValue]);

    return (
        <div className="ann-unit">
            <div className={`flip-card ${isFlipping ? 'flipping' : ''}`}>
                <div className="flip-inner">
                    <div className="flip-front">{displayValue}</div>
                    <div className="flip-back">{displayValue}</div>
                </div>
            </div>
            <div className="ann-uname">{label}</div>
        </div>
    );
};

export default FlipCard;
