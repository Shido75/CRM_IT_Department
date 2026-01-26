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
<<<<<<< HEAD

const leadsData = [
  { name: 'Jan', new: 40, contacted: 24, qualified: 20 },
  { name: 'Feb', new: 45, contacted: 30, qualified: 25 },
  { name: 'Mar', new: 52, contacted: 38, qualified: 35 },
  { name: 'Apr', new: 48, contacted: 35, qualified: 30 },
  { name: 'May', new: 61, contacted: 45, qualified: 40 },
  { name: 'Jun', new: 55, contacted: 40, qualified: 38 },
]

const conversionData = [
  { name: 'Converted', value: 35 },
  { name: 'Pending', value: 45 },
  { name: 'Lost', value: 20 },
]

const revenueData = [
  { name: 'Jan', revenue: 28000 },
  { name: 'Feb', revenue: 35000 },
  { name: 'Mar', revenue: 42000 },
  { name: 'Apr', revenue: 38000 },
  { name: 'May', revenue: 52000 },
  { name: 'Jun', revenue: 61000 },
]
=======
import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { getLeads, Lead } from '@/lib/services/leads'
import { getClients, Client } from '@/lib/services/clients'
import { getProjects, Project } from '@/lib/services/projects'
>>>>>>> c427634 (Fixing Static Dashbaord)

const COLORS = ['#3b82f6', '#10b981', '#ef4444']

export default function ReportsPage() {
<<<<<<< HEAD
=======
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

>>>>>>> c427634 (Fixing Static Dashbaord)
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
<<<<<<< HEAD
                <p className="text-3xl font-bold mt-2">$256,000</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
=======
                <p className="text-3xl font-bold mt-2">${metrics.revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">Lifetime revenue</p>
>>>>>>> c427634 (Fixing Static Dashbaord)
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Conversion Rate</p>
<<<<<<< HEAD
            <p className="text-3xl font-bold mt-2">35%</p>
            <p className="text-xs text-slate-500 mt-2">24 out of 68 leads</p>
=======
            <p className="text-3xl font-bold mt-2">{metrics.conversionRate}%</p>
            <p className="text-xs text-slate-500 mt-2">Of total leads</p>
>>>>>>> c427634 (Fixing Static Dashbaord)
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Active Projects</p>
<<<<<<< HEAD
            <p className="text-3xl font-bold mt-2">12</p>
            <p className="text-xs text-slate-500 mt-2">4 in progress</p>
=======
            <p className="text-3xl font-bold mt-2">{metrics.activeProjects}</p>
            <p className="text-xs text-slate-500 mt-2">In progress</p>
>>>>>>> c427634 (Fixing Static Dashbaord)
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Avg. Deal Size</p>
<<<<<<< HEAD
            <p className="text-3xl font-bold mt-2">$14,200</p>
            <p className="text-xs text-slate-500 mt-2">Based on converted leads</p>
=======
            <p className="text-3xl font-bold mt-2">${metrics.avgDealSize.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Per paying client</p>
>>>>>>> c427634 (Fixing Static Dashbaord)
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
<<<<<<< HEAD
              <BarChart data={leadsData}>
=======
              <BarChart data={metrics.leadPipeline}>
>>>>>>> c427634 (Fixing Static Dashbaord)
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
<<<<<<< HEAD
                <Bar dataKey="new" fill="#3b82f6" />
                <Bar dataKey="contacted" fill="#8b5cf6" />
                <Bar dataKey="qualified" fill="#10b981" />
=======
                <Bar dataKey="new" fill="#3b82f6" name="New" />
                <Bar dataKey="contacted" fill="#8b5cf6" name="Contacted" />
                <Bar dataKey="qualified" fill="#10b981" name="Qualified" />
>>>>>>> c427634 (Fixing Static Dashbaord)
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
<<<<<<< HEAD
                  data={conversionData}
=======
                  data={metrics.conversionStatus}
>>>>>>> c427634 (Fixing Static Dashbaord)
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
<<<<<<< HEAD
                  {conversionData.map((entry, index) => (
=======
                  {metrics.conversionStatus.map((entry, index) => (
>>>>>>> c427634 (Fixing Static Dashbaord)
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
<<<<<<< HEAD
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
=======
              <LineChart data={metrics.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
>>>>>>> c427634 (Fixing Static Dashbaord)
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
