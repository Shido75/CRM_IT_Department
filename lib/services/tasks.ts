import { supabase } from '@/lib/auth'

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Task[]
}

export async function getTask(id: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Task
}

export async function createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()

  if (error) throw error
  return data[0] as Task
}

export async function updateTask(id: string, taskData: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...taskData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0] as Task
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getTasksByStatus(userId: string, status: Task['status']) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('due_date', { ascending: true })

  if (error) throw error
  return data as Task[]
}

export async function getTasksByProject(projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true })

  if (error) throw error
  return data as Task[]
}
