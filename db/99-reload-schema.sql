-- This script reloads the schema and notifies Supabase to refresh its schema cache
-- Run this in Supabase SQL Editor if you get PGRST204 errors

-- First, notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative: You can also use this SQL to verify which columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'leads'
ORDER BY ordinal_position;

-- Check clients table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'clients'
ORDER BY ordinal_position;

-- If tables don't exist or have wrong structure, you need to run:
-- 1. db/01-schema.sql (create tables)
-- 2. db/02-rls-policies.sql (set up security)
-- 3. db/03-indexes.sql (create indexes)
-- 4. db/04-triggers.sql (set up triggers)
