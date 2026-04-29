// middleware.ts
// Place this file at the ROOT of your project (same level as app/, not inside it)
//
// ─────────────────────────────────────────────────────────────────────────────
//  How it works:
//  1. Every request to a PROTECTED route passes through here first
//  2. Middleware reads the "appUid" cookie (set by authActions.ts at login)
//  3. No cookie → redirect to "/" (login page) immediately, before page loads
//  4. Cookie found → allow request through normally
//
//  This runs on the EDGE (before React renders anything) so there is
//  zero flash of protected content — the redirect happens at the server level.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Cookie name — must match cookieUtils.ts ──────────────────────────────────
const COOKIE_NAME = "appUid";

// ── Routes that require login ─────────────────────────────────────────────────
const PROTECTED_ROUTES = [
  "/dashboard",
  "/my-events",
  "/create-event",
  "/settings",
  "/notifications",
  "/events",          // covers /events/[id] and /events/[id]/edit
  "/explore",         // remove this if explore should be public
];

// ── Routes only for guests (logged-out users) ─────────────────────────────────
//    If a logged-in user visits these, they get sent to /dashboard
const GUEST_ONLY_ROUTES = [
  "/",               // root = login/signup page
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const uid = request.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isGuestOnly = GUEST_ONLY_ROUTES.some(
    (route) => pathname === route
  );

  // ── Not logged in → trying to access protected page → send to login ─────────
  if (isProtected && !uid) {
    const loginUrl = new URL("/", request.url);
    // Optional: remember where they were trying to go
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Already logged in → trying to visit login page → send to dashboard ──────
  if (isGuestOnly && uid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── All good → let the request through ──────────────────────────────────────
  return NextResponse.next();
}

// ── Tell Next.js WHICH paths to run middleware on ─────────────────────────────
//    This matcher prevents middleware running on static files, images, and
//    Next.js internals — keeping it fast.
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - api routes (handle auth separately if needed)
     * - public folder files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};