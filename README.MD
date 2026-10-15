<div align="center">

# 🌌 ORBIT

### Your Personal Productivity Dashboard

**Manage your tasks, notes, and habits — all pulled into one calm center.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Demo](#-live-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [JS Concepts](#-javascript-concepts-used)

</div>

---

## 📖 About The Project

**ORBIT** is a **fully client-side** personal productivity dashboard with a space-themed design. It helps you organize your daily life by managing three core areas:

- ✅ **Tasks** — plan, prioritize, and track what needs to get done
- 📝 **Notes** — capture ideas, thoughts, and reminders
- ❤️ **Habits** — build consistency by tracking daily routines

Every user gets their **own private space** with **hashed passwords**, **per-user data**, and a clean, distraction-free interface. No backend, no signup on server, no tracking — everything runs **entirely in your browser**.

---

## ✨ Features

### 🔐 Authentication System
- User registration with **SHA-256 password hashing**
- Secure login with password verification
- Per-user data isolation (each user sees only their own data)
- "Remember Me" for email auto-fill
- Session-based login (auto logout on tab close)
- Page protection via **Guard system**

### 🎯 Task Management
- ➕ Create, ✏️ edit, 🗑️ delete tasks
- 🎨 **Priority levels** (Low / Medium / High) with color-coded badges
- 📅 **Due dates** with smart formatting ("Today", "Tomorrow", "Overdue")
- 🔍 **Live search** across title and description
- 🔀 **Sort** by Newest, Oldest, A-Z, Z-A
- 🎯 **Filter** by status (All / Pending / Completed)

### 📝 Notes
- ✍️ Rich notes with title + content
- 📌 **Pin important notes** to the top
- 🏷️ **5 categories** (Personal, Work, Ideas, Study, Other) with emoji icons
- 👁️ **Full-screen viewer** for reading
- 🔍 **Real-time search**
- ⏰ **Time-ago format** ("Just now", "5m ago", "2d ago")
- 🔢 **Character counter** (max 2000 chars)

### ❤️ Habit Tracking
- 📅 **Weekly tracker** (Monday → Sunday)
- 🔥 **Streak calculation** (consecutive days)
- 📊 **Progress bar** per habit
- 🎨 **Icon picker** (8 icons) and **Color picker** (6 colors)
- 🎯 **Weekly goals** (1-7 days per week)
- 🌟 **Today's progress banner** with motivational messages

### 🌓 Universal Features
- 🌙 **Dark / Light Mode** with localStorage persistence
- ⭐ **Animated starfield** background
- 📱 **Fully responsive** (mobile, tablet, desktop)
- ⌨️ **Keyboard shortcuts** (Ctrl+D/T/N/H/K, Escape)
- 🔔 **Notifications** panel with live data
- ⚙️ **Settings** modal with data management
- 📊 **Statistics** overview
- 👤 **Profile** page with avatar generator
- 💾 **LocalStorage** for data persistence
- 🎨 **Glassmorphism** design
- 🔒 **XSS protection** with HTML escaping
- 🎭 **SweetAlert2** for elegant modals

---

## 🎬 Live Demo

🔗 **[Try ORBIT Live](https://roqia-23.github.io/Orbit-dashboard/)**

### Quick Start

```
1. Click "Launch Your Orbit" on the welcome page
2. Sign up with your name, email, and password
3. Login with your credentials
4. Start managing your tasks, notes, and habits!
```

---

## 🚀 Installation

### Option 1: Clone the Repository

```bash
git clone https://github.com/roqia-23/Orbit-dashboard.git
cd Orbit-dashboard
```

### Option 2: Download ZIP

1. Click the green **Code** button
2. Select **Download ZIP**
3. Extract the folder

### Run Locally

Simply open `index.html` in your browser:

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

**That's it!** No build step required. 🎉

---

## 🎮 Usage

### 1️⃣ Create an Account

```
1. Open index.html → Click "Launch Your Orbit"
2. Click "Sign Up" tab
3. Enter:
   - Full Name: Ali Ahmad
   - Email: ali@example.com
   - Password: 123456
   - Confirm Password: 123456
4. Check "I agree to the Terms"
5. Click "Create Account"
6. You'll be redirected to Login → Enter password again
7. Welcome to your Dashboard!
```

### 2️⃣ Adding a Task

```
1. Go to Tasks page
2. Click "+ Add Task"
3. Fill in:
   - Title: "Design new logo" (required)
   - Description: "Create 3 variations" (optional)
   - Priority: High
   - Due Date: pick a date
4. Click "Save Task"
```

### 3️⃣ Writing a Note

```
1. Go to Notes page
2. Click "+ New Note"
3. Fill in:
   - Title: "Meeting notes" (required)
   - Content: "Discuss project timeline..." (required)
   - Category: Work
   - ☑ Pin this note (optional)
4. Click "Save Note"
```

### 4️⃣ Creating a Habit

```
1. Go to Habits page
2. Click "+ Add Habit"
3. Fill in:
   - Name: "Exercise" (required)
   - Icon: 🏃 dumbbell
   - Color: 🔵 Blue
   - Weekly Goal: 5 days
4. Click "Save Habit"
5. Click on any day box to mark complete
```

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + D` | Go to **Dashboard** |
| `Ctrl + T` | Go to **Tasks** |
| `Ctrl + N` | Go to **Notes** |
| `Ctrl + H` | Go to **Habits** |
| `Ctrl + K` | Focus on **Search bar** |
| `Esc` | Close any open modal |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup |
| **CSS3** | Custom properties, Grid, Flexbox, Animations |
| **JavaScript (ES6+)** | Vanilla JS — no frameworks |
| **Bootstrap 5** | Responsive grid, utilities |
| **Font Awesome 6** | Icons |
| **Google Fonts** | Inter + Space Grotesk |
| **SweetAlert2** | Elegant popup modals |
| **Web Crypto API** | SHA-256 password hashing |
| **LocalStorage API** | Client-side data persistence |
| **SessionStorage API** | Session management |

---

## 📂 Project Structure

```
Orbit-dashboard/
│
├── index.html                  # Welcome page
├── auth.html                   # Login + Signup (with tabs)
├── dashboard.html              # Main dashboard
├── tasks.html                  # Task management
├── notes.html                  # Notes management
├── habits.html                 # Habit tracking
├── profile.html                # User profile
├── README.md
├── LICENSE
│
└── assets/
    │
    ├── css/
    │   ├── style.css           # Global styles (all pages)
    │   ├── theme.css           # Dark/Light theme
    │   └── dropdown-fix.css    # Custom dropdown styles
    │
    ├── js/
    │   ├── app.js              # Global: starfield, modals, sidebar, dashboard
    │   ├── theme.js            # Dark/Light theme manager
    │   ├── auth.js             # Login + Signup logic (SHA-256)
    │   ├── guard.js            # Page protection
    │   ├── profile-avatar.js   # Avatar generator
    │   ├── tasks.js            # Tasks CRUD
    │   ├── notes.js            # Notes CRUD
    │   ├── habits.js           # Habits tracker
    │   ├── profile.js          # Profile page logic
    │   └── typing.js           # Welcome page typing effect
    │
    └── images/
        └── logo.svg            # ORBIT logo
```

---

## 🧠 JavaScript Concepts Used

This project is a **masterclass in vanilla JavaScript**. Here are the concepts used:

### Variables & Types
- `let` / `const`
- Data types: String, Number, Boolean, Object, Array, null, undefined
- Template literals (`` `${variable}` ``)

### Functions
- Regular functions
- **Arrow functions** (`() => {}`)
- **IIFE** (Immediately Invoked Function Expression)
- **Async / Await** (for SHA-256 hashing)

### Arrays & Methods
- `forEach()`, `map()`, `filter()`, `find()`, `reduce()`
- `sort()`, `reverse()`, `slice()`, `push()`, `join()`
- Spread operator (`[...array]`)

### Objects
- Object literals
- Destructuring
- Dynamic property access (`obj[key]`)

### Control Flow
- `if / else if / else`
- `switch / case`
- Ternary operator (`condition ? a : b`)
- Short-circuit evaluation (`||`, `&&`)

### DOM Manipulation
- `getElementById`, `querySelector`, `querySelectorAll`
- `createElement`, `appendChild`, `remove`
- `innerHTML`, `textContent`
- `classList.add / remove / toggle / contains`

### Events
- `addEventListener()` — click, input, change, submit, keydown, resize
- `e.preventDefault()`
- `e.target`
- Event delegation
- `stopPropagation()`

### LocalStorage & SessionStorage
- `setItem()`, `getItem()`, `removeItem()`
- `JSON.stringify()` / `JSON.parse()`

### Date & Time
- `new Date()`, `Date.now()`
- `.toISOString()`, `.toLocaleDateString()`
- `setHours()`, `setDate()`

### Advanced
- **Web Crypto API** (`crypto.subtle.digest`)
- **TextEncoder** (string → bytes)
- **ArrayBuffer / Uint8Array**
- **Promises** with async/await
- **Regular Expressions** (email validation, password strength)
- **Optional Chaining** (`?.`)

---

## 🔐 Security Notes

### What we do well ✅
- **SHA-256 password hashing** — passwords never stored in plain text
- **Salt** added before hashing
- **XSS protection** via `escapeHtml()`
- **Session-based login** — auto logout on tab close
- **Guard system** — prevents unauthorized page access

### ⚠️ Educational limitations
- **Client-side only** — no real backend
- **SHA-256 is fast** — bcrypt/Argon2 are better for production
- **localStorage is not encrypted**
- **No password recovery** — hashes can't be reversed (by design)

> 💡 This project is for **educational purposes**. For production, use a real backend with proper authentication.

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| ✅ Chrome / Edge | 90+ |
| ✅ Firefox | 88+ |
| ✅ Safari | 14+ |

---

## 🗺️ Roadmap

### ✅ v1.0.0 — Current
- [x] Welcome page with orbit animation
- [x] Authentication (Signup + Login)
- [x] SHA-256 password hashing
- [x] Dashboard with stats
- [x] Tasks CRUD
- [x] Notes CRUD + pin + categories
- [x] Habits tracker + streak
- [x] Profile page + avatar
- [x] Dark/Light theme
- [x] Keyboard shortcuts
- [x] Responsive design

### 🔜 v1.1.0 — Planned
- [ ] Statistics charts (Chart.js)
- [ ] Pomodoro focus timer
- [ ] Data export (JSON)
- [ ] Multi-language support

### 🔮 v2.0.0 — Future
- [ ] Backend with Node.js
- [ ] Real database
- [ ] bcrypt password hashing
- [ ] JWT authentication
- [ ] PWA support

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Roqia**

- 🐙 GitHub: [@roqia-23](https://github.com/roqia-23)
- 🌐 Project: [Orbit-dashboard](https://github.com/roqia-23/Orbit-dashboard)

---

<div align="center">

### ⭐ If you like this project, give it a star! ⭐

**Made with ❤️ and vanilla JavaScript**

**[⬆ Back to Top](#-orbit)**

</div>