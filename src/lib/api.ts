// lib/api.ts - API client for your audit backend

// lib/api.ts - API client for your audit backend

const API_BASE_URL = "http://localhost:3000/api";

interface ApiResponse<T> {
  status: string;
  message?: string;
  timestamp: string;
  [key: string]: any;
}

class AuditAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `HTTP ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health and status checks
  async getHealth(): Promise<ApiResponse<any>> {
    return this.request("/health");
  }

  async getStatus(): Promise<ApiResponse<any>> {
    return this.request("/status");
  }

  async getSolanaHealth(): Promise<ApiResponse<any>> {
    return this.request("/solana-health");
  }

  async getProgramInfo(): Promise<ApiResponse<any>> {
    return this.request("/program-info");
  }

  async getWalletInfo(): Promise<ApiResponse<any>> {
    return this.request("/wallet-test");
  }

  // User management
  async verifyUser(walletAddress: string): Promise<ApiResponse<any>> {
    return this.request("/user/verify", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });
  }

  async registerUser(
    walletAddress: string,
    role: string
  ): Promise<ApiResponse<any>> {
    return this.request("/user/register", {
      method: "POST",
      body: JSON.stringify({ walletAddress, role }),
    });
  }

  async getUserProfile(walletAddress: string): Promise<ApiResponse<any>> {
    return this.request(`/user/${walletAddress}`);
  }

  // Audit operations
  async submitAudit(auditData: {
    companyPubkey?: string;
    hash?: number[];
    metadata: string;
    auditType?: any;
    requiresApproval?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request("/submit-audit", {
      method: "POST",
      body: JSON.stringify(auditData),
    });
  }

  async getAudit(auditPubkey: string): Promise<ApiResponse<any>> {
    return this.request(`/audit/${auditPubkey}`);
  }

  async getAllAudits(): Promise<ApiResponse<any>> {
    return this.request("/audits/all");
  }

  async approveAudit(
    auditPubkey: string,
    approverPubkey: string
  ): Promise<ApiResponse<any>> {
    return this.request(`/audit/${auditPubkey}/approve`, {
      method: "POST",
      body: JSON.stringify({ approverPubkey }),
    });
  }

  // Utility functions
  async checkConnection(): Promise<boolean> {
    try {
      console.log("Checking connection to:", this.baseURL); // Debug log
      const result = await this.getHealth();
      console.log("Health check result:", result); // Debug log
      return true;
    } catch (error) {
      console.error("Backend connection failed:", error);
      return false;
    }
  }
  // Generate hash from string (simple implementation)
  generateHash(input: string): number[] {
    const hash = Array.from({ length: 32 }, (_, i) => {
      return (input.charCodeAt(i % input.length) + i) % 256;
    });
    return hash;
  }
}

// Export singleton instance
export const auditAPI = new AuditAPI();

// Export class for custom instances
export default AuditAPI;
