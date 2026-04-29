"use client";

// app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
//  Root page: checks for a saved UID cookie.
//  • Cookie found  → go straight to /dashboard  (no sign-in prompt)
//  • No cookie     → show the Auth (Login / Signup) page
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthPages from "./(auth)/Authpages/page";
import { getAuthCookie } from "@/lib/cookieUtils";

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const uid = getAuthCookie();
    if (uid) {
      setHasSession(true);
      router.replace("/dashboard");
    } else {
      setChecked(true);
    }
  }, []);

  // Prevent flash: wait until cookie check is done
  if (!checked && !hasSession) return null;

  // No cookie → show login / signup
  return <AuthPages />;
}