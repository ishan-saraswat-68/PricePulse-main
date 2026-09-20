import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatINR, formatDateTime, formatTime } from "../../services/api";
import { TrendingDown, TrendingUp, RefreshCw, Activity } from "lucide-react";

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs shadow-xl min-w-[200px]">
      <div className="flex items-center gap-1.5 text-cyan-700 font-heading font-semibold text-[11px] mb-2 pb-1.5 border-b border-slate-100">
        <Activity className="w-3.5 h-3.5" />
        <span>Price Telemetry Point</span>
      </div>
      <div className="space-y-1 text-slate-500 font-mono text-[11px]">
        <div className="flex items-center justify-between">
          <span>Quoted:</span>
          <span className="text-slate-800 font-medium">{formatDateTime(data.quoted_at)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Scraped:</span>
          <span className="text-slate-800">{formatTime(data.scraped_at)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-slate-100">
        <span className="text-slate-500 font-heading">Price:</span>
        <span className="font-heading text-slate-900 font-extrabold text-base">
          {formatINR(data.price)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 mt-1">
        <span className="text-slate-500 font-heading">Stock:</span>
        <span className="text-cyan-700 font-mono font-semibold">
          {data.stock !== null && data.stock !== undefined ? `${data.stock} units` : "N/A"}
        </span>
      </div>
    </div>
  );
}

export function PriceChart({ history = [], onRefreshPrice = null, refreshingPrice = false }) {
  const stats = useMemo(() => {
    if (!history.length) return null;
    const prices = history.map((h) => Number(h.price)).filter((p) => !isNaN(p));
    if (!prices.length) return null;

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const latest = prices[prices.length - 1];
    const first = prices[0];
    const change = latest - first;
    const percentChange = first > 0 ? ((change / first) * 100).toFixed(1) : 0;

    return { min, max, latest, change, percentChange };
  }, [history]);

  const chartData = history.map((item) => ({
    ...item,
    price: Number(item.price),
    timeLabel: formatTime(item.quoted_at),
  }));

  const minPrice = stats ? Math.floor(stats.min * 0.95) : 0;
  const maxPrice = stats ? Math.ceil(stats.max * 1.05) : 1000;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
      {/* Stat Bar Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Latest Quoted Store Price
          </span>
          <div className="flex items-center gap-3">
            <span className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
              {stats ? formatINR(stats.latest) : "No Quotes"}
            </span>
            {onRefreshPrice && (
              <button
                type="button"
                onClick={onRefreshPrice}
                disabled={refreshingPrice}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 text-slate-500 hover:text-cyan-600 transition-all cursor-pointer shadow-2xs"
                title="Refresh Price Quote from Store"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin text-cyan-600" : ""}`} />
              </button>
            )}
            {stats && stats.change !== 0 && (
              <span className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                stats.change < 0
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                  : "bg-rose-50 text-rose-700 border border-rose-200/80"
              }`}>
                {stats.change < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                {stats.percentChange}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {onRefreshPrice && (
            <button
              type="button"
              onClick={onRefreshPrice}
              disabled={refreshingPrice}
              className="btn btn-primary !py-2 !px-3.5 !text-xs flex items-center gap-2 cursor-pointer"
              title="Scrape new live price and plot directly on graph"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin" : ""}`} />
              <span>{refreshingPrice ? "Scraping..." : "Refresh Price Now"}</span>
            </button>
          )}

          {stats && (
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl border border-slate-100 bg-slate-50 text-right">
                <span className="text-[9.5px] uppercase font-heading font-bold tracking-wider text-slate-400 block">
                  Lowest
                </span>
                <span className="font-heading font-bold text-xs text-slate-800">
                  {formatINR(stats.min)}
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl border border-slate-100 bg-slate-50 text-right">
                <span className="text-[9.5px] uppercase font-heading font-bold tracking-wider text-slate-400 block">
                  Highest
                </span>
                <span className="font-heading font-bold text-xs text-slate-800">
                  {formatINR(stats.max)}
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl border border-slate-100 bg-slate-50 text-right">
                <span className="text-[9.5px] uppercase font-heading font-bold tracking-wider text-slate-400 block">
                  Quotes
                </span>
                <span className="font-mono text-xs font-bold text-cyan-700">
                  {history.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recharts LineChart */}
      {history.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-500 p-6 text-center">
          <p className="font-heading text-sm text-slate-800 font-bold">No price history points recorded yet.</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Scrape the live store quote to begin plotting telemetry on this product's price history chart.
          </p>
          {onRefreshPrice && (
            <button
              type="button"
              onClick={onRefreshPrice}
              disabled={refreshingPrice}
              className="btn btn-primary mt-4 !py-2 !px-4 !text-xs flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin" : ""}`} />
              <span>{refreshingPrice ? "Scraping Store..." : "Fetch First Price Quote"}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="timeLabel"
                stroke="#94a3b8"
                fontSize={10}
                fontFamily="monospace"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#94a3b8"
                fontSize={10}
                fontFamily="Inter, sans-serif"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#0891b2"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#0891b2", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6.5, fill: "#06b6d4", stroke: "#0891b2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>X-Axis: Store Quoted Timestamp (quoted_at)</span>
        <span className="text-cyan-700">● Live surveillance points</span>
      </div>
    </div>
  );
}
