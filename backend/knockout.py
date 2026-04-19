"""
knockout.py — Knockout Stage Bracket Generator
Simulates elimination rounds from Round of 32 through to the Final.
"""
import random
import numpy as np
from engine import simulate_match


def simulate_knockout(qualified_teams: list, prob_dict: dict):
    """
    Simulate the complete knockout bracket.
    
    Args:
        qualified_teams: List of 32 team names that qualified from groups
        prob_dict: Dict mapping team names to win probabilities
    
    Returns:
        dict with 'rounds' (match history per round) and 'champion' (winner name)
    """
    bracket = list(qualified_teams)
    random.shuffle(bracket)

    rounds_config = [
        ("Round of 32", 16),
        ("Round of 16", 8),
        ("Quarterfinals", 4),
        ("Semifinals", 2),
        ("Final", 1),
    ]

    history = {}
    current = bracket

    for round_name, num_matches in rounds_config:
        matches = []
        next_round = []

        for i in range(0, len(current), 2):
            t1, t2 = current[i], current[i + 1]
            p1, p2 = prob_dict[t1], prob_dict[t2]

            # No draws in knockout (extra time / penalties implied)
            winner, stats = simulate_match(t1, t2, p1, p2, allow_draw=False)

            # Generate plausible scoreline
            w_score = random.randint(1, 4)
            l_score = random.randint(0, max(0, w_score - 1))

            matches.append({
                "match_id": f"{round_name.replace(' ', '_')}_{i // 2}",
                "team1": t1,
                "team2": t2,
                "winner": winner,
                "prob1": stats[t1],
                "prob2": stats[t2],
                "score1": int(w_score if winner == t1 else l_score),
                "score2": int(l_score if winner == t1 else w_score),
            })
            next_round.append(winner)

        history[round_name] = matches
        current = next_round

    return {
        "rounds": history,
        "champion": current[0],
    }
