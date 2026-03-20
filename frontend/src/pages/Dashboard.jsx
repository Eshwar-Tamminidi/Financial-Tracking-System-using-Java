import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { accountAPI, transactionAPI, budgetAPI } from '../services/api';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [accountsRes, transactionsRes, budgetsRes] = await Promise.all([
        accountAPI.getAll(),
        transactionAPI.getAll({ limit: 10 }),
        budgetAPI.getAll(),
      ]);

      setAccounts(accountsRes.data || []);
      setTransactions(transactionsRes.data || []);
      setBudgets(budgetsRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const categoryData = transactions.reduce((acc, trans) => {
    const existing = acc.find(item => item.category === trans.category);
    if (existing) {
      existing.amount += trans.amount;
    } else {
      acc.push({ category: trans.category, amount: trans.amount });
    }
    return acc;
  }, []);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {error && (
        <div className="alert alert-error flex items-start space-x-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ${totalExpense.toFixed(2)}
              </p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm">Accounts</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {accounts.length}
              </p>
            </div>
            <div className="text-4xl">🏦</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category Pie Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) => `${category}: $${amount.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No expense data available</p>
          )}
        </div>

        {/* Account Balance Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Balances</h2>
          {accounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="accountName" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="balance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No accounts available</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {transaction.title}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {transaction.category}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget Status */}
      {budgets.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget Status</h2>
          <div className="space-y-4">
            {budgets.slice(0, 5).map((budget) => {
              const percentage = (budget.spentAmount / budget.limitAmount) * 100;
              const isWarning = percentage > 80;
              
              return (
                <div key={budget.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">{budget.name}</span>
                    <span className="text-sm text-gray-600">
                      ${budget.spentAmount.toFixed(2)} / ${budget.limitAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isWarning ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
