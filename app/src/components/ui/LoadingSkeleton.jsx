import React from "react";

export function LoadingSkeleton({ rows = 4, type = "card" }) {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-3 pb-5 shadow-xs animate-pulse">
            <div className="aspect-[4/3] rounded-xl bg-slate-100 mb-4" />
            <div className="px-2 space-y-2.5">
              <div className="h-2.5 w-1/3 bg-slate-200 rounded-full" />
              <div className="h-4 w-4/5 bg-slate-200 rounded-md" />
              <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
              <div className="h-4 w-full bg-slate-50 rounded-md mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="h-4 w-1/3 bg-slate-200 rounded-md" />
            <div className="h-4 w-1/6 bg-slate-100 rounded-full" />
            <div className="h-4 w-1/6 bg-slate-200 rounded-md" />
            <div className="h-4 w-1/6 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse p-4 bg-white rounded-2xl border border-slate-200">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3.5 bg-slate-200 rounded-full w-full" />
      ))}
    </div>
  );
}
