import numpy as np

def simulate_match(team1, team2, prob1, prob2, allow_draw=False):
    """
    Simulates a match based on the provided predicted win probabilities.
    Returns: winner (or 'Draw'), and a dictionary of event probabilities.
    """
    # Normalize probabilities
    total = prob1 + prob2
    p1 = prob1 / total
    p2 = prob2 / total
    
    draw_chance = 0.0
    if allow_draw:
        diff = abs(p1 - p2)
        # Closer match = higher draw capability
        draw_chance = max(0.05, 0.30 - diff)
        
        # Recalculate Win percentages adjusting for draw occurrence
        rem = 1.0 - draw_chance
        p1 *= rem
        p2 *= rem
        
    probabilities = [p1, p2, draw_chance] if allow_draw else [p1, p2, 0.0]
    outcomes = [team1, team2, 'Draw'] 
    
    # Probabilistic weighted event firing
    choice = np.random.choice(outcomes, p=probabilities)
    
    stats = {
        team1: round(p1 * 100, 1),
        team2: round(p2 * 100, 1),
        'Draw': round(draw_chance * 100, 1) if allow_draw else 0
    }
    
    return choice, stats
