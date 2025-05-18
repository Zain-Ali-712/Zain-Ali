import React from 'react';
import './About.css';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';
import MeshBackground from '../hero/MeshBackground';
import TopGlowAbout from './TopGlowAbout';

const About = () => {
    return (
        <section className="about-section">
            <MeshBackground />
            <TopGlowAbout />
            <div className="about-container">
                {/* Image Container */}
                <div className="about-image-container">
                    <img
                        src='/Zain.png'
                        alt="Zain Ali"
                        className="about-image"
                    />
                </div>

                {/* Text Container */}
                <div className="about-text-container">
                    <h1 className="about-name">Zain Ali</h1>
                    <h2 className="about-title">Full Stack Developer</h2>
                    <p className="about-bio">
                        A passionate full-stack developer with expertise in creating modern,
                        responsive web applications. Specializing in React, Node.js, and
                        cloud technologies, I bring ideas to life through clean, efficient code
                        and intuitive user experiences.
                    </p>
                    <p className="about-description">
                        With a strong foundation in front-end and passion for designing with creativity,
                        I focus on building scalable solutions that make a real impact.
                    </p>

                    {/* Social Media Icons */}
                    <div className="social-icons">
                        <a href="https://www.linkedin.com/in/zain-webdev-68ba04365?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="social-icon" />
                        </a>
                        <a href="https://github.com/Zain-Ali-712" target="_blank" rel="noopener noreferrer">
                            <FaGithub className="social-icon" />
                        </a>
                        <a href="https://www.threads.net/@zaindev_design" target="_blank" rel="noopener noreferrer">
                            <SiThreads className="social-icon" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com/zaindev_design?igsh=ZGdzZzdnd3Uwcnkw" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="social-icon" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;