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
import { useTheme } from "../../context/ThemeContext";

function CustomTooltip({ active, payload, isDark }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div
      className={`rounded p-3 text-xs shadow-xl min-w-[190px] font-mono border ${
        isDark
          ? "bg-[#181816] border-[#353530] text-[#F5F5F0]"
          : "bg-[#FFFFFF] border-[#E4E2DE] text-[#171717]"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 font-semibold text-[11px] mb-2 pb-1.5 border-b ${
          isDark
            ? "text-[#F59E0B] border-[#353530]"
            : "text-[#D97706] border-[#E4E2DE]"
        }`}
      >
        <Activity className="w-3.5 h-3.5" />
        <span>Telemetry Point</span>
      </div>
      <div
        className={`space-y-1 text-[11px] ${
          isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
        }`}
      >
        <div className="flex items-center justify-between">
          <span>Quoted:</span>
          <span className={isDark ? "text-[#F5F5F0]" : "text-[#171717]"}>
            {formatDateTime(data.quoted_at)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Scraped:</span>
          <span className={isDark ? "text-[#F5F5F0]" : "text-[#171717]"}>
            {formatTime(data.scraped_at)}
          </span>
        </div>
      </div>
      <div
        className={`flex items-center justify-between gap-4 pt-2 mt-2 border-t ${
          isDark ? "border-[#353530]" : "border-[#E4E2DE]"
        }`}
      >
        <span className={isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"}>
          Price:
        </span>
        <span
          className={`font-sans font-bold text-sm ${
            isDark ? "text-[#F5F5F0]" : "text-[#171717]"
          }`}
        >
          {formatINR(data.price)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 mt-1">
        <span className={isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"}>
          Stock:
        </span>
        <span
          className={`font-semibold ${
            isDark ? "text-[#F59E0B]" : "text-[#D97706]"
          }`}
        >
          {data.stock !== null && data.stock !== undefined ? `${data.stock} pcs` : "N/A"}
        </span>
      </div>
    </div>
  );
}

export function PriceChart({ history = [], onRefreshPrice = null, refreshingPrice = false }) {
  const { isDark } = useTheme();

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
    <div
      className={`rounded-md border p-5 sm:p-6 font-sans transition-colors duration-150 ${
        isDark
          ? "border-[#353530] bg-[#181816]"
          : "border-[#E4E2DE] bg-[#FFFFFF]"
      }`}
    >
      {/* Stat Bar Header */}
      <div
        className={`flex flex-wrap items-end justify-between gap-4 mb-6 pb-4 border-b ${
          isDark ? "border-[#353530]" : "border-[#E4E2DE]"
        }`}
      >
        <div>
          <span
            className={`text-[10.5px] font-mono uppercase tracking-wider block mb-1 ${
              isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
            }`}
          >
            Latest Quoted Price
          </span>
          <div className="flex items-center gap-3">
            <span
              className={`font-sans text-3xl sm:text-4xl font-bold tracking-tight ${
                isDark ? "text-[#F5F5F0]" : "text-[#171717]"
              }`}
            >
              {stats ? formatINR(stats.latest) : "No Quotes"}
            </span>

            {onRefreshPrice && (
              <button
                type="button"
                onClick={onRefreshPrice}
                disabled={refreshingPrice}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  isDark
                    ? "border-[#353530] bg-[#11110F] text-[#A1A19A] hover:text-[#F59E0B] hover:border-[#484842]"
                    : "border-[#E4E2DE] bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#D97706] hover:border-[#D8D6D0]"
                }`}
                title="Refresh Price Quote from Store"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    refreshingPrice
                      ? isDark
                        ? "animate-spin text-[#F59E0B]"
                        : "animate-spin text-[#D97706]"
                      : ""
                  }`}
                />
              </button>
            )}

            {stats && stats.change !== 0 && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                  stats.change < 0
                    ? isDark
                      ? "bg-[#16291E] text-[#22C55E] border-[#22C55E]/30"
                      : "bg-[#F0FDF4] text-[#15803D] border-[#15803D]/20"
                    : isDark
                    ? "bg-[#2D1616] text-[#EF4444] border-[#EF4444]/30"
                    : "bg-[#FDF2F2] text-[#DC2626] border-[#DC2626]/20"
                }`}
              >
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
              className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors ${
                isDark
                  ? "border-[#F59E0B] bg-[#F59E0B] text-[#11110F] hover:bg-[#D97706] hover:border-[#D97706] hover:text-white"
                  : "border-[#D97706] bg-[#D97706] text-white hover:bg-[#B45309] hover:border-[#B45309]"
              }`}
              title="Scrape live store price"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingPrice ? "animate-spin" : ""}`} />
              <span>{refreshingPrice ? "Scraping..." : "Refresh Price Now"}</span>
            </button>
          )}

          {stats && (
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1.5 rounded border text-right ${
                  isDark
                    ? "border-[#353530] bg-[#11110F]"
                    : "border-[#E4E2DE] bg-[#F7F7F5]"
                }`}
              >
                <span
                  className={`text-[9.5px] uppercase font-mono tracking-wider block ${
                    isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                  }`}
                >
                  Lowest
                </span>
                <span
                  className={`font-mono font-bold text-xs ${
                    isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  {formatINR(stats.min)}
                </span>
              </div>

              <div
                className={`px-3 py-1.5 rounded border text-right ${
                  isDark
                    ? "border-[#353530] bg-[#11110F]"
                    : "border-[#E4E2DE] bg-[#F7F7F5]"
                }`}
              >
                <span
                  className={`text-[9.5px] uppercase font-mono tracking-wider block ${
                    isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                  }`}
                >
                  Highest
                </span>
                <span
                  className={`font-mono font-bold text-xs ${
                    isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  {formatINR(stats.max)}
                </span>
              </div>

              <div
                className={`px-3 py-1.5 rounded border text-right ${
                  isDark
                    ? "border-[#353530] bg-[#11110F]"
                    : "border-[#E4E2DE] bg-[#F7F7F5]"
                }`}
              >
                <span
                  className={`text-[9.5px] uppercase font-mono tracking-wider block ${
                    isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                  }`}
                >
                  Quotes
                </span>
                <span
                  className={`font-mono text-xs font-bold ${
                    isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                  }`}
                >
                  {history.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recharts LineChart */}
      {history.length === 0 ? (
        <div
          className={`h-64 flex flex-col items-center justify-center rounded border border-dashed p-6 text-center ${
            isDark
              ? "border-[#353530] bg-[#11110F] text-[#A1A19A]"
              : "border-[#E4E2DE] bg-[#F7F7F5] text-[#6B6B6B]"
          }`}
        >
          <p
            className={`font-sans text-sm font-semibold ${
              isDark ? "text-[#F5F5F0]" : "text-[#171717]"
            }`}
          >
            No price history points recorded yet.
          </p>
          <p
            className={`text-xs mt-1 max-w-sm ${
              isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
            }`}
          >
            Scrape the live store quote to begin plotting telemetry on this product's price history chart.
          </p>
          {onRefreshPrice && (
            <button
              type="button"
              onClick={onRefreshPrice}
              disabled={refreshingPrice}
              className={`mt-4 px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                isDark
                  ? "border-[#F59E0B] bg-[#F59E0B] text-[#11110F] hover:bg-[#D97706]"
                  : "border-[#D97706] bg-[#D97706] text-white hover:bg-[#B45309]"
              }`}
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
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#262624" : "#E4E2DE"}
                vertical={false}
              />
              <XAxis
                dataKey="timeLabel"
                stroke={isDark ? "#6B6B68" : "#8A8A84"}
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
                tickLine={false}
                axisLine={{ stroke: isDark ? "#353530" : "#E4E2DE" }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke={isDark ? "#6B6B68" : "#8A8A84"}
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
                tickLine={false}
                axisLine={{ stroke: isDark ? "#353530" : "#E4E2DE" }}
                tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
              />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isDark ? "#F59E0B" : "#D97706"}
                strokeWidth={2}
                dot={{
                  r: 3.5,
                  fill: isDark ? "#F59E0B" : "#D97706",
                  stroke: isDark ? "#181816" : "#FFFFFF",
                  strokeWidth: 1.5,
                }}
                activeDot={{
                  r: 5.5,
                  fill: isDark ? "#F59E0B" : "#D97706",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div
        className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
          isDark
            ? "border-[#353530] text-[#A1A19A]"
            : "border-[#E4E2DE] text-[#8A8A84]"
        }`}
      >
        <span>X-Axis: Store Quoted Timestamp</span>
        <span className={isDark ? "text-[#F59E0B]" : "text-[#D97706]"}>
          ● Live surveillance points
        </span>
      </div>
    </div>
  );
}
