import React, { useState, useEffect, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "../ui/EmptyState";
import { useDashboard } from "../../hooks/useDashboard";
import { PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ProductGrid({ products = [] }) {
  const { isDark } = useTheme();
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const { rows: dashboardRows } = useDashboard(60_000);

  const trackedMap = useMemo(() => {
    return Object.fromEntries(dashboardRows.map((r) => [r.product_id, r]));
  }, [dashboardRows]);

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
      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {currentProducts.map((p) => (
          <ProductCard key={p.id} product={p} trackedInfo={trackedMap[p.id]} />
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <nav
          className={`flex items-center justify-center gap-3 mt-12 pt-6 border-t ${
            isDark ? "border-[#353530]" : "border-[#D8D6D0]"
          }`}
          aria-label="Catalog pages"
        >
          <button
            type="button"
            className={`px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? "bg-[#181816] border border-[#353530] text-[#F5F5F0] hover:bg-[#262624]"
                : "bg-[#FFFFFF] border border-[#E4E2DE] text-[#171717] hover:bg-[#F7F7F5]"
            }`}
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div
            className={`px-3.5 py-2 border rounded-md text-xs font-mono ${
              isDark
                ? "bg-[#181816] border-[#353530] text-[#F5F5F0]"
                : "bg-[#FFFFFF] border-[#E4E2DE] text-[#171717]"
            }`}
          >
            Page{" "}
            <span
              className={`font-bold ${
                isDark ? "text-[#F59E0B]" : "text-[#D97706]"
              }`}
            >
              {page}
            </span>{" "}
            of {totalPages}
          </div>

          <button
            type="button"
            className={`px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? "bg-[#181816] border border-[#353530] text-[#F5F5F0] hover:bg-[#262624]"
                : "bg-[#FFFFFF] border border-[#E4E2DE] text-[#171717] hover:bg-[#F7F7F5]"
            }`}
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
