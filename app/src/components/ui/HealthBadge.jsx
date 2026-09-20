import React from "react";

export function HealthBadge({ status, size = "sm" }) {
  const normalized = (status || "").toLowerCase();

  const configs = {
    healthy: {
      className: "bg-[#111111] text-white border border-[#111111]",
      dot: "bg-white",
      label: "Healthy",
    },
    failing: {
      className: "bg-white text-[#111111] border border-[#111111] underline",
      dot: "bg-[#111111]",
      label: "Failing",
    },
    pending: {
      className: "bg-[#f6f6f6] text-[#767676] border border-[#e4e4e4]",
      dot: "bg-[#767676]",
      label: "Pending",
    },
    disabled: {
      className: "bg-white text-[#767676] border border-[#e4e4e4]",
      dot: "bg-[#cccccc]",
      label: "Paused",
    },
  };

  const config = configs[normalized] || configs.pending;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold ${config.className} ${
        isSm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
