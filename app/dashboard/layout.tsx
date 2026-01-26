import React from "react"
import { AuthProvider } from '@/lib/auth-context'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <main className="pt-16 p-8 bg-slate-50 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
