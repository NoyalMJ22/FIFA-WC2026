"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import KnockoutBracket from "@/components/KnockoutBracket";
import confetti from "canvas-confetti";
import { simulateTournament } from "@/lib/api";

function triggerFireworks() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ffd700", "#00ff87", "#00e5ff"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ffd700", "#00ff87", "#00e5ff"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: ["#ffd700", "#00ff87", "#00e5ff"],
    ticks: 150,
  });
}

export default function KnockoutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function handleSimulate() {
    setShowWinner(false);
    setWinner(null);
    setLoading(true);

    try {
      const result = await simulateTournament();
      setData(result);
      const knockout = result.knockout;

      if (knockout?.champion) {
        setWinner(knockout.champion);
        setShowWinner(true);
        triggerFireworks();
      }
    } catch (err) {
      console.error("Tournament simulation error:", err);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 pt-20 sm:pt-24"
      >
        <div className="sticky top-16 sm:top-16 z-20 bg-gradient-to-b from-[#030618]/95 via-[#030618]/90 to-transparent pb-4 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-3 sm:mb-4"
            >
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider mb-2 sm:mb-3">
                <span className="text-white">KNOCKOUT </span>
                <span className="gradient-text-gold">BRACKET</span>
              </h1>
              <p className="text-white/35 text-[11px] sm:text-xs lg:text-sm max-w-md mx-auto leading-relaxed">
                Simulate the entire tournament — 48 teams enter, only one lifts the trophy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={handleSimulate}
                disabled={loading}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-heading font-semibold text-[12px] sm:text-sm tracking-[0.15em] border-none cursor-pointer bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 text-black shadow-[0_0_30px_rgba(0,255,135,0.35),0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(0,255,135,0.5),0_6px_20px_rgba(0,0,0,0.4)] min-w-[180px] sm:min-w-[220px]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>SIMULATING...</span>
                    </>
                  ) : data ? (
                    <>
                      <span>🔄</span>
                      <span>SIMULATE AGAIN</span>
                    </>
                  ) : (
                    <>
                      <span>🏆</span>
                      <span>SIMULATE TOURNAMENT</span>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-[3px] border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-white/25 text-[11px] sm:text-xs tracking-[0.1em] uppercase font-medium">
                Running group stage and knockout bracket...
              </p>
            </motion.div>
          ) : data ? (
            <motion.div
              key="bracket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <KnockoutBracket knockoutData={data.knockout} winner={showWinner ? winner : null} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4"
            >
              <div className="text-5xl sm:text-6xl opacity-15">⚽</div>
              <p className="text-white/20 text-[11px] sm:text-xs tracking-[0.08em] uppercase font-medium text-center max-w-xs">
                Click the button above to simulate the full tournament bracket
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}