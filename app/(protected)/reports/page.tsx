'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts'
import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { getLeads } from '@/lib/services/leads'
import { getClients } from '@/lib/services/clients'
import { getProjects } from '@/lib/services/projects'
import { Users, Building2, FolderKanban, TrendingUp } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  new: '#6366f1',
  contacted: '#3b82f6',
  qualified: '#8b5cf6',
  proposal: '#f59e0b',
  converted: '#10b981',
}

const PROJECT_COLORS: Record<string, string> = {
  planning: '#6366f1',
  in_progress: '#3b82f6',
  on_hold: '#f59e0b',
  completed: '#10b981',
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ef4444']

export default function ReportsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    totalLeads: 0,
    totalClients: 0,
    totalProjects: 0,
    conversionRate: 0,
    leadsByStatus: [] as { name: string; value: number; fill: string }[],
    leadsBySource: [] as { name: string; value: number }[],
    projectsByStatus: [] as { name: string; value: number; fill: string }[],
    leadsOverTime: [] as { month: string; leads: number; converted: number }[],
    leadFunnel: [] as { name: string; value: number; fill: string }[],
  })

  useEffect(() => {
    async function load() {
      if (!user?.id) return
      try {
        const [leads, clients, projects] = await Promise.all([
          getLeads(user.id),
          getClients(user.id),
          getProjects(user.id),
        ])

        // --- Lead by status ---
        const statusOrder = ['new', 'contacted', 'qualified', 'proposal', 'converted']
        const leadsByStatus = statusOrder.map((status) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: leads.filter((l) => l.status === status).length,
          fill: STATUS_COLORS[status],
        }))

        // --- Funnel (same data but in funnel format, descending) ---
        const funnelOrder = ['new', 'contacted', 'qualified', 'proposal', 'converted']
        const leadFunnel = funnelOrder.map((status) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: leads.filter((l) => l.status === status).length,
          fill: STATUS_COLORS[status],
        }))

        // --- Lead by source ---
        const sourceCounts: Record<string, number> = {}
        leads.forEach((l) => {
          const src = l.source?.trim() || 'Unknown'
          sourceCounts[src] = (sourceCounts[src] || 0) + 1
        })
        const leadsBySource = Object.entries(sourceCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6)

        // --- Projects by status ---
        const projectsByStatus = Object.entries(PROJECT_COLORS).map(([status, fill]) => ({
          name: status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          value: projects.filter((p) => p.status === status).length,
          fill,
        }))

        // --- Leads over time (last 6 months) ---
        const now = new Date()
        const monthLabels = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
          return {
            label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            month: d.getMonth(),
            year: d.getFullYear(),
          }
        })
        const leadsOverTime = monthLabels.map(({ label, month, year }) => {
          const monthLeads = leads.filter((l) => {
            const d = new Date(l.created_at)
            return d.getMonth() === month && d.getFullYear() === year
          })
          return {
            month: label,
            leads: monthLeads.length,
            converted: monthLeads.filter((l) => l.status === 'converted').length,
          }
        })

        const totalLeads = leads.length
        const converted = leads.filter((l) => l.status === 'converted').length
        const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0

        setData({
          totalLeads,
          totalClients: clients.length,
          totalProjects: projects.length,
          conversionRate,
          leadsByStatus,
          leadsBySource,
          projectsByStatus,
          leadsOverTime,
          leadFunnel,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 animate-pulse text-lg">Loading reports...</div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Leads',
      value: data.totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Clients',
      value: data.totalClients,
      icon: Building2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Projects Created',
      value: data.totalProjects,
      icon: FolderKanban,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-2">Analytics and insights from your real CRM data</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Lead Status Breakdown (Bar) */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leadsByStatus.every((d) => d.value === 0) ? (
              <EmptyState message="No leads yet. Add some leads to see this chart." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.leadsByStatus} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                    {data.leadsByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Lead Source Distribution (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leadsBySource.length === 0 ? (
              <EmptyState message="No source data yet. Fill in Source when adding leads." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.leadsBySource}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {data.leadsBySource.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} leads`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Leads Over Time (Line) */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Time (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leadsOverTime.every((d) => d.leads === 0) ? (
              <EmptyState message="No leads created yet in recent months." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.leadsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    name="Total Leads"
                  />
                  <Line
                    type="monotone"
                    dataKey="converted"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#10b981' }}
                    name="Converted"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Project Status (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {data.projectsByStatus.every((d) => d.value === 0) ? (
              <EmptyState message="No projects yet. Convert a lead to auto-create projects." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.projectsByStatus.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {data.projectsByStatus
                      .filter((d) => d.value > 0)
                      .map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} projects`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead Conversion Funnel (full width) */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          {data.leadFunnel.every((d) => d.value === 0) ? (
            <EmptyState message="No leads to show funnel. Add leads and move them through stages." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip formatter={(v) => [`${v} leads`, '']} />
                <Funnel dataKey="value" data={data.leadFunnel} isAnimationActive>
                  <LabelList position="right" fill="#1e293b" stroke="none" dataKey="name" />
                  <LabelList position="center" fill="#fff" stroke="none" dataKey="value" />
                  {data.leadFunnel.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[280px] text-center text-slate-400 text-sm px-4">
      {message}
    </div>
  )
}
