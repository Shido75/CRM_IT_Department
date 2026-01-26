-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create RLS policies for leads table
CREATE POLICY "All authenticated users can view leads"
  ON public.leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update leads"
  ON public.leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can delete leads"
  ON public.leads
  FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- Create RLS policies for clients table
CREATE POLICY "All authenticated users can view clients"
  ON public.clients
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create clients"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update clients"
  ON public.clients
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can delete clients"
  ON public.clients
  FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- Create RLS policies for projects table
CREATE POLICY "All authenticated users can view projects"
  ON public.projects
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Admins and managers can update projects"
  ON public.projects
  FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Admins and managers can delete projects"
  ON public.projects
  FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- Create RLS policies for tasks table
CREATE POLICY "All authenticated users can view tasks"
  ON public.tasks
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can create tasks"
  ON public.tasks
  FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Users can update their assigned tasks"
  ON public.tasks
  FOR UPDATE
  USING (auth.uid() = assigned_to OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Admins and managers can delete tasks"
  ON public.tasks
  FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- Create RLS policies for communications table
CREATE POLICY "All authenticated users can view communications"
  ON public.communications
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create communications"
  ON public.communications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update communications"
  ON public.communications
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can delete communications"
  ON public.communications
  FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- Create RLS policies for support_tickets table
CREATE POLICY "All authenticated users can view support tickets"
  ON public.support_tickets
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create support tickets"
  ON public.support_tickets
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can update support tickets"
  ON public.support_tickets
  FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Admins and managers can delete support tickets"
  ON public.support_tickets
  FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

-- Create RLS policies for notifications table
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for project_assignments table
CREATE POLICY "All authenticated users can view project assignments"
  ON public.project_assignments
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and managers can create project assignments"
  ON public.project_assignments
  FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Admins and managers can update project assignments"
  ON public.project_assignments
  FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));

CREATE POLICY "Admins and managers can delete project assignments"
  ON public.project_assignments
  FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager'));
