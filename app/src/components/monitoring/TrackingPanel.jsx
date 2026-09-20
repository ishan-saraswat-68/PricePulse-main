import React, { useState, useEffect } from "react";
import { HealthBadge } from "../ui/HealthBadge";
import { StockBadge } from "../ui/StockBadge";
import { relativeTime, formatDateTime, trackProduct, pauseTracking } from "../../services/api";
import { Timer, Pause, Play, Loader2, AlertCircle, Clock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function TrackingPanel({
  productId,
  trackedInfo,
  onStatusChange,
}) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const initialFreq =
    trackedInfo?.scrape_frequency_minutes || trackedInfo?.frequency_minutes || 60;
  const [selectedFreq, setSelectedFreq] = useState(initialFreq);

  useEffect(() => {
    const freq = trackedInfo?.scrape_frequency_minutes || trackedInfo?.frequency_minutes;
    if (freq) {
      setSelectedFreq(freq);
    }
  }, [trackedInfo?.scrape_frequency_minutes, trackedInfo?.frequency_minutes]);

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
    <div
      className={`rounded-md border p-5 space-y-4 font-sans transition-colors duration-150 ${
        isDark
          ? "border-[#353530] bg-[#181816] text-[#F5F5F0]"
          : "border-[#E4E2DE] bg-[#FFFFFF] text-[#171717]"
      }`}
    >
      <div
        className={`flex items-center justify-between pb-3 border-b ${
          isDark ? "border-[#353530]" : "border-[#E4E2DE]"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded border flex items-center justify-center ${
              isDark
                ? "bg-[#11110F] border-[#353530]"
                : "bg-[#F3F2EE] border-[#E4E2DE]"
            }`}
          >
            <Timer
              className={`w-3.5 h-3.5 ${
                isDark ? "text-[#F59E0B]" : "text-[#D97706]"
              }`}
            />
          </div>
          <h3
            className={`font-semibold text-sm ${
              isDark ? "text-[#F5F5F0]" : "text-[#171717]"
            }`}
          >
            Surveillance Engine
          </h3>
        </div>
        <HealthBadge status={healthStatus} isMonitoring={true} />
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div
          className={`p-2.5 rounded border ${
            isDark
              ? "border-[#353530] bg-[#11110F]"
              : "border-[#E4E2DE] bg-[#F7F7F5]"
          }`}
        >
          <span
            className={`text-[10px] uppercase tracking-wider block mb-1 ${
              isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
            }`}
          >
            Status
          </span>
          <span
            className={`font-bold uppercase ${
              isDark ? "text-[#F5F5F0]" : "text-[#171717]"
            }`}
          >
            {isPaused ? "PAUSED" : "ACTIVE"}
          </span>
        </div>

        <div
          className={`p-2.5 rounded border ${
            isDark
              ? "border-[#353530] bg-[#11110F]"
              : "border-[#E4E2DE] bg-[#F7F7F5]"
          }`}
        >
          <span
            className={`text-[10px] uppercase tracking-wider block mb-1 ${
              isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
            }`}
          >
            Stock Level
          </span>
          <StockBadge stock={stockLevel} />
        </div>

        <div
          className={`p-2.5 rounded border ${
            isDark
              ? "border-[#353530] bg-[#11110F]"
              : "border-[#E4E2DE] bg-[#F7F7F5]"
          }`}
        >
          <span
            className={`text-[10px] uppercase tracking-wider block mb-1 ${
              isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
            }`}
          >
            Last Scraped
          </span>
          <span
            className={`font-medium block text-[11px] ${
              isDark ? "text-[#F5F5F0]" : "text-[#171717]"
            }`}
            title={trackedInfo?.last_scraped_at}
          >
            {relativeTime(trackedInfo?.last_scraped_at)}
          </span>
          <span
            className={`text-[9.5px] block mt-0.5 ${
              isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
            }`}
          >
            {formatDateTime(trackedInfo?.last_scraped_at)}
          </span>
        </div>

        <div
          className={`p-2.5 rounded border ${
            isDark
              ? "border-[#353530] bg-[#11110F]"
              : "border-[#E4E2DE] bg-[#F7F7F5]"
          }`}
        >
          <span
            className={`text-[10px] uppercase tracking-wider block mb-1 ${
              isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
            }`}
          >
            Next Run
          </span>
          <span
            className={`font-medium block text-[11px] ${
              isDark ? "text-[#F59E0B]" : "text-[#D97706]"
            }`}
            title={trackedInfo?.next_scrape_at}
          >
            {isPaused ? "Standby" : relativeTime(trackedInfo?.next_scrape_at)}
          </span>
          {!isPaused && trackedInfo?.next_scrape_at && (
            <span
              className={`text-[9.5px] block mt-0.5 ${
                isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
              }`}
            >
              {formatDateTime(trackedInfo?.next_scrape_at)}
            </span>
          )}
        </div>
      </div>

      {/* Frequency Setting */}
      <div
        className={`p-3 rounded border flex items-center justify-between gap-3 ${
          isDark
            ? "border-[#353530] bg-[#11110F]"
            : "border-[#E4E2DE] bg-[#F7F7F5]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock
            className={`w-3.5 h-3.5 shrink-0 ${
              isDark ? "text-[#F59E0B]" : "text-[#D97706]"
            }`}
          />
          <div>
            <span
              className={`text-xs font-semibold block ${
                isDark ? "text-[#F5F5F0]" : "text-[#171717]"
              }`}
            >
              Interval Schedule
            </span>
            <span
              className={`text-[10px] font-mono ${
                isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
              }`}
            >
              Background scrape cycle
            </span>
          </div>
        </div>

        <select
          value={selectedFreq}
          onChange={(e) => handleFrequencyChange(Number(e.target.value))}
          disabled={loading || isPaused}
          className={`border rounded text-xs font-mono px-2.5 py-1 focus:outline-none disabled:opacity-40 cursor-pointer ${
            isDark
              ? "bg-[#181816] border-[#353530] text-[#F5F5F0] focus:border-[#F59E0B]"
              : "bg-[#FFFFFF] border-[#E4E2DE] text-[#171717] focus:border-[#D97706]"
          }`}
        >
          <option value={5}>Every 5m</option>
          <option value={10}>Every 10m</option>
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
          className={`w-full py-2 px-3 rounded font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            isPaused
              ? isDark
                ? "bg-[#F59E0B] text-[#11110F] hover:bg-[#D97706]"
                : "bg-[#D97706] text-white hover:bg-[#B45309]"
              : isDark
              ? "bg-[#11110F] border border-[#353530] text-[#F5F5F0] hover:bg-[#262624] hover:border-[#484842]"
              : "bg-[#F7F7F5] border border-[#E4E2DE] text-[#171717] hover:bg-[#EAE8E4] hover:border-[#D8D6D0]"
          }`}
        >
          {loading ? (
            <Loader2
              className={`w-3.5 h-3.5 animate-spin ${
                isDark ? "text-[#F59E0B]" : "text-[#D97706]"
              }`}
            />
          ) : isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Surveillance</span>
            </>
          ) : (
            <>
              <Pause
                className={`w-3.5 h-3.5 fill-current ${
                  isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                }`}
              />
              <span>Pause Surveillance</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          className={`p-2.5 rounded border text-xs font-mono flex items-center gap-2 ${
            isDark
              ? "border-[#EF4444]/40 bg-[#2D1616] text-[#EF4444]"
              : "border-[#DC2626]/30 bg-[#FDF2F2] text-[#DC2626]"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
