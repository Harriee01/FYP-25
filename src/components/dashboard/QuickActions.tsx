import React from "react";
import {
  Plus,
  FileText,
  BarChart3,
  Users,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick,
}) => {
  const actions = [
    {
      id: "new_report",
      title: "New Quality Report",
      description: "Submit inspection results",
      icon: FileText,
      color: "fern",
      onClick: () => onActionClick("reports"),
    },
    {
      id: "view_analytics",
      title: "View Analytics",
      description: "Check performance trends",
      icon: BarChart3,
      color: "hunter",
      onClick: () => onActionClick("analytics"),
    },
    {
      id: "manage_team",
      title: "Manage Team",
      description: "Add or edit team members",
      icon: Users,
      color: "sage",
      onClick: () => onActionClick("team"),
    },
    {
      id: "review_alerts",
      title: "Review Alerts",
      description: "Check compliance issues",
      icon: AlertTriangle,
      color: "orange",
      onClick: () => onActionClick("alerts"),
    },
    {
      id: "add_benchmark",
      title: "Add Benchmark",
      description: "Create quality standard",
      icon: Plus,
      color: "fern",
      onClick: () => onActionClick("benchmarks"),
    },
    {
      id: "system_settings",
      title: "System Settings",
      description: "Configure preferences",
      icon: Settings,
      color: "hunter",
      onClick: () => onActionClick("settings"),
    },
  ];

  return (
    <Card className="bg-ivory-50 border-sage-200">
      <CardHeader>
        <CardTitle className="text-hunter-900">Quick Actions</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 lg:grid-cols-3 p-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`p-4 rounded-lg border transition-all hover:shadow-md text-left ${
                action.color === "fern"
                  ? "bg-fern-50 hover:bg-fern-100 border-fern-200"
                  : action.color === "hunter"
                  ? "bg-hunter-50 hover:bg-hunter-100 border-hunter-200"
                  : action.color === "sage"
                  ? "bg-sage-100 hover:bg-sage-200 border-sage-300"
                  : "bg-orange-50 hover:bg-orange-100 border-orange-200"
              }`}
            >
              <Icon
                className={`h-6 w-6 mb-2 ${
                  action.color === "fern"
                    ? "text-fern-700"
                    : action.color === "hunter"
                    ? "text-hunter-700"
                    : action.color === "sage"
                    ? "text-sage-800"
                    : "text-orange-600"
                }`}
              />
              <h4 className="font-medium text-hunter-900 text-sm">
                {action.title}
              </h4>
              <p className="text-xs text-sage-700 mt-1">{action.description}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
