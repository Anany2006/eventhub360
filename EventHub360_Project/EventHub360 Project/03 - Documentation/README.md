# 🏢 EventHub360 — Employee Management System

A fully self-contained, single-file Employee Management System with an analytics dashboard, attendance tracking, salary reports, and multi-axis filtering. No backend, no build step — just open the HTML file in any browser.

---

## 📁 Folder Contents

```
EMS Final Task/
├── eventhub360-dashboard.html   ← Main application (open this in browser)
└── README.md                    ← You are here
```

---

## ✨ Features

### 🔐 Login & Auth System
- Sign In with email + password (persisted via localStorage)
- Sign Up with name, domain, role, city, and password strength indicator
- One-click **Demo Login (Admin)** for instant access
- Session persists across page refresh; Sign Out clears session

### 📊 5 Pages via Sidebar
| Page | Description |
|------|-------------|
| **Overview** | 4 KPI cards + 3 summary charts |
| **Students** | Full directory with live search & 4-axis filters |
| **Attendance** | Register with Present / Absent / Late / Leave per employee |
| **Salary Report** | Full salary sheet — Base + Bonus − Deductions = Net Pay |
| **Analytics** | 5 dedicated interactive charts |

### 📈 5 Interactive Charts (Chart.js)
1. **Domain Distribution** — Doughnut chart (AI/ML, SE, HR, Data Analytics, Cybersecurity, Cloud)
2. **Work Mode Breakdown** — Pie chart (Offline / Hybrid / Online)
3. **Attendance Overview** — Bar chart (total Present / Absent / Late / Leave days)
4. **Avg Salary by Domain** — Horizontal bar chart
5. **Employees by City** — Column bar chart (10 cities)

### 🔍 Filter System
- **Name** — Live search (keystroke-by-keystroke)
- **Domain** — AI/ML, Software Engineer, HR, Data Analytics, Cybersecurity, Cloud Computing
- **Work Mode** — Offline, Hybrid, Online
- **City** — 10 cities across India
- **Status** — Present, Absent, Late, Leave

All filters work in combination and update the table + badge count instantly.

### 💰 Salary Module
- Formula: `Base Salary + Attendance Bonus − Deductions = Net Pay`
- Summary cards for Total Base Payroll, Total Bonuses, Total Net Payroll
- Attendance % progress bars colour-coded (green / amber / red)

---

## 🚀 How to Run

1. Download or clone this repository
2. Open `eventhub360-dashboard.html` in any browser (Chrome, Firefox, Edge)
3. Use **Demo Login (Admin)** to enter instantly, or create a new account via Sign Up

> ✅ No internet required after the first load. No installation. No build step.

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 / CSS3 | Single-file architecture, Flexbox/Grid layout |
| Vanilla JavaScript (ES6) | All logic — zero frameworks, zero dependencies |
| Chart.js (CDN) | 5 interactive chart types |
| localStorage | Auth session persistence |

---

## 👤 Sample Credentials

After signing up, you can log in with your own credentials. Or use:

> **Demo Login (Admin)** button on the login screen — no account needed.

To create an account manually:
- **Email:** `anany@eventhub360.com`
- **Password:** `Anany@123`
- **Domain:** AI / ML | **Role:** Admin | **City:** Indore

---

## 📂 GitHub Repository

[github.com/Anany2006/eventhub360](https://github.com/Anany2006/eventhub360)

---

## 👨‍💻 Author

**Anany Pandit** — Built as part of the EventHub360 project.
