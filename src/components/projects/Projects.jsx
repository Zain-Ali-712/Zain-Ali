import React from 'react';
import './Projects.css';

const projects = [
    {
        title: 'Syncwave Chat App',
        description: (
            <>
                A real-time chat app with <b>polished UI/UX</b> built in <b>React.js</b>. Features: <b>private chats</b>, <b>AI chat</b>, <b>anonymous groups</b>. All <b>frontend design & development</b> led by me.
            </>
        ),
        tags: ['React Js', 'Socket.io', 'Express.js', 'UI/UX'],
        codeLink: 'https://github.com/SMAbbasHussain/SyncWave.git',
        demoLink: 'https://sync-wave-tan.vercel.app/',
        image: 'syncwave.png',
        imageRight: true,
    },
    {
        title: 'Zain Web Dev',
        description: (
            <>
                Portfolio for myself, built with <b>React Js</b> and <b>TypeScript</b>!<br />
                This portfolio website, Pakistan, hosting inspiring speakers and sparking ideas worth spreading.
            </>
        ),
        tags: ['React Js', 'Typescript', 'Three Js', 'CSS'],
        codeLink: 'https://github.com/Zain-Ali-712/Zain-Ali',
        demoLink: 'https://zaindev-nine.vercel.app/',
        image: 'portfolio-project.png',
        imageRight: false,
    },
    {
        title: 'Airbnb Homepage Clone',
        description: (
            <>
                A hands-on project built to strengthen my skills in JavaScript and jQuery, focusing on real-time interactivity and dynamic UI updates. It showcases my understanding of DOM manipulation.
            </>
        ),
        tags: ['JavaScript', 'JQuery', 'CSS', 'HTML'],
        codeLink: 'https://github.com/Zain-Ali-712/Airbnb-clone',
        demoLink: 'https://airbnb-home-clone.vercel.app/',
        image: 'Airbnb.png',
        imageRight: true,
    },
    {
        title: 'Beginner Mini Projects',
        description: (
            <>
                A collection of four mini practice projects created while newly learning JavaScript and JQuery.
                Each project demonstrates different aspects like game and shows my intent to create and learn something, from basic layouts to
                interactive components.
            </>
        ),
        tags: ['HTML', 'CSS', 'JavaScript', 'JQuery'],
        demoLink: '#',
        isMiniProjects: true,
        miniProjects: [
            {
                title: 'Rock-Paper-Scissors',
                image: 'RPS.png',
                demoLink: 'https://rock-papper-scisors-game.vercel.app/'
            },
            {
                title: 'Currency Converter',
                image: 'currency-converter.png',
                demoLink: 'https://currency-converter-practice.vercel.app/'
            },
            {
                title: 'To-Do List',
                image: 'To-Do-List.png',
                demoLink: 'https://todo-list-ptacticeproject.vercel.app/'
            },
            {
                title: 'Tic-Tac-Toe',
                image: 'Tic-tac.png',
                demoLink: 'https://tic-tac-toe-game-practice.vercel.app/'
            }
        ]
    }
];

const MiniProjectCard = ({ title, image, demoLink }) => (
    <div className="mini-project-item">
        <div className="mini-project-image">
            <img src={image} alt={title} />
        </div>
        <h4 className="mini-project-title">{title}</h4>
        <a href={demoLink} className="mini-project-link" target="_blank" rel="noopener noreferrer">
            <i className="fas fa-external-link-alt"></i>
            View Demo
        </a>
    </div>
);

const ProjectCard = ({ title, description, tags, codeLink, demoLink, image, imageRight, isMiniProjects, miniProjects }) => {
    if (isMiniProjects) {
        return (
            <div className="project-card mini-projects-card">
                <div className="mini-projects-grid">
                    {miniProjects.map((project, idx) => (
                        <MiniProjectCard key={idx} {...project} />
                    ))}
                </div>
                <div className="mini-projects-info">
                    <h3 className="project-title">{title}</h3>
                    <p className="project-desc">{description}</p>
                    <div className="project-tags">
                        {tags.map((tag, idx) => (
                            <span className="project-tag" key={idx}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
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
                    <a href={codeLink} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-code"></i>
                        Code
                    </a>
                    <a href={demoLink} className="project-link" target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-external-link-alt"></i>
                        View Demo
                    </a>
                </div>
            </div>
        </div>
    );
};

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