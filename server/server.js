const express = require('express');
const cors = require('cors');
require('dotenv').config();

const testRoutes = require('./routes/testRoutes');

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

// Handle requests to undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
