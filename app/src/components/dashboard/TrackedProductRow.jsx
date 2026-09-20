import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HealthBadge } from "../ui/HealthBadge";
import { StockBadge } from "../ui/StockBadge";
import { formatINR, relativeTime, pauseTracking, trackProduct } from "../../services/api";
import { Activity, Pause, Play, Loader2, ChevronRight } from "lucide-react";

export function TrackedProductRow({ row, onRefresh }) {
  const [updating, setUpdating] = useState(false);

  const productId = row.product_id;
  const productName = row.name || row.product_name || `Product #${productId}`;
  const brand = row.brand;
  const category = row.category;
  const isActive = row.is_active !== false && row.status !== "paused" && row.status !== "disabled";
  const frequencyMinutes = row.scrape_frequency_minutes || row.frequency_minutes || 60;
  const lastScrapedAt = row.last_scraped_at;
  const nextScrapeAt = row.next_scrape_at;
  const price = row.price ?? row.latest_price;
  const stock = row.stock ?? row.latest_stock;
  const isFailing = row.last_scrape_status === "failed" || (row.consecutive_failures || 0) > 0;

  const healthStatus = !isActive
    ? "disabled"
    : isFailing
    ? "failing"
    : lastScrapedAt
    ? "healthy"
    : "pending";

  async function handleTogglePause(e) {
    e.stopPropagation();
    try {
      setUpdating(true);
      if (!isActive) {
        await trackProduct(productId, frequencyMinutes);
      } else {
        await pauseTracking(productId);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to toggle tracking state:", err);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs group">
      {/* Product Details */}
      <td className="py-4 px-4">
        <Link
          to={`/products/${productId}/monitor`}
          className="group/link block"
        >
          <span className="font-heading font-bold text-sm text-slate-900 group-hover/link:text-cyan-600 transition-colors block">
            {productName}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            <span className="font-semibold text-slate-600">{brand || "Brand"}</span>
            <span>·</span>
            <span className="text-[10px] font-heading font-medium text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-100/60">
              {category || "General"}
            </span>
            <span>·</span>
            <span className="font-mono text-slate-400">#{productId}</span>
          </div>
        </Link>
      </td>

      {/* Health Badge */}
      <td className="py-4 px-4 whitespace-nowrap">
        <HealthBadge status={healthStatus} />
      </td>

      {/* Latest Price */}
      <td className="py-4 px-4 whitespace-nowrap font-heading font-bold text-sm text-slate-900">
        {formatINR(price)}
      </td>

      {/* Stock Level */}
      <td className="py-4 px-4 whitespace-nowrap">
        <StockBadge stock={stock} />
      </td>

      {/* Frequency */}
      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-600">
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
          {frequencyMinutes}m
        </span>
      </td>

      {/* Last Scrape */}
      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]" title={lastScrapedAt}>
        {relativeTime(lastScrapedAt)}
      </td>

      {/* Next Run */}
      <td className="py-4 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]" title={nextScrapeAt}>
        {!isActive ? (
          <span className="text-slate-400 italic">Paused</span>
        ) : (
          <span className="text-cyan-700 font-medium">{relativeTime(nextScrapeAt)}</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleTogglePause}
            disabled={updating}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
            title={!isActive ? "Resume tracking" : "Pause tracking"}
          >
            {updating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
            ) : !isActive ? (
              <Play className="w-3.5 h-3.5 fill-current text-cyan-600" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current text-slate-500" />
            )}
          </button>

          <Link
            to={`/products/${productId}/monitor`}
            className="btn btn-primary !py-1 !px-2.5 !text-[11px] !rounded-lg"
          >
            <Activity className="w-3 h-3" />
            <span>Monitor</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </td>
    </tr>
  );
}
