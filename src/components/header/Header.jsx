import React, { useState } from "react";
import "./Header.css";
import zainImage from "../../../public/Z.png";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="hero-navbar-wrapper">
            <div className="hero-navbar-glow"></div>
            <div className="hero-navbar">
                <div className="hero-navbar-left">
                    <div className="hero-img-circle">
                        <img src={zainImage} alt="Zain" className="hero-profile-img" />
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
                    <li>Home</li>
                    <li>About</li>
                    <li>Skills</li>
                    <li>Projects</li>
                    <li>Designs</li>
                    <li className="hero-navbar-reachme">Reach me</li>
                </ul>

                {/* Mobile Menu Dropdown */}
                <div className={`mobile-menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>Skills</li>
                        <li>Projects</li>
                        <li>Designs</li>
                        <li className="hero-navbar-reachme">Reach me</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
