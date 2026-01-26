-- Create indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);

CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_clients_created_at ON public.clients(created_at);

CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);

CREATE INDEX idx_project_assignments_project_id ON public.project_assignments(project_id);
CREATE INDEX idx_project_assignments_employee_id ON public.project_assignments(employee_id);

CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_deadline ON public.tasks(deadline);

CREATE INDEX idx_support_tickets_client_id ON public.support_tickets(client_id);
CREATE INDEX idx_support_tickets_project_id ON public.support_tickets(project_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);

CREATE INDEX idx_communications_client_id ON public.communications(client_id);
CREATE INDEX idx_communications_created_at ON public.communications(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
