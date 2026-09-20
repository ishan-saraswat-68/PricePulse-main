import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Activity } from "lucide-react";
import { AlertsPopover } from "../alerts/AlertsPopover";

export function Header() {
  const location = useLocation();

  const isDashboardActive =
    location.pathname === "/dashboard" || location.pathname.endsWith("/monitor");
  const isProductsActive =
    location.pathname.startsWith("/products") && !location.pathname.endsWith("/monitor");

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-10">
          <Link
            to="/products"
            className="flex items-center gap-2.5 group"
          >
            {/* Cyan Radar Pulse Indicator */}
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 text-white stroke-[2.2]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-white animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
                  PricePulse
                </span>
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-md border border-cyan-100">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium -mt-0.5 tracking-tight">
                Price & Stock Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation link to All Products */}
          <nav className="hidden sm:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
            <Link
              to="/products"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                isProductsActive
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />
              <span>Catalog Shelves</span>
            </Link>

            <Link
              to="/dashboard"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all flex items-center gap-1.5 ${
                isDashboardActive
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-600" />
              <span>Tracking Dashboard</span>
            </Link>
          </nav>
        </div>

        {/* Right side with Live Tracker status & Alerts */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Live Surveillance Indicator Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-cyan-50/80 border border-cyan-200/70 rounded-full text-[11px] font-medium text-cyan-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold font-mono tracking-tight">Surveillance Active</span>
          </div>

          {/* Price & Stock Alerts Bell Button with Popover */}
          <AlertsPopover />

          {/* Mobile direct link to dashboard only on very small screens */}
          <Link
            to="/dashboard"
            className="flex sm:hidden btn btn-primary !py-1.5 !px-3 !text-xs"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
