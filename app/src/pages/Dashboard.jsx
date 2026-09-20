import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { TrackedProductRow } from "../components/dashboard/TrackedProductRow";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Plus, RefreshCw, Search, Filter, PackageSearch } from "lucide-react";

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
      {/* Intro Heading */}
      <div className="border-b border-[#111111] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            Tracking Dashboard
          </h1>
          <p className="text-sm text-[#767676] mt-1.5 font-serif">
            Real-time automated price checks and stock surveillance across catalog shelves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="btn btn-ghost"
            title="Refresh Table"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track New Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats rows={rows} />

      {/* Main Table Container */}
      <div className="border border-[#111111] bg-white">
        {/* Table Search & Filter Toolbar */}
        <div className="p-3 border-b border-[#e4e4e4] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fbfbfb]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#767676] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tracked products..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#e4e4e4] text-xs text-[#111111] placeholder-[#767676] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#767676] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2 bg-white border border-[#e4e4e4] text-xs font-mono uppercase text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
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
          <div className="p-8">
            <EmptyState
              icon={PackageSearch}
              title="No products currently tracked"
              description="Start monitoring prices and stock levels by selecting a product from the INE Store shelves."
              action={
                <Link
                  to="/products"
                  className="btn btn-primary mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Browse Products</span>
                </Link>
              }
            />
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Search}
              title="No matching tracked products"
              description="Try adjusting your filter query."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#111111] bg-[#f6f6f6] text-[10px] uppercase font-bold tracking-[0.14em] text-[#767676]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Health</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Interval</th>
                  <th className="py-3 px-4">Last Scrape</th>
                  <th className="py-3 px-4">Next Run</th>
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
