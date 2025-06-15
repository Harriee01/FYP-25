export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'quality_manager' | 'quality_inspector' | 'auditor';
  organizationId: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  adminId: string;
  createdAt: Date;
  isActive: boolean;
}

export interface QualityBenchmark {
  id: string;
  name: string;
  description: string;
  category: string;
  minValue: number;
  maxValue: number;
  unit: string;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface QualityReport {
  id: string;
  benchmarkId: string;
  value: number;
  status: 'compliant' | 'non_compliant' | 'warning';
  notes?: string;
  inspectorId: string;
  organizationId: string;
  createdAt: Date;
  blockchainHash?: string;
}

export interface AuditTrail {
  id: string;
  action: string;
  entityType: 'benchmark' | 'report' | 'user' | 'organization';
  entityId: string;
  userId: string;
  timestamp: Date;
  details: Record<string, any>;
  blockchainHash: string;
}

export interface Alert {
  id: string;
  type: 'deviation' | 'compliance' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  reportId?: string;
  isRead: boolean;
  createdAt: Date;
}