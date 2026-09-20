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
        className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? "bg-cyan-50 border-cyan-300 text-cyan-700 shadow-xs"
            : "bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
        }`}
        title="Price Drop & Stock Alerts"
      >
        <Bell className="w-4 h-4" />
        {totalNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-cyan-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
            {totalNotificationCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[340px] sm:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <h3 className="font-heading font-bold text-sm tracking-tight text-slate-900">
                  Surveillance Alerts
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {triggeredAlerts.length} triggered price drop or stock events
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => refresh()}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
                title="Refresh alerts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 text-xs font-heading bg-white p-1 gap-1">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`flex-1 py-1.5 text-center rounded-lg transition-all font-semibold ${
                filterType === "all"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("price_drop")}
              className={`flex-1 py-1.5 text-center rounded-lg transition-all font-semibold ${
                filterType === "price_drop"
                  ? "bg-cyan-50 text-cyan-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Price Drops ({alerts.filter((a) => a.type === "price_drop").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("back_in_stock")}
              className={`flex-1 py-1.5 text-center rounded-lg transition-all font-semibold ${
                filterType === "back_in_stock"
                  ? "bg-cyan-50 text-cyan-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Stock ({alerts.filter((a) => a.type === "back_in_stock").length})
            </button>
          </div>

          {/* Alerts List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center bg-white">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                <p className="font-heading font-semibold text-sm text-slate-800">
                  No alerts in this category
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  PricePulse continuously monitors your tracked catalog for price reductions and restocks.
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
                      isTriggered ? "bg-amber-50/40 hover:bg-amber-50/70" : "bg-white hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {isTriggered ? (
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-600 text-white shadow-2xs">
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
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-heading font-semibold tracking-wide px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                              <Activity className="w-3 h-3 text-cyan-600" />
                              Armed
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-slate-400">
                            {product.sku || `ID #${alert.product_id}`}
                          </span>
                        </div>

                        <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug pt-0.5">
                          {product.name || `Catalog Item #${alert.product_id}`}
                        </h4>

                        <p className="text-xs text-slate-600 font-normal leading-relaxed">
                          {isTriggered
                            ? isPriceDrop
                              ? "A price drop was captured by PricePulse surveillance."
                              : "Inventory was replenished on the store."
                            : isPriceDrop
                            ? "Active rule: Alerts when price reduction is captured."
                            : "Active rule: Alerts when units return to stock."}
                        </p>

                        <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                          {isTriggered ? (
                            <span>Triggered: {formatDateTime(alert.triggered_at)}</span>
                          ) : (
                            <span>Surveillance armed · 15m polling</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0 pt-1">
                        <Link
                          to={`/products/${alert.product_id}/monitor`}
                          onClick={() => setIsOpen(false)}
                          className="btn btn-primary !py-1 !px-2.5 !text-[11px] flex items-center gap-1"
                          title="Open telemetry chart"
                        >
                          <span>Graph</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          to={`/products/${alert.product_id}`}
                          onClick={() => setIsOpen(false)}
                          className="btn btn-ghost !py-1 !px-2.5 !text-[11px] flex items-center gap-1"
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
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] text-slate-500">
              {alerts.length} monitored rules
            </span>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="font-heading font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 text-xs"
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
