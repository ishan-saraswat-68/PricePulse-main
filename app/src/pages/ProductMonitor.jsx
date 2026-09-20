import React, { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { usePriceHistory } from "../hooks/usePriceHistory";
import { useAlerts } from "../hooks/useAlerts";
import { useScrapeLogs } from "../hooks/useScrapeLogs";
import { useDashboard } from "../hooks/useDashboard";
import { refreshProductPrice } from "../services/api";
import { PriceChart } from "../components/monitoring/PriceChart";
import { TrackingPanel } from "../components/monitoring/TrackingPanel";
import { AlertPanel } from "../components/monitoring/AlertPanel";
import { ScrapeActivity } from "../components/monitoring/ScrapeActivity";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { RefreshCw, Eye, ArrowLeft, Activity } from "lucide-react";

export function ProductMonitor() {
  const { id } = useParams();
  const productId = Number(id);

  const { product, loading: prodLoading, error: prodError } = useProduct(productId);
  const { history, setHistory, loading: histLoading, refresh: refreshHistory } = usePriceHistory(productId);
  const { alerts } = useAlerts(productId);
  const { logs, refresh: refreshLogs } = useScrapeLogs(productId, 50);
  const { rows: dashboardRows, refresh: refreshDashboard } = useDashboard(30_000);

  const [refreshingPrice, setRefreshingPrice] = useState(false);
  const [refreshError, setRefreshError] = useState(null);

  const trackedInfo = dashboardRows.find((r) => r.product_id === productId);

  const handleRefreshPrice = useCallback(async () => {
    try {
      setRefreshingPrice(true);
      setRefreshError(null);
      const newPoint = await refreshProductPrice(productId);
      if (newPoint) {
        setHistory((prev) => {
          const exists = prev.some((p) => p.id === newPoint.id);
          if (exists) return prev;
          return [...prev, newPoint];
        });
      }
      refreshDashboard();
      if (refreshLogs) refreshLogs();
    } catch (err) {
      setRefreshError(err.message || "Failed to fetch live price");
    } finally {
      setRefreshingPrice(false);
    }
  }, [productId, refreshDashboard, refreshLogs, setHistory]);

  const handleRefreshAll = useCallback(() => {
    handleRefreshPrice();
  }, [handleRefreshPrice]);

  const isLoading = prodLoading && !product;

  return (
    <div className="space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-slate-500 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/products/${productId}`}
            className="btn btn-ghost !py-1.5 !px-3.5 !text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Store Details</span>
          </Link>

          <button
            onClick={handleRefreshAll}
            disabled={refreshingPrice}
            className="btn btn-primary !py-1.5 !px-3.5 !text-xs cursor-pointer"
            title="Fetch Fresh Store Price"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin" : ""}`} />
            <span>{refreshingPrice ? "Scraping..." : "Refresh Price"}</span>
          </button>
        </div>
      </div>

      {refreshError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-xs font-mono">
          {refreshError}
        </div>
      )}

      {/* Page Title & Status Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/70 mb-3">
          <Activity className="w-3.5 h-3.5 text-cyan-600" />
          <span>Surveillance Telemetry Stream #{productId}</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {product?.name || `Telemetry: Item #${productId}`}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
          <span>Brand: <strong className="text-slate-800 font-semibold">{product?.brand || "—"}</strong></span>
          <span>·</span>
          <span>Category: <strong className="text-cyan-700 font-semibold">{product?.category || "—"}</strong></span>
          <span>·</span>
          <span>SKU: <strong className="text-slate-800 font-mono">{product?.sku || "—"}</strong></span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <LoadingSkeleton rows={4} />
          <LoadingSkeleton rows={4} />
        </div>
      ) : prodError ? (
        <ErrorState
          error={prodError}
          onRetry={handleRefreshAll}
        />
      ) : (
        <>
          {/* Main Monitoring Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Columns: Price History Chart */}
            <div className="lg:col-span-8 space-y-6">
              <PriceChart
                history={history}
                onRefreshPrice={handleRefreshPrice}
                refreshingPrice={refreshingPrice}
              />
            </div>

            {/* Right 4 Columns: Tracking Engine & Alerts */}
            <div className="lg:col-span-4 space-y-6">
              <TrackingPanel
                productId={productId}
                trackedInfo={trackedInfo}
                onStatusChange={refreshDashboard}
              />
              <AlertPanel alerts={alerts} />
            </div>
          </div>

          {/* Bottom Full Width: Scrape Activity Stream */}
          <div className="mt-8">
            <ScrapeActivity logs={logs} />
          </div>
        </>
      )}
    </div>
  );
}
