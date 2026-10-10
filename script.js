/* ============================================================
   Student Analytics — College Management (front-end only)
   Data lives in a JS array and is persisted to localStorage.
   No backend. Clean & commented.
   ============================================================ */

/* ------------------------------------------------------------
   1. SAMPLE DATA — 7 students, 5 subjects each.
   Each subject: total classes, attended classes, marks /100.
   Attendance % and grades are calculated, never stored.
   ------------------------------------------------------------ */
const SAMPLE_STUDENTS = [
  { id: 'STU-101', password: '1234', name: 'Aarav Sharma',  course: 'B.Sc. Computer Science', semester: '3', roll: 'CS-101',
    subjects: [
      { name: 'Programming',  total: 40, attended: 36, marks: 82 },
      { name: 'Mathematics',  total: 40, attended: 22, marks: 48 },
      { name: 'Data Structures', total: 40, attended: 38, marks: 91 },
      { name: 'English',      total: 40, attended: 34, marks: 74 },
      { name: 'Statistics',   total: 40, attended: 30, marks: 66 },
    ] },
  { id: 'STU-102', password: '1234', name: 'Diya Patel',    course: 'B.Sc. Computer Science', semester: '3', roll: 'CS-102',
    subjects: [
      { name: 'Programming',  total: 40, attended: 39, marks: 88 },
      { name: 'Mathematics',  total: 40, attended: 37, marks: 79 },
      { name: 'Data Structures', total: 40, attended: 40, marks: 95 },
      { name: 'English',      total: 40, attended: 35, marks: 81 },
      { name: 'Statistics',   total: 40, attended: 38, marks: 85 },
    ] },
  { id: 'STU-103', password: '1234', name: 'Kabir Singh',   course: 'BCA', semester: '3', roll: 'BCA-103',
    subjects: [
      { name: 'Web Development', total: 40, attended: 20, marks: 35 },
      { name: 'Mathematics',  total: 40, attended: 28, marks: 52 },
      { name: 'Networking',   total: 40, attended: 33, marks: 70 },
      { name: 'English',      total: 40, attended: 31, marks: 63 },
      { name: 'DBMS',         total: 40, attended: 27, marks: 58 },
    ] },
  { id: 'STU-104', password: '1234', name: 'Meera Nair',    course: 'BCA', semester: '3', roll: 'BCA-104',
    subjects: [
      { name: 'Web Development', total: 40, attended: 34, marks: 77 },
      { name: 'Mathematics',  total: 40, attended: 36, marks: 83 },
      { name: 'Networking',   total: 40, attended: 32, marks: 68 },
      { name: 'English',      total: 40, attended: 38, marks: 90 },
      { name: 'DBMS',         total: 40, attended: 35, marks: 72 },
    ] },
  { id: 'STU-105', password: '1234', name: 'Rohan Gupta',   course: 'B.Com', semester: '3', roll: 'COM-105',
    subjects: [
      { name: 'Accounting',   total: 40, attended: 30, marks: 55 },
      { name: 'Economics',    total: 40, attended: 29, marks: 49 },
      { name: 'Business Law', total: 40, attended: 24, marks: 44 },
      { name: 'English',      total: 40, attended: 33, marks: 61 },
      { name: 'Taxation',     total: 40, attended: 31, marks: 57 },
    ] },
  { id: 'STU-106', password: '1234', name: 'Ananya Rao',    course: 'B.Com', semester: '3', roll: 'COM-106',
    subjects: [
      { name: 'Accounting',   total: 40, attended: 40, marks: 93 },
      { name: 'Economics',    total: 40, attended: 38, marks: 86 },
      { name: 'Business Law', total: 40, attended: 36, marks: 78 },
      { name: 'English',      total: 40, attended: 37, marks: 82 },
      { name: 'Taxation',     total: 40, attended: 39, marks: 89 },
    ] },
  { id: 'STU-107', password: '1234', name: 'Ishaan Verma',  course: 'B.Sc. Computer Science', semester: '3', roll: 'CS-107',
    subjects: [
      { name: 'Programming',  total: 40, attended: 26, marks: 60 },
      { name: 'Mathematics',  total: 40, attended: 25, marks: 42 },
      { name: 'Data Structures', total: 40, attended: 30, marks: 64 },
      { name: 'English',      total: 40, attended: 28, marks: 55 },
      { name: 'Statistics',   total: 40, attended: 27, marks: 50 },
    ] },
];

const ADMIN = { id: 'admin', password: 'admin' };
const MIN_ATTENDANCE = 75;

/* Respect the user's motion preference */
const REDUCED = typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------
   2. localStorage — all reads/writes wrapped in try/catch so a
   disabled/full/private-mode storage never breaks the app.
   ------------------------------------------------------------ */
const STORAGE_KEY = 'studentanalytics_data';
const SESSION_KEY = 'studentanalytics_session';

function safeParse(str) {
  try { return JSON.parse(str); } catch (e) { return null; }
}

function loadStudents() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }

  if (saved) {
    const parsed = safeParse(saved);
    // Guard against corrupted data — fall back to seed if it isn't a valid array.
    if (Array.isArray(parsed) && parsed.length && parsed.every(s => s && Array.isArray(s.subjects))) {
      return parsed;
    }
  }
  // Seed sample data only when storage is empty / invalid.
  const seed = JSON.parse(JSON.stringify(SAMPLE_STUDENTS));
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch (e) { /* ignore */ }
  return seed;
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    toast('Could not save — browser storage is unavailable or full.', 'err');
  }
}

/* Session (sessionStorage): keeps the admin/student protected on reload. */
function setSession(role, id) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ role, id })); } catch (e) { /* ignore */ }
}
function getSession() {
  try { return safeParse(sessionStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}
function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
}

let students = loadStudents();
let currentStudentId = null;   // logged-in student
let editingId = null;          // student being edited in modal (null = adding)
let activity = [];             // recent activity log (session only)
const charts = {};             // keep Chart.js instances so we can rebuild them
const firstLoad = new Set();   // tracks first render of each tab (skeletons / count-up)

/* ------------------------------------------------------------
   3. CALCULATION HELPERS (single source of truth for every view)
   ------------------------------------------------------------ */
const subjectAttendance = (s) => s.total > 0 ? Math.round((s.attended / s.total) * 100) : 0;

function overallAttendance(stu) {
  let a = 0, t = 0;
  stu.subjects.forEach(s => { a += s.attended; t += s.total; });
  return t > 0 ? Math.round((a / t) * 100) : 0;
}
function averageMarks(stu) {
  if (!stu.subjects.length) return 0;
  return Math.round(stu.subjects.reduce((sum, s) => sum + s.marks, 0) / stu.subjects.length);
}
function gradeFor(m) {
  if (m >= 80) return 'A';
  if (m >= 65) return 'B';
  if (m >= 50) return 'C';
  if (m >= 40) return 'D';
  return 'F';
}
// Performance tier from overall attendance + average marks
function performance(stu) {
  const att = overallAttendance(stu), avg = averageMarks(stu);
  if (att < 60 || avg < 40) return 'risk';
  if (att >= 75 && avg >= 65) return 'good';
  return 'improve';
}
const PERF_LABEL = { good: 'Good', improve: 'Needs improvement', risk: 'At risk' };
const PERF_BADGE = { good: 'badge-good', improve: 'badge-improve', risk: 'badge-risk' };

// Safe average over a list of students (no divide-by-zero / NaN)
function avgOf(list, fn) {
  if (!list.length) return 0;
  return Math.round(list.reduce((sum, s) => sum + fn(s), 0) / list.length);
}

// color helpers for attendance values / bars
function attColor(pct) { return pct >= 75 ? 'val-green' : pct >= 60 ? 'val-orange' : 'val-red'; }
function fillColor(pct) { return pct >= 75 ? 'fill-green' : pct >= 60 ? 'fill-orange' : 'fill-red'; }

// classes still needed to reach 75%:  (0.75*total - attended) / 0.25
function classesNeeded(s) {
  return Math.max(0, Math.ceil((0.75 * s.total - s.attended) / 0.25));
}
// initials for avatars, e.g. "Aarav Sharma" -> "AS" (safe for 1-word / empty names)
function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts.map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
// escape user-entered text before putting it in innerHTML (names, courses, etc.)
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// unique course list
const allCourses = () => [...new Set(students.map(s => s.course))];

/* Activity log with real-looking timestamps */
function fmtTime(d) {
  return d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
}
function logActivity(text) {
  activity.unshift({ text, at: Date.now() });
  activity = activity.slice(0, 6);
}
function relTime(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 45) return 'just now';
  if (diff < 90) return '1 min ago';
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 7200) return '1 hr ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago';
  return fmtTime(new Date(ts));
}

/* ------------------------------------------------------------
   SAFE LIBRARY WRAPPERS
   If the Chart.js / Lucide CDN scripts fail to load (e.g. offline),
   these keep the app working instead of throwing.
   ------------------------------------------------------------ */
function drawIcons() {
  try { if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons(); }
  catch (e) { /* ignore */ }
}

/* ------------------------------------------------------------
   TOASTS — bottom-right, replace alert()
   ------------------------------------------------------------ */
const ICON_MARKUP = {
  ok: '<i data-lucide="check-circle-2"></i>',
  err: '<i data-lucide="alert-circle"></i>',
  info: '<i data-lucide="info"></i>',
};
function toast(message, type = 'ok') {
  const host = document.getElementById('toastHost');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'err' ? 'err' : type === 'info' ? 'info' : 'ok');
  el.setAttribute('role', 'status');
  el.innerHTML = (ICON_MARKUP[type] || ICON_MARKUP.ok) + '<span>' + esc(message) + '</span>';
  host.appendChild(el);
  drawIcons();
  const life = REDUCED ? 2600 : 3200;
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  }, life);
}

/* ------------------------------------------------------------
   COUNT-UP + SKELETONS
   ------------------------------------------------------------ */
function animateValue(el, to, suffix, key) {
  if (!el) return;
  // only animate the first time we show a given stat; otherwise set directly
  if (REDUCED || (key && firstLoad.has('stat:' + key))) {
    el.textContent = to + (suffix || '');
    return;
  }
  if (key) firstLoad.add('stat:' + key);
  const dur = 650, start = performance.now();
  (function step(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(to * eased) + (suffix || '');
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
}

function skeletonRows(cols, rows) {
  let html = '';
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
      const w = c === 0 ? '60%' : (40 + ((r + c) % 3) * 12) + '%';
      html += '<td><span class="skeleton sk-cell" style="width:' + w + '"></span></td>';
    }
    html += '</tr>';
  }
  return html;
}
// animate attendance progress bars from 0 -> value after insert
function animateBars(scope) {
  (scope || document).querySelectorAll('.progress-fill[data-w]').forEach(bar => {
    const w = bar.dataset.w + '%';
    if (REDUCED) { bar.style.width = w; return; }
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = w; }));
  });
}
// trigger the staggered card animation on a grid (first load only)
function animateCards(grid, key) {
  if (!grid || REDUCED || firstLoad.has('cards:' + key)) return;
  firstLoad.add('cards:' + key);
  grid.classList.remove('animate');
  void grid.offsetWidth; // reflow so the animation restarts
  grid.classList.add('animate');
}

/* ------------------------------------------------------------
   4. PAGE SWITCHING (login / student / admin) + route guard
   ------------------------------------------------------------ */
const loginPage = document.getElementById('loginPage');
const studentPage = document.getElementById('studentPage');
const adminPage = document.getElementById('adminPage');

function showPage(which) {
  // Route guard: student/admin areas require a matching session.
  const sess = getSession();
  if (which === 'admin' && (!sess || sess.role !== 'admin')) which = 'login';
  if (which === 'student' && (!sess || sess.role !== 'student')) which = 'login';

  loginPage.classList.toggle('hidden', which !== 'login');
  studentPage.classList.toggle('hidden', which !== 'student');
  adminPage.classList.toggle('hidden', which !== 'admin');
  window.scrollTo(0, 0);
  drawIcons();
}

/* ------------------------------------------------------------
   5. LOGIN
   ------------------------------------------------------------ */
let selectedRole = 'student';
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    selectedRole = btn.dataset.role;
    document.getElementById('loginId').placeholder = selectedRole === 'admin' ? 'admin' : 'e.g. STU-101';
  });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('loginId').value.trim();
  const pw = document.getElementById('loginPw').value;
  const err = document.getElementById('loginError');

  if (!id || !pw) {
    err.textContent = 'Please enter both your ID and password.';
    err.classList.remove('hidden');
    return;
  }

  // Admin login (works whenever admin credentials are entered).
  if (id.toLowerCase() === ADMIN.id && pw === ADMIN.password) {
    err.classList.add('hidden');
    e.target.reset();
    setSession('admin', 'admin');
    showPage('admin');
    initAdmin();
    return;
  }

  // Otherwise try to match a student.
  const stu = students.find(s => s.id.toLowerCase() === id.toLowerCase() && s.password === pw);
  if (stu) {
    err.classList.add('hidden');
    e.target.reset();
    currentStudentId = stu.id;
    setSession('student', stu.id);
    showPage('student');
    renderStudentDashboard(stu);
  } else {
    err.textContent = 'Invalid ID or password.';
    err.classList.remove('hidden');
  }
});

/* ------------------------------------------------------------
   6. STUDENT DASHBOARD
   ------------------------------------------------------------ */
function renderStudentDashboard(stu) {
  document.getElementById('stuGreeting').textContent = 'Hi, ' + stu.name.split(' ')[0];
  document.getElementById('stuMeta').textContent = `${stu.course} • Semester ${stu.semester} • ${stu.id}`;

  const att = overallAttendance(stu), avg = averageMarks(stu);
  const attEl = document.getElementById('stuAttendance');
  attEl.className = 'stat-value'; // feature card keeps white text via CSS
  animateValue(attEl, att, '%', 'stuAtt');
  animateValue(document.getElementById('stuMarks'), avg, '%', 'stuMarks');
  document.getElementById('stuGrade').textContent = gradeFor(avg);

  const grid = document.querySelector('#studentPage .cards-grid');
  animateCards(grid, 'student');

  // subject table
  const body = document.getElementById('stuSubjectBody');
  if (!stu.subjects.length) {
    body.innerHTML = emptyRow(5, 'book-open', 'No subjects yet', 'Subjects will appear here once they are added.');
  } else {
    body.innerHTML = stu.subjects.map(s => {
      const sa = subjectAttendance(s);
      const atRisk = sa < MIN_ATTENDANCE || s.marks < 40;
      const badge = atRisk ? '<span class="badge badge-risk">At risk</span>' : '<span class="badge badge-good">Good</span>';
      return `<tr>
        <td>${esc(s.name)}</td>
        <td class="num ${attColor(sa)}">${sa}%</td>
        <td class="num">${s.marks}/100</td>
        <td>${gradeFor(s.marks)}</td>
        <td>${badge}</td>
      </tr>`;
    }).join('');
  }

  // warning banner (icon instead of emoji)
  const low = stu.subjects.filter(s => subjectAttendance(s) < MIN_ATTENDANCE);
  const banner = document.getElementById('stuWarning');
  if (low.length) {
    const lines = low.map(s => {
      const n = classesNeeded(s);
      return `You need <strong>${n}</strong> more class${n === 1 ? '' : 'es'} in ${esc(s.name)} to reach 75%.`;
    });
    banner.innerHTML = `<strong><i data-lucide="alert-triangle"></i> Low attendance warning</strong>${lines.join('<br>')}`;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }

  buildChart('stuChart', 'bar', {
    labels: stu.subjects.map(s => s.name),
    datasets: [{ label: 'Marks /100', data: stu.subjects.map(s => s.marks), backgroundColor: '#1F6B4F', borderRadius: 8, maxBarThickness: 54 }],
  }, { scales: { y: { beginAtZero: true, max: 100 }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } });

  drawIcons();
}

document.getElementById('studentLogout').addEventListener('click', () => {
  currentStudentId = null;
  clearSession();
  showPage('login');
});

/* Small helper: an empty-state row that spans the whole table */
function emptyRow(cols, icon, title, sentence) {
  return `<tr><td colspan="${cols}">
    <div class="empty-state">
      <i data-lucide="${icon}"></i>
      <p>${esc(title)}</p>
      <span>${esc(sentence)}</span>
    </div></td></tr>`;
}

/* (Re)build a Chart.js chart by canvas id, destroying any previous instance */
function buildChart(id, type, data, options) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (typeof Chart === 'undefined') {
    const wrap = canvas.parentElement;
    if (wrap) wrap.innerHTML = '<p class="muted" style="text-align:center;padding:40px">Chart unavailable (Chart.js could not load — check your connection).</p>';
    return;
  }
  if (charts[id]) { charts[id].destroy(); delete charts[id]; }
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    animation: REDUCED ? false : { duration: 800, easing: 'easeOutQuart' },
    font: { family: "'Inter', sans-serif" },
  };
  charts[id] = new Chart(canvas.getContext('2d'), {
    type, data, options: Object.assign(base, options),
  });
}

/* ============================================================
   7. ADMIN PANEL
   ============================================================ */
const TAB_TITLES = {
  dashboard: 'Dashboard', students: 'Students', attendance: 'Attendance',
  marks: 'Marks & Results', analytics: 'Analytics & Reports', about: 'About Project',
};

const sideLinks = document.querySelectorAll('.side-link');
const sideIndicator = document.querySelector('.side-indicator');

sideLinks.forEach(link => {
  link.addEventListener('click', () => switchTab(link.dataset.tab));
});

function moveIndicator(tab) {
  const link = [...sideLinks].find(l => l.dataset.tab === tab);
  if (!link || !sideIndicator) return;
  sideIndicator.style.height = link.offsetHeight + 'px';
  sideIndicator.style.transform = 'translateY(' + link.offsetTop + 'px)';
}

function switchTab(tab) {
  sideLinks.forEach(l => l.classList.toggle('active', l.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== tab));
  document.getElementById('tabTitle').textContent = TAB_TITLES[tab];
  moveIndicator(tab);

  if (tab === 'dashboard') renderAdminDashboard();
  if (tab === 'students') renderStudentsTab();
  if (tab === 'attendance') renderAttendanceTab();
  if (tab === 'marks') renderMarksTab();
  if (tab === 'analytics') renderAnalyticsTab();

  closeSidebar();
  drawIcons();
}

/* First-time admin setup */
function initAdmin() {
  if (!activity.length) {
    // seed with a couple of real-looking recent timestamps
    activity = [
      { text: 'System loaded ' + students.length + ' student records', at: Date.now() - 1000 * 60 * 2 },
      { text: 'Welcome back, Admin User', at: Date.now() - 1000 * 60 * 9 },
    ];
  }
  // reset first-load tracking so skeletons/count-up play on a fresh login
  firstLoad.clear();
  switchTab('dashboard');
  requestAnimationFrame(() => moveIndicator('dashboard'));
}

document.getElementById('adminLogout').addEventListener('click', () => {
  clearSession();
  showPage('login');
});

window.addEventListener('resize', () => {
  const active = document.querySelector('.side-link.active');
  if (active && !adminPage.classList.contains('hidden')) moveIndicator(active.dataset.tab);
});

/* ---------- Mobile sidebar drawer ---------- */
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
function openSidebar()  { sidebar.classList.add('open'); overlay.classList.add('show'); }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
document.getElementById('hamburger').addEventListener('click', openSidebar);
overlay.addEventListener('click', closeSidebar);

/* ---------- TAB 1: DASHBOARD ---------- */
function renderAdminDashboard() {
  const avgAtt = avgOf(students, overallAttendance);
  const avgMk = avgOf(students, averageMarks);
  const risk = students.filter(st => performance(st) === 'risk').length;

  animateValue(document.getElementById('dTotal'), students.length, '', 'dTotal');
  animateValue(document.getElementById('dAtt'), avgAtt, '%', 'dAtt');
  animateValue(document.getElementById('dMarks'), avgMk, '%', 'dMarks');
  animateValue(document.getElementById('dRisk'), risk, '', 'dRisk');

  animateCards(document.querySelector('#adminPage .cols-4'), 'admin');

  document.getElementById('lastUpdated').textContent = fmtTime(new Date());

  // average marks per course (guarded against empty)
  const courses = allCourses();
  const courseAvg = courses.map(c => avgOf(students.filter(s => s.course === c), averageMarks));

  const activityEl = document.getElementById('activityList');

  const paint = () => {
    buildChart('courseChart', 'bar', {
      labels: courses,
      datasets: [{ label: 'Avg Marks', data: courseAvg, backgroundColor: '#1F6B4F', borderRadius: 8, maxBarThickness: 60 }],
    }, { scales: { y: { beginAtZero: true, max: 100 }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } });

    activityEl.innerHTML = activity.length
      ? activity.map(a => `<li><span class="activity-dot"></span>${esc(a.text)}<span class="act-time">${relTime(a.at)}</span></li>`).join('')
      : '<li class="muted">No recent activity.</li>';
    drawIcons();
  };

  // Skeleton on first load only
  if (!firstLoad.has('dashboard')) {
    firstLoad.add('dashboard');
    activityEl.innerHTML = '<li><span class="skeleton sk-line" style="width:100%"></span></li>'.repeat(4);
    if (!courses.length) { paint(); return; }
    const wrap = document.querySelector('[data-panel="dashboard"] .chart-wrap');
    if (wrap && !REDUCED) {
      const sk = document.createElement('div');
      sk.className = 'skeleton sk-chart';
      wrap.appendChild(sk);
    }
    setTimeout(paint, 300);
  } else {
    paint();
  }
}

/* ---------- TAB 2: STUDENTS ---------- */
const studentSearch = document.getElementById('studentSearch');
const courseFilter = document.getElementById('courseFilter');

function renderStudentsTab() {
  if (courseFilter.options.length === 0) {
    courseFilter.innerHTML = '<option value="">All courses</option>' +
      allCourses().map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  }

  const q = studentSearch.value.trim().toLowerCase();
  const course = courseFilter.value;
  const list = students.filter(s =>
    (!course || s.course === course) &&
    (!q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
  );

  document.getElementById('studentCount').textContent = `${list.length} student${list.length === 1 ? '' : 's'}`;

  const body = document.getElementById('studentsBody');

  const paint = () => {
    if (!list.length) {
      body.innerHTML = q || course
        ? emptyRow(7, 'search-x', 'No students found', 'Try a different name, ID or course filter.')
        : emptyRow(7, 'users', 'No students yet', 'Click “Add student” to create your first record.');
      drawIcons();
      return;
    }
    body.innerHTML = list.map(s => {
      const att = overallAttendance(s), avg = averageMarks(s), perf = performance(s);
      return `<tr>
        <td>
          <div class="student-cell">
            <span class="avatar green">${initials(s.name)}</span>
            <div><div class="sc-name" title="${esc(s.name)}">${esc(s.name)}</div><div class="sc-id">${esc(s.id)}</div></div>
          </div>
        </td>
        <td>${esc(s.course)}</td>
        <td>Sem ${esc(s.semester)}</td>
        <td>
          <div class="progress-cell">
            <div class="progress-top"><span>${att}%</span></div>
            <div class="progress-track"><div class="progress-fill ${fillColor(att)}" data-w="${att}"></div></div>
          </div>
        </td>
        <td class="num">${avg}%</td>
        <td><span class="badge ${PERF_BADGE[perf]}">${PERF_LABEL[perf]}</span></td>
        <td>
          <div class="row-actions">
            <button title="View" aria-label="View ${esc(s.name)}" data-view="${esc(s.id)}"><i data-lucide="eye"></i></button>
            <button title="Edit" aria-label="Edit ${esc(s.name)}" data-edit="${esc(s.id)}"><i data-lucide="pencil"></i></button>
            <button title="Delete" aria-label="Delete ${esc(s.name)}" class="act-delete" data-del="${esc(s.id)}"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
    drawIcons();
    animateBars(body);
  };

  if (!firstLoad.has('students')) {
    firstLoad.add('students');
    body.innerHTML = skeletonRows(7, Math.min(5, Math.max(3, list.length || 4)));
    setTimeout(paint, 300);
  } else {
    paint();
  }
}

studentSearch.addEventListener('input', () => { firstLoad.add('students'); renderStudentsTab(); });
courseFilter.addEventListener('change', () => { firstLoad.add('students'); renderStudentsTab(); });

// Top search box mirrors the students search
document.getElementById('topSearch').addEventListener('input', (e) => {
  studentSearch.value = e.target.value;
  firstLoad.add('students'); // don't re-skeleton on every keystroke
  if (document.querySelector('[data-panel="students"]').classList.contains('hidden')) {
    switchTab('students');
  } else {
    renderStudentsTab();
  }
});

// Row action buttons (view / edit / delete) — event delegation
document.getElementById('studentsBody').addEventListener('click', (e) => {
  const view = e.target.closest('[data-view]');
  const edit = e.target.closest('[data-edit]');
  const del = e.target.closest('[data-del]');
  if (view) openViewModal(view.dataset.view);
  else if (edit) openModal(edit.dataset.edit);
  else if (del) deleteStudent(del.dataset.del);
});

function deleteStudent(id) {
  const stu = students.find(s => s.id === id);
  if (!stu) return;
  if (!confirm(`Delete ${stu.name} (${id})? This cannot be undone.`)) return;
  students = students.filter(s => s.id !== id);
  saveStudents();
  logActivity('Deleted student ' + stu.name);
  renderStudentsTab();
  toast(`Deleted ${stu.name}.`, 'info');
}

/* ---------- TAB 3: ATTENDANCE ---------- */
const attCourse = document.getElementById('attCourse');
const attSubject = document.getElementById('attSubject');

function renderAttendanceTab() {
  fillCourseSelect(attCourse);
  fillSubjectSelect(attCourse.value, attSubject);
  const dateEl = document.getElementById('attDate');
  if (!dateEl.value) dateEl.value = new Date().toISOString().slice(0, 10);
  renderAttendanceList();
}

function renderAttendanceList() {
  const course = attCourse.value, subject = attSubject.value;
  const list = students.filter(s => s.course === course && s.subjects.some(x => x.name === subject));
  const body = document.getElementById('attendanceBody');

  if (!list.length) {
    body.innerHTML = emptyRow(3, 'calendar-x', 'Nothing to mark', 'Pick a course and subject that has enrolled students.');
    drawIcons();
    return;
  }

  body.innerHTML = list.map(s => {
    const sub = s.subjects.find(x => x.name === subject);
    const pct = subjectAttendance(sub);
    return `<tr>
      <td><div class="student-cell"><span class="avatar green">${initials(s.name)}</span>
          <div><div class="sc-name" title="${esc(s.name)}">${esc(s.name)}</div><div class="sc-id">${esc(s.id)}</div></div></div></td>
      <td class="num ${attColor(pct)}">${pct}%</td>
      <td>
        <div class="toggle-group" data-student="${esc(s.id)}" role="group" aria-label="Attendance for ${esc(s.name)}">
          <button type="button" class="att-present on-present" data-val="present">Present</button>
          <button type="button" class="att-absent" data-val="absent">Absent</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  // toggle buttons (default: present)
  document.querySelectorAll('#attendanceBody .toggle-group').forEach(group => {
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('button').forEach(b => b.classList.remove('on-present', 'on-absent'));
        btn.classList.add(btn.dataset.val === 'present' ? 'on-present' : 'on-absent');
      });
    });
  });
  drawIcons();
}

attCourse.addEventListener('change', () => { fillSubjectSelect(attCourse.value, attSubject); renderAttendanceList(); });
attSubject.addEventListener('change', renderAttendanceList);

// Saving: "present" adds one attended + one total; "absent" adds only one total
document.getElementById('saveAttendance').addEventListener('click', () => {
  const subject = attSubject.value;
  const groups = document.querySelectorAll('#attendanceBody .toggle-group');
  if (!subject || !groups.length) { toast('Nothing to save for this selection.', 'err'); return; }

  groups.forEach(group => {
    const stu = students.find(s => s.id === group.dataset.student);
    if (!stu) return;
    const sub = stu.subjects.find(x => x.name === subject);
    if (!sub) return;
    const marked = group.querySelector('.on-present, .on-absent');
    const isPresent = marked && marked.classList.contains('on-present');
    sub.total += 1;
    if (isPresent) sub.attended += 1;
  });
  saveStudents();
  logActivity('Saved attendance for ' + subject);
  renderAttendanceList();
  toast('Attendance saved — percentages updated.', 'ok');
});

/* ---------- TAB 4: MARKS & RESULTS ---------- */
const marksCourse = document.getElementById('marksCourse');
const marksSubject = document.getElementById('marksSubject');

function renderMarksTab() {
  fillCourseSelect(marksCourse);
  fillSubjectSelect(marksCourse.value, marksSubject);
  renderMarksList();
}

function renderMarksList() {
  const course = marksCourse.value, subject = marksSubject.value;
  const list = students.filter(s => s.course === course && s.subjects.some(x => x.name === subject));
  const body = document.getElementById('marksBody');

  if (!list.length) {
    body.innerHTML = emptyRow(3, 'file-x', 'No marks to edit', 'Pick a course and subject that has enrolled students.');
    drawIcons();
    return;
  }

  body.innerHTML = list.map(s => {
    const sub = s.subjects.find(x => x.name === subject);
    return `<tr>
      <td><div class="student-cell"><span class="avatar green">${initials(s.name)}</span>
          <div><div class="sc-name" title="${esc(s.name)}">${esc(s.name)}</div><div class="sc-id">${esc(s.id)}</div></div></div></td>
      <td class="num"><input type="number" min="0" max="100" step="1" class="mark-input" value="${sub.marks}" data-student="${esc(s.id)}" aria-label="Marks for ${esc(s.name)}" /></td>
      <td><span class="grade-cell">${gradeFor(sub.marks)}</span></td>
    </tr>`;
  }).join('');

  // live grade preview + clamp as you type
  document.querySelectorAll('#marksBody .mark-input').forEach(inp => {
    inp.addEventListener('input', () => {
      const val = Math.max(0, Math.min(100, Math.round(Number(inp.value) || 0)));
      inp.closest('tr').querySelector('.grade-cell').textContent = gradeFor(val);
    });
  });
  drawIcons();
}

marksCourse.addEventListener('change', () => { fillSubjectSelect(marksCourse.value, marksSubject); renderMarksList(); });
marksSubject.addEventListener('change', renderMarksList);

document.getElementById('saveMarks').addEventListener('click', () => {
  const subject = marksSubject.value;
  const inputs = document.querySelectorAll('#marksBody .mark-input');
  if (!subject || !inputs.length) { toast('Nothing to save for this selection.', 'err'); return; }

  inputs.forEach(inp => {
    const stu = students.find(s => s.id === inp.dataset.student);
    if (!stu) return;
    const sub = stu.subjects.find(x => x.name === subject);
    if (!sub) return;
    sub.marks = Math.max(0, Math.min(100, Math.round(Number(inp.value) || 0)));
  });
  saveStudents();
  logActivity('Updated marks for ' + subject);
  renderMarksList();
  toast('Marks saved — grades recalculated.', 'ok');
});

/* Shared select fillers for attendance/marks tabs */
function fillCourseSelect(sel) {
  const prev = sel.value;
  sel.innerHTML = allCourses().map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  if (prev && allCourses().includes(prev)) sel.value = prev;
}
function fillSubjectSelect(course, sel) {
  const subs = [...new Set(students.filter(s => s.course === course).flatMap(s => s.subjects.map(x => x.name)))];
  const prev = sel.value;
  sel.innerHTML = subs.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
  if (prev && subs.includes(prev)) sel.value = prev;
}

/* ---------- TAB 5: ANALYTICS & REPORTS ---------- */
function renderAnalyticsTab() {
  const dist = { good: 0, improve: 0, risk: 0 };
  students.forEach(s => dist[performance(s)]++);
  buildChart('perfChart', 'doughnut', {
    labels: ['Good', 'Needs improvement', 'At risk'],
    datasets: [{ data: [dist.good, dist.improve, dist.risk], backgroundColor: ['#1F6B4F', '#E8A04C', '#DC2626'], borderWidth: 0 }],
  }, { plugins: { legend: { position: 'bottom' } }, cutout: '60%' });

  const courses = allCourses();
  const attByCourse = courses.map(c => avgOf(students.filter(s => s.course === c), overallAttendance));
  buildChart('attCourseChart', 'bar', {
    labels: courses,
    datasets: [{ label: 'Avg Attendance %', data: attByCourse, backgroundColor: '#E8A04C', borderRadius: 8, maxBarThickness: 60 }],
  }, { scales: { y: { beginAtZero: true, max: 100 }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } });

  const top = [...students].sort((a, b) => averageMarks(b) - averageMarks(a)).slice(0, 5);
  document.getElementById('topStudents').innerHTML = top.length
    ? top.map(s => `<li><div><div class="sc-name" title="${esc(s.name)}">${esc(s.name)}</div><div class="sc-id">${esc(s.course)}</div></div><span class="tl-score">${averageMarks(s)}%</span></li>`).join('')
    : '<li class="muted">No students to rank yet.</li>';
}

/* CSV export of the full student table */
document.getElementById('downloadReport').addEventListener('click', () => {
  if (!students.length) { toast('No students to export.', 'err'); return; }
  const rows = [['Name', 'ID', 'Course', 'Semester', 'Attendance %', 'Avg Marks %', 'Grade', 'Performance']];
  students.forEach(s => {
    const avg = averageMarks(s);
    rows.push([s.name, s.id, s.course, s.semester, overallAttendance(s), avg, gradeFor(avg), PERF_LABEL[performance(s)]]);
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  try {
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_report.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    logActivity('Exported student report (CSV)');
    toast('Report downloaded (student_report.csv).', 'ok');
  } catch (e) {
    toast('Could not generate the CSV file.', 'err');
  }
});

/* Reset demo data (About tab) */
document.getElementById('resetDemo').addEventListener('click', () => {
  if (!confirm('Reset all data back to the original sample students? Your changes will be lost.')) return;
  students = JSON.parse(JSON.stringify(SAMPLE_STUDENTS));
  saveStudents();
  activity = [];
  firstLoad.clear();
  courseFilter.innerHTML = '';
  studentSearch.value = '';
  logActivity('Reset demo data');
  toast('Demo data restored.', 'ok');
  switchTab('dashboard');
});

/* ============================================================
   8. MODALS — Add / Edit / View student
   ============================================================ */
const modalOverlay = document.getElementById('modalOverlay');
const subjectInputs = document.getElementById('subjectInputs');
const DEFAULT_SUBJECTS = ['Programming', 'Mathematics', 'Data Structures', 'English', 'Statistics'];

document.getElementById('addStudentBtn').addEventListener('click', () => openModal(null));
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

function clearFieldErrors() {
  document.querySelectorAll('#studentForm .field-error').forEach(el => { el.classList.add('hidden'); el.textContent = ''; });
  document.querySelectorAll('#studentForm .input-invalid').forEach(el => el.classList.remove('input-invalid'));
  const sErr = document.getElementById('subjectError');
  sErr.classList.add('hidden'); sErr.textContent = '';
}
function setFieldError(id, msg) {
  const input = document.getElementById(id);
  const err = document.querySelector(`#studentForm .field-error[data-err="${id}"]`);
  if (input) input.classList.add('input-invalid');
  if (err) { err.textContent = msg; err.classList.remove('hidden'); }
}

function openModal(id) {
  editingId = id;
  const stu = id ? students.find(s => s.id === id) : null;
  document.getElementById('modalTitle').textContent = stu ? 'Edit Student' : 'Add Student';

  document.getElementById('fName').value = stu ? stu.name : '';
  document.getElementById('fId').value = stu ? stu.id : '';
  document.getElementById('fCourse').value = stu ? stu.course : '';
  document.getElementById('fSemester').value = stu ? stu.semester : '';
  document.getElementById('fRoll').value = stu ? stu.roll : '';
  document.getElementById('fPassword').value = stu ? stu.password : '1234';
  document.getElementById('fId').disabled = !!stu;  // ID is the key; locked when editing

  const subjects = stu ? stu.subjects : DEFAULT_SUBJECTS.map(n => ({ name: n, attended: 0, total: 40, marks: 0 }));
  subjectInputs.innerHTML = subjects.map((s, i) => `
    <div class="subject-row">
      <input class="subj-name" type="text" id="sname-${i}" value="${esc(s.name)}" placeholder="Subject" aria-label="Subject name ${i + 1}" />
      <input type="number" min="0" id="att-${i}" value="${s.attended}" placeholder="Attended" aria-label="Classes attended ${i + 1}" />
      <input type="number" min="1" id="tot-${i}" value="${s.total}" placeholder="Total" aria-label="Total classes ${i + 1}" />
      <input type="number" min="0" max="100" id="mark-${i}" value="${s.marks}" placeholder="Marks" aria-label="Marks ${i + 1}" />
    </div>`).join('');
  subjectInputs.dataset.count = subjects.length;

  clearFieldErrors();
  modalOverlay.classList.remove('hidden');
  drawIcons();
  document.getElementById('fName').focus();
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  editingId = null;
  document.getElementById('studentForm').reset();
  document.getElementById('fId').disabled = false;
  clearFieldErrors();
}

document.getElementById('studentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  clearFieldErrors();

  const name = document.getElementById('fName').value.trim();
  const sid = document.getElementById('fId').value.trim();
  const course = document.getElementById('fCourse').value.trim();
  const semester = document.getElementById('fSemester').value.trim();
  let ok = true;

  if (!name) { setFieldError('fName', 'Name is required.'); ok = false; }
  if (!editingId) {
    if (!sid) { setFieldError('fId', 'Student ID is required.'); ok = false; }
    else if (students.some(s => s.id.toLowerCase() === sid.toLowerCase())) {
      setFieldError('fId', 'A student with that ID already exists.'); ok = false;
    }
  }
  if (!course) { setFieldError('fCourse', 'Course is required.'); ok = false; }
  if (!semester) { setFieldError('fSemester', 'Semester is required.'); ok = false; }

  // Subjects
  const count = Number(subjectInputs.dataset.count);
  const subjects = [];
  const subjErrors = [];
  for (let i = 0; i < count; i++) {
    const nm = document.getElementById(`sname-${i}`).value.trim() || `Subject ${i + 1}`;
    const attended = Math.round(Number(document.getElementById(`att-${i}`).value) || 0);
    const total = Math.round(Number(document.getElementById(`tot-${i}`).value) || 0);
    const marks = Math.round(Number(document.getElementById(`mark-${i}`).value) || 0);

    if (total < 1) subjErrors.push(`${nm}: total classes must be at least 1.`);
    else if (attended < 0) subjErrors.push(`${nm}: attended cannot be negative.`);
    else if (attended > total) subjErrors.push(`${nm}: attended (${attended}) cannot exceed total (${total}).`);
    if (marks < 0 || marks > 100) subjErrors.push(`${nm}: marks must be between 0 and 100.`);

    subjects.push({ name: nm, attended, total: Math.max(1, total), marks: Math.max(0, Math.min(100, marks)) });
  }
  if (subjErrors.length) {
    const sErr = document.getElementById('subjectError');
    sErr.innerHTML = subjErrors.map(esc).join('<br>');
    sErr.classList.remove('hidden');
    ok = false;
  }

  if (!ok) { toast('Please fix the highlighted fields.', 'err'); return; }

  const data = {
    id: editingId || sid,
    password: document.getElementById('fPassword').value.trim() || '1234',
    name, course, semester,
    roll: document.getElementById('fRoll').value.trim(),
    subjects,
  };

  if (editingId) {
    const idx = students.findIndex(s => s.id === editingId);
    students[idx] = data;
    logActivity('Edited student ' + data.name);
    toast(`Saved changes to ${data.name}.`, 'ok');
  } else {
    students.push(data);
    logActivity('Added student ' + data.name);
    toast(`Student ${data.name} added.`, 'ok');
  }
  saveStudents();
  closeModal();
  courseFilter.innerHTML = '';   // rebuild filter so new courses appear
  firstLoad.add('students');     // avoid skeleton flash after a save
  renderStudentsTab();
});

/* View (read-only) modal */
const viewOverlay = document.getElementById('viewOverlay');
document.getElementById('viewClose').addEventListener('click', () => viewOverlay.classList.add('hidden'));
viewOverlay.addEventListener('click', (e) => { if (e.target === viewOverlay) viewOverlay.classList.add('hidden'); });

function openViewModal(id) {
  const s = students.find(x => x.id === id);
  if (!s) return;
  document.getElementById('viewTitle').textContent = s.name;
  const rows = s.subjects.map(sub =>
    `<div class="view-row"><span>${esc(sub.name)}</span><span>${subjectAttendance(sub)}% att · ${sub.marks}/100 · ${gradeFor(sub.marks)}</span></div>`
  ).join('');
  document.getElementById('viewBody').innerHTML = `
    <p class="view-meta">${esc(s.course)} • Semester ${esc(s.semester)} • ${esc(s.id)} • Roll ${esc(s.roll)}</p>
    <div class="view-row"><strong>Overall Attendance</strong><strong class="${attColor(overallAttendance(s))}">${overallAttendance(s)}%</strong></div>
    <div class="view-row"><strong>Average Marks</strong><strong>${averageMarks(s)}% (${gradeFor(averageMarks(s))})</strong></div>
    <div class="view-row"><strong>Performance</strong><span class="badge ${PERF_BADGE[performance(s)]}">${PERF_LABEL[performance(s)]}</span></div>
    <h3 class="modal-subtitle">Subjects</h3>
    ${rows}`;
  viewOverlay.classList.remove('hidden');
}

/* Close any open modal with Escape */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!modalOverlay.classList.contains('hidden')) closeModal();
  if (!viewOverlay.classList.contains('hidden')) viewOverlay.classList.add('hidden');
});

/* ------------------------------------------------------------
   9. START — restore any session, then show the right page
   ------------------------------------------------------------ */
function boot() {
  drawIcons();
  const sess = getSession();
  if (sess && sess.role === 'admin') {
    showPage('admin');
    initAdmin();
  } else if (sess && sess.role === 'student') {
    const stu = students.find(s => s.id === sess.id);
    if (stu) {
      currentStudentId = stu.id;
      showPage('student');
      renderStudentDashboard(stu);
    } else {
      clearSession();
      showPage('login');
    }
  } else {
    showPage('login');
  }
}

/* Icons/Chart load via `defer`, so the DOM is ready here, but the
   library globals may arrive a tick later — redraw icons on window load. */
boot();
window.addEventListener('load', drawIcons);
