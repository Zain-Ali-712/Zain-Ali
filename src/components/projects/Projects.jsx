import React from 'react';
import './Projects.css';

const projects = [
    {
        title: 'Zain Web Dev',
        description: (
            <>
                Portfolio for myself, built with <b>React Js</b> and <b>TypeScript</b>!<br />
                This portfolio website, Pakistan, hosting inspiring speakers and sparking ideas worth spreading.
            </>
        ),
        tags: ['React Js', 'Typescript', 'CSS'],
        codeLink: '#',
        demoLink: '#',
        image: 'portfolio-project.png',
        imageRight: true,
    },
    // Add more projects here as needed
];

const ProjectCard = ({ title, description, tags, codeLink, demoLink, image, imageRight }) => (
    <div className="project-card" style={{ flexDirection: imageRight ? 'row' : 'row-reverse' }}>
        <div className="project-card-left">
            <div className="project-image-placeholder">
                <img src={image} alt={title} />
            </div>
        </div>
        <div className="project-card-right">
            <h3 className="project-title">{title}</h3>
            <p className="project-desc">{description}</p>
            <div className="project-tags">
                {tags.map((tag, idx) => (
                    <span className="project-tag" key={idx}>{tag}</span>
                ))}
            </div>
            <div className="project-links">
                <a href={codeLink} className="project-link" target="_blank" rel="noopener noreferrer">Code <i className="fa-brands fa-github"></i></a>
                <a href={demoLink} className="project-link" target="_blank" rel="noopener noreferrer">View Demo <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
            </div>
        </div>
    </div>
);

const Projects = () => {
    return (
        <section className="projects-section">
            <h2 className="projects-heading center-shadow">MY WORK</h2>
            <div className="projects-list">
                {projects.map((project, idx) => (
                    <ProjectCard key={idx} {...project} />
                ))}
            </div>
        </section>
    );
};

export default Projects; 