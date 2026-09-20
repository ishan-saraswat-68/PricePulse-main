import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HealthBadge } from "../ui/HealthBadge";
import { StockBadge } from "../ui/StockBadge";
import { formatINR, relativeTime, pauseTracking, trackProduct } from "../../services/api";
import { Activity, Pause, Play, Loader2, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function TrackedProductRow({ row, onRefresh }) {
  const { isDark } = useTheme();
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
    <tr
      className={`border-b transition-colors text-xs group font-sans ${
        isDark
          ? "border-[#262624] hover:bg-[#20201D]"
          : "border-[#E4E2DE] hover:bg-[#FAFAF8]"
      }`}
    >
      {/* Product Details */}
      <td className="py-3.5 px-4">
        <Link
          to={`/products/${productId}/monitor`}
          className="group/link block"
        >
          <span
            className={`font-semibold text-[13px] transition-colors block ${
              isDark
                ? "text-[#F5F5F0] group-hover/link:text-[#F59E0B]"
                : "text-[#171717] group-hover/link:text-[#D97706]"
            }`}
          >
            {productName}
          </span>
          <div
            className={`flex items-center gap-2 text-[11px] mt-0.5 ${
              isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
            }`}
          >
            <span className={isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"}>
              {brand || "Brand"}
            </span>
            <span>·</span>
            <span className="uppercase text-[9.5px] tracking-[0.15em] font-medium">
              {category || "General"}
            </span>
            <span>·</span>
            <span className="font-mono">#{productId}</span>
          </div>
        </Link>
      </td>

      {/* Health Badge */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <HealthBadge status={healthStatus} />
      </td>

      {/* Latest Price */}
      <td
        className={`py-3.5 px-4 whitespace-nowrap font-bold text-sm ${
          isDark ? "text-[#F5F5F0]" : "text-[#171717]"
        }`}
      >
        {formatINR(price)}
      </td>

      {/* Stock Level */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <StockBadge stock={stock} />
      </td>

      {/* Frequency */}
      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
        <span
          className={`px-2 py-0.5 rounded border text-[11px] ${
            isDark
              ? "bg-[#262624] border-[#353530] text-[#F5F5F0]"
              : "bg-[#F3F2EE] border-[#E4E2DE] text-[#171717]"
          }`}
        >
          {frequencyMinutes}m
        </span>
      </td>

      {/* Last Scrape */}
      <td
        className={`py-3.5 px-4 whitespace-nowrap font-mono text-[11px] ${
          isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
        }`}
        title={lastScrapedAt}
      >
        {relativeTime(lastScrapedAt)}
      </td>

      {/* Next Run */}
      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]" title={nextScrapeAt}>
        {!isActive ? (
          <span className={isDark ? "text-[#6B6B68] italic" : "text-[#8A8A84] italic"}>
            Paused
          </span>
        ) : (
          <span
            className={`font-medium ${
              isDark ? "text-[#F59E0B]" : "text-[#D97706]"
            }`}
          >
            {relativeTime(nextScrapeAt)}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleTogglePause}
            disabled={updating}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isDark
                ? "border-[#353530] bg-[#181816] text-[#A1A19A] hover:text-[#F5F5F0] hover:border-[#484842]"
                : "border-[#E4E2DE] bg-[#FFFFFF] text-[#6B6B6B] hover:text-[#171717] hover:border-[#D8D6D0]"
            }`}
            title={!isActive ? "Resume tracking" : "Pause tracking"}
          >
            {updating ? (
              <Loader2
                className={`w-3.5 h-3.5 animate-spin ${
                  isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                }`}
              />
            ) : !isActive ? (
              <Play
                className={`w-3.5 h-3.5 fill-current ${
                  isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                }`}
              />
            ) : (
              <Pause
                className={`w-3.5 h-3.5 fill-current ${
                  isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                }`}
              />
            )}
          </button>

          <Link
            to={`/products/${productId}/monitor`}
            className="btn btn-primary !py-1 !px-2.5 !text-[11px] !rounded"
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
