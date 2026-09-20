import getDb from "../db.js";

// One row per scrape cycle, success or not. Only a success row carries a price_history_id.
export async function insert(row) {
    const { error } = await getDb().from("scrape_log").insert(row);
    if (error) throw error;
}

// The audit trail, newest first. This table grows one row per scrape *cycle*, so it is capped
// by default rather than returned unbounded. Optional `productId` narrows it to one product.
export async function list({ limit = 200, productId } = {}) {
    let query = getDb()
        .from("scrape_log")
        .select("*, price_history:price_history_id(price, stock, mrp, quoted_at)")
        .order("attempted_at", { ascending: false })
        .limit(limit);

    if (productId !== undefined) query = query.eq("product_id", productId);

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row) => ({
        ...row,
        scraped_at: row.attempted_at,
        http_status: row.status === "success" ? 200 : (row.status === "structure_error" ? 422 : 500),
        price: row.price_history?.price ?? null,
        stock: row.price_history?.stock ?? null,
        mrp: row.price_history?.mrp ?? null,
        quoted_at: row.price_history?.quoted_at ?? row.attempted_at,
    }));
}
