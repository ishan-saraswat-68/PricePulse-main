import React from "react";
import { Star, CheckCircle2, ThumbsUp, Wrench, MessageSquareQuote } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

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
  const { isDark } = useTheme();

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
      {/* Specifications */}
      <div
        className={`rounded-md border p-6 sm:p-8 transition-colors duration-150 ${
          isDark
            ? "border-[#353530] bg-[#181816]"
            : "border-[#E4E2DE] bg-[#FFFFFF]"
        }`}
      >
        <div
          className={`flex items-center justify-between pb-4 border-b mb-6 ${
            isDark ? "border-[#353530]" : "border-[#E4E2DE]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded border flex items-center justify-center ${
                isDark
                  ? "bg-[#262014] border-[#F59E0B]/30"
                  : "bg-[#F3F2EE] border-[#E4E2DE]"
              }`}
            >
              <Wrench
                className={`w-4 h-4 ${
                  isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                }`}
              />
            </div>
            <h2
              className={`font-serif text-xl font-semibold tracking-tight ${
                isDark ? "text-[#F5F5F0]" : "text-[#171717]"
              }`}
            >
              Technical Specifications
            </h2>
          </div>
          {specEntries.length > 0 && (
            <span
              className={`text-[11px] font-mono px-2.5 py-0.5 rounded border ${
                isDark
                  ? "bg-[#11110F] border-[#353530] text-[#A1A19A]"
                  : "bg-[#F7F7F5] border-[#E4E2DE] text-[#8A8A84]"
              }`}
            >
              {specEntries.length} attributes
            </span>
          )}
        </div>

        {specEntries.length === 0 ? (
          <p
            className={`text-xs italic py-6 ${
              isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
            }`}
          >
            No technical specifications recorded for this catalog item.
          </p>
        ) : (
          <dl
            className={`rounded border overflow-hidden text-xs divide-y ${
              isDark
                ? "border-[#353530] bg-[#141412] divide-[#262624]"
                : "border-[#E4E2DE] bg-[#F7F7F5] divide-[#E4E2DE]"
            }`}
          >
            {specEntries.map(([key, val]) => (
              <div
                key={key}
                className={`py-3 px-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 transition-colors ${
                  isDark ? "hover:bg-[#1C1C19]" : "hover:bg-[#FFFFFF]"
                }`}
              >
                <dt
                  className={`uppercase font-medium text-[10.5px] tracking-[0.15em] w-40 shrink-0 ${
                    isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                  }`}
                >
                  {formatSpecKey(key)}
                </dt>
                <dd
                  className={`text-xs sm:text-sm sm:text-right font-medium ${
                    isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  {formatSpecVal(key, val)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Customer Reviews */}
      <div
        className={`rounded-md border p-6 sm:p-8 transition-colors duration-150 ${
          isDark
            ? "border-[#353530] bg-[#181816]"
            : "border-[#E4E2DE] bg-[#FFFFFF]"
        }`}
      >
        <div
          className={`flex items-center justify-between pb-4 border-b mb-6 ${
            isDark ? "border-[#353530]" : "border-[#E4E2DE]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded border flex items-center justify-center ${
                isDark
                  ? "bg-[#262014] border-[#F59E0B]/30"
                  : "bg-[#F3F2EE] border-[#E4E2DE]"
              }`}
            >
              <MessageSquareQuote
                className={`w-4 h-4 ${
                  isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                }`}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <h2
                className={`font-serif text-xl font-semibold tracking-tight ${
                  isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                }`}
              >
                Customer Reviews
              </h2>
              <span
                className={`font-mono text-xs ${
                  isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                }`}
              >
                ({totalReviews})
              </span>
            </div>
          </div>

          {avgRating && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
                isDark
                  ? "border-[#353530] bg-[#141412]"
                  : "border-[#E4E2DE] bg-[#F7F7F5]"
              }`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(Number(avgRating))
                        ? isDark
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "fill-[#D97706] text-[#D97706]"
                        : isDark
                        ? "text-[#353530]"
                        : "text-[#E4E2DE]"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`font-mono font-bold text-xs ${
                  isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                }`}
              >
                {avgRating}
              </span>
            </div>
          )}
        </div>

        {totalReviews === 0 ? (
          <p
            className={`text-xs italic py-6 ${
              isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
            }`}
          >
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
                  className={`rounded border p-4 space-y-2 transition-colors ${
                    isDark
                      ? "border-[#353530] bg-[#141412] hover:border-[#484842]"
                      : "border-[#E4E2DE] bg-[#FFFFFF] hover:border-[#D8D6D0]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-xs ${
                          isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                        }`}
                      >
                        {rev.author || rev.user || rev.name || "Customer"}
                      </span>
                      {isVerified && (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            isDark
                              ? "text-[#22C55E] bg-[#16291E] border-[#22C55E]/30"
                              : "text-[#15803D] bg-[#F3F2EE] border-[#E4E2DE]"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
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
                                ? isDark
                                  ? "fill-[#F59E0B] text-[#F59E0B]"
                                  : "fill-[#D97706] text-[#D97706]"
                                : isDark
                                ? "text-[#353530]"
                                : "text-[#E4E2DE]"
                            }`}
                          />
                        ))}
                      </div>
                      {rev.date && (
                        <span
                          className={`text-[11px] font-mono ${
                            isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                          }`}
                        >
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
                    <h4
                      className={`font-semibold text-xs pt-0.5 ${
                        isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                      }`}
                    >
                      {rev.title}
                    </h4>
                  )}

                  {reviewText && (
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
                      }`}
                    >
                      "{reviewText}"
                    </p>
                  )}

                  {rev.helpfulVotes > 0 && (
                    <div
                      className={`pt-1 flex items-center gap-1.5 text-[11px] font-mono ${
                        isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                      }`}
                    >
                      <ThumbsUp
                        className={`w-3 h-3 ${
                          isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                        }`}
                      />
                      <span>{rev.helpfulVotes} found helpful</span>
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
