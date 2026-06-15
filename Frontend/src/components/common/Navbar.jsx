import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

const Navbar = () => {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                ShopNest
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCatMenuOpen(true)}
              onMouseLeave={() => setCatMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium text-slate-605 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-2 cursor-pointer focus:outline-none"
              >
                Categories
                <svg className={`w-3.5 h-3.5 transition-transform duration-205 ${catMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {catMenuOpen && (
                <div className="absolute left-0 mt-0 w-48 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  {['Electronics', 'Wearables', 'Fashion', 'Computers'].map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${cat}`}
                      onClick={() => setCatMenuOpen(false)}
                      className="block px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-205 hover:bg-teal-50 dark:hover:bg-slate-700/60 hover:text-teal-650 dark:hover:text-teal-400 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-705 my-1" />
                  <Link
                    to="/products"
                    onClick={() => setCatMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-bold text-teal-650 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors"
                  >
                    View All Products &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/products"
              className={`text-sm font-medium transition-colors ${
                isActive('/products') 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-slate-605 dark:text-slate-300 hover:text-teal-650 dark:hover:text-teal-400'
              }`}
            >
              Products
            </Link>

            {isLoggedIn && !isAdmin && (
              <Link
                to="/my-orders"
                className={`text-sm font-medium transition-colors ${
                  isActive('/my-orders') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                My Orders
              </Link>
            )}

            {isLoggedIn && isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`text-sm font-semibold px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors`}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 dark:text-slate-350 hover:text-teal-650 dark:hover:text-teal-400 transition-colors cursor-pointer"
              title="View Wishlist"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-white bg-rose-500 rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-605 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer focus:outline-none"
              title="Open Shopping Cart"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-black leading-none text-white bg-teal-500 rounded-full transform translate-x-1/2 -translate-y-1/2 shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-650 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus:outline-none cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-400">Welcome,</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200/50 dark:border-slate-700/50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-650 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus:outline-none cursor-pointer"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Cart Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-teal-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/') ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/products') ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/wishlist') ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Wishlist ({wishlistItems.length})
            </Link>

            {isLoggedIn && !isAdmin && (
              <Link
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/my-orders') ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                My Orders
              </Link>
            )}

            {isLoggedIn && isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
              >
                Admin Panel
              </Link>
            )}

            <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2" />

            {isLoggedIn ? (
              <div className="px-3 py-2">
                <div className="flex flex-col mb-3">
                  <span className="text-xs text-slate-400">Welcome,</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-200/50 dark:border-slate-700/50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
