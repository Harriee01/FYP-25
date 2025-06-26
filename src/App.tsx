import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import {} from "./components/layout/Header";
import { Dashboard } from "./components/dashboard/Dashboard";
import { QualityBenchmarks } from "./components/benchmarks/Qualitybenchmarks";
import { QualityReports } from "./components/reports/Qualityreports";
import { AlertsPanel } from "./components/alerts/AlertsPanel";
import { Analytics } from "./components/analytics/Analytics";
import { TeamManagement } from "./components/team/TeamManagement";
import AuditTrailDashBoard from "./components/audit/AuditTrail";
import { Settings } from "./components/settings/Settings";
import { inter } from "@/styles/fonts";
import { AppSidebar } from "./components/side-bar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Import icons
import {
  TerminalSquare,
  Bot,
  BookOpen,
  AudioWaveform,
  PieChart,
  Frame,
  Map,
  Settings2,
} from "lucide-react";
import TopHeaderSection from "./components/dashboard/alert";

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // ✅ Sidebar navigation config
  const navMain = [
    {
      title: "Dashboard",
      key: "dashboard",
      icon: TerminalSquare,
    },
    {
      title: "Benchmarks",
      key: "benchmarks",
      icon: Bot,
    },
    {
      title: "Reports",
      key: "reports",
      icon: BookOpen,
    },
    {
      title: "Alerts",
      key: "alerts",
      icon: AudioWaveform,
    },
    {
      title: "Analytics",
      key: "analytics",
      icon: PieChart,
    },
    {
      title: "Team",
      key: "team",
      icon: Frame,
    },
    {
      title: "Audit",
      key: "audit",
      icon: Map,
    },
    {
      title: "Settings",
      key: "settings",
      icon: Settings2,
    },
    {
      title: "Playground",
      key: "playground",
      icon: TerminalSquare,
    },
  ];

  // ✅ Tab-based content rendering
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} />;
      case "benchmarks":
        return <QualityBenchmarks />;
      case "reports":
        return <QualityReports />;
      case "alerts":
        return <AlertsPanel />;
      case "analytics":
        return <Analytics />;
      case "team":
        return <TeamManagement />;
      case "audit":
        return <AuditTrailDashBoard />;
      case "settings":
        return <Settings />;
      case "playground":
        return (
          <div>
            <h1 className="text-2xl font-bold">Welcome to the Playground</h1>
            <p className="text-muted-foreground">Experiment here.</p>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={`flex h-screen ${inter.className}`}>
      <SidebarProvider>
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          navItems={navMain}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SidebarTrigger />
          <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  if (showRegister) {
    return <RegisterForm onShowLogin={() => setShowRegister(false)} />;
  }

  return <LoginForm onShowRegister={() => setShowRegister(true)} />;
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
