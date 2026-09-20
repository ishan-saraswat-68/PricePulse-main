import React, { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal, Check } from "lucide-react";

export function ProductSearch({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  totalCount = 0,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="flex flex-col gap-3 w-full lg:w-auto">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input: rounded pill with cyan focus ring */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search catalog by name, brand, SKU..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all shadow-2xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 rounded-full hover:bg-slate-100"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown Popover */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`px-4 py-2.5 border rounded-xl text-xs font-heading font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
              selectedCategory
                ? "bg-cyan-50 border-cyan-300 text-cyan-800 ring-2 ring-cyan-500/20"
                : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
            }`}
            title="Filter by category"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600" />
            <span>{selectedCategory ? `Category: ${selectedCategory}` : "Categories"}</span>
            {selectedCategory && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
            )}
          </button>

          {/* Category Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-slate-500">
                  Filter by Category
                </span>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      onCategoryChange("");
                      setIsFilterOpen(false);
                    }}
                    className="text-[11px] font-heading font-semibold text-cyan-600 hover:text-cyan-800 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="py-1 max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    onCategoryChange("");
                    setIsFilterOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    !selectedCategory
                      ? "bg-cyan-50 text-cyan-800 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>All Categories</span>
                  {!selectedCategory && <Check className="w-4 h-4 text-cyan-600" />}
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        onCategoryChange(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-cyan-50 text-cyan-800 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Category Filter Chips */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`px-3 py-1 rounded-full text-[11px] font-heading font-semibold whitespace-nowrap transition-all cursor-pointer ${
              !selectedCategory
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            All Products
          </button>
          {categories.slice(0, 5).map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(isSelected ? "" : cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-heading font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-600 text-white shadow-2xs shadow-cyan-500/20"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:border-cyan-200 hover:text-cyan-700 hover:bg-cyan-50/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
