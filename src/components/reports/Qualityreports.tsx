import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { supabase } from "../../supabase.ts";
import { QualityReport } from "../../types";
import { format } from "date-fns";

// Form data interface
interface ReportFormData {
  title: string;
  description: string;
}

// Enhanced type for better type safety with relations
interface QualityReportWithRelations extends QualityReport {
  benchmark?: { name: string; unit: string; category: string };
  inspector?: { name: string };
}

export const QualityReports: React.FC = () => {
  const [reports, setReports] = useState<QualityReportWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Dummy data for quality reports
      const dummyReports: QualityReportWithRelations[] = [
        {
          id: "1",
          benchmarkId: "bench1",
          inspectorId: "insp1",
          organizationId: "org1",
          value: 22.5,
          status: "compliant",
          createdAt: new Date("2024-01-15T10:30:00Z"),
          blockchainHash: "0x1234567890abcdef",
          benchmark: {
            name: "Temperature Control",
            unit: "°C",
            category: "Safety"
          },
          inspector: {
            name: "John Smith"
          }
        },
        {
          id: "2",
          benchmarkId: "bench2",
          inspectorId: "insp2",
          organizationId: "org1",
          value: 125.0,
          status: "compliant",
          createdAt: new Date("2024-01-20T14:15:00Z"),
          blockchainHash: "0xabcdef1234567890",
          benchmark: {
            name: "Pressure Monitoring",
            unit: "PSI",
            category: "Quality Control"
          },
          inspector: {
            name: "Sarah Johnson"
          }
        },
        {
          id: "3",
          benchmarkId: "bench3",
          inspectorId: "insp3",
          organizationId: "org1",
          value: 7.2,
          status: "warning",
          createdAt: new Date("2024-02-01T09:45:00Z"),
          blockchainHash: undefined,
          benchmark: {
            name: "pH Level Control",
            unit: "pH",
            category: "Environmental"
          },
          inspector: {
            name: "Mike Chen"
          }
        },
        {
          id: "4",
          benchmarkId: "bench4",
          inspectorId: "insp4",
          organizationId: "org1",
          value: 55.0,
          status: "non_compliant",
          createdAt: new Date("2024-02-10T16:20:00Z"),
          blockchainHash: undefined,
          benchmark: {
            name: "Humidity Management",
            unit: "%",
            category: "Process Efficiency"
          },
          inspector: {
            name: "Emily Davis"
          }
        }
      ];

      setReports(dummyReports);
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
        <div className="flex space-x-3">
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
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

      {/* Add Report Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-sage-200">
              <div>
                <h2 className="text-xl font-semibold text-hunter-900">
                  Add New Report
                </h2>
                <p className="text-sage-600 text-sm mt-1">
                  Create a new quality inspection report
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-sage-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form className="p-6 space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-hunter-900 mb-2">
                  Report Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Monthly Quality Inspection Report"
                  className="w-full"
                />
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-hunter-900 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description of this report..."
                  rows={4}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900 resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-sage-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ title: "", description: "" });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-hunter-600 hover:bg-hunter-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Report"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
