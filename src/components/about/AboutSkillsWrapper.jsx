import React, { useEffect, useState, useRef } from 'react';
import About from './About';
import Skills from '../skills/Skills';
import './AboutSkillsWrapper.css';

const AboutSkillsWrapper = () => {
    const wrapperRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!wrapperRef.current) return;

            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            // Calculate the trigger point when About section reaches bottom of viewport
            const aboutSection = wrapperRef.current.querySelector('.about-section');
            if (!aboutSection) return;

            const aboutHeight = aboutSection.offsetHeight;
            const triggerPoint = wrapperRef.current.offsetTop + aboutHeight - windowHeight;

            // Calculate progress (0 to 1)
            const progress = Math.max(0, Math.min(1, (scrollY - triggerPoint) / windowHeight));

            setScrollProgress(progress);
            setIsAnimating(progress > 0 && progress < 1);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={wrapperRef} className="about-skills-wrapper">
            {/* About section - starts normal, becomes fixed when scrolled */}
            <div
                className="about-container-wrapper"
                style={{
                    position: scrollProgress > 0 ? 'fixed' : 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    zIndex: 1,
                    transition: 'all 0.1s ease-out',
                    transform: scrollProgress > 0 ? 'translateZ(0)' : 'none'
                }}
            >
                <About />
            </div>

            {/* Skills section - slides up over About */}
            <div
                className="skills-container-wrapper"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    zIndex: 2,
                    transform: `translateY(${(1 - scrollProgress) * 100}vh) translateZ(0)`,
                    transition: 'transform 0.1s ease-out',
                    pointerEvents: scrollProgress > 0.5 ? 'auto' : 'none'
                }}
            >
                <Skills />
            </div>

            {/* Spacer div to maintain scroll height */}
            <div style={{ height: `200 + ${scrollProgress}vh` }} />
        </div>
    );
};

export default AboutSkillsWrapper; 