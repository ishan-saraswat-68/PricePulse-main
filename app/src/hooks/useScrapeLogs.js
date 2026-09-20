import { useState, useEffect, useCallback } from "react";
import { getScrapeLogs } from "../services/api";

export function useScrapeLogs(productId, limit = 200) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setError(null);
      const data = await getScrapeLogs(productId, limit);
      setLogs(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [productId, limit]);

  useEffect(() => {
    setLoading(true);
    fetchLogs();
  }, [fetchLogs]);

  return { logs, setLogs, loading, error, refresh: fetchLogs };
}

