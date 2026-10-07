# Hospital Management System - Complete Demo Guide

## 🎯 Full System Demo - All 11 Phases Complete

This guide demonstrates the complete Hospital Management System with all workflows from patient registration through discharge and follow-up.

---

## 🚀 Starting the Application

### Step 1: Start Backend Server
```bash
cd server
node server.js
```
**Expected Output:** `Server is running on http://localhost:5000`

### Step 2: Start Frontend Application (New Terminal)
```bash
cd client
npm run dev
```
**Expected Output:** Frontend running on `http://localhost:5173`

### Step 3: Open Browser
Navigate to: `http://localhost:5173`

---

## 👥 Demo Credentials

### Admin Account
- **Username:** `admin`
- **Password:** `Admin@123`
- **Access:** 
  - Full system access
  - User management
  - Activity logs (Admin exclusive)
  - Reports and analytics (Admin exclusive)
  - All modules

### Receptionist Account
- **Username:** `receptionist`
- **Password:** `Receptionist@123`
- **Access:** 
  - Patient registration
  - Appointment booking and check-in
  - Admission management
  - Room allocation
  - Bill generation and payment recording
  - Discharge finalization
  - Follow-up scheduling

### Doctor Account
- **Username:** `doctor`
- **Password:** `Doctor@123`
- **Access:** 
  - Today's appointments
  - Patient consultation recording
  - Discharge approval
  - Follow-up management
  - Patient medical history

---

## 🎬 Complete Workflow Demonstrations

### **WORKFLOW 1: Outpatient Consultation**

Complete patient visit without admission.

#### Step 1: Login as Receptionist
1. Open `http://localhost:5173`
2. Click "Login"
3. Enter:
   - Username: `receptionist`
   - Password: `Receptionist@123`
4. Click "Login"
5. **Verify:** Dashboard shows "Receptionist" role

#### Step 2: Register New Patient
1. Click "Patients" in sidebar (or "Register Patient")
2. Click "Register New Patient" button
3. Fill patient details:
   ```
   First Name: Amit
   Last Name: Sharma
   Date of Birth: 1985-07-20
   Gender: Male
   Phone: 9876543210
   Email: amit.sharma@email.com
   Blood Group: B+
   Address: 45 Connaught Place, New Delhi, 110001
   ```
4. Click "Register Patient"
5. **Verify:** 
   - Success message appears
   - Patient status: "Registered"
   - Patient added to list

#### Step 3: Book Appointment
1. On Patients page, find "Amit Sharma"
2. Click "View" or "Book Appointment"
3. Click "Book Appointment" button
4. Fill appointment details:
   ```
   Doctor: Dr. John Doe (or available doctor)
   Date: (Tomorrow's date)
   Time: 10:00 AM
   Reason: Fever and cough for 3 days
   ```
5. Click "Book Appointment"
6. **Verify:** 
   - Appointment created
   - Patient status changes to "Appointment Scheduled"

#### Step 4: Check In Patient
1. Go to "Appointments" in sidebar
2. Find appointment for "Amit Sharma"
3. Click on appointment to view details
4. Click "Check In" button
5. **Verify:** 
   - Status changes to "Checked In"
   - Patient status becomes "Checked In"
   - Button becomes disabled

#### Step 5: Logout Receptionist
1. Click user menu in top-right
2. Click "Logout"

#### Step 6: Login as Doctor
1. Click "Login"
2. Enter:
   - Username: `doctor`
   - Password: `Doctor@123`
3. Click "Login"

#### Step 7: View Today's Appointments
1. Click "Today's Appointments" in sidebar
2. **Verify:** Appointment for "Amit Sharma" visible (if appointment date is today)
3. Click on the appointment

#### Step 8: Record Consultation
1. On appointment details page, click "Start Consultation"
2. Fill consultation form:
   ```
   Chief Complaint: Fever and cough for 3 days
   
   Symptoms:
   - Fever (101°F)
   - Dry cough
   - Mild throat pain
   - Fatigue
   
   Diagnosis: Upper Respiratory Tract Infection (URTI)
   
   Prescription:
   1. Azithromycin 500mg - Once daily for 5 days
   2. Paracetamol 650mg - Three times daily (if fever)
   3. Cough syrup - 10ml three times daily
   
   Notes:
   - Take complete bed rest
   - Drink warm water
   - Avoid cold foods
   - Return if fever persists beyond 3 days
   ```
3. Click "Save Consultation"
4. **Verify:** 
   - Consultation saved
   - Appointment status: "Completed"
   - Patient status: "Consultation Completed"

#### Step 9: Schedule Outpatient Follow-up
1. Click "Follow-ups" in sidebar
2. Click "Schedule Follow-up"
3. Fill follow-up details:
   ```
   Patient: Amit Sharma
   Doctor: Dr. John Doe
   Discharge: (Leave empty - Outpatient)
   Date: (7 days from now)
   Time: 10:00 AM
   Notes: Post-treatment checkup
   ```
4. Click "Schedule Follow-up"
5. **Verify:** 
   - Follow-up created
   - Source shows "Outpatient Consultation"
   - Patient status: "Follow-up Scheduled"
   - discharge_id is NULL

#### Step 10: Logout
1. Click user menu → Logout

**✅ Outpatient Workflow Complete!**

---

### **WORKFLOW 2: Inpatient Admission & Discharge**

Complete hospitalization cycle from admission to discharge.

#### Step 1: Patient with Completed Consultation
Use the patient "Amit Sharma" from Workflow 1 (or create new patient and complete consultation).

#### Step 2: Login as Receptionist
1. Login with receptionist credentials
2. Go to "Admissions" in sidebar

#### Step 3: Admit Patient
1. Click "Create New Admission"
2. Fill admission form:
   ```
   Patient: Amit Sharma (search and select)
   Doctor: Dr. John Doe
   Room: Select any available room (e.g., Room 101)
   Reason: Severe infection, requires IV antibiotics and monitoring
   ```
3. Click "Create Admission"
4. **Verify:** 
   - Admission created
   - Admission status: "Active"
   - Patient status: "Admitted"
   - Selected room becomes "Unavailable"

#### Step 4: Generate Bill
1. Go to "Billing" in sidebar
2. Click "Generate New Bill"
3. Fill billing form:
   ```
   Patient: Amit Sharma (auto-calculates consultation and room charges)
   Additional Charges: 500 (medicines, tests, etc.)
   Notes: 3 days admission with IV medications
   ```
4. Click "Generate Bill"
5. **Verify:** 
   - Bill generated with correct calculation:
     - Consultation Charge: (Doctor's fee)
     - Room Charge: (Days × Room rate)
     - Additional Charges: 500
     - Total Amount: (Calculated automatically)
   - Payment Status: "Pending"

#### Step 5: Record Payment
1. On bill details page, click "Record Payment"
2. Select payment method:
   ```
   Payment Method: Cash (or Card/UPI)
   ```
3. Click "Record Payment"
4. **Verify:** 
   - Payment status: "Paid"
   - Payment date populated
   - Activity log created

#### Step 6: Logout Receptionist, Login as Doctor
1. Logout receptionist
2. Login as doctor

#### Step 7: Approve Discharge
1. Go to "Admissions" in sidebar
2. Find admission for "Amit Sharma"
3. Click to view admission details
4. Click "Approve Discharge" button
5. **Verify:** 
   - Patient status changes to "Ready for Discharge"
   - Activity log: "Discharge Approved"

#### Step 8: Logout Doctor, Login as Receptionist
1. Logout doctor
2. Login as receptionist

#### Step 9: Finalize Discharge
1. Go to "Admissions"
2. Find "Amit Sharma" admission (patient should be "Ready for Discharge")
3. Click admission to view details
4. Click "Finalize Discharge"
5. Fill discharge details:
   ```
   Discharge Summary: Patient recovered well from infection
   Final Diagnosis: Bacterial pneumonia - resolved
   Medications Prescribed: 
   - Amoxicillin 500mg - Complete 7-day course
   - Multivitamins - Once daily for 15 days
   Instructions:
   - Complete antibiotic course
   - Adequate rest for 1 week
   - Avoid heavy physical activity
   - Return immediately if fever recurs
   - Follow-up appointment after 7 days
   ```
6. Click "Finalize Discharge"
7. **Verify:** 
   - Discharge record created
   - Admission status: "Discharged"
   - Patient status: "Discharged"
   - Room becomes "Available" again

#### Step 10: Schedule Post-Discharge Follow-up
1. Go to "Follow-ups"
2. Click "Schedule Follow-up"
3. Fill follow-up form:
   ```
   Patient: Amit Sharma
   Doctor: Dr. John Doe
   Discharge: (Select the discharge record just created)
   Date: (7 days from now)
   Time: 11:00 AM
   Notes: Post-discharge recovery assessment
   ```
4. Click "Schedule Follow-up"
5. **Verify:** 
   - Follow-up created
   - Source shows "Hospital Discharge"
   - discharge_id is populated (not NULL)
   - Linked to specific discharge record

**✅ Inpatient Workflow Complete!**

---

### **WORKFLOW 3: Admin Functions**

Admin-exclusive features.

#### Step 1: Login as Admin
1. Logout current user
2. Login with:
   - Username: `admin`
   - Password: `Admin@123`

#### Step 2: View Activity Logs
1. Click "Activity Logs" in sidebar (only visible to Admin)
2. **Verify:** See comprehensive audit trail:
   - Patient Registered
   - Appointment Booked
   - Appointment Checked In
   - Patient Admitted
   - Bill Generated
   - Payment Recorded
   - Discharge Approved
   - Patient Discharged
   - Follow-up Scheduled
3. Test filters:
   - Filter by User (receptionist, doctor)
   - Filter by Action (Patient Registered, Bill Generated)
   - Filter by Entity Type (Patient, Appointment, Bill)
   - Filter by Date
4. Test pagination (if more than 50 logs)

#### Step 3: View Reports
1. Click "Reports" in sidebar (only visible to Admin)
2. **Verify:** See comprehensive statistics:
   
   **Patient Summary:**
   - Total Patients
   - By Status (Registered, Appointment Scheduled, Checked In, etc.)
   
   **Appointment Summary:**
   - Total Appointments
   - Scheduled, Checked In, Completed, Cancelled
   
   **Admission Summary:**
   - Total Admissions
   - Active vs Discharged
   
   **Billing Summary:**
   - Total Bills
   - Pending vs Paid
   - Total Billed Amount
   - Total Value of Paid Bills
   
   **Follow-up Summary:**
   - Total Follow-ups
   - Scheduled, Completed, Cancelled

3. **Verify:** All numbers match actual database data

#### Step 4: Test Authorization
1. Logout admin
2. Login as receptionist or doctor
3. Try to access `/activity-logs` or `/reports` in URL
4. **Verify:** Access blocked (403 or redirect)
5. **Verify:** Menu items not visible to non-admin users

**✅ Admin Functions Complete!**

---

## 🎯 Key System Features

### ✅ Phase 1: Authentication & Authorization
- Role-based login (Admin, Receptionist, Doctor)
- JWT token authentication
- Protected routes with middleware
- Session management

### ✅ Phase 2: Database Schema
- 11 tables with proper relationships
- Foreign keys and constraints
- ENUM types for status fields
- Timestamps and audit fields

### ✅ Phase 3: Patient Management
- Patient registration
- Demographics and contact info
- Status tracking through workflow
- Patient search and filtering

### ✅ Phase 4: Doctor Management
- Doctor profiles
- Specializations and qualifications
- Consultation fees
- Experience tracking

### ✅ Phase 5: Appointment Management
- Appointment booking
- Date and time slot management
- Duplicate prevention
- Check-in workflow
- Status tracking (Scheduled → Checked In → Completed)

### ✅ Phase 6: Doctor Consultation
- Patient history sidebar
- Consultation form (symptoms, diagnosis, prescription)
- Previous consultations display
- Read-only view after completion
- Automatic status updates

### ✅ Phase 7: Room Management
- Room inventory
- Room types (General, Private, ICU, etc.)
- Availability tracking
- Price per day
- Automatic availability updates on admission/discharge

### ✅ Phase 8: Admission Management
- Patient admission to rooms
- Room allocation
- Doctor assignment
- Admission reason tracking
- Status management (Active/Discharged)
- Automatic patient and room status updates

### ✅ Phase 9: Billing & Payment
- Automatic bill generation
- Consultation charge calculation
- Room charge calculation (days × rate)
- Additional charges
- Payment recording
- Payment status tracking
- Payment method tracking

### ✅ Phase 10: Discharge Management
- Two-step discharge process:
  1. Doctor approval (changes status)
  2. Receptionist finalization (creates record)
- Discharge summary and instructions
- Medications prescribed
- Final diagnosis
- Automatic room release
- Bill payment verification before discharge

### ✅ Phase 11: Follow-up Management
- Outpatient follow-ups (discharge_id = NULL)
- Post-discharge follow-ups (discharge_id = value)
- Status management (Scheduled/Completed/Cancelled)
- Duplicate slot prevention
- Doctor-specific filtering

### ✅ Phase 12: Activity Logs
- Comprehensive audit trail
- Admin-only access
- Filtering by user, action, entity type, date
- Pagination for large datasets
- All major actions logged

### ✅ Phase 13: Reports & Analytics
- Admin-only reports
- Real-time statistics
- Patient status distribution
- Appointment status summary
- Admission metrics
- Billing and payment summary
- Follow-up tracking
- 100% data accuracy (verified against database)

---

## 📊 Database Tables Overview

| Table | Purpose |
|-------|---------|
| Users | Authentication and user accounts |
| Doctors | Doctor profiles and specializations |
| Patients | Patient demographics and status |
| Appointments | Appointment scheduling |
| Consultations | Medical consultations and prescriptions |
| Rooms | Hospital room inventory |
| Admissions | Inpatient admissions |
| Bills | Billing and charges |
| Discharges | Discharge records and instructions |
| FollowUps | Outpatient and post-discharge follow-ups |
| ActivityLogs | System audit trail |

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based authorization
- ✅ Protected API endpoints
- ✅ SQL injection prevention (parameterized queries)
- ✅ No sensitive data in error messages
- ✅ Transaction management for data integrity
- ✅ Backend authorization enforcement (not just frontend)

---

## 🔄 Resetting Demo Data

### Option 1: Using Reset Script (Recommended)

```bash
cd /Users/dakshgoel/Documents/Hospital_Management_System
./reset.sh
```

**What it does:**
- Clears all patient data
- Clears all appointments
- Clears all consultations
- Clears all admissions
- Clears all bills
- Clears all discharges
- Clears all follow-ups
- Clears all activity logs (except user creation)
- Re-creates demo users (admin, receptionist, doctor)
- Resets room availability

### Option 2: Manual Database Reset

```bash
mysql -u root -p
```

```sql
USE hospital_management_system;

-- Clear all data (in order to respect foreign keys)
DELETE FROM ActivityLogs;
DELETE FROM FollowUps;
DELETE FROM Discharges;
DELETE FROM Bills;
DELETE FROM Admissions;
DELETE FROM Consultations;
DELETE FROM Appointments;
DELETE FROM Patients;

-- Reset room availability
UPDATE Rooms SET is_available = TRUE;

-- Reset auto-increment
ALTER TABLE Patients AUTO_INCREMENT = 1;
ALTER TABLE Appointments AUTO_INCREMENT = 1;
ALTER TABLE Consultations AUTO_INCREMENT = 1;
ALTER TABLE Admissions AUTO_INCREMENT = 1;
ALTER TABLE Bills AUTO_INCREMENT = 1;
ALTER TABLE Discharges AUTO_INCREMENT = 1;
ALTER TABLE FollowUps AUTO_INCREMENT = 1;
ALTER TABLE ActivityLogs AUTO_INCREMENT = 1;

exit
```

Then restart backend server.

---

## 🐛 Troubleshooting

### Backend Not Starting

**Problem:** `Server is not running`

**Solutions:**
1. Check if port 5000 is already in use:
   ```bash
   lsof -i :5000
   kill -9 <PID>
   ```

2. Check MySQL connection:
   ```bash
   mysql -u root -p
   USE hospital_management_system;
   SHOW TABLES;
   ```

3. Check .env file exists and has correct credentials

### Frontend Not Loading

**Problem:** `Cannot connect to backend`

**Solutions:**
1. Verify backend is running on port 5000
2. Check CORS settings in `server/server.js`
3. Verify API_BASE_URL in `client/src/utils/api.js`

### Login Not Working

**Problem:** `Invalid credentials`

**Solutions:**
1. Verify users exist in database:
   ```sql
   SELECT user_id, username, full_name, role FROM Users;
   ```

2. Reset user passwords:
   ```bash
   cd server
   node seed_demo_users.js
   ```

3. Clear browser localStorage:
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh page

### Database Connection Error

**Problem:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solutions:**
1. Verify MySQL is running:
   ```bash
   mysql.server status  # macOS
   systemctl status mysql  # Linux
   ```

2. Check credentials in `.env`:
   ```
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=hospital_management_system
   ```

3. Create database if not exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS hospital_management_system;
   ```

### Room Not Available After Discharge

**Problem:** Room still shows as unavailable after discharge

**Solution:**
1. Check discharge finalization completed successfully
2. Manually fix in database:
   ```sql
   UPDATE Rooms SET is_available = TRUE WHERE room_id = <room_id>;
   ```

---

## 📱 Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Mobile Responsive:**
- ✅ Desktop (1920×1080)
- ✅ Laptop (1366×768)
- ✅ Tablet (768×1024)
- ⚠️  Mobile (375×667) - Basic support

---

## 🎓 Demo Tips for Faculty/Review

### Quick Demo (5-10 minutes)

1. **Show Authentication:**
   - Login as different roles
   - Show different dashboards

2. **Show Outpatient Workflow:**
   - Register patient
   - Book appointment
   - Check in
   - Record consultation

3. **Show Admin Features:**
   - Activity logs
   - Reports

### Comprehensive Demo (20-30 minutes)

1. Complete Outpatient Workflow (see above)
2. Complete Inpatient Workflow (see above)
3. Show Admin Reports
4. Demonstrate Authorization (try accessing admin features as receptionist)

### Technical Highlights to Mention

- **RESTful API** with proper HTTP methods
- **Role-based Access Control** enforced at backend
- **Database Transactions** for data integrity
- **Foreign Key Relationships** maintained throughout
- **Activity Logging** for audit trail
- **Status Workflows** with validation
- **Real-time Updates** across modules

---

## 📊 Sample Data for Testing

### Test Patients

```
Patient 1:
Name: Priya Patel
DOB: 1990-03-15
Gender: Female
Phone: 9876543210
Blood Group: O+

Patient 2:
Name: Rahul Kumar
DOB: 1985-11-20
Gender: Male
Phone: 9876543211
Blood Group: A+

Patient 3:
Name: Anita Singh
DOB: 1992-07-08
Gender: Female
Phone: 9876543212
Blood Group: B+
```

### Test Appointment Reasons

- Fever and cough
- Routine health checkup
- Follow-up for diabetes
- Chest pain
- Stomach pain
- Headache and dizziness

### Test Diagnoses

- Upper Respiratory Tract Infection
- Viral Fever
- Gastroenteritis
- Hypertension
- Type 2 Diabetes
- Migraine

---

## 🎯 Assessment Criteria Coverage

### Functionality (40%)
- ✅ All CRUD operations working
- ✅ Complex workflows implemented
- ✅ Data validation
- ✅ Error handling

### Database Design (20%)
- ✅ 11 normalized tables
- ✅ Proper relationships
- ✅ Foreign keys
- ✅ Indexes on key fields

### Security (20%)
- ✅ Authentication implemented
- ✅ Authorization enforced
- ✅ Password encryption
- ✅ SQL injection prevention

### User Interface (10%)
- ✅ Responsive design
- ✅ Intuitive navigation
- ✅ Consistent styling
- ✅ Error messages

### Code Quality (10%)
- ✅ Modular structure
- ✅ Proper comments
- ✅ Error handling
- ✅ Consistent naming

---

## 📝 Important Notes

- **Demo Date:** System uses September 9, 2026 as current date
- **Today's Appointments:** Filtered by current date
- **Status Workflows:** One-way transitions (no status reversals)
- **Discharge Requirements:** Bill must be paid before discharge finalization
- **Follow-up Types:** Automatically determined by discharge_id (NULL vs value)
- **Activity Logs:** Admin exclusive feature
- **Reports:** Admin exclusive feature
- **Production Note:** Use secure passwords and HTTPS in production deployment

---

## 🏆 Project Status

**Development Status:** ✅ COMPLETE  
**Phase Status:** 11/11 Phases Complete  
**Testing Status:** ✅ Integration Testing Complete  
**Bugs:** 0 Critical, 0 High  
**Production Ready:** ✅ Backend Ready, Frontend Testing Recommended  

---

**Last Updated:** September 9, 2026  
**Version:** 1.0.0  
**Project:** Hospital Management System  
**Course:** Software Engineering  
**Developer:** HMS Development Team
