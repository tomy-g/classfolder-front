import type { Metadata } from 'next'
import '@uploadthing/react/styles.css'
import './globals.css'

import { Inter as FontSans } from 'next/font/google'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import Breadcrumbs from '@/components/breadcrumbs'
import { AuthProvider } from '@/context/AuthProvider'
import NextTopLoader from 'nextjs-toploader'
import '@schedule-x/theme-shadcn/dist/index.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'ClassFolder',
  description: 'Intercambia apuntes y colabora con tus compañeros de clase',
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased mb-4',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color='hsl(221.2 83.2% 53.3%)'/>
          <AuthProvider>
            <Header />
            <Breadcrumbs />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
