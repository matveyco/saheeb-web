const ANONYMOUS_ID_STORAGE_KEY = 'saheeb-anonymous-id';
const SESSION_ID_STORAGE_KEY = 'saheeb-session-id';

interface AnalyticsIdentity {
  anonymousId: string | null;
  sessionId: string | null;
}

function canUseDom() {
  return typeof window !== 'undefined';
}

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 12)}_${Date.now().toString(36)}`;
}

function getStorage(kind: 'local' | 'session') {
  if (!canUseDom()) {
    return null;
  }

  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function readValue(kind: 'local' | 'session', key: string) {
  const storage = getStorage(kind);
  if (!storage) {
    return null;
  }

  const value = storage.getItem(key)?.trim();
  return value ? value : null;
}

function writeValue(kind: 'local' | 'session', key: string, value: string) {
  const storage = getStorage(kind);
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {}
}

export function readAnalyticsIdentity(): AnalyticsIdentity {
  return {
    anonymousId: readValue('local', ANONYMOUS_ID_STORAGE_KEY),
    sessionId: readValue('session', SESSION_ID_STORAGE_KEY),
  };
}

export function ensureAnalyticsIdentity(): AnalyticsIdentity {
  if (!canUseDom()) {
    return {
      anonymousId: null,
      sessionId: null,
    };
  }

  let anonymousId = readValue('local', ANONYMOUS_ID_STORAGE_KEY);
  if (!anonymousId) {
    anonymousId = generateId('anon');
    writeValue('local', ANONYMOUS_ID_STORAGE_KEY, anonymousId);
  }

  let sessionId = readValue('session', SESSION_ID_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateId('sess');
    writeValue('session', SESSION_ID_STORAGE_KEY, sessionId);
  }

  return { anonymousId, sessionId };
}

export function createAnalyticsEventId(prefix = 'evt') {
  return generateId(prefix);
}
