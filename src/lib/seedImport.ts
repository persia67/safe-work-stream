// One-time seed import: on the very first run we load /seed/seed.json
// (exported from the previous Supabase project) into IndexedDB. After the
// first run, this is a no-op.

import { TABLES, countTable, putRow } from './localDB';

const SEED_FLAG = 'hse_seed_imported_v1';

export async function importSeedIfNeeded(): Promise<void> {
  if (localStorage.getItem(SEED_FLAG)) return;

  try {
    const resp = await fetch('/seed/seed.json', { cache: 'no-store' });
    if (!resp.ok) {
      localStorage.setItem(SEED_FLAG, '1');
      return;
    }
    const data = await resp.json();

    for (const t of TABLES) {
      if (t === 'local_users') continue; // handled separately below
      const rows = data[t];
      if (!Array.isArray(rows) || rows.length === 0) continue;
      const existing = await countTable(t);
      if (existing > 0) continue;
      for (const r of rows) {
        // Ensure id present
        if (!r.id) r.id = crypto.randomUUID();
        await putRow(t, r);
      }
    }

    // Seed local_users from auth_users (no password — these accounts must use
    // "forgot password" via admin reset, or first signup with same email).
    const authUsers = Array.isArray(data.auth_users) ? data.auth_users : [];
    if (authUsers.length > 0 && (await countTable('local_users')) === 0) {
      for (const u of authUsers) {
        await putRow('local_users', {
          id: u.id,
          email: (u.email || '').toLowerCase(),
          name: u.name,
          active: true,
          created_at: u.created_at,
          // no password_hash → can't login until admin sets one
        });
      }
    }
  } catch (e) {
    console.warn('Seed import failed (continuing with empty DB):', e);
  } finally {
    localStorage.setItem(SEED_FLAG, '1');
  }
}
