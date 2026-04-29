"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/cookieUtils";
import {
  loadEventDetail,
  loadParticipants,
  saveEditedEvent,
  uploadEventCover,
  removeEventCover,
  validateEditForm,
  type EventDetail,
  type Participant,
  type EditEventPayload,
} from "@/app/actions/Eventrecapactions";

// ─── Recap-only view (non-edit mode) ─────────────────────────────────────────
function RecapView({
  event,
  participants,
}: {
  event: EventDetail;
  participants: Participant[];
}) {
  const cat = { color: event.categoryColor, bg: event.categoryBg };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Cover */}
      {event.coverImage && (
        <div
          style={{
            borderRadius: "14px",
            overflow: "hidden",
            maxHeight: "220px",
          }}
        >
          <img
            src={event.coverImage}
            alt={event.title}
            style={{ width: "100%", height: "220px", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "10px",
        }}
      >
        {[
          { label: "Joined", value: event.joined, icon: "👥" },
          { label: "Views", value: event.views, icon: "👁️" },
          { label: "Revenue", value: `₹${event.revenue.toLocaleString()}`, icon: "💰" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1px solid #E8E8F0",
              borderRadius: "12px",
              padding: "14px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.icon}</div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#1A1A2E",
                letterSpacing: "-.02em",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "11px", color: "#888780" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Details card */}
      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid #E8E8F0",
          borderRadius: "14px",
          padding: "18px",
        }}
      >
        <p className="sec-title" style={{ fontSize: "11px", fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "14px" }}>
          Event details
        </p>
        {[
          { label: "Date", value: `${event.dateDisplay} · ${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}` },
          { label: "Location", value: [event.venue, event.area, event.district, event.state].filter(Boolean).join(", ") },
          { label: "Category", value: event.category },
          { label: "Entry", value: event.entryType === "Paid" ? `₹${event.price}` : "Free" },
          { label: "Capacity", value: event.maxAttendees ? `${event.joined} / ${event.maxAttendees}` : "Unlimited" },
          { label: "Status", value: event.status.charAt(0).toUpperCase() + event.status.slice(1) },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              padding: "8px 0",
              borderBottom: "1px solid #F5F5FA",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#888780", flexShrink: 0 }}>{row.label}</span>
            <span
              style={{
                color: "#1A1A2E",
                fontWeight: 500,
                textAlign: "right",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Participants */}
      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid #E8E8F0",
          borderRadius: "14px",
          padding: "18px",
        }}
      >
        <p className="sec-title" style={{ fontSize: "11px", fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "14px" }}>
          Participants ({participants.length})
        </p>
        {participants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎟️</div>
            <p style={{ fontSize: "13px", color: "#888780" }}>No participants yet</p>
          </div>
        ) : (
          participants.map((p) => (
            <div
              key={p.uid}
              className="participant-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 0",
                borderBottom: "1px solid #F5F5FA",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: p.photoURL
                    ? "transparent"
                    : "linear-gradient(135deg,#7F77DD,#1D9E75)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {p.photoURL ? (
                  <img
                    src={p.photoURL}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1A1A2E",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </p>
                <p style={{ fontSize: "11px", color: "#888880" }}>
                  Joined {p.joinedAt}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Edit form ────────────────────────────────────────────────────────────────
function EditForm({
  event,
  uid,
  onSaved,
}: {
  event: EventDetail;
  uid: string;
  onSaved: () => void;
}) {
  // All form fields initialised from EventDetail
  const [form, setForm] = useState<EditEventPayload>({
    title:        event.title,
    category:     event.category,
    description:  event.description,
    entryType:    event.entryType,
    price:        event.price ?? "",
    maxAttendees: event.maxAttendees ?? "",   // ← use maxAttendees (not max)
    date:         event.date,
    startTime:    event.startTime,
    endTime:      event.endTime,
    state:        event.state,
    district:     event.district,
    area:         event.area,
    venue:        event.venue,
    landmark:     event.landmark,
    howToAttend:  event.howToAttend,
    contactName:  event.contactName,
    contactPhone: event.contactPhone,
    contactEmail: event.contactEmail,
    contactWA:    event.contactWA,
    website:      event.website,
  });

  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [saving,   setSaving]   = useState(false);
  const [saveErr,  setSaveErr]  = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(event.coverImage);

  // Generic field setter — keeps TypeScript happy with a proper generic
  function setField<K extends keyof EditEventPayload>(
    key: K,
    value: EditEventPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  const handleSave = async () => {
    const errs = validateEditForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setSaveErr("");
    const res = await saveEditedEvent(event.id, form, uid);
    setSaving(false);

    if (res.success) {
      onSaved();
    } else {
      setSaveErr(res.error ?? "Failed to save.");
    }
  };

  const handleCoverUpload = async (file: File) => {
    setImgUploading(true);
    const res = await uploadEventCover(event.id, file, uid);
    setImgUploading(false);
    if (res.success && res.data) setCoverPreview(res.data);
  };

  const handleRemoveCover = async () => {
    setImgUploading(true);
    await removeEventCover(event.id, uid);
    setImgUploading(false);
    setCoverPreview("");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #E8E8F0",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#1A1A2E",
    background: "#FAFAFA",
    fontFamily: "'DM Sans',sans-serif",
    outline: "none",
  };

  const errStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#E24B4A",
    marginTop: "4px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#444441",
    marginBottom: "5px",
    display: "block",
  };

  const sectionTitle = (t: string) => (
    <p
      style={{
        fontSize: "11px",
        fontWeight: 600,
        color: "#888780",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        marginBottom: "14px",
      }}
    >
      {t}
    </p>
  );

  const card = (children: React.ReactNode) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E8F0",
        borderRadius: "14px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Cover image */}
      {card(
        <>
          {sectionTitle("Cover image")}
          {coverPreview ? (
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden" }}>
              <img
                src={coverPreview}
                alt="Cover"
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <button
                onClick={handleRemoveCover}
                disabled={imgUploading}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(0,0,0,.55)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "2px dashed #E8E8F0",
                borderRadius: "10px",
                padding: "28px",
                cursor: "pointer",
                background: "#FAFAFA",
              }}
            >
              <span style={{ fontSize: "28px" }}>🖼️</span>
              <span style={{ fontSize: "13px", color: "#888780" }}>
                {imgUploading ? "Uploading…" : "Upload cover image"}
              </span>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCoverUpload(f);
                }}
              />
            </label>
          )}
        </>
      )}

      {/* Basics */}
      {card(
        <>
          {sectionTitle("Basic info")}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              style={{
                ...inputStyle,
                borderColor: errors.title ? "#E24B4A" : "#E8E8F0",
              }}
              value={form.title ?? ""}
              onChange={(e) => setField("title", e.target.value)}
            />
            {errors.title && <p style={errStyle}>{errors.title}</p>}
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={inputStyle}
              value={form.category ?? ""}
              onChange={(e) => setField("category", e.target.value)}
            >
              {["Tech","Music","Art","Food","Sports","Health","Business","Photography","Fashion","Gaming","Education","Travel"].map(
                (c) => <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
              value={form.description ?? ""}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>

          {/* Entry type */}
          <div>
            <label style={labelStyle}>Entry type</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["Free", "Paid"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setField("entryType", t)}
                  style={{
                    flex: 1,
                    padding: "9px",
                    border: `1.5px solid ${form.entryType === t ? "#7F77DD" : "#E8E8F0"}`,
                    borderRadius: "10px",
                    background: form.entryType === t ? "#EEEDFE" : "#FAFAFA",
                    color: form.entryType === t ? "#3C3489" : "#888780",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {form.entryType === "Paid" && (
            <div>
              <label style={labelStyle}>Ticket price (₹) *</label>
              <input
                type="number"
                style={{
                  ...inputStyle,
                  borderColor: errors.price ? "#E24B4A" : "#E8E8F0",
                }}
                value={form.price ?? ""}
                onChange={(e) => setField("price", e.target.value)}
              />
              {errors.price && <p style={errStyle}>{errors.price}</p>}
            </div>
          )}

          <div>
            <label style={labelStyle}>Max attendees (leave blank for unlimited)</label>
            <input
              type="number"
              style={inputStyle}
              value={form.maxAttendees ?? ""}
              onChange={(e) => setField("maxAttendees", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Date & time */}
      {card(
        <>
          {sectionTitle("Date & time")}
          <div>
            <label style={labelStyle}>Date *</label>
            <input
              type="date"
              style={{
                ...inputStyle,
                borderColor: errors.date ? "#E24B4A" : "#E8E8F0",
              }}
              value={form.date ?? ""}
              onChange={(e) => setField("date", e.target.value)}
            />
            {errors.date && <p style={errStyle}>{errors.date}</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={labelStyle}>Start time</label>
              <input
                type="time"
                style={inputStyle}
                value={form.startTime ?? ""}
                onChange={(e) => setField("startTime", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>End time</label>
              <input
                type="time"
                style={inputStyle}
                value={form.endTime ?? ""}
                onChange={(e) => setField("endTime", e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* Location */}
      {card(
        <>
          {sectionTitle("Location")}
          {[
            { key: "venue" as const,    label: "Venue" },
            { key: "area" as const,     label: "Area / City" },
            { key: "district" as const, label: "District" },
            { key: "state" as const,    label: "State" },
            { key: "landmark" as const, label: "Landmark (optional)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                style={inputStyle}
                value={(form[key] as string) ?? ""}
                onChange={(e) => setField(key, e.target.value)}
              />
            </div>
          ))}
          <div>
            <label style={labelStyle}>How to attend</label>
            <textarea
              style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
              value={form.howToAttend ?? ""}
              onChange={(e) => setField("howToAttend", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Contact */}
      {card(
        <>
          {sectionTitle("Contact info")}
          {[
            { key: "contactName"  as const, label: "Name",   type: "text" },
            { key: "contactPhone" as const, label: "Phone",  type: "tel" },
            { key: "contactEmail" as const, label: "Email",  type: "email" },
            { key: "contactWA"    as const, label: "WhatsApp number", type: "tel" },
            { key: "website"      as const, label: "Website (optional)", type: "url" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type}
                style={{
                  ...inputStyle,
                  borderColor: errors[key] ? "#E24B4A" : "#E8E8F0",
                }}
                value={(form[key] as string) ?? ""}
                onChange={(e) => setField(key, e.target.value)}
              />
              {errors[key] && <p style={errStyle}>{errors[key]}</p>}
            </div>
          ))}
        </>
      )}

      {/* Save button */}
      {saveErr && (
        <p style={{ fontSize: "13px", color: "#E24B4A", textAlign: "center" }}>
          ⚠️ {saveErr}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "14px",
          background: saving ? "#AFA9EC" : "#7F77DD",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          color: "#fff",
          cursor: saving ? "default" : "pointer",
          fontFamily: "'DM Sans',sans-serif",
          transition: "background .2s",
        }}
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventRecapEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = params.id;

  const [uid,          setUid]          = useState<string | null>(null);
  const [event,        setEvent]        = useState<EventDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [isEditMode,   setIsEditMode]   = useState(false);
  const [savedBanner,  setSavedBanner]  = useState(false);

  // 1. Resolve uid from cookie
  useEffect(() => {
    const cookieUid = getAuthCookie();
    if (!cookieUid) { router.replace("/"); return; }
    setUid(cookieUid);
  }, [router]);

  // 2. Load event data
  const loadData = useCallback(async (uidVal: string) => {
    setLoading(true);
    setError("");

    const [evRes, pRes] = await Promise.all([
      loadEventDetail(eventId, uidVal),
      loadParticipants(eventId, uidVal),
    ]);

    setLoading(false);

    if (!evRes.success || !evRes.data) {
      setError(evRes.error ?? "Failed to load event.");
      return;
    }

    setEvent(evRes.data);
    if (pRes.success && pRes.data) setParticipants(pRes.data);
  }, [eventId]);

  useEffect(() => {
    if (uid) loadData(uid);
  }, [uid, loadData]);

  const handleSaved = () => {
    setSavedBanner(true);
    setIsEditMode(false);
    if (uid) loadData(uid); // refresh data
    setTimeout(() => setSavedBanner(false), 3000);
  };

  if (!uid || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F5FA",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "3px solid #EEEDFE",
              borderTopColor: "#7F77DD",
              borderRadius: "50%",
              animation: "spin .7s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: "13px", color: "#888780" }}>Loading…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F5FA",
          fontFamily: "'DM Sans',sans-serif",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A2E", marginBottom: "8px" }}>
            {error}
          </p>
          <button
            onClick={() => router.back()}
            style={{
              padding: "10px 20px",
              background: "#7F77DD",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isCreator = event.creatorId === uid;

  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: "#F5F5FA",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div style={{ width: "100%", maxWidth: "640px", margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* Saved banner */}
        {savedBanner && (
          <div
            style={{
              background: "#E1F5EE",
              border: "1px solid #A8DFC8",
              borderRadius: "10px",
              padding: "11px 14px",
              fontSize: "13px",
              color: "#085041",
              fontWeight: 500,
              marginBottom: "14px",
              animation: "fadeIn .3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ✅ Event updated successfully!
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "20px",
            gap: "12px",
            animation: "fadeUp .4s ease both",
          }}
        >
          <div>
            <button
              onClick={() => router.back()}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                color: "#888780",
                padding: 0,
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              ← Back
            </button>
            <h1
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(18px,5vw,24px)",
                fontWeight: 700,
                color: "#1A1A2E",
                letterSpacing: "-.02em",
                lineHeight: 1.2,
              }}
            >
              {isEditMode ? "Edit event" : "Event recap"}
            </h1>
            <p style={{ fontSize: "12px", color: "#888780", marginTop: "3px" }}>
              {event.title}
            </p>
          </div>

          {/* Toggle Edit / View — only visible to creator */}
          {isCreator && (
            <button
              onClick={() => setIsEditMode((v) => !v)}
              style={{
                padding: "9px 16px",
                background: isEditMode ? "#F5F5FA" : "#7F77DD",
                border: isEditMode ? "1.5px solid #E8E8F0" : "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                color: isEditMode ? "#444441" : "#fff",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {isEditMode ? "View recap" : "Edit event"}
            </button>
          )}
        </div>

        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            marginBottom: "16px",
            background:
              event.status === "upcoming" ? "#EEEDFE"
              : event.status === "live"   ? "#E1F5EE"
              : event.status === "past"   ? "#F1EFE8"
              : "#FCEBEB",
            color:
              event.status === "upcoming" ? "#3C3489"
              : event.status === "live"   ? "#085041"
              : event.status === "past"   ? "#444441"
              : "#791F1F",
          }}
        >
          {event.status === "live" && (
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#1D9E75",
                animation: "pulse 1.5s infinite",
                display: "inline-block",
              }}
            />
          )}
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </div>

        {/* Main content — swap between recap and edit */}
        <div style={{ animation: "fadeUp .4s .05s ease both", opacity: 0, animationFillMode: "forwards" }}>
          {isEditMode && isCreator ? (
            <EditForm event={event} uid={uid} onSaved={handleSaved} />
          ) : (
            <RecapView event={event} participants={participants} />
          )}
        </div>
      </div>
    </div>
  );
}