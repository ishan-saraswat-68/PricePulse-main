import React from "react";
import { Link } from "react-router-dom";
import {
  Mouse,
  Footprints,
  Zap,
  ShoppingBag,
  Watch,
  Monitor,
  Coffee,
  Headphones,
  Package,
} from "lucide-react";
import { formatINR } from "../../services/api";
import { StockBadge } from "../ui/StockBadge";
import { useTheme } from "../../context/ThemeContext";

export function getCategoryIcon(category = "") {
  const cat = category.toLowerCase();
  if (cat.includes("audio") || cat.includes("headphone") || cat.includes("ear") || cat.includes("amplifier"))
    return Headphones;
  if (cat.includes("wearable") || cat.includes("watch")) return Watch;
  if (cat.includes("monitor") || cat.includes("display")) return Monitor;
  if (cat.includes("peripheral") || cat.includes("mouse") || cat.includes("keyboard") || cat.includes("trackpad"))
    return Mouse;
  if (cat.includes("footwear") || cat.includes("shoe") || cat.includes("slide") || cat.includes("runner"))
    return Footprints;
  if (cat.includes("power") || cat.includes("battery") || cat.includes("adapter") || cat.includes("bank"))
    return Zap;
  if (cat.includes("bag") || cat.includes("backpack") || cat.includes("tote"))
    return ShoppingBag;
  if (cat.includes("kitchen") || cat.includes("fryer") || cat.includes("cook"))
    return Coffee;
  return Package;
}

export function ProductCard({ product, trackedInfo = null }) {
  const { isDark } = useTheme();
  const { id, name, brand, category, sku: rawSku } = product;
  const CategoryIcon = getCategoryIcon(category);
  const sku = rawSku || `SKU-${id.toString().padStart(5, "0")}`;

  const price = trackedInfo?.price ?? product.price;
  const mrp = trackedInfo?.mrp ?? product.mrp;
  const stock = trackedInfo?.stock ?? product.stock;
  const badgePct = trackedInfo?.badge_pct ?? product.badge_pct;

  return (
    <Link
      to={`/products/${id}`}
      className={`rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer ${
        isDark
          ? "bg-[#181816] border-[#353530] hover:border-[#484842] hover:bg-[#20201D]"
          : "bg-[#FFFFFF] border-[#E4E2DE] hover:border-[#C8C6C0] hover:bg-[#FAFAF8]"
      }`}
    >
      {/* Product image/icon area */}
      <div className="p-3 pb-0">
        <div
          className={`aspect-[4/3] rounded-xl border flex items-center justify-center p-6 select-none relative overflow-hidden transition-colors duration-200 ${
            isDark
              ? "bg-[#11110F] border-[#353530]"
              : "bg-[#F3F2EE] border-[#E4E2DE]"
          }`}
        >
          {/* Catalog ID indicator */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md border ${
                isDark
                  ? "bg-[#181816] border-[#353530] text-[#A1A19A]"
                  : "bg-white border-[#E4E2DE] text-[#8A8A84]"
              }`}
            >
              #{id}
            </span>
          </div>

          {/* Tilted Category Corner Ribbon */}
          {category && (
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
              <div
                className={`absolute transform rotate-45 text-center font-mono font-bold tracking-wider uppercase text-[8px] py-1 right-[-32px] top-[18px] w-[124px] shadow-xs transition-colors ${
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
            className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
              isDark
                ? "bg-[#181816] border-[#353530]"
                : "bg-white border-[#E4E2DE]"
            }`}
          >
            <CategoryIcon
              className={`w-7 h-7 stroke-[1.5] transition-colors ${
                isDark
                  ? "text-[#A1A19A] group-hover:text-[#F59E0B]"
                  : "text-[#6B6B6B] group-hover:text-[#171717]"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Product Name -> Brand -> SKU */}
        <div className="space-y-1">
          <h3
            className={`font-sans font-semibold text-[18px] sm:text-[19px] leading-snug line-clamp-2 transition-colors ${
              isDark ? "text-[#F5F5F0]" : "text-[#171717]"
            }`}
          >
            {name}
          </h3>

          {brand && (
            <p
              className={`font-sans text-[13px] ${
                isDark ? "text-[#A1A19A]" : "text-[#6B6B6B]"
              }`}
            >
              {brand}
            </p>
          )}

          <p
            className={`font-mono text-[11px] ${
              isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
            }`}
          >
            {sku}
          </p>
        </div>

        {/* Price & Stock Status & VIEW DETAILS */}
        <div
          className={`pt-4 mt-4 border-t ${
            isDark ? "border-[#353530]" : "border-[#E4E2DE]"
          }`}
        >
          {price !== undefined && price !== null ? (
            <div>
              <div className="flex items-baseline flex-wrap gap-2">
                <span
                  className={`font-sans text-[20px] sm:text-[22px] font-bold ${
                    isDark ? "text-[#F5F5F0]" : "text-[#171717]"
                  }`}
                >
                  {formatINR(price)}
                </span>
                {mrp && mrp > price && (
                  <span
                    className={`font-mono text-[11px] line-through ${
                      isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
                    }`}
                  >
                    MRP {formatINR(mrp)}
                  </span>
                )}
                {badgePct ? (
                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      isDark ? "text-[#22C55E]" : "text-[#15803D]"
                    }`}
                  >
                    -{badgePct}%
                  </span>
                ) : null}
              </div>
              <div className="mt-2">
                <StockBadge stock={stock} />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <span
                className={`font-mono text-xs block ${
                  isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
                }`}
              >
                Catalog Track Available
              </span>
              <StockBadge stock={stock} />
            </div>
          )}

          {/* VIEW DETAILS → */}
          <div
            className={`pt-3.5 mt-3 border-t flex items-center justify-between text-xs font-semibold transition-colors ${
              isDark
                ? "border-[#353530] text-[#F5F5F0] group-hover:text-[#F59E0B]"
                : "border-[#E4E2DE] text-[#171717] group-hover:text-[#D97706]"
            }`}
          >
            <span className="tracking-wide text-[11px] uppercase">VIEW DETAILS</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
