import React, { useState, useEffect } from "react";
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
import { supabase } from "../../supabase.ts";

const COLORS = ["#4a6741", "#4a8b54", "#7f8669", "#f0ede6"];

export const Analytics: React.FC = () => {
  const [complianceData, setComplianceData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch compliance data by month
      const { data: reports } = await supabase
        .from("quality_reports")
        .select(
          `
          created_at,
          status,
          benchmark:quality_benchmarks(category)
        `
        )
        .order("created_at", { ascending: true });

      if (reports) {
        // Process compliance data
        const monthlyCompliance = reports.reduce((acc, report) => {
          const month = new Date(report.created_at).toLocaleDateString(
            "en-US",
            { month: "short", year: "numeric" }
          );
          if (!acc[month]) {
            acc[month] = {
              month,
              compliant: 0,
              warning: 0,
              non_compliant: 0,
              total: 0,
            };
          }
          acc[month][report.status]++;
          acc[month].total++;
          return acc;
        }, {});

        const complianceArray = Object.values(monthlyCompliance).map(
          (item: any) => ({
            ...item,
            complianceRate: ((item.compliant / item.total) * 100).toFixed(1),
          })
        );

        setComplianceData(complianceArray);

        // Process trend data
        const trendArray = complianceArray.map((item: any) => ({
          month: item.month,
          complianceRate: parseFloat(item.complianceRate),
        }));
        setTrendData(trendArray);

        // Process category data
        const categoryStats = reports.reduce((acc, report) => {
          const category = report.benchmark?.category || "Unknown";
          if (!acc[category]) {
            acc[category] = { name: category, compliant: 0, total: 0 };
          }
          if (report.status === "compliant") acc[category].compliant++;
          acc[category].total++;
          return acc;
        }, {});

        const categoryArray = Object.values(categoryStats).map((item: any) => ({
          name: item.name,
          value: ((item.compliant / item.total) * 100).toFixed(1),
          count: item.total,
        }));

        setCategoryData(categoryArray);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hunter-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hunter-900">Analytics</h1>
        <p className="text-sage-700">Quality performance insights and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-ivory-50 border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700">
                Overall Compliance
              </p>
              <p className="text-2xl font-bold text-hunter-900">94.2%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">+2.1%</span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-fern-700" />
          </div>
        </Card>

        <Card className="bg-ivory-50 border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sage-700">Total Reports</p>
              <p className="text-2xl font-bold text-hunter-900">1,247</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">+12%</span>
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
              <p className="text-2xl font-bold text-hunter-900">24</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">+3</span>
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
              <p className="text-2xl font-bold text-hunter-900">2.4h</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-fern-600 mr-1" />
                <span className="text-sm text-fern-600">-0.3h</span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-fern-700" />
          </div>
        </Card>
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
                  fill="#eab308"
                  name="Warning"
                />
                <Bar
                  dataKey="non_compliant"
                  stackId="a"
                  fill="#dc2626"
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
