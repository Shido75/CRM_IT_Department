'use client'

import {
    LayoutDashboard,
    Users,
    Briefcase,
    FolderKanban,
    CheckSquare,
    MessageSquare,
    BarChart3,
    Bell,
    Settings,
    LogOut,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarRail,
} from '@/components/ui/sidebar'
import { signOut } from '@/lib/auth'
import { useAuth } from '@/lib/auth-context'

// Each nav item declares which roles/departments can see it.
// roles: list of roles that ALWAYS see this item (regardless of department)
// departments: for role==='employee', only these departments see it
const navItems = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'manager'],
        departments: [],            // employees never see Dashboard
    },
    {
        href: '/leads',
        label: 'Leads',
        icon: Users,
        roles: ['admin', 'manager'],
        departments: ['sales'],
    },
    {
        href: '/clients',
        label: 'Clients',
        icon: Briefcase,
        roles: ['admin', 'manager'],
        departments: ['sales', 'dev'],
    },
    {
        href: '/projects',
        label: 'Projects',
        icon: FolderKanban,
        roles: ['admin', 'manager'],
        departments: ['dev'],
    },
    {
        href: '/tasks',
        label: 'Tasks',
        icon: CheckSquare,
        roles: ['admin', 'manager'],
        departments: ['dev'],
    },
    {
        href: '/communications',
        label: 'Communications',
        icon: MessageSquare,
        roles: ['admin', 'manager'],
        departments: ['dev'],
    },
    {
        href: '/reports',
        label: 'Reports',
        icon: BarChart3,
        roles: ['admin', 'manager'],
        departments: ['sales'],
    },
    {
        href: '/notifications',
        label: 'Notifications',
        icon: Bell,
        roles: ['admin', 'manager'],
        departments: ['sales', 'dev'],
    },
]

function canSeeItem(
    item: (typeof navItems)[0],
    role: string | undefined,
    department: string | undefined
): boolean {
    if (!role) return false
    // Admin and manager always see everything in the list
    if (item.roles.includes(role)) return true
    // Employee: check department
    if (role === 'employee') {
        const dept = (department || '').toLowerCase()
        return item.departments.includes(dept)
    }
    return false
}

export function AppSidebar() {
    const pathname = usePathname()
    const { profile } = useAuth()

    const role = profile?.role
    const department = profile?.department ?? undefined

    const visibleItems = navItems.filter((item) => canSeeItem(item, role, department))

    // Settings visible to admin + manager only
    const canSeeSettings = role === 'admin' || role === 'manager'

    const handleLogout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Failed to logout:', error)
        }
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={canSeeSettings ? '/dashboard' : '/clients'}>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                                    <span className="font-bold text-white">O</span>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Orbinex CRM</span>
                                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {visibleItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {canSeeSettings && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')}>
                                <Link href="/settings">
                                    <Settings />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Copyright */}
                    <SidebarMenuItem>
                        <div className="px-2 pt-1 pb-2 border-t border-sidebar-border mt-1">
                            <p className="text-[10px] text-muted-foreground leading-tight">
                                © 2026 AK 0121 Agency
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                                All rights reserved.
                            </p>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
