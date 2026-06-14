import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI } from '../../api/productAPI.js';
import ProductCard from "../../components/common/ProductCard.jsx";
import { SkeletonGrid } from "../../components/common/SkeletonCard.jsx";

const CATEGORIES_DATA = [
  { name: 'All', label: 'All Items', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', bg: 'from-blue-500 to-indigo-500' },
  { name: 'Electronics', label: 'Electronics', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z', bg: 'from-amber-500 to-orange-500' },
  { name: 'Wearables', label: 'Smart Tech', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'from-teal-500 to-emerald-500' },
  { name: 'Fashion', label: 'Fashion Store', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', bg: 'from-rose-500 to-pink-500' },
  { name: 'Computers', label: 'Computers', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', bg: 'from-violet-500 to-purple-500' },
];

const PROMO_SLIDES = [
  {
    title: "The Ultimate Electronics Carnival",
    subtitle: "Upgrade your gear with up to 40% off on premium audio products.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    color: "from-slate-900/90 via-teal-900/80 to-slate-900/95",
    badge: "Limited Period Sale",
    cta: "Explore Audio Deals",
    link: "/products"
  },
  {
    title: "Step Out in Style",
    subtitle: "Enjoy flat 30% discount on classic sneakers and fashion statements.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    color: "from-slate-900/90 via-rose-950/80 to-slate-900/95",
    badge: "Fashion Special",
    cta: "Browse Wardrobe",
    link: "/products"
  },
  {
    title: "Elevate Your Workplace Productivity",
    subtitle: "High-spec mechanical keyboards and portable computing accessories.",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    color: "from-slate-900/90 via-indigo-950/80 to-slate-900/95",
    badge: "Tech Spotlight",
    cta: "Upgrade Setup",
    link: "/products"
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [visibleLimit, setVisibleLimit] = useState(8);
  const [priceFilter, setPriceFilter] = useState('all');
  
  const navigate = useNavigate();

  // Load products
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProductsAPI();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Slide rotation
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  // Reset limit, search, and price filter when category changes
  useEffect(() => {
    setVisibleLimit(8);
    setPriceFilter('all');
    setSearchQuery('');
  }, [activeCategory]);

  const handleBannerCtaClick = (idx) => {
    const categories = ['Electronics', 'Fashion', 'Computers'];
    const selectedCategory = categories[idx] || 'All';
    setActiveCategory(selectedCategory);
    
    // Scroll smoothly to products grid
    const element = document.getElementById('homepage-products-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter, search, and sort products dynamically
  const processedProducts = products
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => {
      if (priceFilter === 'under-5000') return p.price < 5000;
      if (priceFilter === '5000-15000') return p.price >= 5000 && p.price <= 15000;
      if (priceFilter === 'over-15000') return p.price > 15000;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const displayedProducts = processedProducts.slice(0, visibleLimit);

  return (
    <div className="space-y-12 pb-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      
      {/* 1. Circle Category Row (Flipkart-Style) */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center gap-6 sm:gap-12 overflow-x-auto scrollbar-none py-1">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none flex-shrink-0"
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${cat.bg} p-3.5 text-white flex items-center justify-center shadow-md shadow-slate-250/50 dark:shadow-none group-hover:scale-110 transition-transform duration-300 ${activeCategory === cat.name ? 'ring-4 ring-teal-500/30 ring-offset-2 dark:ring-offset-slate-800' : ''}`}>
                  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                  </svg>
                </div>
                <span className={`text-xs font-bold tracking-tight transition-colors ${activeCategory === cat.name ? 'text-teal-600 dark:text-teal-400 font-extrabold' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Interactive Banner Carousel */}
      <section className="max-w-7xl mx-auto px-4">
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-700/40 bg-slate-950"
        >
          {/* Sliding Slides Container */}
          <div 
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {PROMO_SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className="w-full h-full flex-shrink-0 relative flex items-center"
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
                
                <div className="relative max-w-xl mx-auto md:mx-0 px-6 sm:px-12 text-white flex flex-col justify-center h-full z-20 space-y-4 text-center md:text-left">
                  {slide.badge && (
                    <span 
                      className={`self-center md:self-start bg-teal-500 text-white font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm transition-all duration-700 transform ${
                        idx === currentSlide ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-4 opacity-0'
                      }`}
                    >
                      {slide.badge}
                    </span>
                  )}
                  <h2 
                    className={`text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-md transition-all duration-700 transform ${
                      idx === currentSlide ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {slide.title}
                  </h2>
                  <p 
                    className={`text-xs sm:text-base text-slate-200 font-medium line-clamp-2 drop-shadow-sm transition-all duration-700 transform ${
                      idx === currentSlide ? 'translate-y-0 opacity-100 delay-400' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {slide.subtitle}
                  </p>
                  <div 
                    className={`pt-2 transition-all duration-700 transform ${
                      idx === currentSlide ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    <button
                      onClick={() => handleBannerCtaClick(idx)}
                      className="inline-block bg-white text-slate-900 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl hover:bg-slate-100 active:scale-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      {slide.cta} &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicators (Glassmorphic tray with glowing active pill) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-slate-900/35 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-md">
            {PROMO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 focus:outline-none cursor-pointer ${
                  idx === currentSlide 
                    ? 'bg-teal-400 w-6 shadow-[0_0_8px_rgba(45,212,191,0.7)]' 
                    : 'bg-white/50 w-2 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Prev/Next arrows (Glassmorphic round buttons, visible on hover/mobile) */}
          <button
            onClick={() => setCurrentSlide((currentSlide - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/25 backdrop-blur-md text-white flex items-center justify-center z-20 transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((currentSlide + 1) % PROMO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/25 backdrop-blur-md text-white flex items-center justify-center z-20 transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 3. Dynamic Products Grid */}
      <section id="homepage-products-grid" className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-700/60">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {activeCategory === 'All' ? 'All Products' : `${activeCategory} Collection`}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {processedProducts.length} items found
            </p>
          </div>
          
          {/* Search, Sort, & Price Filters Container */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
            {/* Price Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-5000', label: 'Under ₹5k' },
                { id: '5000-15000', label: '₹5k - ₹15k' },
                { id: 'over-15000', label: 'Over ₹15k' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPriceFilter(item.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-tight transition-all duration-200 cursor-pointer ${
                    priceFilter === item.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 flex-1 sm:flex-initial">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-48">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              {/* Sort Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                <option value="default">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : displayedProducts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            
            {/* Load More Button */}
            {processedProducts.length > visibleLimit && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleLimit((prev) => prev + 8)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm">
            <svg className="w-16 h-16 text-slate-350 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No products match your criteria.</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-teal-600 hover:underline font-bold"
              >
                Clear Search Query
              </button>
            )}
          </div>
        )}
      </section>
      
    </div>
  );
};

export default Home;