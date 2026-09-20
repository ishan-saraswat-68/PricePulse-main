import React, { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductSearch } from "../components/products/ProductSearch";
import { ProductGrid } from "../components/products/ProductGrid";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { useTheme } from "../context/ThemeContext";

export function Products() {
  const { isDark } = useTheme();
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
      {/* Editorial Page Header */}
      <div className={`border-b pb-6 sm:pb-8 transition-colors duration-150 ${isDark ? "border-[#353530]" : "border-[#D8D6D0]"}`}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1
              className={`font-serif text-[42px] sm:text-[52px] font-semibold tracking-tight leading-none transition-colors duration-150 ${
                isDark ? "text-[#F5F5F0]" : "text-[#171717]"
              }`}
            >
              All products
            </h1>
            <p
              className={`font-sans text-[14px] sm:text-[16px] mt-3 max-w-2xl leading-normal transition-colors duration-150 ${
                isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
              }`}
            >
              Real-time price intelligence and stock surveillance across the complete store catalog.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="shrink-0">
            <ProductSearch
              query={query}
              onQueryChange={setQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              totalCount={filteredProducts.length}
            />
          </div>
        </div>
      </div>

      {/* Catalog Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <span
            className={`text-[11px] uppercase tracking-[0.15em] font-medium ${
              isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
            }`}
          >
            Showing{" "}
            <span className={`font-mono font-semibold ${isDark ? "text-[#F5F5F0]" : "text-[#171717]"}`}>
              {filteredProducts.length}
            </span>{" "}
            items
            {selectedCategory && (
              <span>
                {" "}
                in{" "}
                <span className={`font-semibold ${isDark ? "text-[#F59E0B]" : "text-[#D97706]"}`}>
                  {selectedCategory}
                </span>
              </span>
            )}
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
