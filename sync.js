/* sync.js — optional Supabase auth + cloud sync.
   Offline-first: the app never waits on the network. Local state is the source of
   truth while you train; sync merges it with the cloud whenever it can. */

const Sync = (() => {
  let client = null, session = null, busy = false, msg = "", lastSync = null;
  let pushTimer = null;

  const cfg = () => (window.CONFIG && window.CONFIG.SUPABASE_URL && window.CONFIG.SUPABASE_ANON_KEY)
    ? window.CONFIG : null;
  const configured = () => !!cfg();
  const available = () => configured() && typeof window.supabase !== "undefined";

  function init(){
    if(!available()) return;
    try{
      client = window.supabase.createClient(cfg().SUPABASE_URL, cfg().SUPABASE_ANON_KEY, {
        auth:{ persistSession:true, autoRefreshToken:true }
      });
    }catch(e){ client = null; return; }

    client.auth.getSession().then(({data}) => {
      session = data.session || null;
      if(session) pull(true);
      redraw();
    });
    client.auth.onAuthStateChange((_e, s) => {
      const was = !!session; session = s || null;
      if(session && !was) pull(true); else redraw();
    });
    // pull again when the app comes back to the foreground
    document.addEventListener("visibilitychange", () => {
      if(!document.hidden && session) pull(false);
    });
  }

  /* ---------- merge ---------- */
  /* log: union of session ids per date. holds: union by id.
     scalars (stage, start, weekOffset) and bench: whichever side was saved last. */
  function merge(local, remote){
    if(!remote) return local;
    const out = Object.assign({}, local);
    const log = {};
    [remote.log||{}, local.log||{}].forEach(src => {
      for(const d in src){ const set = log[d] || (log[d] = []);
        (src[d]||[]).forEach(id => { if(set.indexOf(id) < 0) set.push(id); }); }
    });
    out.log = log;

    const seen = {}, holds = [];
    ((remote.holds||[]).concat(local.holds||[])).forEach(h => {
      const k = h.id || (h.d+"|"+h.ex+"|"+h.sec);
      if(!seen[k]){ seen[k] = 1; holds.push(h); }
    });
    out.holds = holds.sort((a,b) => String(a.d).localeCompare(String(b.d)));

    const remoteNewer = (remote.mtime||0) > (local.mtime||0);
    if(remoteNewer){
      out.stage = remote.stage; out.weekOffset = remote.weekOffset; out.bench = remote.bench || {};
    }
    // earliest start date wins — that's when the program actually began
    if(remote.start && (!local.start || remote.start < local.start)) out.start = remote.start;
    out.mtime = Math.max(local.mtime||0, remote.mtime||0);
    return out;
  }

  /* ---------- transport ---------- */
  async function pull(thenPush){
    if(!client || !session) return;
    busy = true; msg = "Syncing…"; redraw();
    try{
      const { data, error } = await client
        .from("training_state").select("state").eq("user_id", session.user.id).maybeSingle();
      if(error) throw error;
      const merged = merge(window.__app.getS(), data ? data.state : null);
      window.__app.setS(merged);
      lastSync = new Date();
      msg = "";
      if(thenPush) await push(true);
    }catch(e){ msg = "Sync failed: " + (e.message || "offline"); }
    busy = false; redraw();
  }

  async function push(quiet){
    if(!client || !session) return;
    if(!quiet){ busy = true; msg = "Saving…"; redraw(); }
    try{
      const state = window.__app.getS();
      const { error } = await client.from("training_state")
        .upsert({ user_id: session.user.id, state: state, updated_at: new Date().toISOString() },
                { onConflict: "user_id" });
      if(error) throw error;
      lastSync = new Date(); msg = "";
    }catch(e){ msg = "Save failed: " + (e.message || "offline"); }
    if(!quiet){ busy = false; }
    redraw();
  }

  /* called by app.save() — debounced so rapid taps don't hammer the network */
  function queue(){
    if(!client || !session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(true), 2000);
  }

  /* ---------- auth ---------- */
  async function signIn(email, pass){
    if(!client) return;
    busy = true; msg = "Signing in…"; redraw();
    const { error } = await client.auth.signInWithPassword({ email, password: pass });
    busy = false; msg = error ? error.message : "";
    redraw();
  }
  async function signUp(email, pass){
    if(!client) return;
    busy = true; msg = "Creating account…"; redraw();
    const { error } = await client.auth.signUp({ email, password: pass });
    busy = false;
    msg = error ? error.message : "Account created. If email confirmation is on, check your inbox, then sign in.";
    redraw();
  }
  async function signOut(){
    if(!client) return;
    await push(true);
    await client.auth.signOut();
    session = null; msg = "Signed out. Your data stays on this device.";
    redraw();
  }

  function redraw(){ if(window.__app && window.__app.isPlan()) window.__app.render(); }

  /* ---------- UI (rendered inside the Plan tab) ---------- */
  function html(){
    if(!configured()) return `<div class="panel">
      <h2>Cloud sync</h2>
      <p class="hint">Not set up yet. Everything works — it's just saved on this device only.</p>
      <p class="dim">To turn on login and sync across devices, paste your Supabase project URL and anon key into <b>config.js</b>, then redeploy. Setup steps are in README.md.</p>
    </div>`;

    if(!available()) return `<div class="panel">
      <h2>Cloud sync</h2>
      <p class="hint">Offline — can't reach the sync service right now.</p>
      <p class="dim">Keep training. Everything is saved locally and will sync next time you're online.</p>
    </div>`;

    if(!session) return `<div class="panel">
      <h2>Sign in</h2>
      <p class="hint">Log in to sync your progress across devices. Anything you've already logged on this device is merged in, not overwritten.</p>
      <input type="text" id="auth-email" placeholder="email" autocomplete="username"
        autocapitalize="none" spellcheck="false" style="margin-bottom:9px">
      <input type="password" id="auth-pass" placeholder="password (6+ characters)" autocomplete="current-password">
      <div class="btnrow">
        <button class="act" data-auth="in" ${busy?"disabled":""}>Sign in</button>
        <button class="act ghost" data-auth="up" ${busy?"disabled":""}>Create account</button>
      </div>
      ${msg?`<p class="hint" style="margin-top:11px;color:var(--warn)">${msg}</p>`:""}
    </div>`;

    return `<div class="panel">
      <h2>Cloud sync</h2>
      <p class="hint">Signed in as <b>${session.user.email}</b></p>
      <p class="dim">${lastSync ? "Last synced "+lastSync.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) : "Not synced yet this session"}</p>
      <div class="btnrow">
        <button class="act" data-auth="sync" ${busy?"disabled":""}>${busy?"Syncing…":"Sync now"}</button>
        <button class="act ghost" data-auth="out" ${busy?"disabled":""}>Sign out</button>
      </div>
      ${msg?`<p class="hint" style="margin-top:11px;color:var(--warn)">${msg}</p>`:""}
    </div>`;
  }

  function handle(action){
    const e = document.getElementById("auth-email"), p = document.getElementById("auth-pass");
    if(action==="in")   return signIn((e&&e.value||"").trim(), p&&p.value||"");
    if(action==="up")   return signUp((e&&e.value||"").trim(), p&&p.value||"");
    if(action==="out")  return signOut();
    if(action==="sync") return pull(true);
  }

  return { init, html, handle, queue, configured, signedIn: () => !!session };
})();
