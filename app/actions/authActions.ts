// app/actions/authActions.ts
//
// ─────────────────────────────────────────────────────────────────────────────
//  ALL Firebase Auth logic lives here.
//  The UI (AuthPage.tsx) only imports and calls these functions.
//  Cookie is set here on every successful sign-in / sign-up so that
//  ALL pages can read the UID from the cookie without requiring re-login.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { setAuthCookie, clearAuthCookie } from "@/lib/cookieUtils";

// ─── Return type every action returns ────────────────────────────────────────
export interface AuthResult {
  success: boolean;
  error?:  string;
  uid?:    string;
}

// ─── Firestore user document shape ───────────────────────────────────────────
export interface UserProfile {
  uid:           string;
  firstName:     string;
  lastName:      string;
  email:         string;
  phone:         string;
  interests:     string[];
  state:         string;
  district:      string;
  area:          string;
  photoURL:      string;
  createdAt:     unknown;
  updatedAt:     unknown;
  provider:      "email" | "google";
  role:          "user";
  eventsCreated: number;
  eventsJoined:  number;
}

// ─── Helper: map Firebase error codes → friendly messages ────────────────────
function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use":    "This email is already registered. Try signing in.",
    "auth/invalid-email":           "Please enter a valid email address.",
    "auth/weak-password":           "Password must be at least 6 characters.",
    "auth/user-not-found":          "No account found with this email.",
    "auth/wrong-password":          "Incorrect password. Please try again.",
    "auth/too-many-requests":       "Too many attempts. Please try again later.",
    "auth/network-request-failed":  "Network error. Check your connection.",
    "auth/popup-closed-by-user":    "Google sign-in was cancelled.",
    "auth/cancelled-popup-request": "Google sign-in was cancelled.",
    "auth/invalid-credential":      "Invalid credentials. Please check and try again.",
    "auth/unauthorized-domain":     "This domain is not authorised for Google sign-in.",
    "auth/operation-not-allowed":   "Google sign-in is not enabled in Firebase Console.",
    "auth/popup-blocked":           "Popup was blocked by your browser. Please allow popups.",
  };
  return map[code] ?? `Something went wrong. Please try again. (${code})`;
}

// ─── Helper: save / merge user profile in Firestore ──────────────────────────
async function saveUserToFirestore(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─────────────────────────────────────────────────────────────────────────────
//  1.  SIGN UP WITH EMAIL & PASSWORD
// ─────────────────────────────────────────────────────────────────────────────
export interface SignUpData {
  firstName:  string;
  lastName:   string;
  email:      string;
  password:   string;
  phone?:     string;
  interests?: string[];
  state?:     string;
  district?:  string;
  area?:      string;
}

export async function signUpWithEmail(data: SignUpData): Promise<AuthResult> {
  try {
    const credential: UserCredential = await createUserWithEmailAndPassword(
      auth, data.email, data.password
    );
    const { user } = credential;

    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`.trim(),
    });

    const profile: UserProfile = {
      uid:           user.uid,
      firstName:     data.firstName,
      lastName:      data.lastName,
      email:         data.email,
      phone:         data.phone     ?? "",
      interests:     data.interests ?? [],
      state:         data.state     ?? "",
      district:      data.district  ?? "",
      area:          data.area      ?? "",
      photoURL:      user.photoURL  ?? "",
      createdAt:     serverTimestamp(),
      updatedAt:     serverTimestamp(),
      provider:      "email",
      role:          "user",
      eventsCreated: 0,
      eventsJoined:  0,
    };

    await saveUserToFirestore(user.uid, profile);

    // ✅ Save UID cookie — return visits won't need to sign in again
    setAuthCookie(user.uid);

    return { success: true, uid: user.uid };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    return { success: false, error: friendlyError(code) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  2.  SIGN IN WITH EMAIL & PASSWORD
// ─────────────────────────────────────────────────────────────────────────────
export interface SignInData {
  email:    string;
  password: string;
}

export async function signInWithEmail(data: SignInData): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(
      auth, data.email, data.password
    );
    await saveUserToFirestore(credential.user.uid, {
      updatedAt: serverTimestamp(),
    } as Partial<UserProfile>);

    // ✅ Save UID cookie
    setAuthCookie(credential.user.uid);

    return { success: true, uid: credential.user.uid };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    return { success: false, error: friendlyError(code) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  3.  SIGN IN / SIGN UP WITH GOOGLE
// ─────────────────────────────────────────────────────────────────────────────
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(auth, provider);
    const { user } = credential;

    const userRef  = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const nameParts = (user.displayName ?? "").split(" ");
      const profile: UserProfile = {
        uid:           user.uid,
        firstName:     nameParts[0] ?? "",
        lastName:      nameParts.slice(1).join(" "),
        email:         user.email       ?? "",
        phone:         user.phoneNumber ?? "",
        interests:     [],
        state:         "",
        district:      "",
        area:          "",
        photoURL:      user.photoURL    ?? "",
        createdAt:     serverTimestamp(),
        updatedAt:     serverTimestamp(),
        provider:      "google",
        role:          "user",
        eventsCreated: 0,
        eventsJoined:  0,
      };
      await saveUserToFirestore(user.uid, profile);
    } else {
      await saveUserToFirestore(user.uid, {
        updatedAt: serverTimestamp(),
      } as Partial<UserProfile>);
    }

    // ✅ Save UID cookie
    setAuthCookie(user.uid);

    return { success: true, uid: user.uid };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    return { success: false, error: friendlyError(code) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  4.  FORGOT PASSWORD
// ─────────────────────────────────────────────────────────────────────────────
export async function forgotPassword(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    return { success: false, error: friendlyError(code) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  5.  SIGN OUT  — clears cookie so next visit shows login again
// ─────────────────────────────────────────────────────────────────────────────
export async function logOut(): Promise<AuthResult> {
  try {
    await signOut(auth);
    // ✅ Clear UID cookie on logout
    clearAuthCookie();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to sign out." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  6.  GET CURRENT USER PROFILE FROM FIRESTORE
//      Pass any UID — works whether Firebase Auth session exists or not.
//      All your pages call this with getAuthCookie() as the uid.
// ─────────────────────────────────────────────────────────────────────────────
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch {
    return null;
  }
}