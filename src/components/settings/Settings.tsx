import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Users,
  Database,
  Mail,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    organizationName: "TechCorp Industries",
    industry: "manufacturing",
    timezone: "UTC-5",
    language: "en",
    emailNotifications: true,
    smsNotifications: false,
    alertThreshold: "medium",
    dataRetention: "2_years",
    backupFrequency: "daily",
    twoFactorAuth: true,
  });

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "team", label: "Team", icon: Users },
    { id: "data", label: "Data Management", icon: Database },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-hunter-900 mb-4">
                Organization Settings
              </h3>
              <div className="space-y-4">
                <Input
                  label="Organization Name"
                  value={settings.organizationName}
                  onChange={(e) =>
                    handleSettingChange("organizationName", e.target.value)
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-hunter-800 mb-1">
                    Industry
                  </label>
                  <select
                    value={settings.industry}
                    onChange={(e) =>
                      handleSettingChange("industry", e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
                  >
                    <option value="manufacturing">Manufacturing</option>
                    <option value="pharmaceuticals">Pharmaceuticals</option>
                    <option value="food_beverage">Food & Beverage</option>
                    <option value="automotive">Automotive</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-hunter-800 mb-1">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) =>
                      handleSettingChange("timezone", e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-hunter-900 mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-sage-700" />
                    <div>
                      <p className="font-medium text-hunter-900">
                        Email Notifications
                      </p>
                      <p className="text-sm text-sage-700">
                        Receive alerts and reports via email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hunter-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hunter-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-sage-700" />
                    <div>
                      <p className="font-medium text-hunter-900">
                        SMS Notifications
                      </p>
                      <p className="text-sm text-sage-700">
                        Receive critical alerts via SMS
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "smsNotifications",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hunter-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hunter-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-hunter-800 mb-1">
                    Alert Threshold
                  </label>
                  <select
                    value={settings.alertThreshold}
                    onChange={(e) =>
                      handleSettingChange("alertThreshold", e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
                  >
                    <option value="low">Low - All alerts</option>
                    <option value="medium">
                      Medium - Important alerts only
                    </option>
                    <option value="high">High - Critical alerts only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-hunter-900 mb-4">
                Security Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-sage-700" />
                    <div>
                      <p className="font-medium text-hunter-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-sage-700">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) =>
                        handleSettingChange("twoFactorAuth", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-sage-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hunter-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hunter-600"></div>
                  </label>
                </div>

                <div className="p-4 bg-fern-50 border border-fern-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-fern-700" />
                    <p className="font-medium text-fern-800">
                      Blockchain Security
                    </p>
                  </div>
                  <p className="text-sm text-fern-700">
                    All quality reports and audit logs are automatically secured
                    using blockchain technology. This ensures data integrity and
                    provides immutable audit trails.
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-hunter-900 mb-4">
                Data Management
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-hunter-800 mb-1">
                    Data Retention Period
                  </label>
                  <select
                    value={settings.dataRetention}
                    onChange={(e) =>
                      handleSettingChange("dataRetention", e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
                  >
                    <option value="1_year">1 Year</option>
                    <option value="2_years">2 Years</option>
                    <option value="5_years">5 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-hunter-800 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) =>
                      handleSettingChange("backupFrequency", e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1">
                    Export Data
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Create Backup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hunter-900">Settings</h1>
        <p className="text-sage-700">
          Manage your organization and system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="bg-ivory-50 border-sage-200 lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-hunter-100 text-hunter-800"
                      : "text-sage-700 hover:bg-sage-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Settings Content */}
        <Card className="bg-ivory-50 border-sage-200 lg:col-span-3">
          {renderTabContent()}

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-sage-200">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
