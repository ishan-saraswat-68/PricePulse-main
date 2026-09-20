import React from "react";
import { Bell } from "lucide-react";
import { formatINR } from "../../services/api";

export function AlertPanel({ alerts = [] }) {
  function getAlertDescription(alert) {
    const type = (alert.type || alert.alert_type || "").toLowerCase();
    const val = alert.target_value ?? alert.value;

    if (type.includes("drop") || type.includes("price_drop")) {
      return `Notify when price drops below ${formatINR(val)} or receives store discount`;
    }
    if (type.includes("stock") || type.includes("low_stock")) {
      return `Notify when stock falls to ${val || 5} units or less`;
    }
    if (type.includes("target")) {
      return `Target price threshold: ${formatINR(val)}`;
    }
    return `Custom rule: ${type} (value: ${val ?? "N/A"})`;
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
            <Bell className="w-4 h-4 text-cyan-600" />
          </div>
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Active Trigger Rules
          </h3>
        </div>
        <span className="text-[11px] font-heading font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
          {alerts.length} rules
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs italic">
          <p>No active notification rules configured for this product.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => {
            const isActive = alert.is_active !== false;
            return (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:border-cyan-200 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-slate-900 text-xs capitalize">
                      {alert.type?.replace(/_/g, " ") || "Alert Rule"}
                    </span>
                    <span
                      className={`text-[9.5px] px-2 py-0.5 rounded-full font-heading font-semibold uppercase tracking-wider ${
                        isActive
                          ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {isActive ? "ACTIVE" : "PAUSED"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-normal mt-1 leading-normal">
                    {getAlertDescription(alert)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9.5px] uppercase font-heading font-bold tracking-wider text-slate-400 block">
                    Trigger
                  </span>
                  <span className="text-xs font-heading font-bold text-slate-800">
                    {alert.target_value ? `₹${Number(alert.target_value).toLocaleString("en-IN")}` : "Any Drop"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
