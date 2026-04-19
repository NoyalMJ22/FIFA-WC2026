import os
import pandas as pd
import numpy as np

FLAG_EMOJIS = {
    "Argentina": "🇦🇷", "Brazil": "🇧🇷", "France": "🇫🇷", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 
    "Spain": "🇪🇸", "Germany": "🇩🇪", "Portugal": "🇵🇹", "Netherlands": "🇳🇱",
    "Italy": "🇮🇹", "Croatia": "🇭🇷", "Uruguay": "🇺🇾", "Morocco": "🇲🇦", 
    "USA": "🇺🇸", "Colombia": "🇨🇴", "Mexico": "🇲🇽", "Switzerland": "🇨🇭",
    "Senegal": "🇸🇳", "Japan": "🇯🇵", "Denmark": "🇩🇰", "Iran": "🇮🇷", 
    "South Korea": "🇰🇷", "Australia": "🇦🇺", "Ukraine": "🇺🇦", "Austria": "🇦🇹",
    "Sweden": "🇸🇪", "Serbia": "🇷🇸", "Poland": "🇵🇱", "Peru": "🇵🇪", 
    "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Ecuador": "🇪🇨", "Cameroon": "🇨🇲",
    "Hungary": "🇭🇺", "Canada": "🇨🇦", "Chile": "🇨🇱", "Egypt": "🇪🇬", 
    "Nigeria": "🇳🇬", "Mali": "🇲🇱", "Ivory Coast": "🇨🇮", "Algeria": "🇩🇿",
    "Saudi Arabia": "🇸🇦", "Qatar": "🇶🇦", "Turkey": "🇹🇷", "Norway": "🇳🇴", 
    "Czech Republic": "🇨🇿", "Slovakia": "🇸🇰", "Romania": "🇷🇴", "Paraguay": "🇵🇾"
}

def load_data(file_path):
    # Generates a mock dataset if it doesn't already exist.
    if not os.path.exists(file_path):
        _generate_mock_dataset(file_path)
    df = pd.read_csv(file_path)
    return df

def _generate_mock_dataset(file_path):
    groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    teams = list(FLAG_EMOJIS.keys()) # Array of 48 national teams
    np.random.seed(42) # Consistent random assignments
    
    data = []
    top_tier = ["Argentina", "Brazil", "France", "England", "Spain", "Germany", "Portugal", "Italy"]
    
    team_idx = 0
    for g in groups:
        for _ in range(4):
            team = teams[team_idx % len(teams)]
            if team in top_tier:
                prob = np.random.uniform(0.7, 0.95)
            else:
                prob = np.random.uniform(0.1, 0.6)
            data.append([team, g, prob])
            team_idx += 1
            
    df = pd.DataFrame(data, columns=["Team", "Group", "Predicted_Win_Probability"])
    df.to_csv(file_path, index=False)

def get_prob_dict(df):
    return dict(zip(df["Team"], df["Predicted_Win_Probability"]))

def get_flag(team_name):
    return FLAG_EMOJIS.get(team_name, "🏁")
