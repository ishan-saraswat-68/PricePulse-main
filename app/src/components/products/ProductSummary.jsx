import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategoryIcon } from "./ProductCard";
import { trackProduct, refreshProductPrice, formatINR, formatDateTime } from "../../services/api";
import { StockBadge } from "../ui/StockBadge";
import { Activity, Loader2, Check, RefreshCw, ExternalLink, ArrowRight } from "lucide-react";

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
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12">
      {/* Media Column with Tilted Diagonal Category Ribbon */}
      <div className="md:col-span-5 bg-gradient-to-br from-slate-50 via-cyan-50/20 to-slate-100/60 border-b md:border-b-0 md:border-r border-slate-200/70 flex flex-col items-center justify-center p-10 select-none relative overflow-hidden">
        {category && (
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden z-10">
            <div className="absolute top-[22px] -right-[34px] w-[148px] py-[4px] bg-white/95 text-slate-900 border-y border-slate-900 text-center text-[9px] font-heading font-extrabold uppercase tracking-wider rotate-45 shadow-xs truncate px-1">
              {category}
            </div>
          </div>
        )}
        <div className="w-32 h-32 rounded-3xl bg-white/90 shadow-md border border-slate-100 flex items-center justify-center relative">
          <CategoryIcon className="w-16 h-16 text-slate-500 stroke-[1.25]" />
        </div>
        <span className="text-xs font-mono text-slate-400 mt-4">
          Catalog ID #{id}
        </span>
      </div>

      {/* Info Column */}
      <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-cyan-600 block mb-1">
              {brand}
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {name}
            </h1>
          </div>

          {/* Current Price Block with Refresh Button */}
          {currentPricePoint ? (
            <div className="rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/40 via-white to-white p-5 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10.5px] uppercase font-heading font-bold tracking-wider text-cyan-800 block">
                  Verified Live Store Price
                </span>
                <button
                  type="button"
                  onClick={handleRefreshPrice}
                  disabled={refreshingPrice}
                  className="btn btn-ghost !py-1 !px-2.5 !text-[11px] flex items-center gap-1.5 cursor-pointer hover:border-cyan-300"
                  title="Scrape live price quote from store"
                >
                  <RefreshCw className={`w-3 h-3 text-cyan-600 ${refreshingPrice ? "animate-spin" : ""}`} />
                  <span>{refreshingPrice ? "Checking..." : "Refresh Price"}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-heading text-3xl sm:text-4xl font-black text-slate-900">
                  {formatINR(currentPricePoint.price)}
                </span>
                {currentPricePoint.mrp && currentPricePoint.mrp > currentPricePoint.price && (
                  <span className="text-xs font-mono text-slate-400 line-through">
                    MRP {formatINR(currentPricePoint.mrp)}
                  </span>
                )}
                <StockBadge stock={currentPricePoint.stock} />
              </div>

              {currentPricePoint.quoted_at && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-3 pt-2.5 border-t border-slate-100">
                  <span>Quote captured: {formatDateTime(currentPricePoint.quoted_at)}</span>
                  <Link
                    to={`/products/${id}/monitor`}
                    className="font-heading font-semibold text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
                  >
                    <span>Price chart</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {priceError && (
                <p className="text-xs text-rose-600 font-mono mt-2">{priceError}</p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-heading font-bold text-slate-800 block">
                  Price not yet scraped
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Fetch live store quote now or enable surveillance.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefreshPrice}
                disabled={refreshingPrice}
                className="btn btn-primary !py-1.5 !px-3 !text-[11px] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${refreshingPrice ? "animate-spin" : ""}`} />
                <span>{refreshingPrice ? "Fetching..." : "Fetch Price"}</span>
              </button>
            </div>
          )}

          <p className="text-sm text-slate-600 leading-relaxed font-normal pt-1">
            {description || "A dependable catalog item with verified store attributes."}
          </p>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SKU Code:</span>
              <span className="font-semibold text-slate-800">{sku || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Catalog Entry:</span>
              <span className="text-slate-800">
                {first_seen_at ? new Date(first_seen_at).toLocaleDateString("en-IN") : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {isTracked ? (
            <Link
              to={`/products/${id}/monitor`}
              className="btn btn-primary"
            >
              <Activity className="w-4 h-4" />
              <span>Open Tracking Monitor →</span>
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
                  <span>Track This Product (15m Interval)</span>
                </>
              )}
            </button>
          )}

          {isTracked && (
            <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold px-3 py-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800">
              <Check className="w-3.5 h-3.5 text-cyan-600" />
              Active in PricePulse
            </span>
          )}

          {error && (
            <p className="text-xs text-rose-600 font-mono mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
