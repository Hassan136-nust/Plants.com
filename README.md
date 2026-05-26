# 🌿 Zia Nursery — Full-Stack Plant E-Commerce

A full-stack plant nursery e-commerce app built with React, Node.js/Express, MongoDB, and deployed on Vercel.

**Live:** [zia-nursery.vercel.app](https://zia-nursery.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Image Storage | Cloudinary |
| Deployment | Vercel (monorepo — frontend + serverless API) |
| Auth | JWT (jsonwebtoken + bcryptjs) |

---

## Features

- **Plant catalogue** — browse, search, and filter by category
- **3D carousel** — featured plants showcase on the homepage
- **Cart** — persistent cart synced to DB for logged-in users, localStorage for guests. Prices always fetched fresh from DB on load to prevent stale data
- **Checkout** — 70% advance payment flow with Easypaisa/Jazzcash receipt upload (stored on Cloudinary)
- **Auth** — register/login with JWT, role-based access (user / admin)
- **Admin dashboard** — manage orders (view items, delivery info, confirm), manage plant inventory (add/edit/delete with Cloudinary image upload)
- **Contact form** — customer enquiry route

---

## Project Structure

```
Plants.com/
├── api/
│   └── index.js          # Vercel serverless entry — wraps Express app
├── backend/
│   ├── models/           # Mongoose models (User, Plant, Order)
│   ├── routes/           # Express routes (auth, plants, orders, cart, upload, contact)
│   ├── middleware/        # JWT auth middleware
│   └── server.js         # Express app setup
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Footer, CartDrawer, PlantCarousel, AuthModal
│   │   ├── context/      # AuthContext, CartContext
│   │   ├── pages/        # Home, Plants, Checkout, Admin, MyOrders, About, Contact
│   │   └── utils/        # price.js helpers
│   └── index.html
├── vercel.json           # Routing: /api/* → serverless, /* → SPA
└── package.json          # Root — contains all backend dependencies for Vercel
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (free tier)

### 1. Clone and install

```bash
git clone <repo-url>
cd Plants.com
npm run install-all   # installs both backend and frontend deps
```

### 2. Configure environment

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/plants
JWT_SECRET=your_jwt_secret_here
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env.local`:

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

Frontend: `http://localhost:5173` — Backend: `http://localhost:5001`

---

## Deployment (Vercel)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full step-by-step guide.

**Required Vercel environment variables:**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any secure random string |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `FRONTEND_URL` | `https://zia-nursery.vercel.app` |
| `VITE_API_URL` | `https://zia-nursery.vercel.app` |

---

## Admin Access

Set a user's `role` field to `"admin"` directly in MongoDB Atlas to grant admin access. The admin panel is at `/admin`.

---

## Key Design Decisions

- **Monorepo on Vercel** — `api/index.js` wraps the Express app as a single serverless function. `vercel.json` routes all `/api/*` traffic to it and falls back to `index.html` for the SPA via `"handle": "filesystem"`.
- **Cloudinary for uploads** — Vercel's filesystem is read-only, so `multer` disk storage doesn't work. Both plant images and payment receipts upload directly to Cloudinary via `multer-storage-cloudinary`.
- **Cart price integrity** — On every page load, `CartContext` fetches the live plant catalogue and patches all cart items with fresh prices (by ID, with name-based fallback for post-reseed scenarios). This prevents stale/corrupted prices from localStorage ever reaching checkout.
- **Price parsing** — All prices are stored as strings like `"Rs. 2,500"` in MongoDB. `parsePrice()` in `utils/price.js` strips non-numeric characters and returns a plain number. No scaling logic.
