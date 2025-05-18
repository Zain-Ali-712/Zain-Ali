import React, { useState } from "react";
import "./Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false); // Close mobile menu after clicking
        }
    };

    return (
        <nav className="hero-navbar-wrapper">
            <div className="hero-navbar-glow"></div>
            <div className="hero-navbar">
                <div className="hero-navbar-left">
                    <div className="hero-img-circle">
                        <img src='/Z.png' alt="Zain" className="hero-profile-img" />
                    </div>
                    <span className="hero-portfolio-name">ZainDev</span>
                </div>

                {/* Mobile Menu Button */}
                <div className="mobile-menu-button" onClick={toggleMenu}>
                    <span>Home</span>
                    <div className={`dropdown-icon ${isMenuOpen ? 'open' : ''}`}></div>
                </div>

                {/* Desktop Menu */}
                <ul className="hero-navbar-links desktop-menu">
                    <li onClick={() => scrollToSection('home')}>Home</li>
                    <li onClick={() => scrollToSection('aboutme')}>About</li>
                    <li onClick={() => scrollToSection('skills')}>Skills</li>
                    <li onClick={() => scrollToSection('projects')}>Projects</li>
                    <li onClick={() => scrollToSection('designs')}>Designs</li>
                    <li className="hero-navbar-reachme" onClick={() => scrollToSection('reachme')}>Reach me</li>
                </ul>

                {/* Mobile Menu Dropdown */}
                <div className={`mobile-menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li onClick={() => scrollToSection('home')}>Home</li>
                        <li onClick={() => scrollToSection('aboutme')}>About</li>
                        <li onClick={() => scrollToSection('skills')}>Skills</li>
                        <li onClick={() => scrollToSection('projects')}>Projects</li>
                        <li onClick={() => scrollToSection('designs')}>Designs</li>
                        <li className="hero-navbar-reachme" onClick={() => scrollToSection('reachme')}>Reach me</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
