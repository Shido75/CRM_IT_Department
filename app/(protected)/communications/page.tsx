'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Mail, Phone, MessageSquare, Send } from 'lucide-react'

export default function CommunicationsPage() {
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      type: 'email',
      lastMessage: 'Thanks for the proposal, looks great!',
      timestamp: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      name: 'Acme Corp',
      type: 'phone',
      lastMessage: 'We discussed the contract details',
      timestamp: '5 hours ago',
      unread: false,
    },
    {
      id: '3',
      name: 'John Smith',
      type: 'message',
      lastMessage: 'Can we schedule a meeting for next week?',
      timestamp: '1 day ago',
      unread: true,
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5" />
      case 'phone':
        return <Phone className="w-5 h-5" />
      default:
        return <MessageSquare className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Communications</h1>
          <p className="text-slate-600 mt-2">Track all your client communications in one place</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Search conversations..." type="search" />
            <div className="space-y-2 mt-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-slate-600">{getIcon(conv.type)}</div>
                    <h4 className="font-medium text-sm">{conv.name}</h4>
                    {conv.unread && <div className="w-2 h-2 rounded-full bg-blue-600 ml-auto" />}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{conv.lastMessage}</p>
                  <p className="text-xs text-slate-500 mt-1">{conv.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sarah Johnson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-4 h-96 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-lg max-w-xs">
                  <p className="text-sm text-slate-900">Hi Sarah, just wanted to follow up on our proposal</p>
                  <p className="text-xs text-slate-600 mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Thanks for the proposal, looks great!</p>
                  <p className="text-xs text-blue-200 mt-1">10:45 AM</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Input placeholder="Type your message..." />
              <Button size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
