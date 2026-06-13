const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Anany Pandit";
pres.title = "EventHub360 – Employee Management System";

// ─── PALETTE ───────────────────────────────────────────────────
const C = {
  navy:    "0F2044",   // dominant dark
  teal:    "0D9488",   // accent / charts
  tealLt:  "14B8A6",
  mint:    "CCFBF1",
  white:   "FFFFFF",
  offWhite:"F0FDFA",
  slate:   "475569",
  silver:  "94A3B8",
  card:    "F8FAFC",
};

const makeShadow = () => ({ type:"outer", color:"000000", blur:8, offset:3, angle:45, opacity:0.12 });

// ═══════════════════════════════════════════════════════════════
// SLIDE 1 – TITLE SLIDE
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Large teal circle motif (background decoration)
  s.addShape(pres.shapes.OVAL, { x:6.8, y:-0.8, w:4.5, h:4.5, fill:{ color:C.teal, transparency:82 }, line:{ color:C.teal, transparency:82 } });
  s.addShape(pres.shapes.OVAL, { x:8.0, y:2.8, w:2.8, h:2.8, fill:{ color:C.tealLt, transparency:88 }, line:{ color:C.tealLt, transparency:88 } });

  // Eyebrow label
  s.addText("EVENTHUB360", { x:0.55, y:1.1, w:5, h:0.35, fontSize:10, fontFace:"Calibri", color:C.teal, bold:true, charSpacing:5, margin:0 });

  // Main title
  s.addText("Employee Management\nSystem", { x:0.55, y:1.55, w:7.5, h:1.8, fontSize:46, fontFace:"Cambria", color:C.white, bold:true, valign:"top", margin:0 });

  // Subtitle
  s.addText("Analytics Dashboard  ·  Attendance  ·  Salary Reports  ·  Domain Insights", {
    x:0.55, y:3.45, w:8.5, h:0.4, fontSize:12, fontFace:"Calibri", color:C.silver, margin:0
  });

  // Bottom bar info
  s.addText("Anany Pandit   |   June 2025", { x:0.55, y:4.9, w:4, h:0.4, fontSize:10, fontFace:"Calibri", color:C.silver, margin:0 });
  s.addText("github.com/Anany2006/eventhub360", { x:6.0, y:4.9, w:3.8, h:0.4, fontSize:10, fontFace:"Calibri", color:C.teal, align:"right", margin:0 });

  s.addNotes("Welcome. This presentation covers the full EventHub360 EMS: what it does, how it's structured, and what insights the analytics dashboard surfaces.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 2 – PROJECT OVERVIEW
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addText("Project Overview", { x:0.5, y:0.28, w:9, h:0.55, fontSize:30, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });

  // Three feature cards
  const cards = [
    { icon:"🧑‍💼", title:"Who it's for", body:"HR managers and team leads at tech organisations managing multi-domain workforces across Offline, Hybrid, and Remote modes." },
    { icon:"📊", title:"What it delivers", body:"A single dashboard for headcount, attendance registers, salary sheets, and 5 real-time analytical charts — no backend required." },
    { icon:"🔍", title:"Key differentiator", body:"Granular filtering by Domain (AI/ML, SE, HR, Data Analytics, Cybersecurity, Cloud) combined with attendance-linked salary deductions." },
  ];

  cards.forEach((c, i) => {
    const x = 0.38 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:1.1, w:2.85, h:3.85, fill:{ color:C.white }, rectRadius:0.1, shadow: makeShadow() });
    s.addText(c.icon,  { x, y:1.2,  w:2.85, h:0.7,  fontSize:28, align:"center", margin:0 });
    s.addText(c.title, { x:x+0.15, y:2.0, w:2.55, h:0.45, fontSize:13, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });
    s.addText(c.body,  { x:x+0.15, y:2.5, w:2.55, h:2.2, fontSize:10.5, fontFace:"Calibri", color:C.slate, margin:0 });
  });

  s.addNotes("Three pillars: audience, core value, and what sets this apart from a generic HRMS.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 3 – SYSTEM ARCHITECTURE
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("System Architecture", { x:0.5, y:0.28, w:9, h:0.55, fontSize:30, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });
  s.addText("Fully self-contained single-file HTML application — zero backend, zero dependencies", {
    x:0.5, y:0.88, w:9, h:0.35, fontSize:11, fontFace:"Calibri", color:C.silver, margin:0
  });

  // Architecture boxes
  const layers = [
    { label:"UI Layer", color:C.teal,   items:["Login / Signup (localStorage auth)", "5-page sidebar navigation", "Live search & 4-axis filters"] },
    { label:"Data Layer", color:"1E3A8A", items:["40 sample employees (inline JSON)", "Attendance records (Present/Absent/Late/Leave)", "Salary sheet with bonus & deductions"] },
    { label:"Analytics", color:"7C3AED", items:["Chart.js — 5 interactive charts", "Domain doughnut  ·  Work-mode pie", "City bar  ·  Salary bar  ·  Attendance trend"] },
  ];

  layers.forEach((l, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:1.5, w:2.9, h:0.45, fill:{ color:l.color }, rectRadius:0.08 });
    s.addText(l.label, { x, y:1.52, w:2.9, h:0.42, fontSize:13, fontFace:"Cambria", color:C.white, bold:true, align:"center", margin:0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y:2.05, w:2.9, h:3.0, fill:{ color:C.offWhite }, rectRadius:0.08, shadow: makeShadow() });
    s.addText(l.items.map((item, idx) => ({
      text: item,
      options: { bullet:true, breakLine: idx < l.items.length-1 }
    })), { x:x+0.15, y:2.2, w:2.6, h:2.7, fontSize:10.5, fontFace:"Calibri", color:C.slate, margin:0 });
  });

  s.addNotes("Everything runs in one HTML file. Auth state persists via localStorage; charts are rendered with Chart.js included via CDN.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 4 – FEATURES: DASHBOARD & STUDENTS
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addText("Core Features", { x:0.5, y:0.28, w:9, h:0.55, fontSize:30, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });

  // Left panel – Overview
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:1.0, w:4.3, h:4.35, fill:{ color:C.white }, rectRadius:0.1, shadow: makeShadow() });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:1.0, w:4.3, h:0.55, fill:{ color:C.navy }, rectRadius:0.1 });
  s.addText("📋  Overview Dashboard", { x:0.5, y:1.03, w:4.1, h:0.48, fontSize:13, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
  s.addText([
    { text:"4 KPI cards — Total, Present Today, Avg Attendance %, Avg Salary", options:{ bullet:true, breakLine:true } },
    { text:"Real-time stat cards update when filters change", options:{ bullet:true, breakLine:true } },
    { text:"3 summary mini-charts embedded in the overview page", options:{ bullet:true, breakLine:true } },
    { text:"Responsive grid layout scales to window size", options:{ bullet:true } },
  ], { x:0.55, y:1.7, w:4.0, h:3.5, fontSize:11, fontFace:"Calibri", color:C.slate, margin:0 });

  // Right panel – Students
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.3, y:1.0, w:4.3, h:4.35, fill:{ color:C.white }, rectRadius:0.1, shadow: makeShadow() });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.3, y:1.0, w:4.3, h:0.55, fill:{ color:C.teal }, rectRadius:0.1 });
  s.addText("🎓  Student Directory", { x:5.4, y:1.03, w:4.1, h:0.48, fontSize:13, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
  s.addText([
    { text:"40 employee records with Name, Domain, City, Work Mode", options:{ bullet:true, breakLine:true } },
    { text:"Live search by name (instant, keystroke-by-keystroke)", options:{ bullet:true, breakLine:true } },
    { text:"Dropdown filters: Domain · Work Mode · City · Status", options:{ bullet:true, breakLine:true } },
    { text:"Colour-coded domain badges and status chips", options:{ bullet:true } },
  ], { x:5.45, y:1.7, w:4.0, h:3.5, fontSize:11, fontFace:"Calibri", color:C.slate, margin:0 });

  s.addNotes("Two of the five pages: the command-centre overview and the searchable employee directory.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 5 – ATTENDANCE & SALARY
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Attendance & Salary Modules", { x:0.5, y:0.28, w:9, h:0.55, fontSize:30, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });

  // Attendance box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:1.05, w:4.3, h:4.35, fill:{ color:C.offWhite }, rectRadius:0.1, shadow: makeShadow() });
  s.addText("🗓  Attendance Register", { x:0.55, y:1.18, w:4.0, h:0.42, fontSize:14, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });

  const statuses = [
    { label:"Present", color:C.teal },
    { label:"Absent",  color:"EF4444" },
    { label:"Late",    color:"F59E0B" },
    { label:"Leave",   color:"6366F1" },
  ];
  statuses.forEach((st, i) => {
    const y = 1.78 + i * 0.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.55, y, w:0.85, h:0.38, fill:{ color:st.color }, rectRadius:0.06 });
    s.addText(st.label, { x:0.55, y:y+0.01, w:0.85, h:0.36, fontSize:10, fontFace:"Calibri", color:C.white, bold:true, align:"center", margin:0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:1.55, y:y+0.05, w:2.9, h:0.25, fill:{ color:"E2E8F0" }, rectRadius:0.04 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:1.55, y:y+0.05, w:i===0?2.1:i===1?0.7:i===2?1.3:0.9, h:0.25, fill:{ color:st.color }, rectRadius:0.04 });
  });
  s.addText("Progress bars per employee · Sortable by status", {
    x:0.55, y:4.22, w:4.0, h:0.5, fontSize:10, fontFace:"Calibri", color:C.silver, italic:true, margin:0
  });

  // Salary box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.3, y:1.05, w:4.3, h:4.35, fill:{ color:C.offWhite }, rectRadius:0.1, shadow: makeShadow() });
  s.addText("💰  Salary Report", { x:5.45, y:1.18, w:4.0, h:0.42, fontSize:14, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });

  const salaryItems = [
    { label:"Base Salary",         value:"+₹45,000" },
    { label:"Attendance Bonus",    value:"+₹3,200" },
    { label:"Leave Deductions",    value:"−₹1,500" },
    { label:"Net Pay",             value:"₹46,700" },
  ];
  salaryItems.forEach((row, i) => {
    const y = 1.78 + i * 0.62;
    const isNet = i === 3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:5.4, y, w:4.0, h:0.5, fill:{ color: isNet ? C.navy : C.white }, rectRadius:0.07, shadow: isNet ? undefined : makeShadow() });
    s.addText(row.label, { x:5.55, y:y+0.08, w:2.5, h:0.35, fontSize:11, fontFace:"Calibri", color: isNet ? C.white : C.slate, margin:0 });
    s.addText(row.value, { x:7.8,  y:y+0.08, w:1.4, h:0.35, fontSize:11, fontFace:"Calibri", color: isNet ? C.teal : C.navy, bold:true, align:"right", margin:0 });
  });
  s.addText("Base + Bonus − Deductions formula per employee", {
    x:5.45, y:4.22, w:4.0, h:0.5, fontSize:10, fontFace:"Calibri", color:C.silver, italic:true, margin:0
  });

  s.addNotes("Attendance is tracked across four states. Salary automatically computes net pay using the formula: base + attendance bonus − leave deductions.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 6 – ANALYTICS: 5 CHARTS
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("Analytics: 5 Interactive Charts", { x:0.5, y:0.22, w:9, h:0.52, fontSize:28, fontFace:"Cambria", color:C.white, bold:true, margin:0 });

  const charts = [
    { n:"01", title:"Domain Distribution", desc:"Doughnut showing AI/ML, SE, HR, Data Analytics, Cybersecurity, Cloud headcount" },
    { n:"02", title:"Work Mode Breakdown", desc:"Pie — Offline / Hybrid / Online split across the workforce" },
    { n:"03", title:"Attendance Overview", desc:"Grouped bar — total Present, Absent, Late, Leave days organisation-wide" },
    { n:"04", title:"Salary by Domain",    desc:"Horizontal bar — average net salary per domain/branch" },
    { n:"05", title:"Students by City",    desc:"Column bar — city-wise employee count across 10 locations" },
  ];

  charts.forEach((c, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const x = 0.4 + col * 4.85;
    const y = 1.0 + row * 1.45;
    const w = i === 4 ? 9.2 : 4.6;  // last card spans full width

    if (i === 4) {
      // Full-width last card
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:5.62, w:9.2, h:0.55, fill:{ color:"FFFFFF", transparency:12 }, rectRadius:0.07 });
      s.addText(`${c.n}`, { x:0.55, y:5.64, w:0.45, h:0.38, fontSize:10, fontFace:"Calibri", color:C.teal, bold:true, margin:0 });
      s.addText(`${c.title}  —  ${c.desc}`, { x:1.05, y:5.64, w:8.2, h:0.38, fontSize:10, fontFace:"Calibri", color:C.white, margin:0 });
    } else {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:4.6, h:1.3, fill:{ color:"FFFFFF", transparency:90 }, rectRadius:0.09 });
      s.addText(c.n, { x:x+0.15, y:y+0.12, w:0.55, h:0.38, fontSize:12, fontFace:"Cambria", color:C.teal, bold:true, margin:0 });
      s.addText(c.title, { x:x+0.75, y:y+0.1, w:3.65, h:0.38, fontSize:12, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
      s.addText(c.desc,  { x:x+0.75, y:y+0.52, w:3.65, h:0.65, fontSize:9.5, fontFace:"Calibri", color:C.silver, margin:0 });
    }
  });

  s.addNotes("All five charts are rendered with Chart.js and are interactive — hover for tooltips, click legend to toggle series.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 7 – CHART DATA SAMPLES (actual pptxgenjs charts)
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addText("Data Visualisation Samples", { x:0.5, y:0.18, w:9, h:0.5, fontSize:28, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });

  // Domain bar chart (left)
  s.addChart(pres.charts.BAR, [{
    name: "Employees",
    labels: ["AI/ML", "Software Eng", "HR", "Data Analytics", "Cybersec", "Cloud"],
    values: [12, 10, 6, 7, 3, 2]
  }], {
    x:0.4, y:0.82, w:4.6, h:2.6, barDir:"col",
    chartColors: ["0D9488","14B8A6","0F766E","5EEAD4","0891B2","0284C7"],
    chartArea: { fill:{ color:C.white }, roundedCorners:true },
    catAxisLabelColor: "64748B", valAxisLabelColor: "64748B",
    valGridLine: { color:"E2E8F0", size:0.5 }, catGridLine:{ style:"none" },
    showValue:true, dataLabelColor:"1E293B", showLegend:false,
    showTitle:true, title:"Employees by Domain",
  });

  // Attendance pie (right)
  s.addChart(pres.charts.DOUGHNUT, [{
    name: "Attendance",
    labels: ["Present", "Absent", "Late", "Leave"],
    values: [68, 12, 11, 9]
  }], {
    x:5.1, y:0.82, w:4.6, h:2.6,
    chartColors: ["0D9488","EF4444","F59E0B","6366F1"],
    chartArea: { fill:{ color:C.white }, roundedCorners:true },
    showPercent:true, showLegend:true, legendPos:"b",
    showTitle:true, title:"Attendance Split (%)",
  });

  // City bar (full width, bottom)
  s.addChart(pres.charts.BAR, [{
    name: "Employees",
    labels: ["Indore","Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai","Jaipur","Ahmedabad","Kolkata"],
    values: [8, 7, 6, 6, 5, 4, 4, 3, 3, 2]
  }], {
    x:0.4, y:3.6, w:9.2, h:1.8, barDir:"col",
    chartColors: ["0D9488"],
    chartArea: { fill:{ color:C.white }, roundedCorners:true },
    catAxisLabelColor:"64748B", valAxisLabelColor:"64748B",
    valGridLine:{ color:"E2E8F0", size:0.5 }, catGridLine:{ style:"none" },
    showValue:true, dataLabelColor:"1E293B", showLegend:false,
    showTitle:true, title:"Employees by City",
  });

  s.addNotes("These are the actual data values from the 40-employee sample dataset embedded in the dashboard.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 8 – AUTH & SECURITY
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Login & Account System", { x:0.5, y:0.28, w:9, h:0.55, fontSize:30, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });

  const feats = [
    { emoji:"🔐", head:"Sign In",        body:"Email + password with validation. Persistent session via localStorage. Wrong-credentials error message." },
    { emoji:"📝", head:"Sign Up",         body:"First/last name, email, domain, role (Admin/Manager/Student), city. Live password-strength bar. Confirm-password mismatch check." },
    { emoji:"⚡", head:"Demo Login",      body:"One-click admin entry — skips registration for quick evaluation. Welcome toast on login." },
    { emoji:"👤", head:"User Identity",   body:"Sidebar shows name, initials avatar, role, and domain. Sign Out clears session and returns to login screen." },
  ];

  feats.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 1.05 + row * 2.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:4.6, h:1.95, fill:{ color:C.offWhite }, rectRadius:0.1, shadow: makeShadow() });
    s.addText(f.emoji, { x:x+0.2, y:y+0.18, w:0.7, h:0.6, fontSize:22, align:"center", margin:0 });
    s.addText(f.head,  { x:x+0.95, y:y+0.18, w:3.45, h:0.42, fontSize:13, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });
    s.addText(f.body,  { x:x+0.95, y:y+0.65, w:3.45, h:1.15, fontSize:10.5, fontFace:"Calibri", color:C.slate, margin:0 });
  });

  s.addNotes("Auth is client-side only, suitable for demos and internal tools. Production deployment would replace localStorage with a real auth backend.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 9 – FILTER SYSTEM
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };

  s.addText("Multi-Axis Filter System", { x:0.5, y:0.28, w:9, h:0.55, fontSize:30, fontFace:"Cambria", color:C.navy, bold:true, margin:0 });
  s.addText("Every filter updates the table AND the charts simultaneously", {
    x:0.5, y:0.87, w:9, h:0.3, fontSize:11, fontFace:"Calibri", color:C.silver, margin:0
  });

  const filters = [
    { label:"Domain", color:C.teal,   opts:["AI / ML", "Software Engineer", "Human Resource", "Data Analytics", "Cybersecurity", "Cloud Computing"] },
    { label:"Work Mode", color:"7C3AED", opts:["Offline", "Hybrid", "Online"] },
    { label:"City",    color:"0891B2", opts:["Indore", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Jaipur"] },
    { label:"Status",  color:"F59E0B", opts:["Present", "Absent", "Late", "Leave"] },
  ];

  filters.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 1.3 + row * 2.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:4.6, h:1.9, fill:{ color:C.white }, rectRadius:0.1, shadow: makeShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:4.6, h:0.45, fill:{ color:f.color }, rectRadius:0.1 });
    s.addText(f.label, { x:x+0.15, y:y+0.05, w:4.3, h:0.35, fontSize:12, fontFace:"Cambria", color:C.white, bold:true, margin:0 });
    const chips = f.opts.join("  ·  ");
    s.addText(chips,   { x:x+0.15, y:y+0.58, w:4.3, h:1.15, fontSize:10, fontFace:"Calibri", color:C.slate, margin:0 });
  });

  // Search bar illustration
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y:5.27, w:9.2, h:0.42, fill:{ color:C.white }, rectRadius:0.1, shadow: makeShadow() });
  s.addText("🔍  Name Search — live, keystroke-by-keystroke across all 40 employees", {
    x:0.6, y:5.3, w:8.8, h:0.35, fontSize:11, fontFace:"Calibri", color:C.slate, margin:0
  });

  s.addNotes("Five independent filter axes that work in combination. Any subset of filters can be active simultaneously.");
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 10 – TECH STACK & THANK YOU
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.OVAL, { x:-0.5, y:3.2, w:4, h:4, fill:{ color:C.teal, transparency:88 }, line:{ color:C.teal, transparency:88 } });

  s.addText("Tech Stack", { x:0.5, y:0.3, w:9, h:0.48, fontSize:28, fontFace:"Cambria", color:C.white, bold:true, margin:0 });

  const tech = [
    { label:"HTML5 / CSS3", note:"Single-file architecture, responsive Flexbox/Grid layout" },
    { label:"Vanilla JS",   note:"No framework — pure ES6, zero build step, runs offline" },
    { label:"Chart.js",     note:"5 chart types via CDN; interactive tooltips & legend toggles" },
    { label:"localStorage", note:"Persistent auth state, signed-up accounts survive page refresh" },
    { label:"GitHub",       note:"Source: github.com/Anany2006/eventhub360" },
  ];

  tech.forEach((t, i) => {
    const y = 0.95 + i * 0.82;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.4, y, w:9.2, h:0.68, fill:{ color:"FFFFFF", transparency:92 }, rectRadius:0.08 });
    s.addText(t.label, { x:0.6, y:y+0.12, w:2.5, h:0.42, fontSize:12, fontFace:"Cambria", color:C.teal, bold:true, margin:0 });
    s.addText(t.note,  { x:3.3, y:y+0.12, w:6.0, h:0.42, fontSize:11, fontFace:"Calibri", color:C.white, margin:0 });
  });

  // Thank you section
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:2.0, y:5.07, w:6.0, h:0.52, fill:{ color:C.teal, transparency:25 }, rectRadius:0.1 });
  s.addText("Thank you  ·  Questions welcome  ·  github.com/Anany2006/eventhub360", {
    x:2.0, y:5.1, w:6.0, h:0.45, fontSize:11, fontFace:"Calibri", color:C.white, align:"center", bold:true, margin:0
  });

  s.addNotes("No build tools, no npm install needed on the client side — just download the HTML file and open it in any browser.");
}

// ─── WRITE FILE ────────────────────────────────────────────────
pres.writeFile({ fileName: "/mnt/user-data/outputs/EventHub360_EMS_Presentation.pptx" })
  .then(() => console.log("✅ PPTX written"))
  .catch(e => console.error("❌", e));
