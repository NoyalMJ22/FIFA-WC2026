"""
groups.py — Group Stage Simulation System
Handles 12 groups (A–L) with 4 teams each, round-robin matches,
standings computation, and qualification logic (top 2 + best 8 third-place).
"""
import numpy as np
from engine import simulate_match


def simulate_group_stage(df, prob_dict):
    """
    Simulate the complete round-robin group stage.
    
    Returns a JSON-serializable dict with:
      - standings: {group_letter: [team_stat_objects sorted by rank]}
      - matches: [all match result objects]
      - qualified: [list of 32 team names advancing to knockouts]
    """
    # Initialize stats for every team
    team_stats = {}
    for _, row in df.iterrows():
        team_stats[row["Team"]] = {
            "pts": 0, "gf": 0, "ga": 0, "gd": 0,
            "group": row["Group"], "w": 0, "d": 0, "l": 0,
        }

    all_matches = []
    groups = sorted(df["Group"].unique())

    for g in groups:
        g_teams = df[df["Group"] == g]["Team"].tolist()

        # Round robin: every team plays every other team once
        for i in range(len(g_teams)):
            for j in range(i + 1, len(g_teams)):
                t1, t2 = g_teams[i], g_teams[j]
                p1, p2 = prob_dict[t1], prob_dict[t2]

                winner, stats = simulate_match(t1, t2, p1, p2, allow_draw=True)

                # Generate realistic-ish goal counts
                if winner == t1:
                    team_stats[t1]["pts"] += 3
                    team_stats[t1]["w"] += 1
                    team_stats[t2]["l"] += 1
                    gf = np.random.randint(1, 4)
                    ga = np.random.randint(0, gf)
                    team_stats[t1]["gf"] += gf
                    team_stats[t1]["ga"] += ga
                    team_stats[t2]["gf"] += ga
                    team_stats[t2]["ga"] += gf
                elif winner == t2:
                    team_stats[t2]["pts"] += 3
                    team_stats[t2]["w"] += 1
                    team_stats[t1]["l"] += 1
                    gf = np.random.randint(1, 4)
                    ga = np.random.randint(0, gf)
                    team_stats[t2]["gf"] += gf
                    team_stats[t2]["ga"] += ga
                    team_stats[t1]["gf"] += ga
                    team_stats[t1]["ga"] += gf
                else:
                    # Draw
                    team_stats[t1]["pts"] += 1
                    team_stats[t2]["pts"] += 1
                    team_stats[t1]["d"] += 1
                    team_stats[t2]["d"] += 1
                    goals = np.random.randint(0, 3)
                    team_stats[t1]["gf"] += goals
                    team_stats[t1]["ga"] += goals
                    team_stats[t2]["gf"] += goals
                    team_stats[t2]["ga"] += goals
                    gf = goals
                    ga = goals

                match_result = {
                    "group": g,
                    "team1": t1,
                    "team2": t2,
                    "winner": winner,
                    "prob1": stats[t1],
                    "prob2": stats[t2],
                    "score1": int(gf if winner == t1 or winner == "Draw" else ga),
                    "score2": int(ga if winner == t1 or winner == "Draw" else gf),
                }
                all_matches.append(match_result)

    # Compute goal difference
    for t in team_stats:
        team_stats[t]["gd"] = team_stats[t]["gf"] - team_stats[t]["ga"]

    # Build sorted standings per group
    standings = {}
    for g in groups:
        g_teams = [
            (t, s) for t, s in team_stats.items() if s["group"] == g
        ]
        g_teams.sort(
            key=lambda x: (x[1]["pts"], x[1]["gd"], x[1]["gf"]),
            reverse=True,
        )
        standings[g] = [{"team": t, **s} for t, s in g_teams]

    # Determine qualified teams: top 2 per group + best 8 third-placed
    qualified = []
    third_places = []

    for g in groups:
        qualified.append(standings[g][0]["team"])
        qualified.append(standings[g][1]["team"])
        third_places.append(standings[g][2])

    third_places.sort(
        key=lambda x: (x["pts"], x["gd"], x["gf"]),
        reverse=True,
    )
    best_thirds = [tp["team"] for tp in third_places[:8]]
    qualified.extend(best_thirds)

    return {
        "standings": standings,
        "matches": all_matches,
        "qualified": qualified,
    }
