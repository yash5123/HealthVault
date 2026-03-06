import { useEffect, useRef } from "react";

export default function AnimatedBackground() {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];

    const particleCount = 120;

    function resizeCanvas() {

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    class Particle {

      constructor() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.radius = Math.random() * 2 + 1;

        this.dx = (Math.random() - 0.5) * 0.3;
        this.dy = (Math.random() - 0.5) * 0.3;

        this.opacity = Math.random() * 0.5 + 0.2;

      }

      draw() {

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(14,165,233,${this.opacity})`;

        ctx.fill();

      }

      update() {

        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= 0 || this.x >= canvas.width) {

          this.dx *= -1;

        }

        if (this.y <= 0 || this.y >= canvas.height) {

          this.dy *= -1;

        }

        this.draw();

      }

    }

    function initParticles() {

      particles = [];

      for (let i = 0; i < particleCount; i++) {

        particles.push(new Particle());

      }

    }

    initParticles();

    function animate() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => p.update());

      requestAnimationFrame(animate);

    }

    animate();

    return () => {

      window.removeEventListener("resize", resizeCanvas);

    };

  }, []);

  return (

    <canvas
      ref={canvasRef}
      className="dashboard-bg-canvas"
    />

  );

}