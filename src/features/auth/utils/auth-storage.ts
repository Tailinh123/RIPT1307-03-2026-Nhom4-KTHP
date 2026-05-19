type StorageMode = 'local' | 'session';

const AUTH_TOKEN_KEY = 'intern-match-access-token';

function getStorage(mode: StorageMode) {
  return mode === 'local' ? window.localStorage : window.sessionStorage;
}

export function saveStoredToken(token: string, mode: StorageMode) {
  clearStoredToken();
  getStorage(mode).setItem(AUTH_TOKEN_KEY, token);
}

export function getStoredToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? window.sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearStoredToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
}
