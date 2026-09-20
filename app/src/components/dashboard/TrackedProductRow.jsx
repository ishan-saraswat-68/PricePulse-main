import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HealthBadge } from "../ui/HealthBadge";
import { StockBadge } from "../ui/StockBadge";
import { formatINR, relativeTime, pauseTracking, trackProduct } from "../../services/api";
import { Activity, Pause, Play, Loader2 } from "lucide-react";

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
    <tr className="border-b border-[#e4e4e4] hover:bg-[#fbfbfb] transition-colors text-xs">
      {/* Product Details */}
      <td className="py-4 px-4">
        <Link
          to={`/products/${productId}/monitor`}
          className="group block"
        >
          <span className="font-serif font-bold text-sm text-[#111111] group-hover:underline block">
            {productName}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-[#767676] mt-0.5 font-serif">
            <span>{brand || "Brand"}</span>
            <span>·</span>
            <span className="uppercase tracking-wider text-[10px] font-sans font-bold">{category || "General"}</span>
            <span>·</span>
            <span className="font-mono">#{productId}</span>
          </div>
        </Link>
      </td>

      {/* Health Badge */}
      <td className="py-4 px-4 whitespace-nowrap">
        <HealthBadge status={healthStatus} />
      </td>

      {/* Latest Price */}
      <td className="py-4 px-4 whitespace-nowrap font-serif font-bold text-sm text-[#111111]">
        {formatINR(price)}
      </td>

      {/* Stock Level */}
      <td className="py-4 px-4 whitespace-nowrap">
        <StockBadge stock={stock} />
      </td>

      {/* Frequency */}
      <td className="py-4 px-4 whitespace-nowrap font-mono text-[#767676]">
        {frequencyMinutes}m
      </td>

      {/* Last Scrape */}
      <td className="py-4 px-4 whitespace-nowrap font-mono text-[#767676]" title={lastScrapedAt}>
        {relativeTime(lastScrapedAt)}
      </td>

      {/* Next Run */}
      <td className="py-4 px-4 whitespace-nowrap font-mono text-[#767676]" title={nextScrapeAt}>
        {!isActive ? "Paused" : relativeTime(nextScrapeAt)}
      </td>

      {/* Actions */}
      <td className="py-4 px-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleTogglePause}
            disabled={updating}
            className="p-1.5 border border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            title={!isActive ? "Resume tracking" : "Pause tracking"}
          >
            {updating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : !isActive ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <Link
            to={`/products/${productId}/monitor`}
            className="btn btn-primary !py-1 !px-2.5 !text-[10px]"
          >
            <Activity className="w-3 h-3" />
            <span>Monitor</span>
          </Link>
        </div>
      </td>
    </tr>
  );
}
