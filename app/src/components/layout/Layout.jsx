import React, { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "./Header";
import { Activity } from "lucide-react";

export function Layout() {
  useEffect(() => {
    // Ensure dark-theme class is completely removed
    document.documentElement.classList.remove("dark-theme");
    document.body.classList.remove("dark-theme");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans antialiased relative selection:bg-cyan-500 selection:text-white">
      {/* Ambient Blurred Glowing Circles in Background (Glassmorphic Backdrop) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        {/* Top-left Electric Cyan Glow Orb */}
        <div className="absolute -top-32 -left-32 w-[540px] h-[540px] rounded-full bg-cyan-400/14 blur-[130px]" />

        {/* Top-right Sky Blue Blur Orb */}
        <div className="absolute top-[8%] -right-36 w-[620px] h-[620px] rounded-full bg-sky-400/12 blur-[140px]" />

        {/* Mid-screen Soft Teal Glow Orb */}
        <div className="absolute top-[42%] -left-40 w-[500px] h-[500px] rounded-full bg-teal-300/10 blur-[130px]" />

        {/* Bottom-right Cyan Accent Orb */}
        <div className="absolute -bottom-28 right-[10%] w-[580px] h-[580px] rounded-full bg-cyan-300/12 blur-[130px]" />

        {/* Subtle Tech Dot Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.025]" />
      </div>

      <Header />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/80 py-8 bg-white/75 backdrop-blur-md text-xs text-slate-500 mt-auto relative z-0">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-cyan-500/10 flex items-center justify-center">
              <Activity className="w-3 h-3 text-cyan-600" />
            </div>
            <span className="font-heading font-semibold text-slate-700">
              PricePulse Intelligence
            </span>
            <span className="text-slate-300">·</span>
            <span>Real-time price & stock telemetry engine</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-500">
            <Link to="/products" className="hover:text-cyan-600 transition-colors">
              Catalog Shelves
            </Link>
            <Link to="/dashboard" className="hover:text-cyan-600 transition-colors">
              Surveillance Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
