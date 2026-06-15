import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Clean initialization payload parameters mapping models schema keys precisely
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [imageFiles, setImageFiles] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (err) {
      toast.error('Error rendering current store inventory lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('stock', form.stock);
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
        toast.success('Inventory item updated successfully.');
      } else {
        await API.post('/products', formData);
        toast.success('New catalog instance registered.');
      }
      setForm({ name: '', description: '', price: '', category: '', stock: '' });
      setImageFiles([]);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to validate structural changes with the catalog pipeline.');
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete item entry?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Item destroyed from records.');
      fetchProducts();
    } catch (err) {
      toast.error('Deletion operation failure.');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium">Syncing product databases...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Area */}
      <div className="bg-white border p-6 rounded-2xl h-fit shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{editingId ? 'Modify Record' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Title" required value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl outline-none text-sm" />
          <textarea name="description" placeholder="Description content" required value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl outline-none text-sm h-24" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" name="price" placeholder="Price (INR)" required value={form.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl outline-none text-sm" />
            <input type="number" name="stock" placeholder="Stock Limit" required value={form.stock} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl outline-none text-sm" />
          </div>
          <input type="text" name="category" placeholder="Product Department / Category" required value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl outline-none text-sm" />
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full text-xs text-slate-500" />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-sm transition-colors shadow-sm">
              {editingId ? 'Save Changes' : 'Publish Product'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', category: '', stock: '' }); setImageFiles([]); }} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-xl text-sm">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* Database Inventory Table Layout */}
      <div className="lg:col-span-2 bg-white border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b font-medium">
              <tr>
                <th className="p-4">Item details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">{product.name}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">₹{product.price}</td>
                  <td className="p-4">{product.stock} units</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEditClick(product)} className="text-teal-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;