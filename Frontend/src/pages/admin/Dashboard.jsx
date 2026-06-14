import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/analytics');
        setStats(data);
      } catch (err) {
        toast.error('Could not authenticate or parse admin analytics dashboard parameters.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium">Loading store operations matrix...</div>;

  // Prepare Chart Math dynamically
  const trendData = stats?.salesTrend || [];
  const maxRevenue = Math.max(...trendData.map(d => d.revenue), 1000);
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 20;

  // Build points for SVG path
  const points = trendData.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (trendData.length - 1 || 1);
    const y = chartHeight - padding - (d.revenue / maxRevenue) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time business performance analytics and management indicators.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-teal-600/10">
            + Publish Product
          </Link>
          <Link to="/admin/orders" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all">
            Review Orders
          </Link>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col justify-between group hover:border-teal-500/50 transition-all">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gross Turnover</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">₹{stats?.totalRevenue?.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-500">INR</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col justify-between group hover:border-teal-500/50 transition-all">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Processed Invoices</span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{stats?.totalOrders} orders</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col justify-between group hover:border-teal-500/50 transition-all">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Catalog Products</span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{stats?.totalProducts} items</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col justify-between group hover:border-teal-500/50 transition-all">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Customers</span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{stats?.totalUsers} profiles</span>
        </div>
      </div>

      {/* Analytics Chart & Alerts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Trend SVG Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Revenue Velocity Chart</h3>
            <p className="text-xs text-slate-400 mb-6">Aggregate monthly gross revenue trends (last 6 months).</p>
          </div>

          <div className="relative w-full overflow-hidden">
            {points.length > 0 ? (
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="4 4" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} className="stroke-slate-200 dark:stroke-slate-600" strokeWidth="1" />

                {/* Area under the line */}
                <path d={areaD} fill="url(#areaGrad)" />

                {/* Main Trend Line */}
                <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Interactive Points / Dots */}
                {points.map((p, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="5" className="fill-teal-600 stroke-white dark:stroke-slate-800" strokeWidth="2" />
                    <circle cx={p.x} cy={p.y} r="10" className="fill-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Tooltip Label */}
                    <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{p.revenue}
                    </text>
                  </g>
                ))}

                {/* X Axis labels */}
                {points.map((p, i) => (
                  <text key={i} x={p.x} y={chartHeight - 4} textAnchor="middle" className="text-[9px] font-semibold fill-slate-400 dark:fill-slate-500">
                    {p.month}
                  </text>
                ))}
              </svg>
            ) : (
              <div className="h-40 flex items-center justify-center text-xs text-slate-400">
                Insufficient order velocity to plot trends.
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Low Stock Watchlist</h3>
              <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-200/60">Limit &le; 10</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Stock alert monitor for catalog entries requiring restocking actions.</p>
            
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-850/50">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.category} &bull; ₹{p.price}</p>
                    </div>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${p.stock === 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {p.stock} left
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  &bull; No items flagged with low stock &bull;
                </div>
              )}
            </div>
          </div>

          <Link to="/admin/products" className="block text-center text-xs font-bold text-teal-600 hover:text-teal-700 border-t pt-4 mt-4">
            Manage Product Catalog &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;