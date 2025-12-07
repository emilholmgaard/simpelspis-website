import '@/styles/tailwind.css'
import { Analytics } from '@vercel/analytics/react'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { CookieBanner } from '@/components/cookie-banner'
import { CookiePreferencesProvider } from '@/components/cookie-preferences-provider'
import { CookiePreferencesButton } from '@/components/cookie-preferences-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Simpel Spis',
    default: 'Simpel Spis',
  },
  description: 'Udforsk hundredevis af lækre opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken. Find opskrifter baseret på ingredienser, kategori eller tid.',
  keywords: ['opskrifter', 'madopskrifter', 'kogebog', 'madlavning', 'opskrifter danmark', 'nemme opskrifter', 'italiensk mad', 'dansk mad'],
  openGraph: {
    title: 'Simpel Spis - Nemme Opskrifter',
    description: 'Udforsk hundredevis af lækre opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken.',
    type: 'website',
    locale: 'da_DK',
    siteName: 'Simpel Spis',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simpel Spis',
    description: 'Udforsk hundredevis af lækre opskrifter fra hele verden.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'
  
  // Organization schema for structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Simpel Spis',
    url: baseUrl,
    logo: `${baseUrl}/logo_black.svg`,
    description: 'Udforsk hundredevis af lækre opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hej@simpelspis.dk',
      availableLanguage: ['Danish', 'da'],
    },
  }

  return (
    <html lang="da" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111827" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="text-gray-950 dark:text-gray-50 bg-white dark:bg-gray-950 antialiased transition-colors">
        <ThemeProvider />
        <CookiePreferencesProvider>
          {children}
          <Footer />
          <CookieBanner />
          <CookiePreferencesButton />
        </CookiePreferencesProvider>
        <Analytics />
      </body>
    </html>
  )
}
