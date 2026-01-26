'use client'

import { useState } from 'react'
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
import { AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )
  const [users, setUsers] = useState<any[]>([])
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    role: 'employee',
    department: '',
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

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulated save
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.full_name) {
      setSaveMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }
    
    // In a real app, this would call an API to create the user
    setSaveMessage({ type: 'success', text: 'User invited successfully!' })
    setShowAddUserForm(false)
    setNewUser({ email: '', full_name: '', role: 'employee', department: '' })
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    ...(profile?.role === 'admin' ? [{ id: 'users', label: 'User Management' }] : []),
  ]

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
            className={`px-4 py-2 font-medium border-b-2 -mb-[2px] transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Update your profile and basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {saveMessage && (
              <div
                className={`flex gap-2 items-start p-4 rounded-lg ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {saveMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm">{saveMessage.text}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={settings.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={settings.email} disabled />
              <p className="text-xs text-slate-600">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input
                value={settings.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Select value={settings.timezone} onValueChange={(value) => handleChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                    <SelectItem value="CST">Central Time (CST)</SelectItem>
                    <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={settings.language} onValueChange={(value) => handleChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
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

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-slate-600">Receive email updates about your CRM activity</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium">Slack Notifications</h4>
                  <p className="text-sm text-slate-600">Send updates to your Slack workspace</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.slackNotifications}
                  onChange={(e) => handleChange('slackNotifications', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-sync</h4>
                  <p className="text-sm text-slate-600">Automatically sync data with external services</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => handleChange('autoSync', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>

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

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
              <p className="text-sm text-slate-600 mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4 text-red-600">Delete Account</h4>
              <p className="text-sm text-slate-600 mb-4">
                Permanently delete your account and all associated data
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Management - Admin Only */}
      {activeTab === 'users' && profile?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Add and manage team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {saveMessage && (
              <div
                className={`flex gap-2 items-start p-4 rounded-lg ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {saveMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm">{saveMessage.text}</p>
              </div>
            )}

            <Button onClick={() => setShowAddUserForm(!showAddUserForm)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>

            {showAddUserForm && (
              <Card className="bg-slate-50">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email*</label>
                    <Input
                      type="email"
                      placeholder="user@company.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name*</label>
                    <Input
                      placeholder="John Doe"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      placeholder="Sales"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleAddUser}>Send Invite</Button>
                    <Button variant="outline" onClick={() => setShowAddUserForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Team Members</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium">No additional users</p>
                    <p className="text-sm text-slate-600">Add team members to get started</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
