import React, { useEffect, useState } from 'react';
import { getUsersAPI } from '../../api/authAPI.js';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsersAPI();
        setUsers(data);
      } catch (err) {
        toast.error('Access denied. Failed to load user records.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 font-medium animate-pulse">
        Syncing user database registry...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Registered Accounts</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A comprehensive overview list of all consumers verified in the system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-semibold">
          Total Registered Users: {users.length}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">User Account Profile</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Authorization Role</th>
                <th className="p-4">Verification State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map((account) => (
                <tr key={account._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center font-bold uppercase shadow-sm">
                        {account.name.slice(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{account.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">{account.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
                      account.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {account.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${account.verified ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      <span className="text-xs font-medium capitalize">
                        {account.verified ? 'Verified Client' : 'Pending Verification'}
                      </span>
                    </div>
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

export default ManageUsers;