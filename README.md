# Vehicle Rental System

## 🚀 Live Deployment
[Live Application URL](https://assignment-02-tau-ashen.vercel.app)

## 🎯 Project Overview
Backend API for vehicle rental management with role-based authentication (Admin/Customer), vehicle inventory, booking system, and user management.

## 🛠️ Technology Stack
- **Backend**: Node.js, TypeScript, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcryptjs
- **Tools**: tsx, dotenv, pg

## ✨ Key Features
- 🔐 JWT authentication & role-based access (Admin/Customer)
- 🚗 Vehicle CRUD operations with availability tracking
- 📅 Booking system with automatic price calculation
- 👥 User management with secure data access
- ✅ Input validation & error handling

## 🗄️ Database Tables
**Users**: id, name, email, password, phone, role  
**Vehicles**: id, vehicle_name, type, registration_number, daily_rent_price, availability_status  
**Bookings**: id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status

## 🚀 Quick Setup

1. **Clone & Install**
```bash
git clone [https://github.com/tanvirislamakash2002/B6A2]
cd B6A2
npm install
```

2. **Configure Environment**
Create `.env` file:
```env
PORT=5000
CONNECTION_STR=postgresql_connection_string
JWT_SECRET=jwt_secret
```

3. **Start Application**
```bash
# Development
npm run dev
```

## 📡 API Endpoints
- **Auth**: `POST /api/v1/auth/signup`, `POST /api/v1/auth/signin`
- **Vehicles**: `GET/POST/PUT/DELETE /api/v1/vehicles`
- **Users**: `GET/PUT/DELETE /api/v1/users`
- **Bookings**: `GET/POST/PUT /api/v1/bookings`

## 🔐 Access Control
- **Admin**: Full system access
- **Customer**: View vehicles, manage own bookings & profile
- **Public**: View vehicles only

## ⚙️ Available Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - TypeScript compilation