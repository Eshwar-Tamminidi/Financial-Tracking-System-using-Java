import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/accounts', label: 'Accounts', icon: '🏦' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
    { path: '/budgets', label: 'Budgets', icon: '💰' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 hidden md:flex flex-col`}
      >
        <div className="p-4 flex items-center justify-center h-20 border-b border-blue-500">
          <span className="text-2xl font-bold">💹</span>
          {sidebarOpen && <span className="ml-2 font-bold text-lg">FinTrack</span>}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-500'
                  : 'hover:bg-blue-500 hover:bg-opacity-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-blue-500 p-2 space-y-2">
          <Link
            to="/settings"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-blue-500'
                : 'hover:bg-blue-500 hover:bg-opacity-50'
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-left"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <span className="font-bold text-lg">💹 FinTrack</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="bg-blue-600 text-white absolute top-16 left-0 right-0 z-50 max-h-96 overflow-y-auto">
            <nav className="px-2 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-500'
                      : 'hover:bg-blue-500 hover:bg-opacity-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
              <Link
                to="/settings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500 hover:bg-opacity-50"
              >
                <Settings size={20} />
                <span className="text-sm">Settings</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-left"
              >
                <LogOut size={20} />
                <span className="text-sm">Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User size={20} />
              <span className="text-sm font-medium">{user?.username || 'User'}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
