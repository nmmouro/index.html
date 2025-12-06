// api/lancamentos.js
import fetch from "node-fetch";

const APP_ID = process.env.APPSHEET_APP_ID;
const API_KEY = process.env.APPSHEET_API_KEY;
const TABLE_NAME = "LANÇAMENTOS";

// cache simples (in-memory, por instância)
let cache = { ts: 0, data: null };
const CACHE_TTL_MS = 30 * 1000; // 30s cache para reduzir chamadas

export default async function handler(req, res) {
  try {
    // CORS - permitir somente seu frontend em produção (substitua se quiser)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();

    const now = Date.now();
    if (cache.data && (now - cache.ts) < CACHE_TTL_MS) {
      return res.status(200).json(cache.data);
    }

    const url = `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/${encodeURIComponent(TABLE_NAME)}/records`;
    const r = await fetch(url, {
      method: "GET",
      headers: {
        "ApplicationAccessKey": API_KEY,
        "ApplicationId": APP_ID,
        "Content-Type": "application/json"
      }
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: "Upstream error", status: r.status, detail: text });
    }

    const body = await r.json();
    // opcional: normalize / filtrar campos relevantes
    const normalized = Array.isArray(body) ? body : (body.value || body.records || []);

    cache = { ts: now, data: normalized };
    return res.status(200).json(normalized);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
