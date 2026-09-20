#!/usr/bin/env bun
/**
 * PricePulse Keep-Alive Ping Script
 *
 * Hits the server's /health endpoint to prevent Render from sleeping (Render spins down after 15m of inactivity).
 *
 * Usage:
 *   # Single ping (e.g. for crontab or CI):
 *   bun scripts/keep-alive.js https://your-app.onrender.com
 *   node scripts/keep-alive.js https://your-app.onrender.com
 *
 *   # Continuous loop (runs every 10 minutes):
 *   bun scripts/keep-alive.js https://your-app.onrender.com --daemon
 */

const args = process.argv.slice(2);
const targetArg = args.find((a) => !a.startsWith("--"));
const targetUrl = targetArg || process.env.RENDER_SERVER_URL || "http://localhost:3000";

const isDaemon = args.includes("--daemon");
const intervalMinutes = 10;

function getHealthUrl(base) {
    let input = base.trim();
    if (!input.startsWith("http://") && !input.startsWith("https://")) {
        input = "https://" + input;
    }
    const parsed = new URL(input);
    if (parsed.pathname === "/" || parsed.pathname === "") {
        parsed.pathname = "/health";
    }
    return parsed.toString();
}

const healthEndpoint = getHealthUrl(targetUrl);

async function ping() {
    const timeStr = new Date().toLocaleTimeString();
    const start = performance.now();

    try {
        console.log(`[${timeStr}] Pinging ${healthEndpoint}...`);
        const res = await fetch(healthEndpoint, {
            headers: {
                "User-Agent": "PricePulse-KeepAlive/1.0",
            },
        });

        const elapsed = (performance.now() - start).toFixed(0);
        if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const uptime = data.uptime ? `(server uptime: ${Math.floor(data.uptime / 60)}m ${data.uptime % 60}s)` : "";
            console.log(`[${timeStr}] ✅ Success [${res.status}] in ${elapsed}ms ${uptime}`);
        } else {
            console.warn(`[${timeStr}] ⚠️ Warning: Server responded with status ${res.status} in ${elapsed}ms`);
        }
    } catch (err) {
        const elapsed = (performance.now() - start).toFixed(0);
        console.error(`[${timeStr}] ❌ Failed after ${elapsed}ms: ${err.message}`);
    }
}

console.log(`Keep-Alive target: ${healthEndpoint}`);

await ping();

if (isDaemon) {
    console.log(`Daemon mode active: will ping every ${intervalMinutes} minutes. Press Ctrl+C to stop.\n`);
    setInterval(ping, intervalMinutes * 60 * 1000);
}
