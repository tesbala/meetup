"use client";
import { useState, useEffect } from "react";
import SideNav from "@/components/layout/sidenav/sidenav";
import BottomNav from "@/components/layout/sidenav/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Mobile: full-height main, BottomNav fixed at bottom ──────────────────
  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          // dynamic viewport height (handles iOS Safari bar)
          overflow: "hidden",
        }}
      >
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minWidth: 0,
          }}
        >
          {children}
        </main>

        {/* Fixed bottom tab bar — only rendered on mobile */}
        <BottomNav />
      </div>
    );
  }

  // ── Desktop: side nav + scrollable main ──────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <SideNav />

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}