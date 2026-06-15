import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/helpers.js';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  // Close drawer on pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Disable body scrolling when drawer is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, setIsCartOpen]);

  // Click outside drawer to close
  const handleBackdropClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      setIsCartOpen(false);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={handleBackdropClick}
        className={`fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Sliding Panel */}
        <div
          ref={drawerRef}
          className={`fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-slate-100 dark:border-slate-800 ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Shopping Cart</h2>
              <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-100 dark:border-slate-800">
                    <img
                      src={item.imageUrls ? item.imageUrls.split(',')[0] : 'https://placehold.co/100x100?text=No+Image'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        <Link to={`/products/${item._id}`} onClick={() => setIsCartOpen(false)}>
                          {item.name}
                        </Link>
                      </h4>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                        {formatPrice(item.price)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2 py-1 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-350 transition-colors cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-1 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-350 transition-colors cursor-pointer"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center border border-slate-150 dark:border-slate-800 shadow-inner">
                  <svg className="w-7 h-7 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Your cart is empty</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Subtotal</span>
                <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Shipping fees and coupon discounts are calculated at the secure checkout step.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm cursor-pointer hover:shadow-lg hover:shadow-teal-500/10 active:scale-99"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center border-2 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
