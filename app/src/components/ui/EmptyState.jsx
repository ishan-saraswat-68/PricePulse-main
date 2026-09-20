import React from "react";
import { PackageOpen } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}) {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center border rounded-md font-sans ${
        isDark
          ? "border-[#353530] bg-[#181816]"
          : "border-[#E4E2DE] bg-[#FFFFFF]"
      }`}
    >
      <div
        className={`p-3 mb-3 rounded border ${
          isDark
            ? "border-[#353530] bg-[#11110F] text-[#A1A19A]"
            : "border-[#E4E2DE] bg-[#F7F7F5] text-[#6B6B6B]"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3
        className={`font-semibold text-sm mb-1 ${
          isDark ? "text-[#F5F5F0]" : "text-[#171717]"
        }`}
      >
        {title}
      </h3>
      {description && (
        <p
          className={`text-xs max-w-sm mb-4 leading-relaxed ${
            isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
          }`}
        >
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
