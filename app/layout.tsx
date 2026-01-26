import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
<<<<<<< HEAD
=======
import { AuthProvider } from '@/lib/auth-context' // Ensure this path is correct!
>>>>>>> 2cae5e4 (first CRM Design And functional)
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'v0 App',
=======
  title: 'CRM Project',
>>>>>>> 2cae5e4 (first CRM Design And functional)
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
<<<<<<< HEAD
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
=======
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
>>>>>>> 2cae5e4 (first CRM Design And functional)
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
<<<<<<< HEAD
        {children}
        <Analytics />
      </body>
    </html>
  )
}
=======
        {/* Everything inside AuthProvider can now use useAuth() */}
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
>>>>>>> 2cae5e4 (first CRM Design And functional)
