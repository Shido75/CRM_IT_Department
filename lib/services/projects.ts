import { supabase } from '@/lib/auth'

export interface Project {
  id: string
  user_id: string
  client_id: string | null
  name: string
  description: string | null
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed'
  budget: number | null
  spent: number | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Project
}

export async function createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()

  if (error) throw error
  return data[0] as Project
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...projectData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0] as Project
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getProjectsByStatus(userId: string, status: Project['status']) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}
