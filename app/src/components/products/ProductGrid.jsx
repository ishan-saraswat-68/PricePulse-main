import React, { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "../ui/EmptyState";
import { PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGrid({ products = [] }) {
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Reset page when product count changes
  useEffect(() => {
    setPage(1);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting your search terms or selecting a different category filter."
      />
    );
  }

  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      {/* Spacious 4-Column Responsive Sculpted Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Modern Rounded Pagination Bar */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-slate-200/80" aria-label="Catalog pages">
          <button
            type="button"
            className="btn btn-ghost !py-2 !px-4"
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="px-4 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-heading font-semibold text-slate-700 shadow-2xs">
            Page <span className="text-cyan-600 font-bold">{page}</span> of {totalPages}
          </div>

          <button
            type="button"
            className="btn btn-ghost !py-2 !px-4"
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
