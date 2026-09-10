#!/bin/bash

# HMS Database Reset Script
# This script clears all data and re-seeds demo users

echo "🏥 Hospital Management System - Database Reset"
echo "=============================================="
echo ""
echo "⚠️  WARNING: This will delete ALL data!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Reset cancelled"
  exit 0
fi

echo ""
echo "📦 Step 1: Clearing all tables..."
cd server
node reset_database.js

if [ $? -ne 0 ]; then
  echo "❌ Failed to reset database"
  exit 1
fi

echo ""
echo "👥 Step 2: Seeding demo users..."
node seed_demo_users.js

if [ $? -ne 0 ]; then
  echo "❌ Failed to seed demo users"
  exit 1
fi

echo ""
echo "✅ Reset complete!"
echo ""
echo "Demo Credentials:"
echo "─────────────────────────────────"
echo "Admin:        username: admin        password: Admin@123"
echo "Receptionist: username: receptionist password: Receptionist@123"
echo "Doctor:       username: doctor       password: Doctor@123"
echo ""
echo "🚀 You can now restart your backend server and test with fresh data!"
