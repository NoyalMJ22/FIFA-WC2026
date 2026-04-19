"use client";
import { motion } from "framer-motion";

const GROUP_COLORS = {
  A: "#00ff87", B: "#7c3aed", C: "#f97316", D: "#06b6d4",
  E: "#ec4899", F: "#ffd700", G: "#ef4444", H: "#22d3ee",
  I: "#a78bfa", J: "#34d399", K: "#fb923c", L: "#f472b6",
};

export default function GroupCard({ group, teams, standings, index }) {
  const color = GROUP_COLORS[group] || "#00ff87";
  const hasStandings = standings && standings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="glass-card overflow-hidden"
      style={{ borderTop: `3px solid ${color}` }}
    >
      {/* Group Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }}
      >
        <h3 className="font-heading text-xl font-bold tracking-wider" style={{ color }}>
          GROUP {group}
        </h3>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: `${color}20`, color }}
        >
          {teams?.length || 4} Teams
        </span>
      </div>

      {/* Team List or Standings */}
      <div className="p-4">
        {hasStandings ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b border-fifa-border/30">
                <th className="text-left pb-2 font-medium">#</th>
                <th className="text-left pb-2 font-medium">Team</th>
                <th className="text-center pb-2 font-medium">P</th>
                <th className="text-center pb-2 font-medium">W</th>
                <th className="text-center pb-2 font-medium">D</th>
                <th className="text-center pb-2 font-medium">L</th>
                <th className="text-center pb-2 font-medium">GD</th>
                <th className="text-center pb-2 font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, i) => (
                <tr
                  key={team.team}
                  className={`border-b border-fifa-border/10 transition-colors ${
                    i < 2
                      ? "bg-green-500/5"
                      : i === 2
                      ? "bg-yellow-500/5"
                      : ""
                  }`}
                >
                  <td className="py-2 text-gray-500 font-mono text-xs">{i + 1}</td>
                  <td className="py-2 flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/w40/${getCountryCode(team.team)}.png`}
                      alt={team.team}
                      className="w-5 h-4 object-cover rounded-sm"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <span className={`font-medium text-xs ${i < 2 ? "text-white" : "text-gray-300"}`}>
                      {team.team}
                    </span>
                  </td>
                  <td className="py-2 text-center text-gray-400 text-xs">{team.w + team.d + team.l}</td>
                  <td className="py-2 text-center text-gray-400 text-xs">{team.w}</td>
                  <td className="py-2 text-center text-gray-400 text-xs">{team.d}</td>
                  <td className="py-2 text-center text-gray-400 text-xs">{team.l}</td>
                  <td className={`py-2 text-center text-xs font-mono ${team.gd > 0 ? "text-green-400" : team.gd < 0 ? "text-red-400" : "text-gray-400"}`}>
                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                  </td>
                  <td className="py-2 text-center font-bold text-xs" style={{ color: i < 2 ? color : "#9ca3af" }}>
                    {team.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-2">
            {teams?.map((team, i) => (
              <div
                key={team.name}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-gray-600 text-xs font-mono w-4">{i + 1}</span>
                <img
                  src={team.flag}
                  alt={team.name}
                  className="w-7 h-5 object-cover rounded-sm shadow-sm"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <span className="font-medium text-sm">{team.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {(team.probability * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Qualification Legend */}
      {hasStandings && (
        <div className="px-4 pb-3 flex gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500/40" /> Qualified
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500/40" /> 3rd Place
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* Country code lookup for flag CDN - matches dataset exactly */
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

function getCountryCode(name) {
  return CODES[name] || "xx";
}
