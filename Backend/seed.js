import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Coupon from "./models/Coupon.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Create Admin User
    await User.create({
      name: "Admin User",
      email: "admin@shopgen.com",
      password: hashedPassword,
      role: "admin",
      verified: true,
    });

    // Create Sample User
    await User.create({
      name: "Sameer Debata",
      email: "sameer@shopgen.com",
      password: hashedPassword,
      role: "user",
      verified: true,
    });

    // Sample Products
    const products = [
      {
        name: "Wireless Noise Cancelling Headphones",
        description:
          "Premium wireless headphones with active noise cancellation.",
        price: 9999,
        category: "Electronics",
        stock: 20,
        imageUrls:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        rating: 4.8,
        numReviews: 120,
      },
      {
        name: "Gaming Mechanical Keyboard",
        description:
          "RGB mechanical keyboard for gaming and productivity.",
        price: 4999,
        category: "Electronics",
        stock: 35,
        imageUrls:
          "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
        rating: 4.6,
        numReviews: 75,
      },
      {
        name: "Apple Watch Series",
        description:
          "Smart watch with fitness and health tracking.",
        price: 29999,
        category: "Wearables",
        stock: 15,
        imageUrls:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        rating: 4.9,
        numReviews: 150,
      },
      {
        name: "Classic White Sneakers",
        description:
          "Comfortable everyday sneakers.",
        price: 2999,
        category: "Fashion",
        stock: 50,
        imageUrls:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        rating: 4.5,
        numReviews: 90,
      },
      {
        name: "HP Pavilion Laptop",
        description:
          "15.6-inch laptop with Intel Core i5 processor.",
        price: 64999,
        category: "Computers",
        stock: 10,
        imageUrls:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        rating: 4.7,
        numReviews: 65,
      },
      {
        name: "Bluetooth Speaker",
        description:
          "Portable speaker with powerful bass.",
        price: 3499,
        category: "Electronics",
        stock: 40,
        imageUrls:
          "https://images.unsplash.com/photo-1589003077984-894e133dabab",
        rating: 4.4,
        numReviews: 55,
      },
    ];

    await Product.insertMany(products);

    // Seed Sample Coupons
    const coupons = [
      {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 1000,
        expiryDate: new Date("2028-12-31"),
        isActive: true,
      },
      {
        code: "BIGDEAL25",
        discountType: "percentage",
        discountValue: 25,
        minOrderAmount: 5000,
        expiryDate: new Date("2028-12-31"),
        isActive: true,
      },
      {
        code: "SAVE500",
        discountType: "fixed",
        discountValue: 500,
        minOrderAmount: 3000,
        expiryDate: new Date("2028-12-31"),
        isActive: true,
      }
    ];

    await Coupon.insertMany(coupons);

    console.log("✅ Dummy data imported successfully!");
    console.log("==================================");
    console.log("Admin Login:");
    console.log("Email: admin@shopgen.com");
    console.log("Password: password123");
    console.log("==================================");
    console.log("User Login:");
    console.log("Email: sameer@shopgen.com");
    console.log("Password: password123");
    console.log("==================================");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

importData();