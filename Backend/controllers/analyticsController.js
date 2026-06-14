import Order from "../models/Order.js";
import User from '../models/User.js';
import Product from '../models/Product.js';

const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'user' });

    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    // Get products with low stock (<= 10 units)
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
      .select('name stock price category')
      .limit(10);

    // Calculate monthly revenue trend for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentOrders = await Order.find({
      createdAt: { $gte: sixMonthsAgo }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const salesTrend = [];
    
    // Initialize 6 months array in order
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth();
      salesTrend.push({
        month: monthNames[month],
        year,
        revenue: 0,
        orders: 0
      });
    }

    recentOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      const match = salesTrend.find(item => item.month === monthNames[orderMonth] && item.year === orderYear);
      if (match) {
        match.revenue += order.totalAmount;
        match.orders += 1;
      }
    });

    res.json({ 
      totalOrders, 
      totalProducts, 
      totalUsers, 
      totalRevenue,
      lowStockProducts,
      salesTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default getAdminStats;

