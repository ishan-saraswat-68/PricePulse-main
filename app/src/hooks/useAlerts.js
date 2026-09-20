import { useState, useEffect, useCallback } from "react";
import { getAlerts } from "../services/api";

export function useAlerts(productId = null, pollInterval = 0) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const data = await getAlerts(productId);
      setAlerts(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchAlerts();

    if (pollInterval > 0) {
      const interval = setInterval(fetchAlerts, pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchAlerts, pollInterval]);

  return { alerts, setAlerts, loading, error, refresh: fetchAlerts };
}

