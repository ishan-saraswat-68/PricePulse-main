import { useState, useEffect, useRef } from "react";
import { searchProducts, getProducts } from "../services/api";

export function useProducts(query, debounceMs = 300) {
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef();

  // Load all products once on mount (for initial display)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts()
      .then((data) => {
        if (!cancelled) {
          setAllProducts(data);
          setResults(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || !query.trim()) {
      setResults(allProducts);
      setError(null);
      return;
    }

    setLoading(true);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      searchProducts(query)
        .then((data) => {
          setResults(data);
          setError(null);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs, allProducts]);

  // Extract unique categories from all products
  const categories = Array.from(
    new Set(allProducts.map((p) => p.category).filter(Boolean))
  ).sort();

  return { results, loading, error, categories };
}
