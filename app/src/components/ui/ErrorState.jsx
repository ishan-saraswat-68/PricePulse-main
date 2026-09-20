import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";

export function ErrorState({ error, onRetry }) {
  return (
    <div className="border border-[#111111] bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
            Error Retrieving Data
          </h4>
          <p className="text-xs text-[#767676] font-mono mt-1">
            {error || "An unexpected error occurred."}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-ghost shrink-0"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
