'use client';

import { useState } from 'react';
import UserPreferences from '../components/UserPreferences';

interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  weeklyReports: boolean;
}

interface DataSettings {
  retentionPeriod: string;
}

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: false,
    browserNotifications: false,
    weeklyReports: false,
  });

  const [dataSettings, setDataSettings] = useState<DataSettings>({
    retentionPeriod: '30',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleDataRetentionChange = (value: string) => {
    setDataSettings(prev => ({
      ...prev,
      retentionPeriod: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications: notificationSettings,
          data: dataSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      });
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/export-data');
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blockchain-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: 'Failed to export data. Please try again.'
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Settings & Preferences
        </h1>
        <p className="text-gray-600 mb-6">
          Customize your monitoring experience by configuring your preferences,
          alert thresholds, and learning goals.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-8">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive alerts and insights via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Browser Notifications</h3>
                <p className="text-sm text-gray-500">Get real-time alerts in your browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.browserNotifications}
                  onChange={() => handleNotificationChange('browserNotifications')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                <p className="text-sm text-gray-500">Receive weekly sustainability reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings.weeklyReports}
                  onChange={() => handleNotificationChange('weeklyReports')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* User Preferences */}
        <div className="bg-white rounded-lg shadow-md">
          <UserPreferences />
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Data Retention</h3>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={dataSettings.retentionPeriod}
                onChange={(e) => handleDataRetentionChange(e.target.value)}
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Download Historical Data
              </button>
            </div>
          </div>
        </div>

        {/* Save Button and Status */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
          <div>
            {saveStatus && (
              <p className={`text-sm ${
                saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveStatus.message}
              </p>
            )}
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 