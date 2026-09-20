import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  useEffect(() => {
    // Ensure dark-theme class is completely removed
    document.documentElement.classList.remove("dark-theme");
    document.body.classList.remove("dark-theme");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Header />
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-[#e4e4e4] py-8 text-center text-xs text-[#767676] bg-white">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-serif">
          <span>INE Store — Everyday goods, honestly priced.</span>
          <span className="font-mono text-[11px] text-[#767676]">
            PricePulse Surveillance Engine
          </span>
        </div>
      </footer>
    </div>
  );
}
