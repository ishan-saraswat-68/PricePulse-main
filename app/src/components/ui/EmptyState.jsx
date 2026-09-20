import React from "react";
import { PackageOpen } from "lucide-react";

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-[#e4e4e4] bg-[#fbfbfb]">
      <div className="p-3 mb-3 border border-[#111111] bg-white">
        <Icon className="w-6 h-6 text-[#111111]" />
      </div>
      <h3 className="font-serif text-lg font-bold text-[#111111] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-[#767676] max-w-sm mb-6 leading-relaxed font-serif">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
