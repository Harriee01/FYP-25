import React from 'react';
import { Bell, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, organization, logout } = useAuth();

  return (
    <header className="bg-ivory-50 border-b border-sage-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-hunter-700" />
            <div>
              <h1 className="text-xl font-bold text-hunter-900">QualityChain</h1>
              <p className="text-sm text-sage-700">{organization?.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-sage-700 hover:text-hunter-800 hover:bg-sage-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <button className="p-2 text-sage-700 hover:text-hunter-800 hover:bg-sage-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-hunter-900">{user?.name}</p>
              <p className="text-xs text-sage-700 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="h-8 w-8 bg-hunter-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-hunter-800">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-sage-700 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};