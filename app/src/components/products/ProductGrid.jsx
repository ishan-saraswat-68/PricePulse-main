import React, { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "../ui/EmptyState";
import { PackageSearch } from "lucide-react";

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
      {/* 4-Column Clean Table Grid */}
      <div className="border-t border-l border-[#e4e4e4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white">
        {currentProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Pagination Bar matching the store */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-6 mt-10 pt-6" aria-label="Catalog pages">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            ‹ Prev
          </button>

          <span className="font-serif italic text-sm text-[#767676] min-w-[8rem] text-center" aria-live="polite">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            className="btn btn-ghost"
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next ›
          </button>
        </nav>
      )}
    </div>
  );
}
