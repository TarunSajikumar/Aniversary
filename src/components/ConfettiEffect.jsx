import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const ConfettiEffect = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const confettiListRef = useRef([]);

    useImperativeHandle(ref, () => ({
        triggerBurst(x, y) {
            const colors = ['#ff4d79', '#ff6b9d', '#ff1a53', '#e040fb', '#ffffff', '#ffb3d1'];
            
            // Add 8 heart burst particles
            for (let i = 0; i < 8; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2;
                confettiListRef.current.push({
                    x: x,
                    y: y,
                    size: Math.random() * 5 + 2.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speedY: Math.sin(angle) * speed * 0.5,
                    speedX: Math.cos(angle) * speed * 0.5,
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 8,
                    isHeart: true,
                    isTemporary: true, // will vanish when off-screen
                });
            }

            // Add 2 white sparkles
            for (let i = 0; i < 2; i++) {
                confettiListRef.current.push({
                    x: x + (Math.random() - 0.5) * 40,
                    y: y + (Math.random() - 0.5) * 40,
                    size: Math.random() * 3 + 1.5,
                    color: '#ffffff',
                    speedY: (Math.random() - 0.5) * 2,
                    speedX: (Math.random() - 0.5) * 2,
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 5,
                    isHeart: false,
                    isTemporary: true,
                });
            }
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const drawHeart = (c, x, y, size) => {
            c.save();
            c.translate(x, y);
            c.scale(size / 10, size / 10);
            c.beginPath();
            c.moveTo(0, -3);
            c.bezierCurveTo(5, -8, 10, -3, 0, 5);
            c.bezierCurveTo(-10, -3, -5, -8, 0, -3);
            c.closePath();
            c.restore();
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Initialize falling particles
        const count = Math.min(12, Math.floor(window.innerWidth / 60));
        const colors = ['#ff4d79', '#ff6b9d', '#ff99bb', '#ffcce0', '#e040fb', '#ffffff', '#ffb3d1', '#ff1a53'];
        
        confettiListRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 5 + 2.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 1.5 + 0.8,
            speedX: (Math.random() - 0.5) * 1.0,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 3,
            isHeart: Math.random() > 0.45,
            isTemporary: false
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const activeParticles = [];

            for (const p of confettiListRef.current) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.9;

                if (p.isHeart) {
                    drawHeart(ctx, 0, 0, p.size * 2.8);
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                }
                ctx.restore();

                p.x += p.speedX;
                p.y += p.speedY;
                p.rotation += p.rotSpeed;

                // Handle out of screen bounds
                const isOffScreen = p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20;

                if (isOffScreen) {
                    if (!p.isTemporary) {
                        // Reset falling particle to top
                        p.y = -20;
                        p.x = Math.random() * canvas.width;
                        activeParticles.push(p);
                    }
                    // Temporary particles from click burst are just discarded
                } else {
                    activeParticles.push(p);
                }
            }

            confettiListRef.current = activeParticles;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            id="confetti-canvas" 
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9 }}
        />
    );
});

ConfettiEffect.displayName = 'ConfettiEffect';

export default ConfettiEffect;
