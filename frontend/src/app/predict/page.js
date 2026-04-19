"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { fetchTeams, predictMatch } from "@/lib/api";

const CODES = {
  Argentina: "ar", Brazil: "br", France: "fr", England: "gb-eng",
  Spain: "es", Germany: "de", Portugal: "pt", Netherlands: "nl",
  Italy: "it", Croatia: "hr", Uruguay: "uy", Morocco: "ma",
  USA: "us", Colombia: "co", Mexico: "mx", Switzerland: "ch",
  Senegal: "sn", Japan: "jp", Denmark: "dk", Iran: "ir",
  "South Korea": "kr", Australia: "au", Ukraine: "ua", Austria: "at",
  Sweden: "se", Serbia: "rs", Poland: "pl", Peru: "pe",
  Scotland: "gb-sct", Wales: "gb-wls", Ecuador: "ec", Cameroon: "cm",
  Hungary: "hu", Canada: "ca", Chile: "cl", Egypt: "eg",
  Nigeria: "ng", Mali: "ml", "Ivory Coast": "ci", Algeria: "dz",
  "Saudi Arabia": "sa", Qatar: "qa", Norway: "no",
  Czechia: "cz", Slovakia: "sk", Romania: "ro", Paraguay: "py",
  "Costa Rica": "cr", Tunisia: "tn", Ghana: "gh", Bolivia: "bo",
  "Curaçao": "cw", Haiti: "ht", "New Zealand": "nz",
  "Bosnia and Herzegovina": "ba", "Cabo Verde": "cv",
  "Congo DR": "cd", Uzbekistan: "uz", Jordan: "jo",
  Türkiye: "tr", "South Africa": "za", Iraq: "iq",
};

function getFlagUrl(name) {
  return `https://flagcdn.com/w80/${CODES[name] || "xx"}.png`;
}

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

      <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
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

        {/* Team Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 sm:p-8 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 items-end">
            {/* Team 1 */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium tracking-wider uppercase">
                Team 1
              </label>
              <div className="flex items-center gap-3">
                {team1 && (
                  <img
                    src={getFlagUrl(team1)}
                    alt={team1}
                    className="w-10 h-7 rounded object-cover shadow"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <select
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                  className="flex-1 bg-fifa-dark border border-fifa-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-fifa-green/50 transition-colors"
                >
                  {teamsList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <span className="font-heading text-2xl font-bold text-gray-600">VS</span>
            </div>

            {/* Team 2 */}
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium tracking-wider uppercase">
                Team 2
              </label>
              <div className="flex items-center gap-3">
                {team2 && (
                  <img
                    src={getFlagUrl(team2)}
                    alt={team2}
                    className="w-10 h-7 rounded object-cover shadow"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <select
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                  className="flex-1 bg-fifa-dark border border-fifa-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-fifa-purple/50 transition-colors"
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
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={allowDraw}
                onChange={(e) => setAllowDraw(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-fifa-dark text-fifa-green focus:ring-fifa-green/30"
              />
              Allow draw (group stage rules)
            </label>

            <button
              onClick={handlePredict}
              disabled={loading || team1 === team2}
              className="px-6 py-2.5 rounded-xl font-heading font-semibold text-sm tracking-wider bg-fifa-green text-black hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner !w-4 !h-4 !border-2 !border-black/20 !border-t-black" />
                  PREDICTING...
                </span>
              ) : (
                "⚡ PREDICT"
              )}
            </button>
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
                  isDraw ? "#ffd700" : isT1W ? "#00ff87" : "#7c3aed"
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
                    <h3 className="font-heading text-2xl font-bold text-fifa-gold mt-3">
                      IT&apos;S A DRAW!
                    </h3>
                  </div>
                ) : (
                  <div>
                    <img
                      src={getFlagUrl(result.winner)}
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
                    <span className={isT1W ? "text-fifa-green font-semibold" : "text-gray-400"}>
                      {team1}
                    </span>
                    <span className={isT1W ? "text-fifa-green" : "text-gray-500"}>
                      {result.probabilities?.[team1]}%
                    </span>
                  </div>
                  <div className="h-3 bg-fifa-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probabilities?.[team1] || 0}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full rounded-full ${
                        isT1W
                          ? "bg-gradient-to-r from-fifa-green to-emerald-400"
                          : "bg-gray-700"
                      }`}
                    />
                  </div>
                </div>

                {/* Team 2 Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isT2W ? "text-fifa-purple font-semibold" : "text-gray-400"}>
                      {team2}
                    </span>
                    <span className={isT2W ? "text-fifa-purple" : "text-gray-500"}>
                      {result.probabilities?.[team2]}%
                    </span>
                  </div>
                  <div className="h-3 bg-fifa-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.probabilities?.[team2] || 0}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className={`h-full rounded-full ${
                        isT2W
                          ? "bg-gradient-to-r from-fifa-purple to-violet-400"
                          : "bg-gray-700"
                      }`}
                    />
                  </div>
                </div>

                {/* Draw Bar */}
                {allowDraw && result.probabilities?.Draw !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={isDraw ? "text-fifa-gold font-semibold" : "text-gray-400"}>
                        Draw
                      </span>
                      <span className={isDraw ? "text-fifa-gold" : "text-gray-500"}>
                        {result.probabilities?.Draw}%
                      </span>
                    </div>
                    <div className="h-3 bg-fifa-dark rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probabilities?.Draw || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          isDraw
                            ? "bg-gradient-to-r from-fifa-gold to-yellow-400"
                            : "bg-gray-700"
                        }`}
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
