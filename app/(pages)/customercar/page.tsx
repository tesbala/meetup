"use client";

import { useState } from "react";
import {
  getCurrentUserInfo,
  FAQ_ITEMS,
} from "@/app/actions/support-actions";

type PageView = "home" | "faq";

export default function SupportPage() {
  const [view, setView] = useState<PageView>("home");
  const userInfo = getCurrentUserInfo();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .support-root {
          font-family: 'DM Sans', sans-serif;
          background: #F7F7FC;
          min-height: 100vh;
          padding: 0 0 80px;
          color: #1A1A2E;
        }

        /* ── Header ── */
        .sp-header {
          background: #fff;
          border-bottom: 1px solid #E8E8F0;
          padding: 20px 24px 0;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .sp-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .sp-title { font-size: 22px; font-weight: 700; color: #1A1A2E; }
        .sp-subtitle { font-size: 13px; color: #888780; margin-top: 2px; }

        /* ── Tabs ── */
        .sp-tabs { display: flex; overflow-x: auto; scrollbar-width: none; }
        .sp-tabs::-webkit-scrollbar { display: none; }
        .sp-tab {
          padding: 10px 18px;
          font-size: 13px; font-weight: 500; color: #888780;
          border: none; background: none; cursor: pointer;
          border-bottom: 2px solid transparent; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          transition: color .2s, border-color .2s;
        }
        .sp-tab.active { color: #7F77DD; font-weight: 600; border-bottom-color: #7F77DD; }

        /* ── Content ── */
        .sp-content { max-width: 820px; margin: 0 auto; padding: 20px 16px 0; }

        /* ── Hero ── */
        .sp-hero {
          background: linear-gradient(135deg, #7F77DD 0%, #5A52C8 100%);
          border-radius: 16px;
          padding: 24px 20px;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        .sp-hero::before {
          content: ''; position: absolute;
          top: -30px; right: -30px;
          width: 160px; height: 160px;
          border-radius: 50%; background: rgba(255,255,255,.08);
        }
        .sp-hero::after {
          content: ''; position: absolute;
          bottom: -35px; right: 50px;
          width: 100px; height: 100px;
          border-radius: 50%; background: rgba(255,255,255,.06);
        }
        .sp-hero-title { font-size: 18px; font-weight: 700; margin-bottom: 5px; position: relative; }
        .sp-hero-sub { font-size: 13px; opacity: .85; line-height: 1.5; position: relative; }

        /* ── Contact grid — 2×2 on mobile, 4 cols on wider screens ── */
        .sp-contact-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-bottom: 16px;
        }
        @media (min-width: 500px) {
          .sp-contact-bar { grid-template-columns: repeat(4, 1fr); }
        }
        .sp-contact-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 11px 8px;
          background: #fff;
          border: 1px solid #E8E8F0;
          border-radius: 12px;
          font-size: 12px; font-weight: 500; color: #444441;
          text-decoration: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color .2s, box-shadow .2s;
          white-space: nowrap;
        }
        .sp-contact-chip:hover { border-color: #C5C2F0; box-shadow: 0 2px 8px rgba(127,119,221,.1); }

        /* ── Chat ── */
        .sp-chat-wrap {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #E8E8F0;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(26,26,46,.06);
          margin-bottom: 20px;
        }
        .sp-chat-header {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px;
          border-bottom: 1px solid #E8E8F0;
          background: #FAFAFA;
        }
        .sp-chat-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #1D9E75; animation: pulse 1.5s infinite; flex-shrink: 0;
        }
        .sp-chat-label { font-size: 13px; font-weight: 600; color: #1A1A2E; }
        .sp-chat-sublabel { font-size: 11px; color: #888780; margin-left: auto; }
        .sp-chat-iframe { width: 100%; height: 480px; border: none; display: block; }

        /* ── FAQ ── */
        .sp-section-title { font-size: 14px; font-weight: 600; color: #1A1A2E; margin-bottom: 12px; }
        .sp-faq-list { display: flex; flex-direction: column; gap: 8px; }
        .sp-faq-item {
          background: #fff; border: 1px solid #E8E8F0; border-radius: 12px;
          overflow: hidden; animation: fadeUp .35s ease both;
        }
        .sp-faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px; background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600; color: #1A1A2E;
          text-align: left; font-family: 'DM Sans', sans-serif; gap: 8px;
        }
        .sp-faq-chevron { flex-shrink: 0; transition: transform .25s; color: #B4B2A9; }
        .sp-faq-chevron.open { transform: rotate(180deg); }
        .sp-faq-a {
          padding: 0 16px; font-size: 13px; color: #444441; line-height: 1.65;
          max-height: 0; overflow: hidden; transition: max-height .3s ease, padding .3s ease;
        }
        .sp-faq-a.open { max-height: 220px; padding-bottom: 14px; }
        .sp-faq-cat-badge {
          font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
          background: #EEEDFE; color: #3C3489; flex-shrink: 0;
          display: none;
        }
        @media (min-width: 400px) { .sp-faq-cat-badge { display: inline-block; } }

        /* ── Input ── */
        .sp-input {
          width: 100%; padding: 10px 13px;
          border: 1px solid #E8E8F0; border-radius: 10px;
          font-size: 13px; color: #1A1A2E;
          font-family: 'DM Sans', sans-serif; background: #fff;
          outline: none; transition: border-color .2s;
        }
        .sp-input:focus { border-color: #7F77DD; }

        /* ── Empty ── */
        .sp-empty {
          background: #fff; border: 1px solid #E8E8F0; border-radius: 16px;
          padding: 48px 20px; text-align: center;
        }
        .sp-empty-emoji { font-size: 38px; margin-bottom: 12px; }
        .sp-empty-title { font-size: 15px; font-weight: 600; color: #1A1A2E; margin-bottom: 6px; }
        .sp-empty-sub { font-size: 13px; color: #888780; line-height: 1.6; max-width: 260px; margin: 0 auto; }

        /* ── Mobile overrides ── */
        @media (max-width: 480px) {
          .sp-header { padding: 14px 14px 0; }
          .sp-title { font-size: 19px; }
          .sp-subtitle { font-size: 11px; }
          .sp-tab { padding: 9px 14px; font-size: 12px; }
          .sp-content { padding: 14px 12px 0; }
          .sp-hero { padding: 20px 16px; border-radius: 14px; }
          .sp-hero-title { font-size: 16px; }
          .sp-hero-sub { font-size: 12px; }
          .sp-contact-chip { font-size: 11px; padding: 10px 6px; gap: 5px; border-radius: 10px; }
          .sp-chat-iframe { height: 420px; }
          .sp-chat-label { font-size: 12px; }
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
      `}</style>

      <div className="support-root">

        {/* ── Header ── */}
        <div className="sp-header">
          <div className="sp-header-top">
            <div>
              <p className="sp-title">Support Centre</p>
              <p className="sp-subtitle">We're here to help · Usually replies within 2 hours</p>
            </div>
          </div>
          <div className="sp-tabs">
            {(["home", "faq"] as PageView[]).map(v => (
              <button
                key={v}
                className={`sp-tab${view === v ? " active" : ""}`}
                onClick={() => setView(v)}
              >
                {v === "home" ? "Help Centre" : "FAQ"}
              </button>
            ))}
          </div>
        </div>

        <div className="sp-content">

          {/* ── HOME ── */}
          {view === "home" && (
            <>
              {/* Hero */}
              <div className="sp-hero">
                <p className="sp-hero-title">
                  👋 Hi{userInfo?.name ? `, ${userInfo.name.split(" ")[0]}` : ""}! How can we help?
                </p>
                <p className="sp-hero-sub">
                  Chat with our AI assistant, call, WhatsApp, or browse the FAQ for quick answers.
                </p>
              </div>

              {/* Contact grid — 2×2 on mobile */}
              <div className="sp-contact-bar">
                <a href="mailto:support@meetu.in" className="sp-contact-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email us
                </a>
                <a href="tel:+919384199108" className="sp-contact-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .91h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  Call us
                </a>
                <a
                  href="https://wa.me/919384199108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sp-contact-chip"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.486a.5.5 0 00.609.61l5.737-1.505A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.028-1.382l-.36-.214-3.733.979.997-3.648-.235-.374A9.786 9.786 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                  WhatsApp
                </a>
                <button className="sp-contact-chip" onClick={() => setView("faq")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Browse FAQ
                </button>
              </div>

              {/* Chat iframe */}
              <div className="sp-chat-wrap">
                <div className="sp-chat-header">
                  <div className="sp-chat-dot" />
                  <span className="sp-chat-label">MeetU AI Assistant</span>
                  <span className="sp-chat-sublabel">Online now</span>
                </div>
                <iframe
                  className="sp-chat-iframe"
                  src="https://chatrag.co/chat-iframe/01f8403c-afbb-4ca4-9936-1566e4bab475"
                  title="MeetU Support Chat"
                  allow="microphone"
                />
              </div>
            </>
          )}

          {/* ── FAQ ── */}
          {view === "faq" && <FaqView />}

        </div>
      </div>
    </>
  );
}

// ─── FAQ View ─────────────────────────────────────────────────────────────────

function FaqView() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = FAQ_ITEMS.filter(
    f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <p className="sp-section-title">Frequently Asked Questions</p>
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <input
          className="sp-input"
          placeholder="Search questions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: "36px" }}
        />
        <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>

      {filtered.length === 0 ? (
        <div className="sp-empty">
          <div className="sp-empty-emoji">🤔</div>
          <p className="sp-empty-title">No results found</p>
          <p className="sp-empty-sub">Try different keywords, or email us at support@meetu.in</p>
        </div>
      ) : (
        <div className="sp-faq-list">
          {filtered.map((f, i) => (
            <div key={i} className="sp-faq-item" style={{ animationDelay: `${i * 0.04}s` }}>
              <button className="sp-faq-q" onClick={() => setOpen(open === i ? null : i)}>
                <span style={{ flex: 1 }}>{f.q}</span>
                <span className="sp-faq-cat-badge">{f.category}</span>
                <svg className={`sp-faq-chevron${open === i ? " open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className={`sp-faq-a${open === i ? " open" : ""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #E8E8F0", borderRadius: "14px", padding: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A2E", marginBottom: "6px" }}>Still need help?</p>
        <p style={{ fontSize: "12px", color: "#888780", marginBottom: "14px" }}>Our support team is ready to assist you.</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="tel:+919384199108" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: "#F5F5FA", border: "1px solid #E8E8F0", borderRadius: "10px", fontSize: "13px", fontWeight: 600, color: "#444441", textDecoration: "none" }}>
            📞 Call us
          </a>
          <a href="https://wa.me/919384199108" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", background: "#7F77DD", borderRadius: "10px", fontSize: "13px", fontWeight: 600, color: "#fff", textDecoration: "none" }}>
            💬 WhatsApp →
          </a>
        </div>
      </div>
    </>
  );
}