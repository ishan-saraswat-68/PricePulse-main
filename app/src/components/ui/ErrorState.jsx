import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ErrorState({ error, onRetry }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`border p-5 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs ${
        isDark
          ? "border-[#EF4444]/30 bg-[#2D1616] text-[#EF4444]"
          : "border-[#DC2626]/25 bg-[#FDF2F2] text-[#DC2626]"
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className={`w-4 h-4 shrink-0 mt-0.5 ${
            isDark ? "text-[#EF4444]" : "text-[#DC2626]"
          }`}
        />
        <div>
          <h4 className="font-semibold text-xs">
            Error Retrieving Data
          </h4>
          <p
            className={`text-[11px] font-mono mt-0.5 ${
              isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
            }`}
          >
            {error || "An unexpected error occurred."}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary !py-1.5 !px-3 !text-xs shrink-0 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
