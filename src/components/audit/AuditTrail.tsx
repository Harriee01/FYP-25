import React, { useState, useEffect } from "react";
import { FileText, Search, Filter, Shield, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { supabase } from "../../lib/supabase.ts";
import { AuditTrail as AuditTrailType } from "../../types";
import { format } from "date-fns";

export const AuditTrail: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditTrailType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_trail")
        .select(
          `
          *,
          user:users(name, email)
        `
        )
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-fern-100 text-fern-800";
      case "UPDATE":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "VIEW":
        return "bg-sage-100 text-sage-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case "quality_report":
        return <FileText className="h-4 w-4" />;
      case "quality_benchmark":
        return <Shield className="h-4 w-4" />;
      case "user":
        return <Shield className="h-4 w-4" />;
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
          <h1 className="text-2xl font-bold text-hunter-900">Audit Trail</h1>
          <p className="text-sage-700">
            Complete record of all system activities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-fern-600" />
          <span className="text-sm text-sage-700">Blockchain Secured</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-ivory-50 border-sage-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
            >
              <option value="all">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="VIEW">View</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Audit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["CREATE", "UPDATE", "DELETE", "VIEW"].map((action) => {
          const count = auditLogs.filter((log) => log.action === action).length;
          return (
            <Card key={action} className="bg-ivory-50 border-sage-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-700">{action}</p>
                  <p className="text-2xl font-bold text-hunter-900">{count}</p>
                </div>
                <div className={`p-2 rounded-full ${getActionColor(action)}`}>
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Audit Logs */}
      <Card className="bg-ivory-50 border-sage-200">
        <CardHeader>
          <CardTitle className="text-hunter-900">Recent Activity</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-sage-50 rounded-lg border border-sage-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className={`p-2 rounded-full ${getActionColor(log.action)}`}
                  >
                    {getEntityTypeIcon(log.entityType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-hunter-900">
                        {log.entityType.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-sage-700 mt-1">
                      {log.user?.name} performed {log.action.toLowerCase()}{" "}
                      action on {log.entityType.replace("_", " ")}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-sage-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(
                            new Date(log.timestamp),
                            "MMM dd, yyyy HH:mm:ss"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3 text-fern-600" />
                        <span className="text-fern-600">
                          Hash: {log.blockchainHash.substring(0, 12)}...
                        </span>
                      </div>
                    </div>
                    {Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-2 bg-ivory-50 rounded text-xs">
                        <pre className="text-sage-700 whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredLogs.length === 0 && (
        <Card className="bg-ivory-50 border-sage-200 text-center py-12">
          <p className="text-sage-700">
            No audit logs found matching your criteria.
          </p>
        </Card>
      )}
    </div>
  );
};
