const express = require('express');
const cors = require('cors');
require('dotenv').config();

const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const roomRoutes = require('./routes/roomRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const billingRoutes = require('./routes/billingRoutes');
const dischargeRoutes = require('./routes/dischargeRoutes');
const followupRoutes = require('./routes/followupRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the Vite development server (port 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Mount test routes under /api
app.use('/api', testRoutes);

// Mount auth routes under /api/auth
app.use('/api/auth', authRoutes);

// Mount patient routes under /api/patients
app.use('/api/patients', patientRoutes);

// Mount doctor routes under /api/doctors
app.use('/api/doctors', doctorRoutes);

// Mount appointment routes under /api/appointments
app.use('/api/appointments', appointmentRoutes);

// Mount consultation routes under /api/appointments (nested)
app.use('/api/appointments', consultationRoutes);

// Mount room routes under /api/rooms
app.use('/api/rooms', roomRoutes);

// Mount admission routes under /api/admissions
app.use('/api/admissions', admissionRoutes);

// Mount billing routes under /api/bills
app.use('/api/bills', billingRoutes);

// Mount follow-up routes under /api/followups (MUST come before generic /api discharge routes)
app.use('/api/followups', followupRoutes);

// Mount discharge routes under /api/discharges and /api/admissions
app.use('/api/discharges', dischargeRoutes);
app.use('/api', dischargeRoutes);

// Handle requests to undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
