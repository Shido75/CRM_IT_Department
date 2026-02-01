'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/services/projects'
import { ProjectForm } from '@/components/projects/project-form'
import { KanbanBoard } from '@/components/projects/kanban-board'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Project } from '@/lib/services/projects'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [user])

  const loadProjects = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getProjects(user.id)
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    setFormLoading(true)
    try {
      const newProject = await createProject({
        ...data,
        created_by: user!.id,
      })
      setProjects((prev) => [newProject, ...prev])
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateProject = async (data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!editingProject) return
    setFormLoading(true)
    try {
      const updated = await updateProject(editingProject.id, data)
      setProjects((prev) =>
        prev.map((project) => (project.id === editingProject.id ? updated : project))
      )
      setEditingProject(null)
    } catch (error) {
      console.error('Failed to update project:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((project) => project.id !== id))
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleStatusChange = async (projectId: string, newStatus: Project['status']) => {
    try {
      const updated = await updateProject(projectId, { status: newStatus })
      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? updated : project))
      )
    } catch (error) {
      console.error('Failed to update project status:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-2">Manage your projects with Kanban board</p>
        </div>
        {!showForm && !editingProject && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {(showForm || editingProject) && (
        <ProjectForm
          initialData={editingProject || undefined}
          onSubmit={editingProject ? handleUpdateProject : handleAddProject}
          isLoading={formLoading}
        />
      )}

      {loading ? (
        <p className="text-slate-600">Loading projects...</p>
      ) : (
        <KanbanBoard
          projects={projects}
          onStatusChange={handleStatusChange}
          onEdit={setEditingProject}
          onDelete={handleDeleteProject}
          loading={loading}
        />
      )}
    </div>
  )
}
