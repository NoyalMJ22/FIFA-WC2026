import pandas as pd
import numpy as np
from engine import simulate_match

def simulate_group_stage(df, prob_dict):
    """
    Simulate the round-robin group phase for all 12 groups (A-L).
    Rules: 3pts for Win, 1pt for Draw, 0pts for Loss.
    Top 2 advance directly + Best 8 Third Places.
    """
    team_stats = {t: {"Pts": 0, "GF": 0, "GA": 0, "GD": 0, "Group": g} 
                  for t, g in zip(df["Team"], df["Group"])}
    
    groups = df["Group"].unique()
    for g in groups:
        g_teams = df[df["Group"] == g]["Team"].tolist()
        
        # Round robin within group
        for i in range(len(g_teams)):
            for j in range(i + 1, len(g_teams)):
                t1, t2 = g_teams[i], g_teams[j]
                p1, p2 = prob_dict[t1], prob_dict[t2]
                
                winner, stats = simulate_match(t1, t2, p1, p2, allow_draw=True)
                
                # Dynamic Goal Score Generation Mocking
                if winner == t1:
                    team_stats[t1]["Pts"] += 3
                    gf = np.random.randint(1, 4)
                    ga = np.random.randint(0, gf)
                    team_stats[t1]["GF"] += gf; team_stats[t1]["GA"] += ga
                    team_stats[t2]["GF"] += ga; team_stats[t2]["GA"] += gf
                elif winner == t2:
                    team_stats[t2]["Pts"] += 3
                    gf = np.random.randint(1, 4)
                    ga = np.random.randint(0, gf)
                    team_stats[t2]["GF"] += gf; team_stats[t2]["GA"] += ga
                    team_stats[t1]["GF"] += ga; team_stats[t1]["GA"] += gf
                else: # Draw outcome
                    team_stats[t1]["Pts"] += 1
                    team_stats[t2]["Pts"] += 1
                    goals = np.random.randint(0, 3)
                    team_stats[t1]["GF"] += goals; team_stats[t1]["GA"] += goals
                    team_stats[t2]["GF"] += goals; team_stats[t2]["GA"] += goals

    # Compute Goal Differences
    for t in team_stats:
        team_stats[t]["GD"] = team_stats[t]["GF"] - team_stats[t]["GA"]
        
    final_standings = pd.DataFrame.from_dict(team_stats, orient="index").reset_index()
    final_standings.rename(columns={"index": "Team"}, inplace=True)
    
    # Sort teams logically
    final_standings = final_standings.sort_values(
        by=["Group", "Pts", "GD", "GF"], 
        ascending=[True, False, False, False]
    )
    
    qualified = []
    third_places = []
    
    # Analyze progressions logically
    for g in groups:
        g_standings = final_standings[final_standings["Group"] == g]
        qualified.extend(g_standings.iloc[0:2]["Team"].tolist())
        third_places.append(g_standings.iloc[2])

    third_df = pd.DataFrame(third_places)
    
    # Sort best third place teams and get the top 8
    best_thirds = third_df.sort_values(
        by=["Pts", "GD", "GF"], 
        ascending=[False, False, False]
    ).head(8)
    
    qualified.extend(best_thirds["Team"].tolist())
    
    return final_standings, qualified
