# 🏆 FIFA World Cup 2026 Simulator

A premium full-stack football tournament simulator that recreates the excitement of the **FIFA World Cup 2026** using modern web technologies, predictive logic, and immersive UI design.

This project simulates the full tournament journey — from group stages to knockout rounds — allowing users to explore different outcomes, brackets, and champions in real time.

🌍 Built with **Next.js + FastAPI**, optimized for Desktop, Android, and iOS.

---

## 🚀 Live Demo

### 🌐 Frontend
https://fifa-wcsim2026.vercel.app/

### ⚙️ Backend API
https://fifa-wc2026.onrender.com

---

# ✨ Key Features

## ⚽ Full Tournament Simulation
- 48 national teams
- Group stage match generation
- Automatic standings system
- Top teams qualify for knockouts
- Realistic tournament flow

## 🏆 Knockout Bracket
- Round of 32
- Round of 16
- Quarter Finals
- Semi Finals
- Final Match
- Champion Reveal

## 🎯 Smart Match Prediction
- Team strength based logic
- Upset probability system
- Dynamic score generation
- Randomized realistic outcomes

## 📊 Team Analytics
- Strength comparisons
- Win probability insights
- Tournament progression stats

## 🎆 Winner Celebration
- Trophy showcase
- Country flag display
- Champion text reveal
- Fireworks / confetti effects

## 🎨 Premium UI / UX
- Dark blue neon sports theme
- Responsive design for all devices
- Animated background effects
- Smooth transitions
- Modern sports-tech visuals

---

# 🛠 Tech Stack

## Frontend
- Next.js 14
- React.js
- Tailwind CSS
- Framer Motion
- Recharts

## Backend
- FastAPI
- Python
- NumPy
- Pandas

## Deployment
- Vercel (Frontend)
- Render (Backend)

---

# 📁 Project Structure

```bash
FIFA-WC2026/
│── frontend/
│   ├── src/app/
│   │   ├── groups/
│   │   ├── knockout/
│   │   ├── predict/
│   │   ├── stats/
│   │   ├── page.js
│   │   └── layout.js
│   │
│   ├── public/
│   ├── package.json
│
│── backend/
│   ├── main.py
│   ├── requirements.txt
│
│── README.md
```
## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

git clone https://github.com/NoyalMJ22/FIFA-WC2026.git
cd FIFA-WC2026

## 💻 Frontend Setup

cd frontend
npm install
npm run dev

# Runs at:
# http://localhost:3000

## 🐍 Backend Setup

cd ../backend
pip install -r requirements.txt
uvicorn main:app --reload

# Runs at:
# http://localhost:8000

## 🔑 Environment Variables

# Create frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:8000

# Production:

NEXT_PUBLIC_API_URL=https://fifa-wc2026.onrender.com

## 🧠 Match Simulation Logic

# Team Strength Formula:
# Strength = Attack + Midfield + Defense

# Prediction Engine Uses:
# - Relative team power
# - Random upset chance
# - Score variance
# - Knockout pressure factor

## 📱 Fully Responsive

# Optimized for:
# 💻 Desktop
# 📱 Android
# 🍎 iPhone
# 📲 Tablets

## 🚀 Deployment Guide

# Frontend (Vercel)
# Import GitHub repo
# Root Directory = frontend
# Framework = Next.js

# Backend (Render)
# Create Web Service
# Root Directory = backend

## 📸 Screenshots

# Add screenshots here

## 🌟 Future Improvements

# - Live FIFA Rankings API
# - Real squad database
# - Player stats integration
# - Penalty shootout mode
# - Multiplayer predictions
# - Theme switcher
# - Historical World Cup mode

## 👨‍💻 Author

# Noyal Mathew Jain
# GitHub: https://github.com/NoyalMJ22
# Passionate about AI, Data Science, and building creative real-world products.

## 📄 License

# MIT License

## ⭐ Support

# If you like this project:
# ⭐ Star this repository
# ⚽ Share with football fans
# 🚀 Connect on LinkedIn
# 💡 Fork and improve it

## 🏆 Final Note

# This project combines:
# ✅ Sports
# ✅ AI Logic
# ✅ Full Stack Development
# ✅ UI/UX Design
# ✅ Real Deployment Experience

A perfect showcase project for internships, placements, and portfolio building
