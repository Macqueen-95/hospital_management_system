# Hospital Management System - Demo Guide

## 🎯 50% Submission - Complete Workflow Demo

This guide demonstrates the core workflow implemented in Phase 1-6 of the HMS project.

---

## 🚀 Starting the Application

### Step 1: Start Backend Server
```bash
cd server
node server.js
```
**Expected Output:** `Server is running on http://localhost:5000`

### Step 2: Start Frontend Application
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
- **Access:** Full system access including user management and all modules

### Receptionist Account
- **Username:** `receptionist`
- **Password:** `Receptionist@123`
- **Access:** Patient registration, appointment booking, check-in operations

### Doctor Account
- **Username:** `doctor`
- **Password:** `Doctor@123`
- **Access:** Today's appointments, patient consultation, medical records

---

## 🎬 Complete Demo Workflow for Faculty

### **PART 1: Receptionist Operations** (Front Desk)

#### Step 1: Login as Receptionist
1. Open the application homepage
2. Click "Login" button
3. Enter credentials:
   - Username: `receptionist`
   - Password: `Receptionist@123`
4. Click "Login"
5. **Verify:** Dashboard shows "Receptionist Dashboard"

#### Step 2: Register a New Patient
1. Click "Patients" in the sidebar
2. Click "Register New Patient" button
3. Fill in patient details:
   ```
   Full Name: Raj Kumar
   Date of Birth: 1990-05-15
   Gender: Male
   Phone: 9876543210
   Email: raj.kumar@email.com
   Blood Group: O+
   Address: 123 MG Road, Delhi
   Emergency Contact: Priya Kumar
   Emergency Phone: 9876543211
   ```
4. Click "Register Patient"
5. **Verify:** Success message appears, patient added to the list

#### Step 3: Book an Appointment for Today
1. Stay on Patients page
2. Find the newly registered patient "Raj Kumar"
3. Click "Book Appointment" button next to the patient
4. Fill appointment details:
   ```
   Doctor: Dr. John Smith (or available doctor)
   Date: (Select TODAY - September 9, 2026)
   Time: 10:00 AM (or any available slot)
   Type: Consultation
   Reason: Fever and headache
   ```
5. Click "Book Appointment"
6. **Verify:** Success message, appointment created

#### Step 4: Check-In the Patient
1. Click "Appointments" in the sidebar
2. Find the appointment for "Raj Kumar" (Status: Scheduled)
3. Click on the appointment to open details
4. Click "Check In" button
5. **Verify:** 
   - Appointment status changes to "Checked In"
   - Button changes to "Checked In" (disabled)

#### Step 5: Logout
1. Click profile icon/dropdown in top-right
2. Click "Logout"

---

### **PART 2: Doctor Operations** (Clinical Consultation)

#### Step 6: Login as Doctor
1. Click "Login" on homepage
2. Enter credentials:
   - Username: `doctor`
   - Password: `Doctor@123`
3. Click "Login"
4. **Verify:** Dashboard shows "Doctor Dashboard"

#### Step 7: View Today's Appointments
1. Click "Today's Appointments" in the sidebar
2. **Verify:** See the appointment for "Raj Kumar" with status "Checked In"
3. Note: Only today's appointments (Sept 9, 2026) are displayed

#### Step 8: Start Consultation
1. Click on the "Raj Kumar" appointment card
2. On Appointment Details page, click "Start Consultation" button
3. **Verify:** Redirected to Consultation Page

#### Step 9: Review Patient History (Sidebar)
1. Left sidebar shows patient information:
   - Patient Name: Raj Kumar
   - Age: 36 years
   - Blood Group: O+
   - Contact: 9876543210
2. Scroll down to see "Previous Consultations" section
3. **Note:** No previous consultations for new patient

#### Step 10: Record Consultation
1. In the main consultation form, fill:
   ```
   Chief Complaint: Fever and severe headache for 3 days
   
   Symptoms: 
   - High fever (102°F)
   - Persistent headache
   - Body ache
   - Mild cough
   
   Diagnosis: Viral fever with upper respiratory tract infection
   
   Prescription:
   1. Paracetamol 650mg - 3 times daily after meals
   2. Cetirizine 10mg - Once daily at night
   3. Vitamin C tablets - Once daily
   
   Notes: 
   - Take complete rest for 3 days
   - Drink plenty of fluids
   - Avoid cold foods
   - Follow-up if fever persists beyond 3 days
   ```
2. Click "Save Consultation" button
3. **Verify:** 
   - Success message appears
   - Redirected back to appointment details
   - Appointment status changes to "Completed"

#### Step 11: Verify Consultation Recorded
1. Click "Start Consultation" button again (now shows saved consultation)
2. **Verify:** 
   - All consultation details displayed in read-only mode
   - Can view but cannot edit
   - Form shows previously entered diagnosis and prescription

#### Step 12: Logout
1. Click profile dropdown
2. Click "Logout"

---

### **PART 3: Verification** (Optional - Show to Faculty)

#### Verify as Receptionist
1. Login as receptionist again
2. Go to Appointments page
3. Find "Raj Kumar" appointment
4. **Verify:** Status is "Completed"
5. Click to view details
6. **Verify:** Shows "Completed" status and consultation recorded

#### Verify Patient Status
1. Go to Patients page
2. Find "Raj Kumar"
3. **Verify:** Patient status is "Consultation Completed"

---

## 🎯 Key Features Demonstrated

### Phase 1: Authentication & Authorization ✅
- Role-based login (Admin, Receptionist, Doctor)
- JWT token-based authentication
- Protected routes and middleware

### Phase 2: Patient Management ✅
- Patient registration with complete details
- Patient listing and search
- Patient status tracking

### Phase 3: Appointment Scheduling ✅
- Book appointments for specific date/time
- Appointment type and reason tracking
- Appointment status workflow

### Phase 4: Check-In System ✅
- Receptionist check-in capability
- Status updates (Scheduled → Checked In)
- Real-time status reflection

### Phase 5: Doctor Dashboard ✅
- Today's appointments view
- Filter by current date
- Doctor-specific appointment access

### Phase 6: Consultation Recording ✅
- Patient history sidebar
- Consultation form (chief complaint, symptoms, diagnosis, prescription)
- Previous consultations display
- Read-only view after completion
- Automatic status updates (Checked In → Completed)
- Patient status update to "Consultation Completed"

---

## 📊 Database Tables Used

1. **Users** - Authentication (admin, receptionist, doctor)
2. **Doctors** - Doctor profiles and specializations
3. **Patients** - Patient registration and demographics
4. **Appointments** - Appointment scheduling and status
5. **Consultations** - Medical consultations and prescriptions

---

## 🎓 Faculty Talking Points

### Technical Implementation:
- **Backend:** Node.js + Express.js REST API
- **Frontend:** React.js with React Router
- **Database:** MySQL with proper foreign key relationships
- **Authentication:** JWT tokens with role-based access control
- **State Management:** React hooks (useState, useEffect)
- **Security:** Password hashing (bcrypt), protected routes

### Workflow Highlights:
- **Seamless Role Transitions:** Different users see different interfaces
- **Status Tracking:** Real-time appointment status updates
- **Data Integrity:** MySQL transactions for consultation saves
- **User Experience:** Intuitive navigation, clear status indicators

### Future Enhancements (Beyond 50%):
- Billing module integration
- Patient admission and discharge
- Room management
- Follow-up appointments
- Reports and analytics
- Email/SMS notifications

---

## 🔄 Resetting Demo Data

To reset and start fresh demo:

```bash
cd /Users/dakshgoel/Documents/Hospital_Management_System
./reset.sh
```

This will:
- Clear all patient data
- Clear all appointments
- Clear all consultations
- Re-create demo users (admin, receptionist, doctor)

---

## 📝 Notes

- **Current Date:** Demo is set for September 9, 2026
- **Today's Appointments:** Only shows appointments for the current date
- **One Consultation per Appointment:** Each appointment can have only one consultation
- **Status Workflow:** Scheduled → Checked In → Completed
- **Credentials:** For demo purposes only, use secure passwords in production

---

**Prepared for:** 50% Submission Demo  
**Date:** September 9, 2026  
**Project:** Hospital Management System
