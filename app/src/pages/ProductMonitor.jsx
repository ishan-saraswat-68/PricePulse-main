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
import { useTheme } from "../context/ThemeContext";
import { RefreshCw, Eye, ArrowLeft, Terminal } from "lucide-react";

export function ProductMonitor() {
  const { isDark } = useTheme();
  const { id } = useParams();
  const productId = Number(id);

  const { product, loading: prodLoading, error: prodError } = useProduct(productId);
  const { history, setHistory, loading: histLoading, refresh: refreshHistory } = usePriceHistory(productId, 8_000);
  const { alerts } = useAlerts(productId);
  const { logs, refresh: refreshLogs } = useScrapeLogs(productId, 50, 8_000);
  const { rows: dashboardRows, refresh: refreshDashboard } = useDashboard(10_000);

  const [refreshingPrice, setRefreshingPrice] = useState(false);
  const [refreshError, setRefreshError] = useState(null);

  const trackedInfo = dashboardRows.find((r) => r.product_id === productId);

  const handleRefreshPrice = useCallback(async () => {
    try {
      setRefreshingPrice(true);
      setRefreshError(null);
      await refreshProductPrice(productId);
      await Promise.all([
        refreshHistory(),
        refreshDashboard(),
        refreshLogs ? refreshLogs() : Promise.resolve(),
      ]);
    } catch (err) {
      setRefreshError(err.message || "Failed to fetch live price");
    } finally {
      setRefreshingPrice(false);
    }
  }, [productId, refreshDashboard, refreshLogs, refreshHistory]);

  const handleRefreshAll = useCallback(() => {
    handleRefreshPrice();
  }, [handleRefreshPrice]);

  const isLoading = prodLoading && !product;

  return (
    <div
      className={`space-y-6 font-sans transition-colors duration-150 ${
        isDark ? "text-[#F5F5F0]" : "text-[#171717]"
      }`}
    >
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors ${
              isDark
                ? "text-[#A1A19A] hover:text-[#F59E0B]"
                : "text-[#6B6B6B] hover:text-[#D97706]"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Dashboard</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/products/${productId}`}
            className={`px-3 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark
                ? "border-[#353530] bg-[#181816] text-[#A1A19A] hover:text-[#F5F5F0] hover:border-[#484842]"
                : "border-[#E4E2DE] bg-[#FFFFFF] text-[#6B6B6B] hover:text-[#171717] hover:border-[#D8D6D0]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Store Details</span>
          </Link>

          <button
            onClick={handleRefreshAll}
            disabled={refreshingPrice}
            className={`px-3.5 py-1.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ${
              isDark
                ? "border-[#F59E0B] bg-[#F59E0B] text-[#11110F] hover:bg-[#D97706] hover:border-[#D97706] hover:text-white"
                : "border-[#D97706] bg-[#D97706] text-white hover:bg-[#B45309] hover:border-[#B45309]"
            }`}
            title="Fetch Fresh Store Price"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin" : ""}`} />
            <span>{refreshingPrice ? "Scraping..." : "Refresh Price"}</span>
          </button>
        </div>
      </div>

      {refreshError && (
        <div
          className={`rounded border px-4 py-3 text-xs font-mono ${
            isDark
              ? "border-[#EF4444]/40 bg-[#2D1616] text-[#EF4444]"
              : "border-[#DC2626]/30 bg-[#FDF2F2] text-[#DC2626]"
          }`}
        >
          {refreshError}
        </div>
      )}

      {/* Observability Console Header Banner */}
      <div
        className={`rounded-md border p-6 transition-colors duration-150 ${
          isDark
            ? "bg-[#181816] border-[#353530]"
            : "bg-[#FFFFFF] border-[#E4E2DE]"
        }`}
      >
        <div
          className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded border font-mono text-[11px] font-medium mb-3 ${
            isDark
              ? "border-[#F59E0B]/30 bg-[#262014] text-[#F59E0B]"
              : "border-[#D97706]/30 bg-[#FEF3C7] text-[#D97706]"
          }`}
        >
          <Terminal className="w-3 h-3" />
          <span>SURVEILLANCE TELEMETRY CONSOLE #{productId}</span>
        </div>

        <h1
          className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
            isDark ? "text-[#F5F5F0]" : "text-[#171717]"
          }`}
        >
          {product?.name || `Telemetry: Item #${productId}`}
        </h1>

        <div
          className={`flex flex-wrap items-center gap-3 text-xs mt-2 font-mono ${
            isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
          }`}
        >
          <span>
            Brand:{" "}
            <strong className={`font-normal ${isDark ? "text-[#F5F5F0]" : "text-[#171717]"}`}>
              {product?.brand || "—"}
            </strong>
          </span>
          <span className={isDark ? "text-[#353530]" : "text-[#E4E2DE]"}>/</span>
          <span>
            Category:{" "}
            <strong className={`font-normal ${isDark ? "text-[#F59E0B]" : "text-[#D97706]"}`}>
              {product?.category || "—"}
            </strong>
          </span>
          <span className={isDark ? "text-[#353530]" : "text-[#E4E2DE]"}>/</span>
          <span>
            SKU:{" "}
            <strong className={`font-semibold ${isDark ? "text-[#F5F5F0]" : "text-[#171717]"}`}>
              {product?.sku || "—"}
            </strong>
          </span>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
          <div className="mt-6">
            <ScrapeActivity logs={logs} />
          </div>
        </>
      )}
    </div>
  );
}
