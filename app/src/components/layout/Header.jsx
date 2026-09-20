import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Activity, Sun, Moon } from "lucide-react";
import { AlertsPopover } from "../alerts/AlertsPopover";
import { useTheme } from "../../context/ThemeContext";

export function Header() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const isDashboardActive =
    location.pathname === "/dashboard" || location.pathname.endsWith("/monitor");
  const isProductsActive =
    location.pathname.startsWith("/products") && !location.pathname.endsWith("/monitor");

  return (
    <header
      className={`border-b sticky top-0 z-50 transition-colors duration-150 ${
        isDark
          ? "bg-[#181816] border-[#353530] text-[#F5F5F0]"
          : "bg-[#FFFFFF] border-[#E4E2DE] text-[#171717]"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Nav */}
        <div className="flex items-center gap-6 sm:gap-10">
          <Link to="/products" className="flex items-center gap-3 group">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                isDark
                  ? "bg-[#262624] text-[#F59E0B] border border-[#353530]"
                  : "bg-[#F3F2EE] text-[#D97706] border border-[#E4E2DE]"
              }`}
            >
              <Activity className="w-4 h-4 stroke-[2]" />
            </div>

            <div className="flex flex-col">
              <span
                className={`font-semibold text-lg tracking-tight transition-colors ${
                  isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                }`}
              >
                PricePulse
              </span>
              <span className={`text-[11px] font-mono -mt-1 ${isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"}`}>
                Surveillance
              </span>
            </div>
          </Link>

          {/* Navigation with 4-6px subtle rounded border tabs */}
          <nav
            className={`hidden sm:flex items-center gap-1 p-1 rounded border text-xs font-medium ${
              isDark
                ? "bg-[#11110F] border-[#353530]"
                : "bg-[#F7F7F5] border-[#E4E2DE]"
            }`}
          >
            <Link
              to="/products"
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${
                isProductsActive
                  ? isDark
                    ? "bg-[#181816] text-[#F5F5F0] border border-[#353530]"
                    : "bg-[#FFFFFF] text-[#171717] border border-[#E4E2DE] shadow-2xs"
                  : isDark
                  ? "text-[#A1A19A] hover:text-[#F5F5F0]"
                  : "text-[#6B6B6B] hover:text-[#171717]"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>All products</span>
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${
                isDashboardActive
                  ? isDark
                    ? "bg-[#181816] text-[#F5F5F0] border border-[#353530]"
                    : "bg-[#FFFFFF] text-[#171717] border border-[#E4E2DE] shadow-2xs"
                  : isDark
                  ? "text-[#A1A19A] hover:text-[#F5F5F0]"
                  : "text-[#6B6B6B] hover:text-[#171717]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* Right side with Surveillance indicator, Alerts & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Active indicator */}
          <div
            className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] font-mono ${
              isDark
                ? "bg-[#11110F] border-[#353530] text-[#22C55E]"
                : "bg-[#F3F2EE] border-[#E4E2DE] text-[#15803D]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                isDark ? "bg-[#22C55E]" : "bg-[#15803D]"
              }`}
            />
            <span>SYSTEM ACTIVE</span>
          </div>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded border transition-colors cursor-pointer flex items-center justify-center ${
              isDark
                ? "bg-[#181816] border-[#353530] text-[#F59E0B] hover:bg-[#262624] hover:text-[#FFFFFF]"
                : "bg-[#FFFFFF] border-[#E4E2DE] text-[#D97706] hover:bg-[#F7F7F5] hover:text-[#B45309]"
            }`}
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Price & Stock Alerts */}
          <AlertsPopover isMonitoring={isDark} />

          <Link
            to="/dashboard"
            className="sm:hidden btn btn-primary !py-1 !px-2.5 !text-xs !rounded"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
