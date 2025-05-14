import React from 'react';
import Hero from './components/hero/Hero';
import './App.css';
import About from './components/about/About';
import Skills from './components/skills/Skills';
import Projects from './components/projects/Projects';

function App() {
  return (
    <div className="app">
      <Hero />
      <About />
      <Skills />
      <Projects />
    </div>
  );
}

export default App;
