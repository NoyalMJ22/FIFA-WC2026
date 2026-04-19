import streamlit as st
import pandas as pd
import time
import matplotlib.pyplot as plt
import plotly.express as px
from utils import load_data, get_prob_dict, get_flag
from groups import simulate_group_stage
from knockout import simulate_knockout
from engine import simulate_match

# Page Configuration
st.set_page_config(layout="wide", page_title="FIFA WC 2026 Simulator", page_icon="🏆", initial_sidebar_state="expanded")

# Custom CSS for Dark Theme & Visual Elements
st.markdown("""
<style>
/* Streamlit Dark Theme is usually default, but we can override specifics */
.match-card {
    background-color: #1e222d;
    border-left: 5px solid #f2c029;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.4);
    transition: transform 0.2s ease-in-out;
}
.match-card:hover {
    transform: scale(1.02);
}
.team-name {
    font-size: 1.15rem;
    font-weight: 600;
}
.winner {
    color: #4CAF50;
    font-weight: bold;
}
.loser {
    color: #F44336;
}
.score {
    font-size: 1.6rem;
    font-weight: 800;
    text-align: center;
    color: #ffffff;
    background-color: #111;
    padding: 5px 15px;
    border-radius: 20px;
}
.prob-text {
    font-size: 0.8rem;
    color: #aaaaaa;
}
</style>
""", unsafe_allow_html=True)

# Helper function to visualize matches nicely
def display_match(m):
    w = m['winner']
    t1_class = "winner" if w == m['t1'] else "loser"
    t2_class = "winner" if w == m['t2'] else "loser"
    
    s_parts = m['score'].split('-')
    if w == m['t1']:
        sc1, sc2 = s_parts[0].strip(), s_parts[1].strip()
    else:
        sc1, sc2 = s_parts[1].strip(), s_parts[0].strip()

    st.markdown(f"""
    <div class="match-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="width:40%;">
                <span class="team-name {t1_class}">{get_flag(m['t1'])} {m['t1']}</span><br>
                <span class="prob-text">Win Prob: {m['prob1']}%</span>
            </div>
            <div style="width:20%; text-align:center;">
                <span class="score">{sc1} - {sc2}</span>
            </div>
            <div style="width:40%; text-align:right;">
                <span class="team-name {t2_class}">{m['t2']} {get_flag(m['t2'])}</span><br>
                <span class="prob-text">Win Prob: {m['prob2']}%</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# Title and Description
st.title("🏆 FIFA World Cup 2026 Simulator")
st.markdown("A probabilistic, full-stack tournament simulator built to predict match outcomes via predictive win vectors.")

DATA_FILE = "fifa_wc2026_UPGRADED.csv"

# Load Dataset & Core Dict
df = load_data(DATA_FILE)
prob_dict = get_prob_dict(df)

# Sidebar Navigation Structure
st.sidebar.markdown("## ⚙️ Control Panel")
mode = st.sidebar.radio("Select View:", [
    "🎮 Tournament Mode", 
    "📊 Monte Carlo Engine", 
    "🔮 Predict Single Match", 
    "📂 Explore Dataset vectors"
])

if mode == "🎮 Tournament Mode":
    st.header("World Cup Bracket Simulator")
    st.markdown("Run a full structured simulation through groups and knockout brackets to determine the ultimate champion.")
    
    if "bracket_history" not in st.session_state:
        st.session_state.standings = None
        st.session_state.qualified = None
        st.session_state.bracket_history = None
        st.session_state.champion = None

    if st.button("🚀 Start New Simulation", use_container_width=True, type="primary"):
        with st.spinner("Analyzing Group Stages (Round Robin)..."):
            time.sleep(1) # Fake delay for atmospheric UX effect
            st.session_state.standings, st.session_state.qualified = simulate_group_stage(df, prob_dict)
        
        with st.spinner("Assembling Knockout Bracket..."):
            time.sleep(1)
            st.session_state.bracket_history, st.session_state.champion = simulate_knockout(st.session_state.qualified, prob_dict)
        
        st.success("Simulation Complete! Review groups and bracket below.")
        
    if st.session_state.standings is not None:
        tab_groups, tab_knockouts = st.tabs(["📊 Group Stages", "⚔️ Knockout Tree"])
        
        with tab_groups:
            st.subheader("Final Group Results")
            st.markdown("Rules: Top 2 teams from each group plus the Best 8 third-place teams advance to knockouts.")
            cols = st.columns(3)
            groups = sorted(df["Group"].unique())
            for idx, g in enumerate(groups):
                g_df = st.session_state.standings[st.session_state.standings["Group"] == g].copy()
                g_df = g_df[["Team", "Pts", "GD", "GF"]]
                
                with cols[idx % 3]:
                    st.markdown(f"**Group {g}**")
                    def highlight_top(s):
                        return ['background-color: rgba(40,167,69,0.3)' if i < 2 else '' for i in range(len(s))]
                    st.dataframe(g_df.style.apply(highlight_top), hide_index=True, use_container_width=True)

        with tab_knockouts:
            st.subheader("Knockout Stage Logic Results")
            for rnd, matches in st.session_state.bracket_history.items():
                st.markdown(f"### {rnd}")
                cols = st.columns(2)
                for i, m in enumerate(matches):
                    with cols[i % 2]:
                        display_match(m)
                st.divider()
                
            st.markdown(f"<h1 style='text-align: center; color: #f2c029; font-size: 3rem;'>👑 2026 WORLD CHAMPION</h1>", unsafe_allow_html=True)
            st.markdown(f"<h1 style='text-align: center; font-size: 4rem; margin-top: -20px;'>{get_flag(st.session_state.champion)} {st.session_state.champion.upper()} {get_flag(st.session_state.champion)}</h1>", unsafe_allow_html=True)
            
            if st.session_state.champion:
                st.balloons()

elif mode == "📊 Monte Carlo Engine":
    st.header("Stochastic Monte Carlo Analysis")
    st.markdown("Run the tournament hundreds or thousands of times to compute true structural win distributions.")
    
    runs = st.number_input("Iterations to Process", min_value=10, max_value=10000, value=100, step=10)
    
    if st.button("Run Batch Engine", type="primary"):
        winners = []
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        for i in range(runs):
            s_df, q_teams = simulate_group_stage(df, prob_dict)
            b_hist, champ = simulate_knockout(q_teams, prob_dict)
            winners.append(champ)
            if i % (runs // 10 if runs >= 10 else 1) == 0:
                progress_bar.progress(i / runs)
                status_text.text(f"Crunching mathematical iteration {i}/{runs}...")
                
        progress_bar.progress(1.0)
        status_text.text("Aggregation matrix calculated.")
        
        w_df = pd.Series(winners).value_counts().reset_index()
        w_df.columns = ["Team", "Tournament Wins"]
        w_df["Statistical Win %"] = (w_df["Tournament Wins"] / runs * 100).round(2)
        
        st.subheader("Aggregated Data Synthesis")
        col1, col2 = st.columns([1, 1.5])
        with col1:
            st.dataframe(w_df, hide_index=True, use_container_width=True)
            
        with col2:
            fig = px.bar(w_df.head(10), x="Statistical Win %", y="Team", orientation='h',
                         title="Top 10 Most Frequent Output Champions",
                         text="Statistical Win %", color="Statistical Win %",
                         color_continuous_scale="magma")
            fig.update_layout(yaxis={'categoryorder':'total ascending'})
            st.plotly_chart(fig, use_container_width=True)
            
        fig2 = px.pie(w_df.head(8), values='Tournament Wins', names='Team', hole=0.5, title="Probabilistic Pie Distribution (Top 8)")
        st.plotly_chart(fig2)

elif mode == "🔮 Predict Single Match":
    st.header("Predict Single Match Parameters")
    st.markdown("Isolate two exact teams anywhere in the world and run the probability matrix.")
    
    teams = sorted(df["Team"].tolist())
    
    c1, c2 = st.columns(2)
    with c1:
        team1 = st.selectbox("Select Contender 1", teams, index=0)
    with c2:
        team2 = st.selectbox("Select Contender 2", teams, index=1)
        
    if team1 == team2:
        st.warning("Please select distinct operational entities!")
    else:
        allow_draw = st.checkbox("Toggle Valid Draw Output (Friendlies/Groups)")
        
        if st.button("Query Probability Engine", type="primary"):
            p1, p2 = prob_dict[team1], prob_dict[team2]
            with st.spinner("Correlating positional strength matrices..."):
                time.sleep(0.5)
                winner, stats = simulate_match(team1, team2, p1, p2, allow_draw=allow_draw)
            
            st.subheader("Output Vector Return:")
            if winner == 'Draw':
                st.info(f"The matrix predicts a DRAW! ({stats['Draw']}% computed vector margin)")
            elif winner == team1:
                st.success(f"{get_flag(team1)} {team1} asserts dominance! ({stats[team1]}% predictive baseline utilized)")
            else:
                st.success(f"{get_flag(team2)} {team2} asserts dominance! ({stats[team2]}% predictive baseline utilized)")
                
            st.markdown("### Matrix Breakdown")
            stats_df = pd.DataFrame([stats])
            st.bar_chart(stats_df.T)

elif mode == "📂 Explore Dataset vectors":
    st.header("Base Logic Parameters Dataframe")
    st.markdown("These values are procedurally fed or manually read from `fifa_wc2026_UPGRADED.csv`.")
    
    st.dataframe(df, use_container_width=True)
    
    st.subheader("Data Engine Visual Context")
    df_sorted = df.sort_values(by="Predicted_Win_Probability", ascending=False)
    fig = px.bar(df_sorted.head(20), x="Team", y="Predicted_Win_Probability", color="Predicted_Win_Probability",
                 title="Top 20 Nodes Ranked by Raw Base Rating Vectors")
    st.plotly_chart(fig)
