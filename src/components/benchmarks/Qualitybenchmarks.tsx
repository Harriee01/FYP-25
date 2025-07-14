import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  X,
  CheckCircle,
  Target,
  BarChart3,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Blockchain-specific interfaces
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

interface QualityBenchmark {
  publicKey: string; // Changed from "pubkey" to "publicKey"
  account: {
    // Changed from "data" to "account"
    standard: string;
    name: string;
    description: string;
    category: any; // BenchmarkCategory enum
    minValue: number;
    maxValue: number;
    targetValue: number;
    unit: string;
    createdBy: string;
    createdAt: string; // Changed to string (hex format)
    updatedAt: string; // Changed to string (hex format)
    isActive: boolean;
  };
}

// Form data interface adapted for blockchain
interface BenchmarkFormData {
  standardPDA: string;
  name: string;
  description: string;
  category: string;
  minValue: number;
  maxValue: number;
  targetValue: number;
  unit: string;
}

interface FormErrors {
  standardPDA?: string;
  name?: string;
  description?: string;
  category?: string;
  minValue?: string;
  maxValue?: string;
  targetValue?: string;
  unit?: string;
}

// API functions
const benchmarkAPI = {
  async getAllQualityStandards() {
    const response = await fetch("http://localhost:3000/api/quality-standards");
    return response.json();
  },

  async getAllQualityBenchmarks() {
    const response = await fetch(
      "http://localhost:3000/api/quality-benchmarks"
    );
    return response.json();
  },

  async createQualityBenchmark(data: {
    standardPDA: string;
    name: string;
    description: string;
    category: string;
    minValue: number;
    maxValue: number;
    targetValue: number;
    unit: string;
  }) {
    console.log("🔧 Sending data to API:", data); // Debug log

    const response = await fetch(
      "http://localhost:3000/api/quality-benchmark/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log("📥 API Response:", result); // Debug log

    if (!response.ok) {
      console.error("❌ API Error:", result);
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    return result;
  },
};

export const QualityBenchmarks: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<QualityBenchmark[]>([]);
  const [qualityStandards, setQualityStandards] = useState<QualityStandard[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<BenchmarkFormData>({
    standardPDA: "",
    name: "",
    description: "",
    category: "",
    minValue: 0,
    maxValue: 100,
    targetValue: 85,
    unit: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setError(message);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(message);
      setError(null);
    }
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 5000);
  };

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      console.log("🔧 Fetching data..."); // Debug log

      const [standardsResult, benchmarksResult] = await Promise.all([
        benchmarkAPI.getAllQualityStandards(),
        benchmarkAPI.getAllQualityBenchmarks(),
      ]);

      console.log("📊 Standards result:", standardsResult); // Debug log
      console.log("📊 Benchmarks result:", benchmarksResult); // Debug log

      setQualityStandards(standardsResult.standards || []);
      setBenchmarks(benchmarksResult.benchmarks || []);

      console.log(
        "✅ Data loaded - Standards:",
        standardsResult.standards?.length,
        "Benchmarks:",
        benchmarksResult.benchmarks?.length
      ); // Debug log
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load benchmarks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.standardPDA.trim()) {
      errors.standardPDA = "Quality Standard is required";
    }

    if (!formData.name.trim()) {
      errors.name = "Benchmark name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    if (formData.minValue >= formData.maxValue) {
      errors.minValue = "Minimum value must be less than maximum value";
    }

    if (
      formData.targetValue < formData.minValue ||
      formData.targetValue > formData.maxValue
    ) {
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
      const payload = {
        standardPDA: formData.standardPDA,
        name: `${formData.name.trim()} ${Date.now()}`, // Add timestamp for uniqueness
        description: formData.description.trim(),
        category: formData.category,
        minValue: formData.minValue,
        maxValue: formData.maxValue,
        targetValue: formData.targetValue,
        unit: formData.unit.trim(),
      };

      console.log("Sending payload:", payload); // Debug log

      const result = await benchmarkAPI.createQualityBenchmark(payload);

      if (result.success) {
        showMessage(
          `Quality benchmark created! PDA: ${result.benchmarkPDA.slice(
            0,
            8
          )}...`
        );

        // Reset form and close modal
        setFormData({
          standardPDA: "",
          name: "",
          description: "",
          category: "",
          minValue: 0,
          maxValue: 100,
          targetValue: 85,
          unit: "",
        });
        setFormErrors({});
        setShowCreateForm(false);

        // Refresh data
        await fetchData();
      } else {
        showMessage(result.error || "Failed to create benchmark", true);
      }
    } catch (error) {
      showMessage(
        `Failed to create benchmark: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        true
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof BenchmarkFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getStandardName = (standardPDA: string) => {
    const standard = qualityStandards.find((s) => s.pubkey === standardPDA);
    return standard
      ? `${standard.data.name} v${standard.data.version}`
      : "Unknown Standard";
  };

  const filteredBenchmarks = benchmarks.filter((benchmark) => {
    // Add safety checks
    if (!benchmark || !benchmark.account) return false;

    const matchesSearch =
      benchmark.account.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      benchmark.account.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStandard =
      selectedStandard === "all" ||
      benchmark.account.standard === selectedStandard;
    return matchesSearch && matchesStandard;
  });

  const formatDate = (timestamp: string) => {
    // Convert hex timestamp to date
    const unixTimestamp = parseInt(timestamp, 16);
    return new Date(unixTimestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-700">Loading benchmarks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quality Benchmarks
          </h1>
          <p className="text-gray-600 mt-2">
            Set performance targets and standards for your audit process (
            {benchmarks.length} benchmarks)
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Benchmark
        </Button>
      </div>

      {/* Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="bg-gray-50 border-gray-200">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search benchmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <div className="sm:w-64 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
              >
                <option value="all">All Standards</option>
                {qualityStandards.map((standard) => (
                  <option key={standard.pubkey} value={standard.pubkey}>
                    {standard.data.name} v{standard.data.version}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredBenchmarks.length} of {benchmarks.length}{" "}
            benchmarks
            {searchTerm && <span> matching "{searchTerm}"</span>}
          </div>
        </div>
      </Card>

      {/* Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBenchmarks.map((benchmark) => {
          // Safety check for benchmark data
          if (!benchmark?.account) return null;

          return (
            <Card
              key={benchmark.publicKey}
              className="bg-white border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {benchmark.account.name || "Unnamed Benchmark"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getStandardName(benchmark.account.standard)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="text-xl font-bold text-blue-600">
                      {benchmark.account.targetValue || 0}
                    </span>
                    <span className="text-sm text-gray-500">
                      {benchmark.account.unit || ""}
                    </span>
                  </div>
                </div>

                {benchmark.account.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {benchmark.account.description}
                  </p>
                )}

                {/* Benchmark Range */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Range & Target
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-blue-800">
                      <strong>Range:</strong> {benchmark.account.minValue || 0}{" "}
                      - {benchmark.account.maxValue || 0}{" "}
                      {benchmark.account.unit || ""}
                    </div>
                    <div className="text-blue-800">
                      <strong>Target:</strong>{" "}
                      {benchmark.account.targetValue || 0}{" "}
                      {benchmark.account.unit || ""}
                    </div>
                    <div className="text-blue-600 font-medium">
                      Category:{" "}
                      {Object.keys(
                        benchmark.account.category || {}
                      )[0]?.toUpperCase() || "Unknown"}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>
                    Created: {formatDate(benchmark.account.createdAt || "0")}
                  </span>
                  <span className="font-mono text-gray-400">
                    {benchmark.publicKey?.slice(0, 8)}...
                    {benchmark.publicKey?.slice(-4)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBenchmarks.length === 0 && !loading && (
        <Card className="bg-gray-50 border-gray-200 text-center py-16">
          <div className="max-w-md mx-auto">
            {searchTerm || selectedStandard !== "all" ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  No benchmarks found
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStandard("all");
                  }}
                >
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  No benchmarks yet
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Use the "Create Benchmark" button above to get started
                </p>
              </>
            )}
          </div>
        </Card>
      )}

      {/* All Benchmarks List Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>All Quality Benchmarks</span>
            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {benchmarks.length} total
            </div>
          </CardTitle>
          <p className="text-gray-600 text-sm mt-1">
            Complete list of all quality benchmarks across standards
          </p>
        </CardHeader>
        <div className="p-6">
          {benchmarks.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No benchmarks created yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Use the "Create Benchmark" button above to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {benchmarks.map((benchmark) => {
                if (!benchmark?.account) return null;

                return (
                  <div
                    key={benchmark.publicKey}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {benchmark.account.name || "Unnamed Benchmark"}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {getStandardName(benchmark.account.standard)}
                          </p>
                          {benchmark.account.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {benchmark.account.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-600">
                            {benchmark.account.targetValue || 0}
                          </span>
                          <span className="text-sm text-gray-500">
                            {benchmark.account.unit || ""}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Range: {benchmark.account.minValue || 0} -{" "}
                          {benchmark.account.maxValue || 0}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {Object.keys(
                            benchmark.account.category || {}
                          )[0]?.toUpperCase() || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(benchmark.account.createdAt || "0")}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Create Benchmark Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Create Quality Benchmark
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Set performance targets for your quality standards
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Quality Standard Selection */}
              <div>
                <label
                  htmlFor="standardPDA"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Quality Standard *
                </label>
                <select
                  id="standardPDA"
                  value={formData.standardPDA}
                  onChange={(e) =>
                    handleInputChange("standardPDA", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">Select a Quality Standard</option>
                  {qualityStandards.map((standard) => (
                    <option key={standard.pubkey} value={standard.pubkey}>
                      {standard.data.name} v{standard.data.version} (
                      {standard.data.sector})
                    </option>
                  ))}
                </select>
                {formErrors.standardPDA && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.standardPDA}
                  </p>
                )}
              </div>

              {/* Benchmark Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Benchmark Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Technology Sector Security Benchmark"
                  className="w-full"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {formErrors.name && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Describe what this benchmark measures and its objectives..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                {formErrors.description && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">Select Category</option>
                  <option value="Performance">Performance</option>
                  <option value="Quality">Quality</option>
                  <option value="Efficiency">Efficiency</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Safety">Safety</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Financial">Financial</option>
                  <option value="Customer">Customer</option>
                </select>
                {formErrors.category && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Min Value */}
              <div>
                <label
                  htmlFor="minValue"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Minimum Value *
                </label>
                <Input
                  id="minValue"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  className="w-full"
                  value={formData.minValue}
                  onChange={(e) =>
                    handleInputChange("minValue", Number(e.target.value))
                  }
                />
                {formErrors.minValue && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.minValue}
                  </p>
                )}
              </div>

              {/* Max Value */}
              <div>
                <label
                  htmlFor="maxValue"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Maximum Value *
                </label>
                <Input
                  id="maxValue"
                  type="number"
                  step="0.01"
                  placeholder="100"
                  className="w-full"
                  value={formData.maxValue}
                  onChange={(e) =>
                    handleInputChange("maxValue", Number(e.target.value))
                  }
                />
                {formErrors.maxValue && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.maxValue}
                  </p>
                )}
              </div>

              {/* Target Value */}
              <div>
                <label
                  htmlFor="targetValue"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Target Value *
                </label>
                <Input
                  id="targetValue"
                  type="number"
                  step="0.01"
                  placeholder="85"
                  className="w-full"
                  value={formData.targetValue}
                  onChange={(e) =>
                    handleInputChange("targetValue", Number(e.target.value))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be between minimum and maximum values
                </p>
                {formErrors.targetValue && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.targetValue}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Unit of Measurement
                </label>
                <Input
                  id="unit"
                  type="text"
                  placeholder="e.g., %, °C, PSI, mg/L"
                  className="w-full"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                />
                {formErrors.unit && (
                  <p className="text-red-600 text-xs mt-1">{formErrors.unit}</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || qualityStandards.length === 0}
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
            </div>

            {qualityStandards.length === 0 && (
              <div className="px-6 pb-6">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    You need to create quality standards first before creating
                    benchmarks.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
