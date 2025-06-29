import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, Filter, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { supabase } from "../../supabase.ts";
import { QualityBenchmark } from "../../types";

// Enhanced type for better type safety
interface QualityBenchmarkWithUser extends QualityBenchmark {
  created_by_user?: { name: string };
}

export const QualityBenchmarks: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<QualityBenchmarkWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBenchmarks = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from("quality_benchmarks")
        .select(
          `
          *,
          created_by_user:users!quality_benchmarks_created_by_fkey(name)
        `
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBenchmarks(data || []);
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
                <span>{formatDate(benchmark.createdAt)}</span>
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
    </div>
  );
};
