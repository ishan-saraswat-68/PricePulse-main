import React from "react";
import { Bell } from "lucide-react";
import { formatINR } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

export function AlertPanel({ alerts = [] }) {
  const { isDark } = useTheme();

  function getAlertDescription(alert) {
    const type = (alert.type || alert.alert_type || "").toLowerCase();
    const val = alert.target_value ?? alert.value;

    if (type.includes("drop") || type.includes("price_drop")) {
      return `Trigger when store price drops below ${formatINR(val)} or receives store discount`;
    }
    if (type.includes("stock") || type.includes("low_stock")) {
      return `Trigger when stock falls to ${val || 5} units or less`;
    }
    if (type.includes("target")) {
      return `Target price threshold: ${formatINR(val)}`;
    }
    return `Custom rule: ${type} (value: ${val ?? "N/A"})`;
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
            <Bell
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
            Active Trigger Rules
          </h3>
        </div>
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
            isDark
              ? "text-[#F59E0B] bg-[#262014] border-[#F59E0B]/30"
              : "text-[#D97706] bg-[#FEF3C7] border-[#D97706]/30"
          }`}
        >
          {alerts.length} rules
        </span>
      </div>

      {alerts.length === 0 ? (
        <div
          className={`py-6 text-center text-xs font-mono italic ${
            isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
          }`}
        >
          <p>No active notification rules configured for this product.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => {
            const isActive = alert.is_active !== false;
            return (
              <div
                key={alert.id}
                className={`p-3 rounded border flex items-center justify-between gap-3 text-xs font-mono transition-colors ${
                  isDark
                    ? "border-[#353530] bg-[#11110F]"
                    : "border-[#E4E2DE] bg-[#F7F7F5]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-sans font-semibold text-xs capitalize ${
                        isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                      }`}
                    >
                      {alert.type?.replace(/_/g, " ") || "Alert Rule"}
                    </span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-medium uppercase tracking-wider ${
                        isActive
                          ? isDark
                            ? "bg-[#262014] text-[#F59E0B] border border-[#F59E0B]/30"
                            : "bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30"
                          : isDark
                          ? "bg-[#1E1E1C] text-[#A1A19A] border border-[#353530]"
                          : "bg-[#EAE8E4] text-[#6B6B6B] border border-[#D8D6D0]"
                      }`}
                    >
                      {isActive ? "ACTIVE" : "PAUSED"}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] font-sans font-normal mt-1 leading-normal ${
                      isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
                    }`}
                  >
                    {getAlertDescription(alert)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[9px] uppercase font-mono tracking-wider block ${
                      isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                    }`}
                  >
                    Trigger
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                    }`}
                  >
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
