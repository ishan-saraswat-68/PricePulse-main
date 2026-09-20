import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategoryIcon } from "./ProductCard";
import { trackProduct, refreshProductPrice, formatINR, formatDateTime } from "../../services/api";
import { StockBadge } from "../ui/StockBadge";
import { Activity, Loader2, Check, RefreshCw } from "lucide-react";

export function ProductSummary({
  product,
  isTracked = false,
  latestPricePoint = null,
  onPriceRefreshed = null,
}) {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  const [currentPricePoint, setCurrentPricePoint] = useState(latestPricePoint);
  const [refreshingPrice, setRefreshingPrice] = useState(false);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    setCurrentPricePoint(latestPricePoint);
  }, [latestPricePoint]);

  const { id, name, brand, category, sku, description, first_seen_at } = product;
  const CategoryIcon = getCategoryIcon(category);

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
    <div className="border border-[#111111] bg-white grid grid-cols-1 md:grid-cols-12">
      {/* Media Column */}
      <div className="md:col-span-5 bg-[#f6f6f6] border-b md:border-b-0 md:border-r border-[#e4e4e4] flex flex-col items-center justify-center p-12 select-none relative overflow-hidden">
        {category && (
          <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none overflow-hidden">
            <div className="absolute top-[18px] -right-[32px] w-[136px] py-[3px] bg-white border-y border-[#111111] text-center text-[8.5px] font-mono font-bold uppercase tracking-wider text-[#111111] rotate-45 shadow-2xs truncate px-1">
              {category}
            </div>
          </div>
        )}
        <CategoryIcon className="w-28 h-28 text-[#c2c2c2] stroke-[1.2]" />
        <span className="text-[11px] font-mono text-[#767676] mt-4">
          Catalog ID #{id}
        </span>
      </div>

      {/* Info Column */}
      <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#767676] block mb-1">
              {brand}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] leading-tight">
              {name}
            </h1>
          </div>

          {/* Current Price Block with Refresh Button */}
          {currentPricePoint ? (
            <div className="border border-[#111111] bg-[#fbfbfb] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#767676] block">
                  Current Verified Store Price
                </span>
                <button
                  type="button"
                  onClick={handleRefreshPrice}
                  disabled={refreshingPrice}
                  className="btn btn-ghost !py-1 !px-2.5 !text-[10px] flex items-center gap-1.5 cursor-pointer hover:bg-[#111111] hover:text-white transition-colors"
                  title="Scrape live price quote from INE Store"
                >
                  <RefreshCw className={`w-3 h-3 ${refreshingPrice ? "animate-spin" : ""}`} />
                  <span>{refreshingPrice ? "Refreshing..." : "Refresh Price"}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
                  {formatINR(currentPricePoint.price)}
                </span>
                {currentPricePoint.mrp && currentPricePoint.mrp > currentPricePoint.price && (
                  <span className="text-xs font-mono text-[#767676] line-through">
                    MRP {formatINR(currentPricePoint.mrp)}
                  </span>
                )}
                <StockBadge stock={currentPricePoint.stock} />
              </div>

              {currentPricePoint.quoted_at && (
                <div className="flex items-center justify-between text-[11px] text-[#767676] font-mono mt-3 pt-2 border-t border-[#e4e4e4]">
                  <span>Quote captured: {formatDateTime(currentPricePoint.quoted_at)}</span>
                  <Link
                    to={`/products/${id}/monitor`}
                    className="underline font-bold text-[#111111] hover:text-[#555]"
                  >
                    View price chart →
                  </Link>
                </div>
              )}

              {priceError && (
                <p className="text-xs text-red-600 font-mono mt-2">{priceError}</p>
              )}
            </div>
          ) : (
            <div className="border border-[#e4e4e4] bg-[#fbfbfb] p-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-serif font-bold text-[#111111] block">
                  Price not yet scraped
                </span>
                <span className="text-[11px] text-[#767676] font-serif italic">
                  Fetch live store quote now or enable surveillance.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefreshPrice}
                disabled={refreshingPrice}
                className="btn btn-primary !py-1 !px-3 !text-[10px] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${refreshingPrice ? "animate-spin" : ""}`} />
                <span>{refreshingPrice ? "Fetching..." : "Fetch Price"}</span>
              </button>
            </div>
          )}

          <p className="text-sm text-[#3a3a3a] leading-relaxed font-serif pt-1">
            {description || "A dependable catalog item with a clean, no-nonsense design."}
          </p>

          <div className="border-t border-[#e4e4e4] pt-3 space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#767676]">SKU:</span>
              <span className="font-semibold text-[#111111]">{sku || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#767676]">Catalog Added:</span>
              <span className="text-[#111111]">
                {first_seen_at ? new Date(first_seen_at).toLocaleDateString("en-IN") : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-[#111111] pt-6 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {isTracked ? (
            <Link
              to={`/products/${id}/monitor`}
              className="btn btn-primary"
            >
              <Activity className="w-4 h-4" />
              <span>View Tracking Monitor →</span>
            </Link>
          ) : (
            <button
              onClick={handleStartTracking}
              disabled={tracking}
              className="btn btn-primary cursor-pointer"
            >
              {tracking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enabling Surveillance...</span>
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
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase px-3 py-2 border border-[#111111] text-[#111111]">
              <Check className="w-3.5 h-3.5" />
              Active in PricePulse
            </span>
          )}

          {error && (
            <p className="text-xs text-red-600 font-mono mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
