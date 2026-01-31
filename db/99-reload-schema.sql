-- Reload Supabase API Schema Cache
-- Run this if you see errors like "Could not find the 'name' column..." (PGRST204)

NOTIFY pgrst, 'reload config';
