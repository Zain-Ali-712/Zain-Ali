import React from 'react';
import Hero from './components/hero/Hero';
import './App.css';
import About from './components/about/About';
import Skills from './components/skills/Skills';
import Projects from './components/projects/Projects';
import ContactMe from './components/contact/ContactMe';

function App() {
  return (
    <div className="app">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ContactMe />
    </div>
  );
}

export default App;
