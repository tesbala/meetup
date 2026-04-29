// app/actions/EventViewActions.ts
"use client";

import {
  collection, query, orderBy, limit, getDocs, getDoc, doc,
  updateDoc, increment, serverTimestamp, setDoc, deleteDoc,
  Timestamp, where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { ActionResult } from "@/app/actions/Exploreactions";

export type { ActionResult };

const CAT: Record<string, { color: string; bg: string; emoji: string }> = {
  tech:        { color: "#3C3489", bg: "#EEEDFE", emoji: "💻" },
  music:       { color: "#633806", bg: "#FAEEDA", emoji: "🎵" },
  art:         { color: "#72243E", bg: "#FBEAF0", emoji: "🎨" },
  food:        { color: "#712B13", bg: "#FAECE7", emoji: "🍜" },
  sports:      { color: "#085041", bg: "#E1F5EE", emoji: "⚽" },
  health:      { color: "#27500A", bg: "#EAF3DE", emoji: "🧘" },
  business:    { color: "#0C447C", bg: "#E6F1FB", emoji: "💼" },
  photography: { color: "#085041", bg: "#E1F5EE", emoji: "📸" },
  fashion:     { color: "#72243E", bg: "#FBEAF0", emoji: "👗" },
  gaming:      { color: "#3C3489", bg: "#EEEDFE", emoji: "🎮" },
  education:   { color: "#0C447C", bg: "#E6F1FB", emoji: "📚" },
  travel:      { color: "#085041", bg: "#E1F5EE", emoji: "✈️" },
};

export interface EventDetail {
  id: string; title: string; description: string;
  category: string; categoryColor: string; categoryBg: string; emoji: string;
  date: string; dateDisplay: string; time: string; endTime: string;
  city: string; state: string; district: string;
  venue: string; mapUrl: string;
  joined: number; max: number | null;
  type: "Free" | "Paid"; price?: number;
  status: "upcoming" | "live" | "past" | "cancelled";
  organizer: string; organizerPhone?: string; organizerEmail?: string;
  creatorId: string; image: string; views: number; tags: string[];
  isFavourite: boolean; isJoined: boolean; isOwner: boolean;
}

export interface Participant {
  uid: string; name: string; photoURL: string; joinedAt: string;
}

export interface RelatedEvent {
  id: string; title: string; emoji: string;
  categoryBg: string; categoryColor: string;
  dateDisplay: string; city: string; state: string;
  type: "Free" | "Paid"; price?: number;
  joined: number; max: number | null;
}

function toIso(ts: string | Timestamp | null | undefined): string {
  if (!ts) return "";
  if (ts instanceof Timestamp) return ts.toDate().toISOString().split("T")[0];
  return String(ts).split("T")[0];
}

function toDisplay(ts: string | Timestamp | null | undefined): string {
  if (!ts) return "";
  const d = ts instanceof Timestamp ? ts.toDate() : new Date(String(ts));
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function deriveStatus(stored: string, isoDate: string): EventDetail["status"] {
  if (stored === "cancelled") return "cancelled";
  const today = new Date().toISOString().split("T")[0];
  if (isoDate < today) return "past";
  if (isoDate === today) return "live";
  return "upcoming";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEventDoc(id: string, data: Record<string, any>, savedIds: Set<string>, joinedIds: Set<string>): EventDetail {
  const catKey = String(data.category ?? "").toLowerCase();
  const cfg = CAT[catKey] ?? { color: "#444441", bg: "#F1EFE8", emoji: "📅" };
  const iso = toIso((data.date ?? data.eventDate) as string | Timestamp | null);
  return {
    id, title: String(data.title ?? "Untitled"),
    description: String(data.description ?? ""),
    category: String(data.category ?? ""),
    categoryColor: cfg.color, categoryBg: cfg.bg, emoji: cfg.emoji,
    date: iso, dateDisplay: toDisplay((data.date ?? data.eventDate) as string | Timestamp | null),
    time: String(data.time ?? data.startTime ?? ""),
    endTime: String(data.endTime ?? data.endtime ?? ""),
    city: String(data.city ?? data.area ?? ""),
    state: String(data.state ?? ""), district: String(data.district ?? ""),
    venue: String(data.venue ?? data.address ?? data.location ?? ""),
    mapUrl: String(data.mapUrl ?? data.mapLink ?? ""),
    joined: Number(data.joined ?? data.joinedCount ?? 0),
    max: data.maxAttendees != null ? Number(data.maxAttendees) : null,
    type: (data.entryType ?? data.type ?? "Free") as "Free" | "Paid",
    price: data.price != null ? Number(data.price) : undefined,
    status: deriveStatus(String(data.status ?? "upcoming"), iso),
    organizer: String(data.contactName ?? data.organizer ?? ""),
    organizerPhone: data.contactPhone ? String(data.contactPhone) : undefined,
    organizerEmail: data.contactEmail ? String(data.contactEmail) : undefined,
    creatorId: String(data.creatorId ?? data.userId ?? ""),
    image: cfg.emoji, views: Number(data.views ?? 0),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    isFavourite: savedIds.has(id), isJoined: joinedIds.has(id),
    isOwner: auth.currentUser?.uid === String(data.creatorId ?? data.userId ?? ""),
  };
}

export async function loadEventDetail(eventId: string): Promise<ActionResult<EventDetail>> {
  try {
    const user = auth.currentUser;
    const uid = user?.uid;
    const [evSnap, savedSnap, joinedSnap] = await Promise.all([
      getDoc(doc(db, "events", eventId)),
      uid ? getDocs(collection(db, "users", uid, "savedEvents"))  : Promise.resolve(null),
      uid ? getDocs(collection(db, "users", uid, "joinedEvents")) : Promise.resolve(null),
    ]);
    if (!evSnap.exists()) return { success: false, error: "Event not found." };
    const savedIds  = new Set<string>(savedSnap  ? savedSnap.docs.map(d => d.id)  : []);
    const joinedIds = new Set<string>(joinedSnap ? joinedSnap.docs.map(d => d.id) : []);
    return { success: true, data: mapEventDoc(evSnap.id, evSnap.data() as Record<string, unknown>, savedIds, joinedIds) };
  } catch (err) { return { success: false, error: String(err) }; }
}

export async function loadParticipants(eventId: string): Promise<ActionResult<Participant[]>> {
  try {
    const snap = await getDocs(query(collection(db, "events", eventId, "participants"), orderBy("joinedAt", "desc"), limit(20)));
    return {
      success: true,
      data: snap.docs.map(d => {
        const data = d.data();
        return {
          uid: d.id, name: String(data.name ?? ""), photoURL: String(data.photoURL ?? ""),
          joinedAt: data.joinedAt instanceof Timestamp ? data.joinedAt.toDate().toISOString() : String(data.joinedAt ?? ""),
        };
      }),
    };
  } catch (err) { return { success: false, error: String(err) }; }
}

export async function loadRelatedEvents(eventId: string, category: string, maxCount = 4): Promise<ActionResult<RelatedEvent[]>> {
  try {
    const catKey = category.toLowerCase();
    const cfg = CAT[catKey] ?? { color: "#444441", bg: "#F1EFE8", emoji: "📅" };
    const snap = await getDocs(query(collection(db, "events"), where("category", "==", catKey), orderBy("date", "asc"), limit(maxCount + 1)));
    return {
      success: true,
      data: snap.docs.filter(d => d.id !== eventId).slice(0, maxCount).map(d => {
        const data = d.data();
        return {
          id: d.id, title: String(data.title ?? "Untitled"),
          emoji: cfg.emoji, categoryBg: cfg.bg, categoryColor: cfg.color,
          dateDisplay: toDisplay((data.date ?? data.eventDate) as string | Timestamp | null),
          city: String(data.city ?? data.area ?? ""), state: String(data.state ?? ""),
          type: (data.entryType ?? data.type ?? "Free") as "Free" | "Paid",
          price: data.price != null ? Number(data.price) : undefined,
          joined: Number(data.joined ?? data.joinedCount ?? 0),
          max: data.maxAttendees != null ? Number(data.maxAttendees) : null,
        };
      }),
    };
  } catch (err) { return { success: false, error: String(err) }; }
}

export async function joinEventDetail(eventId: string): Promise<ActionResult> {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Sign in to join events." };
    const evSnap = await getDoc(doc(db, "events", eventId));
    if (!evSnap.exists()) return { success: false, error: "Event not found." };
    const evData = evSnap.data();
    const maxCap = evData.maxAttendees ?? evData.max ?? null;
    const current = evData.joined ?? evData.joinedCount ?? 0;
    if (maxCap !== null && current >= maxCap) return { success: false, error: "This event is full." };
    await setDoc(doc(db, "events", eventId, "participants", user.uid), { uid: user.uid, name: user.displayName ?? "", photoURL: user.photoURL ?? "", joinedAt: serverTimestamp() });
    await updateDoc(doc(db, "events", eventId), { joined: increment(1) });
    await setDoc(doc(db, "users", user.uid, "joinedEvents", eventId), { eventId, joinedAt: serverTimestamp() });
    const creatorId = evData.creatorId;
    if (creatorId && creatorId !== user.uid) {
      await setDoc(doc(collection(db, "notifications")), { userId: creatorId, type: "join", title: `${user.displayName ?? "Someone"} joined your event`, body: `${user.displayName ?? "A user"} just joined ${evData.title ?? "your event"}.`, eventId, read: false, createdAt: serverTimestamp() });
    }
    return { success: true };
  } catch (err) { return { success: false, error: String(err) }; }
}

export async function leaveEventDetail(eventId: string): Promise<ActionResult> {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Not signed in." };
    await deleteDoc(doc(db, "events", eventId, "participants", user.uid));
    const evSnap = await getDoc(doc(db, "events", eventId));
    if (evSnap.exists() && (evSnap.data().joined ?? 0) > 0) {
      await updateDoc(doc(db, "events", eventId), { joined: increment(-1) });
    }
    await deleteDoc(doc(db, "users", user.uid, "joinedEvents", eventId));
    return { success: true };
  } catch (err) { return { success: false, error: String(err) }; }
}

export async function toggleFavouriteDetail(eventId: string, currentState: boolean): Promise<ActionResult<boolean>> {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Sign in to save events." };
    const ref = doc(db, "users", user.uid, "savedEvents", eventId);
    if (currentState) { await deleteDoc(ref); } else { await setDoc(ref, { eventId, savedAt: serverTimestamp() }); }
    return { success: true, data: !currentState };
  } catch (err) { return { success: false, error: String(err) }; }
}

export async function incrementView(eventId: string): Promise<void> {
  try { await updateDoc(doc(db, "events", eventId), { views: increment(1) }); } catch { /* non-critical */ }
}

export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid ?? null;
}