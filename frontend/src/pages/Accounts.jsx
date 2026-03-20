import React, { useState, useEffect } from 'react';
import { accountAPI } from '../services/api';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'SAVINGS',
    balance: 0,
    initialBalance: 0,
    description: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await accountAPI.getAll();
      setAccounts(response.data || []);
    } catch (err) {
      setError('Failed to load accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'balance' || name === 'initialBalance' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await accountAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await accountAPI.create(formData);
      }
      resetForm();
      fetchAccounts();
    } catch (err) {
      setError('Failed to save account');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountAPI.delete(id);
        fetchAccounts();
      } catch (err) {
        setError('Failed to delete account');
        console.error(err);
      }
    }
  };

  const handleEdit = (account) => {
    setFormData(account);
    setEditingId(account.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      accountName: '',
      accountType: 'SAVINGS',
      balance: 0,
      initialBalance: 0,
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Accounts</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Account</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-error flex items-start space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Account' : 'Create Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CHECKING">Checking</option>
                  <option value="CREDIT">Credit</option>
                  <option value="INVESTMENT">Investment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Balance
                </label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Balance
                </label>
                <input
                  type="number"
                  name="initialBalance"
                  value={formData.initialBalance}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {account.accountName}
                  </h3>
                  <p className="text-sm text-gray-600">{account.accountType}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance</span>
                  <span className="font-bold text-blue-600">
                    ${account.balance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Initial Balance</span>
                  <span className="text-gray-800">
                    ${account.initialBalance.toFixed(2)}
                  </span>
                </div>
                {account.description && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">{account.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No accounts yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;
