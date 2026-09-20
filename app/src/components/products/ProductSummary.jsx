import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategoryIcon } from "./ProductCard";
import { trackProduct, refreshProductPrice, formatINR, formatDateTime } from "../../services/api";
import { StockBadge } from "../ui/StockBadge";
import { Activity, Loader2, Check, RefreshCw, ArrowRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ProductSummary({
  product,
  isTracked = false,
  latestPricePoint = null,
  onPriceRefreshed = null,
}) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  const [currentPricePoint, setCurrentPricePoint] = useState(latestPricePoint);
  const [refreshingPrice, setRefreshingPrice] = useState(false);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    setCurrentPricePoint(latestPricePoint);
  }, [latestPricePoint]);

  const { id, name, brand, category, sku: rawSku, description, first_seen_at } = product;
  const CategoryIcon = getCategoryIcon(category);
  const sku = rawSku || `SKU-${id.toString().padStart(5, "0")}`;

  async function handleStartTracking() {
    try {
      setTracking(true);
      setError(null);
      await trackProduct(id, 60);
      navigate(`/products/${id}/monitor`);
    } catch (err) {
      setError(err.message || "Failed to initiate tracking.");
      setTracking(false);
    }
  }

  async function handleRefreshPrice() {
    try {
      setRefreshingPrice(true);
      setPriceError(null);
      const newPrice = await refreshProductPrice(id);
      setCurrentPricePoint(newPrice);
      if (onPriceRefreshed) onPriceRefreshed(newPrice);
    } catch (err) {
      setPriceError(err.message || "Failed to fetch live price");
    } finally {
      setRefreshingPrice(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden grid grid-cols-1 md:grid-cols-12 font-sans transition-colors duration-150 ${
        isDark
          ? "border-[#353530] bg-[#181816]"
          : "border-[#E4E2DE] bg-[#FFFFFF]"
      }`}
    >
      {/* Product Image / Icon Column */}
      <div
        className={`md:col-span-5 border-b md:border-b-0 md:border-r flex flex-col items-center justify-center p-10 select-none relative overflow-hidden transition-colors duration-150 ${
          isDark
            ? "bg-[#11110F] border-[#353530]"
            : "bg-[#F3F2EE] border-[#E4E2DE]"
        }`}
      >
        {/* Tilted Category Corner Ribbon */}
        {category && (
          <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none z-10">
            <div
              className={`absolute transform rotate-45 text-center font-mono font-bold tracking-wider uppercase text-[9px] py-1.5 right-[-36px] top-[22px] w-[140px] shadow-xs transition-colors ${
                isDark
                  ? "bg-[#181816] text-[#F59E0B] border-y border-[#F59E0B]/50"
                  : "bg-[#FFFFFF] text-[#171717] border-y border-[#171717]"
              }`}
              title={category}
            >
              <span className="block truncate px-1">{category}</span>
            </div>
          </div>
        )}

        <div
          className={`w-28 h-28 rounded-xl border flex items-center justify-center relative transition-colors duration-150 ${
            isDark
              ? "bg-[#181816] border-[#353530]"
              : "bg-[#FFFFFF] border-[#E4E2DE]"
          }`}
        >
          <CategoryIcon
            className={`w-14 h-14 stroke-[1.5] ${
              isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
            }`}
          />
        </div>
        <span
          className={`font-mono text-[11px] mt-4 ${
            isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
          }`}
        >
          Catalog ID #{id}
        </span>
      </div>

      {/* Info Column */}
      <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div>
            {category && (
              <span
                className={`text-[10.5px] uppercase tracking-[0.15em] font-medium block mb-1 ${
                  isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                }`}
              >
                {category}
              </span>
            )}
            <h1
              className={`font-serif text-2xl sm:text-3xl font-semibold leading-tight transition-colors duration-150 ${
                isDark ? "text-[#F5F5F0]" : "text-[#171717]"
              }`}
            >
              {name}
            </h1>
            {brand && (
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
                }`}
              >
                Brand:{" "}
                <strong
                  className={`font-medium ${
                    isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  {brand}
                </strong>
              </p>
            )}
          </div>

          {/* Current Price Block */}
          {currentPricePoint ? (
            <div
              className={`rounded-md border p-5 space-y-3 transition-colors duration-150 ${
                isDark
                  ? "border-[#353530] bg-[#141412]"
                  : "border-[#E4E2DE] bg-[#F7F7F5]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] uppercase tracking-[0.15em] font-medium block ${
                    isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                  }`}
                >
                  Store Quoted Price
                </span>
                <button
                  type="button"
                  onClick={handleRefreshPrice}
                  disabled={refreshingPrice}
                  className="btn btn-secondary !py-1 !px-2.5 !text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Fetch fresh price from store"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      refreshingPrice
                        ? "animate-spin text-[#D97706]"
                        : isDark
                        ? "text-[#A1A19A]"
                        : "text-[#6B6B6B]"
                    }`}
                  />
                  <span>{refreshingPrice ? "Checking..." : "Refresh Price"}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <span
                  className={`font-sans text-3xl sm:text-4xl font-bold tracking-tight ${
                    isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  {formatINR(currentPricePoint.price)}
                </span>
                {currentPricePoint.mrp && currentPricePoint.mrp > currentPricePoint.price && (
                  <span
                    className={`font-mono text-xs line-through ${
                      isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
                    }`}
                  >
                    MRP {formatINR(currentPricePoint.mrp)}
                  </span>
                )}
                {currentPricePoint.mrp && currentPricePoint.mrp > currentPricePoint.price && (
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isDark ? "text-[#22C55E]" : "text-[#15803D]"
                    }`}
                  >
                    -{Math.round(((currentPricePoint.mrp - currentPricePoint.price) / currentPricePoint.mrp) * 100)}%
                  </span>
                )}
                <StockBadge stock={currentPricePoint.stock} />
              </div>

              {currentPricePoint.quoted_at && (
                <div
                  className={`flex items-center justify-between text-[11px] font-mono pt-2.5 border-t ${
                    isDark
                      ? "border-[#353530] text-[#A1A19A]"
                      : "border-[#E4E2DE] text-[#8A8A84]"
                  }`}
                >
                  <span>Quote timestamp: {formatDateTime(currentPricePoint.quoted_at)}</span>
                  <Link
                    to={`/products/${id}/monitor`}
                    className={`font-medium hover:underline flex items-center gap-1 ${
                      isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                    }`}
                  >
                    <span>Price chart</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {priceError && (
                <p className="text-xs text-[#DC2626] font-mono">{priceError}</p>
              )}
            </div>
          ) : (
            <div
              className={`rounded-md border p-4 flex items-center justify-between gap-3 ${
                isDark
                  ? "border-[#353530] bg-[#141412]"
                  : "border-[#E4E2DE] bg-[#F7F7F5]"
              }`}
            >
              <div>
                <span
                  className={`text-xs font-semibold block ${
                    isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  Price not yet retrieved
                </span>
                <span
                  className={`text-[11px] ${
                    isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
                  }`}
                >
                  Fetch store price now or activate background surveillance.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefreshPrice}
                disabled={refreshingPrice}
                className="btn btn-primary !py-1.5 !px-3 !text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    refreshingPrice ? "animate-spin" : ""
                  }`}
                />
                <span>{refreshingPrice ? "Fetching..." : "Fetch Price"}</span>
              </button>
            </div>
          )}

          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
            }`}
          >
            {description || "A dependable catalog item with verified store attributes."}
          </p>

          <div
            className={`border-t pt-3 space-y-2 text-xs font-mono ${
              isDark ? "border-[#353530]" : "border-[#E4E2DE]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"}>
                SKU Code:
              </span>
              <span
                className={`font-semibold ${
                  isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                }`}
              >
                {sku}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"}>
                Catalog Entry:
              </span>
              <span className={isDark ? "text-[#F5F5F0]" : "text-[#171717]"}>
                {first_seen_at ? new Date(first_seen_at).toLocaleDateString("en-IN") : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`border-t pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${
            isDark ? "border-[#353530]" : "border-[#E4E2DE]"
          }`}
        >
          {isTracked ? (
            <Link
              to={`/products/${id}/monitor`}
              className="btn btn-primary !rounded-md"
            >
              <Activity className="w-4 h-4" />
              <span>Open Monitoring Console →</span>
            </Link>
          ) : (
            <button
              onClick={handleStartTracking}
              disabled={tracking}
              className="btn btn-primary !rounded-md cursor-pointer"
            >
              {tracking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Activating Surveillance...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Track This Product</span>
                </>
              )}
            </button>
          )}

          {isTracked && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border ${
                isDark
                  ? "bg-[#16291E] border-[#22C55E]/30 text-[#22C55E]"
                  : "bg-[#F3F2EE] border-[#E4E2DE] text-[#15803D]"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Active in PricePulse
            </span>
          )}

          {error && (
            <p className="text-xs text-[#DC2626] font-mono">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
