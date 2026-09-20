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
    <div className="border border-[#111111] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e4]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#111111]" />
          <h3 className="font-serif font-bold text-sm text-[#111111]">
            Active Trigger Rules ({alerts.length})
          </h3>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="py-6 text-center text-[#767676] text-xs font-serif italic">
          <p>No active notification rules configured.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => {
            const isActive = alert.is_active !== false;
            return (
              <div
                key={alert.id}
                className="p-3 border border-[#e4e4e4] bg-[#fbfbfb] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111111] uppercase tracking-wider text-[11px]">
                      {alert.type?.replace(/_/g, " ") || "Alert Rule"}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 font-mono font-bold uppercase ${
                        isActive
                          ? "bg-[#111111] text-white"
                          : "border border-[#e4e4e4] text-[#767676]"
                      }`}
                    >
                      {isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <p className="text-[#767676] text-[11px] font-serif mt-0.5">
                    {getAlertDescription(alert)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#767676] block">
                    Trigger
                  </span>
                  <span className="text-xs font-serif font-bold text-[#111111]">
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
