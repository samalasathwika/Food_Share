# FoodShare — MERN Full Stack Application

> Connecting Surplus Food with Those in Need

---

## Project Structure

```
foodshare/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js             # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── donationController.js
│   │   ├── requestController.js
│   │   ├── deliveryController.js
│   │   ├── notificationController.js
│   │   ├── reviewController.js
│   │   ├── adminController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── auth.js           # JWT + RBAC middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Donation.js
│   │   ├── Request.js
│   │   ├── Delivery.js
│   │   ├── Notification.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── adminRoutes.js
│   │   └── dashboardRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React.js
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Shared/
    │   │       ├── Sidebar.js
    │   │       ├── Topbar.js
    │   │       └── DonationCard.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── DonationList.js
    │   │   ├── DonationDetail.js
    │   │   ├── ProfilePage.js
    │   │   ├── NotFound.js
    │   │   ├── donor/
    │   │   │   ├── DonorDashboard.js
    │   │   │   ├── DonorDonations.js
    │   │   │   ├── DonorRequests.js
    │   │   │   └── CreateDonation.js
    │   │   ├── ngo/
    │   │   │   ├── NGODashboard.js
    │   │   │   ├── NGODonations.js
    │   │   │   └── NGORequests.js
    │   │   ├── volunteer/
    │   │   │   ├── VolunteerDashboard.js
    │   │   │   ├── PendingDeliveries.js
    │   │   │   └── VolunteerDeliveries.js
    │   │   └── admin/
    │   │       ├── AdminDashboard.js
    │   │       ├── AdminUsers.js
    │   │       ├── AdminDonations.js
    │   │       ├── AdminRequests.js
    │   │       └── AdminReports.js
    │   ├── styles/
    │   │   └── main.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user (remember username + password)
4. In "Network Access", add your IP (or `0.0.0.0/0` for all)
5. Click "Connect" → "Connect your application" → copy the URI

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/foodshare?retryWrites=true&w=majority
JWT_SECRET=supersecretkey123
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@foodshare.com
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:3000
```

```bash
# Start backend
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend runs at: `http://localhost:3000`

---

## User Roles & Access

| Role | Login | Dashboard |
|------|-------|-----------|
| Admin | Use ADMIN_EMAIL + ADMIN_PASSWORD from .env (no "admin login" shown in UI) | `/admin` |
| Donor | Register as Donor | `/donor` |
| NGO | Register as NGO | `/ngo` |
| Orphanage | Register as Orphanage | `/ngo` |
| Old Age Home | Register as Old Age Home | `/ngo` |
| Volunteer | Register as Volunteer | `/volunteer` |

> **Admin login is invisible** — just enter the admin credentials on the regular login page. No separate button or form exists.

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login (also handles admin silently)
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/profile` — Update profile

### Donations
- `GET /api/donations` — List available donations (public)
- `GET /api/donations/my` — Donor's own donations
- `POST /api/donations` — Create donation (donor only)
- `PUT /api/donations/:id` — Update donation
- `DELETE /api/donations/:id` — Delete donation
- `GET /api/donations/admin/all` — All donations (admin)

### Requests
- `POST /api/requests` — Create request (NGO)
- `GET /api/requests/my` — NGO's requests
- `GET /api/requests/donor` — Donor's incoming requests
- `PUT /api/requests/:id/approve` — Approve request
- `PUT /api/requests/:id/reject` — Reject request

### Deliveries
- `GET /api/deliveries/pending` — Available deliveries (volunteer)
- `PUT /api/deliveries/:id/accept` — Accept delivery
- `PUT /api/deliveries/:id/status` — Update delivery status
- `POST /api/deliveries/scan-qr` — Scan QR for verification

### Admin
- `GET /api/admin/dashboard` — Dashboard stats
- `GET /api/admin/users` — All users
- `PUT /api/admin/users/:id/verify` — Verify user
- `PUT /api/admin/users/:id/toggle` — Toggle user status
- `DELETE /api/admin/users/:id` — Delete user
- `GET /api/admin/reports` — Full reports data

---

## Key Features Implemented

- ✅ JWT Authentication with role-based access
- ✅ Admin login hidden (no UI hint — just use admin credentials)
- ✅ Role selector on register: Donor, NGO, Orphanage, Old Age Home, Volunteer
- ✅ Phone + Address collected on registration
- ✅ MVC architecture (models / controllers / routes)
- ✅ CRUD for donations with image upload
- ✅ QR Code generation per donation
- ✅ Volunteer delivery system with status flow
- ✅ Real-time notifications via Socket.io
- ✅ Expiry countdown with color indicators (green/yellow/red)
- ✅ Emergency donation flagging
- ✅ Admin dashboard with Chart.js bar + doughnut charts
- ✅ Admin user management (verify, activate/deactivate, delete)
- ✅ CSV report export
- ✅ MongoDB Atlas connection via config/db.js
- ✅ Pure CSS (no Tailwind)

---

## MongoDB Atlas Connection Note

If you see connection errors:
1. Check your IP is whitelisted in Atlas Network Access
2. Ensure the URI is exactly copied (including database name `foodshare`)
3. Confirm username/password have no special characters (or URL-encode them)
4. Try `0.0.0.0/0` in Network Access for testing

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io |
| Charts | Chart.js + react-chartjs-2 |
| QR Codes | qrcode npm package |
| File Upload | multer |
