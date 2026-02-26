'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowRight, User, Building2 } from 'lucide-react'

export interface ProjectData {
    project_name: string
    description: string
    budget: number | null
    start_date: string
    end_date: string
}

interface ConvertLeadModalProps {
    isOpen: boolean
    leadName: string
    leadCompany: string
    onConfirm: (projectData: ProjectData) => Promise<void>
    onCancel: () => void
}

export function ConvertLeadModal({
    isOpen,
    leadName,
    leadCompany,
    onConfirm,
    onCancel,
}: ConvertLeadModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState<ProjectData>({
        project_name: leadCompany ? `${leadCompany} Project` : '',
        description: '',
        budget: null,
        start_date: '',
        end_date: '',
    })

    const handleChange = (field: keyof ProjectData, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.project_name.trim()) {
            setError('Project name is required')
            return
        }

        setLoading(true)
        try {
            await onConfirm(formData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to convert lead')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Convert Lead to Client</DialogTitle>
                    <DialogDescription>
                        <span className="flex items-center gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <User className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="text-blue-800 font-medium">{leadName}</span>
                            {leadCompany && (
                                <>
                                    <span className="text-blue-400">·</span>
                                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span className="text-blue-700">{leadCompany}</span>
                                </>
                            )}
                            <ArrowRight className="w-4 h-4 text-blue-600 ml-1 shrink-0" />
                            <span className="text-blue-800 font-medium">Client + Project</span>
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex gap-2 items-start">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Name *</label>
                        <Input
                            placeholder="e.g. Acme Inc. Web Redesign"
                            value={formData.project_name}
                            onChange={(e) => handleChange('project_name', e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            placeholder="Briefly describe the project scope..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Budget ($)</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.budget ?? ''}
                                onChange={(e) =>
                                    handleChange('budget', e.target.value ? parseFloat(e.target.value) : null)
                                }
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <Input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => handleChange('start_date', e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Date</label>
                            <Input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => handleChange('end_date', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Converting...' : 'Convert & Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
