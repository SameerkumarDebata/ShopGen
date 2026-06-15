import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import CartDrawer from './components/common/CartDrawer.jsx';

// Public Pages
import Home from './pages/public/Home.jsx';
import Products from './pages/public/Products.jsx';
import ProductDetail from './pages/public/ProductDetail.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Offers from './pages/public/Offers.jsx';

// User Pages
import Cart from './pages/user/Cart.jsx';
import Checkout from './pages/user/Checkout.jsx';
import MyOrders from './pages/user/MyOrders.jsx';
import Wishlist from './pages/user/Wishlist.jsx';

// Admin Pages
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/offers" element={<Offers />} />

          {/* Protected User */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default App;