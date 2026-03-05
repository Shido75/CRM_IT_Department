'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import type { ProjectWithAssignee } from '@/lib/services/projects'

interface ProjectAnalyticsChartProps {
    projects: ProjectWithAssignee[]
}

export function ProjectAnalyticsChart({ projects }: ProjectAnalyticsChartProps) {
    // Aggregate data per user: count of projects and total budget
    const userMap = new Map<string, { name: string; projects: number; cost: number }>()

    projects.forEach((project) => {
        const userId = project.created_by || 'unassigned'
        const userName = project.profiles?.full_name || 'Unassigned'
        const existing = userMap.get(userId)
        if (existing) {
            existing.projects += 1
            existing.cost += project.budget || 0
        } else {
            userMap.set(userId, {
                name: userName,
                projects: 1,
                cost: project.budget || 0,
            })
        }
    })

    const data = Array.from(userMap.values())
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 10) // Top 10 users

    const formatCurrency = (value: number) => {
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
        return `$${value}`
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                    Project Analytics
                </CardTitle>
                <p className="text-sm text-slate-500">Projects &amp; Costs per user</p>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-[260px] text-slate-500">
                        No data to display
                    </div>
                ) : (
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#e2e8f0' }}
                                    interval={0}
                                    angle={data.length > 5 ? -20 : 0}
                                    textAnchor={data.length > 5 ? 'end' : 'middle'}
                                />
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
                                    }}
                                    formatter={(value: number, name: string) => {
                                        if (name === 'Cost') return [formatCurrency(value), name]
                                        return [value, name]
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: '13px' }}
                                />
                                <Bar
                                    yAxisId="left"
                                    dataKey="projects"
                                    name="Projects"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                                <Bar
                                    yAxisId="right"
                                    dataKey="cost"
                                    name="Cost"
                                    fill="#10b981"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
