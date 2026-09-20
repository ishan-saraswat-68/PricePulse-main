import { useState, useEffect, useCallback } from "react";
import { getScrapeLogs } from "../services/api";

export function useScrapeLogs(productId, limit = 200, intervalMs = 8_000) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (silent = false) => {
    if (!productId && productId !== undefined) return [];
    try {
      if (!silent) setError(null);
      const data = await getScrapeLogs(productId, limit);
      setLogs((prev) => {
        if (prev.length === data.length) {
          const prevFirst = prev[0];
          const newFirst = data[0];
          if (prevFirst?.id === newFirst?.id) {
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
  }, [productId, limit]);

  useEffect(() => {
    setLoading(true);
    fetchLogs(false);

    if (!intervalMs || intervalMs <= 0) return;

    const timer = setInterval(() => {
      fetchLogs(true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [fetchLogs, intervalMs]);

  return { logs, setLogs, loading, error, refresh: () => fetchLogs(false) };
}

