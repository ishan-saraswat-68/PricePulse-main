import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { TrackedProductRow } from "../components/dashboard/TrackedProductRow";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Plus, RefreshCw, Search, Filter, PackageSearch, Activity } from "lucide-react";

export function Dashboard() {
  const { rows, loading, error, refresh } = useDashboard(60_000);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const isActive = row.is_active !== false && row.status !== "paused" && row.status !== "disabled";
      const isFailing = row.last_scrape_status === "failed" || (row.consecutive_failures || 0) > 0;

      if (statusFilter === "active" && !isActive) return false;
      if (statusFilter === "paused" && isActive) return false;
      if (statusFilter === "failing" && !isFailing) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const name = (row.name || row.product_name || "").toLowerCase();
      const brand = (row.brand || "").toLowerCase();
      const cat = (row.category || "").toLowerCase();
      const sku = (row.sku || "").toLowerCase();
      return (
        name.includes(q) ||
        brand.includes(q) ||
        cat.includes(q) ||
        sku.includes(q)
      );
    });
  }, [rows, search, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Intro Heading Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/70">
            <Activity className="w-3.5 h-3.5 text-cyan-600" />
            <span>Telemetry & Autonomous Scraping Engine</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Surveillance Dashboard
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Continuous background surveillance running every 30s for 15m/60m catalog updates and price alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="btn btn-ghost"
            title="Refresh Table"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Refresh</span>
          </button>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats rows={rows} />

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Table Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracked products..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-heading font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Surveillance Only</option>
              <option value="paused">Paused Only</option>
              <option value="failing">Failing Only</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading && rows.length === 0 ? (
          <div className="p-6">
            <LoadingSkeleton rows={5} type="table" />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState error={error} onRetry={refresh} />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-10">
            <EmptyState
              icon={PackageSearch}
              title="No products currently tracked"
              description="Start monitoring prices and stock levels by selecting a product from the catalog shelves."
              action={
                <Link
                  to="/products"
                  className="btn btn-primary mt-3"
                >
                  <Plus className="w-4 h-4" />
                  <span>Browse Catalog</span>
                </Link>
              }
            />
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="p-10">
            <EmptyState
              icon={Search}
              title="No matching tracked products"
              description="Try adjusting your search or status filter query."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[10.5px] uppercase font-heading font-bold tracking-wider text-slate-500">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Surveillance Health</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Interval</th>
                  <th className="py-3 px-4">Last Scraped</th>
                  <th className="py-3 px-4">Next Scrape</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <TrackedProductRow
                    key={row.product_id}
                    row={row}
                    onRefresh={refresh}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
