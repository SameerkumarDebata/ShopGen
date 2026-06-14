import React, { useState, useContext, useEffect } from 'react'; // 1. Add useEffect
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', state: '', zipCode: '', country: 'India'
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code.');
      return;
    }
    try {
      const subtotal = getCartTotal();
      const { data } = await API.post('/coupons/validate', { code: couponCode, subtotal });
      if (data.success) {
        setAppliedCoupon(data);
        setDiscountAmount(data.discountAmount);
        toast.success(`Coupon ${data.code} applied successfully!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply coupon.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    toast.success('Coupon removed.');
  };

  // 2. Automatically load the script on page mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script if user navigates away from checkout before paying
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item._id, // Matches our CartContext fix
          quantity: item.quantity,
          price: item.price
        })),
        address,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        paymentMethod
      };

      if (paymentMethod === 'COD') {
        await API.post('/orders', orderPayload);
        toast.success('Order placed successfully via Cash on Delivery!');
        clearCart();
        navigate('/my-orders');
        return;
      }

      // Online payment flow
      if (!window.Razorpay) {
        toast.error('Razorpay SDK loading delayed. Please check your network connection.');
        setLoading(false);
        return;
      }

      const { data: dbOrder } = await API.post('/orders', orderPayload);

      const { data: paymentSession } = await API.post('/payments/order', {
        amount: dbOrder.totalAmount,
        orderId: dbOrder._id
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder', 
        amount: paymentSession.order.amount,
        currency: 'INR',
        name: 'ShopNest',
        description: 'Secure E-commerce Transaction',
        order_id: paymentSession.order.id,
        handler: async function (response) {
          try {
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: dbOrder._id
            };

            const { data: verifyData } = await API.post('/payments/verify', verificationPayload);
            if (verifyData.success) {
              toast.success('Payment Verified! Order placed successfully.');
              clearCart();
              navigate('/my-orders');
            }
          } catch (err) {
            toast.error('Payment processing confirmation failed.');
          }
        },
        prefill: { name: address.fullName },
        theme: { color: '#0d9488' }
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Order initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Checkout is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">You need to have items in your cart to checkout.</p>
        <button onClick={() => navigate('/products')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Secure Checkout</h1>
      
      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Shipping Address
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  placeholder="123 Main St, Apartment 4B"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={address.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ZIP / Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={address.zipCode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={address.country}
                    onChange={handleInputChange}
                    placeholder="India"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Online Payment */}
              <label 
                className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay' 
                    ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/10' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="Razorpay" 
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-650"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Pay Online</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Credit/Debit Card, UPI, NetBanking, Wallets (via Razorpay).
                </span>
              </label>

              {/* Cash on Delivery */}
              <label 
                className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'COD' 
                    ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/10' 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-teal-650 focus:ring-teal-500 border-slate-300 dark:border-slate-650"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Cash on Delivery</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Pay with cash upon receiving your order at your shipping address.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Pay Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Order Summary</h2>
            
            {/* Scrollable list of items */}
            <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-60 overflow-y-auto pr-2 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="py-3 flex justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
              <div className="flex justify-between text-slate-600 dark:text-slate-300 text-sm">
                <span>Items Total</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300 text-sm">
                <span>Shipping & Delivery</span>
                <span className="text-teal-600 dark:text-teal-400 font-semibold">Free</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400 text-sm font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center text-lg font-bold text-slate-900 dark:text-slate-100">
                <span>Total Payment</span>
                <span>₹{getCartTotal() - discountAmount}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Apply Promo Coupon</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 disabled:opacity-60"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
                  >
                    Apply
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Code applied! You saved ₹{discountAmount}.
                </p>
              )}
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 mt-6 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Order...
                </>
              ) : paymentMethod === 'COD' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Place Cash on Delivery Order
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Pay securely with Razorpay
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL Encrypted Transactions
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;