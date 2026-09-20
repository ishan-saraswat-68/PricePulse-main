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
  ArrowRight,
} from "lucide-react";

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

export function ProductCard({ product }) {
  const { id, name, brand, category, sku } = product;
  const CategoryIcon = getCategoryIcon(category);

  return (
    <Link
      to={`/products/${id}`}
      className="bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-cyan-400/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
    >
      {/* Visual Thumbnail Chamber with Tilted Diagonal Category Ribbon */}
      <div className="p-3 pb-0">
        <div className="aspect-[4/3] rounded-xl bg-gradient-to-b from-slate-50 via-cyan-50/20 to-slate-100/60 border border-slate-100/90 group-hover:border-cyan-200/50 group-hover:from-cyan-50/40 group-hover:to-cyan-100/20 flex items-center justify-center p-6 select-none relative overflow-hidden transition-all duration-300">
          
          {/* Tilted Diagonal Category Corner Ribbon (matches user request & Image 3) */}
          {category && (
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none overflow-hidden rounded-tr-xl z-10">
              <div className="absolute top-[18px] -right-[32px] w-[136px] py-[3.5px] bg-white/95 text-slate-900 border-y border-slate-900 text-center text-[8.5px] font-heading font-extrabold uppercase tracking-wider rotate-45 shadow-xs truncate px-1">
                {category}
              </div>
            </div>
          )}

          {/* Floating SKU / Catalog ID Badge in Top-Left */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9.5px] font-mono font-medium text-slate-500 bg-white/85 backdrop-blur-xs border border-slate-200/70 shadow-2xs">
              #{id}
            </span>
          </div>

          {/* Icon with Hover Animation */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-xs border border-slate-100 flex items-center justify-center group-hover:shadow-md group-hover:border-cyan-200 group-hover:scale-105 transition-all duration-300">
              <CategoryIcon
                className="w-8 h-8 text-slate-500 stroke-[1.5] group-hover:text-cyan-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Details & Action Footer */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {brand && (
            <span className="text-[10.5px] font-heading font-bold uppercase tracking-wider text-cyan-600 block mb-1">
              {brand}
            </span>
          )}
          <h3 className="font-heading font-bold text-[15px] sm:text-[16px] text-slate-900 leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors">
            {name}
          </h3>
          {sku && (
            <p className="text-[11px] text-slate-400 font-mono tracking-normal mt-1">
              SKU: {sku}
            </p>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11.5px] font-heading font-medium text-slate-500">
            View Live Specs
          </span>
          <div className="inline-flex items-center gap-1 text-xs font-heading font-semibold text-cyan-600 group-hover:text-cyan-700 group-hover:translate-x-0.5 transition-all">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
