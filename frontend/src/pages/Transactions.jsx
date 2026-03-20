import React, { useState, useEffect } from 'react';
import { transactionAPI, accountAPI, categoryAPI } from '../services/api';
import { Plus, Edit, Trash2, AlertCircle, Filter } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: 0,
    type: 'EXPENSE',
    transactionDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CARD',
    isRecurring: false,
    accountId: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [transRes, accRes, catRes] = await Promise.all([
        transactionAPI.getAll(),
        accountAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setTransactions(transRes.data || []);
      setAccounts(accRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'amount' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert date string to full ISO datetime
      const submitData = {
        ...formData,
        transactionDate: formData.transactionDate ? new Date(formData.transactionDate).toISOString() : new Date().toISOString(),
        amount: new Number(formData.amount),
        accountId: parseInt(formData.accountId),
        categoryId: parseInt(formData.categoryId),
      };

      if (editingId) {
        await transactionAPI.update(editingId, submitData);
        setEditingId(null);
      } else {
        await transactionAPI.create(submitData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save transaction');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete transaction');
        console.error(err);
      }
    }
  };

  const handleEdit = (transaction) => {
    // Convert ISO datetime back to date-only format for the input field
    const dateOnly = new Date(transaction.transactionDate).toISOString().split('T')[0];
    setFormData({
      title: transaction.title,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      transactionDate: dateOnly,
      paymentMethod: transaction.paymentMethod,
      isRecurring: transaction.isRecurring || false,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
    });
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      amount: 0,
      type: 'EXPENSE',
      transactionDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'CARD',
      isRecurring: false,
      accountId: '',
      categoryId: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredTransactions = filterType === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  const getAccountName = (id) => accounts.find(a => a.id === parseInt(id))?.accountName || 'Unknown';
  const getCategoryName = (id) => categories.find(c => c.id === parseInt(id))?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Transaction</span>
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
            {editingId ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account
                </label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  &nbsp;
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Recurring</span>
                </label>
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
                rows="2"
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center space-x-2">
        <Filter size={20} className="text-gray-600" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input-field w-48"
        >
          <option value="ALL">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expenses</option>
          <option value="TRANSFER">Transfers</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Account</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {transaction.title}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {getAccountName(transaction.accountId)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {getCategoryName(transaction.categoryId)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'INCOME'
                            ? 'bg-green-100 text-green-800'
                            : transaction.type === 'EXPENSE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-sm font-semibold text-right ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
