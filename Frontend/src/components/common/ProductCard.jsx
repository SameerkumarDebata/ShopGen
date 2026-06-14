import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice, truncate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product._id}`} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-square">
        <img
          src={product.imageUrls ? product.imageUrls.split(',')[0] : 'https://placehold.co/400x400?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white dark:bg-slate-800 rounded-full px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 shadow">
          {product.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex-1">
          {truncate(product.description, 60)}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-slate-400 ml-1">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;