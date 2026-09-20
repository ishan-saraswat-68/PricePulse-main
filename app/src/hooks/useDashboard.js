import { useState, useEffect, useCallback } from "react";
import { getDashboard } from "../services/api";

export function useDashboard(pollIntervalMs = 60_000) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    getDashboard()
      .then((data) => {
        setRows(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(interval);
  }, [refresh, pollIntervalMs]);

  return { rows, loading, error, refresh };
}
