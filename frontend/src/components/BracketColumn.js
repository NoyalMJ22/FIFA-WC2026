"use client";
import { motion } from "framer-motion";
import MatchCard from "./KnockoutMatchCard";

const ROUND_SPACING = {
  "Round of 32": 2,
  "Round of 16": 8,
  "Quarterfinals": 20,
  "Semifinals": 48,
  "Final": 0,
};

function ConnectorLines({ roundIndex, matchCount, isActive = true }) {
  const spacing = ROUND_SPACING[Object.keys(ROUND_SPACING)[roundIndex]] || 8;
  const height = spacing;
  const opacity = isActive ? 1 : 0.2;
  
  return (
    <div className={`flex items-center justify-center w-6 px-0.5 ${!isActive ? 'inactive' : ''}`}>
      <svg width="24" height={height + 30} className="overflow-visible" style={{ opacity }}>
        <defs>
          <linearGradient id={`connector-${roundIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff87" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {matchCount > 1 && (
          <>
            <path
              d={`M 0 12 L 8 12 L 8 ${12 + height/2}`}
              stroke={`url(#connector-${roundIndex})`}
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M 0 ${24 + height} L 8 ${24 + height} L 8 ${12 + height/2}`}
              stroke={`url(#connector-${roundIndex})`}
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1={12 + height/2}
              x2="14"
              y2={12 + height/2}
              stroke={`url(#connector-${roundIndex})`}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </>
        )}
        {matchCount === 1 && (
          <line
            x1="0"
            y1="15"
            x2="14"
            y2="15"
            stroke="url(#connector-4)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}

export default function BracketColumn({ roundName, matches, roundIndex, side = "left", isActive = true, onMatchClick }) {
  const gap = ROUND_SPACING[roundName] || 4;
  const isFinal = roundName === "Final";

  return (
    <div className={`bracket-round ${!isActive ? 'inactive' : ''}`}>
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: isActive ? 1 : 0.3, y: 0 }}
        transition={{ delay: roundIndex * 0.05 }}
        className="text-[8px] text-gray-500 text-center font-semibold tracking-widest uppercase mb-1"
      >
        {roundName}
      </motion.p>
      
      <div 
        className="bracket-round-matches"
        style={{ gap: `${gap}px` }}
      >
        {matches?.map((match, idx) => (
          <div key={match.match_id || idx} className="bracket-match-row">
            <MatchCard 
              match={match} 
              index={idx} 
              side={side}
              highlight={isFinal}
              isDimmed={!isActive}
              delay={roundIndex * 0.03 + idx * 0.01}
            />
            {idx < matches.length - 1 && (
              <ConnectorLines roundIndex={roundIndex} matchCount={matches.length} isActive={isActive} />
            )}
            {idx === matches.length - 1 && matches.length > 1 && (
              <ConnectorLines roundIndex={roundIndex} matchCount={matches.length} isActive={isActive} />
            )}
          </div>
        ))}
        
        {(!matches || matches.length === 0) && (
          <div className="bg-fifa-card/30 border border-white/[0.04] rounded p-1 w-[110px] text-center">
            <span className="text-gray-600 text-[8px]">TBD</span>
          </div>
        )}
      </div>
    </div>
  );
}