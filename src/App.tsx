import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { QualityBenchmarks } from "./components/benchmarks/QualityBenchmarks";
import { QualityReports } from "./components/reports/QualityReports";
import { AlertsPanel } from "./components/alerts/AlertsPanel";
import { Analytics } from "./components/analytics/Analytics";
import { TeamManagement } from "./components/team/TeamManagement";
import { AuditTrail } from "./components/audit/AuditTrail";
import { Settings } from "./components/settings/Settings";

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
        return <AuditTrail />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-sage-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
