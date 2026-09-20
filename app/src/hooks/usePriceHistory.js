import { useState, useEffect, useCallback } from "react";
import { getPriceHistory } from "../services/api";

export function usePriceHistory(productId, intervalMs = 8_000) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async (silent = false) => {
    if (!productId) return [];
    try {
      if (!silent) setError(null);
      const data = await getPriceHistory(productId);
      setHistory((prev) => {
        if (prev.length === data.length) {
          const prevLast = prev[prev.length - 1];
          const newLast = data[data.length - 1];
          if (prevLast?.id === newLast?.id && prevLast?.price === newLast?.price) {
            return prev;
          }
        }
        return data;
      });
      return data;
    } catch (err) {
      if (!silent) setError(err.message);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    fetchHistory(false);

    if (!intervalMs || intervalMs <= 0 || !productId) return;

    const timer = setInterval(() => {
      fetchHistory(true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [fetchHistory, intervalMs, productId]);

  return { history, setHistory, loading, error, refresh: () => fetchHistory(false) };
}

