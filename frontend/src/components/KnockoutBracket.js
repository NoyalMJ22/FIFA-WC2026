"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import TrophyCenter from "./TrophyCenter";
import BracketColumn from "./BracketColumn";

const STAGES = [
  { key: "r32", label: "Round of 32" },
  { key: "r16", label: "Round of 16" },
  { key: "qf", label: "Quarterfinals" },
  { key: "sf", label: "Semifinals" },
  { key: "final", label: "Final" },
];

const ROUND_LABELS = [
  "Round of 32",
  "Round of 16", 
  "Quarterfinals",
  "Semifinals",
  "Final",
];

const STAGE_ORDER = {
  r32: 0,
  r16: 1,
  qf: 2,
  sf: 3,
  final: 4,
};

export default function KnockoutBracket({ knockoutData }) {
  const [stage, setStage] = useState("final");
  const [mobileView, setMobileView] = useState("full");
  const [expanded, setExpanded] = useState(false);
  
  const rounds = knockoutData?.rounds || {};
  const champion = knockoutData?.champion;
  const finalMatch = rounds["Final"]?.[0];

  const bracketData = useMemo(() => [
    { name: "Round of 32", key: "r32", data: rounds["Round of 32"] || [] },
    { name: "Round of 16", key: "r16", data: rounds["Round of 16"] || [] },
    { name: "Quarterfinals", key: "qf", data: rounds["Quarterfinals"] || [] },
    { name: "Semifinals", key: "sf", data: rounds["Semifinals"] || [] },
    { name: "Final", key: "final", data: rounds["Final"] || [] },
  ], [rounds]);

  const activeStageIndex = STAGE_ORDER[stage];
  const leftRounds = useMemo(() => bracketData.slice(0, 4), [bracketData]);
  const rightRounds = useMemo(() => bracketData.slice(0, 4), [bracketData]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const isRoundActive = (roundIndex) => roundIndex <= activeStageIndex;

  const StageNavigation = () => (
    <div className="stage-nav">
      {STAGES.map((s) => (
        <button
          key={s.key}
          onClick={() => setStage(s.key)}
          className={`stage-btn ${stage === s.key ? 'active' : ''}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );

  const LeftBracketSide = () => (
    <div className="side-bracket">
      {leftRounds.map((data, idx) => (
        <BracketColumn
          key={data.name}
          roundName={data.name}
          matches={data.data}
          roundIndex={idx}
          side="left"
          isActive={isRoundActive(idx)}
        />
      ))}
    </div>
  );

  const RightBracketSide = () => (
    <div className="side-bracket">
      {[...rightRounds].reverse().map((data, idx) => (
        <BracketColumn
          key={data.name}
          roundName={data.name}
          matches={data.data}
          roundIndex={idx}
          side="right"
          isActive={isRoundActive(idx)}
        />
      ))}
    </div>
  );

  return (
    <div className="bracket-container">
      <StageNavigation />

      <AnimatePresence mode="wait">
        {isMobile ? (
          <motion.div
            key={mobileView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <BracketColumn
              roundName={mobileView}
              matches={rounds[mobileView] || []}
              roundIndex={ROUND_LABELS.indexOf(mobileView)}
              side="left"
              isActive={true}
            />
            {mobileView === "Final" && (
              <div className="mt-4">
                <TrophyCenter champion={champion} finalMatch={finalMatch} />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`bracket-grid ${expanded ? 'expanded' : ''}`}
          >
            <LeftBracketSide />
            <div className="center-section">
              <TrophyCenter champion={champion} finalMatch={finalMatch} />
            </div>
            <RightBracketSide />
          </motion.div>
        )}
      </AnimatePresence>

      {bracketData.every(r => r.data.length === 0) && (
        <div className="text-center py-12 text-gray-600 text-sm">
          Click &quot;Simulate Full Tournament&quot; to generate the bracket
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close-btn"
                onClick={() => setExpanded(false)}
              >
                Close
              </button>
              <div onClick={(e) => e.stopPropagation()}>
                <KnockoutBracket knockoutData={knockoutData} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
