import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { supabase } from "../../lib/supabase.ts";
import { QualityBenchmark } from "../../types";

export const QualityBenchmarks: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<QualityBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  const fetchBenchmarks = async () => {
    try {
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
    } finally {
      setLoading(false);
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

  const categories = [...new Set(benchmarks.map((b) => b.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hunter-700"></div>
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
            Manage quality standards and thresholds
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Benchmark
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-ivory-50 border-sage-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search benchmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-sage-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-hunter-500 bg-ivory-50 text-hunter-900"
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
      </Card>

      {/* Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBenchmarks.map((benchmark) => (
          <Card
            key={benchmark.id}
            className="bg-ivory-50 border-sage-200 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-hunter-900">
                    {benchmark.name}
                  </h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-fern-100 text-fern-800 mt-1">
                    {benchmark.category}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-sage-600 hover:text-hunter-800 hover:bg-sage-100 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-sage-600 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-sage-700">{benchmark.description}</p>

              <div className="bg-sage-50 p-3 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-sage-700">Range:</span>
                  <span className="font-medium text-hunter-900">
                    {benchmark.minValue} - {benchmark.maxValue} {benchmark.unit}
                  </span>
                </div>
              </div>

              <div className="text-xs text-sage-600">
                Created by {benchmark.created_by_user?.name} •{" "}
                {new Date(benchmark.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredBenchmarks.length === 0 && (
        <Card className="bg-ivory-50 border-sage-200 text-center py-12">
          <p className="text-sage-700">
            No benchmarks found matching your criteria.
          </p>
        </Card>
      )}
    </div>
  );
};
