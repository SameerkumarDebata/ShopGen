import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { getOrders, myOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// All orders(Admin)
router.route('/').get(protect, admin, getOrders).post(protect, createOrder);

//myOrders
router.route('/myorders').get(protect, myOrders);

// Specific order(Admin)
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;