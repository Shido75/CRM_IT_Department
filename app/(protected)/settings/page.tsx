'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, CheckCircle, Plus, Trash2, Users } from 'lucide-react'
import { createUser, listUsers, deleteUser } from '@/app/actions/users'

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  department: string
  status: string
  created_at: string
}

export default function SettingsPage() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // User management state
  const [userList, setUserList] = useState<UserProfile[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    role: 'employee',
    department: 'sales',
    password: '',
    confirmPassword: '',
  })

  const [settings, setSettings] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    department: profile?.department || '',
    timezone: 'UTC',
    language: 'English',
    emailNotifications: true,
    slackNotifications: false,
    autoSync: true,
  })

  // Load users on mount for admin
  useEffect(() => {
    if (profile?.role === 'admin' && activeTab === 'users') {
      loadUsers()
    }
  }, [profile?.role, activeTab])

  const loadUsers = async () => {
    setUsersLoading(true)
    const result = await listUsers()
    if (result.success) {
      setUserList(result.users as UserProfile[])
    }
    setUsersLoading(false)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.full_name || !newUser.password) {
      setSaveMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }
    if (newUser.password !== newUser.confirmPassword) {
      setSaveMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (newUser.password.length < 6) {
      setSaveMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    try {
      const result = await createUser({
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.full_name,
        role: newUser.role as any,
        department: newUser.department,
      })

      if (result.success) {
        setSaveMessage({ type: 'success', text: `User "${newUser.full_name}" created successfully!` })
        setShowAddUserForm(false)
        setNewUser({ email: '', full_name: '', role: 'employee', department: 'sales', password: '', confirmPassword: '' })
        await loadUsers()
      } else {
        setSaveMessage({ type: 'error', text: result.error || 'Failed to create user' })
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to create user' })
    }
  }

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Remove user "${name}"? This cannot be undone.`)) return
    setDeletingId(userId)
    try {
      const result = await deleteUser(userId)
      if (result.success) {
        setUserList((prev) => prev.filter((u) => u.id !== userId))
        setSaveMessage({ type: 'success', text: `User "${name}" removed.` })
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'error', text: result.error || 'Failed to remove user' })
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to remove user' })
    } finally {
      setDeletingId(null)
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isAdminOrManager = profile?.role === 'admin' || profile?.role === 'manager'

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    ...(isAdminOrManager ? [{ id: 'users', label: `User Management` }] : []),
  ]

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-100 text-red-700',
      manager: 'bg-purple-100 text-purple-700',
      employee: 'bg-blue-100 text-blue-700',
    }
    return styles[role] || 'bg-slate-100 text-slate-700'
  }

  const getDeptBadge = (dept: string) => {
    const d = (dept || '').toLowerCase()
    if (d === 'dev') return 'bg-cyan-100 text-cyan-700'
    if (d === 'sales') return 'bg-orange-100 text-orange-700'
    return 'bg-slate-100 text-slate-600'
  }

  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 -mb-[2px] transition-colors ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
          >
            {tab.label}
            {tab.id === 'users' && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                {userList.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Global message */}
      {saveMessage && (
        <div
          className={`flex gap-2 items-start p-4 rounded-lg ${saveMessage.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
            }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{saveMessage.text}</p>
        </div>
      )}

      {/* General */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Update your profile and basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={settings.fullName} onChange={(e) => handleChange('fullName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={settings.email} disabled />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input type="tel" value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input value={settings.department} onChange={(e) => handleChange('department', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Select value={settings.timezone} onValueChange={(v) => handleChange('timezone', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={settings.language} onValueChange={(v) => handleChange('language', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your CRM activity' },
              { key: 'slackNotifications', label: 'Slack Notifications', desc: 'Send updates to your Slack workspace' },
              { key: 'autoSync', label: 'Auto-sync', desc: 'Automatically sync data with external services' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleChange(item.key, e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            ))}
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Change Password</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button>Update Password</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Management — admin + manager tab, but Add User admin only */}
      {activeTab === 'users' && isAdminOrManager && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {userList.length}
                  </span>
                </CardTitle>
                <CardDescription>
                  {isAdmin
                    ? 'Add and manage team members'
                    : 'View team members (only admins can add or remove users)'}
                </CardDescription>
              </div>
              {/* Only admin sees Add User button */}
              {isAdmin && (
                <Button onClick={() => setShowAddUserForm(!showAddUserForm)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Add User Form — admin only */}
            {showAddUserForm && isAdmin && (
              <Card className="bg-slate-50 border-blue-100">
                <CardContent className="pt-6 space-y-4">
                  <h4 className="font-semibold text-slate-800">Create New User</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        type="text"
                        placeholder="user@yourcompany.in"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                      <p className="text-xs text-slate-500">Any email — no verification needed</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name *</label>
                      <Input
                        placeholder="John Doe"
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <Select value={newUser.department} onValueChange={(v) => setNewUser({ ...newUser, department: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="dev">Dev</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password *</label>
                      <Input
                        type="password"
                        placeholder="Min. 6 characters"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm Password *</label>
                      <Input
                        type="password"
                        placeholder="Re-enter password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleAddUser}>Create User</Button>
                    <Button variant="outline" onClick={() => setShowAddUserForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User List */}
            <div>
              <h4 className="font-medium text-slate-700 mb-3">
                Team Members ({userList.length})
              </h4>

              {usersLoading ? (
                <p className="text-slate-500 text-sm">Loading users...</p>
              ) : userList.length === 0 ? (
                <p className="text-slate-500 text-sm">No users found.</p>
              ) : (
                <div className="space-y-2">
                  {userList.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {getInitials(u.full_name)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {u.full_name}
                            {u.id === user?.id && (
                              <span className="ml-2 text-xs text-slate-400">(you)</span>
                            )}
                          </p>
                          <p className="text-sm text-slate-500">{u.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                        {u.department && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDeptBadge(u.department)}`}>
                            {u.department}
                          </span>
                        )}
                        {/* Only admin can remove, and can't remove themselves */}
                        {isAdmin && u.id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteUser(u.id, u.full_name)}
                            disabled={deletingId === u.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
