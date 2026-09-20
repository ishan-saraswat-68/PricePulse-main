import React, { useState } from "react";
import { HealthBadge } from "../ui/HealthBadge";
import { StockBadge } from "../ui/StockBadge";
import { relativeTime, formatDateTime, trackProduct, pauseTracking } from "../../services/api";
import { Timer, Pause, Play, Loader2, AlertCircle, Clock } from "lucide-react";

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
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
            <Timer className="w-4 h-4 text-cyan-600" />
          </div>
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Surveillance Engine
          </h3>
        </div>
        <HealthBadge status={healthStatus} />
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
          <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-slate-400 block mb-1">
            Status
          </span>
          <span className="font-mono font-bold text-slate-800 uppercase">
            {isPaused ? "PAUSED" : "ACTIVE"}
          </span>
        </div>

        <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
          <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-slate-400 block mb-1">
            Stock Level
          </span>
          <StockBadge stock={stockLevel} />
        </div>

        <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
          <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-slate-400 block mb-1">
            Last Scraped
          </span>
          <span className="font-mono font-medium text-slate-800 block text-[11px]" title={trackedInfo?.last_scraped_at}>
            {relativeTime(trackedInfo?.last_scraped_at)}
          </span>
          <span className="text-[9.5px] text-slate-400 font-mono block mt-0.5">
            {formatDateTime(trackedInfo?.last_scraped_at)}
          </span>
        </div>

        <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
          <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-slate-400 block mb-1">
            Next Run
          </span>
          <span className="font-mono font-medium text-cyan-700 block text-[11px]" title={trackedInfo?.next_scrape_at}>
            {isPaused ? "Standby" : relativeTime(trackedInfo?.next_scrape_at)}
          </span>
          {!isPaused && trackedInfo?.next_scrape_at && (
            <span className="text-[9.5px] text-slate-400 font-mono block mt-0.5">
              {formatDateTime(trackedInfo?.next_scrape_at)}
            </span>
          )}
        </div>
      </div>

      {/* Frequency Setting */}
      <div className="p-3.5 rounded-2xl border border-cyan-100 bg-cyan-50/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
          <div>
            <span className="text-xs font-heading font-bold text-slate-800 block">
              Interval Schedule
            </span>
            <span className="text-[10.5px] text-slate-500 font-medium">
              Background scrape cycle
            </span>
          </div>
        </div>

        <select
          value={selectedFreq}
          onChange={(e) => handleFrequencyChange(Number(e.target.value))}
          disabled={loading || isPaused}
          className="bg-white border border-slate-200 rounded-xl text-xs font-heading font-medium text-slate-800 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-40 cursor-pointer shadow-2xs"
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
          className={`w-full !rounded-xl ${isPaused ? "btn btn-primary" : "btn btn-ghost"}`}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
          ) : isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Surveillance</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 fill-current text-slate-400" />
              <span>Pause Surveillance</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
