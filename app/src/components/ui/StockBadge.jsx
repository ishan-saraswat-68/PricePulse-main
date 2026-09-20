import React from "react";

export function StockBadge({ stock }) {
  if (stock === null || stock === undefined) {
    return (
      <span className="inline-block border border-[#e4e4e4] bg-[#f6f6f6] text-[#767676] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">
        Unknown
      </span>
    );
  }

  if (stock === 0) {
    return (
      <span className="inline-block border border-[#111111] bg-white text-[#111111] line-through px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-block border border-[#111111] bg-[#f6f6f6] text-[#111111] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className="inline-block border border-[#111111] bg-[#111111] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">
      In Stock ({stock})
    </span>
  );
}
