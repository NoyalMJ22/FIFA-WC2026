"use client";
import { motion } from "framer-motion";
import { getTeamFlag, getShortTeamName } from "@/lib/teamFlags";

export default function MatchCard({ match, side, isFinal, isSemi = false }) {
  if (!match) return null;

  const hasTeam1 = match.team1?.trim();
  const hasTeam2 = match.team2?.trim();

  if (!hasTeam1 && !hasTeam2) return null;

  const w1 = match.winner === match.team1;
  const w2 = match.winner === match.team2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative w-full min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] px-2 sm:px-3 py-2 rounded-xl sm:rounded-2xl backdrop-blur-md flex flex-col justify-center ${
        isFinal
          ? "bg-gradient-to-r from-yellow-500/15 via-yellow-500/10 to-yellow-500/15 border-2 border-yellow-400/40 shadow-[0_0_25px_rgba(255,215,0,0.4)]"
          : isSemi
          ? "bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-purple-500/10 border border-purple-400/25 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          : "bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.12] hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,255,200,0.2)]"
      }`}
      style={{
        position: "relative",
        transition: "all 0.25s ease",
      }}
    >
      <div className="flex flex-col gap-0.5 sm:gap-1">
        {hasTeam1 && (
          <motion.div
            className={`flex items-center justify-between px-1.5 sm:px-2 py-1 rounded-lg ${
              w1 ? "bg-gradient-to-r from-green-500/20 to-transparent" : ""
            }`}
            animate={w1 ? { boxShadow: ["0 0 0 rgba(0,255,150,0)", "0 0 12px rgba(0,255,150,0.4)", "0 0 0 rgba(0,255,150,0)"] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src={getTeamFlag(match.team1)}
                alt={match.team1}
                className="w-5 h-3.5 sm:w-6 sm:h-4 object-cover rounded-sm shadow-lg"
              />
              <span
                className={`text-[10px] sm:text-xs font-bold tracking-wide ${
                  w1 ? "text-white drop-shadow-[0_0_8px_rgba(0,255,150,0.6)]" : "text-white/75"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {getShortTeamName(match.team1)}
              </span>
            </div>
            <span
              className={`text-sm sm:text-lg font-extrabold ${
                w1 ? "text-green-400 drop-shadow-[0_0_10px_rgba(0,255,150,0.7)]" : "text-white/45"
              }`}
              style={{ fontFamily: "'Oswald', sans-serif", minWidth: "16px", textAlign: "right" }}
            >
              {match.score1 ?? "-"}
            </span>
          </motion.div>
        )}

        {hasTeam1 && hasTeam2 && (
          <div
            className="h-px mx-1.5 sm:mx-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ margin: "2px 0" }}
          />
        )}

        {hasTeam2 && (
          <motion.div
            className={`flex items-center justify-between px-1.5 sm:px-2 py-1 rounded-lg ${
              w2 ? "bg-gradient-to-r from-green-500/20 to-transparent" : ""
            }`}
            animate={w2 ? { boxShadow: ["0 0 0 rgba(0,255,150,0)", "0 0 12px rgba(0,255,150,0.4)", "0 0 0 rgba(0,255,150,0)"] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img
                src={getTeamFlag(match.team2)}
                alt={match.team2}
                className="w-5 h-3.5 sm:w-6 sm:h-4 object-cover rounded-sm shadow-lg"
              />
              <span
                className={`text-[10px] sm:text-xs font-bold tracking-wide ${
                  w2 ? "text-white drop-shadow-[0_0_8px_rgba(0,255,150,0.6)]" : "text-white/75"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {getShortTeamName(match.team2)}
              </span>
            </div>
            <span
              className={`text-sm sm:text-lg font-extrabold ${
                w2 ? "text-green-400 drop-shadow-[0_0_10px_rgba(0,255,150,0.7)]" : "text-white/45"
              }`}
              style={{ fontFamily: "'Oswald', sans-serif", minWidth: "16px", textAlign: "right" }}
            >
              {match.score2 ?? "-"}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}