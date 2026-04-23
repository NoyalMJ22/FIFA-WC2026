"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { getTeamFlag, getShortTeamName } from "@/lib/teamFlags";

function MatchCard({ match, side, isFinal }) {
  if (!match) return null;
  
  const w1 = match.winner === match.team1;
  const w2 = match.winner === match.team2;
  const hasTeam1 = match.team1?.trim();
  const hasTeam2 = match.team2?.trim();

  if (!hasTeam1 && !hasTeam2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative z-10 w-[150px] h-[50px] px-2.5 py-1.5 rounded-xl backdrop-blur-md flex flex-col justify-center transition-all duration-300 ${
        isFinal
          ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border-2 border-yellow-400/50 shadow-[0_0_20px_rgba(255,215,0,0.6)] scale-105"
          : "bg-white/[0.05] border border-white/[0.15] hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,255,200,0.3)]"
      }`}
      style={{ position: 'relative' }}
    >
      {hasTeam1 && (
        <motion.div 
          className={`flex items-center justify-between text-xs h-[18px] rounded px-1 ${w1 ? "bg-gradient-to-r from-green-500/30 to-transparent" : ""}`}
          animate={w1 ? { boxShadow: ["0 0 0 rgba(0,255,150,0)", "0 0 8px rgba(0,255,150,0.5)", "0 0 0 rgba(0,255,150,0)"] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex items-center gap-1">
            <img src={getTeamFlag(match.team1)} alt={match.team1} className="w-4 h-2.5 object-cover rounded-sm" />
            <span className={w1 ? "text-green-400 font-semibold" : "text-white/80"}>{getShortTeamName(match.team1)}</span>
          </div>
          <span className={w1 ? "text-green-400 font-bold" : "text-white/50"}>{match.score1 ?? "-"}</span>
        </motion.div>
      )}
      {hasTeam1 && hasTeam2 && <div className="h-px bg-white/20 my-0.5" />}
      {hasTeam2 && (
        <motion.div 
          className={`flex items-center justify-between text-xs h-[18px] rounded px-1 ${w2 ? "bg-gradient-to-r from-green-500/30 to-transparent" : ""}`}
          animate={w2 ? { boxShadow: ["0 0 0 rgba(0,255,150,0)", "0 0 8px rgba(0,255,150,0.5)", "0 0 0 rgba(0,255,150,0)"] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex items-center gap-1">
            <img src={getTeamFlag(match.team2)} alt={match.team2} className="w-4 h-2.5 object-cover rounded-sm" />
            <span className={w2 ? "text-green-400 font-semibold" : "text-white/80"}>{getShortTeamName(match.team2)}</span>
          </div>
          <span className={w2 ? "text-green-400 font-bold" : "text-white/50"}>{match.score2 ?? "-"}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

const ROUND_GAPS = {
  8: 12,
  4: 20,
  2: 32,
  1: 40,
};

function RoundColumn({ matches, label, matchCount }) {
  const defaultMatches = matches || [];
  const needsMore = matchCount - defaultMatches.length;
  const placeholderMatches = needsMore > 0 ? Array(needsMore).fill(null) : [];
  const gap = ROUND_GAPS[matchCount] || 12;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: '100%',
      }}
    >
      <div className="text-[10px] font-semibold text-white/50 tracking-widest uppercase mb-2">{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, alignItems: 'center' }}>
        {[...defaultMatches, ...placeholderMatches].map((match, idx) => (
          <MatchCard key={match?.match_id || `placeholder-${idx}`} match={match} side="center" />
        ))}
      </div>
    </div>
  );
}

function HorizontalConnector() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '30px', height: '100%' }}>
      <div style={{ height: '2px', width: '100%', background: 'rgba(0,255,255,0.6)', boxShadow: '0 0 6px rgba(0,255,255,0.5)' }} />
    </div>
  );
}

function FireworksCanvas({ active }) {
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
      for (let i = 0; i < 50; i++) {
        particles.push({
          x,
          y,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 4 + 1,
          life: 60,
        });
      }
    }

    const intervalId = setInterval(() => {
      burst(
        window.innerWidth / 2 + (Math.random() * 200 - 100),
        window.innerHeight / 2 - 120
      );
    }, 1200);

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

        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(p.x, p.y, 2, 2);
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (animationId) cancelAnimationFrame(animationId);
    }, 6000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      id="fireworks"
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

export default function KnockoutBracket({ knockoutData, winner: externalWinner }) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeRound, setActiveRound] = useState("Final");
  const [showFireworks, setShowFireworks] = useState(false);
  const prevWinnerRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1200);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const winner = externalWinner;
  const showWinner = !!winner;

  useEffect(() => {
    if (winner && winner !== prevWinnerRef.current) {
      prevWinnerRef.current = winner;
      setShowFireworks(true);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#ffd700', '#00ff87', '#00e5ff'] });
      
      setTimeout(() => setShowFireworks(false), 6000);
    }
  }, [winner]);

  const rounds = knockoutData?.rounds || {};
  const finalMatch = rounds["Final"]?.[0];

  if (isMobile) {
    return (
      <div className="p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {["Final", "Semifinals", "Quarterfinals", "Round of 16", "Round of 32"].map((name) => (
            <button key={name} onClick={() => setActiveRound(name)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeRound === name ? "bg-cyan-500/20 text-cyan-400" : "bg-white/[0.05] text-white/40"}`}>
              {name}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs font-semibold text-yellow-400/60">Final</div>
          {finalMatch && <MatchCard match={finalMatch} side="center" isFinal />}
          {winner && (
            <motion.div 
              initial={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '18px',
                textAlign: 'center',
              }}
            >
              <img 
                src={getTeamFlag(winner)} 
                alt={winner}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  width: '48px',
                  height: '32px',
                  borderRadius: '4px',
                  boxShadow: '0 0 12px rgba(255,255,255,0.25)',
                }}
              />
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#ffffff', 
                margin: 0,
                textAlign: 'center',
                textShadow: '0 0 8px rgba(255,255,255,0.3)',
              }}>
                {winner}
              </h2>
              <p style={{ 
                fontSize: '11px', 
                letterSpacing: '2px', 
                color: '#facc15', 
                margin: 0,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
                WORLD CHAMPIONS
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <FireworksCanvas active={showFireworks} />
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '32px 40px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
          <RoundColumn matches={rounds["Round of 32"]?.slice(0, 8) || []} label="R32" matchCount={8} />
          <RoundColumn matches={rounds["Round of 16"]?.slice(0, 4) || []} label="R16" matchCount={4} />
          <RoundColumn matches={rounds["Quarterfinals"]?.slice(0, 2) || []} label="QF" matchCount={2} />
          <RoundColumn matches={rounds["Semifinals"]?.slice(0, 1) || []} label="SF" matchCount={1} />
        </div>

        <HorizontalConnector />

        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <motion.img 
            src="/trophy.png" 
            alt="Trophy" 
            className="trophy w-14"
            style={{ 
              filter: 'drop-shadow(0 0 25px rgba(250, 204, 21, 0.6))',
              animation: 'float 2s ease-in-out infinite',
            }} 
            animate={{ y: [0, -6, 0] }} 
            transition={{ duration: 2, repeat: Infinity }}
          />
          {finalMatch && <MatchCard match={finalMatch} side="center" isFinal />}
          
          {winner && (
            <motion.div 
              initial={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '18px',
                textAlign: 'center',
              }}
            >
              <img 
                src={getTeamFlag(winner)} 
                alt={winner}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  width: '48px',
                  height: '32px',
                  borderRadius: '4px',
                  boxShadow: '0 0 12px rgba(255,255,255,0.25)',
                }}
              />
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#ffffff', 
                margin: 0,
                textAlign: 'center',
                textShadow: '0 0 8px rgba(255,255,255,0.3)',
              }}>
                {winner}
              </h2>
              <p style={{ 
                fontSize: '11px', 
                letterSpacing: '2px', 
                color: '#facc15', 
                margin: 0,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
                WORLD CHAMPIONS
              </p>
            </motion.div>
          )}
        </div>

        <HorizontalConnector />

        <div style={{ display: 'flex', gap: '80px', alignItems: 'center' }}>
          <RoundColumn matches={rounds["Semifinals"]?.slice(1, 2) || []} label="SF" matchCount={1} />
          <RoundColumn matches={rounds["Quarterfinals"]?.slice(2, 4) || []} label="QF" matchCount={2} />
          <RoundColumn matches={rounds["Round of 16"]?.slice(4, 8) || []} label="R16" matchCount={4} />
          <RoundColumn matches={rounds["Round of 32"]?.slice(8, 16) || []} label="R32" matchCount={8} />
        </div>
      </div>
    </>
  );
}