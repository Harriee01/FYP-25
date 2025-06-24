import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { QuickActions } from "./QuickActions";
import { supabase } from "../../lib/supabase.ts";
import { format } from "date-fns";

interface DashboardStats {
  totalReports: number;
  complianceRate: number;
  activeAlerts: number;
  teamMembers: number;
}

interface RecentReport {
  id: string;
  benchmark: { name: string };
  value: number;
  status: string;
  inspector: { name: string };
  createdAt: string;
}

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    complianceRate: 0,
    activeAlerts: 0,
    teamMembers: 0,
  });
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch reports count and compliance rate
      const { data: reports } = await supabase
        .from("quality_reports")
        .select("status");

      const totalReports = reports?.length || 0;
      const compliantReports =
        reports?.filter((r) => r.status === "compliant").length || 0;
      const complianceRate =
        totalReports > 0 ? (compliantReports / totalReports) * 100 : 0;

      // Fetch active alerts count
      const { data: alerts } = await supabase
        .from("alerts")
        .select("id")
        .eq("is_read", false);

      // Fetch team members count
      const { data: users } = await supabase
        .from("users")
        .select("id")
        .eq("is_active", true);

      // Fetch recent reports
      const { data: recentReportsData } = await supabase
        .from("quality_reports")
        .select(
          `
          id,
          value,
          status,
          created_at,
          benchmark:quality_benchmarks(name),
          inspector:users!quality_reports_inspector_id_fkey(name)
        `
        )
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalReports,
        complianceRate: Math.round(complianceRate * 10) / 10,
        activeAlerts: alerts?.length || 0,
        teamMembers: users?.length || 0,
      });

      setRecentReports(recentReportsData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Quality Reports",
      value: stats.totalReports.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "fern",
    },
    {
      title: "Compliance Rate",
      value: `${stats.complianceRate}%`,
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "fern",
    },
    {
      title: "Active Alerts",
      value: stats.activeAlerts.toString(),
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "Team Members",
      value: stats.teamMembers.toString(),
      change: "+2",
      trend: "up",
      icon: Users,
      color: "hunter",
    },
  ];

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
        <h1 className="text-2xl font-bold text-hunter-900">Dashboard</h1>
        <p className="text-sage-700">
          Overview of your quality management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden bg-ivory-50 border-sage-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-700">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-hunter-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp
                      className={`h-4 w-4 mr-1 ${
                        stat.trend === "up" ? "text-fern-600" : "text-red-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-fern-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    stat.color === "fern"
                      ? "bg-fern-100"
                      : stat.color === "hunter"
                      ? "bg-hunter-100"
                      : "bg-red-100"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      stat.color === "fern"
                        ? "text-fern-700"
                        : stat.color === "hunter"
                        ? "text-hunter-700"
                        : "text-red-600"
                    }`}
                  />
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
            <CardTitle className="text-hunter-900">
              Recent Quality Reports
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-sage-50 rounded-lg border border-sage-100"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-hunter-900">
                    {report.benchmark?.name}
                  </h4>
                  <p className="text-sm text-sage-700">
                    by {report.inspector?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-hunter-900">{report.value}</p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === "compliant"
                          ? "bg-fern-100 text-fern-800"
                          : report.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {report.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <Clock className="h-4 w-4 text-sage-500 inline mr-1" />
                  <span className="text-xs text-sage-600">
                    {format(new Date(report.createdAt), "MMM dd, HH:mm")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <QuickActions onActionClick={onNavigate} />
      </div>
    </div>
  );
};
