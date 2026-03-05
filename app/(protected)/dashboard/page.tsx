'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, Briefcase, CheckSquare, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLeads, Lead } from '@/lib/services/leads'
import { getClients, Client } from '@/lib/services/clients'
import { getProjectsWithAssignees, ProjectWithAssignee } from '@/lib/services/projects'

import { DashboardCalendar } from '@/components/dashboard/dashboard-calendar'
import { ProjectOverviewTable } from '@/components/dashboard/project-overview-table'
import { ProjectTypeChart } from '@/components/dashboard/project-type-chart'
import { ProjectAnalyticsChart } from '@/components/dashboard/project-analytics-chart'

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<ProjectWithAssignee[]>([])
  const [deadlineDates, setDeadlineDates] = useState<Date[]>([])
  const [stats, setStats] = useState([
    { label: 'Total Clients', value: '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Projects', value: '0', icon: Briefcase, color: 'bg-green-500' },
    { label: 'Tasks Due', value: '0', icon: CheckSquare, color: 'bg-orange-500' },
    { label: 'Revenue', value: '$0', icon: DollarSign, color: 'bg-purple-500' },
  ])

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return

      try {
        const [leadsData, clientsData, projectsData] = await Promise.all([
          getLeads(user.id),
          getClients(user.id),
          getProjectsWithAssignees(),
        ])

        // Calculate Stats
        const totalClients = clientsData.length
        const activeProjects = projectsData.filter(
          (p) => p.status === 'in_progress' || p.status === 'planning'
        ).length

        // Tasks due — count projects with end_date approaching
        const today = new Date()
        const upcoming = projectsData.filter((p) => {
          if (!p.end_date) return false
          const end = new Date(p.end_date)
          const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          return diff >= 0 && diff <= 7
        }).length

        const totalRevenue = projectsData.reduce(
          (sum, p) => sum + (p.budget || 0),
          0
        )

        setStats([
          { label: 'Total Clients', value: totalClients.toString(), icon: Users, color: 'bg-blue-500' },
          { label: 'Active Projects', value: activeProjects.toString(), icon: Briefcase, color: 'bg-green-500' },
          { label: 'Tasks Due', value: upcoming.toString(), icon: CheckSquare, color: 'bg-orange-500' },
          {
            label: 'Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-purple-500',
          },
        ])

        setProjects(projectsData)

        // Collect deadline dates for the calendar
        const dates = projectsData
          .filter((p) => p.end_date)
          .map((p) => new Date(p.end_date!))
        setDeadlineDates(dates)
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          CRM Dashboard
        </h1>
        <p className="text-slate-600 mt-1">
          Welcome back, {user?.user_metadata?.full_name || 'Admin'}
        </p>
      </div>

      {/* Stats Grid — matching reference: Total Clients, Active Projects, Tasks Due, Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
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

      {/* Second Row: Calendar + Project Overview Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCalendar deadlineDates={deadlineDates} />
        <ProjectOverviewTable projects={projects} />
      </div>

      {/* Third Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProjectTypeChart projects={projects} />
        <ProjectAnalyticsChart projects={projects} />
      </div>
    </div>
  )
}
