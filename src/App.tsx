import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "benchmarks":
        return (
          <div className="p-6 text-hunter-900">
            Quality Benchmarks - Coming Soon
          </div>
        );
      case "reports":
        return (
          <div className="p-6 text-hunter-900">
            Quality Reports - Coming Soon
          </div>
        );
      case "alerts":
        return <div className="p-6 text-hunter-900">Alerts - Coming Soon</div>;
      case "analytics":
        return (
          <div className="p-6 text-hunter-900">Analytics - Coming Soon</div>
        );
      case "team":
        return (
          <div className="p-6 text-hunter-900">
            Team Management - Coming Soon
          </div>
        );
      case "audit":
        return (
          <div className="p-6 text-hunter-900">Audit Trail - Coming Soon</div>
        );
      case "settings":
        return (
          <div className="p-6 text-hunter-900">Settings - Coming Soon</div>
        );
      default:
        return <Dashboard />;
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
