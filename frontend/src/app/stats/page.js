"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { fetchTeamStats, runMonteCarlo } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const CHART_COLORS = [
  "#00ff87", "#00e5ff", "#ffd700", "#7c3aed", "#ec4899",
  "#f97316", "#22d3ee", "#a78bfa", "#34d399", "#ef4444",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(12,16,40,0.95)",
        border: "1px solid rgba(0,229,255,0.15)",
        backdropFilter: "blur(12px)",
        padding: "12px 16px",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}>
        <p className="text-white font-semibold text-sm">
          {payload[0].payload.name || payload[0].payload.team}
        </p>
        <p className="text-[#00ff87] font-bold text-lg">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function StatsPage() {
  const [stats, setStats] = useState([]);
  const [mcResults, setMcResults] = useState(null);
  const [iterations, setIterations] = useState(100);
  const [loading, setLoading] = useState(false);
  const [mcLoading, setMcLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTeamStats()
      .then((data) => setStats(data.stats || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleMonteCarlo() {
    setMcLoading(true);
    try {
      const data = await runMonteCarlo(iterations);
      setMcResults(data);
    } catch (err) {
      console.error("Monte Carlo error:", err);
    }
    setMcLoading(false);
  }

  const top20 = stats.slice(0, 20);
  const mcTop10 = mcResults?.results?.slice(0, 10) || [];

  // Generate key insight text
  const getInsight = () => {
    if (mcTop10.length < 2) return null;
    const top = mcTop10[0];
    const runner = mcTop10[1];
    const gap = (top.percentage - runner.percentage).toFixed(1);
    return `${top.team} leads with a ${top.percentage}% win probability — ${gap}pp ahead of ${runner.team}. Based on ${mcResults.iterations} simulated tournaments.`;
  };

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wider mb-3">
            <span className="text-white">TOURNAMENT </span>
            <span className="gradient-text-teal">ANALYTICS</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Explore team strength ratings and run Monte Carlo simulations.
          </p>
        </motion.div>

        {/* ─── Team Power Rankings ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 sm:p-6 mb-8"
        >
          <h2 className="font-heading text-lg font-bold tracking-wider mb-1 flex items-center gap-2">
            <span className="text-[#00e5ff]">📊</span> Team Power Rankings
          </h2>
          <p className="text-gray-600 text-xs mb-4">Pre-tournament win probability based on team strength ratings</p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart
                  data={top20}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    domain={[0, 20]}
                    tick={{ fill: "#4a5568", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#cbd5e0", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,229,255,0.04)" }} />
                  <Bar dataKey="probability" radius={[0, 4, 4, 0]} animationDuration={800}>
                    {top20.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.section>

        {/* ─── Monte Carlo Section ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 sm:p-6"
        >
          <h2 className="font-heading text-lg font-bold tracking-wider mb-1 flex items-center gap-2">
            <span className="text-[#7c3aed]">🎲</span> Monte Carlo Simulation
          </h2>
          <p className="text-gray-600 text-xs mb-5">
            Run the tournament multiple times to compute true win probabilities.
          </p>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-5 mb-6">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1 tracking-wider uppercase font-semibold">
                Iterations
              </label>
              <input
                type="number"
                value={iterations}
                onChange={(e) =>
                  setIterations(Math.min(5000, Math.max(10, parseInt(e.target.value) || 10)))
                }
                style={{
                  width: '100px',
                  height: '50px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontFamily: "'Oswald', sans-serif",
                  background: 'rgba(5,5,16,0.8)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  color: 'white',
                  outline: 'none',
                  boxShadow: '0 0 12px rgba(124,58,237,0.1)',
                }}
              />
            </div>
            <motion.button
              onClick={handleMonteCarlo}
              disabled={mcLoading}
              style={{ 
                height: '52px',
                padding: '0 32px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #7b5cff, #00c6ff)',
                border: 'none',
                boxShadow: '0 0 24px rgba(123,92,255,0.35)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: '0.1em',
                cursor: mcLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {mcLoading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                  RUNNING...
                </span>
              ) : (
                <>
                  <span>🚀</span>
                  <span>RUN</span>
                </>
              )}
            </motion.button>
            {mcResults && (
              <span className="text-[11px] text-gray-500" style={{ marginLeft: '8px' }}>
                {mcResults.iterations} iterations completed
              </span>
            )}
          </div>

          {/* MC Loading */}
          {mcLoading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="spinner" style={{ width: 32, height: 32 }} />
              <p className="text-gray-500 text-xs animate-pulse">
                Crunching {iterations} simulations...
              </p>
            </div>
          )}

          {/* MC Results */}
          {mcResults && !mcLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Key Insight Card */}
              {getInsight() && (
                <div className="insight-card mb-6">
                  <p className="insight-label">💡 Key Insight</p>
                  <p className="insight-text">{getInsight()}</p>
                </div>
              )}

              {/* Winner Callout */}
              {mcTop10.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 text-center p-5 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,215,0,0.02))",
                    border: "1px solid rgba(255,215,0,0.15)",
                  }}
                >
                  <p className="text-[10px] text-gray-500 mb-2 tracking-wider uppercase font-semibold">
                    Most Likely Champion
                  </p>
                  <img
                    src={mcTop10[0].flag}
                    alt={mcTop10[0].team}
                    className="w-14 h-10 mx-auto rounded shadow-lg mb-2"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <p className="font-heading text-2xl font-bold gradient-text-gold">
                    {mcTop10[0].team}
                  </p>
                  <p className="text-[#00ff87] text-lg font-bold font-heading text-glow-green">
                    {mcTop10[0].percentage}% win rate
                  </p>
                </motion.div>
              )}

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div>
                  <h3 className="text-[10px] font-semibold text-gray-500 mb-3 tracking-wider uppercase">
                    Top 10 — Win Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={mcTop10} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis
                        dataKey="team"
                        tick={{ fill: "#94a3b8", fontSize: 9 }}
                        angle={-35}
                        textAnchor="end"
                        height={45}
                        axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#4a5568", fontSize: 10 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,229,255,0.04)" }} />
                      <Bar dataKey="percentage" radius={[4, 4, 0, 0]} animationDuration={800}>
                        {mcTop10.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div>
                  <h3 className="text-[10px] font-semibold text-gray-500 mb-3 tracking-wider uppercase">
                    Probability Share
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={mcTop10}
                        dataKey="percentage"
                        nameKey="team"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {mcTop10.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.85} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        iconType="circle"
                        iconSize={6}
                        wrapperStyle={{ fontSize: 9, color: "#94a3b8", paddingTop: "10px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparison Cards (Top 3) */}
              {mcTop10.length >= 3 && (
                <div className="mt-6">
                  <h3 className="text-[10px] font-semibold text-gray-500 mb-3 tracking-wider uppercase">
                    Top Contenders — Comparison
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {mcTop10.slice(0, 3).map((team, idx) => (
                      <motion.div
                        key={team.team}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-4 text-center"
                        style={{
                          borderTop: `2px solid ${CHART_COLORS[idx]}40`,
                        }}
                      >
                        <div className="text-lg mb-1">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                        </div>
                        <img
                          src={team.flag}
                          alt={team.team}
                          className="w-8 h-6 mx-auto rounded mb-2"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <p className="font-heading text-sm font-bold text-white tracking-wide">
                          {team.team}
                        </p>
                        <p
                          className="font-heading text-xl font-bold mt-1"
                          style={{ color: CHART_COLORS[idx] }}
                        >
                          {team.percentage}%
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {team.wins} / {mcResults.iterations} wins
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="section-sep" />

              {/* Full Results Table */}
              <div>
                <h3 className="text-[10px] font-semibold text-gray-500 mb-3 tracking-wider uppercase">
                  Full Results
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <th className="text-left py-2 text-gray-500 font-medium">#</th>
                        <th className="text-left py-2 text-gray-500 font-medium">Team</th>
                        <th className="text-center py-2 text-gray-500 font-medium">Wins</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Win %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mcResults.results.map((r, i) => (
                        <motion.tr
                          key={r.team}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.015 }}
                          className="border-b hover:bg-white/[0.02] transition-colors"
                          style={{ borderColor: "rgba(255,255,255,0.03)" }}
                        >
                          <td className="py-2 text-gray-600 font-mono">{i + 1}</td>
                          <td className="py-2 flex items-center gap-2">
                            <img
                              src={r.flag}
                              alt={r.team}
                              className="w-4 h-3 rounded-sm object-cover"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                            <span className="font-medium">{r.team}</span>
                          </td>
                          <td className="py-2 text-center text-gray-500">{r.wins}</td>
                          <td className="py-2 text-right">
                            <span
                              className="font-mono font-semibold"
                              style={{ color: CHART_COLORS[Math.min(i, CHART_COLORS.length - 1)] }}
                            >
                              {r.percentage}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>
    </div>
  );
}