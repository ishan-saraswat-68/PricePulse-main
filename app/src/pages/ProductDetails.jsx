import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useDashboard } from "../hooks/useDashboard";
import { usePriceHistory } from "../hooks/usePriceHistory";
import { ProductSummary } from "../components/products/ProductSummary";
import { ProductSpecs } from "../components/products/ProductSpecs";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { useTheme } from "../context/ThemeContext";
import { ArrowLeft } from "lucide-react";

export function ProductDetails() {
  const { isDark } = useTheme();
  const { id } = useParams();
  const productId = Number(id);

  const { product, loading, error } = useProduct(productId);
  const { history, refresh: refreshHistory } = usePriceHistory(productId);
  const { rows: dashboardRows, refresh: refreshDashboard } = useDashboard(120_000);

  const isTracked = useMemo(() => {
    return dashboardRows.some((r) => r.product_id === productId);
  }, [dashboardRows, productId]);

  const latestPricePoint = useMemo(() => {
    if (history && history.length > 0) {
      return history[history.length - 1];
    }
    const trackedRow = dashboardRows.find((r) => r.product_id === productId);
    if (trackedRow && trackedRow.price !== undefined && trackedRow.price !== null) {
      return {
        price: trackedRow.price,
        mrp: trackedRow.mrp,
        stock: trackedRow.stock,
        quoted_at: trackedRow.quoted_at || trackedRow.last_scraped_at,
      };
    }
    return null;
  }, [history, dashboardRows, productId]);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/products"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isDark
              ? "text-[#A1A19A] hover:text-[#F59E0B]"
              : "text-[#6B6B6B] hover:text-[#D97706]"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Catalog Shelves</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          <LoadingSkeleton rows={4} />
        </div>
      ) : error || !product ? (
        <ErrorState
          error={error || "Product could not be retrieved from the catalog."}
          onRetry={() => window.location.reload()}
        />
      ) : (
        <div className="space-y-8">
          {/* Main Summary Section */}
          <ProductSummary
            product={product}
            isTracked={isTracked}
            latestPricePoint={latestPricePoint}
            onPriceRefreshed={() => {
              refreshHistory();
              refreshDashboard();
            }}
          />

          {/* Technical Specifications & Reviews */}
          <ProductSpecs specs={product.specs} reviews={product.reviews} />
        </div>
      )}
    </div>
  );
}
