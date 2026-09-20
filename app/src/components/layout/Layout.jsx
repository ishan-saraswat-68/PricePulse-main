import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "./Header";
import { Activity } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function Layout() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-150 ${
        isDark ? "bg-[#11110F] text-[#F5F5F0]" : "bg-[#F7F7F5] text-[#171717]"
      }`}
    >
      <Header />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>

      <footer
        className={`border-t py-8 text-xs transition-colors duration-150 mt-auto ${
          isDark
            ? "bg-[#181816] border-[#353530] text-[#A1A19A]"
            : "bg-[#FFFFFF] border-[#E4E2DE] text-[#6B6B6B]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center ${
                isDark ? "bg-[#262624] text-[#F59E0B]" : "bg-[#F3F2EE] text-[#D97706]"
              }`}
            >
              <Activity className="w-3 h-3" />
            </div>
            <span
              className={`font-medium ${
                isDark ? "text-[#F5F5F0]" : "text-[#171717]"
              }`}
            >
              PricePulse
            </span>
            <span className={isDark ? "text-[#484842]" : "text-[#8A8A84]"}>·</span>
            <span className={`font-mono text-[11px] ${isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"}`}>
              Autonomous price & stock surveillance
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link
              to="/products"
              className={`transition-colors ${
                isDark
                  ? "hover:text-[#F59E0B]"
                  : "hover:text-[#D97706]"
              }`}
            >
              All products
            </Link>
            <Link
              to="/dashboard"
              className={`transition-colors ${
                isDark
                  ? "hover:text-[#F59E0B]"
                  : "hover:text-[#D97706]"
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
