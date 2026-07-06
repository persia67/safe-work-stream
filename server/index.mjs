// Minimal internal-company sync server.
// Storage: single SQLite file (`hse.db` in the working directory).
// API: /api/:table with GET (list+filter), POST (insert), PATCH (update where), DELETE (where).
// Filters use querystring keys `eq:col`, `neq:col`, `in:col`, `gte:col`, `lte:col`
// with URL-encoded JSON values, matching src/lib/remoteAdapter.ts.
//
// Install once:  npm install --prefix server
// Run:           npm start --prefix server   (defaults to http://0.0.0.0:4000)

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import crypto from 'node:crypto';

const PORT = process.env.PORT || 4000;
const DB_PATH = process.env.HSE_DB || 'hse.db';

const TABLES = [
  'organizations', 'user_profiles', 'user_roles', 'role_audit_log',
  'local_users', 'role_permissions',
  'personnel_health_files', 'personnel_health_events',
  'health_examinations', 'occupational_health_records',
  'ergonomic_assessments', 'risk_assessments',
  'safety_trainings', 'incidents', 'work_permits', 'daily_reports',
];

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
for (const t of TABLES) {
  // Every row is stored as JSON keyed by id. Simple, flexible, schema-free.
  db.exec(`CREATE TABLE IF NOT EXISTS "${t}" (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function assertTable(name) {
  if (!TABLES.includes(name)) throw new Error(`unknown table ${name}`);
}

function parseFilters(query) {
  const filters = [];
  let order = null, limit = null;
  for (const [k, v] of Object.entries(query)) {
    if (k === 'order') { const [col, dir] = String(v).split(':'); order = { col, dir: dir === 'desc' ? 'desc' : 'asc' }; continue; }
    if (k === 'limit') { limit = Number(v); continue; }
    const [op, col] = k.split(':');
    if (!op || !col) continue;
    try { filters.push({ op, col, val: JSON.parse(String(v)) }); } catch {}
  }
  return { filters, order, limit };
}

function applyFilters(rows, filters, order, limit) {
  let out = rows.filter((r) => filters.every((f) => {
    const v = r?.[f.col];
    switch (f.op) {
      case 'eq': return v === f.val;
      case 'neq': return v !== f.val;
      case 'in': return Array.isArray(f.val) && f.val.includes(v);
      case 'gte': return v >= f.val;
      case 'lte': return v <= f.val;
      default: return true;
    }
  }));
  if (order) {
    out.sort((a, b) => {
      const av = a?.[order.col], bv = b?.[order.col];
      if (av === bv) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av < bv ? -1 : 1) * (order.dir === 'asc' ? 1 : -1);
    });
  }
  if (limit != null) out = out.slice(0, limit);
  return out;
}

app.get('/api/health', (_req, res) => res.json({ ok: true, tables: TABLES.length }));

app.get('/api/:table', (req, res) => {
  try {
    assertTable(req.params.table);
    const rows = db.prepare(`SELECT data FROM "${req.params.table}"`).all().map((r) => JSON.parse(r.data));
    const { filters, order, limit } = parseFilters(req.query);
    res.json(applyFilters(rows, filters, order, limit));
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/:table', (req, res) => {
  try {
    assertTable(req.params.table);
    const rows = Array.isArray(req.body) ? req.body : [req.body];
    const stmt = db.prepare(`INSERT OR REPLACE INTO "${req.params.table}" (id, data, updated_at) VALUES (?, ?, ?)`);
    const now = new Date().toISOString();
    const saved = [];
    const tx = db.transaction((items) => {
      for (const r of items) {
        const row = { ...r, id: r.id ?? crypto.randomUUID(), updated_at: now, created_at: r.created_at ?? now };
        stmt.run(row.id, JSON.stringify(row), now);
        saved.push(row);
      }
    });
    tx(rows);
    res.status(201).json(saved);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.patch('/api/:table', (req, res) => {
  try {
    assertTable(req.params.table);
    const all = db.prepare(`SELECT data FROM "${req.params.table}"`).all().map((r) => JSON.parse(r.data));
    const { filters } = parseFilters(req.query);
    const matches = applyFilters(all, filters, null, null);
    const stmt = db.prepare(`INSERT OR REPLACE INTO "${req.params.table}" (id, data, updated_at) VALUES (?, ?, ?)`);
    const now = new Date().toISOString();
    const saved = [];
    const tx = db.transaction((items) => {
      for (const r of items) {
        const merged = { ...r, ...req.body, id: r.id, updated_at: now };
        stmt.run(merged.id, JSON.stringify(merged), now);
        saved.push(merged);
      }
    });
    tx(matches);
    res.json(saved);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/:table', (req, res) => {
  try {
    assertTable(req.params.table);
    const all = db.prepare(`SELECT data FROM "${req.params.table}"`).all().map((r) => JSON.parse(r.data));
    const { filters } = parseFilters(req.query);
    const matches = applyFilters(all, filters, null, null);
    const stmt = db.prepare(`DELETE FROM "${req.params.table}" WHERE id = ?`);
    const tx = db.transaction((items) => { for (const r of items) stmt.run(r.id); });
    tx(matches);
    res.status(204).end();
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`HSE internal server on http://0.0.0.0:${PORT}  (db=${DB_PATH})`));
