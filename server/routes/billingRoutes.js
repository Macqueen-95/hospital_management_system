const express = require('express');
const router = express.Router();
const {
  getAllBills,
  getBillById,
  generateBill,
  recordPayment
} = require('../controllers/billingController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication

// GET /api/bills - All authenticated users can view bills
router.get('/', authenticate, getAllBills);

// GET /api/bills/:id - All authenticated users can view bill details
router.get('/:id', authenticate, getBillById);

// POST /api/bills - Only Admin and Receptionist can generate bills
router.post('/', authenticate, authorizeRoles('Admin', 'Receptionist'), generateBill);

// PUT /api/bills/:id/payment - Only Admin and Receptionist can record payments
router.put('/:id/payment', authenticate, authorizeRoles('Admin', 'Receptionist'), recordPayment);

module.exports = router;
