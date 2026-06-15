import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByIdAPI, createProductReviewAPI } from '../../api/productAPI.js';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatPrice } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProductByIdAPI(id);
        setProduct(data);
      } catch {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    setSubmittingReview(true);
    try {
      await createProductReviewAPI(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review added successfully!');
      // Reload product details to show the new review and updated rating
      const { data } = await getProductByIdAPI(id);
      setProduct(data);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-full" />
            <div className="skeleton h-5 w-1/3 rounded-full" />
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-12 w-1/2 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-slate-500 text-lg">Product not found.</p>
      <Link to="/products" className="text-teal-600 hover:underline mt-2 block">← Back to products</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/products" className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-8 text-sm font-medium transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Slider */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden aspect-square relative group shadow-sm border border-slate-100 dark:border-slate-800">
            <img
              src={
                product?.imageUrls
                  ? product.imageUrls.split(',').filter(Boolean)[activeImageIndex] || 'https://placehold.co/600x600?text=No+Image'
                  : 'https://placehold.co/600x600?text=No+Image'
              }
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=No+Image'; }}
            />
            
            {product?.imageUrls && product.imageUrls.split(',').filter(Boolean).length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex(
                      (prev) =>
                        (prev - 1 + product.imageUrls.split(',').filter(Boolean).length) %
                        product.imageUrls.split(',').filter(Boolean).length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex(
                      (prev) => (prev + 1) % product.imageUrls.split(',').filter(Boolean).length
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <span className="absolute bottom-4 right-4 bg-slate-900/60 dark:bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/10 shadow-sm uppercase tracking-wider select-none">
                  {activeImageIndex + 1} / {product.imageUrls.split(',').filter(Boolean).length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product?.imageUrls && product.imageUrls.split(',').filter(Boolean).length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none py-1">
              {product.imageUrls.split(',').filter(Boolean).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-100 dark:bg-slate-800 transition-all flex-shrink-0 cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-sm scale-95' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-500'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="inline-block bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{product.rating} ({product.numReviews} reviews)</span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{product.description}</p>

          <div className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mb-6">
            {formatPrice(product.price)}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Quantity</span>
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-semibold text-slate-800 dark:text-slate-100">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-650 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={() => {
                toggleWishlist(product);
                if (isInWishlist(product._id)) {
                  toast.success('Removed from wishlist');
                } else {
                  toast.success('Added to wishlist!');
                }
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border flex items-center justify-center cursor-pointer active:scale-95 ${
                isInWishlist(product._id)
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-500'
                  : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:border-rose-450 hover:text-rose-500 dark:text-slate-400'
              }`}
              title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <svg className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current text-rose-500' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Available Offers / Promos card */}
          <div className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4.5 mt-8 space-y-3 shadow-xs">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-4 h-4 text-teal-650 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Available Offers & Promotions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: 'WELCOME10', discount: '10% OFF', details: 'Min. spend ₹1,000' },
                { code: 'SAVE500', discount: 'Flat ₹500 OFF', details: 'Min. spend ₹3,000' },
                { code: 'BIGDEAL25', discount: '25% OFF', details: 'Min. spend ₹5,000' }
              ].map((off) => (
                <div key={off.code} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-3 rounded-xl flex flex-col justify-between gap-2 text-xs">
                  <div>
                    <div className="font-mono font-black text-slate-700 dark:text-slate-305 tracking-wide bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border dark:border-slate-800 inline-block">{off.code}</div>
                    <div className="font-extrabold text-teal-650 dark:text-teal-450 mt-1">{off.discount}</div>
                  </div>
                  <div className="text-[9px] text-slate-400 leading-tight">{off.details}</div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(off.code);
                      toast.success(`Code ${off.code} copied!`);
                    }}
                    className="text-[9px] font-bold text-slate-500 hover:text-teal-605 text-left cursor-pointer focus:outline-none"
                  >
                    Copy Code
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-slate-200 dark:border-slate-700/60 pt-10">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Customer Reviews</h2>
        
        {/* Review list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev._id} className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{rev.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 fill-current ${i < rev.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic py-6 border border-dashed rounded-2xl text-center">No reviews for this product yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Form */}
          <div className="md:col-span-1 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/65 dark:border-slate-700/50 rounded-2xl p-6 h-fit shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Write a Review</h3>
            {isLoggedIn ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <svg className={`w-7 h-7 fill-current transition-colors duration-200 ${star <= reviewRating ? 'text-amber-400' : 'text-slate-350 dark:text-slate-600'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Comment</label>
                  <textarea
                    rows="4"
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your product experience..."
                    className="w-full text-sm p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-350 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-500">You must be logged in to review this product.</p>
                <Link to="/login" className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;