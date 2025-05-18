import React from 'react';
import Hero from './components/hero/Hero';
import './App.css';
import About from './components/about/About';
import Skills from './components/skills/Skills';
import Projects from './components/projects/Projects';
import ContactMe from './components/contact/ContactMe';
import Footer from './components/footer/Footer';

function App() {
  return (
    <div className="app">
      <section id="home">
        <Hero />
      </section>
      <section id="aboutme">
        <About />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="designs">
        {/* Design section will be added later */}
      </section>
      <section id="reachme">
        <ContactMe />
      </section>
      <Footer />
    </div>
  );
}

export default App;
