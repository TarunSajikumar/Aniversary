import React, { useState } from 'react';

const TapOverlay = ({ onDismiss }) => {
    const [isHiding, setIsHiding] = useState(false);

    const handleClick = () => {
        setIsHiding(true);
        onDismiss(); // starts audio immediately
    };

    if (isHiding) {
        // We let the animation handle the fade out and then the component will be removed by parent
        // Let's render the overlay with the "hiding" class.
    }

    return (
        <div 
            id="tap-overlay" 
            className={isHiding ? 'hiding' : ''} 
            onClick={handleClick}
        >
            <div className="tap-heart">♥</div>
            <div className="tap-text">Tap to Begin</div>
            <div className="tap-sub">touch anywhere</div>
        </div>
    );
};

export default TapOverlay;
