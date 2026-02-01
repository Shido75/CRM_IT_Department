'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getClients, createClient, updateClient, deleteClient } from '@/lib/services/clients'
import { ClientForm } from '@/components/clients/client-form'
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
import { MoreVertical, Plus, Mail, Phone, Building2, DollarSign } from 'lucide-react'
import type { Client } from '@/lib/services/clients'

export default function ClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadClients()
  }, [user])

  const loadClients = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getClients(user.id)
      setClients(data)
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async (data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    setFormLoading(true)
    try {
      const newClient = await createClient({
        ...data,
        created_by: user!.id,
      })
      setClients((prev) => [newClient, ...prev])
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create client:', JSON.stringify(error, null, 2))
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateClient = async (data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!editingClient) return
    setFormLoading(true)
    try {
      const updated = await updateClient(editingClient.id, data)
      setClients((prev) =>
        prev.map((client) => (client.id === editingClient.id ? updated : client))
      )
      setEditingClient(null)
    } catch (error) {
      console.error('Failed to update client:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id)
      setClients((prev) => prev.filter((client) => client.id !== id))
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-slate-100 text-slate-800',
    }
    return colors[status] || 'bg-slate-100 text-slate-800'
  }

  const totalContractValue = clients.reduce((sum, client) => sum + (client.contract_value || 0), 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-600 mt-2">Manage your active clients and contracts</p>
        </div>
        {!showForm && !editingClient && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600">Total Clients</div>
            <div className="text-2xl font-bold mt-2">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600">Active Clients</div>
            <div className="text-2xl font-bold mt-2">
              {clients.filter((c) => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-slate-600" />
              <div>
                <div className="text-sm text-slate-600">Total Contract Value</div>
                <div className="text-2xl font-bold mt-2">${totalContractValue.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {(showForm || editingClient) && (
        <ClientForm
          initialData={editingClient || undefined}
          onSubmit={editingClient ? handleUpdateClient : handleAddClient}
          isLoading={formLoading}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-600">Loading clients...</p>
          ) : clients.length === 0 ? (
            <p className="text-slate-600">No clients yet. Add one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contract Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <a
                                href={`mailto:${client.email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {client.email}
                              </a>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <a
                                href={`tel:${client.phone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {client.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.company && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {client.company}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${client.contract_value?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => setEditingClient(client)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client.id)}
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
