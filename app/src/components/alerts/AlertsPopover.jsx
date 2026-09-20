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

export function AlertsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState("all"); // 'all' | 'price_drop' | 'back_in_stock'
  const popoverRef = useRef(null);

  // Poll alerts every 20 seconds
  const { alerts, loading, refresh } = useAlerts(null, 20_000);

  // Triggered alerts (price drops or stock notifications that have fired)
  const triggeredAlerts = alerts.filter((a) => Boolean(a.triggered_at));
  const activeAlerts = alerts.filter((a) => a.is_active && !a.triggered_at);

  const totalNotificationCount = triggeredAlerts.length;

  // Filtered alerts list based on tab
  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === "price_drop") return alert.type === "price_drop";
    if (filterType === "back_in_stock") return alert.type === "back_in_stock";
    return true;
  });

  // Close when clicking outside
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

  // Close on Escape key
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
        className={`relative p-2 border border-[#111111] transition-colors cursor-pointer flex items-center justify-center ${
          isOpen ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#f6f6f6]"
        }`}
        title="Price Drop & Stock Alerts"
      >
        <Bell className="w-4 h-4" />
        {totalNotificationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#111111] text-white text-[9.5px] font-mono font-bold flex items-center justify-center border border-white">
            {totalNotificationCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[420px] bg-white border-2 border-[#111111] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="p-4 border-b border-[#111111] bg-[#fbfbfb] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#111111]"></span>
                <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-[#111111]">
                  Alerts & Notifications
                </h3>
              </div>
              <p className="text-[11px] text-[#767676] font-serif mt-0.5">
                {triggeredAlerts.length} triggered price drop/stock events
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => refresh()}
                className="p-1 hover:bg-[#e4e4e4] text-[#767676] hover:text-[#111111] transition-colors"
                title="Refresh alerts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#e4e4e4] text-[#767676] hover:text-[#111111] transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-[#e4e4e4] text-xs font-mono uppercase bg-white">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`flex-1 py-2 text-center transition-colors border-r border-[#e4e4e4] ${
                filterType === "all"
                  ? "font-bold text-[#111111] bg-[#f6f6f6] border-b-2 border-b-[#111111]"
                  : "text-[#767676] hover:text-[#111111]"
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("price_drop")}
              className={`flex-1 py-2 text-center transition-colors border-r border-[#e4e4e4] ${
                filterType === "price_drop"
                  ? "font-bold text-[#111111] bg-[#f6f6f6] border-b-2 border-b-[#111111]"
                  : "text-[#767676] hover:text-[#111111]"
              }`}
            >
              Price Drops ({alerts.filter((a) => a.type === "price_drop").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("back_in_stock")}
              className={`flex-1 py-2 text-center transition-colors ${
                filterType === "back_in_stock"
                  ? "font-bold text-[#111111] bg-[#f6f6f6] border-b-2 border-b-[#111111]"
                  : "text-[#767676] hover:text-[#111111]"
              }`}
            >
              Stock ({alerts.filter((a) => a.type === "back_in_stock").length})
            </button>
          </div>

          {/* Alerts List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#e4e4e4]">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center bg-white">
                <CheckCircle2 className="w-8 h-8 text-[#767676] mx-auto mb-2 stroke-[1.2]" />
                <p className="font-serif text-sm font-bold text-[#111111]">
                  No alerts in this category
                </p>
                <p className="text-xs text-[#767676] font-serif mt-1">
                  PricePulse continuously monitors your catalog for price reductions and restocks.
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
                    className={`p-4 transition-colors ${
                      isTriggered ? "bg-[#fffbf0]/40 hover:bg-[#fffbf0]" : "bg-white hover:bg-[#fbfbfb]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        {/* Status Tag */}
                        <div className="flex items-center gap-2">
                          {isTriggered ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#111111] text-white">
                              {isPriceDrop ? (
                                <>
                                  <TrendingDown className="w-3 h-3 text-white" />
                                  Price Drop Triggered
                                </>
                              ) : (
                                <>
                                  <PackageCheck className="w-3 h-3 text-white" />
                                  Back In Stock
                                </>
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border border-[#111111] text-[#111111] bg-white">
                              <Activity className="w-3 h-3 text-[#111111]" />
                              Surveillance Active
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-[#767676]">
                            {product.sku || `ID #${alert.product_id}`}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h4 className="font-serif font-bold text-sm text-[#111111] leading-snug pt-0.5">
                          {product.name || `Catalog Item #${alert.product_id}`}
                        </h4>

                        {/* Details message */}
                        <p className="text-xs text-[#555555] font-serif">
                          {isTriggered
                            ? isPriceDrop
                              ? "A store discount or price drop was detected by PricePulse surveillance."
                              : "Inventory was replenished on the INE Store."
                            : isPriceDrop
                            ? "Active rule: Will alert immediately when a price reduction is captured."
                            : "Active rule: Will alert immediately when units return to stock."}
                        </p>

                        {/* Timestamp */}
                        <div className="text-[10px] font-mono text-[#767676] pt-1">
                          {isTriggered ? (
                            <span>Triggered: {formatDateTime(alert.triggered_at)}</span>
                          ) : (
                            <span>Surveillance armed · In-App notification</span>
                          )}
                        </div>
                      </div>

                      {/* Direct Links */}
                      <div className="flex flex-col gap-1 shrink-0 pt-1">
                        <Link
                          to={`/products/${alert.product_id}/monitor`}
                          onClick={() => setIsOpen(false)}
                          className="btn btn-primary !py-1 !px-2.5 !text-[10px] flex items-center gap-1"
                          title="Open telemetry chart"
                        >
                          <span>Graph</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          to={`/products/${alert.product_id}`}
                          onClick={() => setIsOpen(false)}
                          className="btn btn-ghost !py-1 !px-2.5 !text-[10px] flex items-center gap-1"
                          title="View catalog details"
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
          <div className="p-3 bg-[#f6f6f6] border-t border-[#111111] flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] text-[#767676]">
              {alerts.length} total monitored rules
            </span>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="font-bold underline text-[#111111] hover:text-[#555] flex items-center gap-1 text-xs"
            >
              <span>View Tracking Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
