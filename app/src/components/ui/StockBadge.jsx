import React from "react";
import { useTheme } from "../../context/ThemeContext";

export function StockBadge({ stock }) {
  const { isDark } = useTheme();

  if (stock === null || stock === undefined) {
    return (
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono ${
          isDark
            ? "bg-[#181816] border-[#353530] text-[#A1A19A]"
            : "bg-[#F7F7F5] border-[#E4E2DE] text-[#8A8A84]"
        }`}
      >
        Stock N/A
      </span>
    );
  }

  if (stock === 0) {
    return (
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
          isDark
            ? "bg-[#2D1616] border-[#EF4444]/30 text-[#EF4444]"
            : "bg-[#FDF2F2] border-[#DC2626]/20 text-[#DC2626]"
        }`}
      >
        Out of stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
          isDark
            ? "bg-[#262014] border-[#EAB308]/30 text-[#EAB308]"
            : "bg-[#FEFCE8] border-[#CA8A04]/25 text-[#CA8A04]"
        }`}
      >
        Low stock ({stock})
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
        isDark
          ? "bg-[#16291E] border-[#22C55E]/30 text-[#22C55E]"
          : "bg-[#F0FDF4] border-[#15803D]/20 text-[#15803D]"
      }`}
    >
      In stock ({stock})
    </span>
  );
}
