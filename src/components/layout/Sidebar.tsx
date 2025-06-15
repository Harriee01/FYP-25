import React from 'react';
import { 
  BarChart3, 
  Users, 
  ClipboardCheck, 
  AlertTriangle, 
  FileText, 
  Settings,
  Home
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'benchmarks', label: 'Quality Benchmarks', icon: ClipboardCheck },
  { id: 'reports', label: 'Quality Reports', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team Management', icon: Users },
  { id: 'audit', label: 'Audit Trail', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-hunter-900 text-ivory-100 min-h-screen shadow-xl">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                activeTab === item.id
                  ? 'bg-fern-600 text-ivory-50 shadow-lg'
                  : 'text-sage-200 hover:bg-hunter-800 hover:text-ivory-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};