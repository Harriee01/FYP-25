"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
  Settings,
  Shield,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";

interface Organization {
  pubkey: string;
  data: {
    name: string;
    sector: string;
    address: string;
    authority: string;
    isActive: boolean;
    createdAt: number;
  };
}

interface QualityStandard {
  pubkey: string;
  data: {
    name: string;
    version: string;
    sector: string;
    requirements: string;
    createdBy: string;
    isActive: boolean;
  };
}

interface QualityCheck {
  pubkey: string;
  data: {
    standardPDA: string;
    description: string;
    criteria: string[];
    frequency: string;
    blockchainRef: string;
    isActive: boolean;
  };
}

interface Audit {
  pubkey: string;
  data: {
    organization: string;
    qualityCheck: string;
    auditor: string;
    auditType: any;
    scope: string;
    status: any;
    auditId: string;
    initiatedAt: string;
    expectedCompletion: string;
    completedAt?: string;
    findings?: string;
    complianceScore?: number;
    recommendations?: string;
  };
}

// Mock API functions - replace with your actual API
const auditAPI = {
  async getAllOrganizations() {
    const response = await fetch("http://localhost:3000/api/organizations");
    return response.json();
  },

  async getAllQualityStandards() {
    const response = await fetch("http://localhost:3000/api/quality-standards");
    return response.json();
  },

  async getAllAudits() {
    const response = await fetch("http://localhost:3000/api/audits");
    return response.json();
  },

  async registerOrganization(data: {
    name: string;
    sector: string;
    address: string;
  }) {
    const response = await fetch(
      "http://localhost:3000/api/organization/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  async createQualityStandard(data: {
    name: string;
    version: string;
    sector: string;
    requirements: string;
  }) {
    const response = await fetch(
      "http://localhost:3000/api/quality-standard/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          requirements: [data.requirements], // Convert to array format
        }),
      }
    );
    return response.json();
  },

  async createQualityCheck(data: {
    standardPDA: string;
    description: string;
    criteria: string[];
    frequency: string;
    blockchainRef: string;
  }) {
    const response = await fetch(
      "http://localhost:3000/api/quality-check/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },

  async initiateAudit(data: {
    organizationPDA: string;
    qualityCheckPDA: string;
    auditType: string;
    scope: string;
    expectedCompletion: number;
  }) {
    const response = await fetch("http://localhost:3000/api/audit/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async completeAudit(data: {
    auditPDA: string;
    organizationPDA: string;
    qualityCheckPDA: string;
    auditId: number;
    findings: string[];
    complianceScore: number;
    recommendations: string[];
  }) {
    const response = await fetch("http://localhost:3000/api/audit/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default function ProperAuditWorkflow() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Data states
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [qualityStandards, setQualityStandards] = useState<QualityStandard[]>(
    []
  );
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);

  // Form states
  const [orgForm, setOrgForm] = useState({
    name: "",
    sector: "",
    address: "",
  });

  const [standardForm, setStandardForm] = useState({
    name: "",
    version: "",
    sector: "",
    requirements: "",
  });

  const [checkForm, setCheckForm] = useState({
    standardPDA: "",
    description: "",
    criteria: "",
    frequency: "Monthly",
    blockchainRef: "",
  });

  const [auditForm, setAuditForm] = useState({
    selectedOrg: "",
    selectedCheck: "",
    auditType: "",
    scope: "",
    expectedDays: 30,
  });

  const [completeForm, setCompleteForm] = useState({
    auditPDA: "",
    findings: "",
    complianceScore: 85,
    recommendations: "",
  });

  // Initialize
  useEffect(() => {
    loadData();
  }, []);

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage("");
    } else {
      setSuccessMessage(message);
      setErrorMessage("");
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 5000);
  };

  const loadData = async () => {
    try {
      const [orgsResult, standardsResult, auditsResult] = await Promise.all([
        auditAPI.getAllOrganizations(),
        auditAPI.getAllQualityStandards(),
        auditAPI.getAllAudits(),
      ]);

      setOrganizations(orgsResult.organizations || []);
      setQualityStandards(standardsResult.standards || []);
      setAudits(auditsResult.audits || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      showMessage("Failed to load data from backend", true);
    }
  };

  // Register Organization
  const handleRegisterOrganization = async () => {
    if (!orgForm.name || !orgForm.sector || !orgForm.address) {
      showMessage("Please fill in all organization fields", true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await auditAPI.registerOrganization(orgForm);

      if (result.success) {
        showMessage(
          `Organization registered! PDA: ${result.organizationPDA.slice(
            0,
            8
          )}...`
        );
        setOrgForm({ name: "", sector: "", address: "" });
        await loadData();
      } else {
        showMessage(result.error || "Failed to register organization", true);
      }
    } catch (error) {
      showMessage(
        `Failed to register organization: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Create Quality Standard
  const handleCreateStandard = async () => {
    if (
      !standardForm.name ||
      !standardForm.version ||
      !standardForm.sector ||
      !standardForm.requirements
    ) {
      showMessage("Please fill in all quality standard fields", true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await auditAPI.createQualityStandard(standardForm);

      if (result.success) {
        showMessage(
          `Quality standard created! PDA: ${result.standardPDA.slice(0, 8)}...`
        );
        setStandardForm({
          name: "",
          version: "",
          sector: "",
          requirements: "",
        });
        await loadData();
      } else {
        showMessage(result.error || "Failed to create quality standard", true);
      }
    } catch (error) {
      showMessage(
        `Failed to create quality standard: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Create Quality Check
  const handleCreateQualityCheck = async () => {
    if (
      !checkForm.standardPDA ||
      !checkForm.description ||
      !checkForm.criteria ||
      !checkForm.blockchainRef
    ) {
      showMessage("Please fill in all quality check fields", true);
      return;
    }

    setIsLoading(true);
    try {
      const criteriaArray = checkForm.criteria
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      const result = await auditAPI.createQualityCheck({
        ...checkForm,
        criteria: criteriaArray,
        blockchainRef: checkForm.blockchainRef || `ref_${Date.now()}`,
      });

      if (result.success) {
        showMessage(
          `Quality check created! PDA: ${result.checkPDA.slice(0, 8)}...`
        );
        setCheckForm({
          standardPDA: "",
          description: "",
          criteria: "",
          frequency: "Monthly",
          blockchainRef: "",
        });
        await loadData();
      } else {
        showMessage(result.error || "Failed to create quality check", true);
      }
    } catch (error) {
      showMessage(
        `Failed to create quality check: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate Audit
  const handleInitiateAudit = async () => {
    if (
      !auditForm.selectedOrg ||
      !auditForm.selectedCheck ||
      !auditForm.auditType ||
      !auditForm.scope
    ) {
      showMessage("Please fill in all audit fields", true);
      return;
    }

    setIsLoading(true);
    try {
      const expectedCompletion =
        Math.floor(Date.now() / 1000) + auditForm.expectedDays * 24 * 60 * 60;

      const result = await auditAPI.initiateAudit({
        organizationPDA: auditForm.selectedOrg,
        qualityCheckPDA: auditForm.selectedCheck,
        auditType: auditForm.auditType,
        scope: auditForm.scope,
        expectedCompletion: expectedCompletion,
      });

      if (result.success) {
        showMessage(
          `Audit initiated! Audit ID: ${
            result.auditId
          }, PDA: ${result.auditPDA.slice(0, 8)}...`
        );
        setAuditForm({
          selectedOrg: "",
          selectedCheck: "",
          auditType: "",
          scope: "",
          expectedDays: 30,
        });
        await loadData();
      } else {
        showMessage(result.error || "Failed to initiate audit", true);
      }
    } catch (error) {
      showMessage(
        `Failed to initiate audit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Complete Audit
  const handleCompleteAudit = async () => {
    if (
      !completeForm.auditPDA ||
      !completeForm.findings ||
      !completeForm.recommendations
    ) {
      showMessage("Please fill in all completion fields", true);
      return;
    }

    const selectedAudit = audits.find(
      (a) => a.pubkey === completeForm.auditPDA
    );
    if (!selectedAudit) {
      showMessage("Selected audit not found", true);
      return;
    }

    setIsLoading(true);
    try {
      const findingsArray = completeForm.findings
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      const recommendationsArray = completeForm.recommendations
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const result = await auditAPI.completeAudit({
        auditPDA: completeForm.auditPDA,
        organizationPDA: selectedAudit.data.organization,
        qualityCheckPDA: selectedAudit.data.qualityCheck,
        auditId: parseInt(selectedAudit.data.auditId) || Date.now(),
        findings: findingsArray,
        complianceScore: completeForm.complianceScore,
        recommendations: recommendationsArray,
      });

      if (result.success) {
        showMessage(
          `Audit completed successfully! Transaction: ${result.transactionId.slice(
            0,
            8
          )}...`
        );
        setCompleteForm({
          auditPDA: "",
          findings: "",
          complianceScore: 85,
          recommendations: "",
        });
        await loadData();
      } else {
        showMessage(result.error || "Failed to complete audit", true);
      }
    } catch (error) {
      showMessage(
        `Failed to complete audit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: any) => {
    if (status?.completed)
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    if (status?.initiated)
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    if (status?.inProgress)
      return (
        <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      );
    return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  };

  const getAuditTypeIcon = (auditType: any) => {
    if (auditType?.security) return <Shield className="w-4 h-4" />;
    if (auditType?.compliance) return <CheckCircle className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const calculateAverageCompliance = () => {
    const completedAudits = audits.filter((a) => a.data.complianceScore);
    if (completedAudits.length === 0) return 0;
    return Math.round(
      completedAudits.reduce(
        (sum, audit) => sum + (audit.data.complianceScore || 0),
        0
      ) / completedAudits.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Solana Audit System - Complete Workflow
          </h1>
          <p className="text-gray-600">
            Complete blockchain-based audit management with full functionality
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Organizations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {organizations.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Quality Standards
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {qualityStandards.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Audits
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {audits.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Compliance
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateAverageCompliance()}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Organizations</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
            <TabsTrigger value="checks">Quality Checks</TabsTrigger>
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Audits */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Audits</CardTitle>
                  <CardDescription>Latest audit activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audits.slice(0, 5).map((audit, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getAuditTypeIcon(audit.data.auditType)}
                          <div>
                            <p className="font-medium">{audit.data.scope}</p>
                            <p className="text-sm text-gray-600">
                              Score: {audit.data.complianceScore || "Pending"}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(audit.data.status)}
                      </div>
                    ))}
                    {audits.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No audits yet. Start by creating your first audit!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Organizations List */}
              <Card>
                <CardHeader>
                  <CardTitle>Organizations</CardTitle>
                  <CardDescription>Registered organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizations.slice(0, 5).map((org, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{org.data.name}</p>
                          <p className="text-sm text-gray-600">
                            {org.data.sector}
                          </p>
                        </div>
                        <Badge
                          className={
                            org.data.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {org.data.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                    {organizations.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No organizations yet. Register your first organization!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Setup Tab - Organizations */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Register Organization</CardTitle>
                <CardDescription>
                  Register your organization on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={orgForm.name}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, name: e.target.value })
                      }
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="orgSector">Sector</Label>
                    <Input
                      id="orgSector"
                      value={orgForm.sector}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, sector: e.target.value })
                      }
                      placeholder="Technology"
                    />
                  </div>
                  <div>
                    <Label htmlFor="orgAddress">Address</Label>
                    <Input
                      id="orgAddress"
                      value={orgForm.address}
                      onChange={(e) =>
                        setOrgForm({ ...orgForm, address: e.target.value })
                      }
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleRegisterOrganization}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Registering..." : "Register Organization"}
                </Button>

                {/* Existing Organizations */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Registered Organizations ({organizations.length})
                  </h4>
                  <div className="space-y-2">
                    {organizations.map((org) => (
                      <div key={org.pubkey} className="border p-3 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{org.data.name}</p>
                            <p className="text-sm text-gray-600">
                              {org.data.sector} • {org.data.address}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {org.pubkey.slice(0, 8)}...{org.pubkey.slice(-8)}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Standards Tab */}
          <TabsContent value="standards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Create Quality Standards</CardTitle>
                <CardDescription>
                  Define quality standards for your audits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="standardName">Standard Name</Label>
                    <Input
                      id="standardName"
                      value={standardForm.name}
                      onChange={(e) =>
                        setStandardForm({
                          ...standardForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="ISO 9001 Quality Management"
                    />
                  </div>
                  <div>
                    <Label htmlFor="standardVersion">Version</Label>
                    <Input
                      id="standardVersion"
                      value={standardForm.version}
                      onChange={(e) =>
                        setStandardForm({
                          ...standardForm,
                          version: e.target.value,
                        })
                      }
                      placeholder="1.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="standardSector">Sector</Label>
                    <Input
                      id="standardSector"
                      value={standardForm.sector}
                      onChange={(e) =>
                        setStandardForm({
                          ...standardForm,
                          sector: e.target.value,
                        })
                      }
                      placeholder="Technology"
                    />
                  </div>
                  <div>
                    <Label htmlFor="standardRequirements">Requirements</Label>
                    <textarea
                      id="standardRequirements"
                      value={standardForm.requirements}
                      onChange={(e) =>
                        setStandardForm({
                          ...standardForm,
                          requirements: e.target.value,
                        })
                      }
                      placeholder="Detailed quality requirements..."
                      className="w-full px-3 py-2 border rounded-md h-20"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateStandard}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Creating..." : "Create Quality Standard"}
                </Button>

                {/* Existing Standards */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Quality Standards ({qualityStandards.length})
                  </h4>
                  <div className="space-y-2">
                    {qualityStandards.map((standard) => (
                      <div key={standard.pubkey} className="border p-3 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {standard.data.name} v{standard.data.version}
                            </p>
                            <p className="text-sm text-gray-600">
                              {standard.data.sector}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {standard.pubkey.slice(0, 8)}...
                              {standard.pubkey.slice(-8)}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Checks Tab */}
          <TabsContent value="checks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Create Quality Checks</CardTitle>
                <CardDescription>
                  Create specific quality checks based on standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="checkStandard">
                      Select Quality Standard
                    </Label>
                    <Select
                      value={checkForm.standardPDA}
                      onValueChange={(value) =>
                        setCheckForm({ ...checkForm, standardPDA: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityStandards.map((standard) => (
                          <SelectItem
                            key={standard.pubkey}
                            value={standard.pubkey}
                          >
                            {standard.data.name} v{standard.data.version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="checkDescription">Description</Label>
                    <Input
                      id="checkDescription"
                      value={checkForm.description}
                      onChange={(e) =>
                        setCheckForm({
                          ...checkForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Security compliance check"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkCriteria">
                      Criteria (comma-separated)
                    </Label>
                    <Input
                      id="checkCriteria"
                      value={checkForm.criteria}
                      onChange={(e) =>
                        setCheckForm({ ...checkForm, criteria: e.target.value })
                      }
                      placeholder="Security protocols, Access controls, Data encryption"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkFrequency">Frequency</Label>
                    <Select
                      value={checkForm.frequency}
                      onValueChange={(value) =>
                        setCheckForm({ ...checkForm, frequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="checkRef">Blockchain Reference</Label>
                    <Input
                      id="checkRef"
                      value={checkForm.blockchainRef}
                      onChange={(e) =>
                        setCheckForm({
                          ...checkForm,
                          blockchainRef: e.target.value,
                        })
                      }
                      placeholder="ref_001 (optional - auto-generated if empty)"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateQualityCheck}
                  disabled={isLoading || qualityStandards.length === 0}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? "Creating..." : "Create Quality Check"}
                </Button>

                {qualityStandards.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    You need at least one quality standard to create quality
                    checks.
                  </p>
                )}

                {/* Show quality checks would be displayed here if we had an API endpoint for them */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Quality Checks</h4>
                  <p className="text-sm text-gray-500">
                    Quality checks are created and stored on the blockchain. Use
                    the created checks in the Audits tab.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audits Tab */}
          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Initiate Audit</CardTitle>
                <CardDescription>
                  Start a new audit using organizations and quality checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="auditOrg">Select Organization</Label>
                    <Select
                      value={auditForm.selectedOrg}
                      onValueChange={(value) =>
                        setAuditForm({ ...auditForm, selectedOrg: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.pubkey} value={org.pubkey}>
                            {org.data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="auditCheck">Quality Check PDA</Label>
                    <Input
                      id="auditCheck"
                      value={auditForm.selectedCheck}
                      onChange={(e) =>
                        setAuditForm({
                          ...auditForm,
                          selectedCheck: e.target.value,
                        })
                      }
                      placeholder="Paste quality check PDA from previous step"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use the PDA returned when creating a quality check above
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="auditType">Audit Type</Label>
                    <Select
                      value={auditForm.auditType}
                      onValueChange={(value) =>
                        setAuditForm({ ...auditForm, auditType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose audit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Internal">Internal</SelectItem>
                        <SelectItem value="External">External</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Process">Process</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Environmental">
                          Environmental
                        </SelectItem>
                        <SelectItem value="SupplyChain">
                          Supply Chain
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expectedDays">
                      Expected Duration (Days)
                    </Label>
                    <Input
                      id="expectedDays"
                      type="number"
                      value={auditForm.expectedDays}
                      onChange={(e) =>
                        setAuditForm({
                          ...auditForm,
                          expectedDays: parseInt(e.target.value) || 30,
                        })
                      }
                      placeholder="30"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="auditScope">Audit Scope</Label>
                    <textarea
                      id="auditScope"
                      value={auditForm.scope}
                      onChange={(e) =>
                        setAuditForm({ ...auditForm, scope: e.target.value })
                      }
                      placeholder="Describe the scope of this audit..."
                      className="w-full px-3 py-2 border rounded-md h-20"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleInitiateAudit}
                  disabled={isLoading || organizations.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isLoading ? "Initiating..." : "Initiate Audit"}
                </Button>

                {organizations.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    You need at least one organization to initiate an audit.
                  </p>
                )}

                {/* Current Audits */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Current Audits ({audits.length})
                  </h4>
                  <div className="space-y-4">
                    {audits.length === 0 ? (
                      <p className="text-gray-500">
                        No audits found. Create your first audit above.
                      </p>
                    ) : (
                      audits.map((audit) => (
                        <div
                          key={audit.pubkey}
                          className="border p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">
                                Audit ID: {audit.data.auditId}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {audit.data.scope}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {audit.pubkey.slice(0, 8)}...
                                {audit.pubkey.slice(-8)}
                              </p>
                            </div>
                            {getStatusBadge(audit.data.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>
                                <strong>Type:</strong>{" "}
                                {Object.keys(audit.data.auditType)[0] ||
                                  "Unknown"}
                              </p>
                              <p>
                                <strong>Initiated:</strong>{" "}
                                {new Date(
                                  parseInt(audit.data.initiatedAt) * 1000
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Expected:</strong>{" "}
                                {new Date(
                                  parseInt(audit.data.expectedCompletion) * 1000
                                ).toLocaleDateString()}
                              </p>
                              {audit.data.complianceScore && (
                                <p>
                                  <strong>Score:</strong>{" "}
                                  {audit.data.complianceScore}/100
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complete Audit Tab */}
          <TabsContent value="complete" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 5: Complete Audit</CardTitle>
                <CardDescription>
                  Complete an initiated audit with findings and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="completeAudit">
                      Select Audit to Complete
                    </Label>
                    <Select
                      value={completeForm.auditPDA}
                      onValueChange={(value) =>
                        setCompleteForm({ ...completeForm, auditPDA: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose audit" />
                      </SelectTrigger>
                      <SelectContent>
                        {audits
                          .filter((audit) => !audit.data.status?.completed)
                          .map((audit) => (
                            <SelectItem key={audit.pubkey} value={audit.pubkey}>
                              {audit.data.scope} (ID: {audit.data.auditId})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="complianceScore">
                      Compliance Score (0-100)
                    </Label>
                    <Input
                      id="complianceScore"
                      type="number"
                      min="0"
                      max="100"
                      value={completeForm.complianceScore}
                      onChange={(e) =>
                        setCompleteForm({
                          ...completeForm,
                          complianceScore: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="85"
                    />
                  </div>
                  <div>
                    <Label htmlFor="auditFindings">
                      Findings (comma-separated)
                    </Label>
                    <textarea
                      id="auditFindings"
                      value={completeForm.findings}
                      onChange={(e) =>
                        setCompleteForm({
                          ...completeForm,
                          findings: e.target.value,
                        })
                      }
                      placeholder="Security protocols need updating, Access controls properly configured"
                      className="w-full px-3 py-2 border rounded-md h-20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="auditRecommendations">
                      Recommendations (comma-separated)
                    </Label>
                    <textarea
                      id="auditRecommendations"
                      value={completeForm.recommendations}
                      onChange={(e) =>
                        setCompleteForm({
                          ...completeForm,
                          recommendations: e.target.value,
                        })
                      }
                      placeholder="Implement multi-factor authentication, Update encryption standards"
                      className="w-full px-3 py-2 border rounded-md h-20"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCompleteAudit}
                  disabled={
                    isLoading ||
                    audits.filter((a) => !a.data.status?.completed).length === 0
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Completing..." : "Complete Audit"}
                </Button>

                {audits.filter((a) => !a.data.status?.completed).length ===
                  0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No incomplete audits available to complete.
                  </p>
                )}

                {/* Completed Audits */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Completed Audits (
                    {audits.filter((a) => a.data.status?.completed).length})
                  </h4>
                  <div className="space-y-4">
                    {audits
                      .filter((a) => a.data.status?.completed)
                      .map((audit) => (
                        <div
                          key={audit.pubkey}
                          className="border p-4 rounded-lg bg-green-50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-green-800">
                                ✓ {audit.data.scope}
                              </h3>
                              <p className="text-sm text-gray-600">
                                ID: {audit.data.auditId}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>
                                <strong>Compliance Score:</strong>{" "}
                                {audit.data.complianceScore}/100
                              </p>
                              <p>
                                <strong>Completed:</strong>{" "}
                                {audit.data.completedAt
                                  ? new Date(
                                      parseInt(audit.data.completedAt) * 1000
                                    ).toLocaleDateString()
                                  : "Recently"}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Type:</strong>{" "}
                                {Object.keys(audit.data.auditType)[0] ||
                                  "Unknown"}
                              </p>
                              <p>
                                <strong>Status:</strong> ✓ Complete
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
