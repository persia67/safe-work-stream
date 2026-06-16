// Local-only authentication: PBKDF2-hashed passwords stored in IndexedDB,
// session token persisted in localStorage. Works fully offline.

import { from, putRow, getAll, countTable, updateRow } from './localDB';

const SESSION_KEY = 'hse_local_session_v1';
const PBKDF2_ITERS = 250_000;

type AppRole =
  | 'admin' | 'safety_officer' | 'supervisor' | 'medical_officer'
  | 'senior_manager' | 'developer' | 'viewer';

export interface LocalUser {
  id: string;
  email: string;
  name?: string | null;
  department?: string | null;
  phone?: string | null;
  organization_id?: string | null;
  password_hash?: string;       // base64
  password_salt?: string;       // base64
  active?: boolean;
  created_at?: string;
}

export interface LocalSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email: string; user_metadata: { name?: string | null } };
}

// -------- crypto helpers --------
function toB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = ''; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function fromB64(s: string): Uint8Array {
  const bin = atob(s); const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hashPassword(password: string, saltB64?: string): Promise<{ hash: string; salt: string }> {
  const salt = saltB64 ? fromB64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    key, 256,
  );
  return { hash: toB64(bits), salt: toB64(salt) };
}

async function verifyPassword(password: string, hashB64: string, saltB64: string): Promise<boolean> {
  const { hash } = await hashPassword(password, saltB64);
  return hash === hashB64;
}

// -------- session store --------
const listeners = new Set<(event: string, session: LocalSession | null) => void>();

function notify(event: string, session: LocalSession | null) {
  for (const l of listeners) try { l(event, session); } catch {}
}

export function getStoredSession(): LocalSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as LocalSession;
    if (s.expires_at && s.expires_at < Date.now() / 1000) return null;
    return s;
  } catch { return null; }
}

function setStoredSession(s: LocalSession | null) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}

export function onAuthChange(cb: (event: string, session: LocalSession | null) => void): { data: { subscription: { unsubscribe: () => void } } } {
  listeners.add(cb);
  return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
}

// -------- core API --------

async function findUserByEmail(email: string): Promise<LocalUser | null> {
  const all = (await getAll('local_users')) as LocalUser[];
  return all.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

function buildSession(user: LocalUser): LocalSession {
  return {
    access_token: `local_${user.id}_${Date.now()}`,
    refresh_token: `local_refresh_${user.id}`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    user: { id: user.id, email: user.email, user_metadata: { name: user.name ?? null } },
  };
}

export async function signUp(
  email: string,
  password: string,
  meta?: { name?: string; department?: string; phone?: string; role?: AppRole; organization_id?: string | null },
): Promise<{ user: LocalSession['user'] | null; session: LocalSession | null; error: any }> {
  const emailTrim = email.trim().toLowerCase();
  const existing = await findUserByEmail(emailTrim);
  if (existing) return { user: null, session: null, error: { message: 'already registered' } };

  const totalUsers = await countTable('local_users');
  const isFirstUser = totalUsers === 0;

  // Only the first-ever signup is allowed without admin approval.
  // Subsequent signups must go through admin-managed creation.
  if (!isFirstUser && !meta?.role) {
    return { user: null, session: null, error: { message: 'ثبت‌نام عمومی غیرفعال است. لطفاً از مدیر سیستم درخواست حساب کنید.' } };
  }

  const { hash, salt } = await hashPassword(password);
  const id = crypto.randomUUID();
  const role: AppRole = isFirstUser ? 'admin' : (meta?.role ?? 'viewer');

  const user: LocalUser = {
    id, email: emailTrim,
    name: meta?.name ?? emailTrim.split('@')[0],
    department: meta?.department ?? null,
    phone: meta?.phone ?? null,
    organization_id: meta?.organization_id ?? null,
    password_hash: hash, password_salt: salt,
    active: true,
    created_at: new Date().toISOString(),
  };
  await putRow('local_users', user);

  // Mirror into user_profiles so existing UI keeps reading it.
  await putRow('user_profiles', {
    id: crypto.randomUUID(),
    user_id: id,
    name: user.name,
    email: user.email,
    department: user.department,
    phone: user.phone,
    organization_id: user.organization_id,
    active: true,
  });

  // Assign role.
  await putRow('user_roles', {
    id: crypto.randomUUID(), user_id: id, role,
  });

  // Audit.
  await putRow('role_audit_log', {
    id: crypto.randomUUID(),
    user_id: id, target_user_id: id, changed_by: id,
    role_changed: role, action: 'granted',
    changed_at: new Date().toISOString(),
  });

  return { user: { id, email: emailTrim, user_metadata: { name: user.name ?? null } }, session: null, error: null };
}

export async function signIn(email: string, password: string): Promise<{ session: LocalSession | null; error: any }> {
  const user = await findUserByEmail(email.trim());
  if (!user || !user.password_hash || !user.password_salt) {
    return { session: null, error: { message: 'Invalid login credentials' } };
  }
  if (user.active === false) return { session: null, error: { message: 'Account is disabled' } };
  const ok = await verifyPassword(password, user.password_hash, user.password_salt);
  if (!ok) return { session: null, error: { message: 'Invalid login credentials' } };

  const session = buildSession(user);
  setStoredSession(session);
  notify('SIGNED_IN', session);
  return { session, error: null };
}

export async function signOut(): Promise<void> {
  setStoredSession(null);
  notify('SIGNED_OUT', null);
}

export async function getUser(): Promise<{ user: LocalSession['user'] | null }> {
  const s = getStoredSession();
  return { user: s?.user ?? null };
}

export async function getSession(): Promise<{ session: LocalSession | null }> {
  return { session: getStoredSession() };
}

// Admin helper: create user with role, used by UserManagement panel.
export async function adminCreateUser(input: {
  email: string; password: string; name: string;
  department?: string | null; phone?: string | null;
  role: AppRole; organization_id?: string | null;
}): Promise<{ error: any }> {
  // Reuse signUp with explicit role so quota check passes.
  const { error } = await signUp(input.email, input.password, {
    name: input.name,
    department: input.department ?? undefined,
    phone: input.phone ?? undefined,
    role: input.role,
    organization_id: input.organization_id ?? null,
  });
  return { error };
}

// Allow first signup detection in UI.
export async function isFirstSignup(): Promise<boolean> {
  return (await countTable('local_users')) === 0;
}

// Reset (delete) all local data — handy for "factory reset".
export async function wipeLocal(): Promise<void> {
  setStoredSession(null);
  // Caller should also clear IndexedDB if they want a full wipe.
}
