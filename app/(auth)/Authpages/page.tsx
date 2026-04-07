"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type AuthMode = "login" | "signup";

const INTERESTS = [
  "Tech", "Sports", "Music", "Business", "Art",
  "Food", "Health", "Education", "Travel", "Fashion", "Gaming", "Photography"
];

export default function AuthPages() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
   const router = useRouter();
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  setTimeout(() => {
    setLoading(false);

    // 👉 navigate to navbar/home screen
    router.push("/dashboard"); // or "/home" or "/dashboard"
  }, 1800);
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Playfair+Display:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-text-size-adjust: 100%; }
        body { font-family: 'DM Sans', sans-serif; background: #F5F5FA; }

        .auth-root {
          display: flex;
          min-height: 100vh;
          min-height: 100dvh;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          width: 42%;
          background: #1A1A2E;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: stretch;
          flex-shrink: 0;
        }
        .left-inner {
          padding: 48px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
          position: relative;
          z-index: 2;
          width: 100%;
        }
        .brand-mark {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-icon {
          width: 44px; height: 44px;
          background: rgba(127,119,221,0.12);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(127,119,221,0.25);
          flex-shrink: 0;
        }
        .brand-name {
          font-size: 22px; font-weight: 600; color: #fff; letter-spacing: -0.02em;
        }
        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: 42px; font-weight: 700; color: #fff;
          line-height: 1.15; margin-bottom: 14px; letter-spacing: -0.02em;
        }
        .hero-accent { color: #7F77DD; }
        .hero-sub { font-size: 15px; color: #888780; line-height: 1.7; max-width: 320px; }
        .stats-row { display: flex; gap: 32px; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-num { font-size: 22px; font-weight: 600; color: #fff; letter-spacing: -0.02em; }
        .stat-label { font-size: 12px; color: #5F5E5A; text-transform: uppercase; letter-spacing: 0.06em; }
        .category-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .cat-pill {
          font-size: 12px; font-weight: 500; padding: 5px 12px;
          border-radius: 20px; letter-spacing: 0.02em;
        }
        .dec-circle-1 {
          position: absolute; width: 320px; height: 320px; border-radius: 50%;
          background: rgba(127,119,221,0.06); border: 1px solid rgba(127,119,221,0.1);
          bottom: -80px; right: -80px;
          animation: float 6s ease-in-out infinite;
        }
        .dec-circle-2 {
          position: absolute; width: 180px; height: 180px; border-radius: 50%;
          background: rgba(29,158,117,0.05); border: 1px solid rgba(29,158,117,0.1);
          top: 60px; right: 30px;
          animation: float 8s 1s ease-in-out infinite;
        }

        /* ── RIGHT PANEL ── */
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          overflow-y: auto;
        }
        .form-wrap {
          width: 100%; max-width: 420px;
          animation: fadeUp 0.5s ease both;
        }
        .mode-toggle {
          display: flex; background: #EEEEF5; border-radius: 10px;
          padding: 4px; margin-bottom: 28px;
        }
        .mode-btn {
          flex: 1; padding: 9px; border: none; background: transparent;
          border-radius: 7px; font-size: 14px; font-weight: 500; color: #888780;
          transition: all 0.2s; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .mode-btn.active {
          background: #fff; color: #1A1A2E;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .form-title {
          font-size: 24px; font-weight: 600; color: #1A1A2E;
          margin-bottom: 6px; letter-spacing: -0.02em;
        }
        .form-sub { font-size: 14px; color: #888780; line-height: 1.5; margin-bottom: 24px; }
        .google-btn {
          width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 10px; padding: 11px; background: #fff;
          border: 1.5px solid #E8E8F0; border-radius: 10px; font-size: 14px;
          font-weight: 500; color: #1A1A2E; margin-bottom: 20px;
          transition: border-color 0.2s, background 0.2s; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .google-btn:hover { border-color: #bbb; background: #fafafa; }
        .divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .divider-line { flex: 1; height: 1px; background: #E8E8F0; }
        .divider-text { font-size: 12px; color: #B4B2A9; font-weight: 500; }
        .form { display: flex; flex-direction: column; gap: 16px; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .label { font-size: 13px; font-weight: 500; color: #444441; }
        .optional { font-weight: 400; color: #B4B2A9; font-size: 12px; }
        .input {
          width: 100%; padding: 10px 14px; font-size: 14px; color: #1A1A2E;
          background: #fff; border: 1.5px solid #E8E8F0; border-radius: 8px;
          transition: border-color 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .input::placeholder { color: #B4B2A9; }
        .input:focus { outline: none; border-color: #7F77DD; box-shadow: 0 0 0 3px rgba(127,119,221,0.12); }
        .password-wrap { position: relative; }
        .input-padded-right { padding-right: 44px; }
        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; padding: 4px; display: flex;
          align-items: center; cursor: pointer;
        }
        .phone-wrap { display: flex; }
        .phone-prefix {
          padding: 10px 12px; background: #F5F5FA; border: 1.5px solid #E8E8F0;
          border-right: none; border-radius: 8px 0 0 8px;
          font-size: 14px; color: #444441; font-weight: 500; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .input-no-left-radius { border-radius: 0 8px 8px 0; border-left: none; }
        .interest-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .interest-btn {
          padding: 6px 14px; font-size: 12px; font-weight: 500;
          background: #F5F5FA; border: 1.5px solid #E8E8F0;
          border-radius: 20px; color: #444441; transition: all 0.15s; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .interest-btn.selected {
          background: #EEEDFE; border-color: #AFA9EC; color: #3C3489;
        }
        .forgot-row { display: flex; justify-content: flex-end; margin-top: -4px; }
        .forgot-link { font-size: 13px; color: #7F77DD; text-decoration: none; font-weight: 500; }
        .submit-btn {
          width: 100%; padding: 12px; background: #7F77DD; color: #fff;
          border: none; border-radius: 10px; font-size: 15px; font-weight: 600;
          letter-spacing: -0.01em; transition: background 0.2s, transform 0.1s;
          margin-top: 4px; display: flex; align-items: center; justify-content: center;
          min-height: 46px; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .submit-btn:hover:not(:disabled) { background: #6d65cc; }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%; display: inline-block;
          animation: spin 0.7s linear infinite;
        }
        .terms { font-size: 12px; color: #B4B2A9; text-align: center; line-height: 1.6; }
        .terms-link { color: #7F77DD; text-decoration: none; }
        .switch-text { font-size: 14px; color: #888780; text-align: center; margin-top: 20px; }
        .switch-btn {
          background: none; border: none; color: #7F77DD; font-weight: 600;
          font-size: 14px; padding: 0; text-decoration: underline;
          text-underline-offset: 2px; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }

        /* ── MOBILE HEADER (hidden on desktop) ── */
        .mobile-header {
          display: none;
          background: #1A1A2E;
          padding: 20px 20px 24px;
          position: relative;
          overflow: hidden;
        }
        .mobile-header-inner {
          position: relative; z-index: 2;
        }
        .mobile-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .mobile-brand-icon {
          width: 36px; height: 36px; background: rgba(127,119,221,0.15);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(127,119,221,0.3);
        }
        .mobile-brand-name { font-size: 18px; font-weight: 600; color: #fff; }
        .mobile-tagline {
          font-family: 'Playfair Display', serif;
          font-size: 24px; color: #fff; font-weight: 700; line-height: 1.25;
          margin-bottom: 12px; letter-spacing: -0.01em;
        }
        .mobile-tagline span { color: #7F77DD; }
        .mobile-stats { display: flex; gap: 20px; }
        .mobile-stat { display: flex; flex-direction: column; }
        .mobile-stat-num { font-size: 16px; font-weight: 600; color: #fff; }
        .mobile-stat-label { font-size: 11px; color: #5F5E5A; text-transform: uppercase; letter-spacing: 0.05em; }
        .mobile-dec1 {
          position: absolute; width: 200px; height: 200px; border-radius: 50%;
          background: rgba(127,119,221,0.07); border: 1px solid rgba(127,119,221,0.12);
          bottom: -80px; right: -60px;
        }
        .mobile-dec2 {
          position: absolute; width: 100px; height: 100px; border-radius: 50%;
          background: rgba(29,158,117,0.06); border: 1px solid rgba(29,158,117,0.12);
          top: 10px; right: 40px;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* ── BREAKPOINTS ── */

        /* Tablet: hide left panel text details, shrink it */
        @media (max-width: 900px) {
          .left-panel { width: 34%; }
          .hero-h1 { font-size: 28px; }
          .hero-sub { font-size: 13px; }
          .left-inner { padding: 32px 24px; gap: 24px; }
          .stats-row { gap: 20px; }
          .stat-num { font-size: 18px; }
          .category-pills { display: none; }
        }

        /* Mobile: stack vertically, hide left panel, show mobile header */
        @media (max-width: 640px) {
          .auth-root { flex-direction: column; }
          .left-panel { display: none; }
          .mobile-header { display: block; }
          .right-panel {
            padding: 24px 16px 40px;
            align-items: flex-start;
          }
          .form-wrap { max-width: 100%; }
          .form-title { font-size: 20px; }
          .interest-btn { padding: 7px 12px; font-size: 11px; }
          .submit-btn { font-size: 14px; min-height: 48px; }
          .google-btn { font-size: 13px; }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .right-panel { padding: 20px 14px 36px; }
          .mobile-tagline { font-size: 20px; }
          .interest-btn { padding: 6px 10px; font-size: 11px; }
        }

        /* Touch device optimizations */
        @media (hover: none) {
          .interest-btn:active { background: #EEEDFE; border-color: #AFA9EC; color: #3C3489; }
          .submit-btn:active:not(:disabled) { background: #6d65cc; }
        }
      `}</style>

      <div className="auth-root">

        {/* Mobile Header (shown only on small screens) */}
        <div className="mobile-header">
          <div className="mobile-header-inner">
            <div className="mobile-brand">
              <div className="mobile-brand-icon">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="#7F77DD" strokeWidth="2"/>
                  <path d="M9 14a5 5 0 0110 0" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="14" cy="10" r="2.5" fill="#7F77DD"/>
                  <path d="M7 19c0-3.87 3.134-7 7-7s7 3.13 7 7" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="mobile-brand-name">MeetU</span>
            </div>
            <div className="mobile-tagline">
              Discover events <span>near you.</span>
            </div>
            <div className="mobile-stats">
              {[{ num: "12K+", label: "Events" }, { num: "48K+", label: "Members" }, { num: "120+", label: "Cities" }].map(s => (
                <div key={s.label} className="mobile-stat">
                  <span className="mobile-stat-num">{s.num}</span>
                  <span className="mobile-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mobile-dec1" />
          <div className="mobile-dec2" />
        </div>

        {/* Desktop Left Panel */}
        <div className="left-panel">
          <div className="left-inner">
            <div className="brand-mark">
              <div className="brand-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="#7F77DD" strokeWidth="2"/>
                  <path d="M9 14a5 5 0 0110 0" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="14" cy="10" r="2.5" fill="#7F77DD"/>
                  <path d="M7 19c0-3.87 3.134-7 7-7s7 3.13 7 7" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="brand-name">MeetU</span>
            </div>

            <div style={{ animation: "fadeUp 0.6s ease both" }}>
              <h1 className="hero-h1">
                Discover events<br />
                <span className="hero-accent">near you.</span>
              </h1>
              <p className="hero-sub">
                Join thousands of people finding local events, meetups, and experiences across India.
              </p>
            </div>

            <div className="stats-row" style={{ animation: "fadeUp 0.6s 0.15s ease both", opacity: 0, animationFillMode: "forwards" }}>
              {[{ num: "12K+", label: "Events" }, { num: "48K+", label: "Members" }, { num: "120+", label: "Cities" }].map(s => (
                <div key={s.label} className="stat">
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="category-pills" style={{ animation: "fadeUp 0.6s 0.25s ease both", opacity: 0, animationFillMode: "forwards" }}>
              {["Tech", "Music", "Sports", "Food", "Art", "Travel"].map((c, i) => (
                <span key={c} className="cat-pill" style={{
                  background: i % 2 === 0 ? "rgba(127,119,221,0.15)" : "rgba(29,158,117,0.12)",
                  color: i % 2 === 0 ? "#AFA9EC" : "#5DCAA5",
                  border: `1px solid ${i % 2 === 0 ? "rgba(127,119,221,0.3)" : "rgba(29,158,117,0.25)"}`,
                }}>{c}</span>
              ))}
            </div>
          </div>
          <div className="dec-circle-1" />
          <div className="dec-circle-2" />
        </div>

        {/* Right Panel — Form */}
        <div className="right-panel">
          <div className="form-wrap">

            <div className="mode-toggle">
              <button className={`mode-btn${mode === "login" ? " active" : ""}`} onClick={() => setMode("login")}>
                Sign in
              </button>
              <button className={`mode-btn${mode === "signup" ? " active" : ""}`} onClick={() => setMode("signup")}>
                Create account
              </button>
            </div>

            <h2 className="form-title">{mode === "login" ? "Welcome back" : "Join MeetU"}</h2>
            <p className="form-sub">
              {mode === "login" ? "Sign in to discover events near you" : "Create your account in seconds"}
            </p>

            <button className="google-btn">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <form onSubmit={handleSubmit} className="form">

              {mode === "signup" && (
                <div className="field-group">
                  <label className="label">Full name</label>
                  <input className="input" type="text" placeholder="Arjun Kumar"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              )}

              <div className="field-group">
                <label className="label">Email address</label>
                <input className="input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                  inputMode="email" autoComplete="email" />
              </div>

              <div className="field-group">
                <label className="label">Password</label>
                <div className="password-wrap">
                  <input
                    className="input input-padded-right"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "signup" ? "Min. 8 characters" : "Enter your password"}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888780" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="#888780" strokeWidth="1.8"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888780" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="field-group">
                  <label className="label">
                    Phone number <span className="optional">(optional)</span>
                  </label>
                  <div className="phone-wrap">
                    <span className="phone-prefix">+91</span>
                    <input className="input input-no-left-radius" type="tel"
                      placeholder="98765 43210" inputMode="tel"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="field-group">
                  <label className="label">
                    Your interests <span className="optional">— pick at least one</span>
                  </label>
                  <div className="interest-grid">
                    {INTERESTS.map(interest => (
                      <button
                        key={interest} type="button"
                        className={`interest-btn${selectedInterests.includes(interest) ? " selected" : ""}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="forgot-row">
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : (mode === "login" ? "Sign in" : "Create account")}
              </button>

              {mode === "signup" && (
                <p className="terms">
                  By creating an account you agree to our{" "}
                  <a href="#" className="terms-link">Terms of Service</a> and{" "}
                  <a href="#" className="terms-link">Privacy Policy</a>.
                </p>
              )}
            </form>

            <p className="switch-text">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button className="switch-btn" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}