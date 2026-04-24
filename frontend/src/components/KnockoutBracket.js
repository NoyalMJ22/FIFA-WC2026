"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import PremiumMatchCard from "./PremiumMatchCard";
import TrophySection from "./TrophySection";
import { getTeamFlag } from "@/lib/teamFlags";

function RoundConnector({ matchCount }) {
  const heights = { 8: "40px", 4: "80px", 2: "160px", 1: "320px" };
  const height = heights[matchCount] || "40px";

  return (
    <div className="flex flex-col items-center justify-center h-full px-1 sm:px-2" style={{ minHeight: height }}>
      <div className="w-0.5 h-full bg-gradient-to-b from-cyan-400/60 via-cyan-400/30 to-cyan-400/60 shadow-[0_0_8px_rgba(0,255,200,0.4)]" />
    </div>
  );
}

function RoundColumn({ matches, label, matchCount, isLeft }) {
  const gapMap = { 8: "gap-2 sm:gap-3", 4: "gap-4 sm:gap-6", 2: "gap-8 sm:gap-12", 1: "gap-12 sm:gap-16" };
  const gap = gapMap[matchCount] || "gap-3";

  return (
    <div className="flex flex-col items-center">
      <div
        className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-white/50 tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3 text-center"
        style={{ fontFamily: "'Oswald', sans-serif" }}
      >
        {label}
      </div>
      <div className={`flex flex-col ${gap} items-center justify-center h-full`}>
        {[...Array(matchCount)].map((_, idx) => {
          const match = matches[idx];
          const isSemi = matchCount === 2 && label.toLowerCase().includes("semi");
          return (
            <div key={match?.match_id || `empty-${idx}`} className="w-full flex justify-center">
              <PremiumMatchCard
                match={match}
                side={isLeft ? "left" : "right"}
                isSemi={isSemi}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConnectorLine() {
  return (
    <div className="flex items-center justify-center px-1 sm:px-2 lg:px-3">
      <div className="w-0.5 h-full bg-gradient-to-b from-cyan-400/70 via-cyan-400/40 to-cyan-400/70 shadow-[0_0_10px_rgba(0,255,200,0.5)]" />
    </div>
  );
}

function Fireworks({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#facc15", "#22d3ee", "#22c55e", "#ffd700"];

    function burst(x, y) {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x,
          y,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 4 + 1,
          life: 50,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    const intervalId = setInterval(() => {
      burst(
        window.innerWidth / 2 + (Math.random() * 300 - 150),
        window.innerHeight / 3
      );
    }, 800);

    let animationId;
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
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 50;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (animationId) cancelAnimationFrame(animationId);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
}

function MobileView({ rounds, winner }) {
  const [activeRound, setActiveRound] = useState("Final");

  const roundTabs = useMemo(() => [
    { key: "Final", label: "Final" },
    { key: "Semifinals", label: "Semi" },
    { key: "Quarterfinals", label: "QF" },
    { key: "Round of 16", label: "R16" },
    { key: "Round of 32", label: "R32" },
  ], []);

  const currentMatches = rounds[activeRound] || [];

  return (
    <div className="w-full px-3 sm:px-4 pb-4">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
        {roundTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveRound(tab.key)}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-300 ${
              activeRound === tab.key
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,255,200,0.2)]"
                : "bg-white/[0.04] text-white/40 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white/60"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRound}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            {activeRound === "Final" && (
              <TrophySection winner={winner} finalMatch={currentMatches[0]} />
            )}

            {currentMatches.length > 0 && activeRound !== "Final" && (
              <div className="w-full max-w-[340px] flex flex-col gap-2 sm:gap-3">
                {currentMatches.map((match, idx) => (
                  <PremiumMatchCard
                    key={match?.match_id || idx}
                    match={match}
                    isFinal={activeRound === "Final"}
                    side="center"
                  />
                ))}
              </div>
            )}

            {!currentMatches.length && activeRound !== "Final" && (
              <div className="text-center py-8">
                <p className="text-white/25 text-xs">No matches in this round</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function KnockoutBracket({ knockoutData, winner: externalWinner }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const prevWinnerRef = useRef(null);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1280);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const winner = externalWinner;
  const rounds = knockoutData?.rounds || {};
  const finalMatch = rounds["Final"]?.[0];

  useEffect(() => {
    if (winner && winner !== prevWinnerRef.current) {
      prevWinnerRef.current = winner;
      setShowFireworks(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#ffd700", "#00ff87", "#00e5ff"],
      });

      setTimeout(() => setShowFireworks(false), 5000);
    }
  }, [winner]);

  if (isMobile) {
    return (
      <>
        <Fireworks active={showFireworks} />
        <MobileView rounds={rounds} winner={winner} />
      </>
    );
  }

  if (isTablet) {
    return (
      <>
        <Fireworks active={showFireworks} />
        <div className="w-full overflow-x-auto px-4 pb-6">
          <div className="min-w-max flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 py-4">
            <RoundColumn
              matches={rounds["Round of 32"]?.slice(0, 8) || []}
              label="Round of 32"
              matchCount={8}
              isLeft
            />
            <RoundConnector matchCount={8} />
            <RoundColumn
              matches={rounds["Round of 16"]?.slice(0, 4) || []}
              label="Round of 16"
              matchCount={4}
              isLeft
            />
            <RoundConnector matchCount={4} />
            <RoundColumn
              matches={rounds["Quarterfinals"]?.slice(0, 2) || []}
              label="Quarterfinals"
              matchCount={2}
              isLeft
            />
            <RoundConnector matchCount={2} />
            <RoundColumn
              matches={rounds["Semifinals"]?.slice(0, 1) || []}
              label="Semifinals"
              matchCount={1}
              isLeft
            />
            <ConnectorLine />
            <div className="py-4">
              <TrophySection winner={winner} finalMatch={finalMatch} />
            </div>
            <ConnectorLine />
            <RoundColumn
              matches={rounds["Semifinals"]?.slice(1, 2) || []}
              label="Semifinals"
              matchCount={1}
              isLeft={false}
            />
            <RoundConnector matchCount={2} />
            <RoundColumn
              matches={rounds["Quarterfinals"]?.slice(2, 4) || []}
              label="Quarterfinals"
              matchCount={2}
              isLeft={false}
            />
            <RoundConnector matchCount={4} />
            <RoundColumn
              matches={rounds["Round of 16"]?.slice(4, 8) || []}
              label="Round of 16"
              matchCount={4}
              isLeft={false}
            />
            <RoundConnector matchCount={8} />
            <RoundColumn
              matches={rounds["Round of 32"]?.slice(8, 16) || []}
              label="Round of 32"
              matchCount={8}
              isLeft={false}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Fireworks active={showFireworks} />
      <div className="w-full px-4 lg:px-8 pb-8 overflow-x-auto">
        <div className="min-w-max flex items-center justify-center gap-3 lg:gap-6 py-4 lg:py-6">
          <RoundColumn
            matches={rounds["Round of 32"]?.slice(0, 8) || []}
            label="Round of 32"
            matchCount={8}
            isLeft
          />
          <RoundConnector matchCount={8} />
          <RoundColumn
            matches={rounds["Round of 16"]?.slice(0, 4) || []}
            label="Round of 16"
            matchCount={4}
            isLeft
          />
          <RoundConnector matchCount={4} />
          <RoundColumn
            matches={rounds["Quarterfinals"]?.slice(0, 2) || []}
            label="Quarterfinals"
            matchCount={2}
            isLeft
          />
          <RoundConnector matchCount={2} />
          <RoundColumn
            matches={rounds["Semifinals"]?.slice(0, 1) || []}
            label="Semifinals"
            matchCount={1}
            isLeft
          />
          <ConnectorLine />
          <div className="py-4">
            <TrophySection winner={winner} finalMatch={finalMatch} />
          </div>
          <ConnectorLine />
          <RoundColumn
            matches={rounds["Semifinals"]?.slice(1, 2) || []}
            label="Semifinals"
            matchCount={1}
            isLeft={false}
          />
          <RoundConnector matchCount={2} />
          <RoundColumn
            matches={rounds["Quarterfinals"]?.slice(2, 4) || []}
            label="Quarterfinals"
            matchCount={2}
            isLeft={false}
          />
          <RoundConnector matchCount={4} />
          <RoundColumn
            matches={rounds["Round of 16"]?.slice(4, 8) || []}
            label="Round of 16"
            matchCount={4}
            isLeft={false}
          />
          <RoundConnector matchCount={8} />
          <RoundColumn
            matches={rounds["Round of 32"]?.slice(8, 16) || []}
            label="Round of 32"
            matchCount={8}
            isLeft={false}
          />
        </div>
      </div>
    </>
  );
}