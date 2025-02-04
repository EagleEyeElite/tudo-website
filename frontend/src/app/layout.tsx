import { Metadata } from 'next'
import { getActivityIndicator } from '@/lib/api/activityIndicator'
import RootLayoutClient from '@/components/layout/RootLayout'
import './global.css'

export const revalidate = 10

const faviconPath = process.env.NODE_ENV === 'production' ? '/favicon/production' : '/favicon/development'
export const metadata: Metadata = {
  title: 'TuDo Makerspace',
  description: 'Das TuDo Makerspace an der Technischen Universität Berlin kombiniert eine gemütliche Café-Atmosphäre mit einer innovativen Makerspace-Ausstattung, einschließlich Holzwerkstatt und Lötbereich, ideal für kreative Projekte und Zusammenkünfte.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL as string),
  openGraph: {
    images: '/og',
  },
  icons: {
    icon: [
      { url: `${faviconPath}/favicon.ico` },
      { url: `${faviconPath}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${faviconPath}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: `${faviconPath}/apple-touch-icon.png`, sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: `${faviconPath}/safari-pinned-tab.svg`, color: '#000000' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  other: {
    'msapplication-config': `${faviconPath}/browserconfig.xml`,
  },
}

export default async function RootLayout({children}: {
  children: React.ReactNode
}) {
  const initialState = await getActivityIndicator()

  return (
    <html lang="en" suppressHydrationWarning>
    <body>
    <RootLayoutClient initialState={initialState}>
      {children}
    </RootLayoutClient>
    </body>
    </html>
  )
}