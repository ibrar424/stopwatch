# ⏰ Countdown Pro & Stopwatch (`stopwatch.name`)

A modern, responsive web-based Countdown Timer, Precision Stopwatch, and Chronological Age Calculator built with clean HTML5, CSS3 glassmorphism, and vanilla JavaScript.

## ✨ Features
- **Countdown Timer Pro**:
  - Custom countdown durations in Seconds, Minutes, or Hours
  - One-click quick presets (`+1m`, `+5m`, `+10m`, `🍅 25m Pomodoro`, `+1h`)
  - Live progress bar, browser tab countdown indicator, and audio + WebAudio fallback alerts
  - Pause, Resume, and Stop & Save session history
- **Precision Stopwatch**:
  - Centisecond accuracy (`HH:MM:SS.ms`)
  - Split Lap recording and session saving
- **Saved History & PDF Export**:
  - Persistent `localStorage` session logs with individual entry deletion or full clear
  - Paginated PDF report export via `jsPDF`
- **Age Calculator**:
  - Exact breakdown in Years, Months, and Days
  - Additional metrics: Total Months, Total Weeks, Total Days, and Next Birthday countdown
- **Persistent Dark & Light Theme**:
  - Remembers user preference across all pages (`index.html`, `age_calculator.html`, `about.html`, `contact.html`, `privacy.html`, `terms.html`)

## 🗂 Files Included
- `index.html` — Main Countdown Timer & Stopwatch application
- `age_calculator.html` — Chronological Age Calculator page
- `style.css` — Unified modern UI/UX design system (Dark & Light modes)
- `age_calculator.css` — Age Calculator specific layout styles
- `script.js` — Countdown, Stopwatch, localStorage history, and PDF export logic
- `age_calculator.js` — Date validation, chronological age math, and birthday countdown
- `theme.js` — Persistent Dark/Light theme controller
- `countdown.py` — CLI Python countdown script with input validation

## 🚀 How to Use
1. Open `index.html` in any modern browser.
2. Choose **Countdown** or **Stopwatch** mode, or pick a quick preset chip.
3. Track your session and export your saved logs to PDF anytime!

## 🧑‍💻 Author
Created by **Ibrar**  
GitHub: [@ibrar424](https://github.com/ibrar424)

## 📜 License
This project is licensed under the **MIT License**.
