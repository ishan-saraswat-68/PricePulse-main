import React from "react";

export function HealthBadge({ status, size = "sm" }) {
  const normalized = (status || "").toLowerCase();

  const configs = {
    healthy: {
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
      dot: "bg-emerald-500",
      label: "Healthy",
    },
    failing: {
      className: "bg-rose-50 text-rose-700 border border-rose-200/80",
      dot: "bg-rose-500",
      label: "Failing",
    },
    pending: {
      className: "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
      dot: "bg-cyan-500",
      label: "Active",
    },
    disabled: {
      className: "bg-slate-100 text-slate-500 border border-slate-200",
      dot: "bg-slate-400",
      label: "Paused",
    },
  };

  const config = configs[normalized] || configs.pending;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-heading font-semibold rounded-full ${config.className} ${
        isSm ? "px-2.5 py-0.5 text-[10.5px]" : "px-3 py-1 text-xs"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
