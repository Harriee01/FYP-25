// Analytics dummy data for the Analytics page
import { BarChart3, PieChart, Activity } from "lucide-react"

// Monthly compliance data for stacked bar chart
export const complianceData = [
  {
    month: "Jan 2024",
    compliant: 45,
    warning: 8,
    non_compliant: 3,
    total: 56,
    complianceRate: "80.4"
  },
  {
    month: "Feb 2024",
    compliant: 52,
    warning: 6,
    non_compliant: 2,
    total: 60,
    complianceRate: "86.7"
  },
  {
    month: "Mar 2024",
    compliant: 48,
    warning: 10,
    non_compliant: 4,
    total: 62,
    complianceRate: "77.4"
  },
  {
    month: "Apr 2024",
    compliant: 58,
    warning: 5,
    non_compliant: 1,
    total: 64,
    complianceRate: "90.6"
  },
  {
    month: "May 2024",
    compliant: 55,
    warning: 7,
    non_compliant: 3,
    total: 65,
    complianceRate: "84.6"
  },
  {
    month: "Jun 2024",
    compliant: 62,
    warning: 4,
    non_compliant: 2,
    total: 68,
    complianceRate: "91.2"
  },
  {
    month: "Jul 2024",
    compliant: 59,
    warning: 6,
    non_compliant: 1,
    total: 66,
    complianceRate: "89.4"
  },
  {
    month: "Aug 2024",
    compliant: 65,
    warning: 3,
    non_compliant: 2,
    total: 70,
    complianceRate: "92.9"
  },
  {
    month: "Sep 2024",
    compliant: 61,
    warning: 5,
    non_compliant: 3,
    total: 69,
    complianceRate: "88.4"
  },
  {
    month: "Oct 2024",
    compliant: 68,
    warning: 4,
    non_compliant: 1,
    total: 73,
    complianceRate: "93.2"
  },
  {
    month: "Nov 2024",
    compliant: 64,
    warning: 6,
    non_compliant: 2,
    total: 72,
    complianceRate: "88.9"
  },
  {
    month: "Dec 2024",
    compliant: 71,
    warning: 3,
    non_compliant: 1,
    total: 75,
    complianceRate: "94.7"
  }
];

// Trend data for line chart (compliance rate over time)
export const trendData = [
  { month: "Jan 2024", complianceRate: 80.4 },
  { month: "Feb 2024", complianceRate: 86.7 },
  { month: "Mar 2024", complianceRate: 77.4 },
  { month: "Apr 2024", complianceRate: 90.6 },
  { month: "May 2024", complianceRate: 84.6 },
  { month: "Jun 2024", complianceRate: 91.2 },
  { month: "Jul 2024", complianceRate: 89.4 },
  { month: "Aug 2024", complianceRate: 92.9 },
  { month: "Sep 2024", complianceRate: 88.4 },
  { month: "Oct 2024", complianceRate: 93.2 },
  { month: "Nov 2024", complianceRate: 88.9 },
  { month: "Dec 2024", complianceRate: 94.7 }
];

// Category performance data for pie chart
export const categoryData = [
  {
    name: "Safety Standards",
    value: 96.2,
    count: 245
  },
  {
    name: "Quality Control",
    value: 92.8,
    count: 312
  },
  {
    name: "Environmental",
    value: 88.5,
    count: 178
  },
  {
    name: "Process Efficiency",
    value: 94.1,
    count: 203
  },
  {
    name: "Documentation",
    value: 89.7,
    count: 156
  },
  {
    name: "Training Compliance",
    value: 91.3,
    count: 134
  }
];

const metricsData = {
    overallCompliance: 94,
    complianceChange: "+2.5% from last month",
    totalReports: 12847,
    reportsChange: "+18% from last month",
    activeBenchmarks: 23,
    benchmarksChange: "+3 new this month",
    avgResponseTime: 2.4,
    responseTimeChange: "-15% faster",
  }

// Additional metrics data
export const metrics = [
    {
      title: "Overall Compliance",
      value: `${metricsData.overallCompliance}%`,
      change: metricsData.complianceChange,
      trend: "up",
      icon: BarChart3,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Reports",
      value: metricsData.totalReports.toLocaleString(),
      change: metricsData.reportsChange,
      trend: "up",
      icon: Activity,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Benchmarks",
      value: metricsData.activeBenchmarks.toString(),
      change: metricsData.benchmarksChange,
      trend: "up",
      icon: PieChart,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Avg Response Time",
      value: `${metricsData.avgResponseTime}h`,
      change: metricsData.responseTimeChange,
      trend: "down",
      icon: BarChart3,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      iconColor: "text-orange-600",
    },
  ]

// Department performance data
export const departmentData = [
  {
    name: "Production",
    complianceRate: 95.8,
    totalReports: 456,
    trend: "up"
  },
  {
    name: "Quality Assurance",
    complianceRate: 97.2,
    totalReports: 234,
    trend: "up"
  },
  {
    name: "Maintenance",
    complianceRate: 91.5,
    totalReports: 189,
    trend: "down"
  },
  {
    name: "Logistics",
    complianceRate: 93.7,
    totalReports: 156,
    trend: "up"
  },
  {
    name: "Engineering",
    complianceRate: 96.1,
    totalReports: 212,
    trend: "up"
  }
];

// Weekly performance data
export const weeklyData = [
  { week: "Week 1", compliance: 92.5, reports: 45 },
  { week: "Week 2", compliance: 94.1, reports: 52 },
  { week: "Week 3", compliance: 91.8, reports: 48 },
  { week: "Week 4", compliance: 95.3, reports: 61 },
  { week: "Week 5", compliance: 93.7, reports: 55 },
  { week: "Week 6", compliance: 96.2, reports: 68 },
  { week: "Week 7", compliance: 94.8, reports: 59 },
  { week: "Week 8", compliance: 97.1, reports: 73 }
];

// Alert correlation data
export const alertCorrelationData = [
  { month: "Jan", alerts: 12, compliance: 80.4 },
  { month: "Feb", alerts: 8, compliance: 86.7 },
  { month: "Mar", alerts: 15, compliance: 77.4 },
  { month: "Apr", alerts: 6, compliance: 90.6 },
  { month: "May", alerts: 11, compliance: 84.6 },
  { month: "Jun", alerts: 5, compliance: 91.2 },
  { month: "Jul", alerts: 9, compliance: 89.4 },
  { month: "Aug", alerts: 4, compliance: 92.9 },
  { month: "Sep", alerts: 10, compliance: 88.4 },
  { month: "Oct", alerts: 3, compliance: 93.2 },
  { month: "Nov", alerts: 7, compliance: 88.9 },
  { month: "Dec", alerts: 2, compliance: 94.7 }
];
