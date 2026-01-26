'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, AlertCircle, CheckCircle, Info, X } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      title: 'Lead Converted',
      message: 'Sarah Johnson has been successfully converted to a client',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Upcoming Deadline',
      message: 'Website redesign project deadline is tomorrow',
      timestamp: '4 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'New Lead Added',
      message: 'John Doe from Acme Corp has been added as a new lead',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: '4',
      type: 'success',
      title: 'Task Completed',
      message: 'Homepage design mockup has been marked as done',
      timestamp: '2 days ago',
      read: true,
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50'
      case 'warning':
        return 'bg-yellow-50'
      case 'error':
        return 'bg-red-50'
      default:
        return 'bg-blue-50'
    }
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-2">Stay updated with your CRM activity</p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">{unreadCount} unread</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${notification.read ? 'opacity-75' : ''} ${getBackgroundColor(notification.type)}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{notification.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <Card>
          <CardContent className="p-4 text-center">
            <Button variant="outline">Clear All Notifications</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
