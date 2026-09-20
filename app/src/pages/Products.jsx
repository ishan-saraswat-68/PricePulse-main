import React, { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductSearch } from "../components/products/ProductSearch";
import { ProductGrid } from "../components/products/ProductGrid";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";

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
    <div>
      {/* Intro Heading and Search/Filter Bar matching Image 3 sketch */}
      <div className="border-b border-[#111111] pb-6 mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            All products
          </h1>
          <p className="text-sm text-[#767676] mt-1.5 font-serif">
            {filteredProducts.length} products · browse the shelves. Prices are shown on each product's page.
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

      {/* Content */}
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
  );
}
