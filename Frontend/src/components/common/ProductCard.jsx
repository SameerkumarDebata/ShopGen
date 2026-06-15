import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatPrice, truncate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (isInWishlist(product._id)) {
      toast.success('Removed from wishlist');
    } else {
      toast.success('Added to wishlist!');
    }
  };

  const isFav = isInWishlist(product._id);

  return (
    <Link to={`/products/${product._id}`} className="group bg-white dark:bg-slate-800 rounded-3xl shadow-xs hover:shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-square">
        <img
          src={product.imageUrls ? product.imageUrls.split(',')[0] : 'https://placehold.co/400x400?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
        />
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-xs bg-red-500 px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-xs rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
          {product.category}
        </div>

        {/* Heart Wishlist Toggle Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-400 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-115 shadow-sm transition-all border border-slate-200/10 backdrop-blur-xs cursor-pointer focus:outline-none"
          title={isFav ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg className={`w-3.5 h-3.5 transition-all duration-300 ${isFav ? 'text-rose-500 fill-current scale-110' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info Details */}
      <div className="p-4.5 flex flex-col flex-1 gap-2.5">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-amber-400 fill-current' : 'text-slate-250 dark:text-slate-700'}`}
                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.195-.39.6-.649 1.02-.649.42 0 .825.259 1.02.649l1.9 3.855 4.255.62c.465.068.85.39.995.83.144.44.02.932-.31 1.26l-3.08 3.001.728 4.237c.08.465-.11.932-.49 1.21-.38.28-.9.32-1.32.1l-3.8-2 0 0-3.8 2c-.42.22-.94.18-1.32-.1-.38-.278-.57-.745-.49-1.21l.728-4.237-3.08-3.001c-.33-.328-.454-.82-.31-1.26.145-.44.53-.762.995-.83l4.255-.62 1.9-3.855z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-medium ml-1">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-extrabold text-teal-600 dark:text-teal-405">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-teal-605 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-750 disabled:text-slate-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 hover:shadow-md hover:shadow-teal-500/10 cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;