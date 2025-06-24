import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card.tsx";
import { Button } from "../ui/Button.tsx";
import { supabase } from "../../lib/supabase.ts";
import { Alert } from "../../types/index.ts";
import { format } from "date-fns";

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select(
          `
          *,
          report:quality_reports(
            benchmark:quality_benchmarks(name)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ is_read: true })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "unread") return !alert.isRead;
    if (filter === "read") return alert.isRead;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-fern-100 text-fern-800 border-fern-200";
      default:
        return "bg-sage-100 text-sage-800 border-sage-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-5 w-5" />;
      case "medium":
        return <Clock className="h-5 w-5" />;
      case "low":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
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
          <h1 className="text-2xl font-bold text-hunter-900">Alerts</h1>
          <p className="text-sage-700">
            Monitor quality compliance issues and notifications
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
          >
            <option value="all">All Alerts</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["critical", "high", "medium", "low"].map((severity) => {
          const count = alerts.filter(
            (alert) => alert.severity === severity
          ).length;
          return (
            <Card
              key={severity}
              className={`${getSeverityColor(severity)} border-2`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium capitalize">{severity}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                {getSeverityIcon(severity)}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alerts List */}
      <Card className="bg-ivory-50 border-sage-200">
        <CardHeader>
          <CardTitle className="text-hunter-900">Recent Alerts</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all ${
                alert.isRead
                  ? "bg-sage-50 border-sage-200"
                  : "bg-ivory-50 border-sage-300 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className={`p-2 rounded-full ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4
                        className={`font-medium ${
                          alert.isRead ? "text-sage-800" : "text-hunter-900"
                        }`}
                      >
                        {alert.title}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                      {!alert.isRead && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-hunter-100 text-hunter-800">
                          New
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        alert.isRead ? "text-sage-600" : "text-sage-700"
                      }`}
                    >
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-sage-600">
                      <span>
                        {format(
                          new Date(alert.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </span>
                      {alert.report?.benchmark?.name && (
                        <span>Related to: {alert.report.benchmark.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!alert.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredAlerts.length === 0 && (
        <Card className="bg-ivory-50 border-sage-200 text-center py-12">
          <CheckCircle className="h-12 w-12 text-fern-600 mx-auto mb-4" />
          <p className="text-sage-700">
            No alerts found. Everything looks good!
          </p>
        </Card>
      )}
    </div>
  );
};
