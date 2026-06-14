import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        toast.error('Failed to parse your checkout orders history.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const getStepIndex = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'completed'];
    return steps.indexOf(status);
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading orders tracking...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Purchase History</h1>
      {orders.length === 0 ? (
        <p className="text-slate-500 text-center py-12 border border-dashed rounded-2xl">No orders placed through this profile yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Order ID</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-350">{order._id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date Placed</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Payment Method</p>
                  <p className="text-xs font-semibold text-slate-750 dark:text-slate-300">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Paid Online'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Charge</p>
                  <p className="text-xs font-black text-slate-900 dark:text-slate-100">₹{order.totalAmount}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {order.paymentMethod === 'COD' && order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
                <div className="mx-4 mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3 rounded-xl flex items-center gap-2.5 text-amber-800 dark:text-amber-400 text-xs">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Cash Payment Required:</strong> Please prepare exactly <strong>₹{order.totalAmount}</strong> to pay in cash upon delivery.
                  </span>
                </div>
              )}

              {/* Stepper Timeline Tracker */}
              {order.status === 'cancelled' ? (
                <div className="mx-4 my-5 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-wide">This order was cancelled.</p>
                </div>
              ) : (
                <div className="mx-4 my-5 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3.5">Shipment Tracking Status</p>
                  <div className="flex items-center justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 z-0 rounded-full" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 z-0 rounded-full transition-all duration-1000 ease-in-out" 
                      style={{ width: `${(Math.max(0, getStepIndex(order.status)) / 3) * 100}%` }}
                    />
                    
                    {['Placed', 'Processing', 'Shipped', 'Delivered'].map((label, index) => {
                      const activeIndex = getStepIndex(order.status);
                      const isCompleted = index <= activeIndex;
                      const isCurrent = index === activeIndex;
                      
                      return (
                        <div key={label} className="flex flex-col items-center z-10 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                            isCompleted 
                              ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-500/20' 
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-teal-500/30' : ''}`}>
                            {isCompleted && index < activeIndex ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-[10px] font-black">{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold tracking-tight mt-2 transition-colors ${
                            isCompleted ? 'text-teal-600 dark:text-teal-400 font-extrabold' : 'text-slate-450 dark:text-slate-500'
                          }`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-4 divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 text-sm text-slate-700">
                    <div>
                      <p className="font-medium text-slate-900">{item.productId?.name || 'Product Details Archive'}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <span className="font-semibold text-slate-800">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;