import React, { useEffect, useRef, useState } from 'react';

const MeshBackground = () => {
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Start fade in after 2.3 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let mouseX = 0;
        let mouseY = 0;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create nodes
        const nodes = [];
        const nodeCount = 30;
        const connectionDistance = 120;
        const hoverDistance = 150; // Distance to check for hover connections

        class Node {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.radius = 4;
                this.originalRadius = this.radius;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 50) {
                    this.radius = this.originalRadius * 2;
                } else {
                    this.radius = this.originalRadius;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
        }

        // Initialize nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw nodes
            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            // Draw regular connections
            nodes.forEach((node, i) => {
                nodes.slice(i + 1).forEach(otherNode => {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = 'rgba(255, 255, 255, 20)';
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                });
            });

            // Draw hover connections
            nodes.forEach((node, i) => {
                nodes.slice(i + 1).forEach(otherNode => {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Check if mouse is between these nodes
                    const mouseToNode1 = Math.sqrt(
                        Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2)
                    );
                    const mouseToNode2 = Math.sqrt(
                        Math.pow(mouseX - otherNode.x, 2) + Math.pow(mouseY - otherNode.y, 2)
                    );

                    if (mouseToNode1 < hoverDistance && mouseToNode2 < hoverDistance) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = 'rgba(255, 255, 255, 255)';
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                opacity: isVisible ? 0.25 : 0,
                transition: 'opacity 1s ease-in-out'
            }}
        />
    );
};

export default MeshBackground;