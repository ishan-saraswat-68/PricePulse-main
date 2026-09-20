import React, { useState, useRef, useEffect } from "react";
import { Search, X, Menu, Check } from "lucide-react";

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
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input matching sketch: rounded rectangle with 'SEARCH' placeholder */}
      <div className="relative w-full sm:w-72 md:w-80">
        <Search className="w-4 h-4 text-[#767676] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="SEARCH"
          className="w-full pl-10 pr-9 py-2 bg-white border border-[#111111] rounded-xl text-xs font-mono tracking-wider text-[#111111] placeholder-[#767676] focus:outline-none focus:ring-1 focus:ring-[#111111] shadow-2xs"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#767676] hover:text-[#111111] cursor-pointer"
            title="Clear Search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Button matching sketch: rounded button with 'Filter ☰' */}
      <div className="relative" ref={filterRef}>
        <button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className={`px-4 py-2 border border-[#111111] rounded-xl text-xs font-serif font-bold tracking-normal transition-colors flex items-center gap-2 cursor-pointer shadow-2xs ${
            isFilterOpen || selectedCategory
              ? "bg-[#111111] text-white"
              : "bg-white text-[#111111] hover:bg-[#f6f6f6]"
          }`}
          title="Filter by category"
        >
          <span>{selectedCategory ? `Filter: ${selectedCategory}` : "Filter"}</span>
          <Menu className="w-4 h-4" />
        </button>

        {/* Category Filter Dropdown */}
        {isFilterOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#111111] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-3 border-b border-[#e4e4e4] bg-[#fbfbfb] flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#767676]">
                Filter by Category
              </span>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => {
                    onCategoryChange("");
                    setIsFilterOpen(false);
                  }}
                  className="text-[10px] font-mono uppercase underline text-[#111111] hover:text-[#767676] cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="py-1 max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onCategoryChange("");
                  setIsFilterOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-xs font-serif flex items-center justify-between transition-colors cursor-pointer ${
                  !selectedCategory
                    ? "bg-[#111111] text-white font-bold"
                    : "text-[#111111] hover:bg-[#f6f6f6]"
                }`}
              >
                <span>All Categories</span>
                {!selectedCategory && <Check className="w-3.5 h-3.5" />}
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
                    className={`w-full px-4 py-2 text-left text-xs font-serif flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#111111] text-white font-bold"
                        : "text-[#111111] hover:bg-[#f6f6f6]"
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
