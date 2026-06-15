import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error('Product is out of stock.');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6 text-rose-500 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          My Wishlist
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Keep track of the products you love and want to buy later.</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-150 dark:border-slate-700/80 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Remove Button (absolute on card) */}
              <button
                onClick={() => {
                  removeFromWishlist(product._id);
                  toast.success('Removed from wishlist');
                }}
                className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 text-slate-400 hover:text-red-500 shadow-sm border border-slate-100 dark:border-slate-850 hover:scale-115 transition-all cursor-pointer"
                title="Remove from Wishlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image & Link to Product Page */}
              <Link to={`/products/${product._id}`} className="aspect-square bg-slate-100 dark:bg-slate-705 overflow-hidden block relative">
                <img
                  src={product.imageUrls ? product.imageUrls.split(',')[0] : 'https://placehold.co/400x400?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-white font-black text-xs bg-red-500 px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                  </div>
                )}
                <span className="absolute bottom-2.5 left-2.5 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {product.category}
                </span>
              </Link>

              {/* Info Details */}
              <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight truncate hover:text-teal-650 dark:hover:text-teal-400">
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 fill-current ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">({product.numReviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock === 0}
                    className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-750 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 hover:shadow-lg hover:shadow-teal-500/10"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800/40 border border-dashed border-slate-250 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-450 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/50 shadow-inner">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your wishlist is empty</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
              Find items you like, tap the heart button, and they'll show up here so you can buy them later.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
