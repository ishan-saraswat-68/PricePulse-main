import React from "react";

export function LoadingSkeleton({ rows = 4, type = "card" }) {
  if (type === "card") {
    return (
      <div className="border-t border-l border-[#e4e4e4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="border-r border-b border-[#e4e4e4] p-4 animate-pulse">
            <div className="aspect-[4/3] bg-[#f6f6f6] mb-4" />
            <div className="h-2 w-1/3 bg-[#e4e4e4] mb-2" />
            <div className="h-4 w-3/4 bg-[#e4e4e4] mb-2" />
            <div className="h-2 w-1/2 bg-[#e4e4e4]" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="border border-[#e4e4e4] bg-white divide-y divide-[#e4e4e4]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex justify-between gap-4 animate-pulse">
            <div className="h-3 w-1/3 bg-[#e4e4e4]" />
            <div className="h-3 w-1/6 bg-[#e4e4e4]" />
            <div className="h-3 w-1/6 bg-[#e4e4e4]" />
            <div className="h-3 w-1/6 bg-[#e4e4e4]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 bg-[#e4e4e4] w-full" />
      ))}
    </div>
  );
}
