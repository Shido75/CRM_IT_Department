'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, Briefcase, CheckSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLeads, Lead } from '@/lib/services/leads'
import { getClients, Client } from '@/lib/services/clients'

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Total Leads', value: '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Clients', value: '0', icon: Briefcase, color: 'bg-green-500' },
    { label: 'In Progress', value: '0', icon: CheckSquare, color: 'bg-orange-500' },
    { label: 'Conversion Rate', value: '0%', icon: BarChart3, color: 'bg-purple-500' },
  ])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return

      try {
        const [leadsData, clientsData] = await Promise.all([
          getLeads(user.id),
          getClients(user.id)
        ])

        // Calculate Stats
        const totalLeads = leadsData.length
        const activeClients = clientsData.filter(c => c.status === 'active').length

        // In Progress: Leads that are not new and not converted
        const inProgressLeads = leadsData.filter(l =>
          l.status !== 'new' && l.status !== 'converted'
        ).length

        const convertedLeads = leadsData.filter(l => l.status === 'converted').length
        const conversionRate = totalLeads > 0
          ? Math.round((convertedLeads / totalLeads) * 100)
          : 0

        setStats([
          { label: 'Total Leads', value: totalLeads.toString(), icon: Users, color: 'bg-blue-500' },
          { label: 'Active Clients', value: activeClients.toString(), icon: Briefcase, color: 'bg-green-500' },
          { label: 'In Progress', value: inProgressLeads.toString(), icon: CheckSquare, color: 'bg-orange-500' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: BarChart3, color: 'bg-purple-500' },
        ])

        // Generate Recent Activity from Leads and Clients
        // Combining and sorting by date
        const recentLeads = leadsData.slice(0, 3).map(lead => ({
          type: 'lead',
          item: lead,
          date: new Date(lead.created_at)
        }))
        const recentClients = clientsData.slice(0, 3).map(client => ({
          type: 'client',
          item: client,
          date: new Date(client.created_at)
        }))

        const activity = [...recentLeads, ...recentClients]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 3)

        setRecentActivity(activity)

      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user?.id])

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.user_metadata?.full_name || 'User'}!
        </h1>
        <p className="text-slate-600 mt-2">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity</p>
            ) : (
              recentActivity.map((act, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${act.type === 'lead' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <div>
                    <p className="font-medium text-sm">
                      {act.type === 'lead' ? 'New lead added' : 'Client onboarded'}
                    </p>
                    <p className="text-xs text-slate-600">
                      {act.type === 'lead'
                        ? `${act.item.name} was added as a new lead`
                        : `${act.item.name} has been converted to active client`}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 ml-auto">
                    {new Date(act.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
