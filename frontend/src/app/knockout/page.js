"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import KnockoutBracket from "@/components/KnockoutBracket";
import confetti from "canvas-confetti";
import { simulateTournament } from "@/lib/api";

export default function KnockoutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);

  function startFireworks() {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#ffd700', '#00ff87', '#00e5ff'] });
  }

  async function handleSimulate() {
    setShowWinner(false);
    setLoading(true);
    
    try {
      const result = await simulateTournament();
      setData(result);
      
      const knockout = result.knockout;
      const finalMatch = knockout?.rounds?.["Final"]?.[0];
      
      if (finalMatch) {
        const team1Score = finalMatch.score1 || 0;
        const team2Score = finalMatch.score2 || 0;
        
        const win = team1Score > team2Score ? finalMatch.team1 : finalMatch.team2;
        
        console.log("Winner:", win);
        console.log("Final score:", team1Score, "-", team2Score);
        
        setWinner(win);
        setShowWinner(true);
        startFireworks();
      }
    } catch (err) {
      console.error("Tournament simulation error:", err);
    }
    
    setLoading(false);
  }

  return (
    <div className="animated-bg min-h-screen relative">
      <Navbar />

      {/* Header + Simulate */}
      <div
        style={{
          textAlign: "center",
          paddingTop: "88px",
          paddingBottom: "24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-heading text-4xl sm:text-5xl font-bold tracking-wider mb-3"
        >
          <span style={{ color: "white" }}>KNOCKOUT </span>
          <span className="gradient-text-gold">BRACKET</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            maxWidth: "500px",
            margin: "0 auto 20px",
          }}
        >
          Simulate the entire tournament — group stage through to the final.
          48 teams enter, only one lifts the trophy.
        </motion.p>

        <motion.button
          onClick={handleSimulate}
          disabled={loading}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="spinner"
                style={{
                  width: "16px",
                  height: "16px",
                  borderWidth: "2px",
                  borderColor: "rgba(0,0,0,0.15)",
                  borderTopColor: "#000",
                }}
              />
              SIMULATING...
            </span>
          ) : data ? (
            "🔄 SIMULATE AGAIN"
          ) : (
            "🏆 SIMULATE FULL TOURNAMENT"
          )}
        </motion.button>
      </div>

      {/* Bracket Display */}
      {data && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ position: "relative", zIndex: 10 }}
        >
          <KnockoutBracket 
            knockoutData={data.knockout} 
            winner={showWinner ? winner : null}
          />
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 0",
            gap: "12px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="spinner" style={{ width: "40px", height: "40px" }} />
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "13px",
              letterSpacing: "0.05em",
            }}
          >
            Running group stage and knockout bracket...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!data && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: "center",
            padding: "40px 0",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.3 }}>
            ⚽
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
            Click the button above to simulate the full tournament bracket.
          </p>
        </motion.div>
      )}
    </div>
  );
}