-- Migration to fix schema issues
-- 1. Add created_by to clients table if missing or use user_id
-- Clients table currently has no user link.
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Update RLS policies to use created_by (if not already)
-- (Assuming policies exist, might need to drop and recreate or these are just column additions)

-- 3. Fix Clients table usage in code
-- You will need to run this SQL in your Supabase SQL Editor.
