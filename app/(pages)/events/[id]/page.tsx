"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  loadEventDetail,
  loadParticipants,
  loadRelatedEvents,
  joinEventDetail,
  leaveEventDetail,
  toggleFavouriteDetail,
  incrementView,
  type EventDetail,
  type Participant,
  type RelatedEvent,
} from "@/app/actions/Events-view";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#FF4D6D" : "none"} stroke={filled ? "#FF4D6D" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const UsersIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.06 2.18 2 2 0 012.02 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const WhatsAppIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, photoURL, size = 32 }: { name: string; photoURL: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  if (photoURL) return <img src={photoURL} alt={name} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />;
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: "linear-gradient(135deg,#7C3AED,#06B6D4)" }}>
      {initials}
    </div>
  );
}

// ─── Capacity Bar ──────────────────────────────────────────────────────────────
function CapacityBar({ joined, max }: { joined: number; max: number | null }) {
  if (!max) return (
    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
      <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "#EDE9FE", color: "#7C3AED" }}><UsersIcon /></span>
      {joined} joined · Unlimited capacity
    </div>
  );
  const pct   = Math.min(Math.round((joined / max) * 100), 100);
  const color = pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : "#10B981";
  return (
    <div>
      <div className="flex justify-between mb-2 items-center">
        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium"><UsersIcon /> {joined} / {max} joined</span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color, background: color + "15" }}>{pct}% full</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE9FE" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b last:border-0 last:pb-0" style={{ borderColor: "#F3F0FF" }}>
      <span className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
        style={{ background: "linear-gradient(135deg,#EDE9FE,#E0F2FE)", color: "#7C3AED" }}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 m-0">{label}</p>
        {children}
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, delay = "0s", className = "" }: { children: React.ReactNode; delay?: string; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 mb-3 ${className}`}
      style={{
        animation: "fadeUp 0.4s cubic-bezier(.22,.68,0,1.2) both",
        animationDelay: delay,
        border: "1px solid rgba(124,58,237,0.07)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 14px rgba(124,58,237,0.05)"
      }}>
      {children}
    </div>
  );
}
function CardLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 m-0">{children}</p>;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: EventDetail["status"] }) {
  if (status === "live") return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
      style={{ background: "rgba(16,185,129,0.18)", color: "#059669", border: "1px solid rgba(16,185,129,0.3)" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />Live now
    </span>
  );
  if (status === "past") return (
    <span className="inline-flex items-center text-[11px] font-semibold px-3 py-1.5 rounded-full"
      style={{ background: "rgba(0,0,0,0.14)", color: "#fff" }}>Past event</span>
  );
  if (status === "cancelled") return (
    <span className="inline-flex items-center text-[11px] font-semibold px-3 py-1.5 rounded-full"
      style={{ background: "rgba(239,68,68,0.18)", color: "#DC2626", border: "1px solid rgba(239,68,68,0.25)" }}>Cancelled</span>
  );
  return null;
}

// ─── Organizer Card ───────────────────────────────────────────────────────────
function OrganizerCard({ event }: { event: EventDetail }) {
  const initials = event.organizer.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  return (
    <Card delay="0.04s">
      <CardLabel>Organizer</CardLabel>
      <div className={`flex items-center gap-3 ${event.organizerPhone || event.organizerEmail ? "mb-3.5" : ""}`}>
        <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{ width: 46, height: 46, fontSize: 16, background: "linear-gradient(135deg,#7C3AED,#06B6D4)" }}>
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 m-0">{event.organizer || "Unknown"}</p>
          <p className="text-xs font-semibold m-0 mt-0.5" style={{ color: "#7C3AED" }}>Event organizer</p>
        </div>
      </div>
      {event.organizerPhone && (
        <a href={`tel:${event.organizerPhone}`}
          className="flex items-center gap-3 text-sm text-slate-600 no-underline py-2.5 border-t transition-colors hover:text-violet-700"
          style={{ borderColor: "#F3F0FF" }}>
          <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#EDE9FE,#E0F2FE)", color: "#7C3AED" }}>
            <PhoneIcon />
          </span>
          <span className="font-medium">{event.organizerPhone}</span>
        </a>
      )}
      {event.organizerEmail && (
        <a href={`mailto:${event.organizerEmail}`}
          className="flex items-center gap-3 text-sm text-slate-600 no-underline py-2.5 border-t transition-colors hover:text-violet-700"
          style={{ borderColor: "#F3F0FF" }}>
          <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#EDE9FE,#E0F2FE)", color: "#7C3AED" }}>
            <MailIcon />
          </span>
          <span className="truncate font-medium">{event.organizerEmail}</span>
        </a>
      )}
    </Card>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatsCard({ event }: { event: EventDetail }) {
  const stats = [
    { label: "Joined",   value: String(event.joined),                                icon: "👥", accent: "#7C3AED", bg: "#F3F0FF" },
    { label: "Views",    value: String(event.views),                                 icon: "👁️",  accent: "#0891B2", bg: "#E0F9FF" },
    { label: "Capacity", value: event.max ? String(event.max) : "∞",                icon: "🎯", accent: "#059669", bg: "#ECFDF5" },
    { label: "Entry",    value: event.type === "Paid" ? `₹${event.price}` : "Free", icon: "🎟️", accent: "#D97706", bg: "#FFFBEB" },
  ];
  return (
    <Card delay="0.07s">
      <CardLabel>Event stats</CardLabel>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center stat-tile"
            style={{ background: s.bg, border: `1px solid ${s.accent}18`, transition: "transform .18s ease", cursor: "default" }}>
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="text-base font-extrabold m-0 mb-0.5" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-[10px] font-semibold text-slate-400 m-0 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Related Card ─────────────────────────────────────────────────────────────
function RelatedCard({ related, event }: { related: RelatedEvent[]; event: EventDetail }) {
  return (
    <Card delay="0.1s">
      <CardLabel>More {event.category} events</CardLabel>
      <div className="flex flex-col gap-2">
        {related.map((r) => (
          <Link key={r.id} href={`/events/${r.id}`}
            className="related-row flex items-start gap-3 p-3 rounded-2xl no-underline"
            style={{ background: "#F5F3FF", border: "1px solid #EDE9FE", transition: "all .18s ease" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: r.categoryBg }}>{r.emoji}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate m-0 mb-0.5">{r.title}</p>
              <p className="text-[11px] text-slate-400 m-0 mb-1.5 font-medium">{r.dateDisplay} · {r.city}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: r.type === "Free" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                  color:      r.type === "Free" ? "#059669" : "#D97706"
                }}>
                {r.type === "Paid" ? `₹${r.price}` : "Free"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EventViewPage() {
  const params       = useParams();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const eventId      = params?.id as string;
  const mode         = searchParams?.get("mode") ?? "";

  const [event,        setEvent]        = useState<EventDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [related,      setRelated]      = useState<RelatedEvent[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [isActing,     setIsActing]     = useState(false);
  const [toast,        setToast]        = useState("");

  const isAdmin = mode === "admin";

  useEffect(() => {
    if (!eventId) return;
    incrementView(eventId);
    Promise.all([loadEventDetail(eventId), loadParticipants(eventId)]).then(([evRes, partRes]) => {
      if (!evRes.success || !evRes.data) {
        setError(evRes.error ?? "Event not found.");
      } else {
        setEvent(evRes.data);
        if (partRes.success && partRes.data) setParticipants(partRes.data);
        loadRelatedEvents(eventId, evRes.data.category).then((rel) => {
          if (rel.success && rel.data) setRelated(rel.data);
        });
      }
      setLoading(false);
    });
  }, [eventId]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleJoin = async () => {
    if (!event || isActing) return;
    setIsActing(true);
    const res = await (event.isJoined ? leaveEventDetail : joinEventDetail)(eventId);
    if (res.success) {
      setEvent((p) => p ? { ...p, isJoined: !p.isJoined, joined: p.isJoined ? p.joined - 1 : p.joined + 1 } : p);
      showToast(event.isJoined ? "You left the event" : "You joined! 🎉");
      loadParticipants(eventId).then((r) => { if (r.success && r.data) setParticipants(r.data); });
    } else showToast(res.error ?? "Something went wrong");
    setIsActing(false);
  };

  const handleFav = async () => {
    if (!event) return;
    const res = await toggleFavouriteDetail(eventId, event.isFavourite);
    if (res.success) {
      setEvent((p) => p ? { ...p, isFavourite: !p.isFavourite } : p);
      showToast(event.isFavourite ? "Removed from saved" : "Saved ❤️");
    }
  };

  const buildWhatsAppMsg = () => {
    if (!event) return "";
    const url   = typeof window !== "undefined" ? window.location.href : "";
    const price = event.type === "Paid" ? `₹${event.price}` : "Free";
    const msg   = `Hey! 👋 Check out *${event.title}* ${event.emoji}\n\n📅 ${event.dateDisplay} at ${event.time}\n📍 ${event.venue || event.city}, ${event.state}\n🎟 Entry: ${price}\n\nJoin here 👇\n${url}`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F3FF" }}>
      <div className="text-center">
        <div className="relative w-14 h-14 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full" style={{ border: "3px solid #EDE9FE" }} />
          <div className="absolute inset-0 rounded-full animate-spin" style={{ border: "3px solid transparent", borderTopColor: "#7C3AED" }} />
        </div>
        <p className="text-sm text-slate-400 font-medium">Loading event…</p>
      </div>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F5F3FF" }}>
      <div className="text-center bg-white rounded-3xl p-10 max-w-sm w-full"
        style={{ border: "1px solid rgba(124,58,237,0.1)", boxShadow: "0 8px 40px rgba(124,58,237,0.1)" }}>
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Event not found</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <button onClick={() => router.back()}
          className="px-6 py-2.5 text-white text-sm font-semibold rounded-xl cursor-pointer border-0 active:scale-95"
          style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>Go back</button>
      </div>
    </div>
  );

  const isFull  = event.max !== null && event.joined >= event.max;
  const isPast  = event.status === "past" || event.status === "cancelled";
  const canJoin = !isPast && !(isFull && !event.isJoined);

  const joinLabel = isActing ? "…"
    : isPast ? "Event ended"
    : isFull && !event.isJoined ? "Event full"
    : event.isJoined ? "Leave event"
    : "Join event";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        .hero-anim       { animation: heroIn 0.4s cubic-bezier(.22,.68,0,1.2) both; }
        .toast-anim      { animation: toastIn 0.25s ease both; }
        .tag-chip        { transition: all .15s; }
        .tag-chip:hover  { transform: translateY(-1px); }
        .stat-tile:hover { transform: translateY(-2px); }
        .related-row:hover { border-color: #C4B5FD !important; background: #F3F0FF !important; }
        .icon-btn        { transition: all .15s ease; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .icon-btn:active { transform: scale(0.9); }
        .wa-pill         { transition: all .15s ease; }
        .wa-pill:hover   { transform: scale(1.04); }
        .wa-pill:active  { transform: scale(0.93); }
        .join-btn        { transition: all .15s ease; border: none; cursor: pointer; font-weight: 700; font-size: 14px; }
        .join-btn:not(:disabled):active { transform: scale(0.98); }
        .join-btn:disabled { cursor: not-allowed; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #DDD6FE; border-radius: 99px; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#F5F3FF" }}>

        {/* ── TOP NAV ──────────────────────────────────────────────────────── */}
        {/* WhatsApp is ALWAYS visible here as a pill button, so users tap it easily */}
        <nav className="sticky top-0 z-40"
          style={{
            background: "rgba(255,255,255,0.93)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(124,58,237,0.09)",
            animation: "fadeUp 0.3s ease both"
          }}>
          <div className="max-w-5xl mx-auto" style={{ height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", gap: 8 }}>

            {/* Left: back + title */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
              <button onClick={() => router.back()} className="icon-btn flex-shrink-0"
                style={{ width: 36, height: 36, borderRadius: 11, background: "#EDE9FE", color: "#7C3AED" }}>
                <BackIcon />
              </button>
              <span className="text-sm font-semibold text-slate-700 truncate" style={{ maxWidth: "calc(100vw - 190px)" }}>
                {event.title}
              </span>
            </div>

            {/* Right: WhatsApp pill + heart */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

              {/* ✅ WhatsApp — pill button, always shown in top nav */}
              <a href={buildWhatsAppMsg()} target="_blank" rel="noopener noreferrer" className="wa-pill"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  height: 36, padding: "0 12px",
                  borderRadius: 99,
                  background: "linear-gradient(135deg,#25D366,#128C7E)",
                  color: "#fff", textDecoration: "none",
                  fontWeight: 700, fontSize: 12,
                  boxShadow: "0 2px 12px rgba(37,211,102,0.4)",
                  whiteSpace: "nowrap"
                }}>
                <WhatsAppIcon size={15} />
                <span className="hidden xs:inline sm:inline">Share</span>
              </a>

              {/* Heart / save */}
              <button onClick={handleFav} className="icon-btn"
                style={{
                  width: 36, height: 36, borderRadius: 11,
                  background: event.isFavourite ? "#FFF1F2" : "#EDE9FE",
                  color: event.isFavourite ? "#FF4D6D" : "#7C3AED"
                }}>
                <HeartIcon filled={event.isFavourite} />
              </button>
            </div>
          </div>
        </nav>

        {/* ── CONTENT ───────────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto pb-36" style={{ padding: "16px 12px 144px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-3">

            {/* LEFT */}
            <div>

              {/* ── HERO ── */}
              <div className="hero-anim bg-white rounded-2xl overflow-hidden mb-3"
                style={{ border: "1px solid rgba(124,58,237,0.09)", boxShadow: "0 2px 6px rgba(0,0,0,0.04), 0 10px 30px rgba(124,58,237,0.08)" }}>

                {/* Banner: richer gradient using categoryColor directly */}
                <div className="relative overflow-hidden"
                  style={{
                    height: 196,
                    background: `linear-gradient(140deg, ${event.categoryColor}60 0%, ${event.categoryBg} 55%, ${event.categoryColor}40 100%)`
                  }}>
                  {/* Blob 1 */}
                  <div className="absolute rounded-full"
                    style={{ width: 220, height: 220, top: -70, right: -70, background: event.categoryColor, opacity: 0.22, filter: "blur(2px)" }} />
                  {/* Blob 2 */}
                  <div className="absolute rounded-full"
                    style={{ width: 260, height: 260, bottom: -120, left: -60, background: event.categoryColor, opacity: 0.14, filter: "blur(4px)" }} />

                  {/* Emoji */}
                  <span className="absolute" style={{
                    fontSize: 86, lineHeight: 1,
                    left: 20, top: "50%", transform: "translateY(-50%)",
                    filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.2))",
                    userSelect: "none", zIndex: 1
                  }}>{event.emoji}</span>

                  {/* Status top-right */}
                  <div className="absolute flex flex-col items-end gap-2" style={{ top: 12, right: 12, zIndex: 2 }}>
                    <StatusBadge status={event.status} />
                    {isFull && !isPast && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: "rgba(239,68,68,0.18)", color: "#DC2626", border: "1px solid rgba(239,68,68,0.25)" }}>
                        Sold out
                      </span>
                    )}
                  </div>

                  {/* Bottom: price + views */}
                  <div className="absolute flex items-center justify-between" style={{ bottom: 10, left: 12, right: 12, zIndex: 2 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 99,
                      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
                      background: event.type === "Free" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                      color: event.type === "Free" ? "#059669" : "#D97706",
                      border: event.type === "Free" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,158,11,0.3)"
                    }}>
                      {event.type === "Paid" ? `₹${event.price}` : "🎉 Free"}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 99,
                      background: "rgba(255,255,255,0.82)", color: "#64748B",
                      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                      display: "flex", alignItems: "center", gap: 5
                    }}>
                      <EyeIcon /> {event.views} views
                    </span>
                  </div>
                </div>

                {/* Title block */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: event.categoryBg, color: event.categoryColor, textTransform: "capitalize" }}>
                      {event.emoji} {event.category}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#64748B", background: "#F3F0FF", padding: "4px 10px", borderRadius: 99 }}>
                      <UsersIcon />
                      <span>{event.joined}{event.max ? ` / ${event.max}` : ""}</span>
                    </div>
                  </div>

                  <h1 className="font-extrabold text-slate-900 leading-tight tracking-tight m-0 mb-4"
                    style={{ fontSize: "clamp(17px, 4vw, 22px)" }}>
                    {event.title}
                  </h1>

                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {event.tags.map((tag) => (
                        <span key={tag} className="tag-chip text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: "#EDE9FE", color: "#7C3AED" }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <CapacityBar joined={event.joined} max={event.max} />
                </div>
              </div>

              {/* About */}
              {event.description && (
                <Card delay="0.05s">
                  <CardLabel>About this event</CardLabel>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap m-0">{event.description}</p>
                </Card>
              )}

              {/* When & Where */}
              <Card delay="0.08s">
                <CardLabel>When &amp; where</CardLabel>
                <InfoRow icon={<CalendarIcon />} label="Date">
                  <p className="text-sm font-semibold text-slate-800 m-0">{event.dateDisplay}</p>
                </InfoRow>
                <InfoRow icon={<ClockIcon />} label="Time">
                  <p className="text-sm font-semibold text-slate-800 m-0">{event.time}{event.endTime ? ` – ${event.endTime}` : ""}</p>
                </InfoRow>
                <InfoRow icon={<MapPinIcon />} label="Location">
                  <p className="text-sm font-semibold text-slate-800 m-0">{event.venue || `${event.city}, ${event.state}`}</p>
                  {event.venue && event.city && (
                    <p className="text-xs text-slate-400 mt-0.5 m-0">{event.city}{event.district ? `, ${event.district}` : ""}, {event.state}</p>
                  )}
                  {event.mapUrl && (
                    <a href={event.mapUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs no-underline mt-2 font-semibold px-2.5 py-1.5 rounded-lg"
                      style={{ color: "#7C3AED", background: "#EDE9FE" }}>
                      Open in Maps <ExternalIcon />
                    </a>
                  )}
                </InfoRow>
              </Card>

              {/* Participants */}
              {participants.length > 0 && (
                <Card delay="0.11s">
                  <div className="flex items-center justify-between mb-3.5">
                    <CardLabel>Attendees</CardLabel>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#EDE9FE", color: "#7C3AED" }}>
                      {event.joined}{event.max ? ` / ${event.max}` : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((p) => (
                      <div key={p.uid} className="flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-3"
                        style={{ background: "#F5F3FF", border: "1px solid #EDE9FE" }}>
                        <Avatar name={p.name} photoURL={p.photoURL} size={26} />
                        <span className="text-xs font-semibold text-slate-700">{p.name || "Anonymous"}</span>
                      </div>
                    ))}
                    {event.joined > participants.length && (
                      <div className="flex items-center rounded-full px-3 py-1.5" style={{ background: "#EDE9FE", border: "1px solid #DDD6FE" }}>
                        <span className="text-xs font-bold" style={{ color: "#7C3AED" }}>+{event.joined - participants.length} more</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* ✅ On mobile: sidebar cards appear BELOW main content, above action bar */}
              <div className="block lg:hidden">
                <OrganizerCard event={event} />
                <StatsCard event={event} />
                {related.length > 0 && <RelatedCard related={related} event={event} />}
              </div>
            </div>

            {/* ✅ RIGHT SIDEBAR — desktop only */}
            <div className="hidden lg:block">
              <OrganizerCard event={event} />
              <StatsCard event={event} />
              {related.length > 0 && <RelatedCard related={related} event={event} />}
            </div>
          </div>
        </div>

        {/* ── STICKY BOTTOM ACTION BAR ───────────────────────────────────────── */}
        {/* Clean: no WhatsApp here — it's already in the top nav for easy mobile tap */}
        
      </div>

      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="toast-anim fixed left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-5 py-2.5 rounded-full z-[999] whitespace-nowrap"
          style={{ bottom: 80, background: "linear-gradient(135deg,#1E1B4B,#4C1D95)", boxShadow: "0 4px 20px rgba(30,27,75,0.35)" }}>
          {toast}
        </div>
      )}
    </>
  );
}