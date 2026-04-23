"use client";
import { motion } from "framer-motion";
import { getTeamFlag, getShortTeamName } from "@/lib/teamFlags";

/**
 * TrophyCenter — Center section of the knockout bracket.
 * Layout: Trophy → Final Score Card → Champion Display
 * Final card uses SAME design as all bracket match cards.
 */
function FireworkParticle({ delay, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: side === "left" ? 20 : -20, y: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5], x: side === "left" ? 40 : -40, y: -20 }}
      transition={{ duration: 1.5, delay, repeat: Infinity, ease: "easeOut" }}
      className={`absolute ${side === "left" ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_#ffd700]`}
      style={{ 
        position: 'absolute',
        background: '#ffd700',
        borderRadius: '50%',
        boxShadow: '0 0 10px #ffd700',
      }}
    />
  );
}

export default function TrophyCenter({ champion, finalMatch }) {
  const CARD_W = 180;
  const winner = champion || finalMatch?.winner;
  const hasFinalMatch = finalMatch?.team1 && finalMatch?.team2;

  const team1IsWinner = finalMatch?.winner === finalMatch?.team1;
  const team2IsWinner = finalMatch?.winner === finalMatch?.team2;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Trophy */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <img
          src="/trophy.png"
          alt="FIFA World Cup Trophy"
          className="w-16 mx-auto drop-shadow-[0_0_40px_rgba(255,215,0,0.9)]"
        />
      </motion.div>

      {/* Final Match Card */}
      {hasFinalMatch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 15 }}
          className="relative z-10 mx-auto mt-2 mb-2"
        >
          {/* Team 1 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 8px",
              borderRadius: "8px",
              background: team1IsWinner
                ? "rgba(0,255,135,0.1)"
                : "transparent",
            }}
          >
            <img
              src={getTeamFlag(finalMatch.team1, 40)}
              alt={finalMatch.team1}
              style={{
                width: "28px",
                height: "19px",
                borderRadius: "3px",
                objectFit: "cover",
                boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span
              style={{
                flex: 1,
                fontFamily: "'Oswald', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: team1IsWinner ? "#ffffff" : "rgba(255,255,255,0.75)",
              }}
            >
              {getShortTeamName(finalMatch.team1)}
            </span>
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "24px",
                fontWeight: 800,
                color: team1IsWinner ? "#00ff87" : "rgba(255,255,255,0.45)",
                textShadow: team1IsWinner
                  ? "0 0 12px rgba(0,255,135,0.5)"
                  : "none",
                minWidth: "22px",
                textAlign: "right",
              }}
            >
              {finalMatch.score1 ?? "-"}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.1) 50%, transparent 95%)",
              margin: "3px 8px",
            }}
          />

          {/* Team 2 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 8px",
              borderRadius: "8px",
              background: team2IsWinner
                ? "rgba(0,255,135,0.1)"
                : "transparent",
            }}
          >
            <img
              src={getTeamFlag(finalMatch.team2, 40)}
              alt={finalMatch.team2}
              style={{
                width: "28px",
                height: "19px",
                borderRadius: "3px",
                objectFit: "cover",
                boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span
              style={{
                flex: 1,
                fontFamily: "'Oswald', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: team2IsWinner ? "#ffffff" : "rgba(255,255,255,0.75)",
              }}
            >
              {getShortTeamName(finalMatch.team2)}
            </span>
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "24px",
                fontWeight: 800,
                color: team2IsWinner ? "#00ff87" : "rgba(255,255,255,0.45)",
                textShadow: team2IsWinner
                  ? "0 0 12px rgba(0,255,135,0.5)"
                  : "none",
                minWidth: "22px",
                textAlign: "right",
              }}
            >
              {finalMatch.score2 ?? "-"}
            </span>
          </div>
        </motion.div>
      )}

      {/* Champion Display */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", damping: 15 }}
          className="mx-auto mt-2 text-center relative"
        >
          <FireworkParticle delay={0} side="left" />
          <FireworkParticle delay={0.3} side="right" />
          <FireworkParticle delay={0.6} side="left" />
          <FireworkParticle delay={0.9} side="right" />
          <img
            src={getTeamFlag(winner, 64)}
            alt={winner}
            className="w-14 h-10 mx-auto rounded-md object-cover"
          />
          <p className="font-['Oswald'] text-lg font-bold text-white mt-2">
            {winner}
          </p>
          <p className="font-['Oswald'] text-[9px] font-bold text-yellow-400 tracking-widest uppercase">
            WORLD CHAMPIONS
          </p>
        </motion.div>
      )}

      {/* Awaiting state */}
      {!winner && !hasFinalMatch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "10px",
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          AWAITING CHAMPION
        </motion.div>
      )}
    </div>
  );
}