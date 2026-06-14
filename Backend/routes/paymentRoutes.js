import express from 'express';
import { createdOrder,
    verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();


router.post('/order',createdOrder);
router.post('/verify',verifyPayment);

export default router;