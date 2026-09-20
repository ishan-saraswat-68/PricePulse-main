import React from "react";

export function StockBadge({ stock }) {
  if (stock === null || stock === undefined) {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100/80 text-slate-500 px-2.5 py-0.5 text-[10.5px] font-heading font-medium">
        Unknown
      </span>
    );
  }

  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-rose-200/80 bg-rose-50 text-rose-700 px-2.5 py-0.5 text-[10.5px] font-heading font-semibold">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50 text-amber-800 px-2.5 py-0.5 text-[10.5px] font-heading font-semibold">
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-cyan-200/80 bg-cyan-50 text-cyan-800 px-2.5 py-0.5 text-[10.5px] font-heading font-semibold">
      In Stock ({stock})
    </span>
  );
}
