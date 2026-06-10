# Gateway Store 🛒

A full-stack e-commerce web application built with React (Vite) + Node.js + Express + MongoDB Atlas.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Styling | Bootstrap 5 + Custom CSS |

## Features

- 🛍️ Product catalog with categories & search
- 🛒 Shopping cart & wishlist
- 💳 Checkout with address management
- 📦 Order tracking with timeline
- 👤 User authentication (login / register)
- 🔐 Admin panel — manage products, categories, orders, customers

## Project Structure

```
gatewayProject/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── utils/
└── server/          # Node.js + Express backend
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    └── uploads/
```

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/TamilselvanRaman/gatewayStore.git
cd gatewayStore
```

### 2. Setup Backend
```bash
cd server
npm install
# Create .env file (see .env.example)
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Environment Variables (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/gateway_store
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Admin Access
- URL: `http://localhost:3000/admin/login`
- Email: `admin@gateway.com`

## License
MIT
