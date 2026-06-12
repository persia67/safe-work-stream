// Offline-capable authentication layer.
// On successful online login we cache the Supabase session + a password
// verifier locally (encrypted with the user's own password). When the device
// is offline, the cached verifier allows the same user to "log in" without
// hitting the network — the cached session is restored into supabase-js.

import { supabase } from '@/integrations/supabase/client';
import { encryptJSON, decryptJSON, hashPassword, verifyPassword, type EncryptedPayload } from './crypto';

const LS_KEY = 'hse_offline_auth_v1';

interface StoredRecord {
  email: string;
  passwordHash: string;
  passwordSalt: string;
  encryptedSession: EncryptedPayload;
  savedAt: number;
}

type RecordMap = Record<string, StoredRecord>;

function loadAll(): RecordMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as RecordMap) : {};
  } catch {
    return {};
  }
}

function saveAll(map: RecordMap) {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

function keyFor(email: string) {
  return email.trim().toLowerCase();
}

/** Persist (or refresh) the offline credential record after an online login. */
export async function persistOfflineCredentials(email: string, password: string): Promise<void> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;
  const { hash, salt } = await hashPassword(password);
  const encryptedSession = await encryptJSON(
    {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: data.session.user,
    },
    password
  );
  const map = loadAll();
  map[keyFor(email)] = {
    email: keyFor(email),
    passwordHash: hash,
    passwordSalt: salt,
    encryptedSession,
    savedAt: Date.now(),
  };
  saveAll(map);
}

export function hasOfflineCredentials(email: string): boolean {
  return !!loadAll()[keyFor(email)];
}

export function listOfflineEmails(): string[] {
  return Object.keys(loadAll());
}

/**
 * Attempt an offline login. Verifies the password locally and restores the
 * cached supabase session into the client. Returns true on success.
 */
export async function tryOfflineLogin(email: string, password: string): Promise<boolean> {
  const rec = loadAll()[keyFor(email)];
  if (!rec) return false;
  const ok = await verifyPassword(password, rec.passwordHash, rec.passwordSalt);
  if (!ok) return false;
  try {
    const session = await decryptJSON<{ access_token: string; refresh_token: string }>(
      rec.encryptedSession,
      password
    );
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    return true;
  } catch {
    return false;
  }
}

export function clearOfflineCredentials(email?: string) {
  if (!email) {
    localStorage.removeItem(LS_KEY);
    return;
  }
  const map = loadAll();
  delete map[keyFor(email)];
  saveAll(map);
}
