import React from "react";
import { Star, CheckCircle2, ThumbsUp } from "lucide-react";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 pt-8 border-t border-[#111111]">
      {/* Specifications */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111] mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#111111] tracking-tight">
            Specifications
          </h2>
          {specEntries.length > 0 && (
            <span className="text-[11px] font-mono text-[#767676] uppercase tracking-wider">
              {specEntries.length} attributes
            </span>
          )}
        </div>

        {specEntries.length === 0 ? (
          <p className="text-xs text-[#767676] font-serif italic py-6">
            No technical specifications recorded for this catalog item.
          </p>
        ) : (
          <dl className="divide-y divide-[#e4e4e4] border border-[#e4e4e4] bg-[#fbfbfb]">
            {specEntries.map(([key, val]) => (
              <div
                key={key}
                className="py-3 px-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 hover:bg-white transition-colors"
              >
                <dt className="text-[#767676] uppercase font-bold text-[11px] tracking-wider w-40 shrink-0">
                  {formatSpecKey(key)}
                </dt>
                <dd className="font-serif text-sm text-[#111111] sm:text-right font-medium leading-relaxed">
                  {formatSpecVal(key, val)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Customer Reviews */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111] mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-2xl font-bold text-[#111111] tracking-tight">
              Customer Reviews
            </h2>
            <span className="font-mono text-xs text-[#767676]">
              ({totalReviews})
            </span>
          </div>

          {avgRating && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-[#111111] text-[#111111]"
                        : "text-[#e4e4e4]"
                    }`}
                  />
                ))}
              </div>
              <span className="font-serif font-bold text-sm text-[#111111]">
                {avgRating}
              </span>
            </div>
          )}
        </div>

        {totalReviews === 0 ? (
          <p className="text-xs text-[#767676] font-serif italic py-6">
            No customer reviews submitted yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviewList.map((rev, i) => {
              const reviewText = rev.body || rev.comment;
              const isVerified = Boolean(rev.verifiedPurchase);

              return (
                <div
                  key={rev.id || i}
                  className="border border-[#e4e4e4] bg-white p-5 space-y-2 hover:border-[#111111] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111111] font-serif">
                        {rev.author || rev.user || rev.name || "Verified Customer"}
                      </span>
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#555] bg-[#f4f4f4] px-1.5 py-0.5 border border-[#e4e4e4]">
                          <CheckCircle2 className="w-3 h-3 text-[#111111]" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, starI) => (
                          <Star
                            key={starI}
                            className={`w-3.5 h-3.5 ${
                              starI < (rev.rating || 5)
                                ? "fill-[#111111] text-[#111111]"
                                : "text-[#e4e4e4]"
                            }`}
                          />
                        ))}
                      </div>
                      {rev.date && (
                        <span className="text-[11px] text-[#767676] font-mono">
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
                    <h4 className="font-serif font-bold text-sm text-[#111111] pt-1">
                      {rev.title}
                    </h4>
                  )}

                  {reviewText && (
                    <p className="text-xs sm:text-sm text-[#3a3a3a] leading-relaxed font-serif pt-0.5">
                      "{reviewText}"
                    </p>
                  )}

                  {rev.helpfulVotes > 0 && (
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-[#767676]">
                      <ThumbsUp className="w-3 h-3 text-[#767676]" />
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
