import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlerts } from "../../hooks/useAlerts";
import { formatDateTime } from "../../services/api";
import {
  Bell,
  X,
  TrendingDown,
  PackageCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export function AlertsPopover({ isMonitoring = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const popoverRef = useRef(null);

  // Poll alerts every 20 seconds
  const { alerts, loading, refresh } = useAlerts(null, 20_000);

  const triggeredAlerts = alerts.filter((a) => Boolean(a.triggered_at));
  const totalNotificationCount = triggeredAlerts.length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === "price_drop") return alert.type === "price_drop";
    if (filterType === "back_in_stock") return alert.type === "back_in_stock";
    return true;
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Alert Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="View Alerts"
        className={`relative p-2 rounded border transition-colors cursor-pointer flex items-center justify-center ${
          isMonitoring
            ? isOpen
              ? "bg-[#262624] border-[#F59E0B] text-[#F59E0B]"
              : "bg-[#181816] border-[#353530] text-[#A1A19A] hover:text-[#F5F5F0] hover:border-[#484842]"
            : isOpen
            ? "bg-[#F3F2EE] border-[#D97706] text-[#D97706]"
            : "bg-[#FFFFFF] border-[#E4E2DE] text-[#6B6B6B] hover:text-[#171717] hover:border-[#D8D6D0]"
        }`}
        title="Price Drop & Stock Alerts"
      >
        <Bell className="w-4 h-4" />
        {totalNotificationCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 text-white text-[10px] font-mono font-bold rounded flex items-center justify-center ring-2 ${
              isMonitoring
                ? "bg-[#F59E0B] text-[#11110F] ring-[#181816]"
                : "bg-[#D97706] ring-[#FFFFFF]"
            }`}
          >
            {totalNotificationCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-[340px] sm:w-[400px] border rounded-md shadow-lg z-50 overflow-hidden font-sans text-xs ${
            isMonitoring
              ? "bg-[#181816] border-[#353530] text-[#F5F5F0]"
              : "bg-[#FFFFFF] border-[#E4E2DE] text-[#171717]"
          }`}
        >
          {/* Header */}
          <div
            className={`p-3.5 border-b flex items-center justify-between ${
              isMonitoring
                ? "bg-[#11110F] border-[#353530]"
                : "bg-[#F7F7F5] border-[#E4E2DE]"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isMonitoring ? "bg-[#F59E0B]" : "bg-[#D97706]"
                  }`}
                />
                <h3
                  className={`font-semibold text-sm ${
                    isMonitoring ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  Alerts & Notifications
                </h3>
              </div>
              <p className="text-[11px] text-[#8A8A84] mt-0.5 font-mono">
                {triggeredAlerts.length} triggered events
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => refresh()}
                className={`p-1.5 rounded transition-colors ${
                  isMonitoring
                    ? "hover:bg-[#262624] text-[#A1A19A] hover:text-[#F5F5F0]"
                    : "hover:bg-[#E4E2DE] text-[#6B6B6B] hover:text-[#171717]"
                }`}
                title="Refresh alerts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded transition-colors ${
                  isMonitoring
                    ? "hover:bg-[#262624] text-[#A1A19A] hover:text-[#F5F5F0]"
                    : "hover:bg-[#E4E2DE] text-[#6B6B6B] hover:text-[#171717]"
                }`}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div
            className={`flex border-b p-1 gap-1 text-xs ${
              isMonitoring
                ? "bg-[#181816] border-[#353530]"
                : "bg-[#FFFFFF] border-[#E4E2DE]"
            }`}
          >
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`flex-1 py-1 text-center rounded text-xs font-medium transition-colors ${
                filterType === "all"
                  ? isMonitoring
                    ? "bg-[#262624] text-[#F5F5F0]"
                    : "bg-[#F7F7F5] text-[#171717] font-semibold"
                  : isMonitoring
                  ? "text-[#A1A19A] hover:text-[#F5F5F0]"
                  : "text-[#6B6B6B] hover:text-[#171717]"
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("price_drop")}
              className={`flex-1 py-1 text-center rounded text-xs font-medium transition-colors ${
                filterType === "price_drop"
                  ? isMonitoring
                    ? "bg-[#262624] text-[#F59E0B]"
                    : "bg-[#F3F2EE] text-[#D97706] font-semibold"
                  : isMonitoring
                  ? "text-[#A1A19A] hover:text-[#F5F5F0]"
                  : "text-[#6B6B6B] hover:text-[#171717]"
              }`}
            >
              Price Drops ({alerts.filter((a) => a.type === "price_drop").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("back_in_stock")}
              className={`flex-1 py-1 text-center rounded text-xs font-medium transition-colors ${
                filterType === "back_in_stock"
                  ? isMonitoring
                    ? "bg-[#262624] text-[#22C55E]"
                    : "bg-[#F3F2EE] text-[#15803D] font-semibold"
                  : isMonitoring
                  ? "text-[#A1A19A] hover:text-[#F5F5F0]"
                  : "text-[#6B6B6B] hover:text-[#171717]"
              }`}
            >
              Stock ({alerts.filter((a) => a.type === "back_in_stock").length})
            </button>
          </div>

          {/* Alerts List */}
          <div
            className={`max-h-[340px] overflow-y-auto divide-y ${
              isMonitoring ? "divide-[#262624]" : "divide-[#E4E2DE]"
            }`}
          >
            {filteredAlerts.length === 0 ? (
              <div
                className={`p-6 text-center ${
                  isMonitoring ? "bg-[#181816]" : "bg-[#FFFFFF]"
                }`}
              >
                <CheckCircle2
                  className={`w-6 h-6 mx-auto mb-2 stroke-[1.5] ${
                    isMonitoring ? "text-[#353530]" : "text-[#D8D6D0]"
                  }`}
                />
                <p
                  className={`font-medium text-xs ${
                    isMonitoring ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  No alerts in this category
                </p>
                <p className="text-[11px] text-[#8A8A84] mt-1">
                  Surveillance continues running in background.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isTriggered = Boolean(alert.triggered_at);
                const product = alert.products || {};
                const isPriceDrop = alert.type === "price_drop";

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 transition-colors ${
                      isTriggered
                        ? isMonitoring
                          ? "bg-[#221C11] hover:bg-[#2A2315]"
                          : "bg-[#FEF9EE] hover:bg-[#FDF4DC]"
                        : isMonitoring
                        ? "bg-[#181816] hover:bg-[#20201D]"
                        : "bg-[#FFFFFF] hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {isTriggered ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded ${
                                isMonitoring
                                  ? "bg-[#F59E0B] text-[#11110F]"
                                  : "bg-[#D97706] text-white"
                              }`}
                            >
                              {isPriceDrop ? (
                                <>
                                  <TrendingDown className="w-3 h-3" />
                                  Price Drop
                                </>
                              ) : (
                                <>
                                  <PackageCheck className="w-3 h-3" />
                                  In Stock
                                </>
                              )}
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                isMonitoring
                                  ? "bg-[#11110F] border-[#353530] text-[#A1A19A]"
                                  : "bg-[#F7F7F5] border-[#E4E2DE] text-[#6B6B6B]"
                              }`}
                            >
                              <Activity className="w-3 h-3 text-[#8A8A84]" />
                              Armed
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-[#8A8A84]">
                            {product.sku || `ID #${alert.product_id}`}
                          </span>
                        </div>

                        <h4
                          className={`font-semibold text-xs leading-snug pt-0.5 ${
                            isMonitoring ? "text-[#F5F5F0]" : "text-[#171717]"
                          }`}
                        >
                          {product.name || `Catalog Item #${alert.product_id}`}
                        </h4>

                        <p className="text-[11px] text-[#8A8A84] leading-relaxed">
                          {isTriggered
                            ? isPriceDrop
                              ? "A price drop was captured by PricePulse surveillance."
                              : "Inventory was replenished on the store."
                            : isPriceDrop
                            ? "Alerts when price drop is detected."
                            : "Alerts when item returns to stock."}
                        </p>

                        <div className="text-[10px] font-mono text-[#8A8A84]">
                          {isTriggered ? (
                            <span>Triggered: {formatDateTime(alert.triggered_at)}</span>
                          ) : (
                            <span>Polling scheduled</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0 pt-1">
                        <Link
                          to={`/products/${alert.product_id}/monitor`}
                          onClick={() => setIsOpen(false)}
                          className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                            isMonitoring
                              ? "bg-[#F59E0B] text-[#11110F] hover:bg-[#D97706]"
                              : "bg-[#D97706] text-white hover:bg-[#B45309]"
                          }`}
                          title="Open monitoring console"
                        >
                          <span>Monitor</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          to={`/products/${alert.product_id}`}
                          onClick={() => setIsOpen(false)}
                          className={`px-2 py-1 rounded border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                            isMonitoring
                              ? "bg-[#181816] border-[#353530] text-[#A1A19A] hover:text-[#F5F5F0]"
                              : "bg-[#FFFFFF] border-[#E4E2DE] text-[#6B6B6B] hover:text-[#171717]"
                          }`}
                          title="View product details"
                        >
                          <span>Item</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div
            className={`p-3 border-t flex items-center justify-between text-xs ${
              isMonitoring
                ? "bg-[#11110F] border-[#353530]"
                : "bg-[#F7F7F5] border-[#E4E2DE]"
            }`}
          >
            <span className="font-mono text-[10px] text-[#8A8A84]">
              {alerts.length} active rules
            </span>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`font-medium flex items-center gap-1 text-xs transition-colors ${
                isMonitoring
                  ? "text-[#F59E0B] hover:underline"
                  : "text-[#D97706] hover:text-[#B45309]"
              }`}
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
