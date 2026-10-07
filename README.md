# 🏥 Hospital Management System (HMS)

A comprehensive Hospital Management System built with modern web technologies for university Software Engineering coursework.

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Development Phases](#development-phases)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

The Hospital Management System (HMS) is a full-stack web application designed to streamline hospital operations including patient management, appointment scheduling, doctor consultations, inpatient admissions, billing, discharge, and follow-up care.

**Key Highlights:**
- **Complete Workflow Coverage:** From patient registration to discharge and follow-up
- **Role-Based Access Control:** Admin, Receptionist, and Doctor roles with specific permissions
- **Real-Time Status Tracking:** Patient, appointment, and admission status updates
- **Comprehensive Audit Trail:** All major actions logged for accountability
- **Data Integrity:** Database transactions and foreign key constraints
- **Security First:** Password encryption, JWT authentication, SQL injection prevention

---

## ✨ Features

### Patient Management
- 📝 Patient registration with complete demographics
- 🔍 Patient search and filtering
- 📊 Status tracking through entire workflow
- 📋 Complete medical history

### Appointment System
- 📅 Appointment booking with date/time selection
- ✅ Check-in functionality
- 🔔 Duplicate prevention
- 📈 Status workflow (Scheduled → Checked In → Completed)

### Doctor Consultation
- 🩺 Consultation recording (symptoms, diagnosis, prescription)
- 📜 Patient history display
- 💊 Prescription management
- 📝 Consultation notes

### Admission & Room Management
- 🛏️ Room inventory management
- 🏥 Patient admission to specific rooms
- 💰 Room charge calculation
- 🔄 Automatic availability tracking

### Billing & Payment
- 🧾 Automated bill generation
- 💳 Payment recording
- 📊 Consultation and room charge calculation
- ✅ Payment status tracking

### Discharge Management
- ✅ Two-step discharge process (Doctor approval + Receptionist finalization)
- 📋 Discharge summary and instructions
- 💊 Medication prescriptions
- 🏠 Automatic room release

### Follow-up System
- 📅 Outpatient follow-up scheduling
- 🏥 Post-discharge follow-up tracking
- 🔗 Discharge linkage
- ✅ Status management (Scheduled/Completed/Cancelled)

### Admin Features
- 📊 **Activity Logs:** Complete audit trail of all system actions
- 📈 **Reports & Analytics:** Real-time statistics and summaries
- 👨‍⚕️ **Doctor Management:** 
  - Add new doctors to the system
  - Edit doctor information (specialization, qualifications, fees, availability)
  - Deactivate/reactivate doctor accounts
  - View all doctors (active and inactive)
- 👥 User management
- 🔐 System-wide access

---

## 🛠 Technology Stack

### Frontend
- **Framework:** React 18.0
- **Build Tool:** Vite 4.0
- **Styling:** Tailwind CSS 3.0
- **Routing:** React Router 6.0
- **Icons:** Lucide React
- **HTTP Client:** Fetch API

### Backend
- **Runtime:** Node.js 18.0
- **Framework:** Express.js 4.18
- **Authentication:** JWT (jsonwebtoken)
- **Password Encryption:** bcrypt
- **Environment:** dotenv
- **CORS:** cors middleware

### Database
- **RDBMS:** MySQL 8.0
- **Driver:** mysql2
- **Connection:** Connection pooling

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Code Editor:** VS Code (recommended)
- **API Testing:** cURL, Postman
- **Database Client:** MySQL Workbench, DBeaver, or CLI

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  (React + Vite + Tailwind CSS - Port 5173)                 │
│  - Components (Pages, Layout, Protected Routes)             │
│  - Context (AuthContext)                                    │
│  - Utils (API calls, helpers)                               │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP Requests (JWT)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Server                       │
│       (Node.js + Express.js - Port 5000)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Middleware Layer                                     │  │
│  │  - CORS                                              │  │
│  │  - JSON Parser                                       │  │
│  │  - Authentication (JWT verify)                       │  │
│  │  - Authorization (Role check)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes Layer (13 route files)                        │  │
│  │  /api/auth, /api/patients, /api/appointments, etc.  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Controllers Layer                                    │  │
│  │  - Business logic                                    │  │
│  │  - Request validation                                │  │
│  │  - Response formatting                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Database Layer                                       │  │
│  │  - Connection pool                                   │  │
│  │  - Query execution                                   │  │
│  │  - Transaction management                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ SQL Queries
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                           │
│                  (Port 3306)                                │
│                                                             │
│  11 Tables:                                                 │
│  - Users, Doctors, Patients                                 │
│  - Appointments, Consultations                              │
│  - Rooms, Admissions                                        │
│  - Bills, Discharges                                        │
│  - FollowUps, ActivityLogs                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v16.0 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MySQL** (v8.0 or higher)
   - Download: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`

3. **npm** (comes with Node.js)
   - Verify: `npm --version`

4. **Git** (for version control)
   - Download: https://git-scm.com/
   - Verify: `git --version`

### Recommended Software

- **MySQL Workbench** or **DBeaver** (Database GUI)
- **Postman** (API testing)
- **VS Code** (Code editor)

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Hospital_Management_System.git
cd Hospital_Management_System
```

Or download and extract the ZIP file.

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

**Expected packages:**
- express
- mysql2
- bcrypt
- jsonwebtoken
- dotenv
- cors

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

**Expected packages:**
- react
- react-dom
- react-router-dom
- lucide-react
- tailwindcss

---

## ⚙️ Configuration

### 1. Database Setup

**Create the database:**

```bash
mysql -u root -p
```

Enter your MySQL root password, then:

```sql
CREATE DATABASE hospital_management_system;
exit
```

**Import the schema:**

```bash
mysql -u root -p hospital_management_system < database/schema.sql
```

**Seed demo users:**

```bash
cd server
node seed_demo_users.js
```

### 2. Backend Environment Configuration

Create `.env` file in `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_management_system
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Change `JWT_SECRET` to a random string in production
- Use a strong MySQL password
- Never commit `.env` to version control

### 3. Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:5000`.

If you need to change the backend URL, edit:

```javascript
// client/src/utils/api.js
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**

```bash
cd server
node server.js
```

**Expected output:**
```
Server is running on http://localhost:5000
Database connected successfully
```

**Terminal 2 - Start Frontend Development Server:**

```bash
cd client
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the HMS homepage with "Backend: Connected" and "Database: Connected" status indicators.

---

## 👤 Demo Credentials

### Admin Account
```
Username: admin
Password: Admin@123
```

**Access:**
- All modules
- Doctor management (Add, edit, deactivate/reactivate doctors)
- Activity Logs (exclusive)
- Reports & Analytics (exclusive)
- User management

### Receptionist Account
```
Username: receptionist
Password: Receptionist@123
```

**Access:**
- Patient registration
- Appointment booking and check-in
- Admission management
- Billing and payment
- Discharge finalization
- **Cannot** manage doctor accounts

### Doctor Accounts

#### Doctor 1 (Cardiology)
```
Username: doctor1
Password: Doctor@123
```
**Access:**
- Today's appointments
- Patient consultations
- Discharge approval
- Follow-up management
- **Cannot** manage doctor accounts

#### Doctor 2 (Orthopedics)
```
Username: doctor2
Password: Doctor@123
```

#### Doctor 3 (Pediatrics)
```
Username: doctor3
Password: Doctor@123
```

---

## 📁 Project Structure

```
Hospital_Management_System/
│
├── client/                          # Frontend React application
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Layout.jsx           # Main layout with sidebar
│   │   │   └── ProtectedRoute.jsx   # Route authorization
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/                   # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── PatientListPage.jsx
│   │   │   ├── RegisterPatientPage.jsx
│   │   │   ├── AppointmentListPage.jsx
│   │   │   ├── BookAppointmentPage.jsx
│   │   │   ├── ConsultationPage.jsx
│   │   │   ├── AdmissionListPage.jsx
│   │   │   ├── BillingListPage.jsx
│   │   │   ├── DischargeListPage.jsx
│   │   │   ├── FollowUpListPage.jsx
│   │   │   ├── ActivityLogsPage.jsx  # Admin only
│   │   │   └── ReportsPage.jsx        # Admin only
│   │   ├── utils/
│   │   │   └── api.js               # API utility functions
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Backend Node.js application
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── appointmentController.js
│   │   ├── consultationController.js
│   │   ├── admissionController.js
│   │   ├── billingController.js
│   │   ├── dischargeController.js
│   │   ├── followupController.js
│   │   ├── activityLogController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification & authorization
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── consultationRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── admissionRoutes.js
│   │   ├── billingRoutes.js
│   │   ├── dischargeRoutes.js
│   │   ├── followupRoutes.js
│   │   ├── activityLogRoutes.js
│   │   └── reportRoutes.js
│   ├── .env                         # Environment variables (not in git)
│   ├── .env.example                 # Template for .env
│   ├── server.js                    # Main server file
│   ├── seed_demo_users.js           # Demo user creation script
│   └── package.json
│
├── database/                        # Database scripts
│   ├── schema.sql                   # Complete database schema
│   └── seed.sql                     # Sample data (optional)
│
├── docs/                            # Documentation
│   ├── PHASE_11_COMPLETION_REPORT.md
│   └── PHASE_12_TEST_REPORT.md
│
├── .gitignore
├── DEMO_CREDENTIALS.md              # Complete demo guide
├── README.md                        # This file
├── reset.sh                         # Database reset script
└── LICENSE
```

---

## 🗄️ Database Schema

### Tables Overview (11 tables)

1. **Users** - System users (Admin, Receptionist, Doctor)
2. **Doctors** - Doctor profiles and specializations
3. **Patients** - Patient demographics and status
4. **Appointments** - Appointment scheduling
5. **Consultations** - Medical consultation records
6. **Rooms** - Hospital room inventory
7. **Admissions** - Inpatient admissions
8. **Bills** - Billing and charges
9. **Discharges** - Discharge records
10. **FollowUps** - Follow-up appointments
11. **ActivityLogs** - System audit trail

### Key Relationships

```
Users ─┬─→ Doctors (user_id)
       ├─→ ActivityLogs (user_id)
       └─→ Bills (generated_by_user_id)

Patients ─┬─→ Appointments (patient_id)
          ├─→ Admissions (patient_id)
          ├─→ Bills (patient_id)
          └─→ FollowUps (patient_id)

Doctors ─┬─→ Appointments (doctor_id)
         ├─→ Admissions (doctor_id)
         └─→ FollowUps (doctor_id)

Appointments ──→ Consultations (appointment_id)

Rooms ──→ Admissions (room_id)

Admissions ─┬─→ Bills (via patient_id)
            └─→ Discharges (admission_id)

Discharges ──→ FollowUps (discharge_id, nullable)
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get current user
```

### Patients
```
GET    /api/patients             - List all patients
GET    /api/patients/:id         - Get patient details
POST   /api/patients             - Register new patient
PUT    /api/patients/:id         - Update patient
```

### Appointments
```
GET    /api/appointments         - List appointments
GET    /api/appointments/:id     - Get appointment details
POST   /api/appointments         - Book appointment
PUT    /api/appointments/:id/check-in  - Check in patient
```

### Consultations
```
GET    /api/appointments/:id/consultation  - Get consultation
POST   /api/appointments/:id/consultation  - Record consultation
```

### Rooms
```
GET    /api/rooms                - List all rooms
GET    /api/rooms/:id            - Get room details
```

### Admissions
```
GET    /api/admissions           - List admissions
GET    /api/admissions/:id       - Get admission details
POST   /api/admissions           - Create admission
```

### Billing
```
GET    /api/bills                - List bills
GET    /api/bills/:id            - Get bill details
POST   /api/bills                - Generate bill
PUT    /api/bills/:id/payment    - Record payment
```

### Discharge
```
GET    /api/discharges           - List discharges
GET    /api/discharges/:id       - Get discharge details
POST   /api/admissions/:id/approve-discharge  - Doctor approval
POST   /api/admissions/:id/discharge  - Finalize discharge
```

### Follow-ups
```
GET    /api/followups            - List follow-ups
GET    /api/followups/:id        - Get follow-up details
POST   /api/followups            - Schedule follow-up
PUT    /api/followups/:id/status - Update follow-up status
```

### Activity Logs (Admin only)
```
GET    /api/activity-logs        - Get activity logs with filters
```

### Reports (Admin only)
```
GET    /api/reports/summary      - Get system summary statistics
```

---

## 🏗 Development Phases

### ✅ Phase 1: Project Setup
- Project initialization
- Frontend and backend scaffolding
- Database connection

### ✅ Phase 2: Database Schema
- Table creation
- Relationships and constraints
- Indexes and foreign keys

### ✅ Phase 3: Authentication & Authorization
- User login system
- JWT implementation
- Role-based access control

### ✅ Phase 4: Patient Management
- Patient registration
- Patient listing and search
- Patient status tracking

### ✅ Phase 5: Doctor Management
- Doctor profiles
- Specializations
- Consultation fees

### ✅ Phase 6: Appointment Management
- Appointment booking
- Check-in system
- Status workflow

### ✅ Phase 7: Doctor Consultation
- Consultation recording
- Patient history
- Prescription management

### ✅ Phase 8: Room Management
- Room inventory
- Availability tracking
- Room types and pricing

### ✅ Phase 9: Admission Management
- Patient admission
- Room allocation
- Admission tracking

### ✅ Phase 10: Billing & Payment
- Bill generation
- Charge calculation
- Payment recording

### ✅ Phase 11: Discharge Management
- Doctor approval
- Discharge finalization
- Room release

### ✅ Phase 12: Follow-up Management
- Outpatient follow-ups
- Post-discharge follow-ups
- Status tracking

### ✅ Phase 13: Activity Logs
- Audit trail
- Admin access
- Filtering and pagination

### ✅ Phase 14: Reports & Analytics
- System statistics
- Real-time summaries
- Admin dashboard

---

## 🧪 Testing

### Manual Testing

1. **Backend API Testing:**
   ```bash
   # Test health endpoint
   curl http://localhost:5000/api/test/health
   
   # Test database connection
   curl http://localhost:5000/api/test/db
   
   # Test login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"Admin@123"}'
   ```

2. **Frontend Testing:**
   - Navigate through all pages
   - Test all user workflows
   - Check responsive design
   - Verify error handling

### Automated Testing

Refer to `PHASE_12_TEST_REPORT.md` for comprehensive testing results.

**Test Coverage:**
- ✅ Backend API endpoints (15 tests)
- ✅ Authentication & Authorization (10 tests)
- ✅ Outpatient workflow (8 steps)
- ✅ Inpatient workflow (13 steps)
- ✅ Edge cases (10 scenarios)
- ✅ Database consistency
- ✅ Report accuracy (100%)

---

## 🚢 Deployment

### Production Checklist

- [ ] Change JWT_SECRET to secure random string
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Use process manager (PM2)
- [ ] Configure firewall rules

### Backend Deployment

```bash
# Install PM2
npm install -g pm2

# Start server with PM2
cd server
pm2 start server.js --name hms-backend

# Enable startup on boot
pm2 startup
pm2 save
```

### Frontend Deployment

```bash
# Build for production
cd client
npm run build

# Serve static files with nginx/apache
# or deploy to Vercel/Netlify
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Backend won't start**
- Check if port 5000 is available
- Verify MySQL is running
- Check .env file exists and has correct values

**2. Database connection error**
- Verify MySQL credentials in .env
- Check if database exists
- Ensure MySQL service is running

**3. Login not working**
- Run seed_demo_users.js to create users
- Clear browser localStorage
- Check JWT_SECRET in .env

**4. Frontend can't connect to backend**
- Verify backend is running on port 5000
- Check CORS configuration
- Verify API_BASE_URL in client/src/utils/api.js

See `DEMO_CREDENTIALS.md` for detailed troubleshooting steps.

---

## 🤝 Contributing

This is a university project. Contributions are not currently accepted.

For issues or suggestions, please contact the development team.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

**HMS Development Team**
- Software Engineering Course Project
- University Project 2026

---

## 📞 Support

For technical support or questions:
- Check `DEMO_CREDENTIALS.md` for complete usage guide
- Review `PHASE_12_TEST_REPORT.md` for testing documentation
- Contact course instructor

---

## 🎓 Academic Integrity

This project is submitted as part of university coursework. All code is original work by the development team. External libraries and frameworks are properly attributed.

---

## 📚 Documentation

- **Demo Guide:** `DEMO_CREDENTIALS.md`
- **Test Report:** `PHASE_12_TEST_REPORT.md`
- **Phase 11 Report:** `PHASE_11_COMPLETION_REPORT.md`
- **API Documentation:** See API Endpoints section above

---

## 🔮 Future Enhancements

Potential features for future versions:
- Email/SMS notifications
- Appointment reminders
- Patient portal
- Pharmacy integration
- Laboratory module
- Inventory management
- Advanced analytics
- Mobile application
- Telemedicine features

---

**Last Updated:** September 9, 2026  
**Version:** 1.0.0  
**Status:** Production Ready (Backend)

---

**Made with ❤️ for Software Engineering Course**
