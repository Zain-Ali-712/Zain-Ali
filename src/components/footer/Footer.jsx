import React from 'react';
import './Footer.css';
import { FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer>
            {/* First section */}
            <div className="footer-primary">
                <div className="footer-left">
                    <img src="/public/Z.png" alt="Zain Ali Logo" />
                </div>
                <div className="footer-right">
                    <div className="footer-nav">
                        <h4>Navigation</h4>
                        <ul>
                            <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                            <li><a href="#aboutme" onClick={(e) => { e.preventDefault(); scrollToSection('aboutme'); }}>About Me</a></li>
                            <li><a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a></li>
                            <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a></li>
                            <li><a href="#designs" onClick={(e) => { e.preventDefault(); scrollToSection('designs'); }}>Designs</a></li>
                            <li><a href="#reachme" onClick={(e) => { e.preventDefault(); scrollToSection('reachme'); }}>Reach Me</a></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h4>Contact</h4>
                        <p>
                            <i className="far fa-envelope"></i>
                            <a href="mailto:zainaliwebdev@gmail.com" className="contact-link">zainaliwebdev@gmail.com</a>
                        </p>
                        <p>
                            <i className="fas fa-globe"></i>
                            <a href="https://zainaliwebdev.vercel.app" target="_blank" rel="noopener noreferrer" className="contact-link">zainaliwebdev.vercel.app</a>
                        </p>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/zain-webdev-68ba04365?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"><FaLinkedinIn /></a>
                            <a href="https://www.instagram.com/zaindev_design?igsh=ZGdzZzdnd3Uwcnkw"><FaInstagram /></a>
                            <a href="https://github.com/Zain-Ali-712"><FaGithub /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second section */}
            <div className="footer-secondary">
                <p>© Zain Ali 2025. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer; 