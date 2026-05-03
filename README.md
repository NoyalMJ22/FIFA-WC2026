<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:00ff87,50:00e5ff,100:7c3aed&height=220&section=header&text=FIFA%20WC%202026%20Simulator&fontSize=44&fontColor=ffffff&fontAlignY=38&desc=48%20Teams.%201%20Trophy.%20Infinite%20Possibilities.&descAlignY=60&descSize=20"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![NumPy](https://img.shields.io/badge/NumPy-Monte%20Carlo-013243?style=for-the-badge&logo=numpy&logoColor=white)](https://numpy.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Live-black?style=for-the-badge&logo=vercel&logoColor=white)](https://fifa-wcsim2026.vercel.app/)
[![Render](https://img.shields.io/badge/Render-API-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://fifa-wc2026.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-ffd700?style=for-the-badge)](LICENSE)

<br/>

> **A full-stack probabilistic FIFA World Cup 2026 simulator.**
> Run 1,000+ tournaments. Get real championship probabilities. No vibes — just math.

<br/>

[🏠 **Home**](https://fifa-wcsim2026.vercel.app/) &nbsp;·&nbsp;
[📊 **Groups**](https://fifa-wcsim2026.vercel.app/groups) &nbsp;·&nbsp;
[⚔️ **Knockout**](https://fifa-wcsim2026.vercel.app/knockout) &nbsp;·&nbsp;
[🧠 **Predict**](https://fifa-wcsim2026.vercel.app/predict) &nbsp;·&nbsp;
[📈 **Stats**](https://fifa-wcsim2026.vercel.app/stats)

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Noyal%20Mathew%20Jain-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/noyal-mathew-jain-551ab730b/)
[![GitHub](https://img.shields.io/badge/GitHub-NoyalMJ22-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NoyalMJ22)

</div>

---

## 🌍 What is this?

Most World Cup predictions are just vibes dressed up as analysis.

This isn't that.

I built a **full-stack probabilistic simulation engine** that runs the entire FIFA World Cup 2026 — 48 teams, 12 groups, and the complete knockout bracket — and lets you simulate it as many times as you want.

Run it once → one champion.
Run it **1,000 times** → the truth emerges.

Every simulation is independent. Every tournament tells a different story. Giants crash out. Underdogs make finals. No team wins every time — because that's football.

---

## 🖥️ App Pages

The app has 5 pages — matching the navbar exactly:

| Icon | Page | Description |
|------|------|-------------|
| 🏠 | [**Home**](https://fifa-wcsim2026.vercel.app/) | Hero, countdown to June 11, feature cards |
| 📊 | [**Groups**](https://fifa-wcsim2026.vercel.app/groups) | 12 groups × 4 teams, full round-robin standings |
| ⚔️ | [**Knockout**](https://fifa-wcsim2026.vercel.app/knockout) | Animated bracket R32 → Final + confetti champion reveal |
| 🧠 | [**Predict**](https://fifa-wcsim2026.vercel.app/predict) | Head-to-head match predictor for any 2 teams |
| 📈 | [**Stats**](https://fifa-wcsim2026.vercel.app/stats) | Monte Carlo engine — 1,000+ sim championship probabilities |

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🏟️ Group Stage Simulator**
Full round-robin across 12 groups × 4 teams. Real standings with W/D/L, goal difference, and points. Top 2 + best 8 third-placed teams advance.

**⚔️ Knockout Bracket**
Full animated symmetric bracket — R32 → R16 → QF → SF → Final. Mirrors a real tournament draw with left/right sides.

**🎲 Monte Carlo Engine**
Run 1,000+ complete tournaments back-to-back. Get empirical championship probabilities for every team. Not rankings — actual math.

</td>
<td width="50%">

**🧠 Head-to-Head Predictor**
Pick any 2 teams. Instant probability breakdown. Toggle group stage draw rules on/off.

**🎨 Premium UI**
Glassmorphism cards · Neon glows · Animated bracket · Confetti + fireworks on champion reveal · Real flags for all 48 nations.

**📈 Analytics Dashboard**
Bar charts · Donut charts · Top-3 podium · Full results table · Auto-generated key insights.

</td>
</tr>
</table>

---

## 🧠 How the Simulation Engine Works

### 1️⃣ Head-to-Head Probability Normalization
```python
# Raw ratings only matter RELATIVE to the opponent
p1 = prob1 / (prob1 + prob2)
p2 = prob2 / (prob1 + prob2)
```

### 2️⃣ Draw Modeling (Group Stage Only)
```python
# Closer teams = higher draw chance. Mirrors real football.
draw_chance = max(0.05, 0.30 - abs(p1 - p2))
```

### 3️⃣ Monte Carlo Championship Analysis
```python
# Run N full tournaments. Count who wins each time.
for _ in range(iterations):
    result = simulate_full_tournament()
    champion_counts[result["champion"]] += 1

# France winning 20/100 sims > any pundit's opinion
```

### 4️⃣ Team Strength Tiers

| Tier | Probability | Teams |
|------|-------------|-------|
| 🔴 Elite | 0.70 – 0.95 | Argentina, Brazil, France, England, Spain, Germany, Portugal |
| 🟡 Contender | 0.45 – 0.70 | Netherlands, Croatia, USA, Mexico, Colombia, Denmark |
| 🟢 Underdog | 0.10 – 0.45 | Everyone else — upsets always happen |

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| **FastAPI** | REST API framework |
| **Python 3.11** | Core language |
| **NumPy** | Weighted random simulation |
| **Pandas** | Data loading & processing |
| **Uvicorn** | ASGI server |
| **Render** | Cloud deployment |

### Frontend
| Tool | Purpose |
|------|---------|
| **Next.js 14** | App Router, client components |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Entrance/exit animations |
| **Recharts** | Bar + donut charts |
| **canvas-confetti** | Champion reveal 🎊 |
| **Lucide React** | Icons |
| **Vercel** | Cloud deployment |

---

## 🚀 Run it Locally

### Prerequisites
- Node.js 18+
- Python 3.9+

### 1. Clone
```bash
git clone https://github.com/NoyalMJ22/FIFA-WC2026.git
cd FIFA-WC2026
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 4. Environment
```bash
# Create frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> The production API is already live — the frontend works out of the box without local backend setup.

---

## 📁 Project Structure

```
FIFA-WC2026/
│
├── backend/                          # FastAPI backend (ACTIVE)
│   ├── main.py                       # All API endpoints + CORS
│   ├── engine.py                     # Probabilistic match simulation
│   ├── groups.py                     # Group stage round-robin logic
│   ├── knockout.py                   # Knockout bracket generator
│   ├── utils.py                      # Data loading, flag URLs, helpers
│   ├── requirements.txt
│   └── data/
│       └── fifa_wc2026_UPGRADED.csv  # 48-team dataset
│
└── frontend/                         # Next.js 14 frontend (ACTIVE)
    └── src/
        ├── app/
        │   ├── page.js               # 🏠 Home
        │   ├── groups/page.js        # 📊 Groups
        │   ├── knockout/page.js      # ⚔️ Knockout
        │   ├── predict/page.js       # 🧠 Predict
        │   └── stats/page.js         # 📈 Stats
        ├── components/
        │   ├── KnockoutBracket.js    # Full bracket (mobile/tablet/desktop)
        │   ├── PremiumMatchCard.js   # Individual match cards
        │   ├── GroupCard.js          # Group standings cards
        │   └── TrophySection.js      # Trophy + winner display
        └── lib/
            ├── api.js                # Centralized API client
            └── teamFlags.js          # Flag URLs + 3-letter FIFA codes
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/teams` | All 48 teams with group, probability, flag |
| `GET` | `/api/team-stats` | Teams sorted by win probability |
| `POST` | `/api/predict-match` | `{ team1, team2, allow_draw }` |
| `POST` | `/api/simulate-group-stage` | Full group stage simulation |
| `POST` | `/api/simulate-tournament` | Complete tournament (groups + knockout) |
| `POST` | `/api/monte-carlo` | `{ iterations: 100 }` → championship % per team |

---

## 🌐 Deployment

| Layer | Platform | URL |
|-------|----------|-----|
| Frontend | Vercel | [fifa-wcsim2026.vercel.app](https://fifa-wcsim2026.vercel.app/) |
| Backend API | Render | [fifa-wc2026.onrender.com](https://fifa-wc2026.onrender.com) |

---

## 🔮 What's Next

- [ ] Live FIFA Rankings API integration
- [ ] Player-level squad database
- [ ] Penalty shootout simulation
- [ ] Share your bracket on social media
- [ ] Dark / light theme toggle

---

## 💡 What Building This Taught Me

- **End-to-end ownership** — data layer → API → UI → deployment is a completely different skill than just modeling
- **Probabilistic thinking is everywhere** — not just in Kaggle notebooks
- **Ship fast** — a live product beats a perfect local one every time
- **Data should look good** — people engage with things that are beautiful

---

## 👤 Author

<div align="center">

**Noyal Mathew Jain**
Student · ML & Data Science Enthusiast · Builder

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Noyal%20Mathew%20Jain-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/noyal-mathew-jain-551ab730b/)
[![GitHub](https://img.shields.io/badge/GitHub-NoyalMJ22-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NoyalMJ22)
[![Live App](https://img.shields.io/badge/Live%20App-Visit-00ff87?style=for-the-badge&logo=vercel&logoColor=black)](https://fifa-wcsim2026.vercel.app/)

*Open to ML / Data Science / Software Engineering roles.*
*I don't just study this — I build it, ship it, deploy it.*

</div>

---

## 📄 License

MIT License — free to use, modify, and share.

---

<div align="center">

**If this project impressed you, drop a ⭐ — it helps more than you think.**

*The World Cup kicks off June 11, 2026.*
*My simulator has been ready. Has yours?* ⚽🏆

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:7c3aed,50:00e5ff,100:00ff87&height=120&section=footer"/>

</div>
