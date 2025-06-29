"use client";

import { useState } from "react";
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
  FileText,
  Users,
  Clock,
  CheckCircle,
  Calendar,
  Eye,
  Edit,
  UserPlus,
  AlertCircle,
} from "lucide-react";

interface Audit {
  id: string;
  title: string;
  type: string;
  status: "draft" | "pending" | "approved" | "rejected";
  submittedBy: string;
  timestamp: string;
  version: number;
  approvalsReceived: number;
  approvalsRequired: number;
}

interface CompanyMember {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
  addedAt: string;
  walletAddress?: string;
}

interface ScheduledAudit {
  id: string;
  name: string;
  scheduledDate: string;
  recurrence: string | null;
  isActive: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function AuditDashboard() {
  const [activeTab, setActiveTab] = useState("audits");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [audits, setAudits] = useState<Audit[]>([
    {
      id: "1",
      title: "Q4 Security Audit",
      type: "Security",
      status: "pending",
      submittedBy: "John Doe",
      timestamp: "2024-01-15T10:30:00Z",
      version: 1,
      approvalsReceived: 1,
      approvalsRequired: 2,
    },
    {
      id: "2",
      title: "Process Compliance Review",
      type: "Compliance",
      status: "approved",
      submittedBy: "Jane Smith",
      timestamp: "2024-01-14T14:20:00Z",
      version: 2,
      approvalsReceived: 2,
      approvalsRequired: 2,
    },
  ]);

  const [members, setMembers] = useState<CompanyMember[]>([
    {
      id: "1",
      name: "John Doe",
      role: "QA Manager",
      isActive: true,
      addedAt: "2024-01-01T00:00:00Z",
      walletAddress: "0x1234567890123456789012345678901234567890",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Auditor",
      isActive: true,
      addedAt: "2024-01-02T00:00:00Z",
      walletAddress: "0x0987654321098765432109876543210987654321",
    },
  ]);

  const [scheduledAudits, setScheduledAudits] = useState<ScheduledAudit[]>([
    {
      id: "1",
      name: "Monthly Security Review",
      scheduledDate: "2024-02-01T09:00:00Z",
      recurrence: "Monthly",
      isActive: true,
    },
  ]);

  const [newAudit, setNewAudit] = useState({
    title: "",
    type: "",
    metadata: "",
    requiresApproval: false,
  });

  const [newMember, setNewMember] = useState({
    name: "",
    role: "Viewer",
    walletAddress: "",
  });

  const [newSchedule, setNewSchedule] = useState({
    name: "",
    scheduledDate: "",
    recurrence: "",
  });

  const [auditErrors, setAuditErrors] = useState<FormErrors>({});
  const [memberErrors, setMemberErrors] = useState<FormErrors>({});
  const [scheduleErrors, setScheduleErrors] = useState<FormErrors>({});

  // Validation functions
  const validateWalletAddress = (address: string): boolean => {
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    return walletRegex.test(address);
  };

  const validateFutureDate = (dateString: string): boolean => {
    const selectedDate = new Date(dateString);
    const now = new Date();
    return selectedDate > now;
  };

  const generateUniqueId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const validateAuditForm = (): boolean => {
    const errors: FormErrors = {};

    if (!newAudit.title.trim()) {
      errors.title = "Audit title is required";
    }

    if (!newAudit.type) {
      errors.type = "Audit type is required";
    }

    if (!newAudit.metadata.trim()) {
      errors.metadata = "Audit metadata is required";
    }

    // Check for duplicate titles
    const duplicateTitle = audits.some(
      (audit) =>
        audit.title.toLowerCase() === newAudit.title.toLowerCase().trim()
    );
    if (duplicateTitle) {
      errors.title = "An audit with this title already exists";
    }

    setAuditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateMemberForm = (): boolean => {
    const errors: FormErrors = {};

    if (!newMember.name.trim()) {
      errors.name = "Member name is required";
    }

    if (!newMember.walletAddress.trim()) {
      errors.walletAddress = "Wallet address is required";
    } else if (!validateWalletAddress(newMember.walletAddress)) {
      errors.walletAddress = "Invalid wallet address format";
    }

    // Check for duplicate names
    const duplicateName = members.some(
      (member) =>
        member.name.toLowerCase() === newMember.name.toLowerCase().trim()
    );
    if (duplicateName) {
      errors.name = "A member with this name already exists";
    }

    // Check for duplicate wallet addresses
    const duplicateWallet = members.some(
      (member) => member.walletAddress === newMember.walletAddress.trim()
    );
    if (duplicateWallet) {
      errors.walletAddress = "This wallet address is already registered";
    }

    setMemberErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateScheduleForm = (): boolean => {
    const errors: FormErrors = {};

    if (!newSchedule.name.trim()) {
      errors.name = "Audit name is required";
    }

    if (!newSchedule.scheduledDate) {
      errors.scheduledDate = "Scheduled date is required";
    } else if (!validateFutureDate(newSchedule.scheduledDate)) {
      errors.scheduledDate = "Scheduled date must be in the future";
    }

    // Check for duplicate schedule names
    const duplicateName = scheduledAudits.some(
      (schedule) =>
        schedule.name.toLowerCase() === newSchedule.name.toLowerCase().trim()
    );
    if (duplicateName) {
      errors.name = "A scheduled audit with this name already exists";
    }

    setScheduleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAudit = async () => {
    if (!validateAuditForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const audit: Audit = {
        id: generateUniqueId(),
        title: newAudit.title.trim(),
        type: newAudit.type,
        status: newAudit.requiresApproval ? "pending" : "approved",
        submittedBy: "Current User",
        timestamp: new Date().toISOString(),
        version: 1,
        approvalsReceived: newAudit.requiresApproval ? 0 : 1,
        approvalsRequired: newAudit.requiresApproval ? 2 : 1,
      };

      setAudits([audit, ...audits]);
      setNewAudit({
        title: "",
        type: "",
        metadata: "",
        requiresApproval: false,
      });
      setAuditErrors({});
      showSuccessMessage("Audit submitted successfully!");
    } catch (error) {
      console.error("Error submitting audit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!validateMemberForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const member: CompanyMember = {
        id: generateUniqueId(),
        name: newMember.name.trim(),
        role: newMember.role,
        isActive: true,
        addedAt: new Date().toISOString(),
        walletAddress: newMember.walletAddress.trim(),
      };

      setMembers([...members, member]);
      setNewMember({ name: "", role: "Viewer", walletAddress: "" });
      setMemberErrors({});
      showSuccessMessage("Team member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleAudit = async () => {
    if (!validateScheduleForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const schedule: ScheduledAudit = {
        id: generateUniqueId(),
        name: newSchedule.name.trim(),
        scheduledDate: newSchedule.scheduledDate,
        recurrence: newSchedule.recurrence || null,
        isActive: true,
      };

      setScheduledAudits([...scheduledAudits, schedule]);
      setNewSchedule({ name: "", scheduledDate: "", recurrence: "" });
      setScheduleErrors({});
      showSuccessMessage("Audit scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling audit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAudit = async (auditId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAudits(
        audits.map((audit) =>
          audit.id === auditId
            ? {
                ...audit,
                approvalsReceived: audit.approvalsReceived + 1,
                status:
                  audit.approvalsReceived + 1 >= audit.approvalsRequired
                    ? "approved"
                    : "pending",
              }
            : audit
        )
      );
      showSuccessMessage("Audit approved successfully!");
    } catch (error) {
      console.error("Error approving audit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMemberStatus = async (memberId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMembers(
        members.map((member) =>
          member.id === memberId
            ? { ...member, isActive: !member.isActive }
            : member
        )
      );
      showSuccessMessage("Member status updated successfully!");
    } catch (error) {
      console.error("Error updating member status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QA Blockchain Dashboard
          </h1>
          <p className="text-gray-600">Phase 2: Enhanced Workflow Management</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
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
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Approval
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {audits.filter((a) => a.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Team Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {members.filter((m) => m.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scheduledAudits.filter((s) => s.isActive).length}
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="audits">Audits</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="schedule">Scheduled Audits</TabsTrigger>
            <TabsTrigger value="submit">Submit New Audit</TabsTrigger>
          </TabsList>

          {/* Audits Tab */}
          <TabsContent value="audits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Management</CardTitle>
                <CardDescription>
                  View and manage all audit submissions with multi-signature
                  approval workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audits.map((audit) => (
                    <div
                      key={audit.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{audit.title}</h3>
                          <Badge className={getStatusColor(audit.status)}>
                            {audit.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{audit.type}</Badge>
                          <span className="text-sm text-gray-500">
                            v{audit.version}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>By: {audit.submittedBy}</span>
                          <span>
                            {new Date(audit.timestamp).toLocaleDateString()}
                          </span>
                          <span>
                            Approvals: {audit.approvalsReceived}/
                            {audit.approvalsRequired}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`View ${audit.title}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {audit.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveAudit(audit.id)}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                            aria-label={`Approve ${audit.title}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {isLoading ? "Approving..." : "Approve"}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Update ${audit.title}`}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage team members and their roles with blockchain-verified
                  permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Badge variant="outline">{member.role}</Badge>
                          <span>
                            Added:{" "}
                            {new Date(member.addedAt).toLocaleDateString()}
                          </span>
                          <Badge
                            className={
                              member.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {member.walletAddress && (
                          <p className="text-xs text-gray-500 font-mono">
                            {member.walletAddress.slice(0, 10)}...
                            {member.walletAddress.slice(-8)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Edit ${member.name}'s role`}
                        >
                          Edit Role
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleMemberStatus(member.id)}
                          disabled={isLoading}
                          aria-label={`${
                            member.isActive ? "Deactivate" : "Activate"
                          } ${member.name}`}
                        >
                          {member.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Member */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Add New Team Member</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="memberName">Name *</Label>
                      <Input
                        id="memberName"
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember({ ...newMember, name: e.target.value })
                        }
                        placeholder="Enter member name"
                        className={memberErrors.name ? "border-red-500" : ""}
                        aria-describedby={
                          memberErrors.name ? "memberName-error" : undefined
                        }
                      />
                      {memberErrors.name && (
                        <p
                          id="memberName-error"
                          className="text-sm text-red-600 mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {memberErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="memberRole">Role *</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value) =>
                          setNewMember({ ...newMember, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QA Manager">QA Manager</SelectItem>
                          <SelectItem value="QA Staff">QA Staff</SelectItem>
                          <SelectItem value="Auditor">Auditor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="walletAddress">Wallet Address *</Label>
                      <Input
                        id="walletAddress"
                        value={newMember.walletAddress}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            walletAddress: e.target.value,
                          })
                        }
                        placeholder="0x..."
                        className={
                          memberErrors.walletAddress ? "border-red-500" : ""
                        }
                        aria-describedby={
                          memberErrors.walletAddress
                            ? "walletAddress-error"
                            : undefined
                        }
                      />
                      {memberErrors.walletAddress && (
                        <p
                          id="walletAddress-error"
                          className="text-sm text-red-600 mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {memberErrors.walletAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleAddMember}
                    className="mt-4"
                    disabled={isLoading}
                    aria-label="Add new team member"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isLoading ? "Adding..." : "Add Member"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Audits Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Audits</CardTitle>
                <CardDescription>
                  Manage recurring and scheduled audit reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {scheduledAudits.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{schedule.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            Scheduled:{" "}
                            {new Date(
                              schedule.scheduledDate
                            ).toLocaleDateString()}
                          </span>
                          {schedule.recurrence && (
                            <Badge variant="outline">
                              {schedule.recurrence}
                            </Badge>
                          )}
                          <Badge
                            className={
                              schedule.isActive
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {schedule.isActive ? "Active" : "Paused"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Edit ${schedule.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`${
                            schedule.isActive ? "Pause" : "Resume"
                          } ${schedule.name}`}
                        >
                          {schedule.isActive ? "Pause" : "Resume"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Schedule */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Schedule New Audit</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="scheduleName">Audit Name *</Label>
                      <Input
                        id="scheduleName"
                        value={newSchedule.name}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter audit name"
                        className={scheduleErrors.name ? "border-red-500" : ""}
                        aria-describedby={
                          scheduleErrors.name ? "scheduleName-error" : undefined
                        }
                      />
                      {scheduleErrors.name && (
                        <p
                          id="scheduleName-error"
                          className="text-sm text-red-600 mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {scheduleErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="scheduleDate">Scheduled Date *</Label>
                      <Input
                        id="scheduleDate"
                        type="datetime-local"
                        value={newSchedule.scheduledDate}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            scheduledDate: e.target.value,
                          })
                        }
                        className={
                          scheduleErrors.scheduledDate ? "border-red-500" : ""
                        }
                        aria-describedby={
                          scheduleErrors.scheduledDate
                            ? "scheduleDate-error"
                            : undefined
                        }
                      />
                      {scheduleErrors.scheduledDate && (
                        <p
                          id="scheduleDate-error"
                          className="text-sm text-red-600 mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {scheduleErrors.scheduledDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="recurrence">Recurrence</Label>
                      <Select
                        value={newSchedule.recurrence}
                        onValueChange={(value) =>
                          setNewSchedule({ ...newSchedule, recurrence: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select recurrence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">One-time</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleScheduleAudit}
                    className="mt-4"
                    disabled={isLoading}
                    aria-label="Schedule new audit"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {isLoading ? "Scheduling..." : "Schedule Audit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit New Audit Tab */}
          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Audit</CardTitle>
                <CardDescription>
                  Submit a new audit with enhanced workflow and approval
                  management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="auditTitle">Audit Title *</Label>
                    <Input
                      id="auditTitle"
                      value={newAudit.title}
                      onChange={(e) =>
                        setNewAudit({ ...newAudit, title: e.target.value })
                      }
                      placeholder="Enter audit title"
                      className={auditErrors.title ? "border-red-500" : ""}
                      aria-describedby={
                        auditErrors.title ? "auditTitle-error" : undefined
                      }
                    />
                    {auditErrors.title && (
                      <p
                        id="auditTitle-error"
                        className="text-sm text-red-600 mt-1 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {auditErrors.title}
                      </p>
                    )}
                  </div>
                  {/* You may need to add the rest of your form fields here */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
