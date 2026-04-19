"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-06-11T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-fifa-card/80 border border-fifa-green/20 rounded-lg px-4 py-3 min-w-[60px]">
        <span className="text-fifa-green font-heading text-2xl sm:text-3xl font-bold drop-shadow-[0_0_10px_rgba(0,255,135,0.5)]">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-fifa-green text-xl font-bold mt-[-20px]">:</span>
      <TimeUnit value={timeLeft.hours} label="Hrs" />
      <span className="text-fifa-green text-xl font-bold mt-[-20px]">:</span>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <span className="text-fifa-green text-xl font-bold mt-[-20px]">:</span>
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

/* Animated floating particles */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

const features = [
  {
    href: "/groups",
    icon: "📊",
    title: "Group Stage",
    desc: "12 groups, 48 teams. Watch the round-robin unfold.",
    color: "#00ff87",
  },
  {
    href: "/knockout",
    icon: "⚔️",
    title: "Knockout Bracket",
    desc: "From R32 to the Final. One loss and you're out.",
    color: "#7c3aed",
  },
  {
    href: "/predict",
    icon: "🔮",
    title: "Predict Match",
    desc: "Pick any two teams and simulate the outcome.",
    color: "#f97316",
  },
  {
    href: "/stats",
    icon: "📈",
    title: "Monte Carlo",
    desc: "Run 1000+ simulations. Find the true favorite.",
    color: "#06b6d4",
  },
];

export default function HomePage() {
  return (
<div className="animated-bg min-h-screen relative overflow-hidden">
  <Particles />
  <Navbar />

  {/* Hero Section */}
  <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
    {/* Glow backdrop */}
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15 blur-[150px] pointer-events-none"
      style={{ background: "radial-gradient(circle, #ffd700 0%, transparent 70%)" }}
    />

    {/* Trophy with glow effect */}
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, type: "spring", bounce: 0.4 }}
      className="relative mb-8"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-fifa-gold/10 rounded-full blur-3xl animate-pulse" />
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            filter: [
              "drop-shadow(0 0 40px rgba(255,215,0,0.4))",
              "drop-shadow(0 0 60px rgba(255,215,0,0.6))",
              "drop-shadow(0 0 40px rgba(255,215,0,0.4))"
            ]
          }}
          transition={{ 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 2, repeat: Infinity }
          }}
        >
          <img
            src="/trophy.png"
            alt="World Cup Trophy"
            className="w-40 h-40 sm:w-56 sm:h-56 object-contain relative z-10"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </motion.div>
      </div>
    </motion.div>

    {/* Title & Date */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-center"
    >
      <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-wider">
        <span className="text-white">FIFA </span>
        <span className="gradient-text-gold">WORLD CUP</span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-base sm:text-lg mt-3 tracking-wide"
      >
        11 June – 19 July 2026
      </motion.p>
    </motion.div>

    {/* Countdown Timer - centered below title */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex items-center gap-3 sm:gap-4 mt-8"
    >
      <CountdownTimer />
    </motion.div>

    {/* CTA Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md"
    >
      <Link
        href="/knockout"
        className="flex-1 px-8 py-4 rounded-xl font-heading font-semibold text-sm tracking-wider 
          bg-gradient-to-r from-fifa-green to-emerald-400 text-black 
          hover:shadow-[0_0_40px_rgba(0,255,135,0.5)] hover:scale-105 
          transition-all duration-300 text-center"
      >
        SIMULATE TOURNAMENT
      </Link>
      <Link
        href="/predict"
        className="flex-1 px-8 py-4 rounded-xl font-heading font-semibold text-sm tracking-wider 
          border-2 border-fifa-purple text-fifa-purple 
          hover:bg-fifa-purple/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105 
          transition-all duration-300 text-center"
      >
        PREDICT MATCH
      </Link>
    </motion.div>
  </section>

  {/* Features Section */}
  <section id="features" className="relative z-10 py-20 px-4 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl font-bold text-center mb-12 tracking-wider"
        >
          <span className="text-white">TOURNAMENT </span>
          <span className="gradient-text-green">FEATURES</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={f.href}>
                <div
                  className="glass-card p-6 h-full hover:scale-105 transition-all duration-300 cursor-pointer group"
                  style={{
                    borderTop: `2px solid ${f.color}30`,
                  }}
                >
                  <div
                    className="text-4xl mb-4 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: `${f.color}15` }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    className="font-heading text-lg font-semibold mb-2 tracking-wide group-hover:translate-x-1 transition-transform"
                    style={{ color: f.color }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-fifa-border/30 py-8 text-center text-gray-600 text-xs">
        <p>
          FIFA World Cup 2026 Simulator · Built with Next.js, FastAPI & ❤️
        </p>
      </footer>
    </div>
  );
}
