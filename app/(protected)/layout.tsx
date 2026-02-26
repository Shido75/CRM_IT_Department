'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'

function PageSkeleton() {
    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8 animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded-lg mb-4" />
            <div className="h-4 w-72 bg-slate-100 rounded mb-8" />
            <div className="grid grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-200 rounded-xl" />
                ))}
            </div>
            <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
    )
}

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    // Hard block only when we don't know auth state yet (very brief — cached profile skips this)
    if (loading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <span className="font-bold text-white text-lg">O</span>
                    </div>
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <SidebarProvider>
            <div className="flex w-full h-screen overflow-hidden">
                <AppSidebar />
                <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 border-b md:hidden shrink-0">
                        <SidebarTrigger />
                        <span className="font-semibold">Menu</span>
                    </div>
                    {/* Show skeleton while data loads, but sidebar is already visible */}
                    {loading ? (
                        <PageSkeleton />
                    ) : (
                        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                            {children}
                        </div>
                    )}
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
