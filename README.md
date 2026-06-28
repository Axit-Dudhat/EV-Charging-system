# EV Charging Station Management System

A full-stack web application built to manage EV charging stations, featuring real-time status monitoring, full CRUD operations, and an interactive live map visualization.

## 🚀 Live Links
* **Frontend Application**: [https://ev-charging-system-pi.vercel.app/](https://ev-charging-system-pi.vercel.app/) (Hosted on vercel)
* **Backend API Base URL**: [https://ev-charging-system-production.up.railway.app/api](https://ev-charging-system-production.up.railway.app/api)(Hosted on railway)

---

## 🛠️ Technology Stack

### Backend
* **Runtime Environment**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Atlas) using Mongoose ODM
* **Security & Auth**: JWT (JSON Web Tokens) for route protection, Bcrypt.js for secure password hashing
* **CORS**: Configured for cross-origin frontend communication

### Frontend
* **Framework**: Vue.js 3 (Composition API, `<script setup>`)
* **State Management**: Reactive global store (Vue 3 Reactive API)
* **Routing**: Vue Router 5
* **HTTP Client**: Axios & native fetch requests
* **Map Engine**: Leaflet.js (OpenStreetMap)
* **Styling**: Modern, premium CSS styling (glassmorphism, clean layouts, variables, responsive styling)

---

## 📋 Features Implemented

### 1. Backend REST API
* **Authentication**: JWT-based Signup/Login endpoints.
* **Route Protection**: Charging station endpoints are protected; requests require a valid Bearer token.
* **Charging Stations CRUD**: Complete RESTful interface supporting creation, reading (with server-side filtering), updating, and deletion.
* **Database Schema**:
  * `name`: String (Required)
  * `latitude`: Number (Required)
  * `longitude`: Number (Required)
  * `status`: String enum ("Active", "Inactive")
  * `powerOutput`: Number (Required, in kW)
  * `connectorType`: String enum ("CCS2", "CHAdeMO", "Type 2", "Tesla Supercharger")

### 2. Frontend UI
* **User Portal**: Secure Login and Registration screens interacting with the backend API.
* **Interactive Charger Directory**:
  * Responsive data table list of all onboarded charging stations.
  * Server-side text search (by station name).
  * Filters: Status (Active/Inactive), Connector Type, and Power Output capacity levels (Under 50 kW, 50 - 150 kW, Over 150 kW).
  * Client-side pagination (5 stations per page) for high-performance navigation.
* **CRUD Management Interactivity**:
  * Add Charger screen with real-time validation.
  * Edit Charger screen pre-populated with existing database values.
  * Delete Charger with a secure modal confirmation screen.
* **Live Grid Map**:
  * OpenStreetMap integrated via Leaflet.
  * Interactive radar-pulsing map markers (Green for Active, Red for Inactive/Faulted).
  * Info popups when clicking markers, detailing the charger name, type, power capacity, and location.

---

## 📂 Project Structure

```
├── Backend/
│   ├── config/              # DB connection config
│   ├── controllers/         # Logic handlers for Auth & Stations
│   ├── middleware/          # JWT protect routes middleware
│   ├── models/              # MongoDB Schemas (User, ChargingStation)
│   ├── routes/              # Express Router mapping
│   ├── Server.js            # Entry script
│   └── .env                 # Environment configurations
├── Frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # Axios client instance
│   │   ├── assets/          # CSS and style tokens
│   │   ├── components/      # Reusable widgets (Navbar, Sidebar)
│   │   ├── Pages/           # Vue Views (Login, Dashboard, List, Map, CRUD)
│   │   ├── router/          # Vue Router configurations
│   │   ├── services/        # Axios API fetch requests
│   │   ├── store/           # Global reactive state store
│   │   └── main.js          # App mounting script
│   ├── index.html           # HTML container template
│   └── vite.config.js       # Vite configuration file
└── README.md                # Project documentation
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* MongoDB (Local instance or Atlas URI)

### 1. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the browser and visit `http://localhost:5173` (or the terminal-reported port).

---

## 📡 API Endpoints

### Auth
* **POST** `/api/auth/register` - Create a new user profile.
* **POST** `/api/auth/login` - Authenticate user and issue JWT token.

### Charging Stations (Requires Authorization header: `Bearer <token>`)
* **GET** `/api/stations` - Fetch list of stations (supports query parameters: `search`, `status`, `connector`).
* **POST** `/api/stations` - Create a new charging station.
* **PUT** `/api/stations/:id` - Update details of a charging station.
* **DELETE** `/api/stations/:id` - Remove a charging station from the grid database.
