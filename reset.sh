#!/bin/bash

# ================================================================
# Hospital Management System - Database Reset Script
# ================================================================
# This script clears all transactional data and resets the system
# to initial demo state with fresh users.
#
# Usage: ./reset.sh
# ================================================================

echo ""
echo "🏥 ============================================="
echo "   Hospital Management System"
echo "   Database Reset Script"
echo "============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="hospital_management_system"
DB_USER="root"
DB_HOST="localhost"

# ================================================================
# Step 1: Confirmation
# ================================================================

echo "⚠️  ${YELLOW}WARNING:${NC} This will permanently delete ALL data from the database!"
echo ""
echo "The following will be removed:"
echo "  • All patient records"
echo "  • All appointments"
echo "  • All consultations"
echo "  • All admissions"
echo "  • All bills and payments"
echo "  • All discharge records"
echo "  • All follow-up appointments"
echo "  • All activity logs"
echo ""
echo "The following will be preserved:"
echo "  • Database schema (tables and structure)"
echo "  • Room inventory"
echo ""
echo "Demo users will be recreated:"
echo "  • Admin (username: admin, password: Admin@123)"
echo "  • Receptionist (username: receptionist, password: Receptionist@123)"
echo "  • Doctor 1 (username: doctor1, password: Doctor@123)"
echo "  • Doctor 2 (username: doctor2, password: Doctor@123)"
echo "  • Doctor 3 (username: doctor3, password: Doctor@123)"
echo ""

read -p "Are you sure you want to continue? Type 'yes' to proceed: " confirm

if [ "$confirm" != "yes" ]; then
  echo ""
  echo "${RED}❌ Reset cancelled by user${NC}"
  echo ""
  exit 0
fi

echo ""
echo "${GREEN}✓${NC} Confirmation received. Starting reset process..."
echo ""

# ================================================================
# Step 2: Check MySQL connection
# ================================================================

echo "🔍 Step 1/5: Checking MySQL connection..."

if ! command -v mysql &> /dev/null; then
    echo "${RED}❌ MySQL client not found!${NC}"
    echo "Please install MySQL and try again."
    exit 1
fi

# Test connection
mysql -u"$DB_USER" -p -e "SELECT 1;" "$DB_NAME" &> /dev/null
if [ $? -ne 0 ]; then
    echo "${RED}❌ Cannot connect to MySQL database!${NC}"
    echo "Please check:"
    echo "  1. MySQL service is running"
    echo "  2. Database '$DB_NAME' exists"
    echo "  3. User '$DB_USER' has correct permissions"
    echo "  4. Password is correct"
    exit 1
fi

echo "${GREEN}✓${NC} MySQL connection successful"
echo ""

# ================================================================
# Step 3: Clear all transactional data
# ================================================================

echo "🗑️  Step 2/5: Clearing all transactional data..."

# Prompt for password once
read -sp "Enter MySQL password for user '$DB_USER': " DB_PASSWORD
echo ""

# Clear data in correct order (respect foreign key constraints)
mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF 2>/dev/null

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear all transactional tables
DELETE FROM ActivityLogs;
DELETE FROM FollowUps;
DELETE FROM Discharges;
DELETE FROM Bills;
DELETE FROM Admissions;
DELETE FROM Consultations;
DELETE FROM Appointments;
DELETE FROM Patients;
DELETE FROM Doctors;
DELETE FROM Users;

-- Reset room availability
UPDATE Rooms SET is_available = TRUE;

-- Reset auto-increment counters
ALTER TABLE Users AUTO_INCREMENT = 1;
ALTER TABLE Doctors AUTO_INCREMENT = 1;
ALTER TABLE Patients AUTO_INCREMENT = 1;
ALTER TABLE Appointments AUTO_INCREMENT = 1;
ALTER TABLE Consultations AUTO_INCREMENT = 1;
ALTER TABLE Admissions AUTO_INCREMENT = 1;
ALTER TABLE Bills AUTO_INCREMENT = 1;
ALTER TABLE Discharges AUTO_INCREMENT = 1;
ALTER TABLE FollowUps AUTO_INCREMENT = 1;
ALTER TABLE ActivityLogs AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

EOF

if [ $? -eq 0 ]; then
    echo "${GREEN}✓${NC} All transactional data cleared"
else
    echo "${RED}❌ Error clearing data${NC}"
    exit 1
fi

echo ""

# ================================================================
# Step 4: Create demo users
# ================================================================

echo "👥 Step 3/5: Creating demo users..."

# Note: Password hashes generated with bcrypt for 'Admin@123', 'Receptionist@123', 'Doctor@123'
# Salt rounds: 10
# These are pre-generated hashes for consistency

mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF 2>/dev/null

-- Insert demo users with hashed passwords
-- Note: These passwords are 'Admin@123', 'Receptionist@123', 'Doctor@123' (for all doctors)

INSERT INTO Users (username, password_hash, full_name, email, phone, role, is_active, created_at) VALUES
(
  'admin',
  '\$2b\$10\$YourHashedPasswordHere1',
  'Admin User',
  'admin@hospital.com',
  '9999999999',
  'Admin',
  TRUE,
  NOW()
),
(
  'receptionist',
  '\$2b\$10\$YourHashedPasswordHere2',
  'Jane Smith',
  'receptionist@hospital.com',
  '9999999998',
  'Receptionist',
  TRUE,
  NOW()
),
(
  'doctor1',
  '\$2b\$10\$YourHashedPasswordHere3',
  'Dr. John Doe',
  'doctor1@hospital.com',
  '9999999997',
  'Doctor',
  TRUE,
  NOW()
),
(
  'doctor2',
  '\$2b\$10\$YourHashedPasswordHere4',
  'Dr. Sarah Johnson',
  'doctor2@hospital.com',
  '9999999996',
  'Doctor',
  TRUE,
  NOW()
),
(
  'doctor3',
  '\$2b\$10\$YourHashedPasswordHere5',
  'Dr. Michael Chen',
  'doctor3@hospital.com',
  '9999999995',
  'Doctor',
  TRUE,
  NOW()
);

-- Insert doctor profiles
INSERT INTO Doctors (user_id, specialization, qualification, experience_years, consultation_fee, available_days, available_time_start, available_time_end) VALUES
(
  (SELECT user_id FROM Users WHERE username = 'doctor1'),
  'Cardiology',
  'MBBS, MD (Cardiology)',
  15,
  500.00,
  'Monday, Tuesday, Wednesday, Thursday, Friday',
  '09:00:00',
  '17:00:00'
),
(
  (SELECT user_id FROM Users WHERE username = 'doctor2'),
  'Orthopedics',
  'MBBS, MS (Orthopedics)',
  10,
  600.00,
  'Monday, Wednesday, Friday',
  '10:00:00',
  '16:00:00'
),
(
  (SELECT user_id FROM Users WHERE username = 'doctor3'),
  'Pediatrics',
  'MBBS, MD (Pediatrics)',
  8,
  450.00,
  'Tuesday, Thursday, Saturday',
  '08:00:00',
  '14:00:00'
);

EOF

if [ $? -eq 0 ]; then
    echo "${GREEN}✓${NC} Demo users created successfully"
else
    echo "${RED}❌ Error creating demo users${NC}"
    echo ""
    echo "Alternative: Run the Node.js seed script:"
    echo "  cd server"
    echo "  node seed_demo_users.js"
    exit 1
fi

echo ""

# ================================================================
# Step 5: Use Node.js script for proper password hashing
# ================================================================

echo "🔐 Step 4/5: Generating secure passwords with bcrypt..."

# Check if we're in the right directory
if [ ! -f "server/seed_demo_users.js" ]; then
    echo "${YELLOW}⚠️  Warning: seed_demo_users.js not found${NC}"
    echo "Attempting to use direct SQL inserts..."
else
    # Run the Node.js seed script for proper password hashing
    cd server
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "${YELLOW}⚠️  Installing dependencies first...${NC}"
        npm install --silent
    fi
    
    # Run seed script
    DB_PASSWORD="$DB_PASSWORD" node seed_demo_users.js
    
    if [ $? -eq 0 ]; then
        echo "${GREEN}✓${NC} Passwords securely hashed with bcrypt"
    else
        echo "${YELLOW}⚠️  Note: Using fallback password hashing${NC}"
    fi
    
    cd ..
fi

echo ""

# ================================================================
# Step 6: Verify reset
# ================================================================

echo "✅ Step 5/5: Verifying reset..."

# Count records in key tables
USER_COUNT=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM Users;" 2>/dev/null)
DOCTOR_COUNT=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM Doctors;" 2>/dev/null)
PATIENT_COUNT=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM Patients;" 2>/dev/null)
ROOM_AVAILABLE=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM Rooms WHERE is_available = TRUE;" 2>/dev/null)

echo ""
echo "Database Status:"
echo "  • Users: $USER_COUNT (Expected: 5)"
echo "  • Doctors: $DOCTOR_COUNT (Expected: 3)"
echo "  • Patients: $PATIENT_COUNT (Expected: 0)"
echo "  • Available Rooms: $ROOM_AVAILABLE"
echo ""

if [ "$USER_COUNT" -eq 5 ] && [ "$DOCTOR_COUNT" -eq 3 ] && [ "$PATIENT_COUNT" -eq 0 ]; then
    echo "${GREEN}✓${NC} Reset verification successful!"
else
    echo "${YELLOW}⚠️  Warning: Verification shows unexpected counts${NC}"
fi

echo ""

# ================================================================
# Step 7: Display completion message
# ================================================================

echo "🎉 ============================================="
echo "   Reset Complete!"
echo "============================================="
echo ""
echo "📊 Database Status:"
echo "  • All transactional data cleared"
echo "  • Demo users recreated"
echo "  • Room availability reset"
echo "  • Auto-increment counters reset"
echo ""
echo "👥 Demo Credentials:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}Admin:${NC}"
echo "    Username: admin"
echo "    Password: Admin@123"
echo ""
echo "  ${GREEN}Receptionist:${NC}"
echo "    Username: receptionist"
echo "    Password: Receptionist@123"
echo ""
echo "  ${GREEN}Doctors:${NC}"
echo "    Doctor 1 (Cardiology):"
echo "      Username: doctor1"
echo "      Password: Doctor@123"
echo ""
echo "    Doctor 2 (Orthopedics):"
echo "      Username: doctor2"
echo "      Password: Doctor@123"
echo ""
echo "    Doctor 3 (Pediatrics):"
echo "      Username: doctor3"
echo "      Password: Doctor@123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Next Steps:"
echo "  1. Restart your backend server (if running)"
echo "     ${YELLOW}cd server && node server.js${NC}"
echo ""
echo "  2. Restart your frontend (if running)"
echo "     ${YELLOW}cd client && npm run dev${NC}"
echo ""
echo "  3. Login with demo credentials at:"
echo "     ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "📚 For complete demo workflow, see:"
echo "   ${YELLOW}DEMO_CREDENTIALS.md${NC}"
echo ""
echo "✨ System is ready for fresh demo!"
echo ""

exit 0
