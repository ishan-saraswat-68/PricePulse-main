import React from "react";
import { formatDateTime, formatTime, formatINR } from "../../services/api";
import { Terminal, Check, X, ShieldCheck } from "lucide-react";

export function ScrapeActivity({ logs = [] }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-cyan-600" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">
            Scrape Activity Stream ({logs.length} runs)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-heading font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real-time verification log</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs italic">
          <p>No scraper logs recorded yet for this product.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-heading font-bold tracking-wider">
                <th className="pb-2.5 px-3">Timestamp</th>
                <th className="pb-2.5 px-3">Outcome</th>
                <th className="pb-2.5 px-3">HTTP</th>
                <th className="pb-2.5 px-3">Duration</th>
                <th className="pb-2.5 px-3 text-right">Extracted Price</th>
                <th className="pb-2.5 px-3 text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                    className={`hover:bg-slate-50/70 transition-colors ${
                      !isSuccess ? "bg-rose-50/40" : ""
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-3 text-slate-800">
                      <span className="font-semibold block font-mono">
                        {timestamp ? formatTime(timestamp) : "—"}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {timestamp ? formatDateTime(timestamp) : "—"}
                      </span>
                    </td>

                    {/* Outcome */}
                    <td className="py-3 px-3">
                      {isSuccess ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <X className="w-3 h-3 text-rose-600" />
                          FAILED
                        </span>
                      )}
                    </td>

                    {/* HTTP Code */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                          httpStatus === 200
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {httpStatus}
                      </span>
                    </td>

                    {/* Latency */}
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      {latency ? `${latency}ms` : "—"}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-heading font-bold text-slate-900 text-sm">
                      {price !== null && price !== undefined
                        ? formatINR(price)
                        : "—"}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-3 text-right text-slate-700 font-mono font-medium">
                      {stock !== null && stock !== undefined ? (
                        <span className={stock === 0 ? "text-rose-600 font-bold" : stock <= 5 ? "text-amber-600 font-bold" : "text-cyan-700 font-semibold"}>
                          {stock} pcs
                        </span>
                      ) : (
                        "—"
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
