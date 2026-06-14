import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
            },

            price: {
                type: Number,
                required: true,
            },
        },
    ],

    totalAmount: {
        type: Number,
        required: true,
    },

    address: {
        fullName: {
            type: String,
            required: true,
        },

        street: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        zipCode: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },
    },

    razorpayOrderId: {
        type: String,
    },

    paymentId: {
        type: String,
    },

    paymentSignature: {
        type: String,
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed",
        ],
        default: "pending",
    },

    paymentMethod: {
        type: String,
        enum: [
            "COD",
            "Razorpay",
        ],
        default: "Razorpay",
    },

    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "shipped",
            "completed",
            "cancelled",
        ],
        default: "pending",
    },
    couponCode: {
        type: String,
        default: "",
    },
    discountAmount: {
        type: Number,
        default: 0,
    },

},
{
    timestamps: true,
});

const Order = mongoose.model(
    "Order",
    orderSchema
);

export default Order;