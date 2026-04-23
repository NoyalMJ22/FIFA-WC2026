"use client";
import { motion } from "framer-motion";
import { getTeamFlag } from "@/lib/teamFlags";

const GROUP_COLORS = {
  A: "#00ff87", B: "#7c3aed", C: "#f97316", D: "#06b6d4",
  E: "#ec4899", F: "#ffd700", G: "#ef4444", H: "#22d3ee",
  I: "#a78bfa", J: "#34d399", K: "#fb923c", L: "#f472b6",
};

function handleFlagError(e) {
  e.target.style.display = "none";
}

export default function GroupCard({ group, teams, standings, index }) {
  const color = GROUP_COLORS[group] || "#00ff87";
  const hasStandings = standings && standings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group-card-wrap"
      style={{
        "--gc": color,
        "--gc-low": `${color}12`,
        "--gc-med": `${color}25`,
      }}
    >
      <div className="group-card-glow" />

      <div className="h-[260px] w-full p-5 rounded-2xl bg-gradient-to-b from-[#0a0f1f] to-[#050a18] border border-white/10 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-heading text-xl font-bold tracking-wider" style={{ color }}>
            GROUP {group}
          </h3>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full tracking-wider" style={{ background: `${color}15`, color }}>
            {teams?.length || 4} TEAMS
          </span>
        </div>

        <div className="flex flex-col flex-1 justify-between">
          {hasStandings ? (
            <div className="space-y-[2px]">
              {standings.map((team, i) => (
                <motion.div
                  key={team.team}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 + i * 0.05 }}
                  className="flex items-center justify-between h-[34px] px-2 rounded"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-600 text-xs font-mono w-4">
                      {i === 0 ? <span className="text-amber-400">★</span> : i + 1}
                    </span>
                    <img
                      src={getTeamFlag(team.team)}
                      alt={team.team}
                      className="w-5 h-3.5 object-cover rounded-sm border border-white/10 flex-shrink-0"
                      onError={handleFlagError}
                    />
                    <span className={`font-medium text-xs truncate max-w-[110px] ${i === 0 ? "text-amber-300" : i < 2 ? "text-white/80" : "text-gray-400"}`}>
                      {team.team}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500 font-mono">{team.w + team.d + team.l}</span>
                    <span className={team.gd > 0 ? "text-green-400" : team.gd < 0 ? "text-red-400" : "text-gray-500"}>
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </span>
                    <span className="font-bold min-w-[24px] text-right" style={{ color: i === 0 ? "#fbbf24" : i < 2 ? color : "#6b7280" }}>
                      {team.pts}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-[2px]">
              {teams?.map((team, i) => (
                <motion.div
                  key={team.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 + i * 0.06 }}
                  className="flex items-center justify-between h-[34px] px-2 rounded-lg hover:bg-white/[0.03] transition-all duration-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-600 text-xs font-mono w-4">{i + 1}</span>
                    <img
                      src={getTeamFlag(team.name)}
                      alt={team.name}
                      className="w-6 h-4 object-cover rounded-sm border border-white/10 flex-shrink-0"
                      onError={handleFlagError}
                    />
                    <span className={`font-medium text-sm truncate max-w-[110px] ${i === 0 ? "text-white" : ""}`}>{team.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(team.probability * 100 * 5, 100)}%` }}
                        transition={{ duration: 0.8, delay: index * 0.04 + i * 0.06 }}
                        className="h-full rounded-full"
                        style={{ background: i === 0 ? '#fbbf24' : color }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono w-10 text-right">
                      {(team.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {hasStandings && (
          <div className="flex gap-4 text-[10px] text-gray-500 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500/40" /> Qualified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500/40" /> 3rd Place
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}