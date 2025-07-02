// lib/api.ts - Updated for real Solana program

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

  // Organization Management
  async registerOrganization(orgData: {
    name: string;
    sector: string;
    address: string;
  }): Promise<ApiResponse<any>> {
    return this.request("/organization/register", {
      method: "POST",
      body: JSON.stringify(orgData),
    });
  }

  async getAllOrganizations(): Promise<ApiResponse<any>> {
    return this.request("/organizations");
  }

  // Stakeholder Management
  async addStakeholder(stakeholderData: {
    organizationPDA: string;
    userPubkey: string;
    name: string;
    contactInfo: string;
    stakeholderType: string;
  }): Promise<ApiResponse<any>> {
    return this.request("/stakeholder/add", {
      method: "POST",
      body: JSON.stringify(stakeholderData),
    });
  }

  // Quality Standards Management
  async createQualityStandard(standardData: {
    name: string;
    version: string;
    sector: string;
    requirements: string;
  }): Promise<ApiResponse<any>> {
    return this.request("/quality-standard/create", {
      method: "POST",
      body: JSON.stringify(standardData),
    });
  }

  async getAllQualityStandards(): Promise<ApiResponse<any>> {
    return this.request("/quality-standards");
  }

  // Quality Checks Management
  async createQualityCheck(checkData: {
    standardPDA: string;
    description: string;
    criteria: string;
    frequency: string;
    blockchainRef: string;
  }): Promise<ApiResponse<any>> {
    return this.request("/quality-check/create", {
      method: "POST",
      body: JSON.stringify(checkData),
    });
  }

  // Real Audit Management
  async initiateAudit(auditData: {
    organizationPDA: string;
    qualityCheckPDA: string;
    auditType: string;
    scope: string;
    expectedCompletion: number;
  }): Promise<ApiResponse<any>> {
    return this.request("/audit/initiate", {
      method: "POST",
      body: JSON.stringify(auditData),
    });
  }

  async completeAudit(completionData: {
    auditPDA: string;
    organizationPDA: string;
    auditId: number;
    findings: string;
    complianceScore: number;
    recommendations: string;
  }): Promise<ApiResponse<any>> {
    return this.request("/audit/complete", {
      method: "POST",
      body: JSON.stringify(completionData),
    });
  }

  async getAllAudits(): Promise<ApiResponse<any>> {
    return this.request("/audits");
  }

  // Legacy support for simple audit submission
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

  // Utility functions
  async checkConnection(): Promise<boolean> {
    try {
      await this.getHealth();
      return true;
    } catch (error) {
      console.error("Backend connection failed:", error);
      return false;
    }
  }

  // Generate hash from string
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
