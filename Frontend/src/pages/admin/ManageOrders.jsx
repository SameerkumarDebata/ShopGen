import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Unauthorized access or structural failure parsing transactions database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const handleStatusChange = async (id, currentStatus) => {
    try {
      await API.put(`/orders/${id}/status`, { status: currentStatus });
      toast.success('Invoicing system tracking updated status flags successfully.');
      fetchAllOrders();
    } catch (err) {
      toast.error('Could not modify core order flow parameters tracking markers.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium">Syncing transaction data pipelines...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Order Control Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track purchase transactions, update shipping states, and review billing details.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-350">
            <thead className="bg-slate-50/75 dark:bg-slate-700/30 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 w-12"></th>
                <th className="p-4">Reference Identity</th>
                <th className="p-4">Purchaser Name</th>
                <th className="p-4">Valuation</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Financing State</th>
                <th className="p-4">Tracking Flag</th>
                <th className="p-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order._id;
                return (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/10 transition-colors">
                      <td className="p-4 text-center">
                        <button onClick={() => toggleExpand(order._id)} className="text-slate-400 hover:text-teal-600 transition-colors">
                          <svg className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-755 dark:text-slate-400">{order._id}</td>
                      <td className="p-4 text-slate-900 dark:text-slate-100 font-semibold">{order.user?.name || 'Anonymous Profile'}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100">₹{order.totalAmount}</td>
                      <td className="p-4 text-xs font-semibold dark:text-slate-300">
                        {order.paymentMethod === 'COD' ? 'COD (Cash)' : 'Online (Razorpay)'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full capitalize ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 outline-none text-xs font-semibold text-slate-700 dark:text-slate-350 focus:ring-2 focus:ring-teal-500">
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => toggleExpand(order._id)} className="text-teal-600 dark:text-teal-400 text-xs font-bold hover:underline">
                          {isExpanded ? 'Hide' : 'Inspect'}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable details panel */}
                    {isExpanded && (
                      <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                        <td colSpan="8" className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                            
                            {/* Shipping Details */}
                            <div className="bg-white dark:bg-slate-800 p-4 border rounded-2xl shadow-sm space-y-3">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2">Shipping Information</h4>
                              <div className="space-y-1 text-slate-600 dark:text-slate-300">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{order.address?.fullName}</p>
                                <p>{order.address?.street}</p>
                                <p>{order.address?.city}, {order.address?.state} - {order.address?.zipCode}</p>
                                <p>{order.address?.country}</p>
                                <p className="mt-2 text-[11px] font-bold text-teal-650 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-1 rounded w-fit">
                                  Method: {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Razorpay (Paid)'}
                                </p>
                              </div>
                              <div className="pt-2 border-t text-[10px] text-slate-400">
                                Purchased at: {new Date(order.createdAt).toLocaleString()}
                              </div>
                            </div>

                            {/* Ordered Items Details */}
                            <div className="bg-white dark:bg-slate-800 p-4 border rounded-2xl shadow-sm space-y-3">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2">Line Items Summary</h4>
                              <div className="divide-y max-h-48 overflow-y-auto pr-1">
                                {order.items?.map((item, i) => (
                                  <div key={i} className="py-2.5 flex justify-between items-center gap-4">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.productId?.name || 'Deleted Product Reference'}</p>
                                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} &bull; Price: ₹{item.price}</p>
                                    </div>
                                    <span className="font-bold text-slate-950 dark:text-slate-100">
                                      ₹{item.price * item.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t pt-2.5 flex justify-between items-center font-bold text-slate-900 dark:text-slate-100">
                                <span>Grand Total Payment</span>
                                <span>₹{order.totalAmount}</span>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;