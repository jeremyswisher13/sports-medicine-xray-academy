const appOrigin = 'https://sports-xray-academy.local';

const allowedRoots = new Set([
  '/admin',
  '/atlas',
  '/cases',
  '/cheatsheets',
  '/dashboard',
  '/flashcards',
  '/modules',
  '/progress',
  '/quiz/post',
  '/videos',
  '/welcome',
]);

export function safeAppPath(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2_048) return null;

  try {
    const url = new URL(value, appOrigin);
    if (url.origin !== appOrigin || url.username || url.password) return null;

    const root = [...allowedRoots].find(
      (candidate) => url.pathname === candidate || url.pathname.startsWith(`${candidate}/`),
    );
    if (!root) return null;

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function requestedPathFromState(state: unknown): string | null {
  if (!state || typeof state !== 'object') return null;
  return safeAppPath((state as { from?: unknown }).from);
}
