import React from 'react';
import Header from '../header/Header';
import './Hero.css';
import signature from '../../../public/signature.png';
import MeshBackground from './MeshBackground';
import BottomGlowHero from './BottomGlowHero';

const Hero = () => {
  return (
    <section className="hero-gradient-bg">
      <MeshBackground />
      <BottomGlowHero />
      <Header />
      <div className="hero-content">
        <div className="hero-center-block">
          <div className="hero-text-main-block">
            <span className="hero-text-main">ZAIN'S
              <span className="hero-signature-overlay">
                <img
                  src={signature}
                  alt="Signature"
                  className="hero-signature-img"
                />
              </span>
            </span>
            <span className="hero-text-mirror">ZAIN</span>
          </div>
          <div className="hero-side-stack">
            <span className="hero-text-web">Web</span>
            <span className="hero-text-design">DESIGN</span>
            <span className="hero-text-sub">AND DEVELOPMENT</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

