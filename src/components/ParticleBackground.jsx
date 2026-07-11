import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ count = 60, type = 'main' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const drawHeart = (c, x, y, r) => {
            c.save();
            c.translate(x, y);
            if (type === 'celebration') {
                c.scale(r / 10, r / 10);
                c.beginPath();
                c.moveTo(0, -3);
                c.bezierCurveTo(5, -8, 10, -3, 0, 5);
                c.bezierCurveTo(-10, -3, -5, -8, 0, -3);
            } else {
                c.beginPath();
                c.moveTo(0, -r * 0.3);
                c.bezierCurveTo(r * 0.5, -r, r, -r * 0.3, 0, r * 0.55);
                c.bezierCurveTo(-r, -r * 0.3, -r * 0.5, -r, 0, -r * 0.3);
            }
            c.closePath();
            c.restore();
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Initialize particles
        const actualCount = type === 'celebration' 
            ? Math.min(15, Math.floor(window.innerWidth / 50)) 
            : count;

        particles = Array.from({ length: actualCount }, () => {
            if (type === 'celebration') {
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2.5 + 1.2,
                    speedY: -(Math.random() * 0.3 + 0.1),
                    speedX: (Math.random() - 0.5) * 0.15,
                    opacity: Math.random() * 0.4 + 0.1,
                    isHeart: Math.random() > 0.5
                };
            } else {
                return {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    r: Math.random() * 5 + 2,
                    vy: -(Math.random() * 0.5 + 0.15),
                    vx: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.5 + 0.05,
                    hue: 320 + Math.random() * 40,
                    isHeart: Math.random() > 0.5,
                    wobble: Math.random() * Math.PI * 2
                };
            }
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                ctx.save();
                ctx.globalAlpha = p.opacity;

                if (type === 'celebration') {
                    ctx.fillStyle = `hsl(${330 + Math.random() * 20}, 85%, 70%)`;
                    if (p.isHeart) {
                        drawHeart(ctx, p.x, p.y, p.size * 3.8);
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();

                    p.x += p.speedX;
                    p.y += p.speedY;

                    if (p.y < -20) {
                        p.y = canvas.height + 20;
                        p.x = Math.random() * canvas.width;
                    }
                    if (p.x < -20) p.x = canvas.width + 20;
                    if (p.x > canvas.width + 20) p.x = -20;

                } else {
                    ctx.fillStyle = `hsl(${p.hue},80%,68%)`;
                    if (p.isHeart) {
                        drawHeart(ctx, p.x, p.y, p.r * 2.2);
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();

                    p.wobble += 0.018;
                    p.x += p.vx + Math.sin(p.wobble) * 0.18;
                    p.y += p.vy;

                    if (p.y < -20) {
                        p.y = canvas.height + 20;
                        p.x = Math.random() * canvas.width;
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [count, type]);

    return (
        <canvas 
            ref={canvasRef} 
            id={type === 'celebration' ? 'bg-canvas' : 'ann-canvas'} 
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: type === 'celebration' ? 2 : 1 }}
        />
    );
};

export default ParticleBackground;
