import React, { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, Mail, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card.tsx";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import { supabase } from "../../supabase.ts";
import { User } from "../../types/index.ts";
import { Spinner } from "../ui/spinner.tsx";

export const TeamManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-hunter-100 text-hunter-800";
      case "quality_manager":
        return "bg-fern-100 text-fern-800";
      case "quality_inspector":
        return "bg-sage-100 text-sage-800";
      case "auditor":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "quality_manager":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-hunter-900">
            Team Management
          </h1>
          <p className="text-sage-700">Manage team members and their roles</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-ivory-50 border-sage-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="quality_manager">Quality Manager</option>
              <option value="quality_inspector">Quality Inspector</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            role: "admin",
            label: "Admins",
            count: users.filter((u) => u.role === "admin").length,
          },
          {
            role: "quality_manager",
            label: "Quality Managers",
            count: users.filter((u) => u.role === "quality_manager").length,
          },
          {
            role: "quality_inspector",
            label: "Inspectors",
            count: users.filter((u) => u.role === "quality_inspector").length,
          },
          {
            role: "auditor",
            label: "Auditors",
            count: users.filter((u) => u.role === "auditor").length,
          },
        ].map((stat) => (
          <Card key={stat.role} className="bg-ivory-50 border-sage-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-700">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-hunter-900">
                  {stat.count}
                </p>
              </div>
              <div className={`p-2 rounded-full ${getRoleColor(stat.role)}`}>
                {getRoleIcon(stat.role)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Team Members List */}
      <Card className="bg-ivory-50 border-sage-200">
        <CardHeader>
          <CardTitle className="text-hunter-900">Team Members</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-sage-50 rounded-lg border border-sage-100 hover:bg-sage-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-hunter-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-hunter-800">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-hunter-900">{user.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-sage-600" />
                    <span className="text-sm text-sage-700">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                    user.role
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  <span className="ml-1 capitalize">
                    {user.role.replace("_", " ")}
                  </span>
                </span>

                <div className="text-xs text-sage-600">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center space-x-1">
                  <button className="p-2 text-sage-600 hover:text-hunter-800 hover:bg-sage-200 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-sage-600 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredUsers.length === 0 && (
        <Card className="bg-ivory-50 border-sage-200 text-center py-12">
          <p className="text-sage-700">
            No team members found matching your criteria.
          </p>
        </Card>
      )}
    </div>
  );
};
