"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

/* ── Countdown Timer ───────────────────────────────────────────── */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-06-11T00:00:00");
    const update = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const Unit = ({ value, label }) => (
    <div className="countdown-unit">
      <div className="countdown-value">
        {String(value).padStart(2, "0")}
      </div>
      <span className="countdown-label">{label}</span>
    </div>
  );

  return (
    <div className="countdown-row">
      <Unit value={timeLeft.days} label="Days" />
      <span className="countdown-sep">:</span>
      <Unit value={timeLeft.hours} label="Hrs" />
      <span className="countdown-sep">:</span>
      <Unit value={timeLeft.minutes} label="Min" />
      <span className="countdown-sep">:</span>
      <Unit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

/* ── Particles ─────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 1,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.3 + 0.1,
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

/* ── Feature Cards ─────────────────────────────────────────────── */
import { BarChart3, Swords, Brain, LineChart } from "lucide-react";

const features = [
  {
    href: "/groups",
    icon: BarChart3,
    title: "Group Stage",
    desc: "12 groups, 48 teams. Watch the round-robin unfold.",
    color: "#00ff87",
  },
  {
    href: "/knockout",
    icon: Swords,
    title: "Knockout Bracket",
    desc: "From R32 to the Final. One loss and you're out.",
    color: "#00e5ff",
  },
  {
    href: "/predict",
    icon: Brain,
    title: "Predict Match",
    desc: "Pick any two teams and simulate the outcome.",
    color: "#ffd700",
  },
  {
    href: "/stats",
    icon: LineChart,
    title: "Monte Carlo",
    desc: "Run 1000+ simulations. Find the true favorite.",
    color: "#7c3aed",
  },
];

/* ── Text reveal animation variants ────────────────────────────── */
const titleVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  return (
    <div className="animated-bg min-h-screen relative overflow-hidden">
      <Particles />
      <Navbar />

      {/* ═══ Hero Section ═══ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
        {/* Soft radial gold glow */}
        <div className="hero-glow" />

        {/* Floating Trophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="relative mb-8"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl"
              style={{ background: "rgba(255,215,0,0.08)" }} />
            <motion.div
              animate={{
                y: [0, -12, 0],
                filter: [
                  "drop-shadow(0 0 30px rgba(255,215,0,0.35))",
                  "drop-shadow(0 0 50px rgba(255,215,0,0.55))",
                  "drop-shadow(0 0 30px rgba(255,215,0,0.35))",
                ],
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                filter: { duration: 3, repeat: Infinity },
              }}
            >
              <img
                src="/trophy.png"
                alt="World Cup Trophy"
                className="w-40 h-40 sm:w-52 sm:h-52 object-contain relative z-10"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Title — text reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <motion.h1
            className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-wider"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {"FIFA ".split("").map((ch, i) => (
              <motion.span key={i} variants={letterVariants} className="text-white inline-block">
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
            {"WORLD CUP".split("").map((ch, i) => (
              <motion.span key={`g-${i}`} variants={letterVariants} className="inline-block gradient-text-gold">
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-gray-500 text-base sm:text-lg mt-3 tracking-wide"
          >
            11 June – 19 July 2026
          </motion.p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center items-center gap-4 mt-10 flex-wrap"
        >
          <Link href="/knockout">
            <motion.div
              className="btn-primary min-w-[240px] text-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              SIMULATE TOURNAMENT
            </motion.div>
          </Link>
          <Link href="/predict">
            <motion.div
              className="btn-secondary min-w-[240px] text-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              PREDICT MATCH
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Section separator */}
      <div className="section-sep max-w-5xl mx-auto" />

      {/* ═══ Features Section ═══ */}
      <section className="relative z-10 py-16 px-4 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl font-bold text-center mb-12 tracking-wider"
        >
          <span className="text-white">TOURNAMENT </span>
          <span className="gradient-text-teal">FEATURES</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={f.href}>
                  <div className="h-full cursor-pointer group bg-gradient-to-b from-[#0a0f1f] to-[#050a18] border border-white/10 rounded-2xl p-6 transition-all duration-300 ease-out hover:translate-y-[-6px] hover:shadow-[0_0_30px_rgba(0,255,150,0.15)] hover:border-emerald-400/30">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 mb-4">
                      <Icon size={24} style={{ color: f.color }} />
                    </div>
                    <h3 className="font-heading text-lg font-semibold tracking-wide group-hover:translate-x-1 transition-transform duration-300" style={{ color: f.color }}>
                      {f.title}
                    </h3>
                    <p className="text-sm text-white/60 mt-2 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <p 
          style={{
            fontSize: '14px',
            letterSpacing: '1px',
            opacity: 0.75,
            color: '#e5e7eb',
            textAlign: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.textShadow = '0 0 12px rgba(0,229,255,0.5), 0 0 20px rgba(0,255,135,0.3)';
            e.target.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.target.style.textShadow = 'none';
            e.target.style.opacity = '0.75';
          }}
        >
          8 Teams. 1 Trophy. Infinite Possibilities ⚽✨
        </p>
      </footer>
    </div>
  );
}
