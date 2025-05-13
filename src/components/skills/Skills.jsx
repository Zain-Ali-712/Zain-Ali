import React from 'react';
import './Skills.css';

// Import skill icons (SVGs or PNGs in public/skills/ or use react-icons as fallback)
import { FaReact, FaNodeJs, FaCss3Alt, FaJs, FaHtml5 } from 'react-icons/fa';
import { SiNextdotjs, SiJquery, SiCplusplus } from 'react-icons/si';

const skills = [
    { name: 'React JS', icon: <FaReact color="#61DAFB" />, color: '#61DAFB' },
    { name: 'Next JS', icon: <SiNextdotjs color="#000000" />, color: '#000000' },
    { name: 'Node JS', icon: <FaNodeJs color="#3C873A" />, color: '#3C873A' },
    { name: 'Javascript', icon: <FaJs color="#F7DF1E" />, color: '#F7DF1E' },
    { name: 'jQuery', icon: <SiJquery color="#0769AD" />, color: '#0769AD' },
    { name: 'CSS', icon: <FaCss3Alt color="#1572B6" />, color: '#1572B6' },
    { name: 'HTML', icon: <FaHtml5 color="#E34F26" />, color: '#E34F26' },
    { name: 'C++', icon: <SiCplusplus color="#00599C" />, color: '#00599C' },
];

const Skills = () => {
    return (
        <section className="skills-section">
            <h2 className="skills-heading">Skills</h2>
            <div className="skills-row">
                {skills.map((skill) => (
                    <div className="skill-item" key={skill.name}>
                        <div className="skill-icon" style={{ '--skill-color': skill.color }}>{skill.icon}</div>
                        <span className="skill-name">{skill.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Skills;