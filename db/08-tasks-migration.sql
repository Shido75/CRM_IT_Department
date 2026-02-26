-- Tasks table migration for Orbinex CRM
-- Run this in Supabase SQL Editor

-- Drop old tasks table if it exists (old schema had incompatible columns)
DROP TABLE IF EXISTS public.tasks CASCADE;

-- Create new tasks table matching the TypeScript service interface
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  assigned_to TEXT,                -- Name or email of assignee (free text for simplicity)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view all tasks
CREATE POLICY "Users can view all tasks"
  ON public.tasks FOR SELECT
  USING (auth.role() = 'authenticated');

-- All authenticated users can create tasks
CREATE POLICY "Users can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- All authenticated users can update tasks
CREATE POLICY "Users can update tasks"
  ON public.tasks FOR UPDATE
  USING (auth.role() = 'authenticated');

-- All authenticated users can delete tasks
CREATE POLICY "Users can delete tasks"
  ON public.tasks FOR DELETE
  USING (auth.role() = 'authenticated');

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
