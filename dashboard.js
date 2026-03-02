/* ═══════════════════════════════════════════════════════════
   PATHWAYAI — TEACHER DASHBOARD
   Full implementation: Dashboard · Students · Live Session
   Analytics · Messages — all sections fully enabled
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Constants ──────────────────────────────────────────────
const SESSION_KEY  = 'pathwayai_session';
const STUDENTS_KEY = 'pathwayai_students';
const MSGS_KEY     = 'pathwayai_messages';

// ── Session Guard ──────────────────────────────────────────
let session;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e) { session = null; }
if (!session || session.role !== 'teacher') { window.location.href = 'index.html'; }

const teacherName     = session.name  || 'Teacher';
const teacherEmail    = session.email || 'teacher@demo.com';
const teacherInitials = teacherName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

// ── Default Student Data ───────────────────────────────────
const DEFAULT_STUDENTS = [
  { id:'s1', name:'Aarav Sharma', email:'aarav@school.edu', grade:'A',  score:88, attendance:92,
    subjects:{Math:90,Science:85,English:88,History:89},
    alerts:[], activity:['Submitted Math HW','Scored 90 on quiz','Attended all classes'], weak:['None'] },
  { id:'s2', name:'Priya Nair', email:'priya@school.edu', grade:'C', score:54, attendance:61,
    subjects:{Math:42,Science:58,English:67,History:49},
    alerts:['Low attendance','Failing Math'], activity:['Missed 3 classes','Failed Math quiz (32%)','No HW submission'], weak:['Math','History','Attendance'] },
  { id:'s3', name:'Rohan Mehta', email:'rohan@school.edu', grade:'B', score:72, attendance:85,
    subjects:{Math:70,Science:75,English:68,History:75},
    alerts:[], activity:['Submitted Science project','Scored 75 on test','Active in class'], weak:['English'] },
  { id:'s4', name:'Sneha Iyer', email:'sneha@school.edu', grade:'D', score:41, attendance:55,
    subjects:{Math:38,Science:40,English:48,History:38},
    alerts:['Critical performance','Very low attendance','Multiple failures'], activity:['Missed 7 days','Failed 3 subjects','No participation'], weak:['Math','Science','History'] },
  { id:'s5', name:'Kiran Patel', email:'kiran@school.edu', grade:'A+', score:96, attendance:98,
    subjects:{Math:98,Science:95,English:97,History:94},
    alerts:[], activity:['Top of class','Extra credit submitted','Helped peers'], weak:['None'] },
  { id:'s6', name:'Meera Joshi', email:'meera@school.edu', grade:'C', score:58, attendance:74,
    subjects:{Math:55,Science:60,English:63,History:54},
    alerts:['Declining trend'], activity:['Score dropped 12pts','Missed 2 HWs','Needs support'], weak:['Math','History'] },
];

// ── Storage Helpers ────────────────────────────────────────
function getStudents() {
  try { const s = JSON.parse(localStorage.getItem(STUDENTS_KEY)); return (s && s.length) ? s : DEFAULT_STUDENTS; }
  catch { return DEFAULT_STUDENTS; }
}
function saveStudents(list) { localStorage.setItem(STUDENTS_KEY, JSON.stringify(list)); }
function getMessages() { try { return JSON.parse(localStorage.getItem(MSGS_KEY) || '{}'); } catch { return {}; } }
function saveMessages(m) { localStorage.setItem(MSGS_KEY, JSON.stringify(m)); }

// ── Utilities ──────────────────────────────────────────────
const SUBJECT_COLORS = { Math:'#6366f1', Science:'#10b981', English:'#f59e0b', History:'#ef4444' };

function scoreColor(s) { return s >= 85 ? '#10b981' : s >= 70 ? '#f59e0b' : s >= 55 ? '#f97316' : '#ef4444'; }
function initials(n)   { return (n || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
function fmtTime(s)    { return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
function fmtTs(ts)     { const d = new Date(ts); return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`; }
function fmtDate(ts)   { return new Date(ts).toLocaleDateString('en-IN', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}); }
function esc(t)        { return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ── Init UI with teacher info ──────────────────────────────
document.getElementById('sideTeacherAva').textContent   = teacherInitials;
document.getElementById('sideTeacherName').textContent  = teacherName;
document.getElementById('teacherGreetName').textContent = teacherName.split(' ')[0];
document.getElementById('ctrlName').textContent         = teacherName;

function logout() { localStorage.removeItem(SESSION_KEY); window.location.href = 'index.html'; }

// ── Scheduling helpers ─────────────────────────────────────
function getScheduledSession() {
  try { return JSON.parse(localStorage.getItem('scheduled_session')); } catch { return null; }
}
function openScheduleModal() { document.getElementById('scheduleModal').style.display = 'flex'; }
function closeScheduleModal(e) { if (!e || e.target.id === 'scheduleModal') document.getElementById('scheduleModal').style.display = 'none'; }
function scheduleSession() {
  const dt = document.getElementById('scheduleDateTime').value;
  const title = document.getElementById('scheduleTitle').value.trim() || 'Live Session';
  if (!dt) { showToast('Please pick a date/time'); return; }
  const obj = { title, datetime: dt };
  localStorage.setItem('scheduled_session', JSON.stringify(obj));
  closeScheduleModal();
  renderDashboard();
  showToast('Session scheduled for ' + fmtDate(dt));
  ws?.send(JSON.stringify({ type:'notification', text:'New session scheduled: ' + title + ' at ' + fmtDate(dt) }));
}
function cancelScheduledSession() {
  localStorage.removeItem('scheduled_session');
  renderDashboard();
  showToast('Scheduled session cancelled');
}

// ════════════════════════════════════════════════════════════
//  PAGE NAVIGATION
// ════════════════════════════════════════════════════════════
function showPage(name, btn) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  // Deactivate all nav buttons
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  // Show target page
  const page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
    page.style.display = 'flex';
  }
  // Activate nav button
  if (btn) {
    btn.classList.add('active');
  } else {
    const navBtn = document.querySelector(`[data-page="${name}"]`);
    if (navBtn) navBtn.classList.add('active');
  }

  // Page-specific init
  if (name === 'live')      { buildInviteList(); initPreviewCam(); updateLiveScheduleDisplay(); }
  if (name === 'analytics') { renderAnalytics(); }
  if (name === 'messages')  { renderMessages(); }
  if (name === 'students')  { renderStudentsTable(); }
}

// ════════════════════════════════════════════════════════════
//  DASHBOARD — Stats, Alerts, Grid
// ════════════════════════════════════════════════════════════
let currentFilter = 'all';
let searchQuery   = '';

function renderDashboard() {
  const students = getStudents();
  const poor = students.filter(s => s.score < 60).length;
  const good = students.filter(s => s.score >= 80).length;
  const avg  = students.length ? Math.round(students.reduce((a,s) => a + s.score, 0) / students.length) : 0;

  document.getElementById('st0').textContent = students.length;
  document.getElementById('st1').textContent = good;
  document.getElementById('st2').textContent = poor;
  document.getElementById('st3').textContent = avg + '%';

  // Scheduled session banner
  const alertsRow = document.getElementById('alertsRow');
  alertsRow.innerHTML = '';
  const sched = getScheduledSession();
  if (sched) {
    const d = document.createElement('div');
    d.className = 'alert-banner';
    d.style.background = 'rgba(13,148,136,0.1)';
    d.style.borderColor = 'rgba(13,148,136,0.25)';
    d.innerHTML = `<span class="alert-name">Upcoming</span>
      <span class="alert-msg">${esc(sched.title)} — ${fmtDate(sched.datetime)}</span>
      <button class="alert-call" onclick="cancelScheduledSession()">Cancel</button>`;
    alertsRow.appendChild(d);
  }
  students.filter(s => s.alerts.length).forEach(s => {
    const d = document.createElement('div');
    d.className = 'alert-banner';
    d.innerHTML = `<span class="material-icons alert-icon">error</span>
      <span class="alert-name">${esc(s.name)}</span>
      <span class="alert-msg">${esc(s.alerts[0])}</span>
      <button class="alert-call" onclick="callStudent('${s.id}')"><span class="material-icons">videocam</span> Call Now</button>`;
    alertsRow.appendChild(d);
  });

  renderGrid();
  renderStudentsTable();
  updateMsgBadge();
}

function setFilter(btn, f) {
  currentFilter = f;
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
}

function searchStudents(q) { searchQuery = q.toLowerCase(); renderGrid(); }

function renderGrid() {
  const grid = document.getElementById('studentGrid');
  grid.innerHTML = '';
  let students = getStudents();
  if (currentFilter === 'poor')    students = students.filter(s => s.score < 60);
  if (currentFilter === 'average') students = students.filter(s => s.score >= 60 && s.score < 80);
  if (currentFilter === 'good')    students = students.filter(s => s.score >= 80);
  if (searchQuery) students = students.filter(s => s.name.toLowerCase().includes(searchQuery) || s.email.toLowerCase().includes(searchQuery));
  if (!students.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text3);font-size:14px">
      <div style="font-size:36px;margin-bottom:10px"><span class="material-icons" style="font-size:36px;">search</span></div>No students match your filter.</div>`;
    return;
  }
  students.forEach(s => grid.appendChild(buildCard(s)));
}

function buildCard(s) {
  const isPoor   = s.score < 60;
  const isWarn   = s.score >= 60 && s.score < 70;
  const color    = scoreColor(s.score);
  const isOnline = !!onlineStudents[s.id];

  const div = document.createElement('div');
  div.className = 'scard' + (isPoor ? ' poor' : isWarn ? ' warning' : '');
  div.id = 'scard-' + s.id;
  div.innerHTML = `
    <div class="scard-glow" style="background:${color}"></div>
    ${s.alerts.length ? '<div class="alert-pip">ALERT</div>' : ''}
    ${isOnline && !s.alerts.length ? '<div class="online-pip"></div>' : ''}
    <div class="scard-top">
      <div class="scard-ava" style="background:linear-gradient(135deg,${color},#1e3a5f)">${initials(s.name)}</div>
      <div style="flex:1;min-width:0">
        <div class="scard-name">${esc(s.name)}</div>
        <div class="scard-sub">${isOnline ? '<span class="material-icons" style="font-size:14px;vertical-align:middle;color:#10b981">circle</span> Online' : '<span class="material-icons" style="font-size:14px;vertical-align:middle;color:#999">circle</span> Offline'}</div>
      </div>
      <div class="scard-grade" style="color:${color}">${s.grade}</div>
    </div>
    <div class="bar-row"><span>Overall Score</span><span style="color:${color};font-weight:600">${s.score}%</span></div>
    <div class="bar-bg"><div class="bar-fill" style="width:${s.score}%;background:linear-gradient(90deg,${color},${color}88)"></div></div>
    <div class="scard-bottom">
      <span class="scard-att"><span class="material-icons" style="vertical-align:middle;font-size:14px">event</span> <span style="color:${s.attendance<70?'#ef4444':'#10b981'}">${s.attendance}%</span> attendance</span>
      <div class="scard-actions">
        <button class="scard-btn view" onclick="event.stopPropagation();openStudentModal('${s.id}')"><span class="material-icons">visibility</span></button>
        ${isOnline ? `<button class="scard-btn call" onclick="event.stopPropagation();callStudent('${s.id}')"><span class="material-icons">videocam</span></button>` : ''}
        <button class="scard-btn remove" onclick="event.stopPropagation();removeStudent('${s.id}')"><span class="material-icons">delete</span></button>
      </div>
    </div>`;
  div.onclick = () => openStudentModal(s.id);
  return div;
}

// ════════════════════════════════════════════════════════════
//  STUDENTS TABLE
// ════════════════════════════════════════════════════════════
function renderStudentsTable() {
  const tbody = document.getElementById('studentsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  getStudents().forEach(s => {
    const color    = scoreColor(s.score);
    const isOnline = !!onlineStudents[s.id];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="tbl-ava" style="background:linear-gradient(135deg,${color},#1e3a5f)">${initials(s.name)}</span>${esc(s.name)}</td>
      <td style="color:var(--text3)">${esc(s.email)}</td>
      <td><span style="color:${color};font-weight:700">${s.score}%</span></td>
      <td><span style="color:${s.attendance<70?'#ef4444':'#10b981'}">${s.attendance}%</span></td>
      <td><span style="color:${color};font-weight:700">${s.grade}</span></td>
      <td><span class="tbl-badge ${isOnline?'online':'offline'}">${isOnline?'● Online':'○ Offline'}</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="scard-btn view" onclick="openStudentModal('${s.id}')">Details</button>
        <button class="scard-btn call" onclick="callStudent('${s.id}')"><span class="material-icons">videocam</span> Call</button>
        <button class="scard-btn view" onclick="openMsgFromModal('${s.id}')"><span class="material-icons">chat</span> Msg</button>
        <button class="scard-btn remove" onclick="removeStudent('${s.id}')">Remove</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// ════════════════════════════════════════════════════════════
//  STUDENT DETAIL MODAL
// ════════════════════════════════════════════════════════════
function openStudentModal(id) {
  const s = getStudents().find(x => x.id === id);
  if (!s) return;
  const color    = scoreColor(s.score);
  const isOnline = !!onlineStudents[id];

  const subjectsHTML = Object.entries(s.subjects).map(([k,v]) => `
    <div class="subject-row" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(232,244,255,0.6);margin-bottom:5px">
        <span>${k}</span><span style="color:${SUBJECT_COLORS[k]};font-weight:600">${v}%</span>
      </div>
      <div style="height:7px;background:rgba(255,255,255,0.07);border-radius:4px;overflow:hidden">
        <div style="width:${v}%;height:100%;background:${SUBJECT_COLORS[k]};border-radius:4px;transition:width 1s ease"></div>
      </div>
    </div>`).join('');

  document.getElementById('studentModalBox').innerHTML = `
    <div class="sm-header">
      <div class="sm-ava" style="background:linear-gradient(135deg,${color},#1e3a5f)">${initials(s.name)}</div>
      <div style="flex:1;min-width:0">
        <div class="sm-name">${esc(s.name)}</div>
        <div class="sm-meta">${esc(s.email)} · ${isOnline ? '<span class="material-icons" style="font-size:14px;vertical-align:middle;color:#10b981">circle</span> Online' : '<span class="material-icons" style="font-size:14px;vertical-align:middle;color:#999">circle</span> Offline'}</div>
      </div>
      <div class="sm-actions">
        ${isOnline ? `<button class="btn-teal" onclick="callStudent('${s.id}')"><span class="material-icons">videocam</span> Call</button>` : ''}
        <button class="btn-outline" onclick="downloadStudentReport('${s.id}')"><span class="material-icons">file_download</span> Report</button>
        <button class="btn-outline" onclick="openMsgFromModal('${s.id}')"><span class="material-icons">chat</span> Message</button>
        <button class="btn-outline" style="padding:10px 12px" onclick="closeStudentModal()">✕</button>
      </div>
    </div>
    <div class="sm-body">
      ${s.alerts.length ? `<div class="detail-alert">
        <div class="detail-alert-title">Performance Alerts</div>
        ${s.alerts.map(a => `<div class="detail-alert-item">• ${esc(a)}</div>`).join('')}
      </div>` : ''}
      <div class="mini-stats">
        <div class="ms"><div class="ms-val" style="color:${color}">${s.score}%</div><div class="ms-lbl">Overall Score</div></div>
        <div class="ms"><div class="ms-val" style="color:${s.attendance<70?'#ef4444':'#10b981'}">${s.attendance}%</div><div class="ms-lbl">Attendance</div></div>
        <div class="ms"><div class="ms-val" style="color:${color}">${s.grade}</div><div class="ms-lbl">Grade</div></div>
      </div>
      <div class="detail-section-title">Subject Performance</div>
      ${subjectsHTML}
      <div class="detail-section-title" style="margin-top:18px">Recent Activity</div>
      ${(s.activity || []).map(a => `<div class="activity-item"><div class="activity-dot"></div>${esc(a)}</div>`).join('')}
      ${s.weak && s.weak[0] !== 'None' ? `
        <div class="detail-section-title" style="margin-top:18px">Weak Areas</div>
        ${s.weak.map(w => `<span class="weak-tag">${esc(w)}</span>`).join('')}` : ''}
    </div>`;

  document.getElementById('studentModal').style.display = 'flex';
}

function closeStudentModal(e) {
  if (!e || e.target.id === 'studentModal') document.getElementById('studentModal').style.display = 'none';
}

// ════════════════════════════════════════════════════════════
//  ADD / REMOVE STUDENTS
// ════════════════════════════════════════════════════════════
function openAddStudent()  { document.getElementById('addStudentModal').style.display = 'flex'; }
function closeAddModal(e)  { if (!e || e.target.id === 'addStudentModal') document.getElementById('addStudentModal').style.display = 'none'; }

function addStudent() {
  const name  = document.getElementById('addName').value.trim();
  const email = document.getElementById('addEmail').value.trim();
  const grade = document.getElementById('addGradeLevel').value;
  const errEl = document.getElementById('addStudentError');
  errEl.style.display = 'none';

  if (!name)  { errEl.textContent = 'Please enter a name.'; errEl.style.display='block'; return; }
  if (!email || !email.includes('@')) { errEl.textContent = 'Please enter a valid email.'; errEl.style.display='block'; return; }

  const students = getStudents();
  if (students.find(s => s.email.toLowerCase() === email.toLowerCase())) {
    errEl.textContent = 'A student with this email already exists.'; errEl.style.display='block'; return;
  }

  const gradeToScore = {'A+':95,'A':87,'B':73,'C':61,'D':45,'F':30};
  const score = gradeToScore[grade] || 60;

  students.push({
    id: 's' + Date.now(), name, email, grade, score,
    attendance: 100,
    subjects: { Math:score, Science:score, English:score, History:score },
    alerts: [],
    activity: ['Just enrolled — ' + new Date().toLocaleDateString()],
    weak: ['None']
  });
  saveStudents(students);
  closeAddModal();
  document.getElementById('addName').value = '';
  document.getElementById('addEmail').value = '';
  renderDashboard();
  buildInviteList();
  showToast(`${name} added to your class`);
}

function removeStudent(id) {
  const s = getStudents().find(x => x.id === id);
  if (!s || !confirm(`Remove ${s.name} from your class?\nThis cannot be undone.`)) return;
  saveStudents(getStudents().filter(x => x.id !== id));
  document.getElementById('studentModal').style.display = 'none';
  renderDashboard();
  buildInviteList();
  showToast(`${s.name} removed`);
}

function downloadStudentReport(id) {
  const s = getStudents().find(x => x.id === id);
  if (!s) return;
  const rows = [];
  rows.push(['Name', s.name]);
  rows.push(['Email', s.email]);
  rows.push(['Grade', s.grade]);
  rows.push(['Score', s.score]);
  rows.push(['Attendance', s.attendance]);
  rows.push(['Subjects', '']);
  Object.entries(s.subjects).forEach(([k,v]) => rows.push([k, v]));
  if (s.alerts && s.alerts.length) rows.push(['Alerts', s.alerts.join('; ')]);
  if (s.activity && s.activity.length) rows.push(['Activity', s.activity.join('; ')]);
  if (s.weak && s.weak.length) rows.push(['Weak Areas', s.weak.join('; ')]);
  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${s.name.replace(/\s+/g,'_')}_report.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('Report downloaded');
}

// ════════════════════════════════════════════════════════════
//  ANALYTICS — Full charts & tables
// ════════════════════════════════════════════════════════════
function renderAnalytics() {
  const students = getStudents();
  const c = document.getElementById('analyticsContent');
  if (!c) return;

  if (!students.length) {
    c.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text3)">
      <div style="font-size:40px;margin-bottom:12px"><span class="material-icons" style="font-size:40px;">analytics</span></div>No students yet — add some to see analytics.</div>`;
    return;
  }

  const avg = k => students.length ? Math.round(students.reduce((a,s) => a + (s.subjects[k]||0), 0) / students.length) : 0;
  const overallAvg = Math.round(students.reduce((a,s) => a+s.score, 0) / students.length);
  const distA = students.filter(s => s.score >= 85).length;
  const distB = students.filter(s => s.score >= 70 && s.score < 85).length;
  const distC = students.filter(s => s.score >= 55 && s.score < 70).length;
  const distD = students.filter(s => s.score < 55).length;
  const avgAtt = Math.round(students.reduce((a,s) => a+s.attendance, 0) / students.length);
  const sorted = [...students].sort((a,b) => b.score - a.score);

  // Trend sparkline (simulated for demo)
  const weeks = ['W1','W2','W3','W4','W5','W6'];
  const trendData = [62, 65, 61, 68, 66, overallAvg];
  const maxT = Math.max(...trendData);
  const sparkPoints = trendData.map((v,i) => `${(i/(weeks.length-1))*280},${70 - (v/maxT)*60}`).join(' ');

  c.innerHTML = `
  <!-- ROW 1: Key metrics -->
  <div class="analytics-kpi-row">
    <div class="kpi-card">
      <div class="kpi-icon" style="background:rgba(13,148,136,0.15)"><span class="material-icons">analytics</span></div>
      <div class="kpi-val" style="color:#14b8a6">${overallAvg}%</div>
      <div class="kpi-lbl">Class Average</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:rgba(16,185,129,0.15)"><span class="material-icons">emoji_events</span></div>
      <div class="kpi-val" style="color:#10b981">${sorted[0]?.score || 0}%</div>
      <div class="kpi-lbl">Top Score</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:rgba(239,68,68,0.15)"><span class="material-icons">trending_down</span></div>
      <div class="kpi-val" style="color:#ef4444">${sorted[sorted.length-1]?.score || 0}%</div>
      <div class="kpi-lbl">Lowest Score</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:rgba(245,158,11,0.15)"><span class="material-icons">event</span></div>
      <div class="kpi-val" style="color:#f59e0b">${avgAtt}%</div>
      <div class="kpi-lbl">Avg Attendance</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:rgba(239,68,68,0.15)"><span class="material-icons">warning</span></div>
      <div class="kpi-val" style="color:#ef4444">${students.filter(s=>s.alerts.length).length}</div>
      <div class="kpi-lbl">Students At-Risk</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:rgba(16,185,129,0.15)"><span class="material-icons">emoji_events</span></div>
      <div class="kpi-val" style="color:#10b981">${students.filter(s=>s.score>=80).length}</div>
      <div class="kpi-lbl">Above 80%</div>
    </div>
  </div>

  <div class="analytics-grid">
    <!-- Subject Averages -->
    <div class="analytics-card">
      <h3><span class="material-icons" style="vertical-align:middle;">bar_chart</span> Subject Averages</h3>
      ${Object.keys(SUBJECT_COLORS).map(k => {
        const a = avg(k);
        return `<div class="subject-row">
          <div class="subject-head"><span>${k}</span><span style="color:${SUBJECT_COLORS[k]};font-weight:600">${a}%</span></div>
          <div class="subject-bar">
            <div class="subject-fill" style="width:${a}%;background:linear-gradient(90deg,${SUBJECT_COLORS[k]},${SUBJECT_COLORS[k]}88)"></div>
          </div>
        </div>`;
      }).join('')}
      <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--text3);margin-bottom:8px">WEAKEST SUBJECT</div>
        <div style="font-size:14px;font-weight:600;color:#f97316">
          ${Object.entries({Math:avg('Math'),Science:avg('Science'),English:avg('English'),History:avg('History')}).sort((a,b)=>a[1]-b[1])[0][0]}
          — ${Math.min(avg('Math'),avg('Science'),avg('English'),avg('History'))}% avg
        </div>
      </div>
    </div>

    <!-- Grade Distribution -->
    <div class="analytics-card">
      <h3><span class="material-icons" style="vertical-align:middle;">grading</span> Grade Distribution</h3>
      ${[['A+ / A', distA,'#10b981'],['B', distB,'#6366f1'],['C', distC,'#f59e0b'],['D / Fail', distD,'#ef4444']].map(([lbl,cnt,col]) => `
        <div class="dist-row">
          <span class="dist-label">${lbl}</span>
          <div class="dist-bar">
            <div class="dist-fill" style="width:${students.length ? Math.round(cnt/students.length*100) : 0}%;background:${col}"></div>
          </div>
          <span class="dist-val" style="color:${col}">${cnt}</span>
        </div>`).join('')}
      <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--text3);margin-bottom:6px">PASS RATE</div>
        <div class="dist-bar" style="height:12px">
          <div class="dist-fill" style="height:100%;width:${Math.round((students.filter(s=>s.score>=50).length/students.length)*100)}%;background:linear-gradient(90deg,#10b981,#14b8a6)"></div>
        </div>
        <div style="font-size:13px;font-weight:700;color:#10b981;margin-top:6px">${Math.round((students.filter(s=>s.score>=50).length/students.length)*100)}% passing</div>
      </div>
    </div>

    <!-- Top Performers -->
    <div class="analytics-card">
      <h3><span class="material-icons" style="vertical-align:middle;">emoji_events</span> Leaderboard</h3>
      ${sorted.map((s,i) => `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding:10px;background:rgba(255,255,255,0.03);border-radius:10px;${i<3?'border:1px solid rgba(255,255,255,0.07)':''}">
          <div style="font-size:16px;width:24px;text-align:center">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1+'.'}</div>
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,${scoreColor(s.score)},#1e3a5f);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${initials(s.name)}</div>
          <div style="flex:1;font-size:13px;color:var(--text2)">${esc(s.name)}</div>
          <div style="font-size:14px;font-weight:700;color:${scoreColor(s.score)}">${s.score}%</div>
        </div>`).join('')}
    </div>

    <!-- At-Risk Students -->
    <div class="analytics-card">
      <h3><span class="material-icons" style="vertical-align:middle;">warning</span> Needs Attention</h3>
      ${students.filter(s => s.alerts.length || s.score < 60).length === 0
        ? `<div style="text-align:center;padding:30px;color:var(--text3)"><div style="font-size:32px;margin-bottom:10px"><span class="material-icons" style="font-size:32px;">celebration</span></div>All students performing well!</div>`
        : students.filter(s => s.alerts.length || s.score < 60).map(s => `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;padding:10px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:10px">
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#1e0a0a);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${initials(s.name)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;color:var(--text)">${esc(s.name)}</div>
            <div style="font-size:11px;color:rgba(239,68,68,0.7)">${s.alerts[0] || 'Low score'}</div>
          </div>
          <div style="font-size:13px;font-weight:700;color:#ef4444">${s.score}%</div>
          <button class="scard-btn call" onclick="callStudent('${s.id}')" style="padding:4px 10px;font-size:11px"><span class="material-icons" style="font-size:14px">videocam</span></button>
        </div>`).join('')}
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);font-size:12px;color:var(--text3)">
        ${students.filter(s=>s.attendance<70).length} student(s) with attendance below 70%
      </div>
    </div>

    <!-- Score Trend -->
    <div class="analytics-card" style="grid-column:1/-1">
      <h3><span class="material-icons" style="vertical-align:middle;">trending_up</span> Class Score Trend (Last 6 Weeks)</h3>
      <div style="position:relative;height:90px;margin-top:8px">
        <svg viewBox="0 0 280 70" style="width:100%;height:100%;overflow:visible">
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0d9488" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#0d9488" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <polyline points="${trendData.map((v,i)=>`${(i/(trendData.length-1))*280},${70-(v/maxT)*60}`).join(' ')}" fill="none" stroke="#0d9488" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
          <polygon points="0,70 ${sparkPoints} 280,70" fill="url(#trendGrad)"/>
          ${trendData.map((v,i)=>`<circle cx="${(i/(trendData.length-1))*280}" cy="${70-(v/maxT)*60}" r="4" fill="#0d9488" stroke="#040810" stroke-width="2"/>`).join('')}
        </svg>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:6px">
        ${weeks.map(w=>`<div style="font-size:10px;color:var(--text3)">${w}</div>`).join('')}
      </div>
    </div>

    <!-- Individual Breakdown Table -->
    <div class="analytics-card" style="grid-column:1/-1">
      <h3><span class="material-icons" style="vertical-align:middle;">table_chart</span> Individual Subject Breakdown</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="border-bottom:1px solid var(--border)">
              <th style="text-align:left;padding:10px 14px;color:var(--text3);font-weight:600">Student</th>
              <th style="text-align:center;padding:10px 14px;color:#6366f1;font-weight:600">Math</th>
              <th style="text-align:center;padding:10px 14px;color:#10b981;font-weight:600">Science</th>
              <th style="text-align:center;padding:10px 14px;color:#f59e0b;font-weight:600">English</th>
              <th style="text-align:center;padding:10px 14px;color:#ef4444;font-weight:600">History</th>
              <th style="text-align:center;padding:10px 14px;color:var(--text3);font-weight:600">Overall</th>
              <th style="text-align:center;padding:10px 14px;color:var(--text3);font-weight:600">Trend</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:10px 14px;font-weight:500">
                  <span style="display:inline-flex;align-items:center;gap:8px">
                    <span style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,${scoreColor(s.score)},#1e3a5f);display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">${initials(s.name)}</span>
                    ${esc(s.name)}
                  </span>
                </td>
                ${['Math','Science','English','History'].map(k => `
                  <td style="text-align:center;color:${scoreColor(s.subjects[k])};font-weight:600">${s.subjects[k]}%</td>`).join('')}
                <td style="text-align:center;font-weight:700;color:${scoreColor(s.score)}">${s.score}%</td>
                <td style="text-align:center">
                  <span style="color:${s.score>=70?'#10b981':'#ef4444'}">${s.score>=70?'▲':'▼'}</span>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function exportAnalyticsCSV() {
  const students = getStudents();
  const rows = [['Name','Email','Score','Attendance','Grade','Math','Science','English','History']];
  students.forEach(s => rows.push([s.name,s.email,s.score,s.attendance,s.grade,s.subjects.Math,s.subjects.Science,s.subjects.English,s.subjects.History]));
  const csv  = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'class-analytics.csv'; a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported!');
}

// ════════════════════════════════════════════════════════════
//  MESSAGES — Full threaded DMs + broadcast
// ════════════════════════════════════════════════════════════
let activeMsgStudent = null;

function updateMsgBadge() {
  const msgs     = getMessages();
  const students = getStudents();
  const badge    = document.getElementById('msgBadge');
  let unread = 0;
  students.forEach(s => { if ((msgs[s.id] || []).some(m => m.from === 'student' && !m.read)) unread++; });
  if (unread > 0) { badge.textContent = unread; badge.style.display = ''; }
  else { badge.style.display = 'none'; }
}

function renderMessages() {
  const list     = document.getElementById('msgList');
  if (!list) return;
  const students = getStudents();
  const msgs     = getMessages();
  list.innerHTML = '';

  students.forEach(s => {
    const thread   = msgs[s.id] || [];
    const last     = thread[thread.length - 1];
    const unread   = thread.filter(m => m.from === 'student' && !m.read).length;
    const color    = scoreColor(s.score);
    const isOnline = !!onlineStudents[s.id];

    const div = document.createElement('div');
    div.className = 'msg-list-item' + (activeMsgStudent === s.id ? ' active' : '');
    div.innerHTML = `
      <div style="position:relative">
        <div class="msg-item-ava" style="background:linear-gradient(135deg,${color},#1e3a5f)">${initials(s.name)}</div>
        ${isOnline ? '<div style="position:absolute;bottom:0;right:0;width:8px;height:8px;border-radius:50%;background:#10b981;border:2px solid var(--bg2)"></div>' : ''}
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="msg-item-name">${esc(s.name)}</div>
          ${unread > 0 ? `<span style="background:#ef4444;border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700;color:#fff">${unread}</span>` : ''}
        </div>
        <div class="msg-item-preview">${last ? esc(last.text) : 'No messages yet'}</div>
        ${last ? `<div style="font-size:10px;color:var(--text3);margin-top:2px">${fmtTs(last.ts)}</div>` : ''}
      </div>`;
    div.onclick = () => openMessages(s.id);
    list.appendChild(div);
  });
}

function openMessages(studentId) {
  activeMsgStudent = studentId;
  const s       = getStudents().find(x => x.id === studentId);
  const msgs    = getMessages();
  const thread  = msgs[studentId] || [];
  const color   = scoreColor(s.score);

  // Mark student messages as read
  if (msgs[studentId]) {
    msgs[studentId].forEach(m => { if (m.from === 'student') m.read = true; });
    saveMessages(msgs);
    updateMsgBadge();
  }

  renderMessages(); // re-render list to clear badges

  const content = document.getElementById('msgContent');
  content.innerHTML = `
    <div class="msg-header">
      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${color},#1e3a5f);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0">${initials(s.name)}</div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:600">${esc(s.name)}</div>
        <div style="font-size:11px;color:var(--text3)">${esc(s.email)} · Score: ${s.score}% · Attendance: ${s.attendance}%</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-outline" style="padding:7px 14px;font-size:12px" onclick="openStudentModal('${s.id}')"><span class="material-icons">person</span> Profile</button>
        <button class="btn-teal" style="padding:7px 14px;font-size:12px" onclick="callStudent('${s.id}')"><span class="material-icons">videocam</span> Call</button>
      </div>
    </div>
    <div class="msg-thread" id="msgThread">
      ${thread.length === 0
        ? `<div style="text-align:center;padding:40px;color:var(--text3);font-size:13px">
            <div style="font-size:32px;margin-bottom:10px"><span class="material-icons" style="font-size:32px;">chat</span></div>
            Start a conversation with ${esc(s.name.split(' ')[0])}
           </div>`
        : thread.map(m => `
          <div class="chat-msg ${m.from === 'teacher' ? 'mine' : 'other'}">
            ${m.from !== 'teacher' ? `<div class="chat-msg-name">${esc(s.name)}</div>` : ''}
            <div class="chat-msg-text">${esc(m.text)}</div>
            <div class="chat-msg-time">${fmtDate(m.ts)}</div>
          </div>`).join('')
      }
    </div>
    <div class="msg-input-row">
      <input type="text" id="msgInput" placeholder="Message ${esc(s.name.split(' ')[0])}..." 
        onkeydown="if(event.key==='Enter')sendDM()" autofocus/>
      <button onclick="sendDM()"><span class="material-icons">send</span></button>
    </div>`;

  const thread2 = document.getElementById('msgThread');
  if (thread2) thread2.scrollTop = thread2.scrollHeight;
}

function openMsgFromModal(id) {
  document.getElementById('studentModal').style.display = 'none';
  showPage('messages', document.querySelector('[data-page=messages]'));
  setTimeout(() => openMessages(id), 50);
}

function sendDM() {
  const input = document.getElementById('msgInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text || !activeMsgStudent) return;
  const msgs = getMessages();
  if (!msgs[activeMsgStudent]) msgs[activeMsgStudent] = [];
  msgs[activeMsgStudent].push({ from:'teacher', text, ts:Date.now(), read:true });
  saveMessages(msgs);
  input.value = '';
  openMessages(activeMsgStudent);
  ws?.send(JSON.stringify({ type:'notification', text:'Teacher: ' + text }));
}

// Broadcast message to all students
function openBroadcastMsgModal()  { document.getElementById('broadcastMsgModal').style.display = 'flex'; }
function closeBroadcastMsgModal(e){ if (!e || e.target.id === 'broadcastMsgModal') document.getElementById('broadcastMsgModal').style.display = 'none'; }

function sendBroadcastMsg() {
  const text = document.getElementById('broadcastMsgText').value.trim();
  if (!text) return;
  const msgs     = getMessages();
  const students = getStudents();
  const ts       = Date.now();
  students.forEach(s => {
    if (!msgs[s.id]) msgs[s.id] = [];
    msgs[s.id].push({ from:'teacher', text, ts, read:true });
  });
  saveMessages(msgs);
  document.getElementById('broadcastMsgText').value = '';
  closeBroadcastMsgModal();
  ws?.send(JSON.stringify({ type:'notification', text: 'Announcement: ' + text }));
  renderMessages();
  showToast(`Broadcast sent to ${students.length} students`);
}

// ════════════════════════════════════════════════════════════
//  LIVE SESSION — WebRTC + WebSocket
// ════════════════════════════════════════════════════════════
let ws, myId, roomId;
let localStream = null, screenStream = null;
let rtcPeers    = {};
let remoteVids  = {};
let onlineStudents = {};
let callActive  = false;
let callSecs    = 0, callInterval;
let micOn = true, camOn = true;
let previewStream = null;
let previewMicOn = true, previewCamOn = false;
let isRecording = false;

const ICE = { iceServers: [{ urls:'stun:stun.l.google.com:19302' }] };

// WebSocket
function connectWS() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  try {
    ws = new WebSocket(`${proto}://${location.host}`);
    ws.onopen  = () => { setWSStatus('connected'); ws.send(JSON.stringify({ type:'join', role:'teacher', name:teacherName, roomId })); };
    ws.onclose = () => { setWSStatus('offline'); setTimeout(connectWS, 3000); };
    ws.onerror = () => { setWSStatus('offline'); };
    ws.onmessage = async ({ data }) => {
      let msg; try { msg = JSON.parse(data); } catch { return; }
      switch (msg.type) {
        case 'joined':          myId = msg.id; document.getElementById('ctrlRoom').textContent = 'Room: ' + roomId; break;
        case 'participants':    msg.list.forEach(p => p.role === 'student' && addOnline(p.id, p.name)); break;
        case 'student-joined':  addOnline(msg.id, msg.name); showToast(`${msg.name} joined`); break;
        case 'peer-left':       removeOnline(msg.id); break;
        case 'call-accepted':   showToast(`✅ ${msg.fromName} joined call`); if (callActive) createOffer(msg.fromId); break;
        case 'call-declined':   showToast(`${msg.fromName} declined`); break;
        case 'offer':           await handleOffer(msg); break;
        case 'answer':          await handleAnswer(msg); break;
        case 'ice-candidate':   await handleIce(msg); break;
        case 'chat':            appendChat(msg); break;
        case 'call-ended':      removePeer(msg.fromId); break;
      }
    };
  } catch(e) { setWSStatus('offline'); }
}

function setWSStatus(state) {
  const el = document.getElementById('wsBadge');
  if (!el) return;
  if (state === 'connected') { el.textContent = 'Live'; el.className = 'ws-badge connected'; }
  else if (state === 'offline') { el.textContent = 'Offline'; el.className = 'ws-badge offline'; }
  else { el.textContent = 'Connecting...'; el.className = 'ws-badge'; }
}

function addOnline(id, name) {
  onlineStudents[id] = { id, name };
  updateParticipantsList();
  const lpc = document.getElementById('liveParticipantsCount');
  if (lpc) lpc.innerHTML = '<span class="material-icons" style="vertical-align:middle;font-size:14px">group</span> ' + (Object.keys(remoteVids).length + 1);
  const s = getStudents().find(x => x.name === name);
  if (s) {
    const card = document.getElementById('scard-' + s.id);
    if (card) card.remove();
    const grid = document.getElementById('studentGrid');
    if (grid) grid.insertBefore(buildCard({ ...s }), grid.firstChild);
    renderStudentsTable();
  }
}

function removeOnline(id) {
  const name = onlineStudents[id]?.name;
  delete onlineStudents[id];
  updateParticipantsList();
  if (name) showToast(`${name} left`);
  removePeer(id);
}

// Preview
async function initPreviewCam() {
  if (previewStream) return;
  try {
    previewStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    document.getElementById('previewVideo').srcObject = previewStream;
    document.getElementById('previewOverlay').style.display = 'none';
    previewCamOn = true;
    updatePreviewBtns();
  } catch(e) { /* permission denied */ }
}
function togglePreviewMic() {
  previewMicOn = !previewMicOn;
  previewStream?.getAudioTracks().forEach(t => t.enabled = previewMicOn);
  updatePreviewBtns();
}
function togglePreviewCam() {
  previewCamOn = !previewCamOn;
  previewStream?.getVideoTracks().forEach(t => t.enabled = previewCamOn);
  document.getElementById('previewOverlay').style.display = previewCamOn ? 'none' : 'flex';
  updatePreviewBtns();
}
function updatePreviewBtns() {
  const m = document.getElementById('previewMicBtn');
  const c = document.getElementById('previewCamBtn');
  if (m) { m.className = 'pctrl' + (previewMicOn ? '' : ' off'); m.innerHTML = previewMicOn ? '<span class="material-icons">mic</span>' : '<span class="material-icons">mic_off</span>'; }
  if (c) { c.className = 'pctrl' + (previewCamOn ? '' : ' off'); c.innerHTML = previewCamOn ? '<span class="material-icons">videocam</span>' : '<span class="material-icons">videocam_off</span>'; }
}

function buildInviteList() {
  const container = document.getElementById('inviteCheckboxes');
  if (!container) return;
  const students = getStudents();
  container.innerHTML = '';
  if (!students.length) { container.innerHTML = '<div style="font-size:13px;color:var(--text3)">No students yet.</div>'; return; }
  students.forEach(s => {
    const lbl = document.createElement('label');
    lbl.className = 'invite-item';
    lbl.innerHTML = `<input type="checkbox" value="${s.id}" checked/><span class="invite-item-name">${esc(s.name)}</span>`;
    container.appendChild(lbl);
  });
}

async function startLiveSession() {
  const title = document.getElementById('sessionTitle').value.trim() || 'Live Session';
  roomId = 'room-' + teacherEmail.split('@')[0] + '-' + Date.now().toString(36);

  if (previewStream) { previewStream.getTracks().forEach(t => t.stop()); previewStream = null; }

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video:previewCamOn, audio:true });
  } catch(e) {
    try { localStream = await navigator.mediaDevices.getUserMedia({ audio:true }); showToast('Camera unavailable, audio only'); }
    catch(e2) { showToast('Could not access microphone'); return; }
  }

  document.getElementById('localVideo').srcObject = localStream;
  document.getElementById('liveTitle').textContent = title;
  document.getElementById('preCall').style.display = 'none';
  document.getElementById('liveCall').style.display = 'flex';
  document.getElementById('liveNavBadge').style.display = '';

  callActive = true; callSecs = 0;
  clearInterval(callInterval);
  callInterval = setInterval(() => { callSecs++; document.getElementById('liveTimer').textContent = fmtTime(callSecs); }, 1000);

  micOn = previewMicOn; camOn = previewCamOn; updateCtrlBtns();
  connectWS();
  setTimeout(() => { ws?.send(JSON.stringify({ type:'call-invite', targetId:'all' })); }, 1500);
  showToast('Session started! Students will be notified.');
}

function endLiveSession() {
  if (!confirm('End the live session for everyone?')) return;
  callActive = false;
  clearInterval(callInterval);
  ws?.send(JSON.stringify({ type:'end-call' }));
  Object.values(rtcPeers).forEach(pc => pc.close());
  rtcPeers = {};
  Object.keys(remoteVids).forEach(id => { remoteVids[id]?.remove(); delete remoteVids[id]; });
  if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; }
  document.getElementById('remoteTiles').innerHTML = '';
  document.getElementById('chatMsgs').innerHTML = '';
  document.getElementById('liveCall').style.display = 'none';
  document.getElementById('preCall').style.display = '';
  document.getElementById('liveNavBadge').style.display = 'none';
  document.getElementById('liveTimer').textContent = '00:00';
  document.getElementById('sessionTitle').value = '';
  buildInviteList();
  showToast('Session ended');
}

// WebRTC
async function createOffer(remoteId) {
  if (rtcPeers[remoteId]) rtcPeers[remoteId].close();
  const pc = new RTCPeerConnection(ICE);
  rtcPeers[remoteId] = pc;
  localStream?.getTracks().forEach(t => pc.addTrack(t, localStream));
  pc.onicecandidate = ({ candidate }) => { if (candidate) ws.send(JSON.stringify({ type:'ice-candidate', targetId:remoteId, candidate })); };
  pc.ontrack = ({ streams:[s] }) => addRemoteTile(remoteId, s);
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  ws.send(JSON.stringify({ type:'offer', targetId:remoteId, offer }));
}

async function handleOffer(msg) {
  const pc = new RTCPeerConnection(ICE);
  rtcPeers[msg.fromId] = pc;
  localStream?.getTracks().forEach(t => pc.addTrack(t, localStream));
  pc.onicecandidate = ({ candidate }) => { if (candidate) ws.send(JSON.stringify({ type:'ice-candidate', targetId:msg.fromId, candidate })); };
  pc.ontrack = ({ streams:[s] }) => addRemoteTile(msg.fromId, s);
  await pc.setRemoteDescription(msg.offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  ws.send(JSON.stringify({ type:'answer', targetId:msg.fromId, answer }));
}

async function handleAnswer(msg) { if (rtcPeers[msg.fromId]) await rtcPeers[msg.fromId].setRemoteDescription(msg.answer); }
async function handleIce(msg)    { if (rtcPeers[msg.fromId]) await rtcPeers[msg.fromId].addIceCandidate(msg.candidate).catch(() => {}); }

function addRemoteTile(peerId, stream) {
  if (remoteVids[peerId]) return;
  const name = onlineStudents[peerId]?.name || 'Student';
  const wrap = document.createElement('div');
  wrap.className = 'remote-tile'; wrap.id = 'rtile-' + peerId;
  const video = document.createElement('video');
  video.autoplay = true; video.playsinline = true; video.srcObject = stream;
  const lbl = document.createElement('div');
  lbl.className = 'tile-label'; lbl.textContent = name;
  wrap.appendChild(video); wrap.appendChild(lbl);
  document.getElementById('remoteTiles').appendChild(wrap);
  remoteVids[peerId] = wrap;
  document.getElementById('liveParticipantsCount').innerHTML = '<span class="material-icons" style="vertical-align:middle;font-size:14px">group</span> ' + (Object.keys(remoteVids).length + 1);
  updateParticipantsList();
}

function removePeer(id) {
  if (remoteVids[id]) { remoteVids[id].remove(); delete remoteVids[id]; }
  if (rtcPeers[id])   { rtcPeers[id].close();    delete rtcPeers[id]; }
  document.getElementById('liveParticipantsCount').innerHTML = '<span class="material-icons" style="vertical-align:middle;font-size:14px">group</span> ' + (Object.keys(remoteVids).length + 1);
}

async function callStudent(studentId) {
  const s = getStudents().find(x => x.id === studentId);
  if (!s) return;
  if (!callActive) {
    document.getElementById('sessionTitle').value = 'Call with ' + s.name;
    showPage('live', document.querySelector('[data-page=live]'));
    await new Promise(r => setTimeout(r, 300));
    await startLiveSession();
  }
  const peerWsId = Object.keys(onlineStudents).find(k => onlineStudents[k].name === s.name);
  if (peerWsId) { ws?.send(JSON.stringify({ type:'call-invite', targetId:peerWsId })); showToast('Calling ' + s.name + '...'); }
  else { showToast(`${s.name} is not currently online`); }
  document.getElementById('studentModal').style.display = 'none';
}

// Controls
function toggleMic()  { micOn = !micOn; localStream?.getAudioTracks().forEach(t => t.enabled = micOn); updateCtrlBtns(); }
function toggleCam()  { camOn = !camOn; localStream?.getVideoTracks().forEach(t => t.enabled = camOn); updateCtrlBtns(); }
async function toggleScreen() {
  if (screenStream) {
    screenStream.getTracks().forEach(t => t.stop()); screenStream = null;
    const vt = localStream?.getVideoTracks()[0];
    if (vt) Object.values(rtcPeers).forEach(pc => { const s = pc.getSenders().find(s => s.track?.kind==='video'); if(s) s.replaceTrack(vt); });
    document.getElementById('screenBtn').classList.remove('muted');
    showToast('Screen share stopped');
  } else {
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({ video:true });
      const st = screenStream.getVideoTracks()[0];
      Object.values(rtcPeers).forEach(pc => { const s = pc.getSenders().find(s => s.track?.kind==='video'); if(s) s.replaceTrack(st); });
      st.onended = () => toggleScreen();
      document.getElementById('screenBtn').classList.add('muted');
      showToast('Screen sharing started');
    } catch(e) { showToast('Screen share cancelled'); }
  }
}
function toggleHandRaise() { showToast('Hand raised — students can see this'); }
function updateCtrlBtns() {
  const m = document.getElementById('micBtn');
  const c = document.getElementById('camBtn');
  if (m) { m.className = 'ctrl-btn' + (micOn ? '' : ' muted'); m.querySelector('span').innerHTML = micOn ? '<span class="material-icons">mic</span>' : '<span class="material-icons">mic_off</span>'; }
  if (c) { c.className = 'ctrl-btn' + (camOn ? '' : ' muted'); c.querySelector('span').innerHTML = camOn ? '<span class="material-icons">videocam</span>' : '<span class="material-icons">videocam_off</span>'; }
}

// Chat in call
function sendChat() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text || !ws) return;
  ws.send(JSON.stringify({ type:'chat', text }));
  input.value = '';
}
function appendChat(msg) {
  const c = document.getElementById('chatMsgs');
  if (!c) return;
  const isMe = msg.fromId === myId;
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (isMe ? 'mine' : 'other');
  div.innerHTML = `${!isMe ? `<div class="chat-msg-name">${esc(msg.fromName)}</div>` : ''}
    <div class="chat-msg-text">${esc(msg.text)}</div>
    <div class="chat-msg-time">${fmtTs(msg.timestamp)}</div>`;
  c.appendChild(div);
  c.scrollTop = c.scrollHeight;
}

// Panel tabs
function switchPanelTab(btn, show, hide) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const showEl = document.getElementById(show);
  const hideEl = document.getElementById(hide);
  if (showEl) showEl.style.display = 'flex';
  if (hideEl) hideEl.style.display = 'none';
}
function toggleRightPanel() {
  const p = document.getElementById('liveRightPanel');
  if (p) p.style.display = (p.style.display === 'none') ? 'flex' : 'none';
}
function openBroadcastPanel()  { document.getElementById('broadcastPanel').style.display = ''; }
function closeBroadcastPanel() { document.getElementById('broadcastPanel').style.display = 'none'; }
function sendBroadcast() {
  const text = document.getElementById('broadcastText').value.trim();
  if (!text) return;
  ws?.send(JSON.stringify({ type:'notification', text }));
  // also add to chat as system announcement
  appendChat({ fromId:'system', fromName:'Announcement', text, timestamp: Date.now() });
  document.getElementById('broadcastText').value = '';
  closeBroadcastPanel();
  showToast('Broadcast sent to all students');
}

function toggleRecording() {
  isRecording = !isRecording;
  document.getElementById('recBtn').textContent = isRecording ? '⏹ Stop Rec' : '⏺ Record';
  document.getElementById('recBtn').style.color = isRecording ? '#ef4444' : '';
  showToast(isRecording ? 'Recording started' : 'Recording stopped');
}

function updateParticipantsList() {
  const list = document.getElementById('participantsList');
  if (!list) return;
  list.innerHTML = '';
  const tr = document.createElement('div');
  tr.className = 'participant-row';
  tr.innerHTML = `<div class="participant-ava" style="background:linear-gradient(135deg,#0d9488,#0f766e)">${teacherInitials}</div><div class="participant-name">${esc(teacherName)}</div><span class="participant-role">Host</span>`;
  list.appendChild(tr);
  Object.values(onlineStudents).forEach(p => {
    const r = document.createElement('div'); r.className = 'participant-row';
    r.innerHTML = `<div class="participant-ava" style="background:linear-gradient(135deg,#6366f1,#4f46e5)">${initials(p.name)}</div><div class="participant-name">${esc(p.name)}</div><span class="participant-role">Student</span>`;
    list.appendChild(r);
  });
}

function updateLiveScheduleDisplay() {
  const info = document.getElementById('scheduledInfo');
  const sched = getScheduledSession();
  if (!info) return;
  if (sched) {
    info.style.display = 'flex';
    info.innerHTML = `<span><strong>Upcoming:</strong> ${esc(sched.title)} at ${fmtDate(sched.datetime)}</span>`;
  } else {
    info.style.display = 'none';
  }
}

// ── Toast ─────────────────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  let t = document.querySelector('.toast-notif'); if (t) t.remove();
  t = document.createElement('div');
  t.className = 'toast-notif';
  t.textContent = msg;
  document.body.appendChild(t);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.remove(), 3200);
}

// ════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Init page display states — only active page shows
  document.querySelectorAll('.page').forEach(p => {
    if (!p.classList.contains('active')) p.style.display = 'none';
  });

  renderDashboard();
  buildInviteList();

  roomId = 'room-' + teacherEmail.split('@')[0];
  connectWS();
});
