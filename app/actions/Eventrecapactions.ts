// app/actions/eventRecapActions.ts
//
// ─────────────────────────────────────────────────────────────────────────────
//  Firebase logic for Event Recap (view stats) + Edit Event page.
//  The UI imports ONLY these functions — no Firebase in the UI.
//  Auth: uid is passed in from the cookie (same pattern as my-events.ts).
//        No auth.currentUser dependency anywhere.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // ← auth removed

// ─── Shared result type ───────────────────────────────────────────────────────
export interface ActionResult<T = undefined> {
  success: boolean;
  error?:  string;
  data?:   T;
}

// ─── Full event detail shape ──────────────────────────────────────────────────
export interface EventDetail {
  id:           string;
  // Basics
  title:        string;
  category:     string;
  categoryColor:string;
  categoryBg:   string;
  description:  string;
  entryType:    "Free" | "Paid";
  price:        number | null;
  maxAttendees: number | null;
  max:          number | null; // alias for maxAttendees — used in edit page UI
  coverImage:   string;
  // Date & location
  date:         string;       // ISO YYYY-MM-DD
  dateDisplay:  string;       // "Fri 24 Apr 2026"
  startTime:    string;
  endTime:      string;
  state:        string;
  district:     string;
  area:         string;
  venue:        string;
  landmark:     string;
  howToAttend:  string;
  // Contact
  contactName:  string;
  contactPhone: string;
  contactEmail: string;
  contactWA:    string;
  website:      string;
  // Meta
  status:       "upcoming" | "live" | "past" | "cancelled";
  creatorId:    string;
  createdAt:    string;
  // Stats
  joined:       number;
  views:        number;
  revenue:      number;
}

// ─── Participant shape ────────────────────────────────────────────────────────
export interface Participant {
  uid:      string;
  name:     string;
  photoURL: string;
  joinedAt: string;   // formatted time string
}

// ─── Edit payload (only editable fields) ─────────────────────────────────────
export interface EditEventPayload {
  title?:        string;
  category?:     string;
  description?:  string;
  entryType?:    "Free" | "Paid";
  price?:        number | string;
  maxAttendees?: number | string;
  date?:         string;
  startTime?:    string;
  endTime?:      string;
  state?:        string;
  district?:     string;
  area?:         string;
  venue?:        string;
  landmark?:     string;
  howToAttend?:  string;
  contactName?:  string;
  contactPhone?: string;
  contactEmail?: string;
  contactWA?:    string;
  website?:      string;
  coverImageURL?:string;
}

// ─── Category colour map ──────────────────────────────────────────────────────
const CAT: Record<string, { color: string; bg: string }> = {
  tech:        { color:"#3C3489", bg:"#EEEDFE" },
  music:       { color:"#633806", bg:"#FAEEDA" },
  art:         { color:"#72243E", bg:"#FBEAF0" },
  food:        { color:"#712B13", bg:"#FAECE7" },
  sports:      { color:"#085041", bg:"#E1F5EE" },
  health:      { color:"#27500A", bg:"#EAF3DE" },
  business:    { color:"#0C447C", bg:"#E6F1FB" },
  photography: { color:"#085041", bg:"#E1F5EE" },
  fashion:     { color:"#72243E", bg:"#FBEAF0" },
  gaming:      { color:"#3C3489", bg:"#EEEDFE" },
  education:   { color:"#0C447C", bg:"#E6F1FB" },
  travel:      { color:"#085041", bg:"#E1F5EE" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toIso(ts: string | Timestamp | null | undefined): string {
  if (!ts) return "";
  if (ts instanceof Timestamp) return ts.toDate().toISOString().split("T")[0];
  return String(ts).split("T")[0];
}

function toDateDisplay(ts: string | Timestamp | null | undefined): string {
  if (!ts) return "";
  const d = ts instanceof Timestamp ? ts.toDate() : new Date(String(ts));
  return d.toLocaleDateString("en-IN", {
    weekday:"short", day:"numeric", month:"short", year:"numeric",
  });
}

function toTimeDisplay(ts: Timestamp | null): string {
  if (!ts) return "";
  return ts.toDate().toLocaleDateString("en-IN", {
    day:"numeric", month:"short", year:"numeric",
    hour:"2-digit", minute:"2-digit",
  });
}

function deriveStatus(stored: string, iso: string): EventDetail["status"] {
  if (stored === "cancelled") return "cancelled";
  const today = new Date().toISOString().split("T")[0];
  if (iso < today)   return "past";
  if (iso === today) return "live";
  return "upcoming";
}

function friendlyError(err: unknown): string {
  const code = (err as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "permission-denied":      "You don't have permission to edit this event.",
    "not-found":              "Event not found.",
    "storage/unauthorized":   "Storage permission denied.",
    "storage/quota-exceeded": "Storage quota exceeded.",
  };
  return map[code] ?? (err instanceof Error ? err.message : "Something went wrong.");
}

// ─────────────────────────────────────────────────────────────────────────────
//  1.  LOAD EVENT DETAIL  (for both Recap and Edit pages)
//      Pass uid from cookie — no auth.currentUser.
//      Checks that the current user is the creator before returning.
// ─────────────────────────────────────────────────────────────────────────────
export async function loadEventDetail(
  eventId: string,
  uid: string
): Promise<ActionResult<EventDetail>> {
  try {
    if (!uid) return { success: false, error: "Not signed in." };

    const snap = await getDoc(doc(db, "events", eventId));
    if (!snap.exists()) return { success: false, error: "Event not found." };

    const d   = snap.data();
    const cat = CAT[(d.category ?? "").toLowerCase()] ??
                { color:"#444441", bg:"#F1EFE8" };
    const iso = toIso(d.date ?? null);
    const maxAttendees = d.maxAttendees ?? null;

    return {
      success: true,
      data: {
        id:           snap.id,
        title:        d.title         ?? "",
        category:     d.category      ?? "",
        categoryColor:cat.color,
        categoryBg:   cat.bg,
        description:  d.description   ?? "",
        entryType:    d.entryType === "Paid" ? "Paid" : "Free",
        price:        d.price         ?? null,
        maxAttendees,
        max:          maxAttendees,   // alias — fixes ts(2339) 'max' errors in edit page
        coverImage:   d.coverImage    ?? "",
        date:         iso,
        dateDisplay:  toDateDisplay(d.date ?? null),
        startTime:    d.startTime ?? d.time ?? "",
        endTime:      d.endTime        ?? "",
        state:        d.state          ?? "",
        district:     d.district       ?? "",
        area:         d.area ?? d.city ?? "",
        venue:        d.venue          ?? "",
        landmark:     d.landmark       ?? "",
        howToAttend:  d.howToAttend    ?? "",
        contactName:  d.contactName    ?? "",
        contactPhone: d.contactPhone   ?? "",
        contactEmail: d.contactEmail   ?? "",
        contactWA:    d.contactWA      ?? "",
        website:      d.website        ?? "",
        status:       deriveStatus(d.status ?? "", iso),
        creatorId:    d.creatorId      ?? "",
        createdAt:    toTimeDisplay(d.createdAt ?? null),
        joined:       d.joined         ?? 0,
        views:        d.views          ?? 0,
        revenue:      d.revenue        ?? 0,
      },
    };
  } catch (err) {
    return { success: false, error: friendlyError(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  2.  LOAD PARTICIPANTS
//      Pass uid from cookie.
// ─────────────────────────────────────────────────────────────────────────────
export async function loadParticipants(
  eventId: string,
  uid: string
): Promise<ActionResult<Participant[]>> {
  try {
    if (!uid) return { success: false, error: "Not signed in." };

    const snap = await getDocs(
      collection(db, "events", eventId, "participants")
    );

    const participants: Participant[] = snap.docs.map(d => {
      const data = d.data();
      return {
        uid:      d.id,
        name:     data.name     ?? "Anonymous",
        photoURL: data.photoURL ?? "",
        joinedAt: data.joinedAt instanceof Timestamp
          ? data.joinedAt.toDate().toLocaleDateString("en-IN", {
              day:"numeric", month:"short", year:"numeric",
              hour:"2-digit", minute:"2-digit",
            })
          : "",
      };
    });

    // Sort newest first
    participants.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));

    return { success: true, data: participants };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  3.  SAVE EDITED EVENT
//      Pass uid from cookie — verifies uid matches creatorId in Firestore.
// ─────────────────────────────────────────────────────────────────────────────
export async function saveEditedEvent(
  eventId: string,
  payload: EditEventPayload,
  uid: string
): Promise<ActionResult> {
  try {
    if (!uid) return { success: false, error: "Not signed in." };

    // Verify creator
    const evSnap = await getDoc(doc(db, "events", eventId));
    if (!evSnap.exists()) return { success: false, error: "Event not found." };
    if (evSnap.data().creatorId !== uid)
      return { success: false, error: "You can only edit your own events." };

    // Validate required fields if provided
    if (payload.title !== undefined && !payload.title.trim())
      return { success: false, error: "Title cannot be empty." };
    if (payload.entryType === "Paid" && !payload.price)
      return { success: false, error: "Enter a ticket price for paid events." };

    // Build patch — only include defined values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = { updatedAt: serverTimestamp() };

    if (payload.title        !== undefined) patch.title        = payload.title.trim();
    if (payload.category     !== undefined) patch.category     = payload.category;
    if (payload.description  !== undefined) patch.description  = payload.description.trim();
    if (payload.entryType    !== undefined) patch.entryType    = payload.entryType;
    if (payload.price        !== undefined)
      patch.price        = payload.entryType === "Paid" ? Number(payload.price) : null;
    if (payload.maxAttendees !== undefined)
      patch.maxAttendees = payload.maxAttendees ? Number(payload.maxAttendees) : null;
    if (payload.date !== undefined) {
      const { Timestamp: TS } = await import("firebase/firestore");
      patch.date   = TS.fromDate(new Date(payload.date + "T00:00:00"));
      const today  = new Date().toISOString().split("T")[0];
      patch.status = payload.date < today ? "past"
                   : payload.date === today ? "live" : "upcoming";
    }
    if (payload.startTime    !== undefined) patch.startTime    = payload.startTime;
    if (payload.endTime      !== undefined) patch.endTime      = payload.endTime;
    if (payload.state        !== undefined) patch.state        = payload.state;
    if (payload.district     !== undefined) patch.district     = payload.district;
    if (payload.area         !== undefined) { patch.area = payload.area; patch.city = payload.area; }
    if (payload.venue        !== undefined) patch.venue        = payload.venue.trim();
    if (payload.landmark     !== undefined) patch.landmark     = payload.landmark;
    if (payload.howToAttend  !== undefined) patch.howToAttend  = payload.howToAttend;
    if (payload.contactName  !== undefined) patch.contactName  = payload.contactName.trim();
    if (payload.contactPhone !== undefined) patch.contactPhone = payload.contactPhone.trim();
    if (payload.contactEmail !== undefined) patch.contactEmail = payload.contactEmail.trim();
    if (payload.contactWA    !== undefined) patch.contactWA    = payload.contactWA;
    if (payload.website      !== undefined) patch.website      = payload.website;
    if (payload.coverImageURL !== undefined) patch.coverImage  = payload.coverImageURL;

    await updateDoc(doc(db, "events", eventId), patch);
    return { success: true };
  } catch (err) {
    return { success: false, error: friendlyError(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  4.  UPLOAD NEW COVER IMAGE  (for edit page)
//      Pass uid from cookie.
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadEventCover(
  eventId: string,
  file:    File,
  uid:     string
): Promise<ActionResult<string>> {
  try {
    if (!uid) return { success: false, error: "Not signed in." };

    if (!file.type.startsWith("image/"))
      return { success: false, error: "Please upload an image file." };
    if (file.size > 5 * 1024 * 1024)
      return { success: false, error: "Image must be under 5 MB." };

    const safeName    = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `event-covers/${uid}/${Date.now()}_${safeName}`;
    const storageRef  = ref(storage, storagePath);

    await uploadBytes(storageRef, file, { contentType: file.type });
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "events", eventId), {
      coverImage: url,
      updatedAt:  serverTimestamp(),
    });

    return { success: true, data: url };
  } catch (err) {
    return { success: false, error: friendlyError(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  5.  REMOVE COVER IMAGE  (for edit page)
//      Pass uid from cookie.
// ─────────────────────────────────────────────────────────────────────────────
export async function removeEventCover(
  eventId: string,
  uid: string
): Promise<ActionResult> {
  try {
    if (!uid) return { success: false, error: "Not signed in." };

    const evSnap = await getDoc(doc(db, "events", eventId));
    if (!evSnap.exists()) return { success: false, error: "Event not found." };

    const currentURL = evSnap.data().coverImage as string;

    if (currentURL) {
      try {
        await deleteObject(ref(storage, currentURL));
      } catch { /* already deleted — ignore */ }
    }

    await updateDoc(doc(db, "events", eventId), {
      coverImage: "",
      updatedAt:  serverTimestamp(),
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: friendlyError(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  6.  VALIDATE EDIT FORM  (call before saving)
//      Returns { fieldName: "error message" } or {} if clean.
// ─────────────────────────────────────────────────────────────────────────────
export function validateEditForm(
  payload: EditEventPayload
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (payload.title !== undefined && !payload.title.trim())
    errors.title = "Title cannot be empty.";

  if (payload.entryType === "Paid") {
    if (!payload.price || Number(payload.price) <= 0)
      errors.price = "Enter a valid ticket price.";
  }

  if (payload.contactEmail !== undefined) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contactEmail);
    if (!emailOk) errors.contactEmail = "Enter a valid email address.";
  }

  if (payload.date !== undefined) {
    if (!payload.date) errors.date = "Date is required.";
  }

  return errors;
}