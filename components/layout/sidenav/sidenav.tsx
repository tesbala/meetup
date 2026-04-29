"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ExploreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubItem {
  path: string;
  label: string;
  badge?: number;
}

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  subItems?: SubItem[];
}

interface SideNavProps {
  onClose?: () => void;
  userName?: string;
  userInitials?: string;
  userCity?: string;
}

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    path: "/dashboard",
    label: "Home feed",
    icon: <HomeIcon />,
  },
  
 {
  id: "explore",
  path: "/explore",
  label: "Explore events",
  icon: <ExploreIcon />,
  // subItems: [
  //   { path: "/explore?category=tech", label: "Tech & Business" },
  //   { path: "/explore?category=music", label: "Music & Art" },
  //   { path: "/explore?category=sports", label: "Sports & Health" },
  //   { path: "/explore?category=food", label: "Food & Travel" },
  // ],
},
  
  // {
  //   id: "nearby",
  //   path: "/nearby",
  //   label: "Near me",
  //   icon: <MapPinIcon />,
  // },
  
  {
    id: "my-events",
    path: "/my-events",
    label: "My events",
    icon: <CalendarIcon />,
    // subItems: [
    //   { path: "/my-events/created", label: "Created by me" },
    //   { path: "/my-events/joined", label: "Joined events" },
    //   { path: "/my-events/past", label: "Past events" },
    // ],
  },


  // {
  //   id: "saved",
  //   path: "/saved",
  //   label: "Saved",
  //   icon: <BookmarkIcon />,
  //   badge: 3,
  // },
  // {
  //   id: "notifications",
  //   path: "/notifications",
  //   label: "Notifications",
  //   icon: <BellIcon />,
  //   badge: 4,
  // },
  {
    id: "Ai support",
    path: "/customercar",
    label: "Ai support",
    icon: <UsersIcon />,
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    id: "settings",
    path: "/settings",
    label: "Settings",
    icon: <SettingsIcon />,
    subItems: [
      { path: "/settings/profile", label: "Edit profile" },
      { path: "/settings/interests", label: "Manage interests" },
      { path: "/settings/notifications", label: "Notification prefs" },
      { path: "/settings/privacy", label: "Privacy" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SideNav: React.FC<SideNavProps> = ({
  onClose,
  userName = "Create Event",
  userInitials = "MU",
  userCity = "Expolare events",
}) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["explore"]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-expand active parent
  useEffect(() => {
    NAV_ITEMS.forEach(item => {
      if (item.subItems?.some(s => pathname.startsWith(s.path))) {
        setExpandedItems(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
      }
    });
  }, [pathname]);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const isParentActive = (item: NavItem) =>
    isActive(item.path) || item.subItems?.some(s => isActive(s.path)) || false;

  const toggleExpand = (id: string) => {
    if (collapsed) setCollapsed(false);
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLink = () => {
    if (isMobile && onClose) onClose();
  };

  const w = collapsed ? "72px" : "248px";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .sidenav-root { font-family: 'DM Sans', sans-serif; }
        .sidenav-root * { box-sizing: border-box; }
        .nav-item-btn { transition: background 0.15s, color 0.15s; }
        .nav-item-btn:hover { background: rgba(127,119,221,0.1) !important; }
        .sub-link:hover { background: rgba(127,119,221,0.08) !important; color: #AFA9EC !important; }
        .create-side-btn:hover { background: #6B63CC !important; }
        .collapse-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .tooltip-wrap { position: relative; }
        .tooltip-wrap .tooltip {
          display: none;
          position: absolute;
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background: #2D2D4A;
          color: #E8E8FF;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 200;
          border: 1px solid rgba(127,119,221,0.2);
        }
        .tooltip-wrap:hover .tooltip { display: block; }
        @keyframes subSlide {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .sub-list { animation: subSlide 0.18s ease both; }
        @keyframes sideIn {
          from { opacity:0; transform:translateX(-16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .sidenav-root { animation: sideIn 0.25s ease both; }
        .active-bar {
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 60%;
          background: #7F77DD;
          border-radius: 0 3px 3px 0;
        }
        .badge-dot {
          min-width: 18px; height: 18px;
          background: #E24B4A;
          border-radius: 9px;
          font-size: 10px; font-weight: 600;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
        }
      `}</style>

      <aside
        className="sidenav-root"
        style={{
          width: w,
          minWidth: w,
          height: "100%",
          background: "#1A1A2E",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1), min-width 0.25s cubic-bezier(.4,0,.2,1)",
          borderRight: "1px solid rgba(127,119,221,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Top: Brand + Collapse ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "16px 0" : "16px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          {/* Brand */}
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <div style={{
                width: "32px", height: "32px",
                background: "rgba(127,119,221,0.15)",
                borderRadius: "9px",
                border: "1px solid rgba(127,119,221,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="#7F77DD" strokeWidth="2"/>
                  <path d="M9 14a5 5 0 0110 0" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="14" cy="10" r="2.5" fill="#7F77DD"/>
                  <path d="M7 19c0-3.87 3.134-7 7-7s7 3.13 7 7" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>
                MeetU
              </span>
            </div>
          )}

          {/* Collapse / Close button */}
          {isMobile ? (
            <button
              className="collapse-btn"
              onClick={onClose}
              style={{
                width: "30px", height: "30px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none",
                borderRadius: "7px", color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            >
              <XIcon />
            </button>
          ) : (
            <button
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expand" : "Collapse"}
              style={{
                width: "28px", height: "28px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none",
                borderRadius: "7px", color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "color 0.15s",
                flexShrink: 0,
              }}
            >
              {collapsed ? <ExpandIcon /> : <CollapseIcon />}
            </button>
          )}
        </div>

        {/* ── Create Event CTA ── */}
        <div style={{ padding: collapsed ? "12px 10px" : "12px 12px", flexShrink: 0 }}>
          <div className="tooltip-wrap">
            <Link
              href="/create-event"
              className="create-side-btn"
              onClick={handleLink}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: "8px",
                padding: collapsed ? "9px" : "9px 14px",
                background: "#7F77DD",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                transition: "background 0.18s",
              }}
            >
              <PlusIcon />
              {!collapsed && "Create event"}
            </Link>
            {collapsed && <span className="tooltip">Create event</span>}
          </div>
        </div>

        {/* ── Section Label ── */}
        {!collapsed && (
          <div style={{
            padding: "6px 16px 4px",
            fontSize: "10px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Menu
          </div>
        )}

        {/* ── Nav Items ── */}
        {/* minHeight:0 is required — without it a flex child cannot shrink  */}
        {/* below its content size, so the nav overflows instead of scrolling */}
        <nav style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", padding: "4px 8px" }}>
          {NAV_ITEMS.map((item) => {
            const active = isParentActive(item);
            const expanded = expandedItems.includes(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id} style={{ marginBottom: "2px" }}>
                <div className="tooltip-wrap" style={{ position: "relative" }}>
                  {/* Active left bar */}
                  {active && <span className="active-bar" />}

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Link
                      href={item.path}
                      onClick={handleLink}
                      // onClick={() => {
                      //   handleLink();
                      //   if (hasSubItems && !collapsed) toggleExpand(item.id);
                      // }}
                      className="nav-item-btn"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: collapsed ? "9px" : "9px 10px 9px 14px",
                        justifyContent: collapsed ? "center" : "flex-start",
                        background: active
                          ? "rgba(127,119,221,0.15)"
                          : "transparent",
                        borderRadius: hasSubItems && !collapsed ? "8px 0 0 8px" : "8px",
                        color: active ? "#AFA9EC" : "rgba(255,255,255,0.5)",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: active ? 500 : 400,
                        transition: "background 0.15s, color 0.15s",
                        minWidth: 0,
                      }}
                    >
                      <span style={{ color: active ? "#7F77DD" : "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.label}
                        </span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="badge-dot">{item.badge}</span>
                      )}
                    </Link>

                    {/* Expand chevron for sub-items */}
                    {hasSubItems && !collapsed && (
                      <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleExpand(item.id); }}
                       // onClick={() => toggleExpand(item.id)}
                        style={{
                          width: "30px", height: "37px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: active ? "rgba(127,119,221,0.15)" : "transparent",
                          border: "none",
                          borderRadius: "0 8px 8px 0",
                          borderLeft: "1px solid rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.3)",
                          cursor: "pointer",
                          transition: "transform 0.2s, background 0.15s",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{
                          display: "inline-block",
                          transition: "transform 0.2s",
                          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                        }}>
                          <ChevronDownIcon />
                        </span>
                      </button>
                    )}

                    {/* Badge in collapsed mode */}
                    {collapsed && item.badge && (
                      <span style={{
                        position: "absolute",
                        top: "4px", right: "4px",
                        width: "8px", height: "8px",
                        background: "#E24B4A",
                        borderRadius: "50%",
                        border: "1.5px solid #1A1A2E",
                      }} />
                    )}
                  </div>

                  {collapsed && <span className="tooltip">{item.label}</span>}
                </div>

                {/* Sub-items */}
                {hasSubItems && expanded && !collapsed && (
                  <ul
                    className="sub-list"
                    style={{
                      listStyle: "none",
                      margin: "3px 0 3px 14px",
                      padding: "0 0 0 16px",
                      borderLeft: "1px solid rgba(127,119,221,0.2)",
                    }}
                  >
                    {item.subItems!.map((sub) => {
                      const subActive = isActive(sub.path);
                      return (
                        <li key={sub.path} style={{ marginBottom: "1px" }}>
                          <Link
                            href={sub.path}
                            onClick={handleLink}
                            className="sub-link"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "7px 10px",
                              borderRadius: "7px",
                              fontSize: "12px",
                              fontWeight: subActive ? 500 : 400,
                              color: subActive ? "#AFA9EC" : "rgba(255,255,255,0.35)",
                              textDecoration: "none",
                              transition: "background 0.15s, color 0.15s",
                              background: subActive ? "rgba(127,119,221,0.1)" : "transparent",
                            }}
                          >
                            <span style={{
                              width: "5px", height: "5px",
                              borderRadius: "50%",
                              background: subActive ? "#7F77DD" : "rgba(255,255,255,0.2)",
                              flexShrink: 0,
                            }} />
                            {sub.label}
                            {sub.badge && (
                              <span className="badge-dot" style={{ marginLeft: "auto" }}>{sub.badge}</span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Divider ── */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 12px" }} />

        {/* ── Bottom Items (Settings) ── */}
        <div style={{ padding: "4px 8px", flexShrink: 0 }}>
          {BOTTOM_ITEMS.map((item) => {
            const active = isParentActive(item);
            const expanded = expandedItems.includes(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id} style={{ marginBottom: "2px" }}>
                <div className="tooltip-wrap" style={{ position: "relative" }}>
                  {active && <span className="active-bar" />}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Link
                      href={item.path}
                      onClick={() => {
                        handleLink();
                        if (hasSubItems && !collapsed) toggleExpand(item.id);
                      }}
                      className="nav-item-btn"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: collapsed ? "9px" : "9px 10px 9px 14px",
                        justifyContent: collapsed ? "center" : "flex-start",
                        background: active ? "rgba(127,119,221,0.15)" : "transparent",
                        borderRadius: hasSubItems && !collapsed ? "8px 0 0 8px" : "8px",
                        color: active ? "#AFA9EC" : "rgba(255,255,255,0.5)",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: active ? 500 : 400,
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      <span style={{ color: active ? "#7F77DD" : "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                    {hasSubItems && !collapsed && (
                      <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleExpand(item.id); }}
                        //onClick={() => toggleExpand(item.id)}
                        style={{
                          width: "30px", height: "37px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: active ? "rgba(127,119,221,0.15)" : "transparent",
                          border: "none",
                          borderRadius: "0 8px 8px 0",
                          borderLeft: "1px solid rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.3)",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{
                          display: "inline-block",
                          transition: "transform 0.2s",
                          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                        }}>
                          <ChevronDownIcon />
                        </span>
                      </button>
                    )}
                  </div>
                  {collapsed && <span className="tooltip">{item.label}</span>}
                </div>

                {hasSubItems && expanded && !collapsed && (
                  <ul
                    className="sub-list"
                    style={{
                      listStyle: "none",
                      margin: "3px 0 3px 14px",
                      padding: "0 0 0 16px",
                      borderLeft: "1px solid rgba(127,119,221,0.2)",
                    }}
                  >
                    {item.subItems!.map((sub) => {
                      const subActive = isActive(sub.path);
                      return (
                        <li key={sub.path} style={{ marginBottom: "1px" }}>
                          <Link
                            href={sub.path}
                            onClick={handleLink}
                            className="sub-link"
                            style={{
                              display: "flex", alignItems: "center", gap: "8px",
                              padding: "7px 10px",
                              borderRadius: "7px",
                              fontSize: "12px",
                              fontWeight: subActive ? 500 : 400,
                              color: subActive ? "#AFA9EC" : "rgba(255,255,255,0.35)",
                              textDecoration: "none",
                              background: subActive ? "rgba(127,119,221,0.1)" : "transparent",
                            }}
                          >
                            <span style={{
                              width: "5px", height: "5px",
                              borderRadius: "50%",
                              background: subActive ? "#7F77DD" : "rgba(255,255,255,0.2)",
                              flexShrink: 0,
                            }} />
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* ── User Profile Card ── */}
        <div style={{
          padding: collapsed ? "10px 8px" : "10px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <div className="tooltip-wrap" style={{ position: "relative" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: collapsed ? "8px" : "8px 10px",
              borderRadius: "9px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              justifyContent: collapsed ? "center" : "flex-start",
            }}>
              <div style={{
                width: "30px", height: "30px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7F77DD, #1D9E75)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 600, color: "#fff",
                flexShrink: 0,
              }}>
                {userInitials}
              </div>
              {!collapsed && (
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: "12px", fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                    margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {userName}
                  </p>
                  <p style={{
                    fontSize: "11px", color: "rgba(255,255,255,0.3)",
                    margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {userCity}
                  </p>
                </div>
              )}
            </div>
            {collapsed && <span className="tooltip">{userName} · {userCity}</span>}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNav;