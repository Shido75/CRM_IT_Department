import { supabase } from '@/lib/auth'

export interface Lead {
  id: string
<<<<<<< HEAD
  user_id: string
=======
  created_by: string
>>>>>>> c427634 (Fixing Static Dashbaord)
  name: string
  email: string
  phone: string
  company: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted'
  source: string
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getLeads(userId: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
<<<<<<< HEAD
    .eq('user_id', userId)
=======
    .eq('created_by', userId) // Changed from user_id to created_by
>>>>>>> c427634 (Fixing Static Dashbaord)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Lead[]
}

export async function getLead(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Lead
}

export async function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData])
    .select()

  if (error) throw error
  return data[0] as Lead
}

export async function updateLead(id: string, leadData: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .update({
      ...leadData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0] as Lead
}

export async function deleteLead(id: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function convertLead(leadId: string, userId: string) {
  const lead = await getLead(leadId)

  // Create client
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .insert([
      {
<<<<<<< HEAD
        user_id: userId,
=======
        created_by: userId,
>>>>>>> c427634 (Fixing Static Dashbaord)
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: 'active',
      },
    ])
    .select()

  if (clientError) throw clientError

  // Update lead status
  await updateLead(leadId, { status: 'converted' })

  return clientData[0]
}
