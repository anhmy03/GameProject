# 🎮 Game Store Web App

A full-stack digital game store built with Node.js, Express, and SQLite. Users can browse, search, and purchase games. Admins can upload, add, edit, and manage product listings. The platform supports digital delivery through email (no physical shipping required).

---

## 📘 Introduction

This project simulates a real online game shop where users can log in, browse games by category, add items to cart, choose a payment method, and complete a digital checkout. Admins can manage the product catalog with a dedicated admin panel that supports manual and bulk uploads.

---

## 🛠️ Requirements

Before running the app, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [SQLite3 CLI (optional)](https://www.sqlite.org/download.html) (for DB inspection)
- A modern web browser

---

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/game-store.git
cd game-store
```

2. **Install dependencies:**
```bash
npm install
```

3. **Ensure folders exist:**
```bash
mkdir -p public/images uploads
```

4. **Initialize the database:**

Use the provided SQL schema to create the tables in `games.db`. Place it under `.data/games.db` (already handled by the app).

---

## 🚀 Running the App

Start the server using:

```bash
nodemon server.js
```

Visit the app at:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 First Route to Access

To begin using the app:

- Navigate to: [http://localhost:3000/login](http://localhost:3000/login)
- Sign up as a new user at: [http://localhost:3000/signup](http://localhost:3000/signup)
- The first registered user can be set as admin manually via SQL:
```sql
INSERT INTO admins (user_id) VALUES (1);
```

---

## 📚 Features

### ✅ User Features
- Manual login/logout system with sessions
- Browse all games and search by category or title
- Add, remove, and update items in cart
- Select or add payment method
- View order history and re-purchase

### 🔐 Admin Features
- Admin-only navigation and views
- Add new game manually
- Edit/delete any game
- Upload game data via JSON file
- Filter/search product listings
- No image hosting needed — supports uploads to `/public/images`

---



## 📤 Bulk Upload Format

The admin can upload a `.json` file via `/admin/upload` in this format:

```json
[
  {
    "title": "Cyberpunk 2077",
    "price": 49.99,
    "genre": "RPG",
    "platform": "PC",
    "developer": "CD Projekt",
    "release_date": "2020-12-10",
    "category": "RPG",
    "image": "/images/cyberpunk.jpg"
  }
]
```

Place image files in `/public/images`.

---

## 🎯 Future Improvements

- Integrate PayPal for real payment
- Email confirmation after checkout
- Game rating and review system
- Admin analytics dashboard

---

## 👨‍💻 Author

Developed by **Viet Nguyen**  
University Project – CSC 372  
Instructor: *Mrs. Sunny*