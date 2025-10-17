# ☕ Coffee & Code — Repository Overview

Welcome to **Coffee & Code**, a community-driven platform where developers can create, share, and join coding & coffee meetups.  
This repository contains the **frontend source code** and supporting documentation for deployment, setup, and developer reference.

---
🌐 Live Site

You can explore the deployed version of Coffee & Code here:
👉 https://coffeeandcode-events.netlify.app/
---

## 📁 Repository Structure

```
coffee-and-code/
├── frontend/          # Main React (Vite) application
│   ├── src/           # Components, pages, hooks, Firebase setup
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Full feature documentation
│
├── README.md          # This overview file

```

---

## 🚀 Quick Start

1️⃣ Clone the repository
```bash
git clone https://github.com/alicelebarbieri/coffee-and-code.git
cd coffee-and-code/frontend
```

2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Run the app locally
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 📄 Documentation

- 🧩 **[Frontend README](./frontend/README.md)** — Full instructions, setup guide, and feature list  

---

## ☁️ Deployment

The production build is generated inside `frontend/dist`:
```bash
cd frontend
npm run build
```

You can deploy that folder to:
- **Netlify**
- **Render**
- **Vercel**
- or any static hosting platform.

---

## 🧑‍💻 Author

**Alicele Barbieri**  
💼 Junior Full-Stack Developer  
🌐 [LinkedIn](https://linkedin.com/in/alicele-barbieri)

