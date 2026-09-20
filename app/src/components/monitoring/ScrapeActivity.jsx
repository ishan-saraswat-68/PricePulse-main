import React from "react";
import { formatDateTime, formatTime, formatINR } from "../../services/api";
import { Terminal, Check, X, ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ScrapeActivity({ logs = [] }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-md border p-5 sm:p-6 font-sans transition-colors duration-150 ${
        isDark
          ? "border-[#353530] bg-[#181816] text-[#F5F5F0]"
          : "border-[#E4E2DE] bg-[#FFFFFF] text-[#171717]"
      }`}
    >
      <div
        className={`flex items-center justify-between pb-3.5 border-b mb-4 ${
          isDark ? "border-[#353530]" : "border-[#E4E2DE]"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded border flex items-center justify-center ${
              isDark
                ? "bg-[#11110F] border-[#353530]"
                : "bg-[#F3F2EE] border-[#E4E2DE]"
            }`}
          >
            <Terminal
              className={`w-3.5 h-3.5 ${
                isDark ? "text-[#F59E0B]" : "text-[#D97706]"
              }`}
            />
          </div>
          <h3
            className={`font-semibold text-sm ${
              isDark ? "text-[#F5F5F0]" : "text-[#171717]"
            }`}
          >
            Scrape Activity Stream ({logs.length} runs)
          </h3>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded border ${
            isDark
              ? "text-[#22C55E] bg-[#16291E] border-[#22C55E]/30"
              : "text-[#15803D] bg-[#F0FDF4] border-[#15803D]/20"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>REAL-TIME VERIFIED</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div
          className={`py-8 text-center text-xs font-mono italic ${
            isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
          }`}
        >
          <p>No scraper logs recorded yet for this product.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr
                className={`border-b text-[10px] uppercase tracking-[0.15em] ${
                  isDark
                    ? "border-[#353530] text-[#A1A19A]"
                    : "border-[#E4E2DE] text-[#8A8A84]"
                }`}
              >
                <th className="pb-2.5 px-3">Timestamp</th>
                <th className="pb-2.5 px-3">Outcome</th>
                <th className="pb-2.5 px-3">HTTP</th>
                <th className="pb-2.5 px-3">Duration</th>
                <th className="pb-2.5 px-3 text-right">Extracted Price</th>
                <th className="pb-2.5 px-3 text-right">Stock</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-[#262624]" : "divide-[#E4E2DE]"
              }`}
            >
              {logs.map((log) => {
                const isSuccess =
                  log.status === "success" ||
                  (log.http_status >= 200 && log.http_status < 300);
                const latency = log.response_time_ms ?? log.duration_ms;
                const timestamp = log.scraped_at || log.attempted_at || log.quoted_at;
                const httpStatus = log.http_status ?? (log.status === "success" ? 200 : 500);
                const price = log.price ?? log.price_history?.price;
                const stock = log.stock ?? log.price_history?.stock;

                return (
                  <tr
                    key={log.id || timestamp}
                    className={`transition-colors ${
                      isDark
                        ? isSuccess
                          ? "hover:bg-[#20201D]"
                          : "bg-[#2D1616]/30 hover:bg-[#2D1616]/50"
                        : isSuccess
                        ? "hover:bg-[#F7F7F5]"
                        : "bg-[#FDF2F2] hover:bg-[#FCE7E7]"
                    }`}
                  >
                    {/* Timestamp */}
                    <td
                      className={`py-2.5 px-3 ${
                        isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                      }`}
                    >
                      <span className="font-semibold block">
                        {timestamp ? formatTime(timestamp) : "—"}
                      </span>
                      <span
                        className={`text-[10px] block font-normal ${
                          isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                        }`}
                      >
                        {timestamp ? formatDateTime(timestamp) : "—"}
                      </span>
                    </td>

                    {/* Outcome */}
                    <td className="py-2.5 px-3">
                      {isSuccess ? (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                            isDark
                              ? "text-[#22C55E] bg-[#16291E] border-[#22C55E]/30"
                              : "text-[#15803D] bg-[#F0FDF4] border-[#15803D]/20"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          SUCCESS
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                            isDark
                              ? "text-[#EF4444] bg-[#2D1616] border-[#EF4444]/30"
                              : "text-[#DC2626] bg-[#FDF2F2] border-[#DC2626]/20"
                          }`}
                        >
                          <X className="w-3 h-3" />
                          FAILED
                        </span>
                      )}
                    </td>

                    {/* HTTP Code */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          httpStatus === 200
                            ? isDark
                              ? "bg-[#16291E] text-[#22C55E] border-[#22C55E]/30"
                              : "bg-[#F0FDF4] text-[#15803D] border-[#15803D]/20"
                            : isDark
                            ? "bg-[#2D1616] text-[#EF4444] border-[#EF4444]/30"
                            : "bg-[#FDF2F2] text-[#DC2626] border-[#DC2626]/20"
                        }`}
                      >
                        {httpStatus}
                      </span>
                    </td>

                    {/* Latency */}
                    <td
                      className={`py-2.5 px-3 ${
                        isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                      }`}
                    >
                      {latency ? `${latency}ms` : "—"}
                    </td>

                    {/* Price */}
                    <td
                      className={`py-2.5 px-3 text-right font-sans font-bold text-xs sm:text-sm ${
                        isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                      }`}
                    >
                      {price !== null && price !== undefined
                        ? formatINR(price)
                        : "—"}
                    </td>

                    {/* Stock */}
                    <td className="py-2.5 px-3 text-right font-medium">
                      {stock !== null && stock !== undefined ? (
                        <span
                          className={
                            stock === 0
                              ? isDark ? "text-[#EF4444] font-bold" : "text-[#DC2626] font-bold"
                              : stock <= 5
                              ? isDark ? "text-[#EAB308] font-bold" : "text-[#CA8A04] font-bold"
                              : isDark ? "text-[#22C55E]" : "text-[#15803D]"
                          }
                        >
                          {stock} pcs
                        </span>
                      ) : (
                        <span className={isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
