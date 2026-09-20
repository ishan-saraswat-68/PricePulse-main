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
      className="border-r border-b border-[#e4e4e4] bg-white flex flex-col group transition-all duration-150 hover:bg-[#fafafa] cursor-pointer"
    >
      {/* Category Icon Thumbnail Box with Diagonal Corner Ribbon */}
      <div className="aspect-[4/3] bg-[#f6f6f6] border-b border-[#e4e4e4] flex items-center justify-center p-6 select-none relative overflow-hidden">
        {/* Diagonal Category Corner Ribbon */}
        {category && (
          <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none overflow-hidden">
            <div className="absolute top-[18px] -right-[32px] w-[136px] py-[3px] bg-white border-y border-[#111111] text-center text-[8.5px] font-mono font-bold uppercase tracking-wider text-[#111111] rotate-45 shadow-2xs truncate px-1">
              {category}
            </div>
          </div>
        )}

        <CategoryIcon
          className="w-16 h-16 text-[#c2c2c2] stroke-[1.25] group-hover:text-[#555555] transition-colors"
        />
      </div>

      {/* Body without bottom CTA */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start">
        <h3 className="font-serif font-semibold text-[15px] sm:text-[16px] text-[#111111] leading-snug line-clamp-2 group-hover:underline">
          {name}
        </h3>
        <p className="text-[12px] text-[#767676] mt-1 font-serif">
          {brand}
        </p>
        {sku && (
          <p className="text-[11px] text-[#767676] tracking-wider mt-2 font-mono">
            SKU {sku}
          </p>
        )}
      </div>
    </Link>
  );
}
