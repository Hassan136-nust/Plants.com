<div align="center">

# 🌿 Zia Nursery

### A full-stack plant e-commerce web app

[![Live Demo](https://img.shields.io/badge/Live%20Demo-zia--nursery.vercel.app-4ade80?style=for-the-badge&logo=vercel&logoColor=white)](https://zia-nursery.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛍️ **Plant Catalogue** | Browse, search and filter plants by category |
| 🎠 **3D Carousel** | Animated featured plants showcase on homepage |
| 🛒 **Smart Cart** | Persistent cart — synced to DB for logged-in users, localStorage for guests. Prices always refreshed from DB on load |
| 💳 **Checkout** | 70% advance payment via Easypaisa/Jazzcash with receipt upload |
| 🔐 **Auth** | JWT register/login with role-based access (user / admin) |
| 🌱 **Admin CMS** | Add/edit/delete plants with Cloudinary image upload |
| 📋 **Order Management** | Admin can view full order details, items, delivery info and confirm orders |
| 📦 **My Orders** | Customers can track their order history and status |

---

## 🖥️ Tech Stack

```
Frontend          Backend           Infrastructure
─────────         ─────────         ──────────────
React 18          Node.js           Vercel (monorepo)
Vite              Express           MongoDB Atlas
React Router      Mongoose          Cloudinary
Context API       JWT / bcryptjs    multer-storage-cloudinary
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (free tier)

### 1. Clone & install

```bash
git clone <repo-url>
cd Plants.com
npm run install-all
```

### 2. Configure environment

**`backend/.env`**
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/plants
JWT_SECRET=your_secure_secret_here
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env.local`**
```env
VITE_API_URL=http://localhost:5001
```

### 3. Run

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

- Frontend → `http://localhost:5173`
- Backend → `http://localhost:5001`

---

## 📁 Project Structure

```
Plants.com/
├── api/
│   └── index.js              # Vercel serverless entry (wraps Express)
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (with embedded cart)
│   │   ├── Plant.js          # Plant schema
│   │   └── Order.js          # Order schema (items + priceNum)
│   ├── routes/
│   │   ├── auth.js           # Register / Login / Me
│   │   ├── plants.js         # CRUD + Cloudinary upload
│   │   ├── orders.js         # Place order / admin view / confirm
│   │   ├── cart.js           # Sync cart to DB
│   │   ├── upload.js         # Receipt upload → Cloudinary
│   │   └── contact.js        # Contact form
│   ├── middleware/
│   │   └── auth.js           # JWT protect middleware
│   └── server.js             # Express app + MongoDB connect
├── frontend/
│   └── src/
│       ├── components/       # Navbar, Footer, CartDrawer, PlantCarousel, AuthModal, Layout
│       ├── context/          # AuthContext, CartContext
│       ├── pages/            # Home, Plants, Checkout, Admin, MyOrders, About, Contact
│       └── utils/
│           └── price.js      # parsePrice / formatRupee helpers
├── vercel.json               # Routes: /api/* → serverless, /* → SPA fallback
└── package.json              # Root — backend deps for Vercel install
```

---

## ☁️ Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step Vercel guide.

**Required Vercel environment variables:**

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any secure random string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard |
| `FRONTEND_URL` | Your Vercel deployment URL |
| `VITE_API_URL` | Your Vercel deployment URL |

> ⚠️ After adding env vars, you must **redeploy** — Vercel doesn't auto-redeploy on env changes.

---

## 🔑 Admin Access

To make a user an admin, set their `role` field to `"admin"` directly in MongoDB Atlas. The admin panel is accessible at `/admin`.

---

## 🏗️ Key Architecture Decisions

**Monorepo on Vercel**
`api/index.js` wraps the Express app as a single serverless function. `vercel.json` routes all `/api/*` traffic to it, uses `"handle": "filesystem"` to serve static assets, then falls back to `index.html` for React Router.

**Cloudinary for all uploads**
Vercel's filesystem is read-only — `multer` disk storage fails silently. Both plant images and payment receipts go directly to Cloudinary via `multer-storage-cloudinary` and are stored as permanent URLs.

**Cart price integrity**
On every page load, `CartContext` fetches the live plant catalogue from `/api/plants` and patches all cart items with fresh prices — by ID first, then by name as a fallback (handles post-reseed ID changes). This means `item.plant.price` is always the current DB value by the time anything renders.

**Order amount accuracy**
Each order item stores both `price` (original string e.g. `"Rs. 2,500"`) and `priceNum` (parsed integer `2500`). The backend recalculates `totalAmount` server-side on every order, stripping currency symbols before parsing.

---

<div align="center">

Made with 🌱 by Hassan

</div>
