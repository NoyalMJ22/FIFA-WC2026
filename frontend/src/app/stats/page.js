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
  "#00ff87", "#7c3aed", "#f97316", "#06b6d4", "#ec4899",
  "#ffd700", "#ef4444", "#22d3ee", "#a78bfa", "#34d399",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1225] border border-[#1e293b] p-3 rounded-lg">
        <p className="text-white font-semibold text-sm">{payload[0].payload.name || payload[0].payload.team}</p>
        <p className="text-[#00ff87] font-bold">{payload[0].value}%</p>
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

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wider mb-3">
            <span className="text-white">TOURNAMENT </span>
            <span className="gradient-text-green">ANALYTICS</span>
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
          <h2 className="font-heading text-lg font-bold tracking-wider mb-4 flex items-center gap-2">
            <span className="text-fifa-green">📊</span> Team Power Rankings
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={top20} 
                  layout="vertical" 
                  margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    domain={[0, 20]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={{ stroke: "#1e293b" }}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#e2e8f0", fontSize: 10 }}
                    axisLine={{ stroke: "#1e293b" }}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="probability" radius={[0, 4, 4, 0]} animationDuration={800}>
                    {top20.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        fillOpacity={0.85}
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
          <h2 className="font-heading text-lg font-bold tracking-wider mb-4 flex items-center gap-2">
            <span className="text-fifa-purple">🎲</span> Monte Carlo Simulation
          </h2>
          <p className="text-gray-500 text-xs mb-5">
            Run the tournament multiple times to compute true win probabilities.
          </p>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1 tracking-wider uppercase">
                Iterations
              </label>
              <input
                type="number"
                value={iterations}
                onChange={(e) =>
                  setIterations(
                    Math.min(5000, Math.max(10, parseInt(e.target.value) || 10))
                  )
                }
                className="bg-[#050510] border border-[#1e293b] rounded-lg px-3 py-2 text-white text-sm w-24 focus:outline-none focus:border-[#7c3aed]/50"
              />
            </div>
            <button
              onClick={handleMonteCarlo}
              disabled={mcLoading}
              className="px-5 py-2 rounded-lg font-heading font-semibold text-xs tracking-wider bg-[#7c3aed] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {mcLoading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner !w-3 !h-3 !border-2 !border-white/20 !border-t-white" />
                  RUNNING...
                </span>
              ) : (
                "🚀 RUN"
              )}
            </button>
            {mcResults && (
              <span className="text-[10px] text-gray-500">
                {mcResults.iterations} iterations
              </span>
            )}
          </div>

          {/* MC Loading State */}
          {mcLoading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="spinner !w-8 !h-8" />
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
              {/* Winner Callout */}
              {mcTop10.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#050510] border border-[#ffd700]/20 p-4 rounded-xl text-center mb-6"
                >
                  <p className="text-[10px] text-gray-500 mb-1 tracking-wider uppercase">Most Likely Champion</p>
                  <img
                    src={mcTop10[0].flag}
                    alt={mcTop10[0].team}
                    className="w-12 h-8 mx-auto rounded shadow-md mb-2"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <p className="font-heading text-xl font-bold gradient-text-gold">
                    {mcTop10[0].team}
                  </p>
                  <p className="text-fifa-green text-sm font-bold">
                    {mcTop10[0].percentage}% win rate
                  </p>
                </motion.div>
              )}

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-3">
                    TOP 10 — WIN DISTRIBUTION
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={mcTop10} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis
                        dataKey="team"
                        tick={{ fill: "#94a3b8", fontSize: 9 }}
                        angle={-35}
                        textAnchor="end"
                        height={45}
                        axisLine={{ stroke: "#1e293b" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        axisLine={{ stroke: "#1e293b" }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                        {mcTop10.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                            fillOpacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-3">
                    PROBABILITY SHARE
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={mcTop10}
                        dataKey="percentage"
                        nameKey="team"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {mcTop10.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                            fillOpacity={0.85}
                          />
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

              {/* Results Table */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-400 mb-3">
                  FULL RESULTS
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1e293b]/30">
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
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-[#1e293b]/10 hover:bg-white/[0.02]"
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
                          <td className="py-2 text-center text-gray-400">{r.wins}</td>
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