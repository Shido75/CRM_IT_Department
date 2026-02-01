'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getLeads, createLead, updateLead, deleteLead, convertLead } from '@/lib/services/leads'
import { LeadForm } from '@/components/leads/lead-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Plus, Mail, Phone, Building2 } from 'lucide-react'
import type { Lead } from '@/lib/services/leads'

export default function LeadsPage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadLeads()
  }, [user])

  const loadLeads = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getLeads(user.id)
      setLeads(data)
    } catch (error) {
      console.error('Failed to load leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLead = async (data: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    setFormLoading(true)
    try {
      const newLead = await createLead({
        ...data,
        created_by: user!.id,
      })
      setLeads((prev) => [newLead, ...prev])
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create lead:', JSON.stringify(error, null, 2))
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateLead = async (data: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!editingLead) return
    setFormLoading(true)
    try {
      const updated = await updateLead(editingLead.id, data)
      setLeads((prev) =>
        prev.map((lead) => (lead.id === editingLead.id ? updated : lead))
      )
      setEditingLead(null)
    } catch (error) {
      console.error('Failed to update lead:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead(id)
      setLeads((prev) => prev.filter((lead) => lead.id !== id))
    } catch (error) {
      console.error('Failed to delete lead:', error)
    }
  }

  const handleConvertLead = async (id: string) => {
    try {
      await convertLead(id, user!.id)
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, status: 'converted' } : lead
        )
      )
    } catch (error) {
      console.error('Failed to convert lead:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-slate-100 text-slate-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-orange-100 text-orange-800',
      converted: 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-600 mt-2">Manage and track your sales leads</p>
        </div>
        {!showForm && !editingLead && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        )}
      </div>

      {(showForm || editingLead) && (
        <LeadForm
          initialData={editingLead || undefined}
          onSubmit={editingLead ? handleUpdateLead : handleAddLead}
          isLoading={formLoading}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-600">Loading leads...</p>
          ) : leads.length === 0 ? (
            <p className="text-slate-600">No leads yet. Create one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {lead.email}
                              </a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <a
                                href={`tel:${lead.phone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {lead.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.company && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {lead.company}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{lead.source}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingLead(lead)}>
                              Edit
                            </DropdownMenuItem>
                            {lead.status !== 'converted' && (
                              <DropdownMenuItem onClick={() => handleConvertLead(lead.id)}>
                                Convert to Client
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
