import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import sendEmail from "../utils/sendEmail.js";

// create a new order

 const createOrder = async (req, res) => {

    try {
        const { items, address, paymentId, couponCode, paymentMethod } = req.body;
        if(!items || items.length === 0 || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Fetch product details and calculate secure subtotal
        let subtotal = 0;
        const dbItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }
            
            const price = product.price;
            subtotal += price * item.quantity;
            dbItems.push({
                productId: product._id,
                quantity: item.quantity,
                price
            });
        }

        // Validate coupon if provided
        let discountAmount = 0;
        let appliedCouponCode = "";

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (coupon) {
                const currentDate = new Date();
                const isNotExpired = !coupon.expiryDate || currentDate <= new Date(coupon.expiryDate);
                const isMinAmountSatisfied = subtotal >= coupon.minOrderAmount;

                if (isNotExpired && isMinAmountSatisfied) {
                    appliedCouponCode = coupon.code;
                    if (coupon.discountType === 'percentage') {
                        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
                    } else if (coupon.discountType === 'fixed') {
                        discountAmount = Math.min(coupon.discountValue, subtotal);
                    }
                }
            }
        }

        const totalAmount = subtotal - discountAmount;

        const order = new Order({
            user: req.user._id,
            items: dbItems,
            totalAmount,
            address,
            paymentId,
            paymentMethod: paymentMethod || "Razorpay",
            paymentStatus: "pending",
            status: (paymentMethod === "COD") ? "processing" : "pending",
            couponCode: appliedCouponCode,
            discountAmount
        });

        await order.save();

        // Reduce product stock
        for (const item of dbItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        const paymentMsg = (paymentMethod === "COD")
            ? "Payment Method: Cash on Delivery (Please pay in cash upon delivery)."
            : "Payment Method: Razorpay (Paid Online).";
        const message = `Your order with ID ${order._id} has been created successfully.\nTotal Amount: ₹${totalAmount}.\n${paymentMsg}`;
        await sendEmail(req.user.email, "Order Created", message);
        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all my orders
const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.productId", "name price");
        res.json(orders);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//get all orders (admin)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "id name")
            .populate("items.productId", "name price imageUrls");
        res.json(orders);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//update order status (admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        if (status === "completed" && order.paymentMethod === "COD") {
            order.paymentStatus = "paid";
        }
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createOrder, myOrders, getOrders, updateOrderStatus };
