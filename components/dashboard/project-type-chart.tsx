'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart as PieChartIcon } from 'lucide-react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts'
import type { Project } from '@/lib/services/projects'

interface ProjectTypeChartProps {
    projects: Project[]
}

const STATUS_COLORS: Record<string, string> = {
    planning: '#3b82f6',
    in_progress: '#f59e0b',
    completed: '#10b981',
    on_hold: '#8b5cf6',
    cancelled: '#ef4444',
    running: '#3b82f6',
}

const STATUS_LABELS: Record<string, string> = {
    planning: 'Planning',
    in_progress: 'In Progress',
    completed: 'Completed',
    on_hold: 'On Hold',
    cancelled: 'Cancelled',
    running: 'Running',
}

export function ProjectTypeChart({ projects }: ProjectTypeChartProps) {
    // Group projects by status
    const statusCounts = projects.reduce<Record<string, number>>((acc, project) => {
        const status = project.status || 'planning'
        acc[status] = (acc[status] || 0) + 1
        return acc
    }, {})

    const data = Object.entries(statusCounts).map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        color: STATUS_COLORS[status] || '#94a3b8',
    }))

    const total = projects.length

    const renderCustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        if (percent < 0.05) return null

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs font-semibold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <PieChartIcon className="w-5 h-5 text-violet-600" />
                    Project Type Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                {total === 0 ? (
                    <div className="flex items-center justify-center h-[260px] text-slate-500">
                        No projects to display
                    </div>
                ) : (
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
                                    }}
                                    formatter={(value: number) => [`${value} projects`, 'Count']}
                                />
                                <Legend
                                    verticalAlign="middle"
                                    align="right"
                                    layout="vertical"
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: '13px', lineHeight: '24px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
