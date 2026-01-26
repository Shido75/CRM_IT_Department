'use client'

import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, Briefcase, CheckSquare } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { label: 'Total Leads', value: '24', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Clients', value: '18', icon: Briefcase, color: 'bg-green-500' },
    { label: 'In Progress', value: '12', icon: CheckSquare, color: 'bg-orange-500' },
    { label: 'Conversion Rate', value: '35%', icon: BarChart3, color: 'bg-purple-500' },
  ]

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
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-sm">New lead added</p>
                <p className="text-xs text-slate-600">Sarah Johnson was added as a new lead</p>
              </div>
              <span className="text-xs text-slate-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-sm">Client onboarded</p>
                <p className="text-xs text-slate-600">Acme Corp has been converted to active client</p>
              </div>
              <span className="text-xs text-slate-500 ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-sm">Project created</p>
                <p className="text-xs text-slate-600">Website redesign project was initiated</p>
              </div>
              <span className="text-xs text-slate-500 ml-auto">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
