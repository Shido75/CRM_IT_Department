'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp } from 'lucide-react'
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
} from 'recharts'
import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { getLeads, Lead } from '@/lib/services/leads'
import { getClients, Client } from '@/lib/services/clients'
import { getProjects, Project } from '@/lib/services/projects'

const COLORS = ['#3b82f6', '#10b981', '#ef4444']

export default function ReportsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    revenue: 0,
    conversionRate: 0,
    activeProjects: 0,
    avgDealSize: 0,
    leadPipeline: [] as any[],
    conversionStatus: [] as any[],
    revenueTrend: [] as any[]
  })

  useEffect(() => {
    async function loadReportsData() {
      if (!user?.id) return

      try {
        const [leads, clients, projects] = await Promise.all([
          getLeads(user.id),
          getClients(user.id),
          getProjects(user.id)
        ])

        // 1. Key Metrics
        const revenue = clients.reduce((sum, client) => sum + (client.contract_value || 0), 0)

        const totalLeads = leads.length
        const convertedLeads = leads.filter(l => l.status === 'converted').length
        const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

        const activeProjects = projects.filter(p => p.status === 'in_progress').length

        // Avg Deal Size = Total Revenue / Num with Value (or all clients?)
        // Assuming simplified: Total Revenue / clients with value
        const payingClients = clients.filter(c => c.contract_value && c.contract_value > 0).length
        const avgDealSize = payingClients > 0 ? Math.round(revenue / payingClients) : 0

        // 2. Lead Pipeline (by Month)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const pipelineData = months.map((month, index) => {
          const monthLeads = leads.filter(l => new Date(l.created_at).getMonth() === index)
          return {
            name: month,
            new: monthLeads.filter(l => l.status === 'new').length,
            contacted: monthLeads.filter(l => l.status === 'contacted').length,
            qualified: monthLeads.filter(l => l.status === 'qualified').length
          }
        })
        // Filter to only show relevant months (e.g., current year or last 6 months) - simplified to showing all for now or fixed range if needed.
        // For better UX, let's just show current year data 
        const currentYearPipeline = pipelineData // Assuming mock data spanned months, we keep structure.

        // 3. Conversion Status
        const conversionData = [
          { name: 'Converted', value: convertedLeads },
          { name: 'Pending', value: leads.filter(l => ['new', 'contacted', 'qualified', 'proposal'].includes(l.status)).length },
          { name: 'Lost', value: leads.filter(l => !['converted', 'new', 'contacted', 'qualified', 'proposal'].includes(l.status)).length } // Assuming 'lost' status exists or implicit
        ]
        // Note: Lead type in leads.ts only shows: 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted'. 'lost' is not explicitly checking in type definition but might be useful to handle.

        // 4. Monthly Revenue Trend (from Clients created_at)
        const revenueTrend = months.map((month, index) => {
          const monthRevenue = clients
            .filter(c => new Date(c.created_at).getMonth() === index)
            .reduce((sum, c) => sum + (c.contract_value || 0), 0)
          return { name: month, revenue: monthRevenue }
        })

        setMetrics({
          revenue,
          conversionRate,
          activeProjects,
          avgDealSize,
          leadPipeline: currentYearPipeline,
          conversionStatus: conversionData,
          revenueTrend
        })

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadReportsData()
  }, [user?.id])

  if (loading) return <div className="p-8">Loading reports...</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600 mt-2">Analytics and insights about your business</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${metrics.revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">Lifetime revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Conversion Rate</p>
            <p className="text-3xl font-bold mt-2">{metrics.conversionRate}%</p>
            <p className="text-xs text-slate-500 mt-2">Of total leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Active Projects</p>
            <p className="text-3xl font-bold mt-2">{metrics.activeProjects}</p>
            <p className="text-xs text-slate-500 mt-2">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Avg. Deal Size</p>
            <p className="text-3xl font-bold mt-2">${metrics.avgDealSize.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Per paying client</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.leadPipeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#3b82f6" name="New" />
                <Bar dataKey="contacted" fill="#8b5cf6" name="Contacted" />
                <Bar dataKey="qualified" fill="#10b981" name="Qualified" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.conversionStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.conversionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  dot={{ fill: '#3b82f6' }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
