import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, Filter, AlertCircle, X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { supabase } from "../../supabase.ts";
import { QualityBenchmark } from "../../types";

// Enhanced type for better type safety
interface QualityBenchmarkWithUser extends QualityBenchmark {
  created_by_user?: { name: string };
}

// Form data interface
interface BenchmarkFormData {
  name: string;
  description: string;
  category: string;
  minValue: number;
  maxValue: number;
  targetValue: number;
  unit: string;
}

// Form errors interface
interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  minValue?: string;
  maxValue?: string;
  targetValue?: string;
  unit?: string;
}

export const QualityBenchmarks: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<QualityBenchmarkWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BenchmarkFormData>({
    name: "",
    description: "",
    category: "",
    minValue: 0,
    maxValue: 100,
    targetValue: 50,
    unit: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBenchmarks = useCallback(async () => {
    try {
      setError(null);
      
      // Dummy data for benchmarks
      const dummyBenchmarks: QualityBenchmarkWithUser[] = [
        {
          id: "1",
          name: "Temperature Control",
          description: "Maintain optimal temperature range for production processes to ensure product quality and safety standards.",
          category: "Safety",
          minValue: 18,
          maxValue: 25,
          unit: "°C",
          organizationId: "org1",
          isActive: true,
          createdAt: new Date("2024-01-15T10:30:00Z"),
          createdBy: "user1",
          created_by_user: { name: "John Smith" }
        },
        {
          id: "2",
          name: "Pressure Monitoring",
          description: "Monitor system pressure to prevent equipment damage and ensure operational efficiency.",
          category: "Quality Control",
          minValue: 100,
          maxValue: 150,
          unit: "PSI",
          organizationId: "org1",
          isActive: true,
          createdAt: new Date("2024-01-20T14:15:00Z"),
          createdBy: "user2",
          created_by_user: { name: "Sarah Johnson" }
        },
        {
          id: "3",
          name: "pH Level Control",
          description: "Maintain proper pH levels in chemical processes to ensure product consistency and safety.",
          category: "Environmental",
          minValue: 6.5,
          maxValue: 7.5,
          unit: "pH",
          organizationId: "org1",
          isActive: true,
          createdAt: new Date("2024-02-01T09:45:00Z"),
          createdBy: "user3",
          created_by_user: { name: "Mike Chen" }
        },
        {
          id: "4",
          name: "Humidity Management",
          description: "Control humidity levels in storage areas to prevent product degradation and maintain quality.",
          category: "Process Efficiency",
          minValue: 40,
          maxValue: 60,
          unit: "%",
          organizationId: "org1",
          isActive: true,
          createdAt: new Date("2024-02-10T16:20:00Z"),
          createdBy: "user4",
          created_by_user: { name: "Emily Davis" }
        }
      ];

      setBenchmarks(dummyBenchmarks);
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      setError("Failed to load benchmarks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBenchmarks();
  }, [fetchBenchmarks]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this benchmark?")) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("quality_benchmarks")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;

      // Remove from local state
      setBenchmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting benchmark:", error);
      setError("Failed to delete benchmark. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    if (formData.minValue >= formData.maxValue) {
      errors.minValue = "Minimum value must be less than maximum value";
    }

    if (formData.targetValue < formData.minValue || formData.targetValue > formData.maxValue) {
      errors.targetValue = "Target value must be within the min-max range";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("quality_benchmarks")
        .insert([
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category.trim(),
            min_value: formData.minValue,
            max_value: formData.maxValue,
            target_value: formData.targetValue,
            unit: formData.unit.trim(),
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setBenchmarks((prev) => [data, ...prev]);
      
      // Reset form and close modal
      setFormData({
        name: "",
        description: "",
        category: "",
        minValue: 0,
        maxValue: 100,
        targetValue: 50,
        unit: "",
      });
      setFormErrors({});
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating benchmark:", error);
      setError("Failed to create benchmark. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BenchmarkFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      minValue: 0,
      maxValue: 100,
      targetValue: 50,
      unit: "",
    });
    setFormErrors({});
  };

  const filteredBenchmarks = benchmarks.filter((benchmark) => {
    const matchesSearch =
      benchmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benchmark.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || benchmark.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(benchmarks.map((b) => b.category))].sort();

  const formatValue = (value: number, unit?: string) => {
    return `${value}${unit ? ` ${unit}` : ""}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hunter-700"></div>
        <span className="ml-3 text-sage-700">Loading benchmarks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-hunter-900">
            Quality Benchmarks
          </h1>
          <p className="text-sage-700">
            Manage quality standards and thresholds ({benchmarks.length} active)
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Benchmark
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center p-4">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchBenchmarks}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-ivory-50 border-sage-200">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-500" />
              <Input
                placeholder="Search benchmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <div className="sm:w-48 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results summary */}
          <div className="mt-3 text-sm text-sage-600">
            Showing {filteredBenchmarks.length} of {benchmarks.length}{" "}
            benchmarks
            {searchTerm && <span> matching "{searchTerm}"</span>}
            {selectedCategory !== "all" && (
              <span> in {selectedCategory} category</span>
            )}
          </div>
        </div>
      </Card>

      {/* Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBenchmarks.map((benchmark) => (
          <Card
            key={benchmark.id}
            className="bg-ivory-50 border-sage-200 hover:shadow-md transition-all duration-200 hover:border-hunter-300"
          >
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-hunter-900 truncate">
                    {benchmark.name}
                  </h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-fern-100 text-fern-800 mt-1">
                    {benchmark.category}
                  </span>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    className="p-1 text-sage-600 hover:text-hunter-800 hover:bg-sage-100 rounded transition-colors"
                    onClick={() => {
                      /* Handle edit */
                    }}
                    title="Edit benchmark"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-sage-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    onClick={() => handleDelete(benchmark.id)}
                    disabled={deletingId === benchmark.id}
                    title="Delete benchmark"
                  >
                    {deletingId === benchmark.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-red-600"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {benchmark.description && (
                <p className="text-sm text-sage-700 line-clamp-2">
                  {benchmark.description}
                </p>
              )}

              <div className="bg-sage-50 p-3 rounded-lg border border-sage-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sage-700 font-medium">Range:</span>
                  <span className="font-semibold text-hunter-900">
                    {formatValue(benchmark.minValue, benchmark.unit)} -{" "}
                    {formatValue(benchmark.maxValue, benchmark.unit)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-sage-600">
                <span>By {benchmark.created_by_user?.name || "Unknown"}</span>
                <span>{formatDate(benchmark.createdAt.toString())}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBenchmarks.length === 0 && !loading && (
        <Card className="bg-ivory-50 border-sage-200 text-center py-12">
          <div className="max-w-md mx-auto">
            {searchTerm || selectedCategory !== "all" ? (
              <>
                <Search className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-700 font-medium mb-2">
                  No benchmarks found
                </p>
                <p className="text-sage-600 text-sm mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <Plus className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-700 font-medium mb-2">
                  No benchmarks yet
                </p>
                <p className="text-sage-600 text-sm mb-4">
                  Create your first quality benchmark to get started
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benchmark
                </Button>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Add Benchmark Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-sage-200">
              <div>
                <h2 className="text-xl font-semibold text-hunter-900">
                  Add New Benchmark
                </h2>
                <p className="text-sage-600 text-sm mt-1">
                  Create a new quality standard for your organization
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-sage-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-hunter-900 mb-2">
                  Benchmark Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Temperature Control, Pressure Monitoring"
                  className="w-full"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {formErrors.name && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-hunter-900 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Provide a detailed description of this benchmark..."
                  rows={3}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900 resize-none"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
                {formErrors.description && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-hunter-900 mb-2">
                  Category *
                </label>
                <Input
                  id="category"
                  type="text"
                  placeholder="e.g., Safety, Quality Control, Environmental"
                  className="w-full"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                />
                {formErrors.category && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.category}</p>
                )}
              </div>

              {/* Min Value Field */}
              <div>
                <label htmlFor="minValue" className="block text-sm font-medium text-hunter-900 mb-2">
                  Minimum Value *
                </label>
                <Input
                  id="minValue"
                  type="number"
                  placeholder="0"
                  className="w-full"
                  value={formData.minValue}
                  onChange={(e) => handleInputChange("minValue", Number(e.target.value))}
                />
                {formErrors.minValue && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.minValue}</p>
                )}
              </div>

              {/* Max Value Field */}
              <div>
                <label htmlFor="maxValue" className="block text-sm font-medium text-hunter-900 mb-2">
                  Maximum Value *
                </label>
                <Input
                  id="maxValue"
                  type="number"
                  placeholder="100"
                  className="w-full"
                  value={formData.maxValue}
                  onChange={(e) => handleInputChange("maxValue", Number(e.target.value))}
                />
                {formErrors.maxValue && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.maxValue}</p>
                )}
              </div>

              {/* Target Value Field */}
              <div>
                <label htmlFor="targetValue" className="block text-sm font-medium text-hunter-900 mb-2">
                  Target Value *
                </label>
                <Input
                  id="targetValue"
                  type="number"
                  placeholder="50"
                  className="w-full"
                  value={formData.targetValue}
                  onChange={(e) => handleInputChange("targetValue", Number(e.target.value))}
                />
                {formErrors.targetValue && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.targetValue}</p>
                )}
              </div>

              {/* Unit Field */}
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-hunter-900 mb-2">
                  Unit of Measurement
                </label>
                <Input
                  id="unit"
                  type="text"
                  placeholder="e.g., °C, PSI, %, mg/L"
                  className="w-full"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                />
                {formErrors.unit && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.unit}</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-sage-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-hunter-600 hover:bg-hunter-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Creating...
                    </span>
                  ) : (
                    "Create Benchmark"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
