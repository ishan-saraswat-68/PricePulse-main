import React from "react";
import { Activity, CheckCircle2, AlertTriangle, Clock, AlertCircle } from "lucide-react";

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
      color: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-100",
    },
    {
      label: "Healthy Scrapes",
      value: Math.max(0, healthy),
      sub: active > 0 ? `${Math.round((Math.max(0, healthy) / active) * 100)}% uptime` : "100% uptime",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Low Stock Alert",
      value: lowStock,
      sub: lowStock === 0 ? "Inventory healthy" : `${lowStock} items ≤ 5 units`,
      icon: AlertCircle,
      color: lowStock > 0 ? "text-amber-600" : "text-emerald-600",
      bg: lowStock > 0 ? "bg-amber-50 border-amber-200/80" : "bg-slate-50 border-slate-100",
    },
    {
      label: "Failing Scrapes",
      value: failing,
      sub: failing === 0 ? "Zero errors" : "Inspection needed",
      icon: AlertTriangle,
      color: failing > 0 ? "text-rose-600" : "text-slate-400",
      bg: failing > 0 ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100",
    },
    {
      label: "Paused Jobs",
      value: paused,
      sub: "Manual standby",
      icon: Clock,
      color: "text-slate-500",
      bg: "bg-slate-50 border-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xs shadow-xs hover:shadow-md hover:border-cyan-200/60 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-heading font-bold uppercase tracking-wider text-slate-500">
                {item.label}
              </span>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${item.bg}`}>
                <Icon className={`w-4 h-4 ${item.color} stroke-[2]`} />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                {item.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
