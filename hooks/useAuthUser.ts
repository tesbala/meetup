// hooks/useAuthUser.ts
// ─────────────────────────────────────────────────────────────────────────────
//  Drop this hook into ANY page to get the logged-in user's Firestore profile.
//
//  HOW IT WORKS:
//  1. Reads the UID from the cookie  (set at login — no Firebase Auth needed)
//  2. Fetches /users/{uid} from Firestore
//  3. Returns { uid, profile, loading, notLoggedIn }
//
//  USAGE IN ANY PAGE:
//    const { uid, profile, loading, notLoggedIn } = useAuthUser();
//    if (loading)      return <LoadingSpinner />;
//    if (notLoggedIn)  { router.replace("/"); return null; }
//    // profile is now the full UserProfile from Firestore
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/cookieUtils";
import { getUserProfile, type UserProfile } from "@/app/actions/authActions";

export interface AuthUser {
  uid:          string | null;
  profile:      UserProfile | null;
  loading:      boolean;
  notLoggedIn:  boolean;
}

export function useAuthUser(redirectIfLoggedOut = true): AuthUser {
  const router = useRouter();
  const [uid, setUid]           = useState<string | null>(null);
  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    const cookieUid = getAuthCookie();

    if (!cookieUid) {
      // No cookie → user is logged out
      setNotLoggedIn(true);
      setLoading(false);
      if (redirectIfLoggedOut) router.replace("/");
      return;
    }

    setUid(cookieUid);

    // Fetch their Firestore profile using the cookie UID
    getUserProfile(cookieUid).then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  return { uid, profile, loading, notLoggedIn };
}