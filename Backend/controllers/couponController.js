import Coupon from '../models/Coupon.js';

// Validate and apply a coupon code
const validateCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        
        if (!code || !subtotal) {
            return res.status(400).json({ message: 'Coupon code and subtotal are required.' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon || !coupon.isActive) {
            return res.status(400).json({ message: 'Invalid coupon code.' });
        }

        // Check expiration
        const currentDate = new Date();
        if (coupon.expiryDate && currentDate > new Date(coupon.expiryDate)) {
            return res.status(400).json({ message: 'This coupon code has expired.' });
        }

        // Check minimum order amount requirement
        if (subtotal < coupon.minOrderAmount) {
            return res.status(400).json({ 
                message: `Minimum order value of ₹${coupon.minOrderAmount} is required to apply this coupon.` 
            });
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        } else if (coupon.discountType === 'fixed') {
            discountAmount = Math.min(coupon.discountValue, subtotal);
        }

        res.status(200).json({
            success: true,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { validateCoupon };
