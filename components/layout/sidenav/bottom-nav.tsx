"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Icons (reused from sidenav) ──────────────────────────────────────────────

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ExploreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Bottom Nav Items ─────────────────────────────────────────────────────────

const BOTTOM_NAV = [
  { id: "home",      path: "/dashboard",  label: "Home",      icon: <HomeIcon /> },
  { id: "explore",   path: "/explore",    label: "Explore",   icon: <ExploreIcon /> },
  { id: "create",    path: "/create-event", label: "Create",  icon: null },   // FAB slot
  { id: "my-events", path: "/my-events",  label: "My Events", icon: <CalendarIcon /> },
  { id: "settings",  path: "/settings",   label: "Settings",  icon: <SettingsIcon /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .bottom-nav {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 64px;
          background: #1A1A2E;
          border-top: 1px solid rgba(127,119,221,0.15);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
          /* safe area for iPhone home bar */
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .bn-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          text-decoration: none;
          color: rgba(255,255,255,0.35);
          font-size: 10px;
          font-weight: 500;
          transition: color 0.15s;
          padding: 6px 0;
          -webkit-tap-highlight-color: transparent;
        }

        .bn-item.active {
          color: #7F77DD;
        }

        .bn-item:active {
          opacity: 0.7;
        }

        /* FAB (Create) button */
        .bn-fab-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 600;
          color: #7F77DD;
          -webkit-tap-highlight-color: transparent;
        }

        .bn-fab {
          width: 44px; height: 44px;
          background: #7F77DD;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          box-shadow: 0 4px 16px rgba(127,119,221,0.45);
          transition: transform 0.15s, background 0.15s;
          margin-top: -8px;
        }

        .bn-fab-wrap:active .bn-fab {
          transform: scale(0.93);
          background: #6B63CC;
        }

        /* Spacer so content doesn't hide behind bottom nav */
        .bottom-nav-spacer {
          height: calc(64px + env(safe-area-inset-bottom, 0px));
        }
      `}</style>

      <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
        {BOTTOM_NAV.map((item) => {
          if (item.id === "create") {
            return (
              <Link key="create" href={item.path} className="bn-fab-wrap">
                <div className="bn-fab">
                  <PlusIcon />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          }

          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`bn-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Push page content above the fixed nav */}
      <div className="bottom-nav-spacer" />
    </>
  );
}