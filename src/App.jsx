import React from 'react';
import Hero from './components/hero/Hero';
import AboutSkillsWrapper from './components/about/AboutSkillsWrapper';
import './App.css';

function App() {
  return (
    <div className="app">
      <Hero />
      <AboutSkillsWrapper />
    </div>
  );
}

export default App;
