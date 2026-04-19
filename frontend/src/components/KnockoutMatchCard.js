"use client";
import { motion } from "framer-motion";

const TEAM_FLAGS = {
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

function getTeamFlag(name) {
  const code = TEAM_FLAGS[name] || "xx";
  return `https://flagcdn.com/w40/${code}.png`;
}

export default function MatchCard({ match, index = 0, side = "left", highlight = false, isDimmed = false }) {
  const isTeam1Winner = match.winner === match.team1;
  const isTeam2Winner = match.winner === match.team2;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -10 : 10 }}
      animate={{ opacity: isDimmed ? 0.3 : 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ scale: isDimmed ? 1 : 1.02 }}
      className={`
        relative p-1.5 rounded-lg w-[130px] h-[50px]
        bg-gradient-to-b from-[#1a1f3a] to-[#0f1225]
        border border-white/[0.06] hover:border-fifa-green/40
        transition-all duration-200 cursor-pointer
        hover:shadow-[0_0_15px_rgba(0,255,135,0.1)]
        group
        ${isDimmed ? 'inactive' : ''}
      `}
      style={{
        boxShadow: highlight 
          ? "0 0 20px rgba(255, 215, 0, 0.15), inset 0 0 20px rgba(255, 215, 0, 0.03)"
          : "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-fifa-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[6px] text-gray-500 uppercase tracking-wider truncate">
            {match.match_id?.replace(/_/g, " ") || "Match"}
          </span>
        </div>

        <div className="space-y-0.5">
          <div className={`flex items-center gap-1 ${isTeam1Winner ? "text-fifa-green" : "text-gray-300"}`}>
            <img
              src={getTeamFlag(match.team1)}
              alt={match.team1}
              className="w-4 h-2.5 object-cover rounded flex-shrink-0"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span className="text-[9px] font-medium truncate flex-1">
              {match.team1}
            </span>
            <span className="text-[9px] text-gray-500 font-mono">
              {match.score1 ?? "–"}
            </span>
          </div>

          <div className={`flex items-center gap-1 ${isTeam2Winner ? "text-fifa-green" : "text-gray-300"}`}>
            <img
              src={getTeamFlag(match.team2)}
              alt={match.team2}
              className="w-4 h-2.5 object-cover rounded flex-shrink-0"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span className="text-[9px] font-medium truncate flex-1">
              {match.team2}
            </span>
            <span className="text-[9px] text-gray-500 font-mono">
              {match.score2 ?? "–"}
            </span>
          </div>
        </div>
      </div>

      {(isTeam1Winner || isTeam2Winner) && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.02 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full"
          style={{
            background: `linear-gradient(90deg, ${isTeam1Winner ? "#00ff87" : "#7c3aed"}, transparent)`,
          }}
        />
      )}
    </motion.div>
  );
}