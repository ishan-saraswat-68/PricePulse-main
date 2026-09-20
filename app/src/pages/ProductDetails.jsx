import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useDashboard } from "../hooks/useDashboard";
import { usePriceHistory } from "../hooks/usePriceHistory";
import { ProductSummary } from "../components/products/ProductSummary";
import { ProductSpecs } from "../components/products/ProductSpecs";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";

export function ProductDetails() {
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
    <div>
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/products"
          className="text-xs uppercase tracking-wider font-bold text-[#767676] hover:text-[#111111] transition-colors"
        >
          ← Back to all products
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
        <div>
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

