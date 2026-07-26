# The Handstand Project

A 12-week handstand + flexibility training app. Installs to your iPhone home screen,
works offline, and optionally syncs across devices with a login.

Plain HTML/CSS/JS — no build step, no framework, no server of your own.

---

## Part 1 — Put it on GitHub (5 min)

1. Go to **github.com/new**. Name it `handstand` (or anything). **Public**. Don't add a README — you have one. Create.
2. On the empty repo page, click **uploading an existing file**.
3. Drag in **the contents of this folder** (all the files *and* the `icons` folder) — not the folder itself. Commit.
4. Go to **Settings → Pages**. Under "Build and deployment", set Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**. Save.
5. Wait ~1 minute, then refresh. Pages shows your URL: `https://<your-username>.github.io/handstand/`

**Install on your iPhone:** open that URL in **Safari** (not Chrome) → Share → **Add to Home Screen**.

Prefer the terminal? From inside this folder:

```
git init
git add .
git commit -m "Handstand app"
git branch -M main
git remote add origin https://github.com/<your-username>/handstand.git
git push -u origin main
```

Then do step 4 above.

> **Every time you change a file, bump `CACHE_NAME` in `sw.js`** (`handstand-v2` → `handstand-v3`).
> The service worker serves from cache first, so without a bump your phone keeps showing the old version.

---

## Part 2 — Turn on login and sync (10 min)

Skip this and the app still works perfectly — it just saves to one device.

### a) Create the Supabase project

1. **supabase.com** → sign in with GitHub → **New project**.
2. Name it `handstand`, pick any region near you, set a database password (save it somewhere; you won't need it for the app). Create — it takes ~2 minutes to provision.

### b) Create the table

3. Left sidebar → **SQL Editor** → **New query**.
4. Paste the entire contents of `supabase-setup.sql` and hit **Run**. You should see "Success".

### c) Turn off email confirmation (optional but easier)

5. **Authentication → Sign In / Providers → Email**. Turn **Confirm email** off, then save.
   With it on you'd have to click a link in your inbox before your first sign-in works. Either is fine.

### d) Connect the app

6. **Settings → API**. Copy two values:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (a long string starting `eyJ…`)
7. Open `config.js` and paste them in:

```js
window.CONFIG = {
  SUPABASE_URL: "https://abcdefgh.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi..."
};
```

8. Commit and push (or re-upload `config.js` on GitHub), and bump `CACHE_NAME` in `sw.js`.
9. Open the app → **Plan** tab → **Create account** with your email and a password. Done.

**Is it safe to commit the anon key to a public repo?** Yes. That key only grants what your
Row Level Security policies allow, and `supabase-setup.sql` restricts every user to their own
row. The key you must never commit is the **service_role** key — don't put that anywhere near
this app.

---

## How syncing behaves

- **Local first, always.** Training is never blocked on the network. Everything writes to
  `localStorage` immediately, and pushes to the cloud in the background.
- **Signing in merges, it doesn't overwrite.** Logged sessions and hold times from both sides are
  unioned. For single values (current stage, benchmark numbers) the most recently saved side wins.
  Your program start date resolves to the earlier of the two.
- **Offline** the app just queues up; the next time it's online and open, it syncs.
- **Pulls** happen on sign-in and whenever you bring the app back to the foreground.
- The **Export backup** button on the Plan tab writes a JSON file, sync or no sync.

---

## Files

| File | What it is |
|---|---|
| `index.html` | Shell and nav |
| `app.js` | Screens, state, timer, charts, guided session flow |
| `exercises.js` | All exercise content — cues, mistakes, figures, session definitions |
| `sync.js` | Supabase auth + merge/sync (no-op if unconfigured) |
| `config.js` | Your two Supabase values |
| `style.css` | Styles |
| `sw.js` | Service worker — offline caching. **Bump `CACHE_NAME` on every deploy** |
| `manifest.json`, `icons/` | Home-screen install metadata |
| `supabase-setup.sql` | Table + Row Level Security policies |

### Adding an exercise

Add an entry to `EX` in `exercises.js` (name, cat, dose, why, how, cues, mistake, vid, fig),
then reference its key in a session's `items` array. `fig` is stick-figure joint coordinates
in a 100×100 box: `hd` head, `nk` neck, `hp` hip, `el`/`hn` elbow/hand, `kn`/`ft` knee/foot,
plus optional `el2`/`hn2`/`kn2`/`ft2` and a `props` list (`floor`, `wallR`, `bar`, `bellDown`…).
