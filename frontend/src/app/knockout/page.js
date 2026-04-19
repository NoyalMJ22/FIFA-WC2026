"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import KnockoutBracket from "@/components/KnockoutBracket";
import { simulateTournament } from "@/lib/api";

export default function KnockoutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSimulate() {
    setLoading(true);
    try {
      const result = await simulateTournament();
      setData(result);
    } catch (err) {
      console.error("Tournament simulation error:", err);
    }
    setLoading(false);
  }

  const champion = data?.knockout?.champion;

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wider mb-3">
            <span className="text-white">KNOCKOUT </span>
            <span className="gradient-text-gold">BRACKET</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Simulate the entire tournament — group stage through to the final.
            32 teams enter, only one lifts the trophy.
          </p>
        </motion.div>

        {/* Simulate Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-heading font-semibold text-sm tracking-wider bg-gradient-to-r from-fifa-green to-emerald-400 text-black hover:shadow-[0_0_30px_rgba(0,255,135,0.4)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner !w-4 !h-4 !border-2 !border-black/20 !border-t-black" />
                SIMULATING TOURNAMENT...
              </span>
            ) : data ? (
              "🔄 SIMULATE AGAIN"
            ) : (
              "🏆 SIMULATE FULL TOURNAMENT"
            )}
          </button>
        </motion.div>

        {/* Loading Animation */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="spinner !w-12 !h-12" />
            <p className="text-gray-500 text-sm animate-pulse">
              Running group stage and knockout bracket...
            </p>
          </div>
        )}

        {/* Bracket Display */}
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <KnockoutBracket knockoutData={data.knockout} />
          </motion.div>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4 opacity-30">⚽</div>
            <p className="text-gray-600 text-sm">
              Click the button above to simulate the full tournament bracket.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
