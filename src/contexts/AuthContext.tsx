import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Organization } from "../types";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (user: Partial<User>) => Promise<void>; // <- added
  logout: () => void;
  registerOrganization: (
    orgData: Partial<Organization>,
    adminData: Partial<User>
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const login = async (email: string, password: string) => {
    void password;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    const mockUser: User = {
      id: "1",
      email,
      name: "John Doe",
      role: "admin",
      organizationId: "1",
      createdAt: new Date(),
    };

    const mockOrg: Organization = {
      id: "1",
      name: "TechCorp Industries",
      industry: "Manufacturing",
      adminId: "1",
      createdAt: new Date(),
      isActive: true,
    };

    setUser(mockUser);
    setOrganization(mockOrg);
  };

  const loginWithWallet = async (userData: Partial<User>) => {
    // You can fetch more info about user/org here if needed
    const walletUser: User = {
      id: userData.id || "wallet-user-id",
      email: userData.email || "",
      name: userData.name || "Wallet User",
      role: userData.role || "quality_inspector",
      organizationId: userData.organizationId || "unknown-org",
      createdAt: new Date(),
    };

    setUser(walletUser);

    // Optional: fetch and set org if needed
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
  };

  const registerOrganization = async (
    orgData: Partial<Organization>,
    adminData: Partial<User>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newOrg: Organization = {
      id: Date.now().toString(),
      name: orgData.name || "",
      industry: orgData.industry || "",
      adminId: Date.now().toString(),
      createdAt: new Date(),
      isActive: true,
    };

    const newAdmin: User = {
      id: newOrg.adminId,
      email: adminData.email || "",
      name: adminData.name || "",
      role: "admin",
      organizationId: newOrg.id,
      createdAt: new Date(),
    };

    setOrganization(newOrg);
    setUser(newAdmin);
  };

  const value: AuthContextType = {
    user,
    organization,
    isAuthenticated: !!user,
    login,
    loginWithWallet, // <- include here
    logout,
    registerOrganization,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
