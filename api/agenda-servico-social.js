import fetch from "node-fetch";

const APP_ID = process.env.APPSHEET_APP_ID;
const API_KEY = process.env.APPSHEET_API_KEY;
const TABLE_NAME = "AGENDA SERVIÇO SOCIAL";

let cache = { ts: 0, data: null };
const CACHE_TTL_MS = 30000;

export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).end();

    const now = Date.now();
    if (cache.data && (now - cache.ts) < CACHE_TTL_MS) {
      return res.status(200).json(cache.data);
    }

    const url = \`https://api.appsheet.com/api/v2/apps/\${APP_ID}/tables/\${encodeURIComponent(TABLE_NAME)}/records\`;
    const r = await fetch(url, {
      method: "GET",
      headers: {
        "ApplicationAccessKey": vck_5nnzxT4DYsjm6HMYFjt9foIPwWz7NG8nWTPuFsJJWjWOOqIBsH4I90p7,
        "ApplicationId": 1_veAmTegrzvOSXV-2bACKkdpeRrnr9MzN5UbB4B6S5s,
        "Content-Type": "application/json"
      }
    });

    if (!r.ok) return res.status(502).json({ error: "Upstream error", status: r.status });

    const body = await r.json();
    const normalized = Array.isArray(body) ? body : (body.value || body.records || []);

    cache = { ts: now, data: normalized };
    return res.status(200).json(normalized);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
