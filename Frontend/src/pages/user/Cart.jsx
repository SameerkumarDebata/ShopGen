import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-slate-850 dark:text-slate-150 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Add some amazing products to your cart first.</p>
        <Link to="/products" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-8 tracking-tight">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl gap-4 shadow-sm">
              <img src={item.imageUrls ? item.imageUrls.split(',')[0] : 'https://via.placeholder.com/150'} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-slate-100 dark:bg-slate-700" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{item.name}</h3>
                <p className="text-teal-650 dark:text-teal-400 font-bold mt-1">₹{item.price}</p>
              </div>
              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-350 dark:border-slate-650 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden">
                <button onClick={() => removeFromCart(item._id, 1)} className="px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-black cursor-pointer">-</button>
                <span className="px-3 font-bold text-slate-800 dark:text-slate-200">{item.quantity}</span>
                <button onClick={() => addToCart(item, 1)} className="px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-black cursor-pointer">+</button>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer">
            Clear Entire Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 h-fit shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-150 mb-4">Order Summary</h2>
          <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-teal-650 dark:text-teal-400 font-bold">Free</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">
            <span>Total Amount</span>
            <span>₹{getCartTotal()}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 rounded-xl transition-all shadow-md mt-2 cursor-pointer text-center">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;