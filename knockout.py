import random
from engine import simulate_match

def simulate_knockout(qualified_teams, prob_dict):
    """
    Takes 32 qualified teams and simulates the knockout rounds until a champion emerges.
    Returns: A dictionary of historical bracket matchups natively structured.
    """
    
    bracket = list(qualified_teams)
    
    # Perform a 'draw' by randomly placing the qualified teams in standard WC 32-team format
    random.shuffle(bracket) 
    
    rounds = ["Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"]
    history = {}
    
    current_teams = bracket
    for r in rounds:
        next_teams = []
        matches = []
        
        for i in range(0, len(current_teams), 2):
            t1 = current_teams[i]
            t2 = current_teams[i+1]
            p1, p2 = prob_dict[t1], prob_dict[t2]
            
            # Allow Draw = False for knockout stages
            winner, stats = simulate_match(t1, t2, p1, p2, allow_draw=False)
            
            # Mock predicted scores for atmospheric flavor UI
            base_score = random.randint(1, 4)
            loser_score = random.randint(0, base_score - 1)
            score = f"{base_score} - {loser_score}"
            
            matches.append({
                "t1": t1, 
                "t2": t2, 
                "winner": winner, 
                "prob1": stats[t1], 
                "prob2": stats[t2],
                "score": score
            })
            next_teams.append(winner)
            
        history[r] = matches
        current_teams = next_teams
        
    return history, current_teams[0]  # Winner
