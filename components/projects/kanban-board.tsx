'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Trash2 } from 'lucide-react'
import type { Project } from '@/lib/services/projects'

interface KanbanBoardProps {
  projects: Project[]
  onStatusChange: (projectId: string, newStatus: Project['status']) => Promise<void>
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => Promise<void>
  loading?: boolean
}

const statuses: Array<{ value: Project['status']; label: string; color: string }> = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-50' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-50' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-yellow-50' },
  { value: 'completed', label: 'Completed', color: 'bg-green-50' },
]

export function KanbanBoard({
  projects,
  onStatusChange,
  onEdit,
  onDelete,
  loading,
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 auto-rows-max">
      {statuses.map((status) => (
        <div key={status.value}>
          <div className={`${status.color} rounded-lg p-4 border border-slate-200`}>
            <h3 className="font-semibold text-slate-900 mb-4">{status.label}</h3>
            <div className="space-y-3">
              {projects
                .filter((project) => project.status === status.value)
                .map((project) => (
                  <Card key={project.id} className="cursor-move hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 text-sm break-words">
                            {project.name}
                          </h4>
                          {project.description && (
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3 text-xs text-slate-600">
                            {project.budget && (
                              <span>Budget: ${project.budget.toLocaleString()}</span>
                            )}
                            {project.spent && (
                              <span>Spent: ${project.spent.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(project)}>
                              Edit
                            </DropdownMenuItem>
                            {status.value !== 'completed' && (
                              <>
                                {status.value !== 'in_progress' && (
                                  <DropdownMenuItem
                                    onClick={() => onStatusChange(project.id, 'in_progress')}
                                  >
                                    Move to In Progress
                                  </DropdownMenuItem>
                                )}
                                {status.value !== 'on_hold' && (
                                  <DropdownMenuItem
                                    onClick={() => onStatusChange(project.id, 'on_hold')}
                                  >
                                    Move to On Hold
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => onStatusChange(project.id, 'completed')}
                                >
                                  Mark Completed
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => onDelete(project.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
