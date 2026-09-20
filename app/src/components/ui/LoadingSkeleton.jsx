import React from "react";
import { useTheme } from "../../context/ThemeContext";

export function LoadingSkeleton({ rows = 4, type = "card" }) {
  const { isDark } = useTheme();

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`rounded-md border p-3 pb-5 animate-pulse ${
              isDark
                ? "border-[#353530] bg-[#181816]"
                : "border-[#E4E2DE] bg-[#FFFFFF]"
            }`}
          >
            <div
              className={`aspect-[4/3] rounded mb-4 ${
                isDark ? "bg-[#11110F]" : "bg-[#F3F2EE]"
              }`}
            />
            <div className="px-1 space-y-2.5">
              <div
                className={`h-2.5 w-1/3 rounded ${
                  isDark ? "bg-[#353530]" : "bg-[#E4E2DE]"
                }`}
              />
              <div
                className={`h-4 w-4/5 rounded ${
                  isDark ? "bg-[#353530]" : "bg-[#E4E2DE]"
                }`}
              />
              <div
                className={`h-3 w-1/2 rounded ${
                  isDark ? "bg-[#262624]" : "bg-[#F3F2EE]"
                }`}
              />
              <div
                className={`h-4 w-full rounded mt-3 ${
                  isDark ? "bg-[#262624]" : "bg-[#F3F2EE]"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`divide-y ${isDark ? "divide-[#262624]" : "divide-[#E4E2DE]"}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className={`h-4 w-1/3 rounded ${isDark ? "bg-[#353530]" : "bg-[#E4E2DE]"}`} />
            <div className={`h-4 w-1/6 rounded ${isDark ? "bg-[#262624]" : "bg-[#F3F2EE]"}`} />
            <div className={`h-4 w-1/6 rounded ${isDark ? "bg-[#353530]" : "bg-[#E4E2DE]"}`} />
            <div className={`h-4 w-1/6 rounded ${isDark ? "bg-[#262624]" : "bg-[#F3F2EE]"}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 animate-pulse p-4 rounded-md border ${
        isDark
          ? "bg-[#181816] border-[#353530]"
          : "bg-[#FFFFFF] border-[#E4E2DE]"
      }`}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded w-full ${
            isDark ? "bg-[#262624]" : "bg-[#F3F2EE]"
          }`}
        />
      ))}
    </div>
  );
}
