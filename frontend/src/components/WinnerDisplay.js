"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getTeamFlag } from "@/lib/teamFlags";

export default function WinnerDisplay({ winner, onFireworksComplete }) {
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!winner) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#facc15", "#22d3ee", "#22c55e", "#ffd700"];

    function burst(x, y) {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x,
          y,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 5,
          radius: 2,
          life: 60,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    intervalRef.current = setInterval(() => {
      burst(
        window.innerWidth / 2 + (Math.random() * 200 - 100),
        window.innerHeight / 2 - 100
      );
    }, 1200);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 60;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    const cleanup = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (onFireworksComplete) onFireworksComplete();
    }, 6000);

    return () => {
      clearTimeout(cleanup);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [winner, onFireworksComplete]);

  if (!winner) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        id="fireworks-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <motion.div
        className="winner-wrapper"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          marginTop: "25px",
          zIndex: 2,
        }}
      >
        <div
          className="winner-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 28px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(250,204,21,0.6)",
            boxShadow: "0 0 30px rgba(250,204,21,0.5)",
          }}
        >
          <img
            src={getTeamFlag(winner)}
            alt={winner}
            className="winner-flag"
            style={{
              width: "30px",
              height: "20px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ffffff",
                margin: 0,
              }}
            >
              {winner}
            </h2>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "2px",
                color: "#facc15",
                margin: 0,
                marginTop: "2px",
              }}
            >
              WORLD CHAMPIONS
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}