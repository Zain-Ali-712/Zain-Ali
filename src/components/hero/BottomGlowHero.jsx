import React, { useEffect, useState } from 'react';
import './BottomGlowHero.css';

const BottomGlowHero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show glow when scrolling down and hide when scrolling up
            if (currentScrollY < lastScrollY && currentScrollY < 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className={`bottom-glow ${isVisible ? 'visible' : ''}`}>
        </div>
    );
};

export default BottomGlowHero; 