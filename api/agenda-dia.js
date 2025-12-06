import fetch from 'node-fetch';
const APP_ID = process.env.APPSHEET_APP_ID;
const API_KEY = process.env.APPSHEET_API_KEY;
const TABLE = "AGENDA DO DIA";
let cache = { ts:0, data:null };
const TTL = 30*1000;
export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(204).end();
  try{
    const now = Date.now();
    if(cache.data && (now - cache.ts) < TTL) return res.status(200).json(cache.data);
    const url = `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/${encodeURIComponent(TABLE)}/records`;
    const r = await fetch(url, { method:'GET', headers:{ 'ApplicationAccessKey': API_KEY, 'ApplicationId': APP_ID, 'Content-Type':'application/json' } });
    if(!r.ok){ const txt=await r.text(); return res.status(502).json({error:'upstream', status:r.status, detail: txt}); }
    const body = await r.json();
    const normalized = Array.isArray(body)? body : (body.value || body.records || []);
    cache = { ts: now, data: normalized };
    return res.status(200).json(normalized);
  }catch(e){
    console.error(e); return res.status(500).json({ error: String(e) });
  }
}
