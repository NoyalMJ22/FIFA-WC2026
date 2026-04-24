"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function Particle({ delay, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: "110%" }}
      animate={{ opacity: [0, 0.4, 0], y: "-10%" }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute w-[2px] h-[2px] rounded-full"
      style={{
        left: side === "left" ? `${15 + Math.random() * 25}%` : `${55 + Math.random() * 30}%`,
        background: Math.random() > 0.5 ? "rgba(0, 229, 255, 0.3)" : "rgba(255, 215, 0, 0.25)",
        boxShadow: Math.random() > 0.5 ? "0 0 6px rgba(0, 229, 255, 0.5)" : "0 0 6px rgba(255, 215, 0, 0.4)",
      }}
    />
  );
}

function LightRay({ delay, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -30 : 30, rotate: side === "left" ? -15 : 15 }}
      animate={{ opacity: [0, 0.15, 0], x: side === "left" ? 30 : -30 }}
      transition={{ duration: 6 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 w-[80px] h-full pointer-events-none"
      style={{
        left: side === "left" ? "10%" : "60%",
        background: "linear-gradient(to bottom, rgba(0, 229, 255, 0.08), transparent)",
        transformOrigin: "top center",
      }}
    />
  );
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    let gradientPhase = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 1.5 - 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.6 ? "0, 229, 255" : Math.random() > 0.3 ? "255, 215, 0" : "0, 255, 135",
    });

    const init = () => {
      resize();
      particles = Array.from({ length: 40 }, createParticle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gradientPhase += 0.003;

      const gradient = ctx.createRadialGradient(
        canvas.width * (0.3 + Math.sin(gradientPhase) * 0.1),
        canvas.height * 0.3,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.7
      );
      gradient.addColorStop(0, "rgba(0, 100, 255, 0.04)");
      gradient.addColorStop(0.5, "rgba(0, 50, 150, 0.02)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.02;

        if (p.y < -10 || p.x < 0 || p.x > canvas.width) {
          particles[i] = createParticle();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute inset-0 bg-gradient-to-b from-[#020818] via-[#050510] to-[#030618]" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(0, 229, 255, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(124, 58, 237, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(0, 100, 255, 0.03) 0%, transparent 40%)",
        }}
      />

      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.4) 100%)"
      }} />

      {[...Array(8)].map((_, i) => (
        <Particle key={`p-${i}`} delay={i * 0.8} side={i % 2 === 0 ? "left" : "right"} />
      ))}
      {[...Array(4)].map((_, i) => (
        <LightRay key={`ray-${i}`} delay={i * 1.5} side={i % 2 === 0 ? "left" : "right"} />
      ))}
    </div>
  );
}