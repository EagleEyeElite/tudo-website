import { Metadata } from 'next'
import Alert from '@/components/layout/alert'
import Footer from '@/components/layout/footer'
import { Navbar } from "@/components/layout/navbar"
import { getActivityIndicator } from "@/lib/api/activityIndicator"
import "styles/index.css"

export async function generateMetadata(): Promise<Metadata> {
  const folderPath = process.env.NODE_ENV === 'production' ? '/favicon/production' : '/favicon/development'

  return {
    title: 'TuDo Makerspace',
    description: 'Das TuDo Makerspace an der Technischen Universität Berlin kombiniert eine gemütliche Café-Atmosphäre mit einer innovativen Makerspace-Ausstattung, einschließlich Holzwerkstatt und Lötbereich, ideal für kreative Projekte und Zusammenkünfte.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL as string),
    openGraph: {
      images: '/og',
    },
    icons: {
      icon: [
        { url: `${folderPath}/favicon.ico` },
        { url: `${folderPath}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
        { url: `${folderPath}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: `${folderPath}/apple-touch-icon.png`, sizes: '180x180' },
      ],
      other: [
        { rel: 'mask-icon', url: `${folderPath}/safari-pinned-tab.svg`, color: '#000000' },
      ],
    },
    manifest: '/favicon/site.webmanifest',
    other: {
      'msapplication-config': `${folderPath}/browserconfig.xml`,
    },
  }
}

export default async function RootLayout({children}: {
  children: React.ReactNode
}) {
  const activityIndicator = await getActivityIndicator()

  return (
    <html lang="en">
    <body>
      <div className="min-h-screen">
        <Navbar activityIndicator={activityIndicator} />
        <Alert preview={false} />
        <main>{children}</main>
      </div>
      <Footer />
    </body>
    </html>
  )
}
