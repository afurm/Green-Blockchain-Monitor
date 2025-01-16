'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface AlertThresholds {
  energyChange: number;
  emissionsChange: number;
  transactionChange: number;
}

interface UserPreferencesData {
  blockchains: string[];
  focusAreas: string[];
  alertThresholds: AlertThresholds;
}

export default function UserPreferences() {
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferencesData>({
    blockchains: ['Ethereum', 'Bitcoin'],
    focusAreas: ['energy', 'emissions', 'transactions'],
    alertThresholds: {
      energyChange: 10,
      emissionsChange: 10,
      transactionChange: 20
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      toast.error('Failed to load preferences');
      console.error('Error loading preferences:', error);
    }
  };

  const handleThresholdChange = (type: keyof AlertThresholds, value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      toast.error('Threshold must be between 0 and 100');
      return;
    }

    setPreferences(prev => ({
      ...prev,
      alertThresholds: {
        ...prev.alertThresholds,
        [type]: numValue
      }
    }));
  };

  const handleBlockchainToggle = (blockchain: string) => {
    setPreferences(prev => ({
      ...prev,
      blockchains: prev.blockchains.includes(blockchain)
        ? prev.blockchains.filter(b => b !== blockchain)
        : [...prev.blockchains, blockchain]
    }));
  };

  const handleFocusAreaToggle = (area: string) => {
    setPreferences(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      const updatedPreferences = await response.json();
      setPreferences(updatedPreferences);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.');
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">User Preferences</h2>

      {/* Monitored Blockchains */}
      <div>
        <h3 className="text-lg font-medium mb-3">Monitored Blockchains</h3>
        <div className="flex gap-2">
          {['Ethereum', 'Bitcoin'].map(blockchain => (
            <button
              key={blockchain}
              onClick={() => handleBlockchainToggle(blockchain)}
              className={`px-4 py-2 rounded-full ${
                preferences.blockchains.includes(blockchain)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {blockchain}
            </button>
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <h3 className="text-lg font-medium mb-3">Focus Areas</h3>
        <div className="flex gap-2">
          {['energy', 'emissions', 'transactions'].map(area => (
            <button
              key={area}
              onClick={() => handleFocusAreaToggle(area)}
              className={`px-4 py-2 rounded-full ${
                preferences.focusAreas.includes(area)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Thresholds */}
      <div>
        <h3 className="text-lg font-medium mb-3">Alert Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(preferences.alertThresholds).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {key.replace('Change', '')} Change
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleThresholdChange(key as keyof AlertThresholds, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pl-3 pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
} 