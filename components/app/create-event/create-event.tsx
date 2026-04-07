"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Location Data ────────────────────────────────────────────────────────────
const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "Tamil Nadu": {
    "Madurai":          ["Madurai City","Melur","Thirumangalam","Usilampatti","Alanganallur"],
    "Chennai":          ["T. Nagar","Anna Nagar","Adyar","Velachery","Tambaram","Porur"],
    "Coimbatore":       ["RS Puram","Saibaba Colony","Singanallur","Ganapathy","Peelamedu"],
    "Tiruchirappalli":  ["Srirangam","KK Nagar","Ariyamangalam","Woraiyur"],
    "Salem":            ["Fairlands","Suramangalam","Ammapet","Shevapet"],
    "Tirunelveli":      ["Palayamkottai","Melapalayam","Vannarpet"],
    "Erode":            ["Bhavani","Perundurai","Gobichettipalayam"],
    "Vellore":          ["Katpadi","Ambur","Ranipet","Vellore Town"],
    "Thanjavur":        ["Kumbakonam","Papanasam","Thanjavur Town"],
    "Kanyakumari":      ["Nagercoil","Marthandam","Padmanabhapuram"],
    "Tiruppur":         ["Tiruppur Town","Kangeyam","Dharapuram"],
  },
  "Kerala": {
    "Ernakulam":        ["Kochi","Kalamassery","Aluva","Edappally"],
    "Thiruvananthapuram":["Kovalam","Technopark","Pattom","Kowdiar"],
    "Kozhikode":        ["Calicut Beach","Nadakkavu","Mavoor"],
    "Thrissur":         ["Guruvayur","Chalakudy","Thrissur Town"],
    "Palakkad":         ["Palakkad Town","Ottapalam","Shoranur"],
  },
  "Karnataka": {
    "Bengaluru Urban":  ["Koramangala","Indiranagar","Whitefield","HSR Layout","Jayanagar"],
    "Mysuru":           ["Mysore City","Nanjangud","T. Narsipur"],
    "Mangaluru":        ["Mangalore City","Surathkal","Ullal"],
  },
  "Maharashtra": {
    "Mumbai":           ["Bandra","Andheri","Dadar","Colaba","Powai"],
    "Pune":             ["Koregaon Park","Hinjewadi","Viman Nagar","Kothrud"],
    "Nagpur":           ["Dharampeth","Sitabuldi","Sadar"],
  },
  "Delhi": {
    "Central Delhi":    ["Connaught Place","Karol Bagh","Paharganj"],
    "South Delhi":      ["Hauz Khas","Saket","Vasant Kunj","Lajpat Nagar"],
    "North Delhi":      ["Civil Lines","Model Town","Pitampura"],
  },
  "Telangana": {
    "Hyderabad":        ["Banjara Hills","Jubilee Hills","Madhapur","Hitech City","Ameerpet"],
  },
  "Gujarat": {
    "Ahmedabad":        ["Navrangpura","Satellite","Vastrapur","Maninagar"],
    "Surat":            ["Surat City","Adajan","Vesu"],
  },
};

const CATEGORIES = [
  { id:"tech",        label:"Tech",        emoji:"💻", color:"#3C3489", bg:"#EEEDFE" },
  { id:"music",       label:"Music",       emoji:"🎵", color:"#633806", bg:"#FAEEDA" },
  { id:"art",         label:"Art",         emoji:"🎨", color:"#72243E", bg:"#FBEAF0" },
  { id:"food",        label:"Food",        emoji:"🍜", color:"#712B13", bg:"#FAECE7" },
  { id:"sports",      label:"Sports",      emoji:"🏃", color:"#085041", bg:"#E1F5EE" },
  { id:"health",      label:"Health",      emoji:"🧘", color:"#27500A", bg:"#EAF3DE" },
  { id:"business",    label:"Business",    emoji:"💼", color:"#0C447C", bg:"#E6F1FB" },
  { id:"photography", label:"Photography", emoji:"📸", color:"#085041", bg:"#E1F5EE" },
  { id:"fashion",     label:"Fashion",     emoji:"👗", color:"#72243E", bg:"#FBEAF0" },
  { id:"gaming",      label:"Gaming",      emoji:"🎮", color:"#3C3489", bg:"#EEEDFE" },
  { id:"education",   label:"Education",   emoji:"📚", color:"#0C447C", bg:"#E6F1FB" },
  { id:"travel",      label:"Travel",      emoji:"✈️", color:"#085041", bg:"#E1F5EE" },
];

const STEPS = [
  { id: 1, label: "Basics",   icon: "📝" },
  { id: 2, label: "Details",  icon: "📍" },
  { id: 3, label: "Contact",  icon: "📞" },
  { id: 4, label: "Preview",  icon: "👁" },
];

interface FormData {
  // Step 1 — Basics
  title:       string;
  category:    string;
  description: string;
  coverImage:  string | null;
  entryType:   "Free" | "Paid";
  price:       string;
  maxAttendees:string;
  // Step 2 — Details
  date:        string;
  startTime:   string;
  endTime:     string;
  state:       string;
  district:    string;
  area:        string;
  venue:       string;
  landmark:    string;
  howToAttend: string;
  // Step 3 — Contact
  contactName:  string;
  contactPhone: string;
  contactEmail: string;
  contactWA:    string;
  website:      string;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function CreateEventPage() {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState<FormData>({
    title:"", category:"", description:"", coverImage:null,
    entryType:"Free", price:"", maxAttendees:"",
    date:"", startTime:"", endTime:"",
    state:"Tamil Nadu", district:"Madurai", area:"Madurai City",
    venue:"", landmark:"", howToAttend:"",
    contactName:"", contactPhone:"", contactEmail:"", contactWA:"", website:"",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string | null) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const districts = Object.keys(LOCATION_DATA[form.state] || {});
  const areas     = (LOCATION_DATA[form.state]?.[form.district]) || [];

  const onStateChange = (s: string) => {
    const d = Object.keys(LOCATION_DATA[s] || {})[0] || "";
    const a = (LOCATION_DATA[s]?.[d] || [])[0] || "";
    setForm(p => ({ ...p, state: s, district: d, area: a }));
  };
  const onDistChange = (d: string) => {
    const a = (LOCATION_DATA[form.state]?.[d] || [])[0] || "";
    setForm(p => ({ ...p, district: d, area: a }));
  };

  const handleImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => set("coverImage", e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.title.trim())    e.title    = "Event title is required";
      if (!form.category)        e.category = "Please select a category";
      if (!form.description.trim()) e.description = "Description is required";
      if (form.entryType === "Paid" && !form.price) e.price = "Enter ticket price";
    }
    if (s === 2) {
      if (!form.date)       e.date    = "Date is required";
      if (!form.startTime)  e.startTime = "Start time is required";
      if (!form.venue.trim()) e.venue  = "Venue name is required";
    }
    if (s === 3) {
      if (!form.contactName.trim())  e.contactName  = "Contact name is required";
      if (!form.contactPhone.trim()) e.contactPhone = "Phone number is required";
      if (!form.contactEmail.trim()) e.contactEmail = "Email is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => { setStep(s => Math.max(s - 1, 1)); setErrors({}); };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1600));
    setSubmitting(false);
    setSubmitted(true);
  };

  const selCat = CATEGORIES.find(c => c.id === form.category);

  const formatDate = (d: string) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" });
  };

  if (submitted) {
    return (
      <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#F5F5FA", minHeight:"100vh", width:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');@keyframes pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ textAlign:"center", padding:"40px 24px", animation:"fadeUp .5s ease" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"#E1F5EE", border:"3px solid #1D9E75", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", animation:"pop .5s ease" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"28px", fontWeight:700, color:"#1A1A2E", marginBottom:"10px" }}>Event created! 🎉</h1>
          <p style={{ fontSize:"14px", color:"#888780", marginBottom:"8px", lineHeight:1.6 }}>
            <strong style={{ color:"#1A1A2E" }}>{form.title}</strong> is now live.
          </p>
          <p style={{ fontSize:"13px", color:"#888780", marginBottom:"28px" }}>People can now find and join your event.</p>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
            <Link href="/my-events" style={{ padding:"10px 22px", background:"#7F77DD", borderRadius:"10px", fontSize:"13px", fontWeight:600, color:"#fff", textDecoration:"none" }}>
              My events →
            </Link>
            <button onClick={() => { setSubmitted(false); setStep(1); setForm(f => ({ ...f, title:"", description:"", coverImage:null })); }}
              style={{ padding:"10px 22px", background:"transparent", border:"1.5px solid #E8E8F0", borderRadius:"10px", fontSize:"13px", fontWeight:500, color:"#888780", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#F5F5FA", minHeight:"100vh", width:"100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideLeft{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
        .fi{width:100%;padding:10px 13px;border:1.5px solid #E8E8F0;border-radius:9px;font-size:13px;color:#1A1A2E;font-family:'DM Sans',sans-serif;background:#fff;transition:border-color .15s,box-shadow .15s;}
        .fi:focus{outline:none;border-color:#7F77DD;box-shadow:0 0 0 3px rgba(127,119,221,.1);}
        .fi::placeholder{color:#B4B2A9;}
        .fi.error{border-color:#E24B4A;background:#FEFAFA;}
        textarea.fi{resize:vertical;min-height:96px;line-height:1.7;}
        select.fi{cursor:pointer;}
        .fl{font-size:12px;font-weight:500;color:#444441;margin-bottom:5px;display:block;}
        .fe{font-size:11px;color:#E24B4A;margin-top:4px;}
        .fh{font-size:11px;color:#B4B2A9;margin-top:4px;}
        .fg{display:flex;flex-direction:column;}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
        .section{background:#fff;border-radius:16px;border:1px solid #E8E8F0;padding:22px;margin-bottom:16px;}
        .sec-title{font-size:14px;font-weight:600;color:#1A1A2E;margin-bottom:3px;}
        .sec-sub{font-size:12px;color:#888780;margin-bottom:18px;}
        .cat-btn{display:flex;flex-direction:column;align-items:center;gap:5px;padding:12px 8px;border:1.5px solid #E8E8F0;border-radius:11px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;background:#fff;}
        .cat-btn:hover{border-color:#7F77DD;transform:translateY(-2px);}
        .cat-btn.active{border-width:2px;}
        .type-toggle{display:flex;background:#F5F5FA;border-radius:10px;padding:4px;}
        .type-btn{flex:1;padding:9px;border:none;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .drop-zone{border:2px dashed #E8E8F0;border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .18s;}
        .drop-zone:hover,.drop-zone.drag{border-color:#7F77DD;background:rgba(127,119,221,.04);}
        .next-btn{padding:11px 28px;background:#7F77DD;border:none;border-radius:10px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;display:flex;align-items:center;gap:8px;}
        .next-btn:hover{background:#6B63CC;transform:translateY(-1px);}
        .prev-btn{padding:11px 20px;background:transparent;border:1.5px solid #E8E8F0;border-radius:10px;font-size:14px;font-weight:500;color:#888780;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .prev-btn:hover{border-color:#7F77DD;color:#7F77DD;}
        .step-anim{animation:slideRight .3s ease both;}
        input[type=date].fi,input[type=time].fi{color-scheme:light;}
        .preview-cover{height:160px;border-radius:14px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:16px;}
        .req{color:#E24B4A;margin-left:1px;}
        .char-count{font-size:11px;color:#B4B2A9;text-align:right;margin-top:3px;}
        .contact-icon-wrap{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      `}</style>

      <div style={{ width:"100%", padding:"28px 32px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:"24px", animation:"fadeUp .4s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
            <Link href="/my-events" style={{ fontSize:"12px", color:"#888780", textDecoration:"none", display:"flex", alignItems:"center", gap:"4px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              My events
            </Link>
            <span style={{ fontSize:"12px", color:"#B4B2A9" }}>/</span>
            <span style={{ fontSize:"12px", color:"#888780" }}>Create event</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"26px", fontWeight:700, color:"#1A1A2E", letterSpacing:"-0.02em" }}>
            Create a new event
          </h1>
        </div>

        {/* ── Step Indicator ── */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:"28px", animation:"fadeUp .4s .05s ease both", opacity:0, animationFillMode:"forwards" }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
                <div style={{
                  width:"34px", height:"34px", borderRadius:"50%",
                  background: step > s.id ? "#1D9E75" : step === s.id ? "#7F77DD" : "#F0F0F8",
                  border: `2px solid ${step > s.id ? "#1D9E75" : step === s.id ? "#7F77DD" : "#E8E8F0"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"14px", transition:"all .3s",
                }}>
                  {step > s.id ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <span style={{ fontSize:"13px" }}>{s.icon}</span>
                  )}
                </div>
                <div style={{ display:"flex", flexDirection:"column" }}>
                  <span style={{ fontSize:"10px", color: step === s.id ? "#7F77DD" : "#B4B2A9", fontWeight:500, textTransform:"uppercase", letterSpacing:".06em" }}>Step {s.id}</span>
                  <span style={{ fontSize:"12px", color: step === s.id ? "#1A1A2E" : "#888780", fontWeight: step === s.id ? 600 : 400 }}>{s.label}</span>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex:1, height:"2px", background: step > s.id ? "#1D9E75" : "#E8E8F0", margin:"0 12px", transition:"background .4s" }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"20px", alignItems:"start" }}>

          {/* ── Form Area ── */}
          <div className="step-anim">

            {/* ════ STEP 1: BASICS ════ */}
            {step === 1 && (
              <div>
                {/* Cover image */}
                <div className="section">
                  <div className="sec-title">Cover image</div>
                  <div className="sec-sub">A great image makes people more likely to join</div>
                  {form.coverImage ? (
                    <div>
                      <div style={{ borderRadius:"12px", overflow:"hidden", marginBottom:"10px", height:"160px" }}>
                        <img src={form.coverImage} alt="cover" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      </div>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <button onClick={() => fileRef.current?.click()} style={{ padding:"6px 14px", background:"#F5F5FA", border:"1px solid #E8E8F0", borderRadius:"8px", fontSize:"12px", fontWeight:500, color:"#444441", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                          Change image
                        </button>
                        <button onClick={() => set("coverImage", null)} style={{ padding:"6px 14px", background:"#FCEBEB", border:"1px solid #F7C1C1", borderRadius:"8px", fontSize:"12px", fontWeight:500, color:"#E24B4A", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="drop-zone" onClick={() => fileRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImage(f); }}>
                      <div style={{ fontSize:"32px", marginBottom:"8px" }}>🖼️</div>
                      <p style={{ fontSize:"13px", fontWeight:500, color:"#444441", marginBottom:"4px" }}>Drag & drop or click to upload</p>
                      <p style={{ fontSize:"11px", color:"#B4B2A9" }}>JPG, PNG, WebP · Recommended 1200×600px</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f); }} />
                </div>

                {/* Basic info */}
                <div className="section">
                  <div className="sec-title">Event basics</div>
                  <div className="sec-sub">The essential information about your event</div>

                  <div className="fg" style={{ marginBottom:"14px" }}>
                    <label className="fl">Event title <span className="req">*</span></label>
                    <input className={`fi${errors.title?" error":""}`} type="text" placeholder="e.g. Madurai Tech Meetup 2025" value={form.title} onChange={e => { set("title", e.target.value.slice(0,80)); setErrors(p=>({...p,title:undefined})); }} />
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
                      {errors.title ? <span className="fe">{errors.title}</span> : <span />}
                      <span style={{ fontSize:"11px", color:"#B4B2A9" }}>{form.title.length}/80</span>
                    </div>
                  </div>

                  <div className="fg" style={{ marginBottom:"14px" }}>
                    <label className="fl">Category <span className="req">*</span></label>
                    {errors.category && <span className="fe" style={{ marginBottom:"6px" }}>{errors.category}</span>}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"8px" }}>
                      {CATEGORIES.map(cat => (
                        <button key={cat.id} type="button" onClick={() => { set("category", cat.id); setErrors(p=>({...p,category:undefined})); }}
                          className={`cat-btn${form.category===cat.id?" active":""}`}
                          style={{ borderColor: form.category===cat.id ? cat.color : "#E8E8F0", background: form.category===cat.id ? cat.bg : "#fff" }}>
                          <span style={{ fontSize:"20px" }}>{cat.emoji}</span>
                          <span style={{ fontSize:"10px", fontWeight: form.category===cat.id?600:400, color: form.category===cat.id?cat.color:"#888780" }}>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fg" style={{ marginBottom:"14px" }}>
                    <label className="fl">Description <span className="req">*</span></label>
                    <textarea className={`fi${errors.description?" error":""}`} placeholder="Tell attendees what your event is about, what to expect, and why they should join..." value={form.description} onChange={e => { set("description", e.target.value.slice(0,1000)); setErrors(p=>({...p,description:undefined})); }} />
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
                      {errors.description ? <span className="fe">{errors.description}</span> : <span />}
                      <span className="char-count">{form.description.length}/1000</span>
                    </div>
                  </div>

                  <div className="g2">
                    <div className="fg">
                      <label className="fl">Entry type <span className="req">*</span></label>
                      <div className="type-toggle">
                        {(["Free","Paid"] as const).map(t => (
                          <button key={t} type="button" onClick={() => set("entryType", t)} className="type-btn"
                            style={{ background: form.entryType===t ? (t==="Free"?"#1D9E75":"#7F77DD") : "transparent", color: form.entryType===t ? "#fff" : "#888780" }}>
                            {t === "Free" ? "🎟 Free" : "💳 Paid"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.entryType === "Paid" && (
                      <div className="fg">
                        <label className="fl">Ticket price (₹) <span className="req">*</span></label>
                        <div style={{ position:"relative" }}>
                          <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", color:"#444441", fontWeight:600 }}>₹</span>
                          <input className={`fi${errors.price?" error":""}`} type="number" min="1" placeholder="299" value={form.price} onChange={e => { set("price", e.target.value); setErrors(p=>({...p,price:undefined})); }} style={{ paddingLeft:"28px" }} />
                        </div>
                        {errors.price && <span className="fe">{errors.price}</span>}
                      </div>
                    )}
                    <div className="fg">
                      <label className="fl">Max attendees <span style={{ fontSize:"11px", color:"#B4B2A9", fontWeight:400 }}>(leave blank for unlimited)</span></label>
                      <input className="fi" type="number" min="1" placeholder="e.g. 200" value={form.maxAttendees} onChange={e => set("maxAttendees", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════ STEP 2: DETAILS ════ */}
            {step === 2 && (
              <div>
                {/* Date & Time */}
                <div className="section">
                  <div className="sec-title">Date & time</div>
                  <div className="sec-sub">When is your event happening?</div>

                  <div className="g3" style={{ marginBottom:"14px" }}>
                    <div className="fg">
                      <label className="fl">Date <span className="req">*</span></label>
                      <input className={`fi${errors.date?" error":""}`} type="date" min={today()} value={form.date} onChange={e => { set("date", e.target.value); setErrors(p=>({...p,date:undefined})); }} />
                      {errors.date && <span className="fe">{errors.date}</span>}
                    </div>
                    <div className="fg">
                      <label className="fl">Start time <span className="req">*</span></label>
                      <input className={`fi${errors.startTime?" error":""}`} type="time" value={form.startTime} onChange={e => { set("startTime", e.target.value); setErrors(p=>({...p,startTime:undefined})); }} />
                      {errors.startTime && <span className="fe">{errors.startTime}</span>}
                    </div>
                    <div className="fg">
                      <label className="fl">End time <span style={{ fontSize:"11px", color:"#B4B2A9", fontWeight:400 }}>(optional)</span></label>
                      <input className="fi" type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)} />
                    </div>
                  </div>

                  {form.date && (
                    <div style={{ padding:"10px 14px", background:"#EEEDFE", borderRadius:"9px", display:"flex", alignItems:"center", gap:"8px", border:"1px solid rgba(127,119,221,.2)" }}>
                      <span style={{ fontSize:"16px" }}>📅</span>
                      <span style={{ fontSize:"13px", fontWeight:500, color:"#3C3489" }}>
                        {formatDate(form.date)}{form.startTime && ` · ${form.startTime}`}{form.endTime && ` – ${form.endTime}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="section">
                  <div className="sec-title">Location</div>
                  <div className="sec-sub">Where is your event taking place?</div>

                  <div className="fg" style={{ marginBottom:"14px" }}>
                    <label className="fl">Venue / Place name <span className="req">*</span></label>
                    <input className={`fi${errors.venue?" error":""}`} type="text" placeholder="e.g. Madurai Kamaraj University Auditorium" value={form.venue} onChange={e => { set("venue", e.target.value); setErrors(p=>({...p,venue:undefined})); }} />
                    {errors.venue && <span className="fe">{errors.venue}</span>}
                  </div>

                  <div className="g3" style={{ marginBottom:"14px" }}>
                    <div className="fg">
                      <label className="fl">State <span className="req">*</span></label>
                      <select className="fi" value={form.state} onChange={e => onStateChange(e.target.value)}>
                        {Object.keys(LOCATION_DATA).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="fg">
                      <label className="fl">District <span className="req">*</span></label>
                      <select className="fi" value={form.district} onChange={e => onDistChange(e.target.value)}>
                        {districts.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="fg">
                      <label className="fl">Area / City <span className="req">*</span></label>
                      <select className="fi" value={form.area} onChange={e => set("area", e.target.value)}>
                        {areas.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="fg" style={{ marginBottom:"14px" }}>
                    <label className="fl">Landmark <span style={{ fontSize:"11px", color:"#B4B2A9", fontWeight:400 }}>(optional)</span></label>
                    <input className="fi" type="text" placeholder="e.g. Near Meenakshi Temple, 2nd floor" value={form.landmark} onChange={e => set("landmark", e.target.value)} />
                  </div>

                  {form.area && (
                    <div style={{ padding:"10px 14px", background:"#E1F5EE", borderRadius:"9px", display:"flex", alignItems:"center", gap:"8px", border:"1px solid rgba(29,158,117,.2)" }}>
                      <span style={{ fontSize:"14px" }}>📍</span>
                      <span style={{ fontSize:"13px", fontWeight:500, color:"#085041" }}>
                        {form.venue && `${form.venue}, `}{form.area}, {form.district}, {form.state}
                      </span>
                    </div>
                  )}
                </div>

                {/* How to attend */}
                <div className="section">
                  <div className="sec-title">How to attend</div>
                  <div className="sec-sub">Give attendees instructions — what to bring, dress code, registration steps</div>
                  <textarea className="fi" placeholder="e.g. Bring your laptop and ID. Register at the reception. Smart casual dress code. Parking available in Basement B2." value={form.howToAttend} onChange={e => set("howToAttend", e.target.value.slice(0,500))} style={{ minHeight:"80px" }} />
                  <div className="char-count">{form.howToAttend.length}/500</div>
                </div>
              </div>
            )}

            {/* ════ STEP 3: CONTACT ════ */}
            {step === 3 && (
              <div>
                <div className="section">
                  <div className="sec-title">Contact information</div>
                  <div className="sec-sub">How can attendees reach you? At least phone or email required.</div>

                  <div className="g2" style={{ marginBottom:"14px" }}>
                    <div className="fg">
                      <label className="fl">Contact name <span className="req">*</span></label>
                      <input className={`fi${errors.contactName?" error":""}`} type="text" placeholder="Your name or organisation" value={form.contactName} onChange={e => { set("contactName", e.target.value); setErrors(p=>({...p,contactName:undefined})); }} />
                      {errors.contactName && <span className="fe">{errors.contactName}</span>}
                    </div>
                    <div className="fg">
                      <label className="fl">Website <span style={{ fontSize:"11px", color:"#B4B2A9", fontWeight:400 }}>(optional)</span></label>
                      <input className="fi" type="url" placeholder="https://yourwebsite.com" value={form.website} onChange={e => set("website", e.target.value)} />
                    </div>
                  </div>

                  {[
                    { key:"contactPhone" as const, label:"Phone number", req:true,  icon:"📞", placeholder:"+91 98765 43210",    type:"tel",   color:"#E1F5EE", iconColor:"#1D9E75" },
                    { key:"contactEmail" as const, label:"Email address", req:true,  icon:"✉️", placeholder:"contact@event.com",  type:"email", color:"#EEEDFE", iconColor:"#7F77DD" },
                    { key:"contactWA"    as const, label:"WhatsApp",      req:false, icon:"💬", placeholder:"+91 98765 43210",    type:"tel",   color:"#E1F5EE", iconColor:"#1D9E75" },
                  ].map(field => (
                    <div key={field.key} style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"14px" }}>
                      <div className="contact-icon-wrap" style={{ background:field.color, marginTop:"22px" }}>
                        <span style={{ fontSize:"16px" }}>{field.icon}</span>
                      </div>
                      <div className="fg" style={{ flex:1 }}>
                        <label className="fl">{field.label} {field.req && <span className="req">*</span>}</label>
                        <input className={`fi${errors[field.key]?" error":""}`} type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => { set(field.key, e.target.value); setErrors(p=>({...p,[field.key]:undefined})); }} />
                        {errors[field.key] && <span className="fe">{errors[field.key]}</span>}
                        {field.key === "contactWA" && <p className="fh">Attendees can message you directly on WhatsApp</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ STEP 4: PREVIEW ════ */}
            {step === 4 && (
              <div>
                <div className="section">
                  <div className="sec-title">Review your event</div>
                  <div className="sec-sub">Everything look good? You can still edit after publishing.</div>

                  {/* Cover */}
                  <div className="preview-cover" style={{ background: selCat ? selCat.bg : "#F5F5FA" }}>
                    {form.coverImage ? (
                      <img src={form.coverImage} alt="cover" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    ) : (
                      <span style={{ fontSize:"56px" }}>{selCat?.emoji || "📅"}</span>
                    )}
                  </div>

                  {/* Badges */}
                  <div style={{ display:"flex", gap:"7px", flexWrap:"wrap", marginBottom:"12px" }}>
                    {selCat && <span style={{ fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"20px", background:selCat.bg, color:selCat.color }}>{selCat.emoji} {selCat.label}</span>}
                    <span style={{ fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"20px", background: form.entryType==="Free"?"#EAF3DE":"#FAEEDA", color: form.entryType==="Free"?"#27500A":"#633806" }}>
                      {form.entryType==="Paid" ? `₹${form.price}` : "Free"}
                    </span>
                    {form.maxAttendees && <span style={{ fontSize:"11px", fontWeight:600, padding:"3px 10px", borderRadius:"20px", background:"#F1EFE8", color:"#444441" }}>Max {form.maxAttendees} attendees</span>}
                  </div>

                  {/* Title */}
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:700, color:"#1A1A2E", marginBottom:"10px", lineHeight:1.3 }}>
                    {form.title || <span style={{ color:"#B4B2A9" }}>Your event title</span>}
                  </h2>

                  {/* Info rows */}
                  {[
                    { icon:"📅", value: form.date ? `${formatDate(form.date)} · ${form.startTime || ""}${form.endTime?" – "+form.endTime:""}` : "Date not set" },
                    { icon:"📍", value: form.venue ? `${form.venue}, ${form.area}, ${form.district}, ${form.state}` : "Location not set" },
                    { icon:"📞", value: form.contactPhone || "Contact not set" },
                    { icon:"👤", value: form.contactName || "Organiser not set" },
                  ].map((row, i) => (
                    <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"10px 0", borderBottom:"1px solid #F5F5FA" }}>
                      <span style={{ fontSize:"15px", flexShrink:0, marginTop:"1px" }}>{row.icon}</span>
                      <span style={{ fontSize:"13px", color: row.value.includes("not set") ? "#B4B2A9" : "#444441", lineHeight:1.5 }}>{row.value}</span>
                    </div>
                  ))}

                  {/* Description */}
                  {form.description && (
                    <div style={{ marginTop:"14px" }}>
                      <p style={{ fontSize:"12px", fontWeight:600, color:"#888780", marginBottom:"6px", textTransform:"uppercase", letterSpacing:".06em" }}>About this event</p>
                      <p style={{ fontSize:"13px", color:"#444441", lineHeight:1.7 }}>{form.description}</p>
                    </div>
                  )}

                  {/* How to attend */}
                  {form.howToAttend && (
                    <div style={{ marginTop:"14px", padding:"12px 14px", background:"#F5F5FA", borderRadius:"10px" }}>
                      <p style={{ fontSize:"12px", fontWeight:600, color:"#888780", marginBottom:"5px" }}>How to attend</p>
                      <p style={{ fontSize:"13px", color:"#444441", lineHeight:1.6 }}>{form.howToAttend}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Navigation Buttons ── */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:"4px" }}>
              {step > 1 ? (
                <button onClick={prev} className="prev-btn">
                  ← Back
                </button>
              ) : (
                <Link href="/my-events" style={{ padding:"11px 20px", background:"transparent", border:"1.5px solid #E8E8F0", borderRadius:"10px", fontSize:"14px", fontWeight:500, color:"#888780", textDecoration:"none" }}>
                  Cancel
                </Link>
              )}

              {step < 4 ? (
                <button onClick={next} className="next-btn">
                  Continue →
                </button>
              ) : (
                <button onClick={handleSubmit} className="next-btn" disabled={submitting}
                  style={{ background: submitting ? "#AFA9EC" : "#1D9E75", minWidth:"150px" }}>
                  {submitting ? (
                    <>
                      <span style={{ width:"14px", height:"14px", border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
                      Publishing...
                    </>
                  ) : "🚀 Publish event"}
                </button>
              )}
            </div>
          </div>

          {/* ── Live Preview Sidebar ── */}
          <div style={{ position:"sticky", top:"24px", animation:"fadeUp .4s .15s ease both", opacity:0, animationFillMode:"forwards" }}>
            <div style={{ background:"#1A1A2E", borderRadius:"16px", padding:"18px", marginBottom:"14px" }}>
              <p style={{ fontSize:"10px", fontWeight:600, color:"rgba(255,255,255,.4)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:"12px" }}>Live preview</p>

              {/* Mini card */}
              <div style={{ background:"#fff", borderRadius:"12px", overflow:"hidden" }}>
                <div style={{ height:"90px", background: selCat ? selCat.bg : "#F0F0F8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"40px" }}>
                  {form.coverImage ? (
                    <img src={form.coverImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  ) : (selCat?.emoji || "📅")}
                </div>
                <div style={{ padding:"12px" }}>
                  <div style={{ display:"flex", gap:"5px", marginBottom:"6px", flexWrap:"wrap" }}>
                    {selCat && <span style={{ fontSize:"10px", fontWeight:600, padding:"2px 6px", borderRadius:"20px", background:selCat.bg, color:selCat.color }}>{selCat.label}</span>}
                    <span style={{ fontSize:"10px", fontWeight:600, padding:"2px 6px", borderRadius:"20px", background: form.entryType==="Free"?"#EAF3DE":"#FAEEDA", color: form.entryType==="Free"?"#27500A":"#633806" }}>
                      {form.entryType==="Paid" && form.price ? `₹${form.price}` : form.entryType}
                    </span>
                  </div>
                  <p style={{ fontSize:"13px", fontWeight:600, color:"#1A1A2E", lineHeight:1.4, marginBottom:"6px", minHeight:"18px" }}>
                    {form.title || <span style={{ color:"#B4B2A9" }}>Event title...</span>}
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                    <span style={{ fontSize:"11px", color:"#888780", display:"flex", alignItems:"center", gap:"4px" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {form.date ? formatDate(form.date) : "Date TBD"}
                    </span>
                    <span style={{ fontSize:"11px", color:"#888780", display:"flex", alignItems:"center", gap:"4px" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {form.area || form.district || "Location TBD"}
                    </span>
                  </div>
                  <div style={{ marginTop:"10px", padding:"7px", background:"#7F77DD", borderRadius:"7px", textAlign:"center", fontSize:"11px", fontWeight:600, color:"#fff" }}>
                    View event →
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E8E8F0", padding:"16px" }}>
              <p style={{ fontSize:"12px", fontWeight:600, color:"#1A1A2E", marginBottom:"12px" }}>Completion checklist</p>
              {[
                { label:"Event title",    done: !!form.title },
                { label:"Category",       done: !!form.category },
                { label:"Description",    done: !!form.description },
                { label:"Date & time",    done: !!form.date && !!form.startTime },
                { label:"Location",       done: !!form.venue },
                { label:"Contact info",   done: !!form.contactPhone || !!form.contactEmail },
                { label:"Cover image",    done: !!form.coverImage },
              ].map(item => (
                <div key={item.label} style={{ display:"flex", alignItems:"center", gap:"9px", padding:"6px 0", borderBottom:"1px solid #F5F5FA" }}>
                  <div style={{
                    width:"18px", height:"18px", borderRadius:"50%", flexShrink:0,
                    background: item.done ? "#E1F5EE" : "#F0F0F8",
                    border: `1.5px solid ${item.done ? "#1D9E75" : "#E8E8F0"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all .2s",
                  }}>
                    {item.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ fontSize:"12px", color: item.done ? "#444441" : "#B4B2A9", fontWeight: item.done ? 500 : 400 }}>{item.label}</span>
                </div>
              ))}
              <div style={{ marginTop:"10px", paddingTop:"8px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                  <span style={{ fontSize:"11px", color:"#888780" }}>Progress</span>
                  <span style={{ fontSize:"11px", fontWeight:600, color:"#7F77DD" }}>
                    {[form.title,form.category,form.description,form.date&&form.startTime,form.venue,form.contactPhone||form.contactEmail,form.coverImage].filter(Boolean).length}/7
                  </span>
                </div>
                <div style={{ height:"5px", background:"#F0F0F8", borderRadius:"3px", overflow:"hidden" }}>
                  <div style={{
                    height:"100%", borderRadius:"3px", background:"#7F77DD", transition:"width .4s",
                    width:`${([form.title,form.category,form.description,form.date&&form.startTime,form.venue,form.contactPhone||form.contactEmail,form.coverImage].filter(Boolean).length/7)*100}%`,
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}