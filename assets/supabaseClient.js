// Requer que a lib do Supabase (CDN) e o config.js já tenham corrido antes deste ficheiro.
const supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_PUBLISHABLE_KEY
);
