// app/actions/support-actions.ts
// Minimal support helpers — FAQ data + current user info.

"use client";

import { auth } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// FAQ data (static)
// ---------------------------------------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Events",
    q: "How do I join an event?",
    a: "Go to Explore Events, find the event you want, and tap the Join button. You'll get a confirmation and it will appear in My Events → Joined.",
  },
  {
    category: "Events",
    q: "Can I cancel my registration?",
    a: "Yes — go to My Events → Joined, find the event, and tap Leave. Note that refunds for paid events depend on the organiser's policy.",
  },
  {
    category: "Events",
    q: "How do I create an event?",
    a: "Tap '+ Create Event' in the sidebar. Fill in the details, choose Free or Paid entry, set capacity, and publish.",
  },
  {
    category: "Payments",
    q: "Which payment methods are accepted?",
    a: "We support UPI, debit/credit cards, and net banking via our payment partner. All transactions are encrypted and secure.",
  },
  {
    category: "Payments",
    q: "When will I receive my refund?",
    a: "Refunds are processed within 5–7 business days back to your original payment method once approved by the organiser.",
  },
  {
    category: "Account",
    q: "How do I change my profile picture?",
    a: "Go to Settings → Profile and tap the camera icon on your avatar. You can upload a photo from your device.",
  },
  {
    category: "Account",
    q: "I forgot my password. How do I reset it?",
    a: "On the sign-in screen, tap 'Forgot password?' and enter your email. You'll receive a reset link within a few minutes.",
  },
  {
    category: "Technical",
    q: "The app isn't loading events. What should I do?",
    a: "Try pulling to refresh. If the problem persists, check your internet connection or clear your browser cache and reload.",
  },
];

// ---------------------------------------------------------------------------
// getCurrentUserInfo
// ---------------------------------------------------------------------------

export function getCurrentUserInfo(): { uid: string; name: string; email: string } | null {
  const user = auth.currentUser;
  if (!user) return null;
  return {
    uid:   user.uid,
    name:  user.displayName ?? "",
    email: user.email ?? "",
  };
}