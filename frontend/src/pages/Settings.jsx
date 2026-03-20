import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await userAPI.updateProfile(profileData);
      setMessageType('success');
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setMessageType('success');
      setMessage('Password changed successfully!');
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {message && (
        <div
          className={`alert flex items-start space-x-3 ${
            messageType === 'success' ? 'alert-success' : 'alert-error'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="card">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Privacy & Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Privacy & Security Tab */}
        {activeTab === 'privacy' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Privacy & Security</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enable two-factor authentication to add an extra layer of security to your account.
                </p>
                <button className="btn-secondary mt-4">
                  Coming Soon
                </button>
              </div>

              <div className="border-l-4 border-green-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Active Sessions</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your active sessions and devices.
                </p>
                <button className="btn-secondary mt-4">
                  View Sessions
                </button>
              </div>

              <div className="border-l-4 border-yellow-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Data Export</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Download your financial data in CSV format.
                </p>
                <button className="btn-secondary mt-4">
                  Export Data
                </button>
              </div>

              <div className="border-l-4 border-red-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Delete Account</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Permanently delete your account and all associated data.
                </p>
                <button className="btn-danger mt-4">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
