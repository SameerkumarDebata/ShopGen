import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const createdOrder = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save Razorpay Order ID
        await Order.findByIdAndUpdate(orderId, {
            razorpayOrderId: razorpayOrder.id,
        });

        res.status(200).json({
            success: true,
            order: razorpayOrder,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Verify Payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        const generated_signature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id +
                "|" +
                razorpay_payment_id
            )
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment Verification Failed",
            });
        }

        await Order.findByIdAndUpdate(
            orderId,
            {
                paymentId: razorpay_payment_id,
                paymentSignature: razorpay_signature,
                paymentStatus: "paid",
                status: "processing",
            }
        );

        res.status(200).json({
            success: true,
            message: "Payment Verified Successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    createdOrder,
    verifyPayment,
};