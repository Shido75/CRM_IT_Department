'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ClipboardList } from 'lucide-react'
import type { ProjectWithAssignee } from '@/lib/services/projects'

interface ProjectOverviewTableProps {
    projects: ProjectWithAssignee[]
}

export function ProjectOverviewTable({ projects }: ProjectOverviewTableProps) {
    const formatCurrency = (amount: number | null) => {
        if (amount === null || amount === undefined) return '—'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getAssigneeName = (project: ProjectWithAssignee) => {
        return project.profiles?.full_name || 'Unassigned'
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    Project Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-auto max-h-[320px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="font-semibold text-slate-700">Project Name</TableHead>
                                <TableHead className="font-semibold text-slate-700">Assigned To</TableHead>
                                <TableHead className="font-semibold text-slate-700">Submission Date</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-right">Project Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                        No projects found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <TableRow key={project.id} className="hover:bg-slate-50/80 transition-colors">
                                        <TableCell className="font-medium text-slate-900">
                                            {project.name}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {getAssigneeName(project)}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {formatDate(project.end_date)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-700">
                                            {formatCurrency(project.budget)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
