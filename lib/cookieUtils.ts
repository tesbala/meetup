// lib/cookieUtils.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Cookie helpers for persisting the logged-in user's UID across visits.
//  All pages read the UID from this cookie and fetch Firestore directly —
//  no sign-in required on return visits.
// ─────────────────────────────────────────────────────────────────────────────

const COOKIE_NAME = "appUid";
const MAX_AGE_DAYS = 30; // cookie lasts 30 days

// ─── Write the UID cookie after a successful login / signup ──────────────────
export function setAuthCookie(uid: string): void {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60; // seconds
  document.cookie = `${COOKIE_NAME}=${uid}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// ─── Read the UID cookie (returns null if not present) ───────────────────────
export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null; // SSR guard
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${COOKIE_NAME}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

// ─── Delete the UID cookie on logout ─────────────────────────────────────────
export function clearAuthCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}