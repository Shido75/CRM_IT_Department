'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react'
import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/clients', label: 'Clients', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/communications', label: 'Communications', icon: MessageSquare },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/notifications', label: 'Notifications', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6 overflow-y-auto border-r border-slate-700">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            C
          </div>
          <span className="text-xl font-bold">CRM Pro</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div className="space-y-2 border-t border-slate-700 pt-6 mt-auto">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
            pathname.startsWith('/settings')
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
