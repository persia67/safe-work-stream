// Local-first data layer backed by IndexedDB.
// Provides a Supabase-like chainable API so existing UI code keeps working
// without any changes. All data lives in the user's browser/Electron storage.

const DB_NAME = 'hse_local_db_v1';
const DB_VERSION = 2;

// Tables we mirror from the previous Supabase schema. The "view"
// health_examinations_limited is treated as an alias of health_examinations.
export const TABLES = [
  'organizations',
  'user_profiles',
  'user_roles',
  'role_audit_log',
  'local_users',          // local-only: holds password hashes
  'role_permissions',     // developer-managed RBAC matrix
  'personnel_health_files',
  'personnel_health_events',
  'health_examinations',
  'occupational_health_records',
  'ergonomic_assessments',
  'risk_assessments',
  'safety_trainings',
  'incidents',
  'work_permits',
  'daily_reports',
] as const;

export type TableName = (typeof TABLES)[number] | 'health_examinations_limited';

function resolveTable(name: string): string {
  if (name === 'health_examinations_limited') return 'health_examinations';
  return name;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const t of TABLES) {
        if (!db.objectStoreNames.contains(t)) {
          db.createObjectStore(t, { keyPath: 'id' });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx<T>(table: string, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => T | Promise<T>): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(table, mode);
    const store = t.objectStore(table);
    let result: any;
    Promise.resolve(fn(store)).then((r) => { result = r; }).catch(reject);
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAll(table: string): Promise<any[]> {
  const t = resolveTable(table);
  return tx(t, 'readonly', (store) => reqToPromise(store.getAll()));
}

export async function getById(table: string, id: string): Promise<any | null> {
  const t = resolveTable(table);
  const v = await tx(t, 'readonly', (store) => reqToPromise(store.get(id)));
  return v ?? null;
}

export async function putRow(table: string, row: any): Promise<any> {
  const t = resolveTable(table);
  const withTs = {
    ...row,
    id: row.id ?? crypto.randomUUID(),
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await tx(t, 'readwrite', (store) => reqToPromise(store.put(withTs)));
  return withTs;
}

export async function updateRow(table: string, id: string, patch: any): Promise<any | null> {
  const t = resolveTable(table);
  const existing = await getById(t, id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id, updated_at: new Date().toISOString() };
  await tx(t, 'readwrite', (store) => reqToPromise(store.put(updated)));
  return updated;
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const t = resolveTable(table);
  await tx(t, 'readwrite', (store) => reqToPromise(store.delete(id)));
}

export async function deleteWhere(table: string, predicate: (r: any) => boolean): Promise<void> {
  const rows = await getAll(table);
  const t = resolveTable(table);
  await Promise.all(
    rows.filter(predicate).map((r) =>
      tx(t, 'readwrite', (store) => reqToPromise(store.delete(r.id)))
    )
  );
}

export async function clearTable(table: string): Promise<void> {
  const t = resolveTable(table);
  await tx(t, 'readwrite', (store) => reqToPromise(store.clear()));
}

export async function countTable(table: string): Promise<number> {
  const t = resolveTable(table);
  return tx(t, 'readonly', (store) => reqToPromise(store.count()));
}

// ---------- Supabase-like chainable query builder ----------

type Filter = { col: string; op: 'eq' | 'neq' | 'in' | 'gte' | 'lte'; val: any };

class QueryBuilder<T = any> implements PromiseLike<{ data: T | null; error: any }> {
  private filters: Filter[] = [];
  private orderCol?: string;
  private orderAsc = true;
  private limitN?: number;
  private mode: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private wantSingle = false;
  private wantMaybeSingle = false;
  private returning = true; // controlled by .select() after mutation

  constructor(private table: string) {}

  select(_cols?: string): this {
    if (this.mode === 'select') {
      this.returning = true;
    } else {
      // After insert/update: caller wants data back
      this.returning = true;
    }
    return this;
  }

  eq(col: string, val: any): this { this.filters.push({ col, op: 'eq', val }); return this; }
  neq(col: string, val: any): this { this.filters.push({ col, op: 'neq', val }); return this; }
  in(col: string, val: any[]): this { this.filters.push({ col, op: 'in', val }); return this; }
  gte(col: string, val: any): this { this.filters.push({ col, op: 'gte', val }); return this; }
  lte(col: string, val: any): this { this.filters.push({ col, op: 'lte', val }); return this; }

  order(col: string, opts?: { ascending?: boolean }): this {
    this.orderCol = col;
    this.orderAsc = opts?.ascending !== false;
    return this;
  }

  limit(n: number): this { this.limitN = n; return this; }

  single(): this { this.wantSingle = true; return this; }
  maybeSingle(): this { this.wantMaybeSingle = true; return this; }

  insert(row: any | any[]): this { this.mode = 'insert'; this.payload = row; this.returning = false; return this; }
  update(row: any): this { this.mode = 'update'; this.payload = row; this.returning = false; return this; }
  delete(): this { this.mode = 'delete'; this.returning = false; return this; }
  upsert(row: any | any[]): this { this.mode = 'insert'; this.payload = row; this.returning = false; return this; }

  private applyFilters(rows: any[]): any[] {
    return rows.filter((r) =>
      this.filters.every((f) => {
        const v = r?.[f.col];
        switch (f.op) {
          case 'eq': return v === f.val;
          case 'neq': return v !== f.val;
          case 'in': return Array.isArray(f.val) && f.val.includes(v);
          case 'gte': return v >= f.val;
          case 'lte': return v <= f.val;
        }
      })
    );
  }

  private async run(): Promise<{ data: any; error: any }> {
    try {
      const table = this.table;
      if (this.mode === 'select') {
        let rows = await getAll(table);
        rows = this.applyFilters(rows);
        if (this.orderCol) {
          rows.sort((a, b) => {
            const av = a?.[this.orderCol!];
            const bv = b?.[this.orderCol!];
            if (av === bv) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            return (av < bv ? -1 : 1) * (this.orderAsc ? 1 : -1);
          });
        }
        if (this.limitN != null) rows = rows.slice(0, this.limitN);
        if (this.wantSingle) return { data: rows[0] ?? null, error: rows.length === 1 ? null : (rows.length === 0 ? { message: 'No rows' } : null) };
        if (this.wantMaybeSingle) return { data: rows[0] ?? null, error: null };
        return { data: rows, error: null };
      }

      if (this.mode === 'insert') {
        const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
        const saved: any[] = [];
        for (const r of rows) saved.push(await putRow(table, r));
        const data = this.wantSingle ? saved[0] : saved;
        return { data, error: null };
      }

      if (this.mode === 'update') {
        let rows = await getAll(table);
        rows = this.applyFilters(rows);
        const saved: any[] = [];
        for (const r of rows) {
          const u = await updateRow(table, r.id, this.payload);
          if (u) saved.push(u);
        }
        const data = this.wantSingle ? saved[0] ?? null : saved;
        return { data, error: null };
      }

      if (this.mode === 'delete') {
        let rows = await getAll(table);
        rows = this.applyFilters(rows);
        for (const r of rows) await deleteRow(table, r.id);
        return { data: rows, error: null };
      }

      return { data: null, error: { message: 'Unknown mode' } };
    } catch (e: any) {
      return { data: null, error: { message: e?.message || String(e) } };
    }
  }

  then<R1 = { data: any; error: any }, R2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    return this.run().then(onfulfilled as any, onrejected as any);
  }
}

export function from(table: string): any {
  const remoteUrl = (import.meta as any).env?.VITE_SERVER_URL;
  if (remoteUrl) {
    // Dynamic import kept as a Promise-returning proxy would break sync callers,
    // so we rely on the static import (tree-shaken when unused).
    return remoteFromLazy(resolveTable(table));
  }
  return new QueryBuilder(resolveTable(table));
}

// Static import from a sibling module (loaded only if server mode is on at runtime).
import { remoteFrom as _remoteFrom } from './remoteAdapter';
function remoteFromLazy(t: string) { return _remoteFrom(t); }
