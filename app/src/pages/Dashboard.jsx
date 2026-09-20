import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { TrackedProductRow } from "../components/dashboard/TrackedProductRow";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useTheme } from "../context/ThemeContext";
import { Plus, RefreshCw, Search, Filter, PackageSearch } from "lucide-react";

export function Dashboard() {
  const { isDark } = useTheme();
  const { rows, loading, error, refresh } = useDashboard(15_000);
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
    <div className="space-y-8 font-sans">
      {/* Editorial Header */}
      <div
        className={`border-b pb-6 sm:pb-8 transition-colors duration-150 ${
          isDark ? "border-[#353530]" : "border-[#D8D6D0]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1
              className={`font-serif text-[42px] sm:text-[48px] font-semibold tracking-tight leading-none transition-colors duration-150 ${
                isDark ? "text-[#F5F5F0]" : "text-[#171717]"
              }`}
            >
              Surveillance Dashboard
            </h1>
            <p
              className={`font-sans text-[14px] sm:text-[16px] mt-3 max-w-xl leading-normal transition-colors duration-150 ${
                isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
              }`}
            >
              Continuous background price & stock surveillance across active catalog items.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={refresh}
              className="btn btn-secondary !py-2 !px-3.5 !text-xs !rounded-md cursor-pointer"
              title="Refresh Table"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
                }`}
              />
              <span>Refresh</span>
            </button>

            <Link
              to="/products"
              className="btn btn-primary !py-2 !px-4 !text-xs !rounded-md"
            >
              <Plus className="w-4 h-4" />
              <span>Track New Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats rows={rows} />

      {/* Main Table Container */}
      <div
        className={`rounded-md border overflow-hidden transition-colors duration-150 ${
          isDark
            ? "border-[#353530] bg-[#181816]"
            : "border-[#E4E2DE] bg-[#FFFFFF]"
        }`}
      >
        {/* Table Search & Filter Toolbar */}
        <div
          className={`p-3.5 sm:p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark
              ? "border-[#353530] bg-[#141412]"
              : "border-[#E4E2DE] bg-[#F7F7F5]"
          }`}
        >
          <div className="relative w-full sm:w-80">
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
              }`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tracked products..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-md text-xs transition-colors focus:outline-none focus:ring-1 ${
                isDark
                  ? "bg-[#181816] border border-[#353530] text-[#F5F5F0] placeholder-[#6B6B68] focus:border-[#F59E0B] focus:ring-[#F59E0B]"
                  : "bg-[#FFFFFF] border border-[#E4E2DE] text-[#171717] placeholder-[#8A8A84] focus:border-[#D97706] focus:ring-[#D97706]"
              }`}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter
              className={`w-3.5 h-3.5 shrink-0 ${
                isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
              }`}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`py-1.5 px-3 rounded-md text-xs font-medium focus:outline-none cursor-pointer transition-colors ${
                isDark
                  ? "bg-[#181816] border border-[#353530] text-[#F5F5F0] focus:border-[#F59E0B]"
                  : "bg-[#FFFFFF] border border-[#E4E2DE] text-[#171717] focus:border-[#D97706]"
              }`}
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
                  className="btn btn-primary mt-3 !rounded-md"
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
              description={`No products match "${search}". Try clearing search or selecting a different status filter.`}
              action={
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="btn btn-secondary mt-3 !rounded-md cursor-pointer"
                >
                  Clear Filters
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr
                  className={`border-b text-[10px] uppercase tracking-[0.15em] font-medium transition-colors ${
                    isDark
                      ? "border-[#353530] bg-[#141412] text-[#A1A19A]"
                      : "border-[#E4E2DE] bg-[#F7F7F5] text-[#8A8A84]"
                  }`}
                >
                  <th className="py-3 px-4">Product Identity</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4">Latest Price</th>
                  <th className="py-3 px-4">Stock Level</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Last Scrape</th>
                  <th className="py-3 px-4">Next Run</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-[#262624]" : "divide-[#E4E2DE]"
                }`}
              >
                {filteredRows.map((row) => (
                  <TrackedProductRow
                    key={row.tracked_id || row.product_id}
                    row={row}
                    onRefresh={refresh}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        {filteredRows.length > 0 && (
          <div
            className={`p-3 border-t flex items-center justify-between text-xs font-mono text-[11px] transition-colors ${
              isDark
                ? "bg-[#141412] border-[#353530] text-[#A1A19A]"
                : "bg-[#F7F7F5] border-[#E4E2DE] text-[#8A8A84]"
            }`}
          >
            <span>
              Showing {filteredRows.length} of {rows.length} tracked items
            </span>
            <span>Continuous 30s background loop</span>
          </div>
        )}
      </div>
    </div>
  );
}
