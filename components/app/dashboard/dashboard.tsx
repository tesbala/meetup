"use client";
import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  city: string;
  state: string;
  joined: number;
  max: number | null;
  type: "Free" | "Paid";
  status: "upcoming" | "live" | "past" | "cancelled";
  categoryColor: string;
  categoryBg: string;
}

interface Notification {
  id: string;
  type: "join" | "reminder" | "update";
  text: string;
  time: string;
  read: boolean;
  iconBg: string;
  iconColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STATS: StatCard[] = [
  {
    label: "Total events",
    value: "24",
    change: "+3 this month",
    positive: true,
    accent: "#7F77DD",
    bg: "#EEEDFE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Total joined",
    value: "1,284",
    change: "+186 this week",
    positive: true,
    accent: "#1D9E75",
    bg: "#E1F5EE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Upcoming events",
    value: "8",
    change: "Next in 2 days",
    positive: true,
    accent: "#BA7517",
    bg: "#FAEEDA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Saved events",
    value: "17",
    change: "+5 this week",
    positive: true,
    accent: "#D4537E",
    bg: "#FBEAF0",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4537E" strokeWidth="1.8" strokeLinecap="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
  },
];

const EVENTS: Event[] = [
  { id: "1", title: "Chennai Tech Meetup 2025", category: "Tech", date: "Sat 12 Apr", time: "6:00 PM", city: "Chennai", state: "Tamil Nadu", joined: 48, max: 100, type: "Free", status: "upcoming", categoryColor: "#3C3489", categoryBg: "#EEEDFE" },
  { id: "2", title: "Madurai Food Festival", category: "Food", date: "Sun 13 Apr", time: "11:00 AM", city: "Madurai", state: "Tamil Nadu", joined: 92, max: 100, type: "Free", status: "live", categoryColor: "#712B13", categoryBg: "#FAECE7" },
  { id: "3", title: "Bangalore Startup Pitch Night", category: "Business", date: "Fri 18 Apr", time: "7:00 PM", city: "Bangalore", state: "Karnataka", joined: 31, max: 50, type: "Paid", status: "upcoming", categoryColor: "#0C447C", categoryBg: "#E6F1FB" },
  { id: "4", title: "Kochi Music & Art Fest", category: "Music", date: "Sat 19 Apr", time: "5:00 PM", city: "Kochi", state: "Kerala", joined: 74, max: null, type: "Free", status: "upcoming", categoryColor: "#633806", categoryBg: "#FAEEDA" },
  { id: "5", title: "Delhi Photography Walk", category: "Photography", date: "Sun 20 Apr", time: "7:30 AM", city: "Delhi", state: "Delhi", joined: 18, max: 30, type: "Free", status: "upcoming", categoryColor: "#085041", categoryBg: "#E1F5EE" },
  { id: "6", title: "Mumbai Fitness Bootcamp", category: "Health", date: "Mon 7 Apr", time: "6:00 AM", city: "Mumbai", state: "Maharashtra", joined: 40, max: 40, type: "Free", status: "past", categoryColor: "#27500A", categoryBg: "#EAF3DE" },
];

const NOTIFICATIONS: Notification[] = [
  { id: "1", type: "join", text: "Priya Sharma joined your Chennai Tech Meetup", time: "2 min ago", read: false, iconBg: "#EEEDFE", iconColor: "#534AB7" },
  { id: "2", type: "reminder", text: "Madurai Food Festival starts in 24 hours", time: "1 hr ago", read: false, iconBg: "#FAEEDA", iconColor: "#854F0B" },
  { id: "3", type: "update", text: "Startup Pitch Night venue updated to WeWork", time: "3 hrs ago", read: false, iconBg: "#E1F5EE", iconColor: "#0F6E56" },
  { id: "4", type: "join", text: "Rahul Nair joined your Bangalore event", time: "5 hrs ago", read: true, iconBg: "#EEEDFE", iconColor: "#534AB7" },
];

const CATEGORIES = [
  { label: "All", count: 24 },
  { label: "Tech", count: 6 },
  { label: "Music", count: 4 },
  { label: "Food", count: 5 },
  { label: "Sports", count: 3 },
  { label: "Art", count: 3 },
  { label: "Health", count: 3 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: Event["status"] }) => {
  const map = {
    upcoming: { bg: "#EEEDFE", color: "#3C3489", label: "Upcoming" },
    live:     { bg: "#E1F5EE", color: "#085041", label: "Live now" },
    past:     { bg: "#F1EFE8", color: "#444441", label: "Past" },
    cancelled:{ bg: "#FCEBEB", color: "#791F1F", label: "Cancelled" },
  };
  const s = map[status];
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600,
      padding: "3px 8px", borderRadius: "20px",
      background: s.bg, color: s.color,
      letterSpacing: "0.02em",
    }}>
      {status === "live" && (
        <span style={{
          display: "inline-block", width: "6px", height: "6px",
          borderRadius: "50%", background: "#1D9E75",
          marginRight: "4px", verticalAlign: "middle",
          animation: "pulse 1.5s infinite",
        }} />
      )}
      {s.label}
    </span>
  );
};

const MiniBar = ({ value, max }: { value: number; max: number | null }) => {
  if (!max) return <span style={{ fontSize: "12px", color: "#B4B2A9" }}>Unlimited</span>;
  const pct = Math.round((value / max) * 100);
  const color = pct >= 90 ? "#E24B4A" : pct >= 70 ? "#BA7517" : "#1D9E75";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "4px", background: "#F0F0F8", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: "11px", color: "#888780", minWidth: "36px" }}>{value}/{max}</span>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | "created" | "joined">("all");
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const filteredEvents = EVENTS.filter(e =>
    activeCategory === "All" || e.category === activeCategory
  );

  const unreadCount = notifs.filter(n => !n.read).length;

  const markRead = (id: string) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F5F5FA", minHeight: "100vh", width: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes countUp { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        .stat-card { transition: border-color 0.2s, transform 0.15s; }
        .stat-card:hover { border-color: rgba(127,119,221,0.3) !important; transform: translateY(-2px); }
        .event-row { transition: background 0.15s; }
        .event-row:hover { background: #FAFAFE !important; }
        .cat-btn { transition: all 0.15s; }
        .cat-btn:hover { border-color: #7F77DD !important; color: #7F77DD !important; }
        .notif-item { transition: background 0.15s; cursor: pointer; }
        .notif-item:hover { background: #FAFAFE !important; }
        .tab-btn { transition: all 0.15s; }
        .quick-link { transition: background 0.15s, border-color 0.15s; }
        .quick-link:hover { background: #EEEDFE !important; border-color: #AFA9EC !important; }
      `}</style>

      <div style={{ width: "100%", padding: "24px 28px" }}>

        {/* ── Page Header ── */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", marginBottom: "22px",
          animation: "fadeUp 0.4s ease both",
        }}>
          <div>
            <p style={{ fontSize: "13px", color: "#888780", marginBottom: "4px" }}>
              Saturday, 12 April 2025
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px", fontWeight: 700,
              color: "#1A1A2E", letterSpacing: "-0.02em", lineHeight: 1.2,
            }}>
              Good morning, Arjun 👋
            </h1>
            <p style={{ fontSize: "14px", color: "#888780", marginTop: "6px" }}>
              You have <strong style={{ color: "#7F77DD" }}>8 upcoming events</strong> and <strong style={{ color: "#E24B4A" }}>4 new notifications</strong>.
            </p>
          </div>
          <Link
            href="/create-event"
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "10px 18px",
              background: "#7F77DD",
              borderRadius: "10px",
              fontSize: "14px", fontWeight: 600, color: "#fff",
              textDecoration: "none",
              flexShrink: 0,
              transition: "background 0.18s",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create event
          </Link>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card"
              style={{
                background: "#fff",
                border: "1px solid #E8E8F0",
                borderRadius: "14px",
                padding: "18px 20px",
                animation: `fadeUp 0.4s ${i * 0.07}s ease both`,
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                <div style={{
                  width: "40px", height: "40px",
                  background: stat.bg, borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: 500,
                  color: stat.positive ? "#1D9E75" : "#E24B4A",
                  background: stat.positive ? "#E1F5EE" : "#FCEBEB",
                  padding: "3px 8px", borderRadius: "20px",
                }}>
                  {stat.positive ? "↑" : "↓"} {stat.change}
                </span>
              </div>
              <div style={{
                fontSize: "28px", fontWeight: 700,
                color: "#1A1A2E", letterSpacing: "-0.03em",
                animation: "countUp 0.5s ease both",
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "#888780", marginTop: "3px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>

          {/* Left: Events Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Events Section */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #E8E8F0",
              overflow: "hidden",
              animation: "fadeUp 0.5s 0.2s ease both",
              opacity: 0, animationFillMode: "forwards",
            }}>
              {/* Section Header */}
              <div style={{
                padding: "18px 20px 0",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A2E" }}>Events</h2>
                  <p style={{ fontSize: "12px", color: "#888780", marginTop: "2px" }}>
                    {filteredEvents.length} events found
                  </p>
                </div>
                <Link href="/my-events" style={{
                  fontSize: "12px", fontWeight: 500, color: "#7F77DD",
                  textDecoration: "none", padding: "5px 10px",
                  borderRadius: "7px", background: "#EEEDFE",
                }}>
                  View all →
                </Link>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "4px", padding: "14px 20px 0" }}>
                {(["all", "created", "joined"] as const).map(tab => (
                  <button
                    key={tab}
                    className="tab-btn"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "6px 14px",
                      background: activeTab === tab ? "#1A1A2E" : "transparent",
                      border: "1px solid",
                      borderColor: activeTab === tab ? "#1A1A2E" : "#E8E8F0",
                      borderRadius: "8px",
                      fontSize: "12px", fontWeight: 500,
                      color: activeTab === tab ? "#fff" : "#888780",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "all" ? "All events" : tab === "created" ? "Created" : "Joined"}
                  </button>
                ))}
              </div>

              {/* Category Filter Chips */}
              <div style={{
                display: "flex", gap: "6px", overflowX: "auto",
                padding: "12px 20px", scrollbarWidth: "none",
              }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.label}
                    className="cat-btn"
                    onClick={() => setActiveCategory(cat.label)}
                    style={{
                      padding: "5px 12px",
                      background: activeCategory === cat.label ? "#1A1A2E" : "#fff",
                      border: "1px solid",
                      borderColor: activeCategory === cat.label ? "#1A1A2E" : "#E8E8F0",
                      borderRadius: "20px",
                      fontSize: "12px", fontWeight: activeCategory === cat.label ? 500 : 400,
                      color: activeCategory === cat.label ? "#fff" : "#888780",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {cat.label}
                    <span style={{
                      marginLeft: "5px", fontSize: "10px",
                      color: activeCategory === cat.label ? "rgba(255,255,255,0.6)" : "#B4B2A9",
                    }}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Events List */}
              <div>
                {filteredEvents.map((event, i) => (
                  <div
                    key={event.id}
                    className="event-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "12px",
                      padding: "14px 20px",
                      borderTop: "1px solid #F5F5FA",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                        <StatusBadge status={event.status} />
                        <span style={{
                          fontSize: "11px", fontWeight: 500,
                          padding: "2px 8px", borderRadius: "20px",
                          background: event.categoryBg,
                          color: event.categoryColor,
                        }}>
                          {event.category}
                        </span>
                        <span style={{
                          fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                          background: event.type === "Free" ? "#EAF3DE" : "#FAEEDA",
                          color: event.type === "Free" ? "#27500A" : "#633806",
                          fontWeight: 500,
                        }}>
                          {event.type}
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: "14px", fontWeight: 600,
                        color: "#1A1A2E", marginBottom: "5px",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {event.title}
                      </h3>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "12px", color: "#888780", display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {event.date} · {event.time}
                        </span>
                        <span style={{ fontSize: "12px", color: "#888780", display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {event.city}, {event.state}
                        </span>
                      </div>

                      <div style={{ marginTop: "8px", maxWidth: "260px" }}>
                        <MiniBar value={event.joined} max={event.max} />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                      <Link
                        href={`/events/${event.id}`}
                        style={{
                          fontSize: "12px", fontWeight: 500,
                          color: "#7F77DD",
                          padding: "5px 12px",
                          background: "#EEEDFE",
                          borderRadius: "7px",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View →
                      </Link>
                      <span style={{ fontSize: "11px", color: "#B4B2A9" }}>
                        {event.joined} joined
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #E8E8F0", padding: "18px 20px",
              animation: "fadeUp 0.5s 0.3s ease both",
              opacity: 0, animationFillMode: "forwards",
            }}>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A2E", marginBottom: "14px" }}>
                Quick actions
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { label: "Explore events", icon: "🔍", href: "/explore", bg: "#EEEDFE", color: "#3C3489" },
                  { label: "Near me", icon: "📍", href: "/nearby", bg: "#E1F5EE", color: "#085041" },
                  { label: "My profile", icon: "👤", href: "/profile", bg: "#FBEAF0", color: "#72243E" },
                  { label: "Saved events", icon: "🔖", href: "/saved", bg: "#FAEEDA", color: "#633806" },
                  { label: "Community", icon: "👥", href: "/community", bg: "#E6F1FB", color: "#0C447C" },
                  { label: "Settings", icon: "⚙️", href: "/settings", bg: "#F1EFE8", color: "#444441" },
                ].map(ql => (
                  <Link
                    key={ql.label}
                    href={ql.href}
                    className="quick-link"
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: "6px", padding: "14px 10px",
                      background: "#FAFAFA",
                      border: "1px solid #F0F0F8", borderRadius: "10px",
                      textDecoration: "none", textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>{ql.icon}</span>
                    <span style={{ fontSize: "11px", fontWeight: 500, color: "#444441", lineHeight: 1.3 }}>
                      {ql.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Notifications + Activity */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Notifications Panel */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #E8E8F0",
              overflow: "hidden",
              animation: "fadeUp 0.5s 0.25s ease both",
              opacity: 0, animationFillMode: "forwards",
            }}>
              <div style={{
                padding: "16px 16px 12px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: "1px solid #F5F5FA",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A2E" }}>Notifications</h2>
                  {unreadCount > 0 && (
                    <span style={{
                      minWidth: "20px", height: "20px",
                      background: "#E24B4A", borderRadius: "10px",
                      fontSize: "11px", fontWeight: 600, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 5px",
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}
                  style={{
                    fontSize: "11px", fontWeight: 500, color: "#7F77DD",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Mark all read
                </button>
              </div>

              {notifs.map(n => (
                <div
                  key={n.id}
                  className="notif-item"
                  onClick={() => markRead(n.id)}
                  style={{
                    display: "flex", gap: "10px",
                    padding: "12px 16px",
                    background: n.read ? "#fff" : "#FAFAFE",
                    borderBottom: "1px solid #F5F5FA",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    width: "32px", height: "32px", flexShrink: 0,
                    background: n.iconBg, borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px",
                  }}>
                    {n.type === "join" ? "👤" : n.type === "reminder" ? "🔔" : "📍"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: "12px", color: "#1A1A2E",
                      lineHeight: 1.5, margin: "0 0 3px",
                    }}>
                      {n.text}
                    </p>
                    <span style={{ fontSize: "11px", color: "#B4B2A9" }}>{n.time}</span>
                  </div>
                  {!n.read && (
                    <div style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "#7F77DD", flexShrink: 0, marginTop: "5px",
                    }} />
                  )}
                </div>
              ))}

              <div style={{ padding: "10px 16px" }}>
                <Link href="/notifications" style={{
                  display: "block", textAlign: "center",
                  padding: "8px", background: "#F5F5FA",
                  borderRadius: "8px", fontSize: "12px",
                  fontWeight: 500, color: "#7F77DD",
                  textDecoration: "none",
                }}>
                  View all notifications
                </Link>
              </div>
            </div>

            {/* Interest Tags */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #E8E8F0", padding: "16px",
              animation: "fadeUp 0.5s 0.35s ease both",
              opacity: 0, animationFillMode: "forwards",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A2E" }}>Your interests</h2>
                <Link href="/settings/interests" style={{ fontSize: "11px", color: "#7F77DD", textDecoration: "none" }}>Edit</Link>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {[
                  { label: "Tech", bg: "#EEEDFE", color: "#3C3489" },
                  { label: "Music", bg: "#FAEEDA", color: "#633806" },
                  { label: "Food", bg: "#FAECE7", color: "#712B13" },
                  { label: "Travel", bg: "#E6F1FB", color: "#0C447C" },
                  { label: "Photography", bg: "#E1F5EE", color: "#085041" },
                  { label: "Business", bg: "#FBEAF0", color: "#72243E" },
                ].map(tag => (
                  <span
                    key={tag.label}
                    style={{
                      fontSize: "12px", fontWeight: 500,
                      padding: "4px 12px", borderRadius: "20px",
                      background: tag.bg, color: tag.color,
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Location Card */}
            <div style={{
              background: "#1A1A2E", borderRadius: "16px",
              padding: "18px",
              animation: "fadeUp 0.5s 0.4s ease both",
              opacity: 0, animationFillMode: "forwards",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <div style={{
                  width: "30px", height: "30px",
                  background: "rgba(127,119,221,0.2)",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>Your location</span>
              </div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#AFA9EC", marginBottom: "4px" }}>
                Chennai, Tamil Nadu
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>
                12 events happening near you
              </p>
              <Link href="/nearby" style={{
                display: "block", textAlign: "center",
                padding: "8px",
                background: "rgba(127,119,221,0.2)",
                border: "1px solid rgba(127,119,221,0.3)",
                borderRadius: "8px",
                fontSize: "12px", fontWeight: 500, color: "#AFA9EC",
                textDecoration: "none",
              }}>
                Explore nearby events →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}