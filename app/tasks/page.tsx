'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/services/tasks'
import { TaskForm } from '@/components/tasks/task-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Plus, CheckCircle2, Circle, AlertCircle, Trash2 } from 'lucide-react'
import type { Task } from '@/lib/services/tasks'

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all')

  useEffect(() => {
    loadTasks()
  }, [user])

  const loadTasks = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getTasks(user.id)
      setTasks(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    setFormLoading(true)
    try {
      const newTask = await createTask({
        ...data,
        user_id: user!.id,
      })
      setTasks((prev) => [newTask, ...prev])
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTask = async (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTask) return
    setFormLoading(true)
    try {
      const updated = await updateTask(editingTask.id, data)
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? updated : task))
      )
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updated = await updateTask(taskId, { status: newStatus })
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      )
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((task) => task.status === filter)

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    }
    return colors[priority] || 'text-slate-600'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      default:
        return <Circle className="w-5 h-5 text-slate-400" />
    }
  }

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600 mt-2">Manage your tasks and track progress</p>
        </div>
        {!showForm && !editingTask && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600">Total Tasks</div>
            <div className="text-2xl font-bold mt-2">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600">To Do</div>
            <div className="text-2xl font-bold mt-2 text-slate-600">{stats.todo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600">In Progress</div>
            <div className="text-2xl font-bold mt-2 text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600">Completed</div>
            <div className="text-2xl font-bold mt-2 text-green-600">{stats.done}</div>
          </CardContent>
        </Card>
      </div>

      {(showForm || editingTask) && (
        <TaskForm
          initialData={editingTask || undefined}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          isLoading={formLoading}
        />
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'todo', 'in_progress', 'done'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All Tasks' : status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'all' ? 'All Tasks' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-600">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-slate-600">No tasks yet. Create one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className="capitalize">
                            {task.status === 'in_progress' ? 'In Progress' : task.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`capitalize font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-sm">{task.assigned_to || '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingTask(task)}>
                              Edit
                            </DropdownMenuItem>
                            {task.status !== 'done' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    task.id,
                                    task.status === 'todo' ? 'in_progress' : 'done'
                                  )
                                }
                              >
                                {task.status === 'todo' ? 'Start Task' : 'Mark Done'}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
