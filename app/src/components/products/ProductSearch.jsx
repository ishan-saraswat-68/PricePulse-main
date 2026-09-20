import React, { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ProductSearch({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  totalCount = 0,
}) {
  const { isDark } = useTheme();
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
    <div className="flex flex-col gap-3 w-full lg:w-auto font-sans">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
              isDark ? "text-[#6B6B68]" : "text-[#8A8A84]"
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search catalog by name, brand, SKU..."
            className={`w-full pl-9 pr-8 py-2 rounded-md text-xs transition-colors focus:outline-none focus:ring-1 ${
              isDark
                ? "bg-[#181816] border border-[#353530] text-[#F5F5F0] placeholder-[#6B6B68] focus:border-[#F59E0B] focus:ring-[#F59E0B]"
                : "bg-[#FFFFFF] border border-[#E4E2DE] text-[#171717] placeholder-[#8A8A84] focus:border-[#D97706] focus:ring-[#D97706]"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 rounded ${
                isDark
                  ? "text-[#A1A19A] hover:text-[#F5F5F0] hover:bg-[#262624]"
                  : "text-[#8A8A84] hover:text-[#171717] hover:bg-[#F7F7F5]"
              }`}
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
            className={`px-3 py-2 border rounded-md text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              selectedCategory
                ? isDark
                  ? "bg-[#262014] border-[#F59E0B] text-[#F59E0B]"
                  : "bg-[#F3F2EE] border-[#D97706] text-[#D97706]"
                : isDark
                ? "bg-[#181816] border-[#353530] text-[#F5F5F0] hover:bg-[#262624]"
                : "bg-[#FFFFFF] border-[#E4E2DE] text-[#171717] hover:bg-[#F7F7F5]"
            }`}
            title="Filter by category"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{selectedCategory ? selectedCategory : "Categories"}</span>
            {selectedCategory && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? "bg-[#F59E0B]" : "bg-[#D97706]"
                }`}
              />
            )}
          </button>

          {/* Category Filter Dropdown */}
          {isFilterOpen && (
            <div
              className={`absolute right-0 mt-1.5 w-60 border rounded-md shadow-lg z-50 overflow-hidden font-sans text-xs ${
                isDark
                  ? "bg-[#181816] border-[#353530] text-[#F5F5F0]"
                  : "bg-[#FFFFFF] border-[#E4E2DE] text-[#171717]"
              }`}
            >
              <div
                className={`p-3 border-b flex items-center justify-between ${
                  isDark
                    ? "bg-[#11110F] border-[#353530]"
                    : "bg-[#F7F7F5] border-[#E4E2DE]"
                }`}
              >
                <span
                  className={`text-[10px] uppercase tracking-[0.15em] font-medium ${
                    isDark ? "text-[#A1A19A]" : "text-[#8A8A84]"
                  }`}
                >
                  Filter by Category
                </span>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      onCategoryChange("");
                      setIsFilterOpen(false);
                    }}
                    className={`text-[11px] font-medium hover:underline cursor-pointer ${
                      isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                    }`}
                  >
                    Reset
                  </button>
                )}
              </div>

              <div
                className={`py-1 max-h-64 overflow-y-auto divide-y ${
                  isDark ? "divide-[#262624]" : "divide-[#F3F2EE]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onCategoryChange("");
                    setIsFilterOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    !selectedCategory
                      ? isDark
                        ? "bg-[#262014] text-[#F59E0B] font-semibold"
                        : "bg-[#F3F2EE] text-[#D97706] font-semibold"
                      : isDark
                      ? "text-[#F5F5F0] hover:bg-[#20201D]"
                      : "text-[#171717] hover:bg-[#F7F7F5]"
                  }`}
                >
                  <span>All Categories</span>
                  {!selectedCategory && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                      }`}
                    />
                  )}
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
                      className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-[#262014] text-[#F59E0B] font-semibold"
                            : "bg-[#F3F2EE] text-[#D97706] font-semibold"
                          : isDark
                          ? "text-[#F5F5F0] hover:bg-[#20201D]"
                          : "text-[#171717] hover:bg-[#F7F7F5]"
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            isDark ? "text-[#F59E0B]" : "text-[#D97706]"
                          }`}
                        />
                      )}
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              !selectedCategory
                ? isDark
                  ? "bg-[#F5F5F0] text-[#11110F]"
                  : "bg-[#171717] text-white"
                : isDark
                ? "bg-[#181816] text-[#A1A19A] border border-[#353530] hover:text-[#F5F5F0] hover:bg-[#20201D]"
                : "bg-[#FFFFFF] text-[#6B6B6B] border border-[#E4E2DE] hover:text-[#171717] hover:bg-[#F7F7F5]"
            }`}
          >
            All Products
          </button>
          {categories.slice(0, 6).map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(isSelected ? "" : cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-[#F59E0B] text-[#11110F]"
                      : "bg-[#D97706] text-white"
                    : isDark
                    ? "bg-[#181816] text-[#A1A19A] border border-[#353530] hover:text-[#F5F5F0] hover:bg-[#20201D]"
                    : "bg-[#FFFFFF] text-[#6B6B6B] border border-[#E4E2DE] hover:text-[#171717] hover:bg-[#F7F7F5]"
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
