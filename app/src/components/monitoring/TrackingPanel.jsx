import React, { useState } from "react";
import { HealthBadge } from "../ui/HealthBadge";
import { StockBadge } from "../ui/StockBadge";
import { relativeTime, formatDateTime, trackProduct, pauseTracking } from "../../services/api";
import { Timer, Pause, Play, Loader2, AlertCircle } from "lucide-react";

export function TrackingPanel({
  productId,
  trackedInfo,
  onStatusChange,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialFreq =
    trackedInfo?.scrape_frequency_minutes || trackedInfo?.frequency_minutes || 60;
  const [selectedFreq, setSelectedFreq] = useState(initialFreq);

  const isPaused =
    trackedInfo?.is_active === false ||
    trackedInfo?.status === "paused" ||
    trackedInfo?.status === "disabled";
  const isFailing =
    trackedInfo?.last_scrape_status === "failed" ||
    (trackedInfo?.consecutive_failures || 0) > 0;

  const healthStatus = isPaused
    ? "disabled"
    : isFailing
    ? "failing"
    : trackedInfo?.last_scraped_at
    ? "healthy"
    : "pending";

  const stockLevel = trackedInfo?.stock ?? trackedInfo?.latest_stock;

  async function handleTogglePause() {
    try {
      setLoading(true);
      setError(null);
      if (isPaused) {
        await trackProduct(productId, selectedFreq);
      } else {
        await pauseTracking(productId);
      }
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setError(err.message || "Failed to update tracking status.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFrequencyChange(newFreq) {
    setSelectedFreq(newFreq);
    try {
      setLoading(true);
      setError(null);
      await trackProduct(productId, newFreq);
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setError(err.message || "Failed to update frequency.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-[#111111] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e4]">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-[#111111]" />
          <h3 className="font-serif font-bold text-sm text-[#111111]">
            Surveillance Engine
          </h3>
        </div>
        <HealthBadge status={healthStatus} />
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 border border-[#e4e4e4] bg-[#fbfbfb]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#767676] block mb-1">
            Status
          </span>
          <span className="font-mono font-bold text-[#111111] uppercase">
            {isPaused ? "PAUSED" : "ACTIVE"}
          </span>
        </div>

        <div className="p-2.5 border border-[#e4e4e4] bg-[#fbfbfb]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#767676] block mb-1">
            Stock Level
          </span>
          <StockBadge stock={stockLevel} />
        </div>

        <div className="p-2.5 border border-[#e4e4e4] bg-[#fbfbfb]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#767676] block mb-1">
            Last Scraped
          </span>
          <span className="font-mono text-[#111111] block" title={trackedInfo?.last_scraped_at}>
            {relativeTime(trackedInfo?.last_scraped_at)}
          </span>
          <span className="text-[10px] text-[#767676] font-mono block mt-0.5">
            {formatDateTime(trackedInfo?.last_scraped_at)}
          </span>
        </div>

        <div className="p-2.5 border border-[#e4e4e4] bg-[#fbfbfb]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#767676] block mb-1">
            Next Run
          </span>
          <span className="font-mono text-[#111111] block" title={trackedInfo?.next_scrape_at}>
            {isPaused ? "Standby" : relativeTime(trackedInfo?.next_scrape_at)}
          </span>
          {!isPaused && trackedInfo?.next_scrape_at && (
            <span className="text-[10px] text-[#767676] font-mono block mt-0.5">
              {formatDateTime(trackedInfo?.next_scrape_at)}
            </span>
          )}
        </div>
      </div>

      {/* Frequency Setting */}
      <div className="p-3 border border-[#e4e4e4] bg-[#fbfbfb] flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#111111] block">
            Interval
          </span>
          <span className="text-[10px] text-[#767676] font-serif">
            Scrape schedule frequency
          </span>
        </div>

        <select
          value={selectedFreq}
          onChange={(e) => handleFrequencyChange(Number(e.target.value))}
          disabled={loading || isPaused}
          className="bg-white border border-[#111111] text-xs font-mono text-[#111111] px-2 py-1 focus:outline-none disabled:opacity-40 cursor-pointer"
        >
          <option value={15}>Every 15m</option>
          <option value={30}>Every 30m</option>
          <option value={60}>Every 1h</option>
          <option value={120}>Every 2h</option>
          <option value={360}>Every 6h</option>
          <option value={1440}>Every 24h</option>
        </select>
      </div>

      {/* Action Button */}
      <div className="pt-1">
        <button
          onClick={handleTogglePause}
          disabled={loading}
          className={`w-full ${isPaused ? "btn btn-primary" : "btn btn-ghost"}`}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isPaused ? (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Resume Surveillance</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause Job</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-2 border border-red-500 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
