import React, { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductSearch } from "../components/products/ProductSearch";
import { ProductGrid } from "../components/products/ProductGrid";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { Layers } from "lucide-react";

export function Products() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { results, loading, error, categories } = useProducts(query);

  // Filter results client-side by selectedCategory if set
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return results;
    return results.filter(
      (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [results, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Intro Heading Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/70">
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>Store Catalog & Surveillance Shelves</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Monitored Catalog
          </h1>
          <p className="text-sm text-slate-500 font-normal max-w-xl">
            Select any item to inspect technical specifications, review sentiment, and activate real-time 15-minute price surveillance.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <ProductSearch
          query={query}
          onQueryChange={setQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          totalCount={filteredProducts.length}
        />
      </div>

      {/* Catalog Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500">
            Showing <strong className="text-slate-900 font-mono">{filteredProducts.length}</strong> items
            {selectedCategory && <span> in <strong className="text-cyan-700">{selectedCategory}</strong></span>}
          </span>
        </div>

        {loading && results.length === 0 ? (
          <LoadingSkeleton rows={8} type="card" />
        ) : error ? (
          <ErrorState
            error={error}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}
