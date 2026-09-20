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
import { TrendingDown, TrendingUp, RefreshCw } from "lucide-react";

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-white border border-[#111111] p-3 text-xs shadow-md">
      <div className="text-[#767676] mb-1 flex items-center justify-between gap-4 font-mono text-[11px]">
        <span>Quoted At:</span>
        <span className="text-[#111111] font-semibold">{formatDateTime(data.quoted_at)}</span>
      </div>
      <div className="text-[#767676] mb-1 flex items-center justify-between gap-4 font-mono text-[11px]">
        <span>Scraped At:</span>
        <span className="text-[#111111]">{formatTime(data.scraped_at)}</span>
      </div>
      <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-[#e4e4e4]">
        <span className="text-[#767676]">Price:</span>
        <span className="font-serif text-[#111111] font-bold text-sm">
          {formatINR(data.price)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 mt-0.5">
        <span className="text-[#767676]">Stock:</span>
        <span className="text-[#111111] font-mono">
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
    <div className="border border-[#111111] bg-white p-6">
      {/* Stat Bar Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 pb-4 border-b border-[#e4e4e4]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#767676] block">
            Latest Quoted Store Price
          </span>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
              {stats ? formatINR(stats.latest) : "No Quotes"}
            </span>
            {onRefreshPrice && (
              <button
                type="button"
                onClick={onRefreshPrice}
                disabled={refreshingPrice}
                className="p-1.5 border border-[#e4e4e4] bg-white hover:border-[#111111] text-[#767676] hover:text-[#111111] transition-all cursor-pointer shadow-2xs"
                title="Refresh Price Quote from Store"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin text-[#111111]" : ""}`} />
              </button>
            )}
            {stats && stats.change !== 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-[#111111] ml-1">
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

        <div className="flex items-center flex-wrap gap-2">
          {onRefreshPrice && (
            <button
              type="button"
              onClick={onRefreshPrice}
              disabled={refreshingPrice}
              className="btn btn-primary !py-1.5 !px-3 !text-[11px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Scrape new live price and plot directly on graph"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin" : ""}`} />
              <span>{refreshingPrice ? "Scraping..." : "Refresh Price Now"}</span>
            </button>
          )}

          {stats && (
            <>
              <div className="px-3 py-1.5 border border-[#e4e4e4] bg-[#fbfbfb] text-right">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#767676] block">
                  Lowest
                </span>
                <span className="font-serif font-bold text-xs text-[#111111]">
                  {formatINR(stats.min)}
                </span>
              </div>

              <div className="px-3 py-1.5 border border-[#e4e4e4] bg-[#fbfbfb] text-right">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#767676] block">
                  Highest
                </span>
                <span className="font-serif font-bold text-xs text-[#111111]">
                  {formatINR(stats.max)}
                </span>
              </div>

              <div className="px-3 py-1.5 border border-[#e4e4e4] bg-[#fbfbfb] text-right">
                <span className="text-[9px] uppercase font-bold tracking-wider text-[#767676] block">
                  Quotes
                </span>
                <span className="font-mono text-xs font-bold text-[#111111]">
                  {history.length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recharts LineChart */}
      {history.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-[#e4e4e4] bg-[#fbfbfb] text-[#767676] p-6 text-center">
          <p className="font-serif text-sm text-[#111111] font-bold">No price history points recorded yet.</p>
          <p className="text-xs text-[#767676] mt-1 font-serif">
            Scrape the live store quote to begin plotting telemetry on the graph.
          </p>
          {onRefreshPrice && (
            <button
              type="button"
              onClick={onRefreshPrice}
              disabled={refreshingPrice}
              className="btn btn-primary mt-4 !py-1.5 !px-4 !text-xs flex items-center gap-2 cursor-pointer shadow-2xs"
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
              <CartesianGrid strokeDasharray="2 2" stroke="#e4e4e4" vertical={false} />
              <XAxis
                dataKey="timeLabel"
                stroke="#767676"
                fontSize={10}
                fontFamily="monospace"
                tickLine={false}
                axisLine={{ stroke: "#e4e4e4" }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#767676"
                fontSize={10}
                fontFamily="Georgia, serif"
                tickLine={false}
                axisLine={{ stroke: "#e4e4e4" }}
                tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#111111"
                strokeWidth={2}
                dot={{ r: 3.5, fill: "#111111", stroke: "#ffffff", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#111111", stroke: "#000000", strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[#e4e4e4] flex items-center justify-between text-[11px] font-serif italic text-[#767676]">
        <span>X-Axis: Store Quoted Timestamp (quoted_at)</span>
        <span>Points represent verified price extractions</span>
      </div>
    </div>
  );
}
