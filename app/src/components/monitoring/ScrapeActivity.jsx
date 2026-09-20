import React from "react";
import { formatDateTime, formatTime, formatINR } from "../../services/api";
import { Terminal, Check, X } from "lucide-react";

export function ScrapeActivity({ logs = [] }) {
  return (
    <div className="border border-[#111111] bg-white p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#111111]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#111111]" />
          <h3 className="font-serif font-bold text-base text-[#111111]">
            Scrape Activity Stream ({logs.length} runs)
          </h3>
        </div>
        <span className="text-[11px] font-serif italic text-[#767676]">
          Real-time verification log
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="py-8 text-center text-[#767676] text-xs font-serif italic">
          <p>No scraper logs recorded yet for this product.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#111111] text-[#767676] text-[10px] uppercase tracking-wider font-bold">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Outcome</th>
                <th className="pb-2">HTTP</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2 text-right">Extracted Price</th>
                <th className="pb-2 text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e4]">
              {logs.map((log) => {
                const isSuccess =
                  log.status === "success" ||
                  (log.http_status >= 200 && log.http_status < 300);
                const latency = log.response_time_ms ?? log.duration_ms;

                return (
                  <tr
                    key={log.id || log.scraped_at}
                    className={`hover:bg-[#fbfbfb] transition-colors ${
                      !isSuccess ? "bg-red-50/50" : ""
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-2.5 pr-3 text-[#111111]">
                      <span className="font-semibold block">
                        {formatTime(log.scraped_at)}
                      </span>
                      <span className="text-[10px] text-[#767676] block font-serif">
                        {formatDateTime(log.scraped_at)}
                      </span>
                    </td>

                    {/* Outcome */}
                    <td className="py-2.5 pr-3">
                      {isSuccess ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#111111]">
                          <Check className="w-3.5 h-3.5" />
                          SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 underline">
                          <X className="w-3.5 h-3.5" />
                          FAILED
                        </span>
                      )}
                    </td>

                    {/* HTTP Code */}
                    <td className="py-2.5 pr-3">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                          log.http_status === 200
                            ? "border-[#e4e4e4] bg-[#f6f6f6] text-[#111111]"
                            : "border-red-500 bg-red-100 text-red-800"
                        }`}
                      >
                        {log.http_status || "—"}
                      </span>
                    </td>

                    {/* Latency */}
                    <td className="py-2.5 text-[#767676] pr-3">
                      {latency ? `${latency}ms` : "—"}
                    </td>

                    {/* Price */}
                    <td className="py-2.5 text-right font-serif font-bold text-[#111111] pr-3 text-sm">
                      {log.price !== null && log.price !== undefined
                        ? formatINR(log.price)
                        : "—"}
                    </td>

                    {/* Stock */}
                    <td className="py-2.5 text-right text-[#111111]">
                      {log.stock !== null && log.stock !== undefined
                        ? `${log.stock} pcs`
                        : "—"}
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
