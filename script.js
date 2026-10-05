// =====================================================================
    // SUPABASE CONFIGURATION GUARD (#1)
    // Replace with your real values. Leave empty to run in offline mode.
    // =====================================================================
    const SUPABASE_URL = 'https://nptieebzfoxjfxgdmpnw.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdGllZWJ6Zm94amZ4Z2RtcG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMTIwODMsImV4cCI6MjEwNjc4ODA4M30.V23NocbMyhHWsojnOKIVA27itoZInkvmkuo6D3lo8x0';
    let _supabase = null;
    if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('PASTE_YOUR_SUPABASE')) {
      _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    async function testSupabaseConnection() {
        if (!_supabase) {
            console.error("Supabase client was not created.");
            return;
        }

        const { data, error } = await _supabase
            .from('events')
            .select('*')
            .limit(1);

        if (error) {
            console.error("❌ Supabase connection failed:", error);
        } else {
            console.log("✅ Supabase connected successfully!");
            console.log("Events response:", data);
        }
    }

    testSupabaseConnection();

    /* ===== Helpers ===== */
    const $ = id => document.getElementById(id);
    const lGet = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch (e) { return d } };
    const lSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const CATS = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Business'];
    const DEPTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI & DS'], YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'], SECS = ['A', 'B', 'C'];
    // Event artwork uses clean typography; no emoji glyphs.
    const COL = { Technical: ['#1e3a8a', '#3b82f6'], Cultural: ['#9d174d', '#ec4899'], Sports: ['#166534', '#22c55e'], Workshop: ['#b45309', '#f59e0b'], Seminar: ['#5b21b6', '#8b5cf6'], Business: ['#0f766e', '#14b8a6'] };
    const today = () => new Date().toISOString().slice(0, 10);
    const fd = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const ft = t => { const h = +t.slice(0, 2); return (h % 12 || 12) + ':' + t.slice(3, 5) + (h < 12 ? ' AM' : ' PM') };

    let EV_DATA = [], RG_DATA = [], SL_DATA = [];
    const EV = () => EV_DATA, RG = () => RG_DATA, SL = () => SL_DATA;
    const cu = () => SL().find(s => s.sid === lGet('currentUser', ''));
    const opts = (a, v) => a.map(x => `<option ${x == v ? 'selected' : ''}>${x}</option>`).join('');
    const sv = c => { const k = COL[c] || COL.Technical; return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='160'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${k[0]}'/><stop offset='1' stop-color='${k[1]}'/></linearGradient></defs><rect width='400' height='160' fill='url(#g)'/><text x='200' y='101' font-family='Arial,sans-serif' font-size='28' font-weight='700' text-anchor='middle' fill='white'>${esc(c).toUpperCase()}</text></svg>`) };
    const tbl = (h, rows) => `<div class="table-responsive"><table class="table table-hover align-middle"><thead class="table-light"><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td colspan="${h.length}" class="text-center text-muted py-4">Nothing to show.</td></tr>`}</tbody></table></div>`;
    const badge = s => `<span class="badge bg-success">${s}</span>`;

    // Fix #16: Show/hide password toggle
    function togglePwd(id, btn) {
      const inp = $(id);
      const visible = inp.type === 'text';
      inp.type = visible ? 'password' : 'text';
      btn.querySelector('i').className = 'bi bi-eye' + (visible ? '' : '-slash');
    }

    // Fix #14: Loading state helper
    function setLoading(btn, loading, txt = 'Processing...') {
      if (!btn) return;
      if (loading) { btn.dataset.orig = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${txt}`; }
      else { btn.disabled = false; btn.innerHTML = btn.dataset.orig || btn.innerHTML; }
    }

    /* ===== Toasts and modals ===== */
    function toast(t, type) {
      const e = document.createElement('div'); e.className = 'toast align-items-center border-0 text-bg-' + (type || 'success');
      e.innerHTML = `<div class="d-flex"><div class="toast-body">${esc(t)}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
      $('tc').appendChild(e); const x = new bootstrap.Toast(e, { delay: 3200 }); e.addEventListener('hidden.bs.toast', () => e.remove()); x.show();
    }
    function modal(t, b, f) { $('mT').textContent = t; $('mB').innerHTML = b; $('mF').innerHTML = f || '<button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'; bootstrap.Modal.getOrCreateInstance($('m')).show() }
    const hide = id => bootstrap.Modal.getOrCreateInstance($(id || 'm')).hide();


    /* ===== Theme ===== */
    function applyTheme(t) {
      document.documentElement.setAttribute('data-bs-theme', t);
      lSet('theme', t);
      document.querySelectorAll('[onclick="theme()"]').forEach(btn => {
        const i = btn.querySelector('i');
        if (i) i.className = t === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
        btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('title', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      });
    }
    function theme() {
      const current = document.documentElement.getAttribute('data-bs-theme') || 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    }
    applyTheme(lGet('theme', 'light'));

    /* ===== Navigation ===== */
    const SP = ['sdash', 'smy', 'sprof'], AP = ['adash', 'aev', 'areg', 'astu', 'arep', 'aset'];
    let cur = 'home', sel = 0;
    function li(n, t) { return `<li class="nav-item"><a class="nav-link" href="#" onclick="show('${n}');return false">${t}</a></li>` }
    function nav() {
      const s = cu(), ad = lGet('adminLoggedIn', false);
      let h = li('home', 'Home') + li('events', 'Events') + `<li class="nav-item"><a class="nav-link" href="#" onclick="goto('about');return false">About</a></li><li class="nav-item"><a class="nav-link" href="#" onclick="goto('contact');return false">Contact</a></li>`;
      const lo = `<li class="nav-item"><a class="nav-link" href="#" onclick="logout();return false">Logout</a></li>`;
      if (s) h += li('sdash', 'Dashboard') + lo; else if (ad) h += li('adash', 'Admin Dashboard') + lo; else h += li('login', 'Student Login') + li('register', 'Student Registration') + li('adminlogin', 'Admin Login');
      h += `<li class="nav-item"><button class="btn btn-sm btn-outline-light ms-lg-2" onclick="theme()"><i class="bi bi-moon-stars"></i></button></li>`;
      $('navL').innerHTML = h;
    }
    function side(v, n) {
      const L = v == 'student' ? [['sdash', 'Dashboard', 'speedometer2'], ['events', 'Browse Events', 'calendar-event'], ['smy', 'My Registrations', 'ticket-perforated'], ['sprof', 'My Profile', 'person']]
        : [['adash', 'Dashboard', 'speedometer2'], ['aev', 'Events', 'calendar-event'], ['addev', 'Add Event', 'plus-circle'], ['areg', 'Registrations', 'ticket-perforated'], ['astu', 'Students', 'people'], ['arep', 'Reports', 'bar-chart'], ['aset', 'Settings', 'gear']];
      $(v == 'student' ? 'sideS' : 'sideA').innerHTML = L.map(x => `<a class="${x[0] == n ? 'on' : ''}" onclick="${x[0] == 'addev' ? 'openEv()' : `show('${x[0]}')`}"><i class="bi bi-${x[2]} me-2"></i>${x[1]}</a>`).join('') + `<a onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a>`;
    }
    window.addEventListener('popstate', (e) => {
      const page = e.state?.page || window.location.hash.substring(1) || 'home';
      show(page, false);
    });

    function show(n, push = true) {
      if ((SP.includes(n) || n == 'regform') && !cu()) { toast('Please login as a student first.', 'warning'); n = 'login' }
      if (AP.includes(n) && !lGet('adminLoggedIn', false)) { toast('Admin login required.', 'warning'); n = 'adminlogin' }
      
      if (push && cur !== n) {
        history.pushState({ page: n }, '', '#' + n);
      }
      cur = n;
      document.querySelectorAll('.view,.panel').forEach(x => x.classList.add('d-none'));
      const v = SP.includes(n) ? 'student' : AP.includes(n) ? 'admin' : n;
      $('v-' + v).classList.remove('d-none');
      if (v != n) { $('p-' + n).classList.remove('d-none'); side(v, n) }
      const R = { home: rHome, events: renderEvents, regform: rRegform, sdash: rSdash, smy: rSmy, sprof: rSprof, adash: rAdash, aev: rAev, areg: rAreg, astu: rAstu, arep: rArep };
      if (R[n]) R[n]();
      nav(); window.scrollTo(0, 0);
      bootstrap.Collapse.getOrCreateInstance($('nv'), { toggle: false }).hide();
    }
    function goto(id) { show('home'); setTimeout(() => $(id).scrollIntoView({ behavior: 'smooth' }), 80) }
    function logout() { localStorage.removeItem('currentUser'); localStorage.removeItem('adminLoggedIn'); toast('Logged out successfully.', 'info'); show('home') }
    function contact(e) { e.preventDefault(); toast('Thank you, ' + $('cn').value.trim() + '! Your message has been sent.'); e.target.reset() }

    // Fix #7: Dynamic home stats
    function updateHomeStats() {
      const evs = EV(), stu = SL(), regs = RG();
      const depts = new Set(stu.map(s => s.dept));
      const animateStat = (id, target) => {
        const el = $(id); if (!el) return;
        let n = 0; const step = Math.ceil(target / 50) || 1;
        const iv = setInterval(() => { n = Math.min(n + step, target); el.textContent = n + (target > 0 ? '+' : ''); if (n >= target) clearInterval(iv); }, 25);
      };
      animateStat('stat-ev', evs.length);
      animateStat('stat-st', stu.length);
      animateStat('stat-rg', regs.length);
      animateStat('stat-dp', depts.size);
    }

    /* ===== Events ===== */
    // Fix #10: Event status badge function
    function evStatus(e) {
      if (e.date < today()) return { text: 'COMPLETED', cls: 'bg-secondary' };
      const rem = e.max - e.count;
      if (rem <= 0) return { text: 'FULL', cls: 'bg-danger' };
      if (rem <= 10) return { text: 'ALMOST FULL', cls: 'bg-warning text-dark' };
      return { text: 'OPEN', cls: 'bg-success' };
    }
    function evCard(e, cols) {
      const status = evStatus(e);
      const past = e.date < today(), full = e.count >= e.max, pct = Math.min(100, Math.round(e.count / e.max * 100));
      const btn = past ? '<button class="btn btn-secondary flex-fill" disabled>COMPLETED</button>' : full ? '<button class="btn btn-danger flex-fill" disabled>EVENT FULL</button>' : `<button class="btn btn-a flex-fill" onclick="startReg(${e.id})">Register Now</button>`;
      return `<div class="${cols}"><div class="ec h-100 d-flex flex-column"><img src="${esc(e.img || sv(e.cat))}" onerror="this.onerror=null;this.src=sv('${e.cat}')" alt="">
 <div class="p-3 d-flex flex-column flex-grow-1">
  <div class="d-flex justify-content-between align-items-center mb-2">
   <span class="badge bg-primary">${esc(e.cat)}</span>
   <span class="badge ${status.cls}">${status.text}</span>
  </div>
  <h5>${esc(e.name)}</h5>
  <p class="small text-muted mb-2">${esc(e.desc)}</p>
  <div class="small"><i class="bi bi-calendar-event text-primary"></i> ${fd(e.date)} &nbsp; <i class="bi bi-clock text-primary"></i> ${ft(e.time)}<br><i class="bi bi-geo-alt text-primary"></i> ${esc(e.venue)}<br><i class="bi bi-person-badge text-primary"></i> ${esc(e.org)}</div>
  <div class="small mt-2 fw-semibold">${e.count}/${e.max} registered <span class="text-muted">(${e.max - e.count} seats left)</span></div>
  <div class="progress mb-3" style="height:8px"><div class="progress-bar ${full ? 'bg-danger' : e.max - e.count <= 10 ? 'bg-warning' : ''}" style="width:${pct}%"></div></div>
  <div class="d-flex gap-2 mt-auto">${btn}<button class="btn btn-outline-primary" onclick="viewEv(${e.id})">Details</button></div>
 </div></div></div>`;
    }
    function rHome() {
      const l = EV().filter(e => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
      $('feat').innerHTML = l.map(e => evCard(e, 'col-md-6 col-lg-4')).join('');
      updateHomeStats();
    }
    function renderEvents() {
      const q = $('q').value.toLowerCase(), c = $('fc').value, d = $('fd').value, so = $('so').value;
      const l = EV().filter(e => (!c || e.cat == c) && (!d || e.date >= d) && (e.name + e.venue + e.org + e.desc).toLowerCase().includes(q));
      l.sort(so == 'name' ? (a, b) => a.name.localeCompare(b.name) : so == 'dd' ? (a, b) => b.date.localeCompare(a.date) : so == 'pop' ? (a, b) => b.count - a.count : (a, b) => a.date.localeCompare(b.date));
      $('evList').innerHTML = l.map(e => evCard(e, 'col-md-6 col-lg-4')).join('') || '<div class="col-12 text-center text-muted py-5"><i class="bi bi-search fs-1"></i><p>No events found.</p></div>';
    }
    function viewEv(id) {
      const e = EV().find(x => x.id == id);
      const status = evStatus(e);
      modal(e.name, `<img src="${esc(e.img || sv(e.cat))}" onerror="this.onerror=null;this.src=sv('${e.cat}')" class="img-fluid rounded mb-3 w-100" style="max-height:200px;object-fit:cover"><p>${esc(e.desc)}</p>
 <p class="mb-1"><b>Status:</b> <span class="badge ${status.cls}">${status.text}</span></p>
 <p class="mb-1"><b>Category:</b> ${esc(e.cat)}</p><p class="mb-1"><b>Date:</b> ${fd(e.date)}</p><p class="mb-1"><b>Time:</b> ${ft(e.time)}</p><p class="mb-1"><b>Venue:</b> ${esc(e.venue)}</p><p class="mb-1"><b>Organizer:</b> ${esc(e.org)}</p><p class="mb-0"><b>Participants:</b> ${e.count} / ${e.max} (${e.max - e.count} seats left)</p>`);
    }

    /* ===== Student registration and login ===== */
    async function regStudent(ev) {
      ev.preventDefault();
      const btn = $('regBtn'); setLoading(btn, true, 'Creating Account...');
      const s = { name: $('rn').value.trim(), sid: $('ri').value.trim().toUpperCase(), dept: $('rd').value, year: $('ry').value, section: $('rs').value, email: $('re').value.trim().toLowerCase(), phone: $('rp').value.trim(), password: $('rw').value };
      try {
        if (Object.values(s).some(v => !v)) throw new Error('Please fill all required fields.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) throw new Error('Enter a valid email address.');
        if (!/^[6-9]\d{9}$/.test(s.phone)) throw new Error('Enter a valid 10-digit phone number.');
        if (s.password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (s.password !== $('rw2').value) throw new Error('Passwords do not match.');
        const L = SL();
        if (L.some(x => x.sid == s.sid)) throw new Error('This Student ID is already registered.');
        if (L.some(x => x.email == s.email)) throw new Error('This email is already registered.');
        if (_supabase) {
          const { error } = await _supabase.from('students').insert([s]);
          if (error) throw new Error('Database Error: ' + error.message);
        }
        SL_DATA.push(s); ev.target.reset();
        toast('Student registration successful! Please login.'); show('login');
      } catch (err) { toast(err.message, 'danger'); }
      finally { setLoading(btn, false); }
    }
    function loginS(ev) {
      ev.preventDefault();
      const btn = $('loginSBtn'); setLoading(btn, true, 'Logging in...');
      const s = SL().find(x => x.email == $('le').value.trim().toLowerCase() && x.password == $('lp').value);
      if (!s) { setLoading(btn, false); return toast('Invalid email or password.', 'danger'); }
      localStorage.removeItem('adminLoggedIn'); lSet('currentUser', s.sid); ev.target.reset();
      setLoading(btn, false);
      toast('Welcome back, ' + s.name + '!'); show('sdash');
    }
    function loginA(ev) {
      ev.preventDefault();
      const btn = $('loginABtn'); setLoading(btn, true, 'Authenticating...');
      if ($('au').value.trim() == 'admin' && $('ap').value == 'admin123') {
        localStorage.removeItem('currentUser'); lSet('adminLoggedIn', true); ev.target.reset();
        setLoading(btn, false); toast('Admin login successful.'); show('adash');
      } else { setLoading(btn, false); toast('Invalid admin username or password.', 'danger'); }
    }

    /* ===== Event registration ===== */
    function dupModal(r) { modal('Already Registered', `<p>You are already registered for this event.</p><p class="mb-0">Your Registration ID: <b class="fs-5 text-primary">${r.id}</b></p>`, '<button class="btn btn-secondary" data-bs-dismiss="modal">Close</button><button class="btn btn-a" onclick="hide();show(\'smy\')" >View My Registrations</button>') }
    function startReg(id) {
      const s = cu();
      if (!s) { toast('Please login as a student to register.', 'warning'); return show('login') }
      const e = EV().find(x => x.id == id), ex = RG().find(r => r.sid == s.sid && r.eid == id);
      if (ex) { toast('You are already registered for this event.', 'warning'); return dupModal(ex) }
      if (e.date < today()) return toast('This event is already completed.', 'warning');
      if (e.count >= e.max) return toast('EVENT FULL - registration closed.', 'danger');
      sel = id; show('regform');
    }
    function rRegform() {
      const e = EV().find(x => x.id == sel), s = cu();
      if (!e) { return show('events') }
      $('v-regform').innerHTML = `<div class="container py-5" style="max-width:820px"><form class="box" onsubmit="confirmReg(event)">
 <h3 class="ttl mb-3"><i class="bi bi-ticket-perforated"></i> Event Registration</h3>
 <div class="alert alert-primary"><div class="row"><div class="col-md-6"><b>Event:</b> ${esc(e.name)}<br><b>Date:</b> ${fd(e.date)}<br><b>Time:</b> ${ft(e.time)}</div><div class="col-md-6"><b>Venue:</b> ${esc(e.venue)}<br><b>Organizer:</b> ${esc(e.org)}<br><b>Seats left:</b> <span class="fw-bold text-${e.max - e.count <= 10 ? 'warning' : 'success'}">${e.max - e.count}</span></div></div></div>
 <h6>Your details (verify or edit)</h6><div class="row g-3 mb-3">
  <div class="col-md-6"><label class="form-label">Full Name</label><input id="fn" class="form-control" value="${esc(s.name)}" required></div>
  <div class="col-md-6"><label class="form-label">Student ID</label><input class="form-control" value="${esc(s.sid)}" readonly></div>
  <div class="col-md-4"><label class="form-label">Department</label><select id="fd2" class="form-select">${opts(DEPTS, s.dept)}</select></div>
  <div class="col-md-4"><label class="form-label">Year</label><select id="fy" class="form-select">${opts(YEARS, s.year)}</select></div>
  <div class="col-md-4"><label class="form-label">Section</label><select id="fs" class="form-select">${opts(SECS, s.section)}</select></div>
  <div class="col-md-6"><label class="form-label">Email</label><input class="form-control" value="${esc(s.email)}" readonly></div>
  <div class="col-md-6"><label class="form-label">Phone Number</label><input id="fp" class="form-control" value="${esc(s.phone)}" required></div>
 </div><div class="row g-3">
  <div class="col-md-6"><label class="form-label">Participation Type</label><select id="fpt" class="form-select"><option>Individual</option><option>Team</option></select></div>
  <div class="col-md-6"><label class="form-label">Team Name (optional)</label><input id="ftn" class="form-control"></div>
  <div class="col-12"><label class="form-label">Special Requirements (optional)</label><textarea id="fr" rows="2" class="form-control"></textarea></div>
  <div class="col-12"><div class="form-check"><input type="checkbox" id="ft" class="form-check-input"><label class="form-check-label" for="ft">I agree to the event terms and conditions.</label></div></div>
 </div>
 <div class="d-flex gap-2 mt-4"><button id="confirmRegBtn" class="btn btn-a flex-fill">Confirm Event Registration</button><button type="button" class="btn btn-outline-secondary" onclick="show('events')">Back</button></div></form></div>`;
    }
    function detail(r) {
      const e = EV().find(x => x.id == r.eid) || { name: '(removed)', date: '', time: '00:00', venue: '' };
      return [['Registration ID', r.id], ['Student', r.name], ['Student ID', r.sid], ['Department', r.dept], ['Event', e.name], ['Date', e.date ? fd(e.date) : ''], ['Time', ft(e.time)], ['Venue', e.venue], ['Registered On', fd(r.date)], ['Status', r.status]];
    }
    // Fix #15: Double-submit prevention
    let _regInProgress = false;
    async function confirmReg(ev) {
      ev.preventDefault();
      if (_regInProgress) return;
      _regInProgress = true;
      const btn = $('confirmRegBtn'); setLoading(btn, true, 'Registering...');
      try {
        const s = cu(), rg = RG(), evs = EV(), e = evs.find(x => x.id == sel);
        const ex = rg.find(r => r.sid == s.sid && r.eid == e.id);
        if (ex) { toast('You are already registered for this event.', 'warning'); return dupModal(ex) }
        if (e.count >= e.max) throw new Error('EVENT FULL - registration closed.');
        const name = $('fn').value.trim(), ph = $('fp').value.trim();
        if (!name) throw new Error('Full name is required.');
        if (!/^[6-9]\d{9}$/.test(ph)) throw new Error('Enter a valid 10-digit phone number.');
        if (!$('ft').checked) throw new Error('Please agree to the event terms.');
        const n = Math.max(124, ...rg.map(r => +r.id.slice(-5))) + 1;
        const r = { id: 'CES-2026-' + String(n).padStart(5, '0'), sid: s.sid, name, dept: $('fd2').value, year: $('fy').value, section: $('fs').value, email: s.email, phone: ph, eid: e.id, type: $('fpt').value, team: $('ftn').value.trim(), req: $('fr').value.trim(), date: today(), status: 'CONFIRMED' };
        if (_supabase) {
          const { error } = await _supabase.from('registrations').insert([r]);
          if (error) throw new Error('DB Error: ' + error.message);
          await _supabase.from('events').update({ count: e.count + 1 }).eq('id', e.id);
        }
        RG_DATA.push(r); e.count++;
        toast('Event registration successful!');
        modal('Registration Successful!', `<div class="text-center mb-3"><i class="bi bi-check-circle-fill text-success" style="font-size:3rem"></i></div>` + detail(r).map(x => `<p class="mb-1"><b>${x[0]}:</b> ${x[0] == 'Registration ID' ? `<code class="fs-6">${x[1]}</code>` : x[0] == 'Status' ? badge(x[1]) : esc(x[1])}</p>`).join(''),
          `<button class="btn btn-a" onclick="hide();show('smy')">View My Registration</button><button class="btn btn-outline-primary" onclick="hide();show('events')">Back to Events</button><button class="btn btn-success" onclick="printReg('${r.id}')"><i class="bi bi-download"></i> Download</button>`);
        show('smy');
      } catch (err) { toast(err.message, 'danger'); }
      finally { _regInProgress = false; setLoading(btn, false); }
    }
    function viewReg(id) { const r = RG().find(x => x.id == id); modal('Registration Details', detail(r).map(x => `<p class="mb-1"><b>${x[0]}:</b> ${esc(x[1])}</p>`).join('') + `<p class="mb-1"><b>Participation:</b> ${esc(r.type)} ${r.team ? '(' + esc(r.team) + ')' : ''}</p>${r.req ? `<p class="mb-1"><b>Requirements:</b> ${esc(r.req)}</p>` : ''}`) }
    function printReg(id) {
      const r = RG().find(x => x.id == id), w = window.open('', '_blank');
      if (!w) return toast('Please allow pop-ups to print.', 'warning');
      w.document.write(`<html><head><title>${r.id}</title><style>body{font-family:Arial;padding:40px}h1{color:#1e3a8a}table{width:100%;border-collapse:collapse}td{border:1px solid #ccc;padding:10px}td:first-child{font-weight:bold;width:35%;background:#f3f4f6}</style></head><body><h1>College Event Management System</h1><h3>Event Registration Confirmation</h3><table>${detail(r).map(x => `<tr><td>${x[0]}</td><td>${esc(x[1])}</td></tr>`).join('')}</table><p>This is a computer-generated confirmation.</p><scr` + `ipt>window.onload=function(){window.print()}</scr` + `ipt></body></html>`);
      w.document.close();
    }
    function askCancel(id, adm) {
      modal(adm ? 'Delete Registration' : 'Cancel Registration', `<p class="mb-0">${adm ? 'Delete this registration? This action cannot be undone.' : 'Are you sure you want to cancel this registration?'}</p>`, `<button class="btn btn-secondary" data-bs-dismiss="modal">No, Keep It</button><button class="btn btn-danger" onclick="hide();cancelReg('${id}')">${adm ? 'Yes, Delete' : 'Yes, Cancel'}</button>`);
    }
    // Fix #5: DB first, then UI update
    async function cancelReg(id) {
      const r = RG().find(x => x.id == id); if (!r) return;
      if (_supabase) {
        const { error } = await _supabase.from('registrations').delete().eq('id', id);
        if (error) return toast('Error cancelling: ' + error.message, 'danger');
        const e = EV().find(x => x.id == r.eid);
        if (e) { e.count = Math.max(0, e.count - 1); await _supabase.from('events').update({ count: e.count }).eq('id', e.id); }
      }
      RG_DATA = RG().filter(x => x.id != id);
      const ev2 = EV().find(x => x.id == r.eid);
      if (ev2 && !_supabase) ev2.count = Math.max(0, ev2.count - 1);
      toast('Registration ' + id + ' cancelled.', 'info'); show(cur);
    }

    /* ===== Student panels ===== */
    function profHTML(s) { return `<div class="box"><div class="row g-2"><div class="col-md-6"><b>Name:</b> ${esc(s.name)}</div><div class="col-md-6"><b>Student ID:</b> ${esc(s.sid)}</div><div class="col-md-6"><b>Department:</b> ${esc(s.dept)}</div><div class="col-md-6"><b>Year:</b> ${esc(s.year)}</div><div class="col-md-6"><b>Section:</b> ${esc(s.section)}</div><div class="col-md-6"><b>Email:</b> ${esc(s.email)}</div><div class="col-md-6"><b>Phone:</b> ${esc(s.phone)}</div></div></div>` }
    function rSdash() {
      const s = cu(), ev = EV(), t = today(), my = RG().filter(r => r.sid == s.sid);
      const upcoming = my.filter(r => { const e = ev.find(x => x.id == r.eid); return e && e.date >= t; });
      const completed = my.filter(r => { const e = ev.find(x => x.id == r.eid); return e && e.date < t; });
      const hr = new Date().getHours();
      const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
      $('p-sdash').innerHTML = `<h3 class="ttl mb-1">${greet}, ${esc(s.name)}! 👋</h3><p class="text-muted mb-4">Here's what's happening with your events.</p><div class="row g-3 mb-4">
 <div class="col-6 col-lg-3"><div class="stat bg-primary"><small>My Registrations</small><h2>${my.length}</h2></div></div>
 <div class="col-6 col-lg-3"><div class="stat bg-success"><small>Upcoming</small><h2>${upcoming.length}</h2></div></div>
 <div class="col-6 col-lg-3"><div class="stat" style="background:#f59e0b"><small>Completed</small><h2>${completed.length}</h2></div></div>
 <div class="col-6 col-lg-3"><div class="stat bg-secondary"><small>Available Events</small><h2>${ev.filter(e => e.date >= t && e.count < e.max).length}</h2></div></div></div>
 ${upcoming.length ? `<h5 class="ttl">Upcoming Registrations</h5><div class="box mb-3">${upcoming.slice(0, 3).map(r => { const e = ev.find(x => x.id == r.eid) || { name: '', date: '', time: '00:00', venue: '' }; return `<div class="d-flex justify-content-between align-items-center py-2 border-bottom"><div><b>${esc(e.name)}</b><br><small class="text-muted">${e.date ? fd(e.date) : ''} &bull; ${ft(e.time)} &bull; ${esc(e.venue)}</small></div><button class="btn btn-sm btn-outline-primary" onclick="viewReg('${r.id}')">View</button></div>` }).join('')}</div>` : ''}
 <h5>My Profile</h5>${profHTML(s)}<button class="btn btn-a mt-3" onclick="show('events')">Browse Events</button>`;
    }
    function rSprof() { $('p-sprof').innerHTML = '<h3 class="ttl mb-3">My Profile</h3>' + profHTML(cu()) }
    function rSmy() {
      const s = cu(), ev = EV();
      const rows = RG().filter(r => r.sid == s.sid).map(r => {
        const e = ev.find(x => x.id == r.eid) || { name: '(removed)', date: '', time: '00:00', venue: '' };
        return `<tr><td><code>${r.id}</code></td><td>${esc(r.name)}</td><td>${esc(e.name)}</td><td>${e.date ? fd(e.date) : ''}</td><td>${ft(e.time)}</td><td>${esc(e.venue)}</td><td>${fd(r.date)}</td><td>${badge(r.status)}</td>
  <td class="text-nowrap"><button class="btn btn-sm btn-outline-primary" onclick="viewReg('${r.id}')">View</button> <button class="btn btn-sm btn-outline-success" onclick="printReg('${r.id}')">Print</button> <button class="btn btn-sm btn-outline-danger" onclick="askCancel('${r.id}')">Cancel</button></td></tr>`
      }).join('');
      $('p-smy').innerHTML = '<h3 class="ttl mb-3">My Registrations</h3><div class="box">' + tbl(['Reg. ID', 'Student', 'Event', 'Date', 'Time', 'Venue', 'Registered On', 'Status', 'Actions'], rows) + '</div>';
    }

    /* ===== Admin panels ===== */
    function rAdash() {
      const ev = EV(), rg = RG(), st = SL(), t = today();
      const rows = rg.slice(-5).reverse().map(r => `<tr><td><code>${r.id}</code></td><td>${esc(r.name)}</td><td>${esc((ev.find(e => e.id == r.eid) || { name: '-' }).name)}</td><td>${fd(r.date)}</td><td>${badge(r.status)}</td></tr>`).join('');
      $('p-adash').innerHTML = `<h3 class="ttl mb-3">Admin Dashboard</h3><div class="row g-3 mb-4">
 <div class="col-6 col-lg-3"><div class="stat bg-primary"><small>Total Events</small><h2>${ev.length}</h2></div></div>
 <div class="col-6 col-lg-3"><div class="stat bg-success"><small>Total Students</small><h2>${st.length}</h2></div></div>
 <div class="col-6 col-lg-3"><div class="stat" style="background:#f59e0b"><small>Total Registrations</small><h2>${rg.length}</h2></div></div>
 <div class="col-6 col-lg-3"><div class="stat bg-secondary"><small>Upcoming Events</small><h2>${ev.filter(e => e.date >= t).length}</h2></div></div></div>
 <div class="box"><h5>Recent Registrations</h5>${tbl(['Reg. ID', 'Student', 'Event', 'Date', 'Status'], rows)}</div>`;
    }
    function rAev() {
      const q = $('aq').value.toLowerCase(), c = $('ac').value;
      const rows = EV().filter(e => (!c || e.cat == c) && (e.name + e.venue + e.org).toLowerCase().includes(q)).sort((a, b) => a.date.localeCompare(b.date)).map(e => {
        const status = evStatus(e); return `<tr><td>${esc(e.name)}</td><td>${esc(e.cat)}</td><td>${fd(e.date)}</td><td>${esc(e.venue)}</td><td>${e.count}/${e.max} <span class="badge ${status.cls} ms-1">${status.text}</span></td>
 <td class="text-nowrap"><button class="btn btn-sm btn-outline-secondary" onclick="viewEv(${e.id})"><i class="bi bi-eye"></i></button> <button class="btn btn-sm btn-outline-primary" onclick="openEv(${e.id})"><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-outline-danger" onclick="askDelEv(${e.id})"><i class="bi bi-trash"></i></button></td></tr>`
      }).join('');
      $('aevT').innerHTML = tbl(['Event', 'Category', 'Date', 'Venue', 'Registered', 'Actions'], rows);
    }
    function openEv(id) {
      const e = id ? EV().find(x => x.id == id) : null;
      $('evT').textContent = e ? 'Edit Event' : 'Add Event';
      $('ef-id').value = e ? e.id : ''; $('ef-n').value = e ? e.name : ''; $('ef-c').value = e ? e.cat : CATS[0]; $('ef-d').value = e ? e.date : ''; $('ef-t').value = e ? e.time : '';
      $('ef-x').value = e ? e.max : ''; $('ef-v').value = e ? e.venue : ''; $('ef-o').value = e ? e.org : ''; $('ef-i').value = e ? e.img : ''; $('ef-ds').value = e ? e.desc : '';
      bootstrap.Modal.getOrCreateInstance($('evM')).show();
    }
    async function saveEv(ev) {
      ev.preventDefault();
      const d = { name: $('ef-n').value.trim(), cat: $('ef-c').value, date: $('ef-d').value, time: $('ef-t').value, max: +$('ef-x').value, venue: $('ef-v').value.trim(), org: $('ef-o').value.trim(), img: $('ef-i').value.trim(), desc: $('ef-ds').value.trim() };
      if (!d.name || !d.date || !d.time || !d.venue || !d.org || !d.desc || d.max < 1) return toast('Please fill all fields correctly.', 'danger');
      const id = +$('ef-id').value;
      if (id) {
        const e = EV().find(x => x.id == id);
        if (d.max < e.count) return toast('Max participants cannot be less than current registrations (' + e.count + ').', 'danger');
        if (_supabase) { const { error } = await _supabase.from('events').update(d).eq('id', id); if (error) return toast('Error: ' + error.message, 'danger'); }
        Object.assign(e, d); toast('Event updated successfully.');
      } else {
        d.count = 0;
        if (_supabase) { 
          const { data, error } = await _supabase.from('events').insert([d]).select(); 
          if (error) return toast('Error: ' + error.message, 'danger'); 
          d.id = data[0].id;
        } else {
          d.id = Date.now();
        }
        if (!EV_DATA.find(x => String(x.id) === String(d.id))) EV_DATA.push(d);
        toast('Event added successfully.');
      }
      hide('evM'); show(AP.includes(cur) ? cur : 'aev');
    }
    // Fix #19: More explicit delete confirmation
    function askDelEv(id) {
      const e = EV().find(x => x.id == id);
      const regCount = RG().filter(r => r.eid == id).length;
      modal('âš  Delete Event?', `<p class="fw-bold">${esc(e ? e.name : 'this event')}</p><p>This will permanently remove:</p><ul><li>The event</li><li>${regCount} registration(s)</li><li>All registration history</li></ul><p class="text-danger fw-semibold mb-0">This action cannot be undone.</p>`, `<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-danger" onclick="hide();delEv(${id})">Delete Event</button>`);
    }
    async function delEv(id) {
      if (_supabase) {
        const { error: e1 } = await _supabase.from('events').delete().eq('id', id);
        const { error: e2 } = await _supabase.from('registrations').delete().eq('eid', id);
        if (e1 || e2) return toast('Error deleting event.', 'danger');
      }
      EV_DATA = EV().filter(e => e.id != id);
      RG_DATA = RG().filter(r => r.eid != id);
      toast('Event deleted.', 'info'); show(cur);
    }
    function rAreg() {
      const q = $('gq').value.toLowerCase(), f = $('ge').value, ev = EV();
      if ($('ge').options.length != ev.length + 1) $('ge').innerHTML = '<option value="">All Events</option>' + ev.map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
      $('ge').value = f;
      const rows = RG().filter(r => (!f || r.eid == f) && (r.id + r.name + r.sid + ((ev.find(e => e.id == r.eid) || {}).name || '')).toLowerCase().includes(q)).map(r => {
        const e = ev.find(x => x.id == r.eid) || { name: '(removed)' };
        return `<tr><td><code>${r.id}</code></td><td>${esc(r.name)}</td><td>${esc(r.sid)}</td><td>${esc(e.name)}</td><td>${fd(r.date)}</td><td>${badge(r.status)}</td><td class="text-nowrap"><button class="btn btn-sm btn-outline-primary" onclick="viewReg('${r.id}')"><i class="bi bi-eye"></i></button> <button class="btn btn-sm btn-outline-danger" onclick="askCancel('${r.id}',1)"><i class="bi bi-trash"></i></button></td></tr>`
      }).join('');
      $('aregT').innerHTML = tbl(['Registration ID', 'Student', 'Student ID', 'Event', 'Date', 'Status', 'Actions'], rows);
    }
    function csv() {
      const ev = EV(), q = s => '"' + String(s).replace(/"/g, '""') + '"';
      const lines = [['Registration ID', 'Student', 'Student ID', 'Department', 'Year', 'Section', 'Email', 'Phone', 'Event', 'Event Date', 'Registration Date', 'Status'].map(q).join(',')];
      RG().forEach(r => { const e = ev.find(x => x.id == r.eid) || { name: '', date: '' }; lines.push([r.id, r.name, r.sid, r.dept, r.year, r.section, r.email, r.phone, e.name, e.date, r.date, r.status].map(q).join(',')) });
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })); a.download = 'registrations.csv'; a.click();
      toast('CSV exported.');
    }
    function rAstu() {
      const q = $('sq').value.toLowerCase(), rg = RG();
      const rows = SL().filter(s => (s.name + s.sid + s.email + s.dept).toLowerCase().includes(q)).map(s => `<tr><td>${esc(s.name)}</td><td>${esc(s.sid)}</td><td>${esc(s.dept)}</td><td>${esc(s.year)}</td><td>${esc(s.section)}</td><td>${esc(s.email)}</td><td>${esc(s.phone)}</td><td><span class="badge bg-primary">${rg.filter(r => r.sid == s.sid).length}</span></td></tr>`).join('');
      $('astuT').innerHTML = tbl(['Name', 'Student ID', 'Department', 'Year', 'Section', 'Email', 'Phone', 'Events'], rows);
    }
    function bars(id, o) {
      const k = Object.keys(o), m = Math.max(1, ...Object.values(o));
      $(id).innerHTML = k.map(x => `<div class="d-flex align-items-center mb-2"><div class="small text-truncate" style="width:42%">${esc(x)}</div><div style="width:58%"><div class="bar" style="width:${Math.max(8, o[x] / m * 100)}%">${o[x]}</div></div></div>`).join('') || '<p class="text-muted">No data.</p>';
    }
    function rArep() {
      const ev = EV(), a = {}, b = {}, c = {};
      ev.forEach(e => { a[e.name] = RG().filter(r => r.eid == e.id).length; b[e.cat] = (b[e.cat] || 0) + 1 });
      SL().forEach(s => c[s.dept] = (c[s.dept] || 0) + 1);
      bars('c1', a); bars('c2', b); bars('c3', c);
    }

    /* ===== Database Loader (Fix #1 & #6) ===== */
    async function loadDatabase() {
      if (sessionStorage.getItem('cesOfflineMode') === '1') return true;
      if (!_supabase) { console.warn('Supabase not configured. Running in offline mode.'); return true; }
      try {
        const [{ data: events, error: eErr }, { data: registrations, error: rErr }, { data: students, error: sErr }] = await Promise.all([
          _supabase.from('events').select('*'),
          _supabase.from('registrations').select('*'),
          _supabase.from('students').select('*')
        ]);
        if (eErr) throw eErr; if (rErr) throw rErr; if (sErr) throw sErr;
        EV_DATA = events ?? []; RG_DATA = registrations ?? []; SL_DATA = students ?? [];
        return true;
      } catch (err) {
        console.error('Database loading failed:', err);
        return false;
      }
    }

    /* ===== Start ===== */
    // ===== Supabase Realtime =====
    let _realtimeChannel = null;
    function setupRealtime() {
      if (!_supabase || _realtimeChannel) return;
      _realtimeChannel = _supabase.channel('college-event-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, p => { if (p.eventType === 'INSERT') EV_DATA.push(p.new); else if (p.eventType === 'UPDATE') { const i = EV_DATA.findIndex(x => String(x.id) === String(p.new.id)); if (i >= 0) EV_DATA[i] = p.new; else EV_DATA.push(p.new) } else if (p.eventType === 'DELETE') EV_DATA = EV_DATA.filter(x => String(x.id) !== String(p.old.id)); refreshLiveView() })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, p => { if (p.eventType === 'INSERT') RG_DATA.push(p.new); else if (p.eventType === 'UPDATE') { const i = RG_DATA.findIndex(x => String(x.id) === String(p.new.id)); if (i >= 0) RG_DATA[i] = p.new; else RG_DATA.push(p.new) } else if (p.eventType === 'DELETE') RG_DATA = RG_DATA.filter(x => String(x.id) !== String(p.old.id)); refreshLiveView() })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, p => { if (p.eventType === 'INSERT') SL_DATA.push(p.new); else if (p.eventType === 'UPDATE') { const i = SL_DATA.findIndex(x => String(x.sid) === String(p.new.sid)); if (i >= 0) SL_DATA[i] = p.new; else SL_DATA.push(p.new) } else if (p.eventType === 'DELETE') SL_DATA = SL_DATA.filter(x => String(x.sid) !== String(p.old.sid)); refreshLiveView() })
        .subscribe(status => console.log('Supabase Realtime:', status));
    }
    function refreshLiveView() { if (!document.hidden && typeof cur !== 'undefined' && cur) { try { show(cur) } catch (e) { console.warn('Live UI refresh skipped:', e) } } }
    async function initApp() {
      $('fc').innerHTML = '<option value="">All Categories</option>' + opts(CATS);
      $('ac').innerHTML = '<option value="">All Categories</option>' + opts(CATS);
      $('ef-c').innerHTML = opts(CATS);
      $('rd').innerHTML = '<option value="">Select</option>' + opts(DEPTS);
      $('ry').innerHTML = '<option value="">Select</option>' + opts(YEARS);
      $('rs').innerHTML = '<option value="">Select</option>' + opts(SECS);

      // Fix #6: Show proper DB error UI if connection fails
      const ok = await loadDatabase();
      if (!ok) {
        document.body.innerHTML = `<div class="d-flex align-items-center justify-content-center" style="min-height:100vh;background:#f8fafc">
  <div class="text-center p-5 box" style="max-width:480px">
   <i class="bi bi-wifi-off" style="font-size:4rem;color:#ef4444"></i>
   <h3 class="mt-3 fw-bold">Connection Problem</h3>
   <p class="text-muted">We couldn't connect to the event server. Please check your Supabase credentials or your internet connection.</p>
   <button class="btn btn-a me-2" onclick="location.reload()"><i class="bi bi-arrow-clockwise me-1"></i>Retry</button>
   <button class="btn btn-outline-secondary" onclick="continueOffline()">Continue Offline</button>
  </div></div>`;
        return;
      }
      const initialPage = window.location.hash.substring(1) || 'home';
      show(initialPage, false);
      history.replaceState({ page: initialPage }, '', '#' + initialPage);
      setupRealtime();
    }
    function continueOffline() {
      sessionStorage.setItem('cesOfflineMode', '1');
      location.reload();
    }
    initApp();
