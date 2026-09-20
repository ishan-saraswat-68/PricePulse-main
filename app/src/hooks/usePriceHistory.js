import { useState, useEffect, useCallback } from "react";
import { getPriceHistory } from "../services/api";

export function usePriceHistory(productId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setError(null);
      const data = await getPriceHistory(productId);
      setHistory(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    fetchHistory();
  }, [fetchHistory]);

  return { history, setHistory, loading, error, refresh: fetchHistory };
}

