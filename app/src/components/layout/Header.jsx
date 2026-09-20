import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Grid } from "lucide-react";
import { AlertsPopover } from "../alerts/AlertsPopover";

export function Header() {
  const location = useLocation();

  const isDashboardActive =
    location.pathname === "/dashboard" || location.pathname.endsWith("/monitor");
  const isProductsActive =
    location.pathname.startsWith("/products") && !location.pathname.endsWith("/monitor");

  return (
    <header className="bg-white border-b border-[#111111] sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/products"
            className="flex items-center gap-2 group"
          >
            <span className="w-2.5 h-2.5 bg-[#111111] inline-block shrink-0"></span>
            <span className="font-serif font-bold text-xl tracking-tight text-[#111111]">
              INE Store
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#767676] border-l border-[#e4e4e4] pl-2 ml-1">
              Pulse
            </span>
          </Link>

          {/* Navigation link to All Products */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              to="/products"
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isProductsActive
                  ? "bg-[#111111] text-white"
                  : "text-[#111111] hover:bg-[#f6f6f6]"
              }`}
            >
              All Products
            </Link>
          </nav>
        </div>

        {/* Right side with Tracked Products, Alerts Bell, and Tagline (matching sketch) */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Tracked Products button */}
          <Link
            to="/dashboard"
            className={`px-3 sm:px-4 py-1.5 border border-[#111111] rounded-md text-xs font-serif font-bold tracking-normal transition-colors flex items-center gap-1.5 ${
              isDashboardActive
                ? "bg-[#111111] text-white"
                : "bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
            }`}
          >
            <span>Tracked products</span>
          </Link>

          {/* Price & Stock Alerts Bell Button with Popover */}
          <AlertsPopover />

          <span className="hidden md:block font-serif italic text-xs text-[#767676] pl-2 border-l border-[#e4e4e4]">
            Everyday goods, honestly priced.
          </span>

          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 border border-[#111111] text-[10px] font-mono uppercase">
            <span className="w-1.5 h-1.5 bg-[#111111] rounded-full animate-ping"></span>
            <span className="font-semibold">Live Tracker</span>
          </div>
        </div>
      </div>
    </header>
  );
}

