// Offline AI provider with automatic fallback.
// 1. If user configured a local AI endpoint (Ollama by default) and it
//    responds, stream from it.
// 2. Otherwise stream from the online Supabase edge function.
// Both online and offline paths emit identical chunks via the same callback,
// so the chat UI does not need to know which one is active.

import { supabase } from '@/integrations/supabase/client';

const SETTINGS_KEY = 'hse_offline_ai_settings_v1';

export interface OfflineAISettings {
  enabled: boolean;
  endpoint: string;   // e.g. http://localhost:11434
  model: string;      // e.g. llama3.1
  preferOffline: boolean;
}

const DEFAULT_SETTINGS: OfflineAISettings = {
  enabled: false,
  endpoint: 'http://localhost:11434',
  model: 'llama3.1',
  preferOffline: false,
};

export function getOfflineAISettings(): OfflineAISettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveOfflineAISettings(s: OfflineAISettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export async function pingOllama(endpoint: string, timeoutMs = 2500): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(`${endpoint.replace(/\/$/, '')}/api/tags`, { signal: ctrl.signal });
    return resp.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamHandlers {
  onDelta: (chunk: string) => void;
  onSource?: (source: 'ollama' | 'cloud') => void;
}

async function streamOllama(
  endpoint: string,
  model: string,
  messages: ChatMessage[],
  handlers: StreamHandlers
): Promise<boolean> {
  try {
    const resp = await fetch(`${endpoint.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
    });
    if (!resp.ok || !resp.body) return false;
    handlers.onSource?.('ollama');
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        try {
          const obj = JSON.parse(line);
          const delta = obj?.message?.content;
          if (delta) handlers.onDelta(delta);
        } catch {
          // ignore malformed line
        }
      }
    }
    return true;
  } catch {
    return false;
  }
}

async function streamCloud(
  _messages: ChatMessage[],
  _pageContext: string | undefined,
  _handlers: StreamHandlers
): Promise<boolean> {
  // Local-first build: cloud AI is disabled. Only the local Ollama path is used.
  return false;
}

export async function streamChat(
  messages: ChatMessage[],
  pageContext: string | undefined,
  handlers: StreamHandlers
): Promise<{ ok: boolean; source: 'ollama' | 'cloud' | 'none' }> {
  const settings = getOfflineAISettings();
  const offlineFirst = settings.enabled && (settings.preferOffline || !navigator.onLine);

  if (offlineFirst) {
    if (await pingOllama(settings.endpoint)) {
      const ok = await streamOllama(settings.endpoint, settings.model, messages, handlers);
      if (ok) return { ok: true, source: 'ollama' };
    }
  }

  if (navigator.onLine) {
    const ok = await streamCloud(messages, pageContext, handlers);
    if (ok) return { ok: true, source: 'cloud' };
  }

  // Final attempt — local even if not preferred
  if (settings.enabled && await pingOllama(settings.endpoint)) {
    const ok = await streamOllama(settings.endpoint, settings.model, messages, handlers);
    if (ok) return { ok: true, source: 'ollama' };
  }

  return { ok: false, source: 'none' };
}
