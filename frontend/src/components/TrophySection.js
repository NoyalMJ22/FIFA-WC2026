"use client";
import { motion } from "framer-motion";
import { getTeamFlag, getShortTeamName } from "@/lib/teamFlags";

function Sparkle({ delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, ease: "easeOut" }}
      className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
      style={{
        boxShadow: "0 0 8px 2px rgba(255, 215, 0, 0.8)",
      }}
    />
  );
}

export default function TrophySection({ winner, finalMatch }) {
  const hasFinal = finalMatch?.team1 && finalMatch?.team2;
  const winnerIsTeam1 = finalMatch?.winner === finalMatch?.team1;

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-6">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,180,0,0.3) 25%, rgba(255,140,0,0.15) 50%, transparent 70%)",
          }}
          animate={{ opacity: [0.85, 1, 0.85], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src="/trophy.png"
          alt="FIFA World Cup Trophy"
          className="relative w-16 sm:w-20 lg:w-28 h-auto z-10"
          style={{
            filter: "drop-shadow(0 0 30px rgba(255,215,0,0.8)) drop-shadow(0 0 50px rgba(255,215,0,0.5))",
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {[0, 0.4, 0.8, 1.2].map((d, i) => (
          <Sparkle key={i} delay={d} />
        ))}
      </div>

      {hasFinal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className="w-full min-w-[160px] sm:min-w-[200px] lg:min-w-[240px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-br from-yellow-500/12 via-yellow-500/6 to-yellow-500/12 border-2 border-yellow-400/30 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
        >
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <motion.div
              className={`flex items-center justify-between px-2 sm:px-3 py-1.5 rounded-lg ${
                winnerIsTeam1 ? "bg-gradient-to-r from-green-500/20 to-transparent" : ""
              }`}
              animate={winnerIsTeam1 ? { boxShadow: ["0 0 0 rgba(0,255,150,0)", "0 0 15px rgba(0,255,150,0.5)", "0 0 0 rgba(0,255,150,0)"] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <img
                  src={getTeamFlag(finalMatch.team1)}
                  alt={finalMatch.team1}
                  className="w-6 h-4 sm:w-7 sm:h-5 object-cover rounded-sm shadow-lg"
                />
                <span
                  className={`text-xs sm:text-sm font-bold tracking-wide ${
                    winnerIsTeam1 ? "text-white drop-shadow-[0_0_10px_rgba(0,255,150,0.7)]" : "text-white/75"
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {getShortTeamName(finalMatch.team1)}
                </span>
              </div>
              <span
                className={`text-lg sm:text-xl font-extrabold ${
                  winnerIsTeam1 ? "text-green-400 drop-shadow-[0_0_12px_rgba(0,255,150,0.8)]" : "text-white/45"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {finalMatch.score1}
              </span>
            </motion.div>

            <div className="h-px mx-2 sm:mx-3 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />

            <motion.div
              className={`flex items-center justify-between px-2 sm:px-3 py-1.5 rounded-lg ${
                !winnerIsTeam1 ? "bg-gradient-to-r from-green-500/20 to-transparent" : ""
              }`}
              animate={!winnerIsTeam1 ? { boxShadow: ["0 0 0 rgba(0,255,150,0)", "0 0 15px rgba(0,255,150,0.5)", "0 0 0 rgba(0,255,150,0)"] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <img
                  src={getTeamFlag(finalMatch.team2)}
                  alt={finalMatch.team2}
                  className="w-6 h-4 sm:w-7 sm:h-5 object-cover rounded-sm shadow-lg"
                />
                <span
                  className={`text-xs sm:text-sm font-bold tracking-wide ${
                    !winnerIsTeam1 ? "text-white drop-shadow-[0_0_10px_rgba(0,255,150,0.7)]" : "text-white/75"
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {getShortTeamName(finalMatch.team2)}
                </span>
              </div>
              <span
                className={`text-lg sm:text-xl font-extrabold ${
                  !winnerIsTeam1 ? "text-green-400 drop-shadow-[0_0_12px_rgba(0,255,150,0.8)]" : "text-white/45"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {finalMatch.score2}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", damping: 15 }}
          className="flex flex-col items-center gap-2 sm:gap-3 mt-2 sm:mt-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-gradient-to-br from-yellow-500/15 via-yellow-500/08 to-yellow-500/15 border-2 border-yellow-400/50 shadow-[0_0_40px_rgba(255,215,0,0.3)]"
        >
          <img
            src={getTeamFlag(winner)}
            alt={winner}
            className="w-12 sm:w-14 lg:w-16 h-8 sm:h-10 lg:h-11 object-cover rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_30px_rgba(255,215,0,0.3)]"
          />
          <h2
            className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-wide text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {winner}
          </h2>
          <p
            className="text-[9px] sm:text-[10px] lg:text-xs font-bold text-yellow-400 tracking-[0.25em] sm:tracking-[0.3em] uppercase text-center drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            World Champions
          </p>
        </motion.div>
      )}

      {!winner && !hasFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-2"
        >
          <p
            className="text-[10px] sm:text-xs font-semibold text-white/25 tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Awaiting Champion
          </p>
        </motion.div>
      )}
    </div>
  );
}