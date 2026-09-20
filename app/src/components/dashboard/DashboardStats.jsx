import React from "react";
import { Activity, Check, AlertTriangle, Clock } from "lucide-react";

export function DashboardStats({ rows = [] }) {
  const total = rows.length;
  const active = rows.filter(
    (r) => r.is_active !== false && r.status !== "paused" && r.status !== "disabled"
  ).length;
  const failing = rows.filter(
    (r) => r.last_scrape_status === "failed" || (r.consecutive_failures || 0) > 0
  ).length;
  const healthy = active - failing;
  const paused = total - active;

  const stats = [
    {
      label: "Tracked Products",
      value: total,
      sub: `${active} active jobs`,
      icon: Activity,
    },
    {
      label: "Healthy Scrapes",
      value: Math.max(0, healthy),
      sub: active > 0 ? `${Math.round((Math.max(0, healthy) / active) * 100)}% uptime` : "100% uptime",
      icon: Check,
    },
    {
      label: "Failing Scrapes",
      value: failing,
      sub: failing === 0 ? "Zero errors" : "Attention required",
      icon: AlertTriangle,
    },
    {
      label: "Paused Jobs",
      value: paused,
      sub: "Manual standby",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="p-5 border border-[#e4e4e4] bg-white flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#767676]">
                {item.label}
              </span>
              <Icon className="w-4 h-4 text-[#111111] stroke-[1.5]" />
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
                {item.value}
              </span>
              <span className="text-xs text-[#767676] font-serif italic block mt-1">
                {item.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
