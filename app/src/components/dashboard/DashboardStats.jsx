import React from "react";
import { Activity, CheckCircle2, AlertTriangle, Clock, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function DashboardStats({ rows = [] }) {
  const { isDark } = useTheme();

  const total = rows.length;
  const active = rows.filter(
    (r) => r.is_active !== false && r.status !== "paused" && r.status !== "disabled"
  ).length;
  const failing = rows.filter(
    (r) => r.last_scrape_status === "failed" || (r.consecutive_failures || 0) > 0
  ).length;
  const healthy = active - failing;
  const paused = total - active;

  // Products with low inventory (stock <= 5 units)
  const lowStock = rows.filter((r) => {
    const s = r.stock ?? r.latest_stock;
    return s !== null && s !== undefined && Number(s) <= 5;
  }).length;

  const stats = [
    {
      label: "Tracked Products",
      value: total,
      sub: `${active} automated jobs`,
      icon: Activity,
      color: isDark ? "text-[#F59E0B]" : "text-[#D97706]",
      bg: isDark ? "bg-[#262014] border-[#F59E0B]/30" : "bg-[#F3F2EE] border-[#E4E2DE]",
    },
    {
      label: "Healthy Scrapes",
      value: Math.max(0, healthy),
      sub: active > 0 ? `${Math.round((Math.max(0, healthy) / active) * 100)}% uptime` : "100% uptime",
      icon: CheckCircle2,
      color: isDark ? "text-[#22C55E]" : "text-[#15803D]",
      bg: isDark ? "bg-[#16291E] border-[#22C55E]/30" : "bg-[#F0FDF4] border-[#15803D]/20",
    },
    {
      label: "Low Stock Alert",
      value: lowStock,
      sub: lowStock === 0 ? "Inventory healthy" : `${lowStock} items ≤ 5 units`,
      icon: AlertCircle,
      color: lowStock > 0
        ? isDark ? "text-[#EAB308]" : "text-[#CA8A04]"
        : isDark ? "text-[#22C55E]" : "text-[#15803D]",
      bg: lowStock > 0
        ? isDark ? "bg-[#2D2614] border-[#EAB308]/30" : "bg-[#FEFCE8] border-[#CA8A04]/30"
        : isDark ? "bg-[#141412] border-[#353530]" : "bg-[#F7F7F5] border-[#E4E2DE]",
    },
    {
      label: "Failing Scrapes",
      value: failing,
      sub: failing === 0 ? "Zero errors" : "Inspection needed",
      icon: AlertTriangle,
      color: failing > 0
        ? isDark ? "text-[#EF4444]" : "text-[#DC2626]"
        : isDark ? "text-[#6B6B68]" : "text-[#8A8A84]",
      bg: failing > 0
        ? isDark ? "bg-[#2D1616] border-[#EF4444]/30" : "bg-[#FDF2F2] border-[#DC2626]/20"
        : isDark ? "bg-[#141412] border-[#353530]" : "bg-[#F7F7F5] border-[#E4E2DE]",
    },
    {
      label: "Paused Jobs",
      value: paused,
      sub: "Manual standby",
      icon: Clock,
      color: isDark ? "text-[#A1A19A]" : "text-[#8A8A84]",
      bg: isDark ? "bg-[#141412] border-[#353530]" : "bg-[#F7F7F5] border-[#E4E2DE]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 font-sans">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`p-4 sm:p-5 rounded-md border flex flex-col justify-between transition-colors duration-150 ${
              isDark
                ? "border-[#353530] bg-[#181816]"
                : "border-[#E4E2DE] bg-[#FFFFFF]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10.5px] uppercase tracking-[0.15em] font-medium ${
                  isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                }`}
              >
                {item.label}
              </span>
              <div className={`w-7 h-7 rounded border flex items-center justify-center ${item.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${item.color} stroke-[2]`} />
              </div>
            </div>
            <div className="mt-3">
              <span
                className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight ${
                  isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                }`}
              >
                {item.value}
              </span>
              <span
                className={`text-xs block mt-1 ${
                  isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
                }`}
              >
                {item.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
