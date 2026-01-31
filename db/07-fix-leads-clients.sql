-- FIXED Migration to handle column collision AND RLS dependencies
-- Run this in your Supabase SQL Editor

DO $$
BEGIN
  -------------------------------------------------------------------------
  -- 1. DROP DEPENDENT POLICIES (Fixes ERROR: 2BP01)
  -------------------------------------------------------------------------
  -- Drop policies on LEADS that might depend on user_id
  EXECUTE 'DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads';
  EXECUTE 'DROP POLICY IF EXISTS "Users can create leads" ON public.leads';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads';
  
  -- Drop policies on CLIENTS that depend on user_id (Explicitly mentioned in error)
  EXECUTE 'DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients';
  EXECUTE 'DROP POLICY IF EXISTS "Users can create clients" ON public.clients';
  EXECUTE 'DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients';
  EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients';


  -------------------------------------------------------------------------
  -- 2. Fix LEADS table (Column Rename/Merge)
  -------------------------------------------------------------------------
  
  -- Check if 'user_id' column exists
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'user_id') THEN
    
    -- Check if 'created_by' column ALSO exists
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'created_by') THEN
      -- Both exist: Copy data from user_id to created_by where created_by is null
      EXECUTE 'UPDATE public.leads SET created_by = user_id WHERE created_by IS NULL';
      -- Drop the old user_id column
      EXECUTE 'ALTER TABLE public.leads DROP COLUMN user_id CASCADE'; -- Added CASCADE just in case
      
    ELSE
      -- Only user_id exists: Rename it to created_by
      EXECUTE 'ALTER TABLE public.leads RENAME COLUMN user_id TO created_by';
    END IF;
    
  -- If user_id does NOT exist, check if created_by is missing
  ELSIF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'created_by') THEN
    -- Neither exists: Add created_by column
    EXECUTE 'ALTER TABLE public.leads ADD COLUMN created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE';
  END IF;


  -------------------------------------------------------------------------
  -- 3. Fix CLIENTS table (Column Rename/Merge)
  -------------------------------------------------------------------------

  -- Check if 'user_id' column exists
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'user_id') THEN
    
    -- Check if 'created_by' column ALSO exists
    IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'created_by') THEN
      -- Both exist: Copy data from user_id to created_by where created_by is null
      EXECUTE 'UPDATE public.clients SET created_by = user_id WHERE created_by IS NULL';
      -- Drop the old user_id column
      EXECUTE 'ALTER TABLE public.clients DROP COLUMN user_id CASCADE'; -- Added CASCADE just in case
      
    ELSE
      -- Only user_id exists: Rename it to created_by
      EXECUTE 'ALTER TABLE public.clients RENAME COLUMN user_id TO created_by';
    END IF;
    
  -- If user_id does NOT exist, check if created_by is missing
  ELSIF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'created_by') THEN
    -- Neither exists: Add created_by column
    EXECUTE 'ALTER TABLE public.clients ADD COLUMN created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE';
  END IF;


  -------------------------------------------------------------------------
  -- 4. RECREATE POLICIES (Using 'created_by')
  -------------------------------------------------------------------------
  
  -- Recreate policies for LEADS
  EXECUTE 'CREATE POLICY "Users can view their own leads" ON public.leads FOR SELECT USING (auth.uid() = created_by)';
  EXECUTE 'CREATE POLICY "Users can create leads" ON public.leads FOR INSERT WITH CHECK (auth.role() = ''authenticated'')'; 
  -- Note: Original creation policy usually just checks auth, the created_by value is set by client/server.
  
  EXECUTE 'CREATE POLICY "Users can update their own leads" ON public.leads FOR UPDATE USING (auth.uid() = created_by)';
  EXECUTE 'CREATE POLICY "Users can delete their own leads" ON public.leads FOR DELETE USING (auth.uid() = created_by)';

  -- Recreate policies for CLIENTS
  EXECUTE 'CREATE POLICY "Users can view their own clients" ON public.clients FOR SELECT USING (auth.uid() = created_by)';
  EXECUTE 'CREATE POLICY "Users can create clients" ON public.clients FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
  EXECUTE 'CREATE POLICY "Users can update their own clients" ON public.clients FOR UPDATE USING (auth.uid() = created_by)';
  EXECUTE 'CREATE POLICY "Users can delete their own clients" ON public.clients FOR DELETE USING (auth.uid() = created_by)';

END $$;
