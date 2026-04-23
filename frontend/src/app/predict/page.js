"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { fetchTeams, predictMatch } from "@/lib/api";
import { getTeamFlag } from "@/lib/teamFlags";

export default function PredictPage() {
  const [teamsList, setTeamsList] = useState([]);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [allowDraw, setAllowDraw] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams().then((data) => {
      const names = (data.teams || []).map((t) => t.name).sort();
      setTeamsList(names);
      if (names.length >= 2) {
        setTeam1(names[0]);
        setTeam2(names[1]);
      }
    });
  }, []);

  async function handlePredict() {
    if (!team1 || !team2 || team1 === team2) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await predictMatch(team1, team2, allowDraw);
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
    }
    setLoading(false);
  }

  const isT1W = result?.winner === team1;
  const isT2W = result?.winner === team2;
  const isDraw = result?.winner === "Draw";

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wider mb-3">
            <span className="text-white">PREDICT </span>
            <span className="gradient-text-gold">MATCH</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Select any two teams and let the probability engine decide who wins.
          </p>
        </motion.div>

        {/* Team Selection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 sm:p-8 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 items-end">
            {/* Team 1 */}
            <div>
              <label className="block text-[10px] text-gray-500 mb-2 font-semibold tracking-wider uppercase">
                Team 1
              </label>
              <div className="flex items-center gap-3">
                {team1 && (
                  <img
                    src={getTeamFlag(team1)}
                    alt={team1}
                    className="w-10 h-7 rounded object-cover shadow"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <select
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  className="predict-select"
                >
                  {teamsList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <span className="font-heading text-2xl font-bold text-gray-700">VS</span>
            </div>

            {/* Team 2 */}
            <div>
              <label className="block text-[10px] text-gray-500 mb-2 font-semibold tracking-wider uppercase">
                Team 2
              </label>
              <div className="flex items-center gap-3">
                {team2 && (
                  <img
                    src={getTeamFlag(team2)}
                    alt={team2}
                    className="w-10 h-7 rounded object-cover shadow"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <select
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  className="predict-select"
                >
                  {teamsList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allowDraw}
                onChange={(e) => setAllowDraw(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-transparent accent-[#00e5ff]"
              />
              Allow draw (group stage rules)
            </label>

            <motion.button
              onClick={handlePredict}
              disabled={loading || team1 === team2}
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: "rgba(0,0,0,0.15)", borderTopColor: "#000" }} />
                  PREDICTING...
                </span>
              ) : (
                "⚡ PREDICT"
              )}
            </motion.button>
          </div>

          {team1 === team2 && team1 && (
            <p className="text-red-400 text-xs mt-3">
              ⚠ Please select two different teams.
            </p>
          )}
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.winner}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="glass-card p-6 sm:p-8 text-center"
              style={{
                borderTop: `3px solid ${
                  isDraw ? "#ffd700" : isT1W ? "#00ff87" : "#00e5ff"
                }`,
              }}
            >
              {/* Winner Display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                className="mb-6"
              >
                {isDraw ? (
                  <div>
                    <span className="text-5xl">🤝</span>
                    <h3 className="font-heading text-2xl font-bold mt-3 gradient-text-gold">
                      IT&apos;S A DRAW!
                    </h3>
                  </div>
                ) : (
                  <div>
                    <img
                      src={getTeamFlag(result.winner, 80)}
                      alt={result.winner}
                      className="w-20 h-14 mx-auto rounded-lg shadow-lg mb-3"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <h3 className="font-heading text-3xl font-bold gradient-text-green">
                      {result.winner} WINS!
                    </h3>
                  </div>
                )}
              </motion.div>

              {/* Probability Bars */}
              <div className="max-w-md mx-auto space-y-4">
                {/* Team 1 Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isT1W ? "text-[#00ff87] font-semibold" : "text-gray-400"}>
                      {team1}
                    </span>
                    <span className={isT1W ? "text-[#00ff87]" : "text-gray-500"}>
                      {result.probabilities?.[team1]}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probabilities?.[team1] || 0}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{
                        background: isT1W
                          ? "linear-gradient(90deg, #00ff87, #00cc6a)"
                          : "rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                </div>

                {/* Team 2 Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isT2W ? "text-[#00e5ff] font-semibold" : "text-gray-400"}>
                      {team2}
                    </span>
                    <span className={isT2W ? "text-[#00e5ff]" : "text-gray-500"}>
                      {result.probabilities?.[team2]}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probabilities?.[team2] || 0}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full rounded-full"
                      style={{
                        background: isT2W
                          ? "linear-gradient(90deg, #00e5ff, #0088ff)"
                          : "rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                </div>

                {/* Draw Bar */}
                {allowDraw && result.probabilities?.Draw !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={isDraw ? "text-[#ffd700] font-semibold" : "text-gray-400"}>
                        Draw
                      </span>
                      <span className={isDraw ? "text-[#ffd700]" : "text-gray-500"}>
                        {result.probabilities?.Draw}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probabilities?.Draw || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{
                          background: isDraw
                            ? "linear-gradient(90deg, #ffd700, #ffaa00)"
                            : "rgba(255,255,255,0.08)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
