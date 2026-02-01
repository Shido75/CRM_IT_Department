import { supabase } from '@/lib/auth'

export interface Lead {
  id: string
  created_by: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  position: string | null
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted'
  source: string
  value: number
  notes: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

// Helper to join names for UI display if needed, or UI can use first/last directly
export const getLeadName = (lead: Lead) => `${lead.first_name} ${lead.last_name}`.trim()

export async function getLeads(userId: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('created_by', userId)
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

export async function createLead(leadData: any) {
  // Map UI data to DB schema if needed
  // Assuming the form sends first_name/last_name now. 
  // If form sends 'name', we need to split it.

  const payload = {
    ...leadData,
    // Ensure defaults for new fields if not provided
    value: leadData.value || 0,
    tags: leadData.tags || [],
    position: leadData.position || null
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([payload])
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
        created_by: userId,
        name: `${lead.first_name} ${lead.last_name}`,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: 'active',
        converted_from_lead_id: leadId,
      },
    ])
    .select()

  if (clientError) throw clientError

  // Update lead status
  await updateLead(leadId, { status: 'converted' })

  return clientData[0]
}
