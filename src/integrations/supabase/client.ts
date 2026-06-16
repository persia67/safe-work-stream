// Local-first adapter that exposes the same API surface as `@supabase/supabase-js`
// but reads/writes from the local IndexedDB-backed store. No network calls.
//
// This file intentionally keeps the export name `supabase` so every existing
// `import { supabase } from "@/integrations/supabase/client"` keeps compiling.

import { from as dbFrom } from '@/lib/localDB';
import {
  signIn, signUp, signOut, getSession, getUser, onAuthChange,
  type LocalSession,
} from '@/lib/localAuth';
import { importSeedIfNeeded } from '@/lib/seedImport';

// Kick off seed import as soon as the module is loaded.
importSeedIfNeeded().catch(() => {});

type AnyObj = Record<string, any>;

export const supabase = {
  from: (table: string) => dbFrom(table),

  auth: {
    async getSession() {
      const { session } = await getSession();
      return { data: { session }, error: null };
    },
    async getUser() {
      const { user } = await getUser();
      return { data: { user }, error: user ? null : { message: 'not authenticated' } };
    },
    onAuthStateChange(cb: (event: string, session: LocalSession | null) => void) {
      return onAuthChange(cb);
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const { session, error } = await signIn(email, password);
      return { data: { session, user: session?.user ?? null }, error };
    },
    async signUp({ email, password, options }: { email: string; password: string; options?: { data?: AnyObj; emailRedirectTo?: string } }) {
      const meta = options?.data;
      const { user, error } = await signUp(email, password, {
        name: meta?.name,
      });
      return { data: { user, session: null }, error };
    },
    async signOut() {
      await signOut();
      return { error: null };
    },
    async setSession(_s: { access_token: string; refresh_token: string }) {
      // Local mode: no-op. Real session lives in localStorage.
      return { data: { session: await getSession().then((r) => r.session) }, error: null };
    },
    async resetPasswordForEmail(_email: string, _opts?: AnyObj) {
      return { data: null, error: { message: 'حالت محلی: لطفاً از مدیر سیستم بخواهید رمز عبور شما را بازنشانی کند.' } };
    },
    admin: {
      async listUsers() {
        const { data } = await dbFrom('local_users').select('*');
        return { data: { users: data ?? [] }, error: null };
      },
    },
  },

  functions: {
    async invoke(_name: string, _opts?: AnyObj) {
      return { data: null, error: { message: 'Edge functions are disabled in local mode.' } };
    },
  },

  channel(_name: string) {
    // No realtime in local mode.
    return {
      on() { return this; },
      subscribe() { return this; },
      unsubscribe() { return Promise.resolve('ok'); },
    };
  },

  removeChannel(_c: any) { return Promise.resolve('ok'); },
};

export default supabase;
