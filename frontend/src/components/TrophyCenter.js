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
  return `https://flagcdn.com/w80/${code}.png`;
}

export default function TrophyCenter({ champion, finalMatch }) {
  return (
    <div className="trophy-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="trophy-wrapper"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 40px rgba(255, 215, 0, 0.4)",
              "0 0 80px rgba(255, 215, 0, 0.6)",
              "0 0 40px rgba(255, 215, 0, 0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img src="/trophy.png" alt="Trophy" className="trophy" />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="trophy-title"
      >
        <span className="gradient-text-gold">WORLD</span>
        <br />
        <span className="gradient-text-gold">CHAMPIONS</span>
      </motion.h2>

      {finalMatch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="final-card"
        >
          <p className="final-label">Final</p>
          <div className="match-score">
            <div className={`team ${finalMatch.winner === finalMatch.team1 ? "winner" : ""}`}>
              <img src={getTeamFlag(finalMatch.team1)} alt={finalMatch.team1} className="team-flag" onError={(e) => e.target.style.display = "none"} />
              <span className="team-name">{finalMatch.team1}</span>
              <span className="team-score">{finalMatch.score1 ?? "–"}</span>
            </div>
            <div className={`team ${finalMatch.winner === finalMatch.team2 ? "winner" : ""}`}>
              <img src={getTeamFlag(finalMatch.team2)} alt={finalMatch.team2} className="team-flag" onError={(e) => e.target.style.display = "none"} />
              <span className="team-name">{finalMatch.team2}</span>
              <span className="team-score">{finalMatch.score2 ?? "–"}</span>
            </div>
          </div>
        </motion.div>
      )}

      {champion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="winner-card"
        >
          <img src={getTeamFlag(champion)} alt={champion} className="winner-flag" onError={(e) => e.target.style.display = "none"} />
          <p className="winner-name">{champion}</p>
          <p className="winner-label">2026 WORLD CUP WINNER</p>
        </motion.div>
      )}

      {!champion && !finalMatch && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="tournament-progress">
          <div className="text-gray-500 text-xs tracking-wider">Tournament in progress...</div>
        </motion.div>
      )}
    </div>
  );
}
