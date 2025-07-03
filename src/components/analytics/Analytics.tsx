import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import {
  complianceData,
  trendData,
  categoryData,
  metrics,
} from "../data/analyticData";

const COLORS = ["#4a6741", "#4a8b54", "#7f8669", "#f0ede6"];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hunter-900">Analytics</h1>
        <p className="text-sage-700">Quality performance insights and trends</p>
      </div>

      {/* Key Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-ivory-50 border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700">
                Overall Compliance
              </p>
              <p className="text-2xl font-bold text-hunter-900">
                {metricsData.overallCompliance}%
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">
                  {metricsData.complianceChange}
                </span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-fern-700" />
          </div>
        </Card>

        <Card className="bg-ivory-50 border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700">Total Reports</p>
              <p className="text-2xl font-bold text-hunter-900">
                {metricsData.totalReports.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">
                  {metricsData.reportsChange}
                </span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-hunter-700" />
          </div>
        </Card>

        <Card className="bg-ivory-50 border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700">
                Active Benchmarks
              </p>
              <p className="text-2xl font-bold text-hunter-900">
                {metricsData.activeBenchmarks}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">
                  {metricsData.benchmarksChange}
                </span>
              </div>
            </div>
            <PieChartIcon className="h-8 w-8 text-sage-700" />
          </div>
        </Card>

        <Card className="bg-ivory-50 border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700">
                Avg Response Time
              </p>
              <p className="text-2xl font-bold text-hunter-900">
                {metricsData.avgResponseTime}h
              </p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">
                  {metricsData.responseTimeChange}
                </span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-fern-700" />
          </div>
        </Card>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card
            key={index}
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${metric.bgGradient}`}
          >
            {/* Gradient accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.gradient}`} />

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-white/80 backdrop-blur-sm ${metric.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <TrendIcon className="h-3 w-3 mr-1" />
                  <span>{metric.change}</span>
                </div>
              </div>
            </div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          </Card>
        )
      })}
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <Card className="bg-ivory-50 border-sage-200">
          <CardHeader>
            <CardTitle className="text-hunter-900">Compliance Trend</CardTitle>
          </CardHeader>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4d8ca" />
                <XAxis dataKey="month" stroke="#7f8669" />
                <YAxis stroke="#7f8669" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fefefe",
                    border: "1px solid #d4d8ca",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="complianceRate"
                  stroke="#4a8b54"
                  strokeWidth={3}
                  dot={{ fill: "#4a8b54", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Performance */}
        <Card className="bg-ivory-50 border-sage-200">
          <CardHeader>
            <CardTitle className="text-hunter-900">
              Performance by Category
            </CardTitle>
          </CardHeader>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fefefe",
                    border: "1px solid #d4d8ca",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Reports */}
        <Card className="bg-ivory-50 border-sage-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-hunter-900">
              Monthly Report Status
            </CardTitle>
          </CardHeader>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4d8ca" />
                <XAxis dataKey="month" stroke="#7f8669" />
                <YAxis stroke="#7f8669" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fefefe",
                    border: "1px solid #d4d8ca",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="compliant"
                  stackId="a"
                  fill="#4a8b54"
                  name="Compliant"
                />
                <Bar
                  dataKey="warning"
                  stackId="a"
                  fill="#a3a3a3"
                  name="Warning"
                />
                <Bar
                  dataKey="non_compliant"
                  stackId="a"
                  fill="#fdba74"
                  name="Non-Compliant"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
