"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

// ─── Icons ────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#E24B4A" : "none"} stroke={filled ? "#E24B4A" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ name, photoURL, size = 32 }: { name: string; photoURL: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: "linear-gradient(135deg,#7F77DD,#1D9E75)",
      }}
    >
      {initials}
    </div>
  );
}

function CapacityBar({ joined, max }: { joined: number; max: number | null }) {
  if (!max) return <p className="text-xs text-gray-400 m-0">{joined} joined · Unlimited capacity</p>;
  const pct   = Math.min(Math.round((joined / max) * 100), 100);
  const color = pct >= 90 ? "#E24B4A" : pct >= 70 ? "#BA7517" : "#1D9E75";
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-400">{joined} / {max} joined</span>
        <span className="text-xs font-semibold" style={{ color }}>{pct}% full</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 last:pb-0">
      <span className="text-[#7F77DD] mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400 mb-0.5 m-0">{label}</p>
        {children}
      </div>
    </div>
  );
}

function Section({ children, delay = "0s" }: { children: React.ReactNode; delay?: string }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 mb-3.5"
      style={{ animation: "fadeUp 0.4s ease both", animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 m-0">
      {children}
    </p>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EventViewPage() {
  const params  = useParams();
  const router  = useRouter();
  const eventId = params?.id as string;

  const [event,        setEvent]        = useState<EventDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [related,      setRelated]      = useState<RelatedEvent[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [isActing,     setIsActing]     = useState(false);
  const [toast,        setToast]        = useState("");

  useEffect(() => {
    if (!eventId) return;
    incrementView(eventId);
    Promise.all([loadEventDetail(eventId), loadParticipants(eventId)]).then(
      ([evRes, partRes]) => {
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
      }
    );
  }, [eventId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleJoin = async () => {
    if (!event || isActing) return;
    setIsActing(true);
    const fn  = event.isJoined ? leaveEventDetail : joinEventDetail;
    const res = await fn(eventId);
    if (res.success) {
      setEvent((prev) =>
        prev ? { ...prev, isJoined: !prev.isJoined, joined: prev.isJoined ? prev.joined - 1 : prev.joined + 1 } : prev
      );
      showToast(event.isJoined ? "You left the event" : "You joined the event! 🎉");
      loadParticipants(eventId).then((r) => { if (r.success && r.data) setParticipants(r.data); });
    } else {
      showToast(res.error ?? "Something went wrong");
    }
    setIsActing(false);
  };

  const handleFav = async () => {
    if (!event) return;
    const res = await toggleFavouriteDetail(eventId, event.isFavourite);
    if (res.success) {
      setEvent((prev) => (prev ? { ...prev, isFavourite: !prev.isFavourite } : prev));
      showToast(event.isFavourite ? "Removed from saved" : "Saved to favourites ❤️");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-9 h-9 border-[3px] border-[#EEEDFE] border-t-[#7F77DD] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading event…</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-3">😕</div>
          <p className="text-base font-semibold text-[#1A1A2E] mb-1">Event not found</p>
          <p className="text-sm text-gray-400 mb-5">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-[#7F77DD] hover:bg-[#6B63CC] text-white text-sm font-semibold rounded-xl cursor-pointer border-0 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isFull = event.max !== null && event.joined >= event.max;
  const isPast = event.status === "past" || event.status === "cancelled";

  const joinBg = isPast || (isFull && !event.isJoined)
    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
    : event.isJoined
    ? "bg-[#FCEBEB] text-[#A32D2D] border border-[#F09595] hover:bg-[#f9d5d5] cursor-pointer"
    : "bg-[#7F77DD] text-white border-0 hover:bg-[#6B63CC] cursor-pointer";

  const joinLabel = isActing ? "…"
    : isPast ? "Event ended"
    : isFull && !event.isJoined ? "Event full"
    : event.isJoined ? "Leave event"
    : "Join event";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .pulse-dot { animation: pulseDot 1.5s infinite; }
        .toast-enter { animation: toastIn 0.25s ease; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 pt-5 pb-28">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4" style={{ animation: "fadeUp 0.3s ease both" }}>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0 transition-colors"
          >
            <BackIcon /> Back
          </button>
          <span className="text-gray-200">/</span>
          <Link href="/explore" className="text-sm text-gray-400 no-underline hover:text-gray-600 transition-colors">
            Explore
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium text-[#1A1A2E] truncate max-w-[200px]">{event.title}</span>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

          {/* ── LEFT ── */}
          <div>
            {/* Hero card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-3.5" style={{ animation: "fadeUp 0.4s ease both" }}>
              {/* Banner */}
              <div className="h-40 flex items-center justify-between px-6 relative" style={{ background: event.categoryBg }}>
                <span className="text-7xl leading-none">{event.emoji}</span>
                <div className="flex flex-col items-end gap-1.5">
                  {event.status === "live" && (
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-[#E1F5EE] text-[#085041] rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] pulse-dot inline-block" />
                      Live now
                    </span>
                  )}
                  {event.status === "past" && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">Past event</span>
                  )}
                  {event.status === "cancelled" && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 bg-[#FCEBEB] text-[#791F1F] rounded-full">Cancelled</span>
                  )}
                  {isFull && event.status !== "past" && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 bg-[#FCEBEB] text-[#791F1F] rounded-full">Full</span>
                  )}
                </div>
                <span
                  className="absolute bottom-2.5 left-4 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: event.type === "Free" ? "#EAF3DE" : "#FAEEDA", color: event.type === "Free" ? "#27500A" : "#633806" }}
                >
                  {event.type === "Paid" ? `₹${event.price}` : "Free"}
                </span>
                <span className="absolute bottom-2.5 right-4 text-[11px] text-gray-400 flex items-center gap-1">
                  <EyeIcon /> {event.views} views
                </span>
              </div>

              {/* Title area */}
              <div className="p-5 pb-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: event.categoryBg, color: event.categoryColor }}
                  >
                    {event.category}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleFav}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-0 cursor-pointer transition-colors ${event.isFavourite ? "bg-[#FCEBEB] text-[#E24B4A]" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                    >
                      <HeartIcon filled={event.isFavourite} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 flex items-center justify-center border-0 cursor-pointer transition-colors"
                    >
                      <ShareIcon />
                    </button>
                  </div>
                </div>
                <h1 className="text-xl font-bold text-[#1A1A2E] leading-snug mb-3.5">{event.title}</h1>
                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {event.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EEEDFE] text-[#3C3489]">#{tag}</span>
                    ))}
                  </div>
                )}
                <CapacityBar joined={event.joined} max={event.max} />
              </div>
            </div>

            {/* About */}
            {event.description && (
              <Section delay="0.05s">
                <SectionLabel>About this event</SectionLabel>
                <p className="text-sm text-[#444441] leading-relaxed whitespace-pre-wrap m-0">{event.description}</p>
              </Section>
            )}

            {/* When & Where */}
            <Section delay="0.08s">
              <SectionLabel>When &amp; Where</SectionLabel>
              <InfoRow icon={<CalendarIcon />} label="Date">
                <p className="text-sm font-medium text-[#1A1A2E] m-0">{event.dateDisplay}</p>
              </InfoRow>
              <InfoRow icon={<ClockIcon />} label="Time">
                <p className="text-sm font-medium text-[#1A1A2E] m-0">{event.time}{event.endTime ? ` – ${event.endTime}` : ""}</p>
              </InfoRow>
              <InfoRow icon={<MapPinIcon />} label="Location">
                <p className="text-sm font-medium text-[#1A1A2E] m-0">{event.venue || `${event.city}, ${event.state}`}</p>
                {event.venue && event.city && (
                  <p className="text-xs text-gray-400 mt-0.5 m-0">{event.city}{event.district ? `, ${event.district}` : ""}, {event.state}</p>
                )}
                {event.mapUrl && (
                  <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#7F77DD] no-underline mt-1.5 hover:underline">
                    Open in Maps <ExternalIcon />
                  </a>
                )}
              </InfoRow>
            </Section>

            {/* Participants */}
            {participants.length > 0 && (
              <Section delay="0.1s">
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>Attendees</SectionLabel>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <UsersIcon />
                    <span className="text-xs">{event.joined}{event.max ? ` / ${event.max}` : ""}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participants.map((p) => (
                    <div key={p.uid} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full pl-1 pr-3 py-1">
                      <Avatar name={p.name} photoURL={p.photoURL} size={24} />
                      <span className="text-xs font-medium text-[#1A1A2E]">{p.name || "Anonymous"}</span>
                    </div>
                  ))}
                  {event.joined > participants.length && (
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
                      <span className="text-xs text-gray-400">+{event.joined - participants.length} more</span>
                    </div>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div>
            {/* Organizer */}
            <Section delay="0.04s">
              <SectionLabel>Organizer</SectionLabel>
              <div className={`flex items-center gap-2.5 ${event.organizerPhone || event.organizerEmail ? "mb-3.5" : ""}`}>
                <Avatar name={event.organizer} photoURL="" size={40} />
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E] m-0">{event.organizer || "Unknown"}</p>
                  <p className="text-xs text-gray-400 m-0">Event organizer</p>
                </div>
              </div>
              {event.organizerPhone && (
                <a href={`tel:${event.organizerPhone}`} className="flex items-center gap-2 text-sm text-[#444441] no-underline py-2 border-t border-gray-100 hover:text-[#7F77DD] transition-colors">
                  <span className="text-[#7F77DD]"><PhoneIcon /></span>{event.organizerPhone}
                </a>
              )}
              {event.organizerEmail && (
                <a href={`mailto:${event.organizerEmail}`} className="flex items-center gap-2 text-sm text-[#444441] no-underline py-2 border-t border-gray-100 hover:text-[#7F77DD] transition-colors">
                  <span className="text-[#7F77DD]"><MailIcon /></span>{event.organizerEmail}
                </a>
              )}
            </Section>

            {/* Stats */}
            <Section delay="0.07s">
              <SectionLabel>Event stats</SectionLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Joined",   value: String(event.joined),                                icon: "👥" },
                  { label: "Views",    value: String(event.views),                                 icon: "👁" },
                  { label: "Capacity", value: event.max ? String(event.max) : "∞",               icon: "🎯" },
                  { label: "Entry",    value: event.type === "Paid" ? `₹${event.price}` : "Free", icon: "🎟" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <p className="text-base font-bold text-[#1A1A2E] m-0 mb-0.5">{s.value}</p>
                    <p className="text-[11px] text-gray-400 m-0">{s.label}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Related events */}
            {related.length > 0 && (
              <Section delay="0.09s">
                <SectionLabel>More {event.category} events</SectionLabel>
                <div className="flex flex-col gap-2">
                  {related.map((r) => (
                    <Link key={r.id} href={`/events/${r.id}`} className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-3 no-underline hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: r.categoryBg }}>
                        {r.emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1A1A2E] truncate m-0 mb-0.5">{r.title}</p>
                        <p className="text-[11px] text-gray-400 m-0 mb-1">{r.dateDisplay} · {r.city}</p>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: r.type === "Free" ? "#EAF3DE" : "#FAEEDA", color: r.type === "Free" ? "#27500A" : "#633806" }}
                        >
                          {r.type === "Paid" ? `₹${r.price}` : "Free"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Sticky action bar — attendee */}
      {!event.isOwner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2.5 z-50">
          <button
            onClick={handleFav}
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors border ${event.isFavourite ? "bg-[#FCEBEB] border-[#F09595] text-[#E24B4A]" : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"}`}
          >
            <HeartIcon filled={event.isFavourite} />
          </button>
          <button
            onClick={handleJoin}
            disabled={isActing || (isFull && !event.isJoined) || isPast}
            className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-colors ${joinBg} ${isActing ? "opacity-70" : ""}`}
          >
            {joinLabel}
          </button>
        </div>
      )}

      {/* Sticky action bar — owner */}
      {event.isOwner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
          <Link
            href={`/events/${eventId}/edit`}
            className="flex items-center justify-center w-full h-11 rounded-xl bg-[#7F77DD] hover:bg-[#6B63CC] text-white text-sm font-semibold no-underline transition-colors"
          >
            Edit event
          </Link>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-enter fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white text-sm font-medium px-5 py-2.5 rounded-full z-[999] whitespace-nowrap">
          {toast}
        </div>
      )}
    </>
  );
}