import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview } from '../controllers/productController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// All products
router.route('/').get(getProducts).post(protect, admin, upload.any(), createProduct);

// Specific product
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.any(), updateProduct)  // ← added upload.any()
    .delete(protect, admin, deleteProduct);

// Product reviews
router.route('/:id/reviews').post(protect, createProductReview);

export default router;