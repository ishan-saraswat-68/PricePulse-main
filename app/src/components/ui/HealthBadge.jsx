import React from "react";
import { useTheme } from "../../context/ThemeContext";

export function HealthBadge({ status, size = "sm", isMonitoring = null }) {
  const { isDark } = useTheme();
  const dark = isMonitoring !== null ? isMonitoring : isDark;
  const normalized = (status || "").toLowerCase();

  const configs = dark
    ? {
        healthy: {
          className: "bg-[#16291E] text-[#22C55E] border border-[#22C55E]/30",
          dot: "bg-[#22C55E]",
          label: "HEALTHY",
        },
        failing: {
          className: "bg-[#2D1616] text-[#EF4444] border border-[#EF4444]/30",
          dot: "bg-[#EF4444]",
          label: "FAILING",
        },
        pending: {
          className: "bg-[#262014] text-[#F59E0B] border border-[#F59E0B]/30",
          dot: "bg-[#F59E0B]",
          label: "ACTIVE",
        },
        disabled: {
          className: "bg-[#1E1E1C] text-[#A1A19A] border border-[#353530]",
          dot: "bg-[#A1A19A]",
          label: "PAUSED",
        },
      }
    : {
        healthy: {
          className: "bg-[#F0FDF4] text-[#15803D] border border-[#15803D]/20",
          dot: "bg-[#15803D]",
          label: "HEALTHY",
        },
        failing: {
          className: "bg-[#FDF2F2] text-[#DC2626] border border-[#DC2626]/20",
          dot: "bg-[#DC2626]",
          label: "FAILING",
        },
        pending: {
          className: "bg-[#FEFCE8] text-[#CA8A04] border border-[#CA8A04]/30",
          dot: "bg-[#CA8A04]",
          label: "ACTIVE",
        },
        disabled: {
          className: "bg-[#F7F7F5] text-[#8A8A84] border border-[#E4E2DE]",
          dot: "bg-[#8A8A84]",
          label: "PAUSED",
        },
      };

  const config = configs[normalized] || configs.pending;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded ${config.className} ${
        isSm ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
