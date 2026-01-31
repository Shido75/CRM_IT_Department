import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context' // Ensure this path is correct!
import './globals.css'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CRM Project',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {/* Everything inside AuthProvider can now use useAuth() */}
        <AuthProvider>
          <SidebarProvider>
            <div className="flex w-full h-screen overflow-hidden">
              <AppSidebar />
              <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b md:hidden shrink-0">
                  <SidebarTrigger />
                  <span className="font-semibold">Menu</span>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                  {children}
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}