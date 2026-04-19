"""
engine.py — Probabilistic Match Simulation Engine
Uses weighted randomness based on predicted win probabilities.
"""
import numpy as np


def simulate_match(team1: str, team2: str, prob1: float, prob2: float, allow_draw: bool = False):
    """
    Simulate a single match between two teams.
    
    Args:
        team1: Name of the first team
        team2: Name of the second team
        prob1: Predicted win probability of team1 (0-1)
        prob2: Predicted win probability of team2 (0-1)
        allow_draw: Whether draws are allowed (group stage only)
    
    Returns:
        tuple: (winner_name, probability_stats_dict)
    """
    # Normalize probabilities so they sum to 1
    total = prob1 + prob2
    p1 = prob1 / total
    p2 = prob2 / total

    draw_chance = 0.0
    if allow_draw:
        # The closer the match, the higher the draw probability
        diff = abs(p1 - p2)
        draw_chance = max(0.05, 0.30 - diff)
        # Scale win probabilities to leave room for draw
        remaining = 1.0 - draw_chance
        p1 *= remaining
        p2 *= remaining

    # Build outcome arrays
    outcomes = [team1, team2]
    probabilities = [p1, p2]

    if allow_draw:
        outcomes.append("Draw")
        probabilities.append(draw_chance)

    # Weighted random selection
    choice = np.random.choice(outcomes, p=probabilities)

    stats = {
        team1: round(p1 * 100, 1),
        team2: round(p2 * 100, 1),
    }
    if allow_draw:
        stats["Draw"] = round(draw_chance * 100, 1)

    return choice, stats
