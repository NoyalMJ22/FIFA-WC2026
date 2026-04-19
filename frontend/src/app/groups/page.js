"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import GroupCard from "@/components/GroupCard";
import { fetchTeams, simulateGroupStage } from "@/lib/api";

export default function GroupsPage() {
  const [teams, setTeams] = useState([]);
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchTeams()
      .then((data) => {
        setTeams(data.teams || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Organize teams by group
  const groupedTeams = {};
  teams.forEach((t) => {
    if (!groupedTeams[t.group]) groupedTeams[t.group] = [];
    groupedTeams[t.group].push(t);
  });
  const groupKeys = Object.keys(groupedTeams).sort();

  async function handleSimulate() {
    setSimulating(true);
    try {
      const data = await simulateGroupStage();
      setStandings(data.standings || null);
    } catch (err) {
      console.error("Simulation error:", err);
    }
    setSimulating(false);
  }

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-wider mb-3">
            <span className="text-white">GROUP </span>
            <span className="gradient-text-green">STAGE</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            12 groups of 4 teams each. Top 2 from every group plus the 8 best
            third-placed teams advance to the Round of 32.
          </p>
        </motion.div>

        {/* Simulate Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-10"
        >
          <button
            onClick={handleSimulate}
            disabled={simulating || loading}
            className="px-8 py-3 rounded-xl font-heading font-semibold text-sm tracking-wider bg-fifa-green text-black hover:shadow-[0_0_30px_rgba(0,255,135,0.4)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {simulating ? (
              <span className="flex items-center gap-2">
                <span className="spinner !w-4 !h-4 !border-2 !border-black/20 !border-t-black" />
                SIMULATING...
              </span>
            ) : standings ? (
              "🔄 RE-SIMULATE GROUPS"
            ) : (
              "🚀 SIMULATE GROUP STAGE"
            )}
          </button>
        </motion.div>

        {/* Qualification Summary */}
        {standings && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-8 max-w-xl mx-auto text-center"
          >
            <p className="text-fifa-green text-sm font-medium">
              ✅ Group stage complete! 32 teams have qualified for the knockout
              round.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        )}

        {/* Group Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {groupKeys.map((g, i) => (
              <GroupCard
                key={g}
                group={g}
                teams={groupedTeams[g]}
                standings={standings ? standings[g] : null}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
