import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { supabase } from "../../lib/supabase.ts";
import { QualityReport } from "../../types";
import { format } from "date-fns";

export const QualityReports: React.FC = () => {
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("quality_reports")
        .select(
          `
          *,
          benchmark:quality_benchmarks(name, unit, category),
          inspector:users!quality_reports_inspector_id_fkey(name)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.benchmark?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.inspector?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-fern-100 text-fern-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "non_compliant":
        return "bg-red-100 text-red-800";
      default:
        return "bg-sage-100 text-sage-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <TrendingUp className="h-4 w-4" />;
      case "warning":
      case "non_compliant":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-hunter-900">
            Quality Reports
          </h1>
          <p className="text-sage-700">
            View and manage quality inspection reports
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-ivory-50 border-sage-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="warning">Warning</option>
              <option value="non_compliant">Non-Compliant</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <Card className="bg-ivory-50 border-sage-200">
        <CardHeader>
          <CardTitle className="text-hunter-900">Recent Reports</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-sage-50 rounded-lg border border-sage-100 hover:bg-sage-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {getStatusIcon(report.status)}
                  </div>
                  <div>
                    <h4 className="font-medium text-hunter-900">
                      {report.benchmark?.name}
                    </h4>
                    <p className="text-sm text-sage-700">
                      by {report.inspector?.name} •{" "}
                      {format(new Date(report.createdAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right mr-4">
                <p className="font-medium text-hunter-900">
                  {report.value} {report.benchmark?.unit}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
                {report.blockchainHash && (
                  <div className="text-xs text-sage-600 bg-sage-200 px-2 py-1 rounded">
                    Blockchain Verified
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredReports.length === 0 && (
        <Card className="bg-ivory-50 border-sage-200 text-center py-12">
          <p className="text-sage-700">
            No reports found matching your criteria.
          </p>
        </Card>
      )}
    </div>
  );
};
