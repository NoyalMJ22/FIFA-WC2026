"""
main.py — FastAPI Application
Serves as the backend API for the FIFA WC 2026 Simulator.
Provides endpoints for match prediction, group/tournament simulation, and Monte Carlo analysis.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from utils import load_data, get_prob_dict, get_teams_list, get_flag_url
from engine import simulate_match
from groups import simulate_group_stage
from knockout import simulate_knockout

# ── App Initialization ─────────────────────────────────────────────
app = FastAPI(
    title="FIFA WC 2026 Simulator API",
    description="Probabilistic tournament simulation engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Data Loading ───────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
CSV_PATH = os.path.join(DATA_DIR, "fifa_wc2026_UPGRADED.csv")
os.makedirs(DATA_DIR, exist_ok=True)

df = load_data(CSV_PATH)
prob_dict = get_prob_dict(df)


# ── Request Models ─────────────────────────────────────────────────
class MatchRequest(BaseModel):
    team1: str
    team2: str
    allow_draw: bool = False


class MonteCarloRequest(BaseModel):
    iterations: int = 100


# ── Endpoints ──────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "FIFA WC 2026 API is running 🚀"}


@app.get("/api/teams")
def get_teams():
    """Return all 48 teams with group, probability, and flag URL."""
    return {"teams": get_teams_list(df)}


@app.get("/api/team-stats")
def team_stats():
    """Return teams sorted by predicted win probability (descending)."""
    sorted_df = df.sort_values("Predicted_Win_Probability", ascending=False)
    stats = []
    for _, row in sorted_df.iterrows():
        stats.append({
            "name": row["Team"],
            "group": row["Group"],
            "probability": round(float(row["Predicted_Win_Probability"]) * 100, 2),
            "flag": get_flag_url(row["Team"]),
        })
    return {"stats": stats}


@app.post("/api/predict-match")
def predict_match(req: MatchRequest):
    """Predict the outcome of a single match between two teams."""
    if req.team1 not in prob_dict or req.team2 not in prob_dict:
        return {"error": "One or both team names are invalid."}

    p1, p2 = prob_dict[req.team1], prob_dict[req.team2]
    winner, stats = simulate_match(req.team1, req.team2, p1, p2, req.allow_draw)

    return {
        "team1": req.team1,
        "team2": req.team2,
        "winner": winner,
        "probabilities": stats,
        "flag1": get_flag_url(req.team1),
        "flag2": get_flag_url(req.team2),
    }


@app.post("/api/simulate-group-stage")
def api_simulate_groups():
    """Simulate the full group stage and return standings + qualified teams."""
    return simulate_group_stage(df, prob_dict)


@app.post("/api/simulate-tournament")
def api_simulate_tournament():
    """Simulate a complete tournament (groups → knockout → champion)."""
    group_result = simulate_group_stage(df, prob_dict)
    ko_result = simulate_knockout(group_result["qualified"], prob_dict)
    return {
        "groups": group_result,
        "knockout": ko_result,
    }


@app.post("/api/monte-carlo")
def api_monte_carlo(req: MonteCarloRequest):
    """Run the tournament N times and return aggregated win statistics."""
    winners = {}
    for _ in range(req.iterations):
        gr = simulate_group_stage(df, prob_dict)
        ko = simulate_knockout(gr["qualified"], prob_dict)
        champ = ko["champion"]
        winners[champ] = winners.get(champ, 0) + 1

    results = sorted(
        [
            {
                "team": t,
                "wins": w,
                "percentage": round(w / req.iterations * 100, 2),
                "flag": get_flag_url(t),
            }
            for t, w in winners.items()
        ],
        key=lambda x: x["wins"],
        reverse=True,
    )
    return {"iterations": req.iterations, "results": results}
