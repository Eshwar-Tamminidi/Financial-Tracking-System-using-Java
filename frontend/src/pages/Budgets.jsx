import React, { useState, useEffect } from 'react';
import { budgetAPI, categoryAPI } from '../services/api';
import { Plus, Edit, Trash2, AlertCircle, TrendingDown } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    limitAmount: 0,
    period: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    categoryId: '',
    description: '',
    alertThreshold: '80',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [budgetsRes, categoriesRes] = await Promise.all([
        budgetAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setBudgets(budgetsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      setError('Failed to load budgets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'limitAmount' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await budgetAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await budgetAPI.create(formData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save budget');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetAPI.delete(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete budget');
        console.error(err);
      }
    }
  };

  const handleEdit = (budget) => {
    setFormData({
      ...budget,
      startDate: new Date(budget.startDate).toISOString().split('T')[0],
      endDate: new Date(budget.endDate).toISOString().split('T')[0],
    });
    setEditingId(budget.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      limitAmount: 0,
      period: 'MONTHLY',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      categoryId: '',
      description: '',
      alertThreshold: '80',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading budgets...</p>
        </div>
      </div>
    );
  }

  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'All Categories';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Budgets</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Budget</span>
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
            {editingId ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Monthly Food Budget"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limit Amount
                </label>
                <input
                  type="number"
                  name="limitAmount"
                  value={formData.limitAmount}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="CUSTOM">Custom</option>
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
                >
                  <option value="">All Categories</option>
                  {categories.filter(c => c.type === 'EXPENSE').map(cat => (
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
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Threshold (%)
              </label>
              <input
                type="number"
                name="alertThreshold"
                value={formData.alertThreshold}
                onChange={handleInputChange}
                className="input-field"
                min="1"
                max="100"
              />
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
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets List */}
      <div className="space-y-4">
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const percentage = (budget.spentAmount / budget.limitAmount) * 100;
            const isWarning = percentage > (parseInt(budget.alertThreshold || 80));
            const isExceeded = percentage > 100;

            return (
              <div key={budget.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {budget.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getCategoryName(budget.categoryId)} • {budget.period}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      ${budget.spentAmount.toFixed(2)} / ${budget.limitAmount.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isExceeded
                          ? 'bg-red-600'
                          : isWarning
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>

                  {isExceeded && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <TrendingDown size={16} />
                      <span className="text-xs font-semibold">
                        Budget exceeded by ${(budget.spentAmount - budget.limitAmount).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {budget.description && (
                    <p className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                      {budget.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No budgets yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
