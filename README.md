# 🍽️ FoodShare — MERN Full Stack Application

> **Connecting Surplus Food with Those in Need**

FoodShare is a **MERN Stack web application** that aims to reduce food waste by connecting **food donors** (restaurants, hotels, bakeries, hostels, function halls, etc.) with **NGOs, orphanages, old-age homes, and volunteers**. The platform enables secure food donation, request management, delivery tracking, and real-time notifications through a modern role-based system.

---
# 🌐 Live Demo

Frontend

```
https://food-share-khaki-one.vercel.app/

```

Backend

```
https://food-share-1-m23v.onrender.com

```

---

# 🌟 Features

* 🔐 JWT Authentication & Authorization
* 👤 Role-Based Access Control
* 🍱 Food Donation Management
* 🤝 NGO Request System
* 🚚 Volunteer Delivery Tracking
* 🔔 Real-Time Notifications (Socket.io)
* 📱 QR Code Verification
* 📊 Admin Dashboard & Analytics
* 📈 Chart.js Reports
* 📤 CSV Report Export
* ⏳ Expiry Countdown Indicators
* 🚨 Emergency Donation Priority
* 📸 Image Upload Support
* ⭐ Review & Rating System

---

# 🛠 Tech Stack

| Layer          | Technology           |
| -------------- | -------------------- |
| Frontend       | React.js             |
| Backend        | Node.js + Express.js |
| Database       | MongoDB Atlas        |
| Authentication | JWT + bcryptjs       |
| Real-Time      | Socket.io            |
| Charts         | Chart.js             |
| QR Generation  | qrcode               |
| File Upload    | Multer               |
| Styling        | CSS                  |

---

# 📂 Project Structure

```
foodshare/

│
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── .env.example
│ ├── package.json
│ └── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── utils/
│ │ ├── styles/
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/FoodShare.git

cd FoodShare
```

---

# ⚙ Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d

ADMIN_EMAIL=admin@foodshare.com

ADMIN_PASSWORD=admin123

CLIENT_URL=http://localhost:3000
```

Run Backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

# ⚛ Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs on

```
http://localhost:3000
```

---

# 👥 User Roles

| Role         | Dashboard  |
| ------------ | ---------- |
| Donor        | /donor     |
| NGO          | /ngo       |
| Orphanage    | /ngo       |
| Old Age Home | /ngo       |
| Volunteer    | /volunteer |
| Admin        | /admin     |

---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

PUT /api/auth/profile
```

## Donations

```
GET /api/donations

POST /api/donations

PUT /api/donations/:id

DELETE /api/donations/:id

GET /api/donations/my
```

## Requests

```
POST /api/requests

GET /api/requests/my

PUT /api/requests/:id/approve

PUT /api/requests/:id/reject
```

## Deliveries

```
GET /api/deliveries/pending

PUT /api/deliveries/:id/accept

PUT /api/deliveries/:id/status
```

## Admin

```
GET /api/admin/dashboard

GET /api/admin/users

PUT /api/admin/users/:id/verify

DELETE /api/admin/users/:id
```

---

# 🗄 Database Setup

1. Create a MongoDB Atlas Cluster

2. Create Database User

3. Add Network Access (`0.0.0.0/0`)

4. Copy Connection String

5. Add URI inside `.env`

Example

```
mongodb+srv://username:password@cluster.mongodb.net/foodshare
```

---

# 🏗 Architecture

```
                React Frontend
                       │
                       │
             REST API (Express)
                       │
                       │
            MongoDB Atlas Database
                       │
                       │
              Socket.io Notifications
```

---

# 🔒 Authentication

* JWT Token Based Authentication
* Protected Routes
* Role-Based Access
* Secure Password Hashing using bcrypt

---

# 📊 Admin Features

* User Management
* Donation Management
* NGO Verification
* Reports
* Dashboard Analytics
* Charts
* Export CSV

---

# 🚚 Volunteer Features

* Accept Deliveries
* Update Delivery Status
* QR Verification
* Track Delivery Progress

---

# 🍱 Donor Features

* Add Donation
* Update Donation
* Delete Donation
* View Requests
* Track Donations

---

# 🏠 NGO Features

* Browse Donations
* Send Requests
* Manage Requests
* Track Deliveries

---

# 🚀 Future Enhancements

* AI Food Demand Prediction
* Google Maps Integration
* Push Notifications
* Mobile Application
* Email Notifications
* Payment Gateway
* OCR Food Detection

---

# 👨‍💻 Author

**Sathwika Samala**

B.Tech CSE 



---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ If you like this project, don't forget to Star the repository!
