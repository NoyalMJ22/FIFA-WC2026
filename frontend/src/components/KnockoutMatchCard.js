"use client";
import { motion } from "framer-motion";
import { getTeamFlag, getShortTeamName } from "@/lib/teamFlags";

function handleFlagError(e) {
  e.target.style.display = "none";
}

export default function KnockoutMatchCard({ match, index = 0, side = "left", isFinal, compact = false }) {
  const w1 = match?.winner === match?.team1;
  const w2 = match?.winner === match?.team2;
  const hasTeam1 = match?.team1 && match.team1.trim() !== "";
  const hasTeam2 = match?.team2 && match.team2.trim() !== "";

  if (!match || (!hasTeam1 && !hasTeam2)) return null;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? -10 : 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.02 }}
        whileHover={{ scale: 1.05 }}
        className="w-[150px] h-[60px] px-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 backdrop-blur-md flex flex-col justify-center transition-all duration-300 hover:scale-105 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
      >
        {hasTeam1 && (
          <div className={`flex items-center justify-between text-sm h-[22px] ${w1 ? "bg-green-500/20 rounded-md px-1 shadow-[0_0_10px_rgba(0,255,150,0.4)]" : ""}`}>
            <div className="flex items-center gap-2">
              <img
                src={getTeamFlag(match.team1)}
                alt={match.team1}
                className="w-5 h-4 object-cover rounded-sm"
                onError={handleFlagError}
              />
              <span className={`truncate max-w-[80px] ${w1 ? "text-green-300 font-medium" : "text-white/90 font-medium"}`}>
                {getShortTeamName(match.team1)}
              </span>
            </div>
            <span className={`text-cyan-400 font-bold text-sm ${w1 ? "text-green-400" : "text-white/50"}`}>
              {match.score1 ?? "0"}
            </span>
          </div>
        )}
        {hasTeam1 && hasTeam2 && <div className="h-px bg-white/10 my-1" />}
        {hasTeam2 && (
          <div className={`flex items-center justify-between text-sm h-[22px] ${w2 ? "bg-green-500/20 rounded-md px-1 shadow-[0_0_10px_rgba(0,255,150,0.4)]" : ""}`}>
            <div className="flex items-center gap-2">
              <img
                src={getTeamFlag(match.team2)}
                alt={match.team2}
                className="w-5 h-4 object-cover rounded-sm"
                onError={handleFlagError}
              />
              <span className={`truncate max-w-[80px] ${w2 ? "text-green-300 font-medium" : "text-white/90 font-medium"}`}>
                {getShortTeamName(match.team2)}
              </span>
            </div>
            <span className={`text-cyan-400 font-bold text-sm ${w2 ? "text-green-400" : "text-white/50"}`}>
              {match.score2 ?? "0"}
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  if (isFinal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        className="w-[180px] h-[70px] px-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-400/40 backdrop-blur-md flex flex-col justify-center shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300"
      >
        {hasTeam1 && (
          <div className={`flex items-center justify-between text-sm h-[24px] ${w1 ? "bg-green-500/20 rounded-md px-1 shadow-[0_0_10px_rgba(0,255,150,0.4)]" : ""}`}>
            <div className="flex items-center gap-2">
              <img
                src={getTeamFlag(match.team1)}
                alt={match.team1}
                className="w-5 h-4 object-cover rounded-sm"
                onError={handleFlagError}
              />
              <span className={`truncate max-w-[90px] ${w1 ? "text-green-300 font-semibold" : "text-white/90 font-medium"}`}>
                {getShortTeamName(match.team1)}
              </span>
            </div>
            <span className={`text-cyan-400 font-bold ${w1 ? "text-green-400" : "text-white/60"}`}>
              {match.score1 ?? "-"}
            </span>
          </div>
        )}
        {hasTeam1 && hasTeam2 && <div className="h-px bg-yellow-400/20 my-1" />}
        {hasTeam2 && (
          <div className={`flex items-center justify-between text-sm h-[24px] ${w2 ? "bg-green-500/20 rounded-md px-1 shadow-[0_0_10px_rgba(0,255,150,0.4)]" : ""}`}>
            <div className="flex items-center gap-2">
              <img
                src={getTeamFlag(match.team2)}
                alt={match.team2}
                className="w-5 h-4 object-cover rounded-sm"
                onError={handleFlagError}
              />
              <span className={`truncate max-w-[90px] ${w2 ? "text-green-300 font-semibold" : "text-white/90 font-medium"}`}>
                {getShortTeamName(match.team2)}
              </span>
            </div>
            <span className={`text-cyan-400 font-bold ${w2 ? "text-green-400" : "text-white/60"}`}>
              {match.score2 ?? "-"}
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ scale: 1.05 }}
      className="w-[160px] h-[64px] px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 backdrop-blur-md flex flex-col justify-center transition-all duration-300 hover:scale-105 hover:border-cyan-400/40 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
    >
      {hasTeam1 && (
        <div className={`flex items-center justify-between text-sm h-[24px] ${w1 ? "bg-green-500/20 rounded-md px-1 shadow-[0_0_10px_rgba(0,255,150,0.4)]" : ""}`}>
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={getTeamFlag(match.team1)}
              alt={match.team1}
              className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
              onError={handleFlagError}
            />
            <span className={`truncate max-w-[80px] ${w1 ? "text-green-300 font-semibold" : "text-white/90 font-medium"}`}>
              {getShortTeamName(match.team1)}
            </span>
          </div>
          <span className={`text-cyan-400 font-bold ${w1 ? "text-green-400" : "text-white/50"}`}>
            {match.score1 ?? "-"}
          </span>
        </div>
      )}

      {hasTeam1 && hasTeam2 && <div className="h-px bg-white/10 my-1" />}

      {hasTeam2 && (
        <div className={`flex items-center justify-between text-sm h-[24px] ${w2 ? "bg-green-500/20 rounded-md px-1 shadow-[0_0_10px_rgba(0,255,150,0.4)]" : ""}`}>
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={getTeamFlag(match.team2)}
              alt={match.team2}
              className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
              onError={handleFlagError}
            />
            <span className={`truncate max-w-[80px] ${w2 ? "text-green-300 font-semibold" : "text-white/90 font-medium"}`}>
              {getShortTeamName(match.team2)}
            </span>
          </div>
          <span className={`text-cyan-400 font-bold ${w2 ? "text-green-400" : "text-white/50"}`}>
            {match.score2 ?? "-"}
          </span>
        </div>
      )}
    </motion.div>
  );
}