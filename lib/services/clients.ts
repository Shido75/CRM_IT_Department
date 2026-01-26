import { supabase } from '@/lib/auth'

export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'active' | 'inactive' | 'archived'
  contract_value: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getClients(userId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Client[]
}

export async function getClient(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Client
}

export async function createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()

  if (error) throw error
  return data[0] as Client
}

export async function updateClient(id: string, clientData: Partial<Client>) {
  const { data, error } = await supabase
    .from('clients')
    .update({
      ...clientData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0] as Client
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) throw error
}
