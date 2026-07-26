/* config.js — cloud sync settings.
   Fill these two values in after creating your free Supabase project.
   Leave them empty and the app simply runs in local-only mode (everything still works).

   Where to find them: Supabase dashboard → your project → Settings → API
     SUPABASE_URL      = "Project URL"
     SUPABASE_ANON_KEY = "anon public" key

   The anon key is SAFE to commit to a public GitHub repo. It only permits what your
   Row Level Security policies allow, and supabase-setup.sql restricts every user to
   their own row. Never put the "service_role" key here. */

window.CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: ""
};
