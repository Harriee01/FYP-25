import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users,
  BarChart3,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';

const stats = [
  {
    title: 'Total Quality Reports',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: BarChart3,
    color: 'fern'
  },
  {
    title: 'Compliance Rate',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up',
    icon: CheckCircle,
    color: 'fern'
  },
  {
    title: 'Active Alerts',
    value: '8',
    change: '-3',
    trend: 'down',
    icon: AlertTriangle,
    color: 'red'
  },
  {
    title: 'Team Members',
    value: '24',
    change: '+2',
    trend: 'up',
    icon: Users,
    color: 'hunter'
  }
];

const recentReports = [
  {
    id: '1',
    benchmark: 'Temperature Control',
    value: '22.5°C',
    status: 'compliant',
    inspector: 'Sarah Johnson',
    time: '2 hours ago'
  },
  {
    id: '2',
    benchmark: 'pH Level',
    value: '7.8',
    status: 'warning',
    inspector: 'Mike Chen',
    time: '4 hours ago'
  },
  {
    id: '3',
    benchmark: 'Pressure Test',
    value: '145 PSI',
    status: 'non_compliant',
    inspector: 'Emma Davis',
    time: '6 hours ago'
  }
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hunter-900">Dashboard</h1>
        <p className="text-sage-700">Overview of your quality management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden bg-ivory-50 border-sage-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-700">{stat.title}</p>
                  <p className="text-2xl font-bold text-hunter-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      stat.trend === 'up' ? 'text-fern-600' : 'text-red-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-fern-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.color === 'fern' ? 'bg-fern-100' :
                  stat.color === 'hunter' ? 'bg-hunter-100' :
                  'bg-red-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.color === 'fern' ? 'text-fern-700' :
                    stat.color === 'hunter' ? 'text-hunter-700' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card className="bg-ivory-50 border-sage-200">
          <CardHeader>
            <CardTitle className="text-hunter-900">Recent Quality Reports</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-sage-50 rounded-lg border border-sage-100">
                <div className="flex-1">
                  <h4 className="font-medium text-hunter-900">{report.benchmark}</h4>
                  <p className="text-sm text-sage-700">by {report.inspector}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-hunter-900">{report.value}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'compliant' 
                        ? 'bg-fern-100 text-fern-800'
                        : report.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <Clock className="h-4 w-4 text-sage-500 inline mr-1" />
                  <span className="text-xs text-sage-600">{report.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-ivory-50 border-sage-200">
          <CardHeader>
            <CardTitle className="text-hunter-900">Quick Actions</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-fern-50 hover:bg-fern-100 border border-fern-200 rounded-lg transition-colors text-left">
              <CheckCircle className="h-6 w-6 text-fern-700 mb-2" />
              <h4 className="font-medium text-hunter-900">New Quality Report</h4>
              <p className="text-sm text-sage-700">Submit inspection results</p>
            </button>
            <button className="p-4 bg-hunter-50 hover:bg-hunter-100 border border-hunter-200 rounded-lg transition-colors text-left">
              <BarChart3 className="h-6 w-6 text-hunter-700 mb-2" />
              <h4 className="font-medium text-hunter-900">View Analytics</h4>
              <p className="text-sm text-sage-700">Check performance trends</p>
            </button>
            <button className="p-4 bg-sage-100 hover:bg-sage-200 border border-sage-300 rounded-lg transition-colors text-left">
              <Users className="h-6 w-6 text-sage-800 mb-2" />
              <h4 className="font-medium text-hunter-900">Manage Team</h4>
              <p className="text-sm text-sage-700">Add or edit team members</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors text-left">
              <AlertTriangle className="h-6 w-6 text-orange-600 mb-2" />
              <h4 className="font-medium text-hunter-900">Review Alerts</h4>
              <p className="text-sm text-sage-700">Check compliance issues</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};