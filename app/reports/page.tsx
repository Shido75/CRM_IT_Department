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

const COLORS = ['#3b82f6', '#10b981', '#ef4444']

export default function ReportsPage() {
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
                <p className="text-3xl font-bold mt-2">$256,000</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Conversion Rate</p>
            <p className="text-3xl font-bold mt-2">35%</p>
            <p className="text-xs text-slate-500 mt-2">24 out of 68 leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Active Projects</p>
            <p className="text-3xl font-bold mt-2">12</p>
            <p className="text-xs text-slate-500 mt-2">4 in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Avg. Deal Size</p>
            <p className="text-3xl font-bold mt-2">$14,200</p>
            <p className="text-xs text-slate-500 mt-2">Based on converted leads</p>
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
              <BarChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#3b82f6" />
                <Bar dataKey="contacted" fill="#8b5cf6" />
                <Bar dataKey="qualified" fill="#10b981" />
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
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conversionData.map((entry, index) => (
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
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
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
