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
  recovery_hash?: string;       // base64 (PBKDF2 of recovery code)
  recovery_salt?: string;       // base64
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
  const saltBytes = saltB64 ? fromB64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const saltBuf = saltBytes.buffer.slice(saltBytes.byteOffset, saltBytes.byteOffset + saltBytes.byteLength) as ArrayBuffer;
  const pwdBytes = new TextEncoder().encode(password);
  const pwdBuf = pwdBytes.buffer.slice(pwdBytes.byteOffset, pwdBytes.byteOffset + pwdBytes.byteLength) as ArrayBuffer;
  const key = await crypto.subtle.importKey('raw', pwdBuf, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuf, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    key, 256,
  );
  return { hash: toB64(bits), salt: toB64(saltBytes) };
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

function generateRecoveryCode(): string {
  // 24 chars, grouped 4-4-4-4-4-4 for readability, base32-ish alphabet (no 0/O/1/I).
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  let s = '';
  for (let i = 0; i < bytes.length; i++) {
    s += alphabet[bytes[i] % alphabet.length];
    if ((i + 1) % 4 === 0 && i !== bytes.length - 1) s += '-';
  }
  return s;
}

function normalizeRecoveryCode(code: string): string {
  return code.replace(/[\s-]/g, '').toUpperCase();
}

function isSystemAdminRole(role?: string | null): boolean {
  return role === 'admin' || role === 'developer';
}

async function ensureLocalUserForProfile(profile: Partial<LocalUser> & { user_id?: string; id?: string }): Promise<LocalUser | null> {
  const email = profile.email?.trim().toLowerCase();
  const id = profile.user_id ?? profile.id;
  if (!email || !id) return null;

  const existing = await findUserByEmail(email);
  if (existing) return existing;

  const user: LocalUser = {
    id,
    email,
    name: profile.name ?? email.split('@')[0],
    department: profile.department ?? null,
    phone: profile.phone ?? null,
    organization_id: profile.organization_id ?? null,
    active: profile.active !== false,
    created_at: profile.created_at ?? new Date().toISOString(),
  };
  await putRow('local_users', user);
  return user;
}

export async function signUp(
  email: string,
  password: string,
  meta?: { name?: string; department?: string; phone?: string; role?: AppRole; organization_id?: string | null },
): Promise<{ user: LocalSession['user'] | null; session: LocalSession | null; recoveryCode?: string | null; error: any }> {
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

  // Generate a one-time recovery code so the user can reset their password offline.
  const recoveryCode = generateRecoveryCode();
  const { hash: recHash, salt: recSalt } = await hashPassword(normalizeRecoveryCode(recoveryCode));

  const user: LocalUser = {
    id, email: emailTrim,
    name: meta?.name ?? emailTrim.split('@')[0],
    department: meta?.department ?? null,
    phone: meta?.phone ?? null,
    organization_id: meta?.organization_id ?? null,
    password_hash: hash, password_salt: salt,
    recovery_hash: recHash, recovery_salt: recSalt,
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

  return { user: { id, email: emailTrim, user_metadata: { name: user.name ?? null } }, session: null, recoveryCode, error: null };
}

// Reset password using the recovery code shown at signup.
export async function resetPasswordWithRecoveryCode(
  email: string, recoveryCode: string, newPassword: string,
): Promise<{ error: any }> {
  const user = await findUserByEmail(email.trim());
  if (!user || !user.recovery_hash || !user.recovery_salt) {
    return { error: { message: 'کاربر یا کد بازیابی نامعتبر است' } };
  }
  const ok = await verifyPassword(normalizeRecoveryCode(recoveryCode), user.recovery_hash, user.recovery_salt);
  if (!ok) return { error: { message: 'کد بازیابی نادرست است' } };

  const { hash, salt } = await hashPassword(newPassword);
  await updateRow('local_users', user.id, {
    password_hash: hash, password_salt: salt,
  });
  return { error: null };
}

// Generate a NEW recovery code (invalidates the old one). Returns plaintext once.
export async function regenerateRecoveryCode(userId: string): Promise<{ recoveryCode: string | null; error: any }> {
  const all = (await getAll('local_users')) as LocalUser[];
  const user = all.find((u) => u.id === userId);
  if (!user) return { recoveryCode: null, error: { message: 'user not found' } };
  const code = generateRecoveryCode();
  const { hash, salt } = await hashPassword(normalizeRecoveryCode(code));
  await updateRow('local_users', user.id, { recovery_hash: hash, recovery_salt: salt });
  return { recoveryCode: code, error: null };
}

// Emergency: reset password of the (first) admin user when recovery code is lost.
// Only allowed when there is at least one admin and the caller types the confirmation phrase.
export async function emergencyResetAdminPassword(
  newPassword: string,
  confirmation: string,
  targetEmail?: string,
): Promise<{ email: string | null; error: any }> {
  if (confirmation !== 'RESET-ADMIN') {
    return { email: null, error: { message: 'عبارت تأیید نادرست است' } };
  }
  if (!newPassword || newPassword.length < 8) {
    return { email: null, error: { message: 'رمز جدید باید حداقل ۸ کاراکتر باشد' } };
  }
  const roles = (await getAll('user_roles')) as Array<{ user_id: string; role: string; created_at?: string }>;
  const privilegedRoles = roles.filter((r) => isSystemAdminRole(r.role));
  const privilegedUserIds = privilegedRoles.map((r) => r.user_id);
  const users = (await getAll('local_users')) as LocalUser[];
  const profiles = (await getAll('user_profiles')) as Array<Partial<LocalUser> & { user_id?: string }>;

  let admin: LocalUser | null = null;
  const emailTrim = targetEmail?.trim().toLowerCase();

  if (emailTrim) {
    admin = users.find((u) => u.email.toLowerCase() === emailTrim) ?? null;
    if (!admin) {
      const profile = profiles.find((p) => p.email?.toLowerCase() === emailTrim);
      admin = profile ? await ensureLocalUserForProfile(profile) : null;
    }
    if (!admin) return { email: null, error: { message: 'این ایمیل در کاربران محلی یافت نشد' } };
    if (!privilegedUserIds.includes(admin.id)) {
      return { email: null, error: { message: 'این ایمیل نقش مدیر سیستم یا توسعه‌دهنده ندارد' } };
    }
  } else {
    if (privilegedUserIds.length === 0) {
      return { email: null, error: { message: 'هیچ کاربر مدیر سیستم/توسعه‌دهنده یافت نشد' } };
    }

    admin = users
      .filter((u) => privilegedUserIds.includes(u.id))
      .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))[0] ?? null;

    if (!admin) {
      const profile = profiles
        .filter((p) => p.user_id && privilegedUserIds.includes(p.user_id))
        .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))[0];
      admin = profile ? await ensureLocalUserForProfile(profile) : null;
    }
  }

  if (!admin) return { email: null, error: { message: 'کاربر مدیر یافت نشد' } };

  const { hash, salt } = await hashPassword(newPassword);
  // Also rotate recovery so old code (if any) is invalidated.
  const newRecovery = generateRecoveryCode();
  const { hash: rH, salt: rS } = await hashPassword(normalizeRecoveryCode(newRecovery));
  await updateRow('local_users', admin.id, {
    password_hash: hash, password_salt: salt,
    recovery_hash: rH, recovery_salt: rS,
    active: true,
  });
  return { email: admin.email, error: null };
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
