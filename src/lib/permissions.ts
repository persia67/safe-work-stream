// Role × Module × Action permission matrix.
// Stored in local IndexedDB (table `role_permissions`) and synced when server mode is enabled.
// Only users with role `developer` can modify the matrix from the UI.

import { from, getAll, putRow, deleteRow } from './localDB';

export type AppRole =
  | 'admin' | 'safety_officer' | 'supervisor' | 'medical_officer'
  | 'senior_manager' | 'developer' | 'viewer';

export type ModuleKey =
  | 'dashboard' | 'incidents' | 'permits' | 'ergonomics' | 'risk'
  | 'safety-training' | 'health-examinations' | 'reports' | 'analytics'
  | 'user-management' | 'organizations' | 'settings' | 'ai-insights';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'approve';

export const ALL_MODULES: { key: ModuleKey; label: string }[] = [
  { key: 'dashboard', label: 'داشبورد' },
  { key: 'incidents', label: 'حوادث' },
  { key: 'permits', label: 'مجوزهای کار' },
  { key: 'ergonomics', label: 'ارگونومی' },
  { key: 'risk', label: 'ارزیابی ریسک' },
  { key: 'safety-training', label: 'آموزش ایمنی' },
  { key: 'health-examinations', label: 'پرونده سلامت' },
  { key: 'reports', label: 'گزارش روزانه' },
  { key: 'analytics', label: 'تحلیل‌ها' },
  { key: 'user-management', label: 'مدیریت کاربران' },
  { key: 'organizations', label: 'سازمان‌ها' },
  { key: 'settings', label: 'تنظیمات' },
  { key: 'ai-insights', label: 'هوش مصنوعی' },
];

export const ALL_ACTIONS: Action[] = ['view', 'create', 'edit', 'delete', 'approve'];

export const ALL_ROLES: AppRole[] = [
  'developer', 'admin', 'senior_manager', 'supervisor',
  'safety_officer', 'medical_officer', 'viewer',
];

/** Default matrix reproduces today's behaviour before granular RBAC was added. */
export function defaultMatrix(): Record<AppRole, Record<ModuleKey, Action[]>> {
  const all: Action[] = ['view', 'create', 'edit', 'delete', 'approve'];
  const view: Action[] = ['view'];
  const rw: Action[] = ['view', 'create', 'edit'];
  const rwd: Action[] = ['view', 'create', 'edit', 'delete'];

  const build = (fn: (m: ModuleKey) => Action[]): Record<ModuleKey, Action[]> => {
    const out = {} as Record<ModuleKey, Action[]>;
    for (const { key } of ALL_MODULES) out[key] = fn(key);
    return out;
  };

  return {
    developer: build(() => all),
    admin: build(() => all),
    senior_manager: build((m) =>
      m === 'user-management' || m === 'organizations' || m === 'settings' ? view :
      m === 'analytics' || m === 'ai-insights' ? view : rwd),
    supervisor: build((m) =>
      ['user-management', 'organizations', 'settings', 'analytics', 'ai-insights'].includes(m) ? [] : rw),
    safety_officer: build((m) =>
      ['user-management', 'organizations', 'settings'].includes(m) ? [] :
      m === 'health-examinations' ? view : rwd),
    medical_officer: build((m) =>
      m === 'health-examinations' ? rwd :
      m === 'dashboard' ? view : []),
    viewer: build((m) => m === 'dashboard' ? view : []),
  };
}

interface PermissionRow {
  id: string;
  role: AppRole;
  module: ModuleKey;
  actions: Action[];
}

let cache: PermissionRow[] | null = null;
let cachePromise: Promise<PermissionRow[]> | null = null;

async function loadRows(): Promise<PermissionRow[]> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    const rows = (await getAll('role_permissions')) as PermissionRow[];
    if (rows.length === 0) {
      // Seed defaults on first run
      const matrix = defaultMatrix();
      for (const role of ALL_ROLES) {
        for (const { key: module } of ALL_MODULES) {
          await putRow('role_permissions', {
            id: `${role}:${module}`,
            role, module, actions: matrix[role][module],
          });
        }
      }
      cache = (await getAll('role_permissions')) as PermissionRow[];
    } else {
      cache = rows;
    }
    return cache;
  })();
  return cachePromise;
}

export function invalidatePermissionsCache() {
  cache = null;
  cachePromise = null;
}

export async function getMatrix(): Promise<Record<AppRole, Record<ModuleKey, Action[]>>> {
  const rows = await loadRows();
  const out = defaultMatrix(); // start from defaults so missing rows fall back
  for (const r of rows) {
    if (!out[r.role]) continue;
    out[r.role][r.module] = r.actions;
  }
  return out;
}

export async function setPermissions(role: AppRole, module: ModuleKey, actions: Action[]) {
  await putRow('role_permissions', { id: `${role}:${module}`, role, module, actions });
  invalidatePermissionsCache();
}

export async function can(role: AppRole | undefined | null, module: ModuleKey, action: Action): Promise<boolean> {
  if (!role) return false;
  const m = await getMatrix();
  return m[role]?.[module]?.includes(action) ?? false;
}

// Synchronous variant that reads a snapshot (useful in render); returns false until cache warm.
export function canSync(matrix: Record<AppRole, Record<ModuleKey, Action[]>> | null, role: AppRole | undefined | null, module: ModuleKey, action: Action): boolean {
  if (!role || !matrix) return false;
  return matrix[role]?.[module]?.includes(action) ?? false;
}
