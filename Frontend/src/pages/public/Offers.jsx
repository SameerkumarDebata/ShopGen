import React from 'react';
import toast from 'react-hot-toast';

const MOCK_OFFERS = [
  {
    code: 'WELCOME10',
    discount: '10% OFF',
    description: 'Get 10% discount on your first order. Stock up your cart now!',
    minOrder: 1000,
    type: 'Percentage Discount',
    bgGradient: 'from-teal-500 to-emerald-500',
  },
  {
    code: 'SAVE500',
    discount: '₹500 Flat OFF',
    description: 'Save big with a flat discount of ₹500 on premium products.',
    minOrder: 3000,
    type: 'Flat Discount',
    bgGradient: 'from-blue-500 to-indigo-600',
  },
  {
    code: 'BIGDEAL25',
    discount: '25% OFF',
    description: 'Special summer discount of 25% for high-value shopping items.',
    minOrder: 5000,
    type: 'Percentage Discount',
    bgGradient: 'from-rose-500 to-pink-600',
  },
];

const Offers = () => {
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Deals & Promotional Offers
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Apply these exclusive promo codes at checkout to unlock savings on your order.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_OFFERS.map((offer) => (
          <div
            key={offer.code}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Top Badge Card */}
            <div className={`bg-gradient-to-br ${offer.bgGradient} p-6 text-white text-center space-y-2 relative`}>
              <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold border border-white/10">
                {offer.type}
              </div>
              <h2 className="text-3xl font-black tracking-tight">{offer.discount}</h2>
              <p className="text-xs text-white/90 font-medium">Valid until Dec 2028</p>
            </div>

            {/* Bottom Card details */}
            <div className="p-6 flex-1 flex flex-col justify-between gap-6">
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                  {offer.description}
                </p>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-bold space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>Minimum spend: ₹{offer.minOrder}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>One use per customer account</span>
                  </div>
                </div>
              </div>

              {/* Copy Coupon Box */}
              <div className="flex items-center border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-900/30 justify-between gap-3">
                <div className="font-mono font-black text-slate-800 dark:text-slate-200 text-sm pl-2.5 tracking-wider">
                  {offer.code}
                </div>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="bg-slate-900 hover:bg-slate-850 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
