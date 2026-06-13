/* ─────────────────────────────────────────────────────────────
   EventHub360 — Employee Management System
   app.js  |  Author: Anany Pandit
   Sections:
     1. DATA          — employee records & seed RNG
     2. AUTH          — login / signup / session
     3. NAVIGATION    — page routing
     4. PAGE BUILDERS — overview, students, attendance, salary, analytics
     5. CHARTS        — Chart.js initialisation
     6. BOOT          — auto-login on page load
───────────────────────────────────────────────────────────── */

/* ══════════════════════════════════════════════════════════════
   1. DATA
══════════════════════════════════════════════════════════════ */
const DOMAINS  = ["AI / ML","Software Engineer","Human Resource","Data Analytics","Cybersecurity","Cloud Computing"];
const MODES    = ["Offline","Hybrid","Online"];
const CITIES   = ["Indore","Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai","Jaipur","Ahmedabad","Kolkata"];
const STATUSES = ["Present","Absent","Late","Leave"];

/** Simple deterministic seeded random – ensures same 40 employees every load */
const seed = (function () {
  let x = 42;
  return () => { x = (x * 1664525 + 1013904223) & 0xffffffff; return (x >>> 0) / 0xffffffff; };
})();
function srnd(a, b) { return Math.floor(seed() * (b - a + 1)) + a; }
function rnd(a, b)  { return Math.floor(Math.random() * (b - a + 1)) + a; }

const FIRST = ["Aarav","Aanya","Arjun","Priya","Rohan","Sneha","Vikram","Ishaan","Kavya","Rahul",
               "Ananya","Siddharth","Diya","Ayush","Meera","Karan","Pooja","Nikhil","Riya","Amit",
               "Shreya","Dev","Naina","Akash","Simran","Harsh","Aditi","Raj","Deepa","Varun",
               "Neha","Aditya","Swati","Manish","Pallavi","Suresh","Kritika","Tarun","Bhavya","Anany"];
const LAST  = ["Sharma","Patel","Singh","Kumar","Verma","Gupta","Shah","Mehta","Joshi","Agarwal",
               "Tiwari","Pandey","Rao","Nair","Mishra","Chaudhary","Srivastava","Das","Reddy","Pandit",
               "Saxena","Bhatt","Tripathi","Malhotra","Kapoor","Bajaj","Chauhan","Arora","Desai","Bose",
               "Iyer","Naidu","Pillai","Menon","Choudhury","Sengupta","Bhat","Hegde","Krishnan","Pandit"];

const EMPLOYEES = Array.from({ length: 40 }, (_, i) => {
  const base   = 30000 + srnd(0, 5) * 5000;
  const att    = srnd(70, 98);
  return {
    id:         i + 1,
    name:       `${FIRST[i]} ${LAST[i]}`,
    domain:     DOMAINS[srnd(0, 5)],
    mode:       MODES[srnd(0, 2)],
    city:       CITIES[srnd(0, 9)],
    status:     STATUSES[srnd(0, 3)],
    attendance: att,
    present:    Math.round(att * 0.24),
    absent:     rnd(1, 5),
    late:       rnd(1, 4),
    leave:      rnd(0, 3),
    baseSalary: base,
    bonus:      Math.round(att / 100 * base * 0.08),
    deduction:  rnd(500, 3000),
  };
});
EMPLOYEES[39].name = "Anany Pandit"; // always put author last

let chartInstances = {};

/* ══════════════════════════════════════════════════════════════
   2. AUTH
══════════════════════════════════════════════════════════════ */
function getUsers()   { try { return JSON.parse(localStorage.getItem('eh360_users')  || '[]');   } catch { return []; } }
function setUsers(u)  { localStorage.setItem('eh360_users',   JSON.stringify(u)); }
function setSession(u){ localStorage.setItem('eh360_session', JSON.stringify(u)); }
function getSession() { try { return JSON.parse(localStorage.getItem('eh360_session') || 'null'); } catch { return null; } }

function switchTab(t) {
  document.querySelectorAll('.auth-tab').forEach((el, i) =>
    el.classList.toggle('active', i === (t === 'login' ? 0 : 1)));
  document.getElementById('login-form').style.display  = t === 'login'  ? 'block' : 'none';
  document.getElementById('signup-form').style.display = t === 'signup' ? 'block' : 'none';
}

function togglePw(id, btn) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function checkStrength(el) {
  const v = el.value, f = document.getElementById('strength-fill');
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const cols = ['#EF4444', '#F59E0B', '#0D9488', '#14B8A6'];
  f.style.width      = (s * 25) + '%';
  f.style.background = cols[s - 1] || '#E2E8F0';
}

function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}
function showOk(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg; el.style.display = 'block';
}

function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value;
  if (!email || !pass) return showErr('login-err', 'Please fill in all fields.');
  const u = getUsers().find(x => x.email === email && x.password === pass);
  if (!u) return showErr('login-err', 'Invalid email or password.');
  setSession(u); launchApp(u);
}

function demoLogin() {
  const u = { firstName:'Admin', lastName:'Demo', email:'admin@eventhub360.com',
               domain:'AI / ML', role:'Admin', city:'Indore' };
  setSession(u); launchApp(u);
}

function doSignup() {
  const first   = document.getElementById('s-first').value.trim();
  const last    = document.getElementById('s-last').value.trim();
  const email   = document.getElementById('s-email').value.trim();
  const domain  = document.getElementById('s-domain').value;
  const role    = document.getElementById('s-role').value;
  const city    = document.getElementById('s-city').value;
  const pass    = document.getElementById('s-pass').value;
  const confirm = document.getElementById('s-confirm').value;
  if (!first || !last || !email || !domain || !role || !city || !pass)
    return showErr('signup-err', 'Please fill in all fields.');
  if (pass !== confirm) return showErr('signup-err', 'Passwords do not match.');
  if (pass.length < 8)  return showErr('signup-err', 'Password must be at least 8 characters.');
  const users = getUsers();
  if (users.find(x => x.email === email)) return showErr('signup-err', 'An account with this email already exists.');
  const u = { firstName:first, lastName:last, email, domain, role, city, password:pass };
  users.push(u); setUsers(users); setSession(u);
  showOk('signup-ok', 'Account created! Signing you in…');
  setTimeout(() => launchApp(u), 900);
}

function signOut() { localStorage.removeItem('eh360_session'); location.reload(); }

function launchApp(u) {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  document.getElementById('u-avatar').textContent = (u.firstName[0] + (u.lastName || '')[0] || '').toUpperCase();
  document.getElementById('u-name').textContent   = `${u.firstName} ${u.lastName || ''}`;
  document.getElementById('u-role').textContent   = `${u.role || 'User'} · ${u.domain || ''}`;
  document.getElementById('topbar-date').textContent =
    new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  toast(`Welcome back, ${u.firstName}! 👋`);
  renderPage('overview');
}

/* ── Toast notification ────────────────────────────────────── */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ══════════════════════════════════════════════════════════════
   3. NAVIGATION
══════════════════════════════════════════════════════════════ */
const pageTitles = {
  overview:   'Overview Dashboard',
  students:   'Student Directory',
  attendance: 'Attendance Register',
  salary:     'Salary Report',
  analytics:  'Analytics',
};

function goPage(page, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('page-title').textContent = pageTitles[page];
  renderPage(page);
}

function renderPage(page) {
  Object.values(chartInstances).forEach(c => { try { c.destroy(); } catch {} });
  chartInstances = {};
  const el = document.getElementById('page-content');
  const builders = {
    overview:   buildOverview,
    students:   buildStudents,
    attendance: buildAttendance,
    salary:     buildSalary,
    analytics:  buildAnalytics,
  };
  el.innerHTML = (builders[page] || buildOverview)();
  setTimeout(() => initCharts(page), 50);
  updateBadge(EMPLOYEES.length);
}

function updateBadge(n) {
  document.getElementById('topbar-badge').textContent = `${n} Employees`;
}

/* ══════════════════════════════════════════════════════════════
   4. PAGE BUILDERS
══════════════════════════════════════════════════════════════ */

/* ── Overview ─────────────────────────────────────────────── */
function buildOverview() {
  const total   = EMPLOYEES.length;
  const present = EMPLOYEES.filter(e => e.status === 'Present').length;
  const avgAtt  = Math.round(EMPLOYEES.reduce((s, e) => s + e.attendance, 0) / total);
  const avgSal  = Math.round(EMPLOYEES.reduce((s, e) => s + (e.baseSalary + e.bonus - e.deduction), 0) / total);
  return `
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Total Employees</div>
      <div class="kpi-val">${total}</div>
      <div class="kpi-sub">Across all domains</div>
    </div>
    <div class="kpi-card teal">
      <div class="kpi-label">Present Today</div>
      <div class="kpi-val">${present}</div>
      <div class="kpi-sub">${Math.round(present / total * 100)}% of workforce</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Avg Attendance</div>
      <div class="kpi-val">${avgAtt}%</div>
      <div class="kpi-sub">Organisation wide</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Avg Net Salary</div>
      <div class="kpi-val">₹${avgSal.toLocaleString()}</div>
      <div class="kpi-sub">Post deductions</div>
    </div>
  </div>
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-title">Domain Distribution</div>
      <div class="chart-wrap"><canvas id="c-domain"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Work Mode Split</div>
      <div class="chart-wrap"><canvas id="c-mode"></canvas></div>
    </div>
    <div class="chart-card full">
      <div class="chart-title">Attendance Overview (Organisation Total Days)</div>
      <div class="chart-wrap"><canvas id="c-attend-ov"></canvas></div>
    </div>
  </div>`;
}

/* ── Students ─────────────────────────────────────────────── */
const domainClass = {
  'AI / ML':'aiml', 'Software Engineer':'se', 'Human Resource':'hr',
  'Data Analytics':'da', 'Cybersecurity':'cyber', 'Cloud Computing':'cloud',
};
const modeClass   = { Offline:'offline', Hybrid:'hybrid', Online:'online' };
const statusClass = { Present:'present', Absent:'absent', Late:'late', Leave:'leave' };

function buildStudents() {
  const domOpts    = DOMAINS.map(d  => `<option>${d}</option>`).join('');
  const modeOpts   = MODES.map(m   => `<option>${m}</option>`).join('');
  const cityOpts   = CITIES.map(c  => `<option>${c}</option>`).join('');
  const statusOpts = STATUSES.map(s => `<option>${s}</option>`).join('');
  return `
  <div class="filters-bar">
    <span class="filter-label">🔍</span>
    <input  type="text" id="f-name"   placeholder="Search by name…"  oninput="filterStudents()">
    <select id="f-domain"  onchange="filterStudents()"><option value="">All Domains</option>${domOpts}</select>
    <select id="f-mode"    onchange="filterStudents()"><option value="">All Work Modes</option>${modeOpts}</select>
    <select id="f-city"    onchange="filterStudents()"><option value="">All Cities</option>${cityOpts}</select>
    <select id="f-status"  onchange="filterStudents()"><option value="">All Statuses</option>${statusOpts}</select>
    <button class="btn-reset" onclick="resetFilters()">Reset</button>
  </div>
  <div class="table-card"><div class="table-wrap"><table>
    <thead><tr>
      <th>#</th><th>Name</th><th>Domain</th><th>Work Mode</th><th>City</th><th>Attendance %</th><th>Status</th>
    </tr></thead>
    <tbody id="student-tbody">${studentRows(EMPLOYEES)}</tbody>
  </table></div></div>`;
}

function studentRows(emps) {
  return emps.map((e, i) => {
    const barColor = e.attendance > 85 ? 'var(--teal)' : e.attendance > 70 ? 'var(--amber)' : 'var(--red)';
    return `<tr>
      <td style="color:var(--silver);font-size:12px">${i + 1}</td>
      <td style="font-weight:600;color:var(--navy)">${e.name}</td>
      <td><span class="domain-badge ${domainClass[e.domain] || 'se'}">${e.domain}</span></td>
      <td><span class="mode-badge ${modeClass[e.mode]}">${e.mode}</span></td>
      <td>${e.city}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-bar" style="width:80px">
            <div class="progress-fill" style="width:${e.attendance}%;background:${barColor}"></div>
          </div>
          <span style="font-size:12px;font-weight:600">${e.attendance}%</span>
        </div>
      </td>
      <td><span class="status-badge ${statusClass[e.status]}">${e.status}</span></td>
    </tr>`;
  }).join('');
}

function filterStudents() {
  const name   = (document.getElementById('f-name')?.value   || '').toLowerCase();
  const domain = (document.getElementById('f-domain')?.value || '');
  const mode   = (document.getElementById('f-mode')?.value   || '');
  const city   = (document.getElementById('f-city')?.value   || '');
  const status = (document.getElementById('f-status')?.value || '');
  const filtered = EMPLOYEES.filter(e =>
    (!name   || e.name.toLowerCase().includes(name)) &&
    (!domain || e.domain === domain) &&
    (!mode   || e.mode   === mode)   &&
    (!city   || e.city   === city)   &&
    (!status || e.status === status)
  );
  document.getElementById('student-tbody').innerHTML = studentRows(filtered);
  updateBadge(filtered.length);
}

function resetFilters() {
  ['f-name','f-domain','f-mode','f-city','f-status'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  filterStudents();
}

/* ── Attendance ───────────────────────────────────────────── */
function buildAttendance() {
  const totP  = EMPLOYEES.reduce((s, e) => s + e.present, 0);
  const totA  = EMPLOYEES.reduce((s, e) => s + e.absent,  0);
  const totL  = EMPLOYEES.reduce((s, e) => s + e.late,    0);
  const totLv = EMPLOYEES.reduce((s, e) => s + e.leave,   0);
  const rows = EMPLOYEES.map(e => {
    const barColor = e.attendance > 85 ? 'var(--teal)' : e.attendance > 70 ? 'var(--amber)' : 'var(--red)';
    return `<tr>
      <td style="font-weight:600;color:var(--navy)">${e.name}</td>
      <td><span class="domain-badge ${domainClass[e.domain] || 'se'}" style="font-size:10px">${e.domain}</span></td>
      <td style="color:var(--teal);font-weight:600">${e.present}</td>
      <td style="color:var(--red);font-weight:600">${e.absent}</td>
      <td style="color:var(--amber);font-weight:600">${e.late}</td>
      <td style="color:var(--indigo);font-weight:600">${e.leave}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-bar" style="width:90px">
            <div class="progress-fill" style="width:${e.attendance}%;background:${barColor}"></div>
          </div>
          <span style="font-size:12px;font-weight:700">${e.attendance}%</span>
        </div>
      </td>
      <td><span class="status-badge ${statusClass[e.status]}">${e.status}</span></td>
    </tr>`;
  }).join('');
  return `
  <div class="attend-grid">
    <div class="attend-stat"><div class="a-val" style="color:var(--teal)">${totP}</div><div class="a-label">Total Present Days</div></div>
    <div class="attend-stat"><div class="a-val" style="color:var(--red)">${totA}</div><div class="a-label">Total Absent Days</div></div>
    <div class="attend-stat"><div class="a-val" style="color:var(--amber)">${totL}</div><div class="a-label">Total Late Days</div></div>
    <div class="attend-stat"><div class="a-val" style="color:var(--indigo)">${totLv}</div><div class="a-label">Total Leave Days</div></div>
  </div>
  <div class="table-card"><div class="table-wrap"><table>
    <thead><tr>
      <th>Name</th><th>Domain</th><th>Present</th><th>Absent</th><th>Late</th><th>Leave</th><th>Attendance %</th><th>Today</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div></div>`;
}

/* ── Salary ───────────────────────────────────────────────── */
function buildSalary() {
  const totalBase  = EMPLOYEES.reduce((s, e) => s + e.baseSalary, 0);
  const totalNet   = EMPLOYEES.reduce((s, e) => s + (e.baseSalary + e.bonus - e.deduction), 0);
  const totalBonus = EMPLOYEES.reduce((s, e) => s + e.bonus, 0);
  const rows = EMPLOYEES.map(e => {
    const net      = e.baseSalary + e.bonus - e.deduction;
    const barColor = e.attendance > 85 ? 'var(--teal)' : e.attendance > 70 ? 'var(--amber)' : 'var(--red)';
    return `<tr>
      <td style="font-weight:600;color:var(--navy)">${e.name}</td>
      <td><span class="domain-badge ${domainClass[e.domain] || 'se'}" style="font-size:10px">${e.domain}</span></td>
      <td>₹${e.baseSalary.toLocaleString()}</td>
      <td style="color:var(--teal);font-weight:600">+₹${e.bonus.toLocaleString()}</td>
      <td style="color:var(--red);font-weight:600">−₹${e.deduction.toLocaleString()}</td>
      <td style="font-weight:700;color:var(--navy)">₹${net.toLocaleString()}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="progress-bar" style="width:60px">
            <div class="progress-fill" style="width:${e.attendance}%;background:${barColor}"></div>
          </div>
          <span style="font-size:12px">${e.attendance}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');
  return `
  <div class="salary-summary">
    <div class="sal-card"><div class="s-label">Total Base Payroll</div><div class="s-val" style="color:var(--navy)">₹${(totalBase/100000).toFixed(1)}L</div></div>
    <div class="sal-card"><div class="s-label">Total Bonuses</div><div class="s-val" style="color:var(--teal)">₹${(totalBonus/100000).toFixed(1)}L</div></div>
    <div class="sal-card"><div class="s-label">Total Net Payroll</div><div class="s-val" style="color:var(--navy)">₹${(totalNet/100000).toFixed(1)}L</div></div>
  </div>
  <div class="table-card"><div class="table-wrap"><table>
    <thead><tr>
      <th>Name</th><th>Domain</th><th>Base Salary</th><th>Att. Bonus</th><th>Deductions</th><th>Net Pay</th><th>Att. %</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table></div></div>`;
}

/* ── Analytics ────────────────────────────────────────────── */
function buildAnalytics() {
  return `
  <div class="charts-grid">
    <div class="chart-card">
      <div class="chart-title">Domain Distribution</div>
      <div class="chart-wrap"><canvas id="c-domain"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Work Mode Breakdown</div>
      <div class="chart-wrap"><canvas id="c-mode"></canvas></div>
    </div>
    <div class="chart-card full">
      <div class="chart-title">Attendance Overview (Total Days)</div>
      <div class="chart-wrap tall"><canvas id="c-attend-ov"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Average Net Salary by Domain</div>
      <div class="chart-wrap tall"><canvas id="c-salary-domain"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Employees by City</div>
      <div class="chart-wrap tall"><canvas id="c-city"></canvas></div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════════════
   5. CHARTS  (Chart.js 4)
══════════════════════════════════════════════════════════════ */
const PALETTE = ['#0D9488','#14B8A6','#0F766E','#5EEAD4','#0891B2','#0284C7'];

function mkChart(id, type, data, opts) {
  const el = document.getElementById(id); if (!el) return;
  chartInstances[id] = new Chart(el.getContext('2d'), {
    type, data,
    options: { responsive:true, maintainAspectRatio:false, ...opts },
  });
}

function initCharts(page) {
  /* Domain */
  const domainCounts = {};
  DOMAINS.forEach(d => { domainCounts[d] = EMPLOYEES.filter(e => e.domain === d).length; });
  if (document.getElementById('c-domain')) {
    mkChart('c-domain',
      (page === 'overview' || page === 'analytics') ? 'doughnut' : 'bar',
      { labels: Object.keys(domainCounts),
        datasets: [{ data: Object.values(domainCounts), backgroundColor: PALETTE, borderWidth: 0 }] },
      { plugins: { legend: { position:'bottom', labels:{ font:{size:11}, padding:12 } } } }
    );
  }

  /* Work Mode */
  if (document.getElementById('c-mode')) {
    const modeCounts = {};
    MODES.forEach(m => { modeCounts[m] = EMPLOYEES.filter(e => e.mode === m).length; });
    mkChart('c-mode', 'doughnut',
      { labels: Object.keys(modeCounts),
        datasets: [{ data: Object.values(modeCounts),
          backgroundColor: ['#475569','#F59E0B','#0D9488'], borderWidth: 0 }] },
      { plugins: { legend: { position:'bottom', labels:{ font:{size:11}, padding:12 } } } }
    );
  }

  /* Attendance Overview */
  if (document.getElementById('c-attend-ov')) {
    const totP  = EMPLOYEES.reduce((s,e)=>s+e.present,0);
    const totA  = EMPLOYEES.reduce((s,e)=>s+e.absent, 0);
    const totL  = EMPLOYEES.reduce((s,e)=>s+e.late,   0);
    const totLv = EMPLOYEES.reduce((s,e)=>s+e.leave,  0);
    mkChart('c-attend-ov', 'bar',
      { labels:['Present','Absent','Late','Leave'],
        datasets:[{ data:[totP,totA,totL,totLv],
          backgroundColor:['#0D9488','#EF4444','#F59E0B','#6366F1'],
          borderRadius:6, borderWidth:0 }] },
      { plugins:{legend:{display:false}},
        scales:{
          y:{ grid:{color:'#F1F5F9'}, ticks:{color:'#94A3B8'} },
          x:{ grid:{display:false},  ticks:{color:'#94A3B8'} } } }
    );
  }

  /* Salary by Domain */
  if (document.getElementById('c-salary-domain')) {
    const salByDomain = {};
    DOMAINS.forEach(d => {
      const emps = EMPLOYEES.filter(e => e.domain === d);
      salByDomain[d] = emps.length
        ? Math.round(emps.reduce((s,e) => s + (e.baseSalary+e.bonus-e.deduction), 0) / emps.length)
        : 0;
    });
    mkChart('c-salary-domain', 'bar',
      { labels: Object.keys(salByDomain),
        datasets:[{ data:Object.values(salByDomain), backgroundColor:PALETTE, borderRadius:6, borderWidth:0 }] },
      { indexAxis:'y',
        plugins:{legend:{display:false}},
        scales:{
          x:{ grid:{color:'#F1F5F9'}, ticks:{color:'#94A3B8', callback:v=>'₹'+v.toLocaleString()} },
          y:{ grid:{display:false},   ticks:{color:'#94A3B8', font:{size:11}} } } }
    );
  }

  /* Employees by City */
  if (document.getElementById('c-city')) {
    const cityCounts = {};
    CITIES.forEach(c => { cityCounts[c] = EMPLOYEES.filter(e => e.city === c).length; });
    mkChart('c-city', 'bar',
      { labels: Object.keys(cityCounts),
        datasets:[{ data:Object.values(cityCounts), backgroundColor:'#0D9488', borderRadius:6, borderWidth:0 }] },
      { plugins:{legend:{display:false}},
        scales:{
          y:{ grid:{color:'#F1F5F9'}, ticks:{color:'#94A3B8'} },
          x:{ grid:{display:false},   ticks:{color:'#94A3B8', font:{size:11}} } } }
    );
  }
}

/* ══════════════════════════════════════════════════════════════
   6. BOOT
══════════════════════════════════════════════════════════════ */
(function () {
  const s = getSession();
  if (s) launchApp(s);
})();
