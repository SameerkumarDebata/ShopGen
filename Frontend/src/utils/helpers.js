export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

export const getStatusColor = (status) => {
  const map = {
    pending:    'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped:    'bg-purple-100 text-purple-800',
    completed:  'bg-emerald-100 text-emerald-800',
    cancelled:  'bg-red-100 text-red-800',
    paid:       'bg-emerald-100 text-emerald-800',
    failed:     'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export const truncate = (str, n = 80) =>
  str?.length > n ? str.slice(0, n) + '…' : str;