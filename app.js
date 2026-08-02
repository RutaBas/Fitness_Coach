/* app.js — The Handstand Project */

const APP_VERSION = "v13";
const KEY = "handstand.state";
const WEEKS = 16;
const DEF = { start:null, stage:1, ladders:{}, log:{}, holds:[], bench:{}, weekOffset:0, mtime:0, gear:{band:false, bar:false, wheel:true}, rest:75, wake:true };
let S = load();
let view = { t:"today" };
let timer = { on:false, sec:0, id:null, ex:null };

function load(){
  try{ const r = JSON.parse(localStorage.getItem(KEY));
    if(r && typeof r==="object"){
      const s = Object.assign({},DEF,r);
      s.gear = Object.assign({}, DEF.gear, r.gear||{});   // new kit types default sensibly
      if(!s.rest) s.rest = DEF.rest;
      return s;
    } }
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
/* Time estimate. Counts SETS and per-side doubling, not exercises — the mistake
   that made Day E "22 min" when it was really 43. Rest interval comes from your setting. */
function estSecs(dose, exKey){
  if(!dose) return 0;
  const d = String(dose);
  const mm = d.match(/(\d+)\s*(?:–|-)\s*(\d+)\s*min|(\d+)\s*min/);
  if(mm) return parseInt(mm[2]||mm[3],10)*60;
  const sets  = parseInt((d.match(/(\d+)\s*×/)||[])[1]||1,10);
  const sides = /\/\s*side|direction/.test(d) ? 2 : 1;
  const secm  = d.match(/×\s*(\d+)(?:–\d+)?\s*sec/);
  const work  = secm ? parseInt(secm[1],10)
              : parseInt((d.match(/×\s*(\d+)/)||[])[1]||8,10) * 3;
  const ex = exKey && EX[exKey];
  const rest = (ex && typeof ex.rest === "number") ? ex.rest : (S.rest||75);
  return sets*sides*(work + rest);
}
function sessionMins(s){
  return Math.round(itemsOf(s).reduce((a,it)=>a+estSecs(it[1]||EX[it[0]].dose, it[0]),0)/60);
}
function remainingMins(s,i){
  const its = itemsOf(s);
  return Math.round(its.slice(i).reduce((a,it)=>a+estSecs(it[1]||EX[it[0]].dose, it[0]),0)/60);
}
function hasGear(g){ return !!(S.gear && S.gear[g]); }
function swapGear(items){
  return items.map(it => {
    const ex = EX[it[0]];
    if(ex && ex.gear && !hasGear(ex.gear) && EX[ex.alt]) return [ex.alt, EX[ex.alt].dose];
    return it;
  });
}
const itemsOf = s => swapGear(typeof s.items === "function" ? s.items(currentWeek()) : s.items);
const viewDay = () => view.day || today();
const isToday = () => viewDay() === today();
const doneToday = id => (S.log[viewDay()]||[]).includes(id);
const dayLabel = k => {
  const off = daysBetween(k, today());
  if(off===0) return "Today";
  if(off===1) return "Yesterday";
  return new Date(k+"T00:00:00").toLocaleDateString(undefined,{weekday:"long", month:"short", day:"numeric"});
};
function toggle(id){
  const t = viewDay(); const a = S.log[t] || (S.log[t]=[]);
  const i = a.indexOf(id);
  if(i<0){ a.push(id); toast("Logged · "+SESSIONS[id].name+(isToday()?"":" · "+dayLabel(t))); } else { a.splice(i,1); }
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
  if(has("wheel"))   p += `<circle cx="46" cy="70" r="13" fill="none" stroke="#7ad4c8" stroke-width="2.6"/>`;
  if(has("wheelL"))  p += `<circle cx="20" cy="80" r="13" fill="none" stroke="#7ad4c8" stroke-width="2.6"/>`;
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
  <h3>Last 7 days</h3>
  <div class="daystrip">
    ${Array.from({length:7},(_,i)=>{
      const d = new Date(); d.setDate(d.getDate()-(6-i));
      const k = key(d), n = (S.log[k]||[]).length, sel = k===viewDay();
      return `<div class="day ${sel?"sel":""} ${n?"has":""}" data-day="${k}">
        <div class="dw">${d.toLocaleDateString(undefined,{weekday:"narrow"})}</div>
        <div class="dn">${d.getDate()}</div>
        <div class="dd">${n?"•".repeat(Math.min(n,4)):"&nbsp;"}</div>
      </div>`;}).join("")}
  </div>
  <p class="hint" style="margin-top:8px">Yesterday's ticks stay on yesterday — they still count. Tap any day to see or fix what you logged.</p>
  ${isToday() ? "" : `<div class="viewing">Logging for <b>${esc(dayLabel(viewDay()))}</b>
    <button class="act ghost" data-nav="backtoday" style="padding:6px 12px;min-height:34px;font-size:.8rem">Back to today</button></div>`}
  <h3>${esc(dayLabel(viewDay()))}</h3>
  ${ids.map(id=>{
    const s = SESSIONS[id], on = doneToday(id);
    return `<div class="sess ${on?"on":""}">
      <div class="dot" style="background:${s.color}"></div>
      <div class="txt" data-go="sess:${id}"><div class="nm">${esc(s.name)} <span class="mins">~${sessionMins(s)} min</span></div><div class="sb">${esc(s.sub)}</div></div>
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
  const raw = (typeof s.items === "function" ? s.items(currentWeek()) : s.items)[i];
  const sub = (raw && raw[0] !== item[0] && EX[raw[0]]) ? EX[raw[0]].name : null;
  return `<div class="sessbody">
  <div class="step">${esc(s.name)} · ${i+1} of ${its.length} · ~${remainingMins(s,i)} min left</div>
  <div class="prog"><i style="width:${(i+1)/its.length*100}%"></i></div>
  ${i===0 ? restBrief(s) : ""}
  ${exBlock(ex, item[1])}
  ${timerBar(ex, item[1], item[0])}
  <div class="btnrow">
    <button class="act ghost" data-nav="${i>0?"prev":"quit"}">${i>0?"← Back":"Quit"}</button>
    <button class="act ${last?"good":""}" data-nav="${last?"finish":"next"}">${last?"Finish session ✓":"Next →"}</button>
  </div>
  ${sub ? `<p class="hint" style="margin-top:12px;text-align:center">Swapped in for <b>${esc(sub)}</b> because you don't have that kit. Turn it on under Plan → Equipment.</p>` : ""}
  <p class="hint" style="margin-top:14px;text-align:center">Skip anything that hurts. A shorter honest session still counts.</p></div>`;
}

function restBrief(s){
  const rs = itemsOf(s).map(it => EX[it[0]].rest).filter(r => typeof r === "number" && r > 0);
  if(!rs.length) return "";
  const lo = Math.min(...rs), hi = Math.max(...rs);
  const fmtR = r => r >= 60 ? (r/60 % 1 ? (r/60).toFixed(1) : r/60) + " min" : r + " sec";
  const body = lo === hi
    ? `<b>${fmtR(lo)} between every set.</b>`
    : `<b>${fmtR(lo)}–${fmtR(hi)} depending on the drill</b> — each one tells you, and it's shown on the timer bar.`;
  const why = hi >= 90
    ? "The heavy lifts need the long end: you're resting to recover strength, not to catch your breath. Short-changing it makes the next set worse, not tougher."
    : "Core and mobility work recovers fast — long rests here just stretch the session out.";
  return `<div class="panel restbrief"><h2>Rest between sets</h2>
    <p style="margin:0 0 6px;font-size:.92rem">${body}</p>
    <p class="dim" style="margin:0">${why} These are guides — if you need more, take it.</p></div>`;
}
function exBlock(ex, dose){
  return `<div class="panel">
    <div class="exhead">
      ${figure(ex.fig)}
      <div><h2>${esc(ex.name)}</h2><div class="sub">${esc(dose||ex.dose)}</div>
      ${ex.load ? `<div class="loadchip">${esc(ex.load)}</div>` : ""}
      ${ex.rest ? `<div class="restchip">rest ${ex.rest>=60?(ex.rest/60%1?(ex.rest/60).toFixed(1):ex.rest/60)+" min":ex.rest+" sec"}</div>` : ""}</div>
    </div>
    <p class="why">${esc(ex.why)}</p>
    ${ex.vs ? `<p class="vs"><b>Easy to confuse:</b> ${esc(ex.vs)}</p>` : ""}
    <h3>How</h3><ol class="how">${ex.how.map(h=>`<li>${esc(h)}</li>`).join("")}</ol>
    <h3>Cues</h3><ul class="cues">${ex.cues.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>
    <p class="mist"><b>Common mistake:</b> ${esc(ex.mistake)}</p>
    <a class="vid" href="${ytLink(ex.vid)}" target="_blank" rel="noopener">▶ Watch a demo</a>
  </div>`;
}

function timerBar(ex, dose, k){
  const b = bestHold(k);
  return `<div class="tbar" id="tbar">
    <div class="tinfo">
      <div class="tname">${esc(ex.name)}</div>
      <div class="tdose">${esc(dose||ex.dose)}${b?" · best "+b+"s":""}</div>
      ${ex.load ? `<div class="tload">${esc(ex.load.split("—")[0].split(".")[0].trim())}</div>` : ""}
      ${ex.rest ? `<div class="trest">rest ${ex.rest}s</div>` : ""}
    </div>
    <div class="tnum" id="tnum">${fmt(timer.ex===k?timer.sec:0)}</div>
    <button class="tbtn" id="tbtn" data-timer="${timer.on?"stop":"start"}" data-ex="${k}">${timer.on?"Stop":"Start"}</button>
    <button class="tbtn ghost" id="tlog" data-timer="log" data-ex="${k}" ${(timer.sec&&timer.ex===k)?"":"disabled"}>Log</button>
  </div>`;
}
/* update the bar in place — never re-render, that's what reset the scroll position */
function paintTimer(k){
  const n = document.getElementById("tnum");
  if(n){ n.textContent = fmt(timer.ex===k?timer.sec:0); n.classList.toggle("run", timer.on); }
  const btn = document.getElementById("tbtn");
  if(btn){ btn.textContent = timer.on ? "Stop" : "Start"; btn.dataset.timer = timer.on ? "stop" : "start"; }
  const lg = document.getElementById("tlog");
  if(lg) lg.disabled = !(timer.sec && timer.ex===k);
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
    <p class="hint">Times are calculated from the actual sets, counting each side separately, using your rest setting (${S.rest||75}s).</p>
    ${["A","B","C","D","E"].map(id=>`<div style="padding:9px 0;border-bottom:1px solid var(--line)">
      <b style="font-size:.9rem;color:${SESSIONS[id].color}">${esc(SESSIONS[id].name)}</b>
      <span class="mins" style="float:right">~${sessionMins(SESSIONS[id])} min</span>
      <div class="dim">${esc(SESSIONS[id].sub)}</div></div>`).join("")}
    <p class="hint" style="margin-top:12px">Put A and B on your best-energy days. C is the day for when your brain is fried — no decisions required.</p>
  </div>
  <div class="panel">
    <h2>How this plan works</h2>
    <p class="why">Three months off is real detraining — the handstand you had before is a memory of a stronger body, and the way back is to rebuild rather than to push through. So every drill in the first block keeps your feet supported and has a walk-out: you get into it the same way you get out of it. Nothing here can drop you on your head, and nothing needs more floor than a yoga mat. The inversion work returns in week 5, once the strength is there to hold it.</p>
  </div>
  ${typeof Sync !== "undefined" ? Sync.html() : ""}
  <div class="panel">
    <h2>Equipment</h2>
    <p class="hint">Sessions adapt automatically. Turn something on and the drills that use it come back.</p>
    ${[["band","Resistance bands","Band rows, pulldowns, lateral walks, Pallof press"],
       ["bar","Pull-up bar","Dead hangs, scapular pulls, negatives — the pull-up ladder"],
       ["wheel","Yoga wheel (12\")","Upgrades the thoracic, puppy and bridge drills on Day D"]]
      .map(g=>`<div class="sess ${hasGear(g[0])?"on":""}" data-gear="${g[0]}" style="margin-bottom:8px">
        <div class="txt"><div class="nm">${esc(g[1])}</div><div class="sb">${esc(g[2])}</div></div>
        <div class="tick">${hasGear(g[0])?"✓":""}</div></div>`).join("")}
    <p class="hint" style="margin-top:10px;margin-bottom:0">Without these, everything runs on dumbbells, a chair and the floor — nothing is skipped, it's substituted.</p>
  </div>
  <div class="panel">
    <h2>Your weights</h2>
    <p class="hint">Pairs 8 · 10 · 15 lb — Singles 20 · 25 lb</p>
    <div style="padding:8px 0;border-bottom:1px solid var(--line)"><b style="font-size:.88rem">Heaviest pair (15 lb)</b>
      <div class="dim">Romanian deadlift, bent-over row once 12 reps are easy</div></div>
    <div style="padding:8px 0;border-bottom:1px solid var(--line)"><b style="font-size:.88rem">Singles (20 / 25 lb)</b>
      <div class="dim">Loaded and suitcase carries, hip thrust across the hips</div></div>
    <div style="padding:8px 0;border-bottom:1px solid var(--line)"><b style="font-size:.88rem">Lightest pair (8 lb)</b>
      <div class="dim">Overhead press, pullover, Jefferson curl, pistol counterweight</div></div>
    <p class="hint" style="margin:11px 0 0">Rule for anything not listed: the last 2 reps should be hard but your form shouldn't break. Fewer reps beats heavier-and-sloppy — that's how you progress when the weight can't change.</p>
  </div>
  <div class="panel">
    <h2>Rest between sets</h2>
    <p class="hint">Fallback for drills without their own recommendation. Each exercise now carries its own rest guidance.</p>
    <div class="restrow">
      ${[45,60,75,90,120].map(r=>`<div class="wk ${S.rest===r?"active":""}" data-rest="${r}">${r>=60?(r/60)+(r%60?".5":"")+"m":r+"s"}</div>`).join("")}
    </div>
    <p class="hint" style="margin:10px 0 0">Longer rest is fine, and often better for strength work — it just makes sessions longer, which you should be able to see in advance.</p>
  </div>
  <div class="panel">
    <h2>During a session</h2>
    <div class="sess ${S.wake?"on":""}" data-wake="1" style="margin-bottom:8px">
      <div class="txt"><div class="nm">Keep the screen awake</div>
      <div class="sb">${wakeSupported() ? "Stops your phone locking mid-hold" : "Not supported by this browser — try Safari, iOS 16.4+"}</div></div>
      <div class="tick">${S.wake?"✓":""}</div>
    </div>
    <p class="hint" style="margin-bottom:0">Only active while you're inside a session, so it won't drain your battery the rest of the day.</p>
  </div>
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
  if(view.t==="sess") keepAwake(); else releaseAwake();
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
  const rs = t.closest("[data-rest]");
  if(rs){ S.rest = +rs.dataset.rest; save(); render(); return; }

  const wkl = t.closest("[data-wake]");
  if(wkl){ S.wake = !S.wake; save(); if(S.wake) keepAwake(); else releaseAwake();
    toast(S.wake?"Screen will stay awake in sessions":"Screen may sleep normally"); render(); return; }

  const dy = t.closest("[data-day]");
  if(dy){ view.day = dy.dataset.day === today() ? null : dy.dataset.day; render(); return; }

  const gr = t.closest("[data-gear]");
  if(gr){ const g = gr.dataset.gear; S.gear = S.gear || {}; S.gear[g] = !S.gear[g]; save();
    toast(S.gear[g] ? "Enabled — band/bar drills restored" : "Disabled — using dumbbell alternates"); render(); return; }

  const ld = t.closest("[data-lad]");
  if(ld){ const [id,n] = ld.dataset.lad.split(":"); S.ladders[id] = +n; save(); render(); return; }

  const st = t.closest("[data-stage]"); if(st){ S.stage = +st.dataset.stage; save(); render(); return; }
  const wk = t.closest("[data-week]"); if(wk){ S.weekOffset = (S.weekOffset||0) + (+wk.dataset.week - currentWeek()); save(); render(); return; }

  const tm = t.closest("[data-timer]");
  if(tm){
    const a = tm.dataset.timer, k = tm.dataset.ex;
    if(a==="start"){ startTimer(k); keepAwake(); }
    else if(a==="stop") stopTimer();
    else if(a==="log"){
      if(timer.sec>0){ S.holds.push({id:uid(), d:viewDay(), ex:k, sec:timer.sec}); save();
        toast("Logged "+timer.sec+" sec"); timer.sec=0; stopTimer(); }
    }
    paintTimer(k); return;      // no render() — keeps your scroll position
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
    else if(a==="backtoday"){ view = {t:"today"}; }
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
  timer.id = setInterval(()=>{ timer.sec++; paintTimer(k); }, 1000);
  paintTimer(k);
}
function stopTimer(){ timer.on=false; clearInterval(timer.id); timer.id=null;
  if(timer.ex) paintTimer(timer.ex); }

/* ---------- keep the screen awake ---------- */
let wakeLock = null;
async function keepAwake(){
  if(!S.wake || !("wakeLock" in navigator)) return;
  try{
    if(wakeLock) return;
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", ()=>{ wakeLock = null; });
  }catch(e){ wakeLock = null; }
}
function releaseAwake(){ if(wakeLock){ try{ wakeLock.release(); }catch(e){} wakeLock = null; } }
document.addEventListener("visibilitychange", ()=>{
  if(document.hidden) { wakeLock = null; }
  else if(view.t === "sess") keepAwake();
});
const wakeSupported = () => ("wakeLock" in navigator);

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
