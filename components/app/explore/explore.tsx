"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Event {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  date: string;
  dateDisplay: string;
  time: string;
  city: string;
  state: string;
  district: string;
  joined: number;
  max: number | null;
  type: "Free" | "Paid";
  price?: number;
  status: "upcoming" | "live" | "past";
  organizer: string;
  image: string;
}

// ─── Location Data ────────────────────────────────────────────────────────────
const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "All India":   { "All Districts": ["All Cities"] },
  "Tamil Nadu":  {
    "All Districts": ["All Cities"],
    "Madurai":       ["All Cities","Madurai City","Melur","Thirumangalam","Usilampatti","Vadipatti","Alanganallur"],
    "Chennai":       ["All Cities","T. Nagar","Anna Nagar","Adyar","Velachery","Tambaram","Chrompet","Porur"],
    "Coimbatore":    ["All Cities","RS Puram","Saibaba Colony","Singanallur","Ganapathy","Peelamedu"],
    "Tiruchirappalli":["All Cities","Srirangam","KK Nagar","Ariyamangalam","Woraiyur"],
    "Salem":         ["All Cities","Fairlands","Suramangalam","Ammapet","Shevapet"],
    "Tirunelveli":   ["All Cities","Palayamkottai","Melapalayam","Vannarpet"],
    "Erode":         ["All Cities","Bhavani","Perundurai","Gobichettipalayam"],
    "Vellore":       ["All Cities","Katpadi","Ambur","Ranipet"],
    "Thanjavur":     ["All Cities","Kumbakonam","Papanasam","Pattukottai"],
    "Dindigul":      ["All Cities","Palani","Natham","Oddanchatram"],
    "Kanyakumari":   ["All Cities","Nagercoil","Marthandam","Padmanabhapuram"],
  },
  "Kerala": {
    "All Districts": ["All Cities"],
    "Ernakulam":     ["All Cities","Kochi","Kalamassery","Aluva","Edappally"],
    "Thiruvananthapuram":["All Cities","Kovalam","Technopark","Pattom","Kowdiar"],
    "Kozhikode":     ["All Cities","Calicut Beach","Nadakkavu","Mavoor"],
    "Thrissur":      ["All Cities","Guruvayur","Chalakudy","Irinjalakuda"],
    "Palakkad":      ["All Cities","Palakkad Town","Ottapalam","Shoranur"],
  },
  "Karnataka": {
    "All Districts": ["All Cities"],
    "Bengaluru Urban":["All Cities","Koramangala","Indiranagar","Whitefield","HSR Layout","Jayanagar","Malleshwaram"],
    "Mysuru":        ["All Cities","Mysore City","Nanjangud","T. Narsipur"],
    "Mangaluru":     ["All Cities","Mangalore City","Surathkal","Ullal"],
    "Hubli-Dharwad": ["All Cities","Hubli","Dharwad"],
  },
  "Maharashtra": {
    "All Districts": ["All Cities"],
    "Mumbai":        ["All Cities","Bandra","Andheri","Dadar","Colaba","Powai","Juhu"],
    "Pune":          ["All Cities","Koregaon Park","Hinjewadi","Viman Nagar","Kothrud"],
    "Nagpur":        ["All Cities","Dharampeth","Sitabuldi","Sadar"],
    "Nashik":        ["All Cities","Nashik Road","Deolali"],
  },
  "Delhi": {
    "All Districts": ["All Cities"],
    "Central Delhi": ["All Cities","Connaught Place","Karol Bagh","Paharganj"],
    "South Delhi":   ["All Cities","Hauz Khas","Saket","Vasant Kunj","Lajpat Nagar"],
    "North Delhi":   ["All Cities","Civil Lines","Model Town","Pitampura"],
  },
  "Telangana": {
    "All Districts": ["All Cities"],
    "Hyderabad":     ["All Cities","Banjara Hills","Jubilee Hills","Madhapur","Hitech City","Ameerpet"],
    "Rangareddy":    ["All Cities","Gachibowli","Kondapur","Shamshabad"],
  },
};

// ─── Events Data ─────────────────────────────────────────────────────────────
const ALL_EVENTS: Event[] = [
  { id:"1",  title:"Madurai Meenakshi Utsavam Cultural Night",  category:"Art",          categoryColor:"#72243E", categoryBg:"#FBEAF0", date:"2025-04-12", dateDisplay:"Sat 12 Apr", time:"6:00 PM",  city:"Madurai City",  state:"Tamil Nadu", district:"Madurai",    joined:312,  max:500,  type:"Free",  status:"upcoming", organizer:"Madurai Cultural Trust",     image:"🎭" },
  { id:"2",  title:"Jallikattu Heritage Festival 2025",          category:"Sports",       categoryColor:"#085041", categoryBg:"#E1F5EE", date:"2025-04-14", dateDisplay:"Mon 14 Apr", time:"8:00 AM",  city:"Alanganallur",  state:"Tamil Nadu", district:"Madurai",    joined:2400, max:5000, type:"Free",  status:"upcoming", organizer:"Madurai District Admin",     image:"🐂" },
  { id:"3",  title:"Madurai Street Food Carnival",               category:"Food",         categoryColor:"#712B13", categoryBg:"#FAECE7", date:"2025-04-19", dateDisplay:"Sat 19 Apr", time:"5:00 PM",  city:"Madurai City",  state:"Tamil Nadu", district:"Madurai",    joined:180,  max:300,  type:"Free",  status:"upcoming", organizer:"Madurai Food Lovers Club",   image:"🍜" },
  { id:"4",  title:"Tamil Tech Summit — Madurai Edition",        category:"Tech",         categoryColor:"#3C3489", categoryBg:"#EEEDFE", date:"2025-04-26", dateDisplay:"Sat 26 Apr", time:"9:00 AM",  city:"Madurai City",  state:"Tamil Nadu", district:"Madurai",    joined:94,   max:200,  type:"Paid",  price:299, status:"upcoming", organizer:"TN Tech Community",         image:"💻" },
  { id:"5",  title:"Madurai Heritage Photo Walk",                category:"Photography",  categoryColor:"#085041", categoryBg:"#E1F5EE", date:"2025-04-13", dateDisplay:"Sun 13 Apr", time:"6:30 AM",  city:"Madurai City",  state:"Tamil Nadu", district:"Madurai",    joined:28,   max:40,   type:"Free",  status:"upcoming", organizer:"Madurai Photo Club",        image:"📷" },
  { id:"6",  title:"Chennai Music Academy Classical Concert",    category:"Music",        categoryColor:"#633806", categoryBg:"#FAEEDA", date:"2025-04-13", dateDisplay:"Sun 13 Apr", time:"7:00 PM",  city:"T. Nagar",      state:"Tamil Nadu", district:"Chennai",    joined:450,  max:600,  type:"Paid",  price:150, status:"upcoming", organizer:"Chennai Music Academy",     image:"🎵" },
  { id:"7",  title:"Marina Beach Sunrise Yoga",                  category:"Health",       categoryColor:"#27500A", categoryBg:"#EAF3DE", date:"2025-04-15", dateDisplay:"Tue 15 Apr", time:"5:30 AM",  city:"Adyar",         state:"Tamil Nadu", district:"Chennai",    joined:67,   max:100,  type:"Free",  status:"upcoming", organizer:"Chennai Yoga Circle",       image:"🧘" },
  { id:"8",  title:"Tamil Nadu Startup Pitch Day",               category:"Business",     categoryColor:"#0C447C", categoryBg:"#E6F1FB", date:"2025-04-18", dateDisplay:"Fri 18 Apr", time:"10:00 AM", city:"Anna Nagar",    state:"Tamil Nadu", district:"Chennai",    joined:88,   max:150,  type:"Paid",  price:499, status:"upcoming", organizer:"StartupTN",                 image:"🚀" },
  { id:"9",  title:"Pongal Photo Walk — Chennai Heritage",       category:"Photography",  categoryColor:"#085041", categoryBg:"#E1F5EE", date:"2025-04-20", dateDisplay:"Sun 20 Apr", time:"6:00 AM",  city:"T. Nagar",      state:"Tamil Nadu", district:"Chennai",    joined:35,   max:50,   type:"Free",  status:"upcoming", organizer:"Chennai Photo Society",     image:"📸" },
  { id:"10", title:"Chennai Book Fair — Indie Authors",          category:"Education",    categoryColor:"#0C447C", categoryBg:"#E6F1FB", date:"2025-04-16", dateDisplay:"Wed 16 Apr", time:"11:00 AM", city:"Anna Nagar",    state:"Tamil Nadu", district:"Chennai",    joined:210,  max:null, type:"Free",  status:"upcoming", organizer:"Chennai Literary Society",  image:"📚" },
  { id:"11", title:"Coimbatore Textile & Fashion Expo",          category:"Fashion",      categoryColor:"#72243E", categoryBg:"#FBEAF0", date:"2025-04-16", dateDisplay:"Wed 16 Apr", time:"10:00 AM", city:"RS Puram",      state:"Tamil Nadu", district:"Coimbatore", joined:220,  max:400,  type:"Free",  status:"upcoming", organizer:"CII Coimbatore",            image:"👗" },
  { id:"12", title:"Nilgiri Trail Run 2025",                     category:"Sports",       categoryColor:"#085041", categoryBg:"#E1F5EE", date:"2025-04-27", dateDisplay:"Sun 27 Apr", time:"5:00 AM",  city:"Ganapathy",     state:"Tamil Nadu", district:"Coimbatore", joined:180,  max:300,  type:"Paid",  price:599, status:"upcoming", organizer:"Coimbatore Runners Club",   image:"🏃" },
  { id:"13", title:"Coimbatore Gaming & Anime Expo",             category:"Gaming",       categoryColor:"#3C3489", categoryBg:"#EEEDFE", date:"2025-04-21", dateDisplay:"Mon 21 Apr", time:"10:00 AM", city:"Singanallur",   state:"Tamil Nadu", district:"Coimbatore", joined:340,  max:600,  type:"Paid",  price:199, status:"upcoming", organizer:"Tamil Gamers Hub",          image:"🎮" },
  { id:"14", title:"Rock Fort Art & Craft Festival",             category:"Art",          categoryColor:"#72243E", categoryBg:"#FBEAF0", date:"2025-04-15", dateDisplay:"Tue 15 Apr", time:"4:00 PM",  city:"Srirangam",     state:"Tamil Nadu", district:"Tiruchirappalli", joined:155, max:250, type:"Free", status:"upcoming", organizer:"Trichy Heritage Foundation", image:"🎨" },
  { id:"15", title:"Kochi Biennale Opening Night",               category:"Art",          categoryColor:"#72243E", categoryBg:"#FBEAF0", date:"2025-04-11", dateDisplay:"Fri 11 Apr", time:"6:30 PM",  city:"Kochi",         state:"Kerala",     district:"Ernakulam",  joined:890,  max:1000, type:"Free",  status:"live",     organizer:"Kochi Biennale Foundation", image:"🎭" },
  { id:"16", title:"Kerala Startup Summit 2025",                 category:"Business",     categoryColor:"#0C447C", categoryBg:"#E6F1FB", date:"2025-04-22", dateDisplay:"Tue 22 Apr", time:"9:00 AM",  city:"Kalamassery",   state:"Kerala",     district:"Ernakulam",  joined:145,  max:250,  type:"Paid",  price:399, status:"upcoming", organizer:"Kerala Startup Mission",    image:"💡" },
  { id:"17", title:"Thiruvananthapuram Music Fest",              category:"Music",        categoryColor:"#633806", categoryBg:"#FAEEDA", date:"2025-04-19", dateDisplay:"Sat 19 Apr", time:"5:00 PM",  city:"Pattom",        state:"Kerala",     district:"Thiruvananthapuram", joined:200, max:400, type:"Free", status:"upcoming", organizer:"Kerala Arts Council",       image:"🎵" },
  { id:"18", title:"Bangalore Tech Fest — AI Edition",           category:"Tech",         categoryColor:"#3C3489", categoryBg:"#EEEDFE", date:"2025-04-13", dateDisplay:"Sun 13 Apr", time:"9:30 AM",  city:"Koramangala",   state:"Karnataka",  district:"Bengaluru Urban", joined:540, max:800, type:"Paid", price:799, status:"upcoming", organizer:"BangaloreTech",            image:"🤖" },
  { id:"19", title:"Cubbon Park Morning Cycling",                category:"Sports",       categoryColor:"#085041", categoryBg:"#E1F5EE", date:"2025-04-12", dateDisplay:"Sat 12 Apr", time:"6:00 AM",  city:"Indiranagar",   state:"Karnataka",  district:"Bengaluru Urban", joined:78,  max:null, type:"Free", status:"upcoming", organizer:"Namma Bengaluru Cyclists",  image:"🚴" },
  { id:"20", title:"Mumbai Film Festival — Indie Edition",       category:"Art",          categoryColor:"#72243E", categoryBg:"#FBEAF0", date:"2025-04-17", dateDisplay:"Thu 17 Apr", time:"5:00 PM",  city:"Bandra",        state:"Maharashtra",district:"Mumbai",     joined:620,  max:800,  type:"Paid",  price:200, status:"upcoming", organizer:"Mumbai Film Society",       image:"🎬" },
  { id:"21", title:"Pune Startup Weekend",                       category:"Business",     categoryColor:"#0C447C", categoryBg:"#E6F1FB", date:"2025-04-18", dateDisplay:"Fri 18 Apr", time:"6:00 PM",  city:"Koregaon Park", state:"Maharashtra",district:"Pune",       joined:180,  max:250,  type:"Paid",  price:499, status:"upcoming", organizer:"Startup Weekend Pune",      image:"💼" },
  { id:"22", title:"Delhi Street Photography Walk",              category:"Photography",  categoryColor:"#085041", categoryBg:"#E1F5EE", date:"2025-04-14", dateDisplay:"Mon 14 Apr", time:"7:00 AM",  city:"Hauz Khas",     state:"Delhi",      district:"South Delhi",joined:29,   max:40,   type:"Free",  status:"upcoming", organizer:"Delhi Photo Circle",        image:"📸" },
  { id:"23", title:"India Gaming Expo 2025",                     category:"Gaming",       categoryColor:"#3C3489", categoryBg:"#EEEDFE", date:"2025-04-25", dateDisplay:"Fri 25 Apr", time:"11:00 AM", city:"Connaught Place",state:"Delhi",      district:"Central Delhi",joined:1200, max:2000, type:"Paid",  price:299, status:"upcoming", organizer:"India Gaming Federation",   image:"🎮" },
  { id:"24", title:"Hyderabad Tech & AI Meetup",                category:"Tech",         categoryColor:"#3C3489", categoryBg:"#EEEDFE", date:"2025-04-20", dateDisplay:"Sun 20 Apr", time:"10:00 AM", city:"Hitech City",   state:"Telangana",  district:"Hyderabad",  joined:320,  max:500,  type:"Free",  status:"upcoming", organizer:"HydTech Community",         image:"🤖" },
];

const CATEGORIES = ["All","Tech","Music","Art","Food","Sports","Health","Business","Photography","Fashion","Gaming","Education"];
const CAT_COLORS: Record<string,{c:string;b:string}> = {
  Tech:{c:"#3C3489",b:"#EEEDFE"}, Music:{c:"#633806",b:"#FAEEDA"},
  Art:{c:"#72243E",b:"#FBEAF0"},  Food:{c:"#712B13",b:"#FAECE7"},
  Sports:{c:"#085041",b:"#E1F5EE"}, Health:{c:"#27500A",b:"#EAF3DE"},
  Business:{c:"#0C447C",b:"#E6F1FB"}, Photography:{c:"#085041",b:"#E1F5EE"},
  Fashion:{c:"#72243E",b:"#FBEAF0"}, Gaming:{c:"#3C3489",b:"#EEEDFE"},
  Education:{c:"#0C447C",b:"#E6F1FB"},
};

// ─── Filter Panel (shared between sidebar & drawer) ───────────────────────────
function FilterPanel({
  selState, selDist, selCity, activeCat, activeType, dateMode,
  startDate, endDate, search, activeFilterCount,
  onState, onDist, setSelCity, setActiveCat, setActiveType,
  setDateMode, setStartDate, setEndDate, setSearch, clearAll,
  showFavsOnly, setShowFavsOnly, favorites,
}: any) {
  const states    = Object.keys(LOCATION_DATA);
  const districts = selState === "All India" ? ["All Districts"] : Object.keys(LOCATION_DATA[selState] ?? {});
  const cities    = (selState === "All India" || selDist === "All Districts")
    ? ["All Cities"] : (LOCATION_DATA[selState]?.[selDist] ?? ["All Cities"]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

      {/* Search */}
      <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E8E8F0", padding:"14px" }}>
        <p className="filter-label">Search</p>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input type="text" placeholder="Search events, cities..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"8px 10px 8px 30px", border:"1px solid #E8E8F0", borderRadius:"8px", fontSize:"13px", color:"#1A1A2E", fontFamily:"'DM Sans',sans-serif", background:"#FAFAFA" }} />
        </div>
      </div>

      {/* Location */}
      <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E8E8F0", padding:"14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"11px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <p className="filter-label" style={{ marginBottom:0 }}>Location</p>
        </div>
        <div style={{ marginBottom:"8px" }}>
          <p className="filter-sublabel">State / Region</p>
          <select value={selState} onChange={e => onState(e.target.value)} className="filter-select">
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        {selState !== "All India" && (
          <div style={{ marginBottom:"8px" }}>
            <p className="filter-sublabel">District</p>
            <select value={selDist} onChange={e => onDist(e.target.value)} className="filter-select">
              {districts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        )}
        {selState !== "All India" && selDist !== "All Districts" && (
          <div>
            <p className="filter-sublabel">City / Area</p>
            <select value={selCity} onChange={e => setSelCity(e.target.value)} className="filter-select">
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}
        {selState !== "All India" && (
          <div style={{ marginTop:"10px", display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ fontSize:"11px", padding:"3px 10px", background:"#EEEDFE", color:"#3C3489", borderRadius:"20px", fontWeight:500 }}>
              📍 {selCity !== "All Cities" ? selCity : selDist !== "All Districts" ? selDist : selState}
            </span>
            <button onClick={() => onState("All India")} style={{ fontSize:"11px", color:"#E24B4A", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>✕</button>
          </div>
        )}
      </div>

      {/* Date */}
      <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E8E8F0", padding:"14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"11px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p className="filter-label" style={{ marginBottom:0 }}>Date</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom: dateMode === "custom" ? "10px" : 0 }}>
          {([{val:"all",label:"📅 All dates"},{val:"today",label:"⚡ Today only"},{val:"custom",label:"🗓 Custom range"}] as const).map(({ val, label }) => (
            <button key={val} onClick={() => setDateMode(val)} style={{ padding:"8px 12px", background: dateMode===val ? "#1A1A2E" : "#FAFAFA", border:`1px solid ${dateMode===val ? "#1A1A2E" : "#E8E8F0"}`, borderRadius:"8px", fontSize:"13px", color: dateMode===val ? "#fff" : "#888780", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", textAlign:"left", fontWeight: dateMode===val ? 500 : 400, transition:"all .15s" }}>
              {label}
            </button>
          ))}
        </div>
        {dateMode === "custom" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <div>
              <p className="filter-sublabel">Start date</p>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="filter-select" />
            </div>
            <div>
              <p className="filter-sublabel">End date</p>
              <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="filter-select" />
            </div>
          </div>
        )}
      </div>

      {/* Entry Type */}
      <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #E8E8F0", padding:"14px" }}>
        <p className="filter-label">Entry type</p>
        <div style={{ display:"flex", gap:"6px" }}>
          {(["All","Free","Paid"] as const).map(t => (
            <button key={t} onClick={() => setActiveType(t)} style={{ flex:1, padding:"8px 4px", background: activeType===t ? (t==="Free"?"#E1F5EE":t==="Paid"?"#FAEEDA":"#1A1A2E") : "#FAFAFA", border:`1px solid ${activeType===t?(t==="Free"?"#1D9E75":t==="Paid"?"#BA7517":"#1A1A2E"):"#E8E8F0"}`, borderRadius:"8px", fontSize:"13px", fontWeight: activeType===t ? 600 : 400, color: activeType===t?(t==="Free"?"#085041":t==="Paid"?"#633806":"#fff"):"#888780", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .15s" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button onClick={clearAll} style={{ width:"100%", padding:"11px", background:"#FCEBEB", border:"1px solid #F7C1C1", borderRadius:"10px", fontSize:"13px", fontWeight:500, color:"#A32D2D", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [selState,     setSelState]     = useState("All India");
  const [selDist,      setSelDist]      = useState("All Districts");
  const [selCity,      setSelCity]      = useState("All Cities");
  const [activeCat,    setActiveCat]    = useState("All");
  const [activeType,   setActiveType]   = useState<"All"|"Free"|"Paid">("All");
  const [dateMode,     setDateMode]     = useState<"all"|"today"|"custom">("all");
  const [startDate,    setStartDate]    = useState("");
  const [endDate,      setEndDate]      = useState("");
  const [favorites,    setFavorites]    = useState<Set<string>>(new Set());
  const [search,       setSearch]       = useState("");
  const [sortBy,       setSortBy]       = useState<"popular"|"soonest"|"newest">("soonest");
  const [viewMode,     setViewMode]     = useState<"grid"|"list">("grid");
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [filterOpen,   setFilterOpen]   = useState(false); // mobile drawer

  const today = "2025-04-11";

  const onState = (s: string) => { setSelState(s); setSelDist("All Districts"); setSelCity("All Cities"); };
  const onDist  = (d: string) => { setSelDist(d);  setSelCity("All Cities"); };

  const toggleFav = (id: string) => setFavorites(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const filtered = useMemo(() => {
    let list = [...ALL_EVENTS];
    if (showFavsOnly) list = list.filter(e => favorites.has(e.id));
    if (selState !== "All India") {
      list = list.filter(e => e.state === selState);
      if (selDist !== "All Districts") {
        list = list.filter(e => e.district === selDist);
        if (selCity !== "All Cities") list = list.filter(e => e.city === selCity);
      }
    }
    if (activeCat !== "All") list = list.filter(e => e.category === activeCat);
    if (activeType !== "All") list = list.filter(e => e.type === activeType);
    if (dateMode === "today") list = list.filter(e => e.date === today);
    else if (dateMode === "custom") {
      if (startDate) list = list.filter(e => e.date >= startDate);
      if (endDate)   list = list.filter(e => e.date <= endDate);
    }
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(e =>
      e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) ||
      e.state.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q)
    );
    if (sortBy === "popular") list.sort((a,b) => b.joined - a.joined);
    else if (sortBy === "newest") list.sort((a,b) => b.date.localeCompare(a.date));
    else list.sort((a,b) => a.date.localeCompare(b.date));
    return list;
  }, [selState,selDist,selCity,activeCat,activeType,dateMode,startDate,endDate,search,sortBy,showFavsOnly,favorites]);

  const activeFilterCount = [
    selState !== "All India", activeCat !== "All", activeType !== "All",
    dateMode !== "all", search.trim() !== "", showFavsOnly,
  ].filter(Boolean).length;

  const clearAll = () => {
    onState("All India"); setActiveCat("All"); setActiveType("All");
    setDateMode("all"); setStartDate(""); setEndDate(""); setSearch(""); setShowFavsOnly(false);
  };

  const favList = ALL_EVENTS.filter(e => favorites.has(e.id));

  const filterProps = {
    selState, selDist, selCity, activeCat, activeType, dateMode,
    startDate, endDate, search, activeFilterCount, showFavsOnly, favorites,
    onState, onDist, setSelCity, setActiveCat, setActiveType,
    setDateMode, setStartDate, setEndDate, setSearch, clearAll,
    setShowFavsOnly,
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#F5F5FA", minHeight:"100vh", width:"100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        /* Shared */
        .filter-label { font-size:10px; font-weight:600; color:#888780; letter-spacing:.08em; text-transform:uppercase; margin-bottom:8px; }
        .filter-sublabel { font-size:11px; color:#B4B2A9; margin-bottom:4px; }
        .filter-select { width:100%; padding:8px 10px; border:1px solid #E8E8F0; border-radius:8px; font-size:13px; color:#1A1A2E; font-family:'DM Sans',sans-serif; background:#FAFAFA; cursor:pointer; }
        .filter-select:focus { outline:none; border-color:#7F77DD; box-shadow:0 0 0 3px rgba(127,119,221,.12); }
        input:focus { outline:none; border-color:#7F77DD !important; box-shadow:0 0 0 3px rgba(127,119,221,.12); }

        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes sheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }

        .ev-card { transition:transform .18s, box-shadow .18s; }
        .ev-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(26,26,46,.1) !important; }
        .fav-btn { transition:transform .15s; }
        .fav-btn:hover { transform:scale(1.2); }
        .scrollx::-webkit-scrollbar { display:none; }
        .scrollx { scrollbar-width:none; -webkit-overflow-scrolling:touch; }
        input[type=date]::-webkit-calendar-picker-indicator { cursor:pointer; opacity:.7; }

        /* Mobile filter drawer backdrop */
        .filter-backdrop {
          display:none;
          position:fixed; inset:0;
          background:rgba(0,0,0,.45);
          z-index:200;
        }
        .filter-backdrop.open { display:block; }

        /* Mobile filter sheet */
        .filter-sheet {
          position:fixed;
          bottom:0; left:0; right:0;
          background:#F5F5FA;
          border-radius:20px 20px 0 0;
          padding:0 16px 32px;
          z-index:201;
          max-height:88vh;
          overflow-y:auto;
          transform:translateY(100%);
          transition:transform .3s cubic-bezier(.4,0,.2,1);
        }
        .filter-sheet.open {
          transform:translateY(0);
          animation:sheetUp .3s cubic-bezier(.4,0,.2,1) both;
        }
        .filter-sheet-handle {
          width:36px; height:4px; background:#E0E0EA; border-radius:2px;
          margin:12px auto 16px;
        }

        /* Responsive layout */
        .explore-layout {
          display:grid;
          grid-template-columns:264px 1fr;
          gap:18px;
          align-items:start;
        }

        /* Desktop sidebar */
        .sidebar-desktop { display:block; }

        /* Mobile controls */
        .mobile-top-bar { display:none; }
        .mobile-filter-btn { display:none; }

        @media (max-width:900px) {
          .explore-layout { grid-template-columns:220px 1fr; gap:14px; }
        }

        @media (max-width:768px) {
          .explore-layout { grid-template-columns:1fr; }
          .sidebar-desktop { display:none; }
          .mobile-top-bar { display:flex; }
          .mobile-filter-btn { display:flex; }
        }

        /* Card grid responsive */
        .event-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(270px, 1fr));
          gap:14px;
        }
        @media (max-width:480px) {
          .event-grid { grid-template-columns:1fr; gap:10px; }
        }

        /* Header responsive */
        .page-header-row {
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
        }
        .header-controls {
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
        }

        /* Favs strip */
        .favs-strip {
          background:#fff;
          border:1px solid #E8E8F0;
          border-radius:14px;
          padding:14px 16px;
          margin-bottom:18px;
        }
        .fav-strip-item {
          flex-shrink:0;
          background:#F5F5FA;
          border:1px solid #E8E8F0;
          border-radius:10px;
          padding:9px 13px;
          display:flex;
          align-items:center;
          gap:9px;
          min-width:200px;
        }

        /* List row responsive */
        .event-row {
          background:#fff;
          border-radius:14px;
          border:1px solid #E8E8F0;
          padding:13px 16px;
          display:grid;
          grid-template-columns:52px 1fr auto;
          gap:13px;
          align-items:center;
        }
        @media (max-width:480px) {
          .event-row {
            grid-template-columns:44px 1fr;
            grid-template-rows:auto auto;
          }
          .event-row-actions {
            grid-column:1/-1;
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding-top:8px;
            border-top:1px solid #F0F0F8;
            margin-top:4px;
          }
        }
      `}</style>

      <div style={{ width:"100%", padding:"20px 16px 28px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:"18px", animation:"fadeUp .4s ease both" }}>
          <p style={{ fontSize:"12px", color:"#888780", marginBottom:"3px" }}>Discover what's happening across India</p>
          <div className="page-header-row">
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(20px,4vw,26px)", fontWeight:700, color:"#1A1A2E", letterSpacing:"-0.02em" }}>
              Explore Events
            </h1>
            <div className="header-controls">
              {/* Favs toggle */}
              <button onClick={() => setShowFavsOnly(!showFavsOnly)} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 12px", background: showFavsOnly?"#FCEBEB":"#fff", border:`1px solid ${showFavsOnly?"#F09595":"#E8E8F0"}`, borderRadius:"8px", fontSize:"12px", fontWeight:500, color: showFavsOnly?"#A32D2D":"#888780", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .15s", whiteSpace:"nowrap" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={showFavsOnly?"#E24B4A":"none"} stroke={showFavsOnly?"#E24B4A":"#888780"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                Saved {favorites.size > 0 && `(${favorites.size})`}
              </button>
              {/* View toggle */}
              <div style={{ display:"flex", background:"#fff", border:"1px solid #E8E8F0", borderRadius:"8px", overflow:"hidden" }}>
                {(["grid","list"] as const).map(v => (
                  <button key={v} onClick={() => setViewMode(v)} style={{ padding:"7px 11px", background: viewMode===v?"#1A1A2E":"transparent", border:"none", cursor:"pointer", color: viewMode===v?"#fff":"#888780", transition:"all .15s", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center" }}>
                    {v==="grid" ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    )}
                  </button>
                ))}
              </div>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} style={{ padding:"7px 10px", background:"#fff", border:"1px solid #E8E8F0", borderRadius:"8px", fontSize:"12px", color:"#1A1A2E", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                <option value="soonest">Soonest</option>
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Mobile: Category chips + Filter button row ── */}
        <div className="mobile-top-bar" style={{ alignItems:"center", gap:"10px", marginBottom:"14px" }}>
          {/* Filter button */}
          <button className="mobile-filter-btn" onClick={() => setFilterOpen(true)} style={{ display:"flex", alignItems:"center", gap:"7px", padding:"9px 14px", background:"#fff", border:"1px solid #E8E8F0", borderRadius:"10px", fontSize:"13px", fontWeight:500, color:"#1A1A2E", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", flexShrink:0, position:"relative", whiteSpace:"nowrap" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
            Filters
            {activeFilterCount > 0 && (
              <span style={{ position:"absolute", top:"-6px", right:"-6px", minWidth:"18px", height:"18px", background:"#7F77DD", borderRadius:"9px", fontSize:"10px", fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px" }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {/* Category chips scroll */}
          <div className="scrollx" style={{ display:"flex", gap:"6px", overflowX:"auto", flex:1 }}>
            {CATEGORIES.map(cat => {
              const cc = cat !== "All" ? CAT_COLORS[cat] : null;
              const isA = activeCat === cat;
              return (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding:"7px 13px", background: isA?(cc?cc.b:"#1A1A2E"):"#fff", border:`1px solid ${isA?(cc?cc.c:"#1A1A2E"):"#E8E8F0"}`, borderRadius:"20px", fontSize:"12px", fontWeight: isA?600:400, color: isA?(cc?cc.c:"#fff"):"#888780", cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Saved Events Strip ── */}
        {favList.length > 0 && (
          <div className="favs-strip" style={{ animation:"fadeUp .3s ease both" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"10px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#E24B4A" stroke="#E24B4A" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              <span style={{ fontSize:"13px", fontWeight:600, color:"#1A1A2E" }}>Your favourites</span>
              <span style={{ fontSize:"11px", color:"#888780" }}>{favList.length} saved</span>
            </div>
            <div className="scrollx" style={{ display:"flex", gap:"10px", overflowX:"auto" }}>
              {favList.map(e => (
                <div key={e.id} className="fav-strip-item">
                  <span style={{ fontSize:"20px" }}>{e.image}</span>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:"12px", fontWeight:600, color:"#1A1A2E", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"130px" }}>{e.title}</p>
                    <p style={{ fontSize:"11px", color:"#888780" }}>{e.dateDisplay} · {e.city}</p>
                  </div>
                  <button onClick={() => toggleFav(e.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"2px", flexShrink:0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Two-column layout (sidebar + events) ── */}
        <div className="explore-layout">

          {/* Desktop Sidebar */}
          <div className="sidebar-desktop" style={{ animation:"fadeUp .4s .1s ease both", opacity:0, animationFillMode:"forwards" }}>
            {/* Desktop category chips */}
            <div style={{ marginBottom:"12px" }}>
              <div className="scrollx" style={{ display:"flex", gap:"6px", overflowX:"auto", paddingBottom:"2px" }}>
                {CATEGORIES.map(cat => {
                  const cc = cat !== "All" ? CAT_COLORS[cat] : null;
                  const isA = activeCat === cat;
                  const count = cat === "All" ? ALL_EVENTS.length : ALL_EVENTS.filter(e => e.category === cat).length;
                  return (
                    <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding:"5px 13px", background: isA?(cc?cc.b:"#1A1A2E"):"#fff", border:`1px solid ${isA?(cc?cc.c:"#1A1A2E"):"#E8E8F0"}`, borderRadius:"20px", fontSize:"12px", fontWeight: isA?600:400, color: isA?(cc?cc.c:"#fff"):"#888780", cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif", flexShrink:0, transition:"all .15s" }}>
                      {cat} <span style={{ opacity:.6, fontSize:"10px" }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <FilterPanel {...filterProps} />
          </div>

          {/* Events Area */}
          <div style={{ animation:"fadeUp .4s .15s ease both", opacity:0, animationFillMode:"forwards", minWidth:0 }}>

            {/* Result count */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px", flexWrap:"wrap", gap:"6px" }}>
              <p style={{ fontSize:"13px", color:"#888780" }}>
                <strong style={{ color:"#1A1A2E" }}>{filtered.length}</strong> events
                {selState !== "All India" && <> in <strong style={{ color:"#7F77DD" }}>{selCity !== "All Cities" ? selCity : selDist !== "All Districts" ? selDist : selState}</strong></>}
              </p>
              {favorites.size > 0 && <span style={{ fontSize:"11px", color:"#E24B4A", fontWeight:500 }}>♥ {favorites.size} favourited</span>}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid #E8E8F0", padding:"48px 24px", textAlign:"center" }}>
                <div style={{ fontSize:"40px", marginBottom:"10px" }}>🔍</div>
                <p style={{ fontSize:"15px", fontWeight:600, color:"#1A1A2E", marginBottom:"6px" }}>No events found</p>
                <p style={{ fontSize:"13px", color:"#888780", marginBottom:"16px" }}>Try adjusting your filters or search</p>
                <button onClick={clearAll} style={{ padding:"8px 20px", background:"#7F77DD", border:"none", borderRadius:"8px", fontSize:"13px", fontWeight:500, color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Clear all filters</button>
              </div>
            )}

            {/* Grid view */}
            {viewMode === "grid" && filtered.length > 0 && (
              <div className="event-grid">
                {filtered.map((ev, i) => <EventCard key={ev.id} event={ev} isFav={favorites.has(ev.id)} onFav={toggleFav} delay={i * 0.04} />)}
              </div>
            )}

            {/* List view */}
            {viewMode === "list" && filtered.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {filtered.map((ev, i) => <EventRow key={ev.id} event={ev} isFav={favorites.has(ev.id)} onFav={toggleFav} delay={i * 0.03} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <div className={`filter-backdrop${filterOpen ? " open" : ""}`} onClick={() => setFilterOpen(false)} />
      <div className={`filter-sheet${filterOpen ? " open" : ""}`} aria-hidden={!filterOpen}>
        <div className="filter-sheet-handle" />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
          <span style={{ fontSize:"16px", fontWeight:600, color:"#1A1A2E", fontFamily:"'DM Sans',sans-serif" }}>Filters</span>
          <button onClick={() => setFilterOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", display:"flex", alignItems:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <FilterPanel {...filterProps} />
        <button onClick={() => setFilterOpen(false)} style={{ width:"100%", padding:"13px", background:"#7F77DD", border:"none", borderRadius:"12px", fontSize:"14px", fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginTop:"16px" }}>
          Show {filtered.length} events
        </button>
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event: e, isFav, onFav, delay }: { event:Event; isFav:boolean; onFav:(id:string)=>void; delay:number }) {
  const pct = e.max ? Math.round((e.joined / e.max) * 100) : 0;
  const bar = pct >= 90 ? "#E24B4A" : pct >= 70 ? "#BA7517" : "#1D9E75";
  const full = e.max !== null && e.joined >= e.max;

  return (
    <div className="ev-card" style={{ background:"#fff", borderRadius:"16px", border:"1px solid #E8E8F0", overflow:"hidden", boxShadow:"0 2px 8px rgba(26,26,46,.04)", animation:`fadeUp .4s ${delay}s ease both`, opacity:0, animationFillMode:"forwards" }}>
      <div style={{ height:"104px", background:e.categoryBg, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", position:"relative" }}>
        <span style={{ fontSize:"42px" }}>{e.image}</span>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"5px" }}>
          <button className="fav-btn" onClick={() => onFav(e.id)} style={{ width:"30px", height:"30px", borderRadius:"50%", background:"rgba(255,255,255,.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav?"#E24B4A":"none"} stroke={isFav?"#E24B4A":"#888780"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          {e.status === "live" && (
            <span style={{ fontSize:"10px", fontWeight:700, padding:"2px 7px", background:"#E1F5EE", color:"#085041", borderRadius:"20px", display:"flex", alignItems:"center", gap:"3px" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#1D9E75", animation:"pulse 1.5s infinite", display:"inline-block" }} />Live
            </span>
          )}
          {full && <span style={{ fontSize:"10px", fontWeight:700, padding:"2px 7px", background:"#FCEBEB", color:"#791F1F", borderRadius:"20px" }}>Full</span>}
        </div>
        <span style={{ position:"absolute", bottom:"8px", left:"12px", fontSize:"10px", fontWeight:600, padding:"2px 7px", borderRadius:"20px", background: e.type==="Free"?"#EAF3DE":"#FAEEDA", color: e.type==="Free"?"#27500A":"#633806" }}>
          {e.type==="Paid" ? `₹${e.price}` : "Free"}
        </span>
      </div>
      <div style={{ padding:"13px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"5px" }}>
          <span style={{ fontSize:"10px", fontWeight:600, padding:"2px 7px", borderRadius:"20px", background:e.categoryBg, color:e.categoryColor }}>{e.category}</span>
          <span style={{ fontSize:"11px", color:"#888780" }}>{e.dateDisplay}</span>
        </div>
        <h3 style={{ fontSize:"13px", fontWeight:600, color:"#1A1A2E", lineHeight:1.4, marginBottom:"7px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{e.title}</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:"3px", marginBottom:"9px" }}>
          <span style={{ fontSize:"11px", color:"#888780", display:"flex", alignItems:"center", gap:"4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {e.time}
          </span>
          <span style={{ fontSize:"11px", color:"#888780", display:"flex", alignItems:"center", gap:"4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {e.city}, {e.state}
          </span>
        </div>
        {e.max ? (
          <div style={{ marginBottom:"11px" }}>
            <div style={{ height:"3px", background:"#F0F0F8", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:bar, borderRadius:"2px" }} />
            </div>
            <span style={{ fontSize:"10px", color:"#B4B2A9", marginTop:"2px", display:"block" }}>{e.joined}/{e.max} joined</span>
          </div>
        ) : (
          <p style={{ fontSize:"10px", color:"#B4B2A9", marginBottom:"11px" }}>{e.joined} joined · Unlimited</p>
        )}
        <Link href={`/events/${e.id}`} style={{ display:"block", textAlign:"center", padding:"8px", background: full?"#F5F5FA":"#7F77DD", borderRadius:"8px", fontSize:"12px", fontWeight:600, color: full?"#B4B2A9":"#fff", textDecoration:"none" }}>
          {full ? "Event full" : "View event →"}
        </Link>
      </div>
    </div>
  );
}

// ─── Event Row ────────────────────────────────────────────────────────────────
function EventRow({ event: e, isFav, onFav, delay }: { event:Event; isFav:boolean; onFav:(id:string)=>void; delay:number }) {
  const pct = e.max ? Math.round((e.joined / e.max) * 100) : 0;
  const bar = pct >= 90 ? "#E24B4A" : pct >= 70 ? "#BA7517" : "#1D9E75";
  return (
    <div className="event-row" style={{ animation:`fadeUp .35s ${delay}s ease both`, opacity:0, animationFillMode:"forwards" }}>
      <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:e.categoryBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0, alignSelf:"start" }}>{e.image}</div>
      <div style={{ minWidth:0 }}>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"4px" }}>
          <span style={{ fontSize:"10px", fontWeight:600, padding:"2px 6px", borderRadius:"20px", background:e.categoryBg, color:e.categoryColor }}>{e.category}</span>
          <span style={{ fontSize:"10px", fontWeight:600, padding:"2px 6px", borderRadius:"20px", background: e.type==="Free"?"#EAF3DE":"#FAEEDA", color: e.type==="Free"?"#27500A":"#633806" }}>{e.type==="Paid"?`₹${e.price}`:"Free"}</span>
          {e.status==="live" && <span style={{ fontSize:"10px", fontWeight:700, padding:"2px 6px", background:"#E1F5EE", color:"#085041", borderRadius:"20px", display:"flex", alignItems:"center", gap:"3px" }}><span style={{ width:"5px",height:"5px",borderRadius:"50%",background:"#1D9E75",animation:"pulse 1.5s infinite",display:"inline-block" }}/>Live</span>}
        </div>
        <h3 style={{ fontSize:"13px", fontWeight:600, color:"#1A1A2E", marginBottom:"3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.title}</h3>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"11px", color:"#888780" }}>{e.dateDisplay} · {e.time}</span>
          <span style={{ fontSize:"11px", color:"#888780" }}>📍 {e.city}, {e.state}</span>
        </div>
        {e.max && (
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"5px", maxWidth:"260px" }}>
            <div style={{ flex:1, height:"3px", background:"#F0F0F8", borderRadius:"2px" }}>
              <div style={{ width:`${pct}%`, height:"100%", background:bar, borderRadius:"2px" }} />
            </div>
            <span style={{ fontSize:"10px", color:"#B4B2A9" }}>{e.joined}/{e.max}</span>
          </div>
        )}
      </div>
      {/* Desktop: actions column */}
      <div className="event-row-actions-desktop" style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"8px" }}>
        <button className="fav-btn" onClick={() => onFav(e.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"3px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isFav?"#E24B4A":"none"} stroke={isFav?"#E24B4A":"#B4B2A9"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
        <Link href={`/events/${e.id}`} style={{ padding:"6px 13px", background:"#7F77DD", borderRadius:"8px", fontSize:"12px", fontWeight:600, color:"#fff", textDecoration:"none", whiteSpace:"nowrap" }}>View →</Link>
      </div>
      {/* Mobile: actions row (shown via CSS grid span) */}
      <div className="event-row-actions" style={{ display:"none" }}>
        <button className="fav-btn" onClick={() => onFav(e.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"3px", display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color: isFav?"#E24B4A":"#888780", fontFamily:"'DM Sans',sans-serif" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav?"#E24B4A":"none"} stroke={isFav?"#E24B4A":"#888780"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          {isFav ? "Saved" : "Save"}
        </button>
        <Link href={`/events/${e.id}`} style={{ padding:"7px 16px", background:"#7F77DD", borderRadius:"8px", fontSize:"12px", fontWeight:600, color:"#fff", textDecoration:"none" }}>View →</Link>
      </div>
    </div>
  );
}