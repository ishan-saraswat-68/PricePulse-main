const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(body.error || res.statusText, res.status);
  }

  return res.json();
}

// --- Public endpoints ---

export function getProducts() {
  return request("/products");
}

export function searchProducts(query, limit = 20) {
  return request(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function getPriceHistory(id) {
  return request(`/products/${id}/price-history`);
}

export function getDashboard() {
  return request("/dashboard");
}

export function getAlerts(productId) {
  if (productId) {
    return request(`/alerts?productId=${productId}`);
  }
  return request("/alerts");
}


// --- Frontend proxy endpoints (no admin secret needed) ---

export function trackProduct(productId, frequencyMinutes) {
  return request("/api/frontend/track", {
    method: "POST",
    body: JSON.stringify({
      productId,
      ...(frequencyMinutes !== undefined && { frequencyMinutes }),
    }),
  });
}

export function pauseTracking(productId) {
  return request(`/api/frontend/track/${productId}`, {
    method: "DELETE",
  });
}

export function getScrapeLogs(productId, limit = 200) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (productId !== undefined) params.set("productId", String(productId));
  return request(`/api/frontend/scrape-logs?${params}`);
}

export function refreshProductPrice(productId) {
  return request(`/api/frontend/products/${productId}/scrape`, {
    method: "POST",
  });
}

// --- Formatting helpers ---

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatINR(value) {
  if (value === null || value === undefined) return "Price unavailable";
  return inrFormatter.format(value);
}

export function formatStock(stock) {
  if (stock === null || stock === undefined) return "Stock unavailable";
  if (stock === 0) return "Out of stock";
  return `${stock} available`;
}

export function relativeTime(dateStr) {
  if (!dateStr) return "Never";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  if (diffMs < 0) {
    const absDiff = Math.abs(diffMs);
    if (absDiff < 60_000) return "in < 1m";
    if (absDiff < 3_600_000) return `in ${Math.round(absDiff / 60_000)}m`;
    if (absDiff < 86_400_000) {
      const h = Math.floor(absDiff / 3_600_000);
      const m = Math.round((absDiff % 3_600_000) / 60_000);
      return `in ${h}h ${m}m`;
    }
    return `in ${Math.round(absDiff / 86_400_000)}d`;
  }

  if (diffMs < 60_000) return "just now";
  if (diffMs < 3_600_000) return `${Math.round(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.round(diffMs / 3_600_000)}h ago`;
  return `${Math.round(diffMs / 86_400_000)}d ago`;
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export { ApiError };
