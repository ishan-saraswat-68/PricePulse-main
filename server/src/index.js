import express from "express";
import { runDueScrapes } from "./lib/Scheduler/run.js";
import {
    list as listProducts,
    getById as getProductById,
    searchByName,
    upsertDetail,
} from "./lib/Models/products.js";
import { fetchProduct } from "./lib/Scaper/product.js";
import { listByProduct, insert as insertPriceHistory, latest as latestPrice } from "./lib/Models/priceHistory.js";
import {
    listActive,
    ensureDefault as ensureDefaultAlerts,
    disable as disableAlert,
    markTriggered,
} from "./lib/Models/alerts.js";
import { track, deactivate, markSuccess } from "./lib/Models/trackedProducts.js";
import { list as listScrapeLogs, insert as insertScrapeLog } from "./lib/Models/scrapeLog.js";
import { list as listDashboard } from "./lib/Models/dashboard.js";
import { fetchPrice } from "./lib/Scaper/price.js";
import getDb from "./lib/db.js";
import requireAdmin from "./lib/middleware/requireAdmin.js";

const app = express();

app.use(express.json());

// CORS — allow requests from any frontend port (5173, 5174, etc.) or configured origin
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
    } else {
        res.header("Access-Control-Allow-Origin", "*");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, x-admin-secret, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

// Wraps an async route so a thrown error reaches the error middleware instead of floating.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Product ids are positive integers. Returns null on anything else so callers can 400.
function intParam(value) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}

function clampLimit(value, fallback, max) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1) return fallback;
    return Math.min(n, max);
}

// --- Public (user) ---------------------------------------------------------

app.get("/", (req, res) => {
    res.json({ message: "PricePulse API" });
});

app.get(
    "/products",
    asyncHandler(async (req, res) => {
        res.json(await listProducts());
    }),
);

// Declared before `/products/:id` so "search" isn't captured as an id.
app.get(
    "/products/search",
    asyncHandler(async (req, res) => {
        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
        if (!q) return res.status(400).json({ error: "Missing required query param: q" });

        res.json(await searchByName(q, { limit: clampLimit(req.query.limit, 20, 100) }));
    }),
);

app.get(
    "/products/:id",
    asyncHandler(async (req, res) => {
        const id = intParam(req.params.id);
        if (id === null) return res.status(400).json({ error: "Invalid product id" });

        let product = await getProductById(id);

        try {
            const storeProduct = await fetchProduct(id);
            if (storeProduct) {
                if (!product?.specs || Object.keys(product.specs).length === 0) {
                    await upsertDetail(storeProduct).catch(() => {});
                }
                product = {
                    ...(product || {}),
                    ...storeProduct,
                    specs: storeProduct.specs || product?.specs || {},
                    reviews: storeProduct.reviews || [],
                };
            }
        } catch (err) {
            console.warn(`Live product fetch error for id ${id}:`, err.message);
        }

        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product);
    }),
);

app.get(
    "/api/product/:id",
    asyncHandler(async (req, res) => {
        const id = intParam(req.params.id);
        if (id === null) return res.status(400).json({ error: "Invalid product id" });

        try {
            const storeProduct = await fetchProduct(id);
            return res.json(storeProduct);
        } catch (err) {
            const product = await getProductById(id);
            if (!product) return res.status(404).json({ error: "Product not found" });
            return res.json(product);
        }
    }),
);


app.get(
    "/products/:id/price-history",
    asyncHandler(async (req, res) => {
        const id = intParam(req.params.id);
        if (id === null) return res.status(400).json({ error: "Invalid product id" });

        res.json(await listByProduct(id));
    }),
);

app.get(
    "/alerts",
    asyncHandler(async (req, res) => {
        if (!req.query.productId) {
            const { data, error } = await getDb()
                .from("alerts")
                .select("*, products(id, name, brand, category, sku)")
                .order("triggered_at", { ascending: false, nullsFirst: false });

            if (error) throw error;
            return res.json(data ?? []);
        }

        const productId = intParam(req.query.productId);
        if (productId === null) {
            return res.status(400).json({ error: "Missing or invalid query param: productId" });
        }

        res.json(await listActive(productId));
    }),
);

app.get(
    "/api/frontend/alerts",
    asyncHandler(async (req, res) => {
        const { data, error } = await getDb()
            .from("alerts")
            .select("*, products(id, name, brand, category, sku)")
            .order("triggered_at", { ascending: false, nullsFirst: false });

        if (error) throw error;
        res.json(data ?? []);
    }),
);


app.get(
    "/dashboard",
    asyncHandler(async (req, res) => {
        res.json(await listDashboard());
    }),
);

// --- Admin (requires ADMIN_SECRET) -----------------------------------------

app.post(
    "/scheduler/run",
    requireAdmin,
    asyncHandler(async (req, res) => {
        res.json(await runDueScrapes());
    }),
);

app.get(
    "/scrape-logs",
    requireAdmin,
    asyncHandler(async (req, res) => {
        const productId =
            req.query.productId === undefined ? undefined : intParam(req.query.productId);

        if (req.query.productId !== undefined && productId === null) {
            return res.status(400).json({ error: "Invalid productId" });
        }

        res.json(await listScrapeLogs({ limit: clampLimit(req.query.limit, 200, 1000), productId }));
    }),
);

app.post(
    "/track",
    requireAdmin,
    asyncHandler(async (req, res) => {
        const productId = intParam(req.body?.productId);
        if (productId === null) {
            return res.status(400).json({ error: "Body must include an integer productId" });
        }

        const { frequencyMinutes } = req.body ?? {};
        if (frequencyMinutes !== undefined) {
            const n = Number(frequencyMinutes);
            if (!Number.isInteger(n) || n < 1) {
                return res.status(400).json({ error: "frequencyMinutes must be a positive integer" });
            }
        }

        if (!(await getProductById(productId))) {
            return res.status(404).json({ error: "Product not found" });
        }

        const tracked = await track(
            productId,
            frequencyMinutes === undefined ? {} : { frequencyMinutes: Number(frequencyMinutes) },
        );
        const alertsCreated = await ensureDefaultAlerts(productId);

        res.status(201).json({ tracked, alertsCreated });
    }),
);

app.delete(
    "/track/:id",
    requireAdmin,
    asyncHandler(async (req, res) => {
        const id = intParam(req.params.id);
        if (id === null) return res.status(400).json({ error: "Invalid product id" });

        const tracked = await deactivate(id);
       
        if (!tracked) return res.status(404).json({ error: "Not tracking that product" });

        res.json(tracked);
    }),
);

app.post(
    "/alerts",
    requireAdmin,
    asyncHandler(async (req, res) => {
        const productId = intParam(req.body?.productId);
        if (productId === null) {
            return res.status(400).json({ error: "Body must include an integer productId" });
        }

        res.status(201).json({ created: await ensureDefaultAlerts(productId) });
    }),
);

app.delete(
    "/alerts/:id",
    requireAdmin,
    asyncHandler(async (req, res) => {
        if (!UUID_RE.test(req.params.id)) {
            return res.status(400).json({ error: "Invalid alert id" });
        }

        const alert = await disableAlert(req.params.id);
        if (!alert) return res.status(404).json({ error: "Alert not found" });

        res.json(alert);
    }),
);

// --- Frontend proxy (no admin secret needed from browser) ------------------

app.post(
    "/api/frontend/track",
    asyncHandler(async (req, res) => {
        const productId = intParam(req.body?.productId);
        if (productId === null) {
            return res.status(400).json({ error: "Body must include an integer productId" });
        }

        const { frequencyMinutes } = req.body ?? {};
        if (frequencyMinutes !== undefined) {
            const n = Number(frequencyMinutes);
            if (!Number.isInteger(n) || n < 1) {
                return res.status(400).json({ error: "frequencyMinutes must be a positive integer" });
            }
        }

        if (!(await getProductById(productId))) {
            return res.status(404).json({ error: "Product not found" });
        }

        const tracked = await track(
            productId,
            frequencyMinutes === undefined ? {} : { frequencyMinutes: Number(frequencyMinutes) },
        );
        const alertsCreated = await ensureDefaultAlerts(productId);

        res.status(201).json({ tracked, alertsCreated });
    }),
);

app.delete(
    "/api/frontend/track/:id",
    asyncHandler(async (req, res) => {
        const id = intParam(req.params.id);
        if (id === null) return res.status(400).json({ error: "Invalid product id" });

        const tracked = await deactivate(id);
        if (!tracked) return res.status(404).json({ error: "Not tracking that product" });

        res.json(tracked);
    }),
);

app.get(
    "/api/frontend/scrape-logs",
    asyncHandler(async (req, res) => {
        const productId =
            req.query.productId === undefined ? undefined : intParam(req.query.productId);

        if (req.query.productId !== undefined && productId === null) {
            return res.status(400).json({ error: "Invalid productId" });
        }

        res.json(await listScrapeLogs({ limit: clampLimit(req.query.limit, 200, 1000), productId }));
    }),
);

app.post(
    "/api/frontend/products/:id/scrape",
    asyncHandler(async (req, res) => {
        const id = intParam(req.params.id);
        if (id === null) return res.status(400).json({ error: "Invalid product id" });

        const started = performance.now();
        try {
            const prev = await latestPrice(id);
            const quote = await fetchPrice(id);
            const durationMs = Math.round(performance.now() - started);

            const quoteRow = {
                product_id: id,
                price: quote.price,
                mrp: quote.mrp,
                sale: quote.sale,
                badge_pct: quote.badgePct,
                stock: quote.stock,
                currency: quote.currency,
                rating: quote.rating,
                rating_count: quote.ratingCount,
                seller: quote.seller,
                delivery_days: quote.deliveryDays,
                variant: quote.variant,
                format: quote.format,
                pending: quote.pending,
                triple: quote.triple,
                quoted_at: new Date(quote.at || Date.now()).toISOString(),
                scraped_at: new Date().toISOString(),
            };

            const priceRow = await insertPriceHistory(quoteRow);
            await insertScrapeLog({
                product_id: id,
                attempted_at: new Date().toISOString(),
                status: "success",
                retry_count: 0,
                duration_ms: durationMs,
                price_history_id: priceRow.id,
            });

            // If tracked, update tracked_products and evaluate alerts
            const { data: tracked } = await getDb()
                .from("tracked_products")
                .select("*")
                .eq("product_id", id)
                .maybeSingle();

            if (tracked) {
                await markSuccess(tracked.id, tracked.scrape_frequency_minutes || 60);
                const alerts = await listActive(id);
                for (const alert of alerts) {
                    let fire = false;
                    if (alert.type === "price_drop") {
                        fire = Boolean(prev) && quote.price < Number(prev.price);
                    } else if (alert.type === "back_in_stock") {
                        fire = Boolean(prev) && (prev.stock == null || prev.stock === 0) && quote.stock > 0;
                    }
                    if (fire) await markTriggered(alert.id);
                }
            }

            res.status(201).json(priceRow);
        } catch (error) {
            const durationMs = Math.round(performance.now() - started);
            await insertScrapeLog({
                product_id: id,
                attempted_at: new Date().toISOString(),
                status: "failed",
                retry_count: 0,
                error_message: error.message,
                duration_ms: durationMs,
            }).catch(() => {});

            res.status(502).json({ error: `Failed to scrape store: ${error.message}` });
        }
    }),
);

// --- Errors ----------------------------------------------------------------

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    res.status(500).json({ error: error.message });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
