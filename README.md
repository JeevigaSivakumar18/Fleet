# FleetX — Fleet Management & Real-Time Logistics Platform

A production-ready, full-stack Fleet Management web application built with **React (Vite)**, **Node.js/Express**, **MongoDB**, **Socket.io**, and **LeafletJS**. Inspired by Fleetx.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based login/register with bcrypt password hashing |
| 📊 **Dashboard** | Live stats, fuel alerts, fleet utilization, recent routes |
| 📡 **Live Tracking** | Real-time truck positions on dark CARTO map via Socket.io |
| 🚛 **Fleet Management** | Full CRUD for trucks with driver assignment |
| 🗺️ **Route Planner** | Route planning with fuel, cost, CO₂ & traffic analysis + map visualization |
| 🔧 **Maintenance** | Service log tracking with overdue alerts |
| 📈 **Analytics** | 5 interactive charts + CSV data upload |
| ⚙️ **Settings** | Profile, notifications, and app preferences |

---

## 🏗️ Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS v4 (dark glassmorphism design)
- React Router v7
- Recharts (analytics charts)
- React-Leaflet + Leaflet (interactive maps, no API key needed)
- Socket.io-client (real-time updates)
- React Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (real-time truck simulation)
- JWT (authentication)
- bcryptjs (password hashing)
- Multer + csv-parser (CSV upload & processing)
- express-rate-limit (API rate limiting)
- express-validator (request validation)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Fleet

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

The backend `.env` is pre-configured for local development:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fleetx
JWT_SECRET=fleetx_super_secret_jwt_key_2024
```

### 3. Start the Backend

```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
# 8 sample trucks are auto-seeded on first run
```

### 4. Start the Frontend

```bash
cd frontend
npm run dev
# App opens on http://localhost:5173
```

### 5. Open the App

Navigate to **http://localhost:5173** and:
1. Click **"Create Account"** to register
2. Log in with your credentials
3. Explore the dashboard!

---

## 📁 Project Structure

```
Fleet/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── maintenanceController.js
│   │   ├── routeController.js
│   │   └── truckController.js
│   ├── data/
│   │   ├── trucks_data.csv      # Sample fleet data for analytics
│   │   └── traffic_data.csv     # Sample traffic data for analytics
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validator.js         # Request validation
│   ├── models/
│   │   ├── Maintenance.js
│   │   ├── Route.js
│   │   ├── Truck.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── routeRoutes.js
│   │   └── truckRoutes.js
│   ├── services/
│   │   ├── analyticsService.js
│   │   ├── fleetService.js
│   │   ├── maintenanceService.js
│   │   └── routeService.js
│   ├── socket/
│   │   └── simulation.js        # Real-time GPS simulation (every 5s)
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── DashboardLayout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Analytics.jsx    # 5 charts + CSV upload
    │   │   ├── Dashboard.jsx    # Stats + fuel alerts + routes
    │   │   ├── FleetManagement.jsx  # CRUD trucks
    │   │   ├── LiveTracking.jsx     # Leaflet real-time map
    │   │   ├── Login.jsx
    │   │   ├── Maintenance.jsx      # Service logs
    │   │   ├── Register.jsx
    │   │   ├── RoutePlanner.jsx     # Route calc + Leaflet map
    │   │   └── Settings.jsx
    │   ├── services/
    │   │   └── api.js           # Axios API layer
    │   ├── App.jsx
    │   ├── index.css            # Design system + Leaflet overrides
    │   └── main.jsx
    ├── index.html
    └── vite.config.js
```

---

## 🗺️ API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user profile |

### Trucks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trucks` | Get all trucks |
| POST | `/api/trucks` | Add new truck |
| PUT | `/api/trucks/:id` | Update truck |
| DELETE | `/api/trucks/:id` | Delete truck |
| PATCH | `/api/trucks/:id/driver` | Assign driver |

### Routes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/routes` | Get all routes |
| POST | `/api/routes` | Plan new route |
| DELETE | `/api/routes/:id` | Delete route |

### Maintenance
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/maintenance` | Get all records |
| POST | `/api/maintenance` | Create service log |
| PUT | `/api/maintenance/:id` | Update record |
| DELETE | `/api/maintenance/:id` | Delete record |
| GET | `/api/maintenance/overdue` | Get overdue records |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/fuel` | Fuel consumption data |
| GET | `/api/analytics/co2` | CO₂ emissions data |
| GET | `/api/analytics/maintenance-cost` | Maintenance cost data |
| GET | `/api/analytics/delivery-time` | Delivery time data |
| GET | `/api/analytics/traffic` | Traffic impact data |
| POST | `/api/analytics/upload` | Upload CSV file |

---

## 📤 CSV Upload Format

### trucks_data.csv
```csv
truck_id,date,fuel_used_liters,co2_kg,delivery_time_min,cost_rs
TRK-001,2024-01-15,45.5,121.9,180,4322.5
```

### traffic_data.csv
```csv
route,congestion_level,time_of_day
Delhi-Mumbai,High,Morning
```

---

## 🔧 Development Notes

- The **Live Tracking** map uses free [CARTO dark tiles](https://carto.com/basemaps) — no API key needed
- The **truck simulation** runs every 5 seconds via Socket.io, updating GPS positions, speed, and fuel levels
- **8 sample trucks** across major Indian cities are seeded automatically on first startup
- Analytics charts use **fallback mock data** if CSV files aren't uploaded yet
- Rate limiting: 100 req/15 min (API), 20 req/15 min (auth)

---

## 🌟 Screenshots

| Page | Description |
|---|---|
| Dashboard | Fleet stats, fuel alerts, recent routes |
| Live Tracking | Dark map with real-time truck markers |
| Route Planner | City-to-city route with cost analysis |
| Analytics | 5 charts: fuel, maintenance cost, CO₂, delivery time, traffic |

---

## 📄 License

MIT © FleetX Team
