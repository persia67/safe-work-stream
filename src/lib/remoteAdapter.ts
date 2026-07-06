// Optional REST client that mirrors the localDB.from() query builder.
// Activated only when VITE_SERVER_URL is set at build time. When active,
// every table CRUD flows to the internal-company server (SQLite-backed).
//
// The adapter keeps a shadow copy in IndexedDB for offline reads.

import { putRow, getAll } from './localDB.helpers';

const BASE = (import.meta as any).env?.VITE_SERVER_URL || '';
export const REMOTE_ENABLED = !!BASE;

function authHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem('hse_local_session_v1');
    if (!raw) return {};
    const s = JSON.parse(raw);
    return s?.access_token ? { Authorization: `Bearer ${s.access_token}` } : {};
  } catch { return {}; }
}

async function req(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`server ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

interface Filter { col: string; op: string; val: any }

export class RemoteQuery {
  private filters: Filter[] = [];
  private orderCol?: string;
  private orderAsc = true;
  private limitN?: number;
  private mode: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private wantSingle = false;

  constructor(private table: string) {}

  select() { return this; }
  eq(c: string, v: any) { this.filters.push({ col: c, op: 'eq', val: v }); return this; }
  neq(c: string, v: any) { this.filters.push({ col: c, op: 'neq', val: v }); return this; }
  in(c: string, v: any[]) { this.filters.push({ col: c, op: 'in', val: v }); return this; }
  gte(c: string, v: any) { this.filters.push({ col: c, op: 'gte', val: v }); return this; }
  lte(c: string, v: any) { this.filters.push({ col: c, op: 'lte', val: v }); return this; }
  order(c: string, o?: { ascending?: boolean }) { this.orderCol = c; this.orderAsc = o?.ascending !== false; return this; }
  limit(n: number) { this.limitN = n; return this; }
  single() { this.wantSingle = true; return this; }
  maybeSingle() { this.wantSingle = true; return this; }
  insert(row: any) { this.mode = 'insert'; this.payload = row; return this; }
  upsert(row: any) { this.mode = 'insert'; this.payload = row; return this; }
  update(row: any) { this.mode = 'update'; this.payload = row; return this; }
  delete() { this.mode = 'delete'; return this; }

  private query() {
    const p = new URLSearchParams();
    for (const f of this.filters) p.append(`${f.op}:${f.col}`, JSON.stringify(f.val));
    if (this.orderCol) p.append('order', `${this.orderCol}:${this.orderAsc ? 'asc' : 'desc'}`);
    if (this.limitN != null) p.append('limit', String(this.limitN));
    return p.toString() ? `?${p.toString()}` : '';
  }

  async run(): Promise<{ data: any; error: any }> {
    try {
      const path = `/api/${this.table}`;
      if (this.mode === 'select') {
        const rows = await req(path + this.query());
        // shadow cache
        try { for (const r of rows || []) await putRow(this.table, r); } catch {}
        return { data: this.wantSingle ? (rows?.[0] ?? null) : rows, error: null };
      }
      if (this.mode === 'insert') {
        const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
        const saved = await req(path, { method: 'POST', body: JSON.stringify(rows) });
        try { for (const r of saved || []) await putRow(this.table, r); } catch {}
        return { data: this.wantSingle ? saved?.[0] ?? saved : saved, error: null };
      }
      if (this.mode === 'update') {
        const saved = await req(path + this.query(), { method: 'PATCH', body: JSON.stringify(this.payload) });
        return { data: saved, error: null };
      }
      if (this.mode === 'delete') {
        await req(path + this.query(), { method: 'DELETE' });
        return { data: null, error: null };
      }
      return { data: null, error: { message: 'unknown mode' } };
    } catch (e: any) {
      // Fallback to local read on network failure
      if (this.mode === 'select') {
        try {
          const local = await getAll(this.table);
          return { data: this.wantSingle ? (local[0] ?? null) : local, error: null };
        } catch {}
      }
      return { data: null, error: { message: e?.message || 'network error' } };
    }
  }

  then<R1, R2>(ok?: any, err?: any) { return this.run().then(ok, err); }
}

export function remoteFrom(table: string) { return new RemoteQuery(table); }
