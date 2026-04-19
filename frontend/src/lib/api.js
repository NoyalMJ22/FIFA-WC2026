/**
 * api.js — Centralized API client for the FastAPI backend.
 * All fetch calls to the backend go through these functions.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch all teams with group assignments and probabilities.
 */
export async function fetchTeams() {
  const res = await fetch(`${API_BASE}/api/teams`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
}

/**
 * Fetch team stats sorted by predicted win probability.
 */
export async function fetchTeamStats() {
  const res = await fetch(`${API_BASE}/api/team-stats`);
  if (!res.ok) throw new Error("Failed to fetch team stats");
  return res.json();
}

/**
 * Predict a single match outcome between two teams.
 */
export async function predictMatch(team1, team2, allowDraw = false) {
  const res = await fetch(`${API_BASE}/api/predict-match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ team1, team2, allow_draw: allowDraw }),
  });
  if (!res.ok) throw new Error("Failed to predict match");
  return res.json();
}

/**
 * Simulate the group stage only.
 */
export async function simulateGroupStage() {
  const res = await fetch(`${API_BASE}/api/simulate-group-stage`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to simulate group stage");
  return res.json();
}

/**
 * Simulate the full tournament (groups + knockouts).
 */
export async function simulateTournament() {
  const res = await fetch(`${API_BASE}/api/simulate-tournament`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to simulate tournament");
  return res.json();
}

/**
 * Run Monte Carlo analysis with N iterations.
 */
export async function runMonteCarlo(iterations = 100) {
  const res = await fetch(`${API_BASE}/api/monte-carlo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ iterations }),
  });
  if (!res.ok) throw new Error("Failed to run Monte Carlo");
  return res.json();
}
