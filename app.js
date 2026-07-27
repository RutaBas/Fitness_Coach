/* app.js — The Handstand Project */

const APP_VERSION = "v5";
const KEY = "handstand.state";
const WEEKS = 16;
const DEF = { start:null, stage:1, ladders:{}, log:{}, holds:[], bench:{}, weekOffset:0, mtime:0 };
let S = load();
let view = { t:"today" };
let timer = { on:false, sec:0, id:null, ex:null };

function load(){
  try{ const r = JSON.parse(localStorage.getItem(KEY)); if(r && typeof r==="object") return Object.assign({},DEF,r); }
  catch(e){}
  return Object.assign({},DEF);
}
function save(){
  S.mtime = Date.now();
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){}
  if(typeof Sync !== "undefined") Sync.queue();
}

/* ---------- dates ---------- */
const pad = n => String(n).padStart(2,"0");
const key = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today = () => key(new Date());
function daysBetween(a,b){ return Math.round((new Date(b+"T00:00:00") - new Date(a+"T00:00:00"))/86400000); }
function ensureStart(){ if(!S.start){ S.start = today(); save(); } }
function currentWeek(){
  ensureStart();
  const w = Math.floor(daysBetween(S.start, today())/7) + 1 + (S.weekOffset||0);
  return Math.min(WEEKS, Math.max(1, w));
}
function phaseOf(w){ return PHASES.find(p => w>=p[0] && w<=p[1]) || PHASES[0]; }
function weekStartKey(w){
  ensureStart();
  const d = new Date(S.start+"T00:00:00");
  d.setDate(d.getDate() + (w-1-(S.weekOffset||0))*7);
  return key(d);
}
function weekCount(w){
  const s = weekStartKey(w);
  let n = 0;
  for(const k in S.log){ const off = daysBetween(s,k); if(off>=0 && off<7) n += S.log[k].length; }
  return n;
}
function streak(){
  let n = 0; const d = new Date();
  if(!(S.log[key(d)]||[]).length) d.setDate(d.getDate()-1);   // today not done yet: allow yesterday
  while((S.log[key(d)]||[]).length){ n++; d.setDate(d.getDate()-1); }
  return n;
}
const itemsOf = s => typeof s.items === "function" ? s.items(currentWeek()) : s.items;
const doneToday = id => (S.log[today()]||[]).includes(id);
function toggle(id){
  const t = today(); const a = S.log[t] || (S.log[t]=[]);
  const i = a.indexOf(id);
  if(i<0){ a.push(id); toast("Logged · "+SESSIONS[id].name); } else { a.splice(i,1); }
  if(!a.length) delete S.log[t];
  save(); render();
}

/* ---------- figures ---------- */
function figure(f, cls){
  if(!f) return "";
  const L=(a,b,w)=>`<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke-width="${w||3.4}"/>`;
  let p = "", pr = f.props||[];
  const has = s => pr.indexOf(s)>=0;
  const gl = 'stroke="#3a3f52" stroke-width="2.2" stroke-linecap="round"';
  if(has("floor"))   p += `<path d="M4 94 L96 94" ${gl}/>`;
  if(has("floor80")) p += `<path d="M4 80 L96 80" ${gl}/>`;
  if(has("wallNear"))p += `<path d="M50 6 L50 94" ${gl}/>`;
  if(has("wallFar")) p += `<path d="M50 6 L50 94" ${gl}/>`;
  if(has("wallR"))   p += `<path d="M88 6 L88 94" ${gl}/>`;
  if(has("wallRfar"))p += `<path d="M80 6 L80 94" ${gl}/>`;
  if(has("bar"))     p += `<path d="M14 12 L86 12" ${gl}/>`;
  if(has("roller"))  p += `<circle cx="46" cy="73" r="7" fill="none" ${gl}/>`;
  if(has("boxR"))    p += `<rect x="62" y="70" width="26" height="24" rx="3" fill="none" ${gl}/>`;
  if(has("boxL"))    p += `<rect x="12" y="62" width="26" height="32" rx="3" fill="none" ${gl}/>`;
  const bnd = 'stroke="#7c9cff" stroke-width="2.4" fill="none" stroke-linecap="round"';
  if(has("bandKnee"))p += `<path d="M38 74 Q49 70 60 74" ${bnd}/>`;
  if(has("bandSide"))p += `<path d="M64 42 L94 42" ${bnd} stroke-dasharray="4 3"/>`;
  if(has("bandUp"))  p += `<path d="M30 26 L48 6 L62 26" ${bnd} stroke-dasharray="4 3"/>`;
  if(has("bandFwd")) p += `<path d="M44 52 L14 44" ${bnd} stroke-dasharray="4 3"/>`;
  if(has("bandArc")) p += `<path d="M22 22 Q48 4 74 22" fill="none" stroke="#7c9cff" stroke-width="2.4" stroke-linecap="round"/>`;

  const S_ = '#e9eaf0';
  let b = `<g stroke="${S_}" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
  if(f.nk && f.hp) b += L(f.nk, f.hp, 4);
  if(f.nk && f.el) { b += L(f.nk,f.el); b += L(f.el,f.hn); }
  if(f.nk && f.el2){ b += L(f.nk,f.el2); b += L(f.el2,f.hn2); }
  if(f.hp && f.kn) { b += L(f.hp,f.kn); b += L(f.kn,f.ft); }
  if(f.hp && f.kn2){ b += L(f.hp,f.kn2); b += L(f.kn2,f.ft2); }
  b += `</g>`;
  if(f.hd) b += `<circle cx="${f.hd[0]}" cy="${f.hd[1]}" r="6.2" fill="${S_}"/>`;

  let bells = "";
  const bell = h => h ? `<rect x="${h[0]-5}" y="${h[1]-2.6}" width="10" height="5.2" rx="2" fill="#7c9cff"/>` : "";
  if(has("bellUp")||has("bellDown")||has("bellSide")){ bells += bell(f.hn); if(!has("bellSide")) bells += bell(f.hn2); }

  return `<figure class="ex ${cls||""}"><svg viewBox="0 0 100 100" aria-hidden="true">${p}${b}${bells}</svg></figure>`;
}

/* ---------- ui helpers ---------- */
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._i); toast._i = setTimeout(()=>t.classList.remove("show"), 1700);
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ytLink = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const bestHold = k => S.holds.filter(h=>h.ex===k).reduce((m,h)=>Math.max(m,h.sec),0);
const uid = () => (crypto && crypto.randomUUID) ? crypto.randomUUID()
  : Date.now().toString(36)+Math.random().toString(36).slice(2,8);

/* ---------- screens ---------- */
function scrToday(){
  const w = currentWeek(), ph = phaseOf(w), c = weekCount(w);
  const ids = ["daily","A","B","C","D","E"];
  return `
  <h1>The Handstand Project</h1>
  <div class="sub">Week ${w} of ${WEEKS} · ${new Date().toLocaleDateString(undefined,{weekday:"long", month:"short", day:"numeric"})}</div>
  <div class="cards" style="margin-top:14px">
    <div class="card"><div class="label">Streak</div><div class="stat g">${streak()}</div></div>
    <div class="card"><div class="label">This week</div><div class="stat a">${c}</div></div>
    <div class="card"><div class="label">Stage</div><div class="stat">${S.stage}</div></div>
  </div>
  <div class="panel">
    <span class="phase">${esc(ph[2])}</span>
    <div class="sub">${esc(ph[3])}</div>
  </div>
  <h3>Today</h3>
  ${ids.map(id=>{
    const s = SESSIONS[id], on = doneToday(id);
    return `<div class="sess ${on?"on":""}">
      <div class="dot" style="background:${s.color}"></div>
      <div class="txt" data-go="sess:${id}"><div class="nm">${esc(s.name)}</div><div class="sb">${esc(s.sub)}</div></div>
      <div class="tick" data-tog="${id}">${on?"✓":""}</div>
    </div>`;}).join("")}
  <p class="hint" style="margin-top:12px">Tap the name to be walked through it. Tap the box to log it.</p>
  <div class="panel">
    <h2>Rules that keep this alive</h2>
    ${RULES.map(r=>`<div style="padding:9px 0;border-bottom:1px solid var(--line)"><b style="font-size:.9rem">${esc(r[0])}</b><div class="dim">${esc(r[1])}</div></div>`).join("")}
  </div>`;
}

function scrSess(){
  const s = SESSIONS[view.id], its = itemsOf(s), i = view.i, item = its[i], ex = EX[item[0]];
  const last = i === its.length-1;
  return `
  <div class="step">${esc(s.name)} · ${i+1} of ${its.length}</div>
  <div class="prog"><i style="width:${(i+1)/its.length*100}%"></i></div>
  ${exBlock(ex, item[1])}
  ${timerBlock(item[0])}
  <div class="btnrow">
    <button class="act ghost" data-nav="${i>0?"prev":"quit"}">${i>0?"← Back":"Quit"}</button>
    <button class="act ${last?"good":""}" data-nav="${last?"finish":"next"}">${last?"Finish session ✓":"Next →"}</button>
  </div>
  <p class="hint" style="margin-top:14px;text-align:center">Skip anything that hurts. A shorter honest session still counts.</p>`;
}

function exBlock(ex, dose){
  return `<div class="panel">
    <div class="exhead">
      ${figure(ex.fig)}
      <div><h2>${esc(ex.name)}</h2><div class="sub">${esc(dose||ex.dose)}</div></div>
    </div>
    <p class="why">${esc(ex.why)}</p>
    <h3>How</h3><ol class="how">${ex.how.map(h=>`<li>${esc(h)}</li>`).join("")}</ol>
    <h3>Cues</h3><ul class="cues">${ex.cues.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>
    <p class="mist"><b>Common mistake:</b> ${esc(ex.mistake)}</p>
    <a class="vid" href="${ytLink(ex.vid)}" target="_blank" rel="noopener">▶ Watch a demo</a>
  </div>`;
}

function timerBlock(k){
  const b = bestHold(k);
  return `<div class="panel timer">
    <div class="tnum ${timer.on?"run":""}" id="tnum">${fmt(timer.ex===k?timer.sec:0)}</div>
    <div class="tbest">${b?("Best logged: "+b+" sec"):"No hold logged yet"}</div>
    <div class="btnrow">
      <button class="act ${timer.on?"ghost":""}" data-timer="${timer.on?"stop":"start"}" data-ex="${k}">${timer.on?"Stop":"Start timer"}</button>
      <button class="act ghost" data-timer="log" data-ex="${k}" ${timer.sec&&timer.ex===k?"":"disabled"}>Log hold</button>
    </div>
  </div>`;
}
const fmt = s => Math.floor(s/60)+":"+pad(s%60);

function scrProgress(){
  const w = currentWeek();
  const counts = Array.from({length:WEEKS},(_,i)=>weekCount(i+1));
  const max = Math.max(5, ...counts);
  const bars = counts.map((c,i)=>{
    const h = c/max*54, x = 6+i*(92/WEEKS);
    const fill = (i+1===w) ? "#7c9cff" : (i+1<w ? "#5ee0b0" : "#2e3242");
    return `<rect x="${x}" y="${60-(h||0.8)}" width="4.1" height="${h||0.8}" rx="1.4" fill="${fill}"/>`;
  }).join("");
  const hs = S.holds.slice();
  return `
  <h1>Progress</h1>
  <div class="sub">Week ${w} of ${WEEKS} · ${Object.keys(S.log).length} day${Object.keys(S.log).length===1?"":"s"} trained</div>
  <div class="cards" style="margin-top:14px">
    <div class="card"><div class="label">Total sessions</div><div class="stat">${counts.reduce((a,b)=>a+b,0)}</div></div>
    <div class="card"><div class="label">Best free hold</div><div class="stat g">${bestHold("freestanding")||0}s</div></div>
    <div class="card"><div class="label">Best wall hold</div><div class="stat a">${bestHold("chestWall")||0}s</div></div>
  </div>
  <div class="panel">
    <h2>Sessions per week</h2><p class="hint">Consistency beats intensity. Four a week is plenty.</p>
    <svg class="chart" viewBox="0 0 100 68">
      <path d="M4 60 L98 60" stroke="#2e3242" stroke-width="1"/>${bars}
      ${counts.map((c,i)=>`<text x="${6+i*(92/WEEKS)+2.1}" y="66" font-size="3.4" fill="#959bb0" text-anchor="middle">${i+1}</text>`).join("")}
    </svg>
  </div>
  <div class="panel">
    <h2>Logged holds</h2>
    <p class="hint">${hs.length?"Newest first.":"Use the timer in a session to log your holds — this is where you'll see the progress you can't feel."}</p>
    ${hs.length? `<table><thead><tr><th>Date</th><th>Drill</th><th>Sec</th></tr></thead><tbody>
      ${hs.slice(-15).reverse().map(h=>`<tr><td>${esc(h.d)}</td><td>${esc(EX[h.ex].name)}</td><td>${h.sec}</td></tr>`).join("")}
    </tbody></table>`:""}
  </div>
  <div class="panel">
    <h2>Handstand stages</h2><p class="hint">Tap the stage you're working. Move up only when you meet the exit test.</p>
    ${STAGES.map((s,i)=>{const n=i+1;return `<div class="stage ${n<S.stage?"past":(n===S.stage?"cur":"")}" data-stage="${n}">
      <div class="snum">${n<S.stage?"✓":n}</div>
      <div><div style="font-weight:600;font-size:.93rem">${esc(s[0])}</div><div class="dim">${esc(s[1])}</div>
      <div class="exit">Exit test: ${esc(s[2])}</div></div></div>`;}).join("")}
  </div>
  <div class="panel">
    <h2>Skill goals</h2><p class="hint">These move at their own pace, independent of the handstand ladder. Tap the level you're on.</p>
    ${LADDERS.map(L=>{const cur=S.ladders[L.id]||1;return `
      <div style="margin-bottom:16px">
        <div style="display:flex;gap:9px;align-items:center;margin-bottom:7px">
          <div style="width:34px;flex:0 0 34px">${figure(EX[L.ex].fig)}</div>
          <b style="font-size:.93rem">${esc(L.name)}</b>
          <span class="dim" style="margin-left:auto">${cur}/${L.levels.length}</span>
        </div>
        <div class="prog"><i style="width:${cur/L.levels.length*100}%"></i></div>
        ${L.levels.map((lv,i)=>{const n=i+1;return `<div class="stage ${n<cur?"past":(n===cur?"cur":"")}" data-lad="${L.id}:${n}">
          <div class="snum">${n<cur?"✓":n}</div>
          <div><div style="font-weight:600;font-size:.9rem">${esc(lv[0])}</div><div class="dim">${esc(lv[1])}</div>
          <div class="exit">Target: ${esc(lv[2])}</div></div></div>`;}).join("")}
      </div>`;}).join("")}
  </div>
  <div class="panel">
    <h2>Flexibility benchmarks</h2><p class="hint">Retest in weeks 1, 8 and 16. Numbers beat feelings.</p>
    <table><thead><tr><th>Test</th><th>Wk 1</th><th>Wk 8</th><th>Wk 16</th></tr></thead><tbody>
    ${BENCH.map(b=>`<tr><td>${esc(b[1])}${b[2]!=="text"?" ("+b[2]+")":""}</td>
      ${["w1","w6","w12"].map(c=>`<td><input type="text" data-bench="${b[0]}.${c}" value="${esc((S.bench[b[0]]||{})[c]||"")}" placeholder="—"></td>`).join("")}
    </tr>`).join("")}
    </tbody></table>
  </div>`;
}

function scrLibrary(){
  const ORDER = ["Reload","Prep","Line","Balance","Skill","Strength","Flexibility","Cardio"];
  const cats = [];
  for(const k in EX){ if(cats.indexOf(EX[k].cat)<0) cats.push(EX[k].cat); }
  cats.sort((x,y)=>{const a=ORDER.indexOf(x),b=ORDER.indexOf(y);
    return (a<0?99:a)-(b<0?99:b);});
  if(view.ex) return `<div class="step">Library</div>${exBlock(EX[view.ex])}
    <div class="btnrow"><button class="act ghost" data-nav="lib">← All exercises</button></div>`;
  return `<h1>Exercise library</h1><div class="sub">${Object.keys(EX).length} drills — what it's for, how to do it, what people get wrong.</div>
  ${cats.map(c=>`<h3>${esc(c)}</h3><div class="panel" style="padding:4px 16px">
    ${Object.keys(EX).filter(k=>EX[k].cat===c).map(k=>`<div class="libitem" data-go="ex:${k}">
      ${figure(EX[k].fig)}<div style="flex:1"><div style="font-weight:600;font-size:.92rem">${esc(EX[k].name)}</div>
      <div class="dim">${esc(EX[k].dose)}</div></div><div class="chev">›</div></div>`).join("")}
  </div>`).join("")}`;
}

function scrPlan(){
  const w = currentWeek();
  return `<h1>The plan</h1><div class="sub">16 weeks · rebuilt around where you actually are</div>
  <div class="panel">
    <h2>Where you are</h2>
    <div class="weekbar">${Array.from({length:WEEKS},(_,i)=>{const n=i+1;
      return `<div class="wk ${n===w?"active":""} ${weekCount(n)>=4?"done":""}" data-week="${n}">W${n}</div>`;}).join("")}</div>
    <p class="hint">Weeks advance automatically from your start date (${esc(S.start||today())}). Tap a week to nudge it if life happened.</p>
  </div>
  ${PHASES.map(p=>`<div class="panel"><span class="phase">Weeks ${p[0]}–${p[1]} · ${esc(p[2])}</span>
    <div class="sub">${esc(p[3])}</div></div>`).join("")}
  <div class="panel">
    <h2>The weekly template</h2>
    <p class="hint">3–4 of the 45-min days, plus Day E and the Daily 10. Day E is short on purpose — protect it.</p>
    ${["A","B","C","D","E"].map(id=>`<div style="padding:9px 0;border-bottom:1px solid var(--line)">
      <b style="font-size:.9rem;color:${SESSIONS[id].color}">${esc(SESSIONS[id].name)}</b>
      <div class="dim">${esc(SESSIONS[id].sub)}</div></div>`).join("")}
    <p class="hint" style="margin-top:12px">Put A and B on your best-energy days. C is the day for when your brain is fried — no decisions required.</p>
  </div>
  <div class="panel">
    <h2>How this plan works</h2>
    <p class="why">Three months off is real detraining — the handstand you had before is a memory of a stronger body, and the way back is to rebuild rather than to push through. So every drill in the first block keeps your feet supported and has a walk-out: you get into it the same way you get out of it. Nothing here can drop you on your head, and nothing needs more floor than a yoga mat. The inversion work returns in week 5, once the strength is there to hold it.</p>
  </div>
  ${typeof Sync !== "undefined" ? Sync.html() : ""}
  <div class="panel">
    <h2>Version</h2>
    <p class="hint">If the app looks out of date, check this against what you deployed.</p>
    <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line)">
      <span class="dim">App build</span><b>${APP_VERSION}</b></div>
    <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line)">
      <span class="dim">Sessions defined</span><b>${Object.keys(SESSIONS).length} (${Object.keys(SESSIONS).join(", ")})</b></div>
    <div style="display:flex;justify-content:space-between;padding:7px 0">
      <span class="dim">Cache</span><b id="cachename">checking…</b></div>
    <div class="btnrow"><button class="act ghost" data-nav="update">Force update now</button></div>
  </div>
  <div class="panel">
    <h2>Data</h2>
    <p class="hint">${typeof Sync !== "undefined" && Sync.signedIn()
      ? "Saved on this device and synced to your account."
      : "Stored on this device only. Nothing is uploaded anywhere."}</p>
    <div class="btnrow">
      <button class="act ghost" data-nav="export">Export backup</button>
      <button class="act ghost" data-nav="wipe">Reset all data</button>
    </div>
  </div>`;
}

/* ---------- render + events ---------- */
function render(){
  const app = document.getElementById("app");
  app.innerHTML = view.t==="sess" ? scrSess()
    : view.t==="progress" ? scrProgress()
    : view.t==="library" ? scrLibrary()
    : view.t==="plan" ? scrPlan() : scrToday();
  document.querySelectorAll("#nav button").forEach(b=>
    b.classList.toggle("on", b.dataset.t === (view.t==="sess"?"today":view.t)));
  window.scrollTo(0, view.t==="sess" ? 0 : window._sy||0);
  if(view.t==="plan") showCache();
}

document.getElementById("nav").addEventListener("click", e=>{
  const b = e.target.closest("button"); if(!b) return;
  stopTimer(); view = { t:b.dataset.t }; window._sy=0; render();
});

document.addEventListener("click", e=>{
  const t = e.target;
  const go = t.closest("[data-go]");
  if(go){ const [k,v] = go.dataset.go.split(":");
    if(k==="sess"){ view={t:"sess", id:v, i:0}; } else { view={t:"library", ex:v}; }
    render(); return; }

  const tg = t.closest("[data-tog]"); if(tg){ toggle(tg.dataset.tog); return; }
  const ld = t.closest("[data-lad]");
  if(ld){ const [id,n] = ld.dataset.lad.split(":"); S.ladders[id] = +n; save(); render(); return; }

  const st = t.closest("[data-stage]"); if(st){ S.stage = +st.dataset.stage; save(); render(); return; }
  const wk = t.closest("[data-week]"); if(wk){ S.weekOffset = (S.weekOffset||0) + (+wk.dataset.week - currentWeek()); save(); render(); return; }

  const tm = t.closest("[data-timer]");
  if(tm){
    const a = tm.dataset.timer, k = tm.dataset.ex;
    if(a==="start") startTimer(k);
    else if(a==="stop") stopTimer();
    else if(a==="log"){
      if(timer.sec>0){ S.holds.push({id:uid(), d:today(), ex:k, sec:timer.sec}); save();
        toast("Logged "+timer.sec+" sec"); timer.sec=0; stopTimer(); }
    }
    render(); return;
  }

  const au = t.closest("[data-auth]");
  if(au){ if(typeof Sync !== "undefined") Sync.handle(au.dataset.auth); return; }

  const nv = t.closest("[data-nav]");
  if(nv){
    const a = nv.dataset.nav; stopTimer();
    if(a==="next"){ view.i++; }
    else if(a==="prev"){ view.i--; }
    else if(a==="quit"){ view = {t:"today"}; }
    else if(a==="finish"){ if(!doneToday(view.id)) toggle(view.id); view={t:"today"}; }
    else if(a==="lib"){ view={t:"library"}; }
    else if(a==="update"){ forceUpdate(); return; }
    else if(a==="export"){ exportData(); return; }
    else if(a==="wipe"){ if(confirm("Delete all logged progress on this device?")){ S=Object.assign({},DEF); save(); view={t:"today"}; } }
    render(); return;
  }
});

document.addEventListener("change", e=>{
  const b = e.target.closest("[data-bench]"); if(!b) return;
  const [id,col] = b.dataset.bench.split(".");
  (S.bench[id] = S.bench[id] || {})[col] = b.value.trim();
  save();
});
document.addEventListener("scroll", ()=>{ if(view.t!=="sess") window._sy = window.scrollY; }, {passive:true});

/* ---------- timer ---------- */
function startTimer(k){
  if(timer.ex !== k) timer.sec = 0;
  timer.ex = k; timer.on = true;
  clearInterval(timer.id);
  timer.id = setInterval(()=>{ timer.sec++;
    const n = document.getElementById("tnum"); if(n) n.textContent = fmt(timer.sec);
    const lg = document.querySelector('[data-timer="log"]'); if(lg) lg.disabled = false;
  }, 1000);
}
function stopTimer(){ timer.on=false; clearInterval(timer.id); timer.id=null; }

/* ---------- cache / update ---------- */
async function showCache(){
  const el = document.getElementById("cachename"); if(!el) return;
  try{
    const keys = await caches.keys();
    el.textContent = keys.length ? keys.join(", ") : "none (fresh load)";
  }catch(e){ el.textContent = "unavailable"; }
}
async function forceUpdate(){
  toast("Clearing cache…");
  try{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    if("serviceWorker" in navigator){
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
  }catch(e){}
  location.reload(true);
}

/* ---------- export ---------- */
function exportData(){
  const txt = JSON.stringify(S, null, 2);
  const blob = new Blob([txt], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "handstand-backup-"+today()+".json";
  a.click();
  toast("Backup downloaded");
}

/* ---------- bridge for sync.js ---------- */
window.__app = {
  getS: () => S,
  setS: s => { S = s; try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} render(); },
  render: render,
  isPlan: () => view.t === "plan"
};

/* ---------- boot ---------- */
ensureStart();
render();
if(typeof Sync !== "undefined") Sync.init();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
