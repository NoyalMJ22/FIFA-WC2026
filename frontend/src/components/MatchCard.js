"use client";
import { motion } from "framer-motion";

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
  const code = CODES[name] || "xx";
  return `https://flagcdn.com/w40/${code}.png`;
}

export default function MatchCard({ match, index = 0, compact = false }) {
  const isT1Winner = match.winner === match.team1;
  const isT2Winner = match.winner === match.team2;
  const isDraw = match.winner === "Draw";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`glass-card overflow-hidden ${
        compact ? "p-2" : "p-4"
      }`}
      style={{
        borderLeft: `3px solid ${
          isDraw ? "#ffd700" : isT1Winner ? "#00ff87" : "#7c3aed"
        }`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Team 1 */}
        <div className={`flex items-center gap-2 flex-1 ${compact ? "" : "min-w-0"}`}>
          <img
            src={getFlagUrl(match.team1)}
            alt={match.team1}
            className={`${compact ? "w-5 h-4" : "w-8 h-6"} object-cover rounded-sm`}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="min-w-0">
            <p
              className={`font-semibold truncate ${
                compact ? "text-xs" : "text-sm"
              } ${isT1Winner ? "text-fifa-green" : "text-gray-300"}`}
            >
              {match.team1}
            </p>
            {!compact && (
              <p className="text-[10px] text-gray-500">{match.prob1}%</p>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 text-center">
          <div
            className={`font-heading font-bold ${
              compact ? "text-sm px-2 py-0.5" : "text-lg px-3 py-1"
            } rounded-lg bg-black/40`}
          >
            <span className={isT1Winner ? "text-fifa-green" : "text-gray-400"}>
              {match.score1 ?? "–"}
            </span>
            <span className="text-gray-600 mx-1">:</span>
            <span className={isT2Winner ? "text-fifa-green" : "text-gray-400"}>
              {match.score2 ?? "–"}
            </span>
          </div>
          {isDraw && !compact && (
            <p className="text-[10px] text-fifa-gold mt-1">DRAW</p>
          )}
        </div>

        {/* Team 2 */}
        <div className={`flex items-center gap-2 flex-1 justify-end ${compact ? "" : "min-w-0"}`}>
          <div className="min-w-0 text-right">
            <p
              className={`font-semibold truncate ${
                compact ? "text-xs" : "text-sm"
              } ${isT2Winner ? "text-fifa-green" : "text-gray-300"}`}
            >
              {match.team2}
            </p>
            {!compact && (
              <p className="text-[10px] text-gray-500">{match.prob2}%</p>
            )}
          </div>
          <img
            src={getFlagUrl(match.team2)}
            alt={match.team2}
            className={`${compact ? "w-5 h-4" : "w-8 h-6"} object-cover rounded-sm`}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      </div>

      {/* Winner bar */}
      {!compact && !isDraw && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
          className="mt-3 h-0.5 rounded-full origin-left"
          style={{
            background: `linear-gradient(90deg, ${
              isT1Winner ? "#00ff87" : "#7c3aed"
            }, transparent)`,
          }}
        />
      )}
    </motion.div>
  );
}
