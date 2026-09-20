import React from "react";
import { Star, CheckCircle2, ThumbsUp, Wrench, MessageSquareQuote } from "lucide-react";

function formatSpecKey(key) {
  const map = {
    inTheBox: "In The Box",
    countryOfOrigin: "Country of Origin",
    weightGrams: "Weight",
    modelYear: "Model Year",
    warranty: "Warranty",
    returns: "Return Policy",
    support: "Customer Support",
    material: "Material",
    colour: "Colour",
  };
  if (map[key]) return map[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatSpecVal(key, val) {
  if (key === "weightGrams") return `${val} g`;
  if (typeof val === "object" && val !== null) return JSON.stringify(val);
  return String(val);
}

export function ProductSpecs({ specs = {}, reviews = [] }) {
  const specEntries = Object.entries(specs || {}).filter(
    ([, val]) => val !== null && val !== undefined && val !== ""
  );

  const reviewList = reviews || [];
  const totalReviews = reviewList.length;

  const avgRating =
    totalReviews > 0
      ? (
          reviewList.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) /
          totalReviews
        ).toFixed(1)
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* Specifications */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-cyan-600" />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight">
              Technical Specifications
            </h2>
          </div>
          {specEntries.length > 0 && (
            <span className="text-[11px] font-heading font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
              {specEntries.length} attributes
            </span>
          )}
        </div>

        {specEntries.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-6">
            No technical specifications recorded for this catalog item.
          </p>
        ) : (
          <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/40 overflow-hidden">
            {specEntries.map(([key, val]) => (
              <div
                key={key}
                className="py-3 px-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 hover:bg-white transition-colors"
              >
                <dt className="text-slate-500 uppercase font-heading font-bold text-[10.5px] tracking-wider w-40 shrink-0">
                  {formatSpecKey(key)}
                </dt>
                <dd className="font-heading text-xs sm:text-sm text-slate-800 sm:text-right font-medium">
                  {formatSpecVal(key, val)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Customer Reviews */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight">
                Customer Reviews
              </h2>
              <span className="font-mono text-xs text-slate-400">
                ({totalReviews})
              </span>
            </div>
          </div>

          {avgRating && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="font-heading font-bold text-xs text-amber-900">
                {avgRating}
              </span>
            </div>
          )}
        </div>

        {totalReviews === 0 ? (
          <p className="text-xs text-slate-400 italic py-6">
            No customer reviews submitted yet.
          </p>
        ) : (
          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
            {reviewList.map((rev, i) => {
              const reviewText = rev.body || rev.comment;
              const isVerified = Boolean(rev.verifiedPurchase);

              return (
                <div
                  key={rev.id || i}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-2 hover:border-cyan-200 transition-colors shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-slate-900">
                        {rev.author || rev.user || rev.name || "Customer"}
                      </span>
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-heading font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, starI) => (
                          <Star
                            key={starI}
                            className={`w-3 h-3 ${
                              starI < (rev.rating || 5)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      {rev.date && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(rev.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {rev.title && (
                    <h4 className="font-heading font-bold text-sm text-slate-800 pt-0.5">
                      {rev.title}
                    </h4>
                  )}

                  {reviewText && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-0.5">
                      "{reviewText}"
                    </p>
                  )}

                  {rev.helpfulVotes > 0 && (
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] font-heading font-medium text-slate-400">
                      <ThumbsUp className="w-3 h-3 text-cyan-600" />
                      <span>{rev.helpfulVotes} people found this helpful</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
