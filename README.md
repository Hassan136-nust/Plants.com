# 🌿 Zia Nursery Farm

A full-stack e-commerce web application for a plant nursery, featuring a modern React frontend and a robust Node.js/Express backend with MongoDB.

![Plants.com](plants.png)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🌟 Overview

Zia Nursery Farm is a comprehensive e-commerce platform designed for plant enthusiasts. The application allows users to browse plants, manage their shopping cart, place orders, and includes an admin panel for managing inventory. Built with modern web technologies, it provides a seamless shopping experience with responsive design and interactive UI components.

## ✨ Features

### Customer Features
- **Browse Plants**: View a comprehensive catalog of plants with images, descriptions, and pricing
- **Interactive Carousel**: Hero section with keyboard navigation, touch/swipe support, and auto-play
- **Shopping Cart**: Add/remove items, adjust quantities, and view cart totals
- **User Authentication**: Secure registration and login system with JWT tokens
- **Order Management**: Place orders and view order history
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Admin Features
- **Plant Management**: Add, edit, and delete plants from the catalog
- **Image Upload**: Upload plant images with preview functionality
- **Order Overview**: View and manage customer orders
- **Protected Routes**: Admin-only access to management features

## 🛠 Tech Stack

### Frontend
- **React 19.2.6** - UI library
- **React Router DOM 7.15.1** - Client-side routing
- **Vite 8.0.12** - Build tool and dev server
- **CSS3** - Styling with modern features
- **ESLint** - Code linting and quality

### Backend
- **Node.js** - Runtime environment
- **Express 4.22.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.24.0** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Plants.com/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Plant.js             # Plant schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── plants.js            # Plant CRUD routes
│   │   ├── cart.js              # Cart management routes
│   │   ├── orders.js            # Order routes
│   │   └── upload.js            # Image upload routes
│   ├── uploads/
│   │   └── plants/              # Plant images storage
│   ├── server.js                # Express server setup
│   ├── seed.js                  # Database seeding script
│   ├── package.json
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── plants.png
│   ├── src/
│   │   ├── assets/              # Static assets
│   │   ├── components/
│   │   │   ├── AuthModal.jsx   # Login/Register modal
│   │   │   ├── CartDrawer.jsx  # Shopping cart drawer
│   │   │   ├── Footer.jsx      # Footer component
│   │   │   ├── Layout.jsx      # Main layout wrapper
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   └── PlantCarousel.jsx # Interactive carousel
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   └── CartContext.jsx # Cart state management
│   │   ├── data/
│   │   │   └── constants.jsx   # App constants
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Landing page
│   │   │   ├── PlantsPage.jsx  # Plant catalog
│   │   │   ├── AboutPage.jsx   # About page
│   │   │   ├── ContactPage.jsx # Contact page
│   │   │   ├── CheckoutPage.jsx # Checkout flow
│   │   │   └── AdminPage.jsx   # Admin dashboard
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   ├── App.css             # Global styles
│   │   └── index.css           # Base styles
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account or local MongoDB instance

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Plants.com
```

#### 2. Backend Setup

```powershell
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/zia-nursery
PORT=5001
JWT_SECRET=your_jwt_secret_key_here
```

Seed the database with sample data:

```powershell
node seed.js
```

Start the backend server:

```powershell
npm start
# or for development with auto-reload
npm run dev
```

The API will be available at `http://localhost:5001`

#### 3. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the next available port)

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Plant Endpoints

#### Get All Plants
```http
GET /api/plants
```

#### Get Single Plant
```http
GET /api/plants/:id
```

#### Create Plant (Admin)
```http
POST /api/plants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Monstera Deliciosa",
  "scientificName": "Monstera deliciosa",
  "category": "Indoor",
  "price": 29.99,
  "description": "Beautiful tropical plant",
  "careLevel": "Easy",
  "light": "Bright indirect",
  "water": "Weekly",
  "imageUrl": "/uploads/plants/monstera.jpg"
}
```

#### Update Plant (Admin)
```http
PUT /api/plants/:id
Authorization: Bearer <token>
```

#### Delete Plant (Admin)
```http
DELETE /api/plants/:id
Authorization: Bearer <token>
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "plantId": "60d5ec49f1b2c72b8c8e4f1a",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/:plantId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/:plantId
Authorization: Bearer <token>
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [...],
  "totalAmount": 99.99,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701"
  }
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

#### Get All Orders (Admin)
```http
GET /api/orders/all
Authorization: Bearer <token>
```

### Upload Endpoints

#### Upload Plant Image
```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

## 🎨 Frontend Features

### Interactive Carousel
- **Keyboard Navigation**: Use Left/Right arrow keys to navigate slides
- **Touch Support**: Swipe left/right on touch devices
- **Auto-play**: Automatically cycles through slides (pauses on hover)
- **Click Navigation**: Click on any slide to jump to it
- **Accessibility**: Full ARIA support and keyboard focus management
- **Visual Polish**: Consistent image rendering with drop shadows

### Context Management
- **AuthContext**: Manages user authentication state globally
- **CartContext**: Handles shopping cart state and operations

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly UI elements
- Optimized images for different screen sizes

## 🔐 Environment Variables

### Backend (.env)
```env
# MongoDB connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server port (default: 5001)
PORT=5001

# JWT secret for token signing
JWT_SECRET=your_secret_key_here
```

### Frontend (Optional)
For production, you can add:
```env
VITE_API_URL=http://localhost:5001
```

Then reference it in code as `import.meta.env.VITE_API_URL`

## 💻 Development

### Running in Development Mode

**Backend** (with auto-reload):
```powershell
cd backend
npm run dev
```

**Frontend** (with hot module replacement):
```powershell
cd frontend
npm run dev
```

### Building for Production

**Frontend**:
```powershell
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

### Linting

```powershell
cd frontend
npm run lint
```

## 🐛 Troubleshooting

### Images Not Loading
- Verify backend is running at `http://localhost:5001`
- Check that `uploads/plants/` directory exists and contains images
- Ensure `imageUrl` in database points to correct path
- Hard refresh browser (Ctrl+F5) to clear cache

### CORS Errors
- Verify frontend URL is in backend CORS whitelist (server.js)
- Check that requests include proper headers
- Ensure credentials are set correctly

### Authentication Issues
- Verify JWT_SECRET is set in backend .env
- Check token is being sent in Authorization header
- Ensure token hasn't expired

### Database Connection Failed
- Verify MONGO_URI is correct in .env
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Port Already in Use
Backend:
```powershell
$env:PORT=5002; npm start
```

Frontend will automatically use next available port

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly across browsers (Chrome, Firefox, Safari)
4. Keep UI changes isolated to components
5. Follow existing code style and conventions
6. Submit a pull request with clear description

### Code Style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Follow React best practices
- Use async/await for asynchronous operations

## 📝 License

ISC

## 👥 Contact

For questions or support, please open an issue in the repository.

---

**Built with 🌱 by the Zia Nursery Team**
