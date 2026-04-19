"""
utils.py — Data loading, flag images, team metadata helpers.
"""
import os
import pandas as pd
import numpy as np

# ISO country codes for flagcdn.com flag image URLs
COUNTRY_CODES = {
    "Argentina": "ar", "Brazil": "br", "France": "fr", "England": "gb-eng",
    "Spain": "es", "Germany": "de", "Portugal": "pt", "Netherlands": "nl",
    "Italy": "it", "Croatia": "hr", "Uruguay": "uy", "Morocco": "ma",
    "USA": "us", "Colombia": "co", "Mexico": "mx", "Switzerland": "ch",
    "Senegal": "sn", "Japan": "jp", "Denmark": "dk", "Iran": "ir",
    "South Korea": "kr", "Australia": "au", "Ukraine": "ua", "Austria": "at",
    "Sweden": "se", "Serbia": "rs", "Poland": "pl", "Peru": "pe",
    "Scotland": "gb-sct", "Wales": "gb-wls", "Ecuador": "ec", "Cameroon": "cm",
    "Hungary": "hu", "Canada": "ca", "Chile": "cl", "Egypt": "eg",
    "Nigeria": "ng", "Mali": "ml", "Ivory Coast": "ci", "Algeria": "dz",
    "Saudi Arabia": "sa", "Qatar": "qa", "Turkey": "tr", "Norway": "no",
    "Czechia": "cz", "Slovakia": "sk", "Romania": "ro", "Paraguay": "py",
    "Costa Rica": "cr", "Tunisia": "tn", "Ghana": "gh", "Bolivia": "bo",
    "Curaçao": "cw", "Haiti": "ht", "New Zealand": "nz",
    "Bosnia and Herzegovina": "ba", "Cabo Verde": "cv",
    "Congo DR": "cd", "Uzbekistan": "uz", "Jordan": "jo",
    "Türkiye": "tr", "Korea Republic": "kr",
}


def get_flag_url(team_name: str) -> str:
    """Returns a CDN URL for the team's flag image."""
    code = COUNTRY_CODES.get(team_name, "xx")
    return f"https://flagcdn.com/w80/{code}.png"


def load_data(file_path: str) -> pd.DataFrame:
    """Load the CSV dataset. Auto-generates a realistic one if missing."""
    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        _generate_dataset(file_path)
    return pd.read_csv(file_path)


def _generate_dataset(file_path: str):
    """Generate a realistic 48-team dataset with tiered probabilities."""
    groups = list("ABCDEFGHIJKL")
    teams = list(COUNTRY_CODES.keys())[:48]

    np.random.seed(42)

    top_tier = [
        "Argentina", "Brazil", "France", "England",
        "Spain", "Germany", "Portugal", "Italy"
    ]
    mid_tier = [
        "Netherlands", "Croatia", "Uruguay", "Colombia",
        "Mexico", "USA", "Denmark", "Switzerland"
    ]

    data = []
    team_idx = 0
    for g in groups:
        for _ in range(4):
            team = teams[team_idx]
            if team in top_tier:
                prob = round(np.random.uniform(0.70, 0.95), 4)
            elif team in mid_tier:
                prob = round(np.random.uniform(0.45, 0.70), 4)
            else:
                prob = round(np.random.uniform(0.10, 0.45), 4)
            data.append([team, g, prob])
            team_idx += 1

    df = pd.DataFrame(data, columns=["Team", "Group", "Predicted_Win_Probability"])
    df.to_csv(file_path, index=False)


def get_prob_dict(df: pd.DataFrame) -> dict:
    """Build a fast-lookup dict mapping team name → probability."""
    return dict(zip(df["Team"], df["Predicted_Win_Probability"]))


def get_teams_list(df: pd.DataFrame) -> list:
    """Return a JSON-serializable list of all team objects."""
    teams = []
    for _, row in df.iterrows():
        teams.append({
            "name": row["Team"],
            "group": row["Group"],
            "probability": round(float(row["Predicted_Win_Probability"]), 4),
            "flag": get_flag_url(row["Team"]),
        })
    return teams
