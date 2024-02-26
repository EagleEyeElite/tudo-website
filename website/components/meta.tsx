import Head from 'next/head'
import { CMS_NAME, HOME_OG_IMAGE_URL } from '../lib/constants'

export default function Meta() {
    // Determine the folder path based on the NODE_ENV
    const folderPath = process.env.NODE_ENV === 'production' ? '/favicon/production/' : '/favicon/development/';

    return (
      <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${folderPath}apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${folderPath}favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${folderPath}favicon-16x16.png`}
          />
          <link rel="manifest" href={`${folderPath}site.webmanifest`} />
          <link
            rel="mask-icon"
            href={`${folderPath}safari-pinned-tab.svg`}
            color="#000000"
          />
          <link rel="shortcut icon" href={`${folderPath}favicon.ico`} />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-config" content={`${folderPath}browserconfig.xml`} />
          <meta name="theme-color" content="#000" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
          <meta
            name="description"
            content={`A statically generated blog example using Next.js and ${CMS_NAME}.`}
          />
          <meta property="og:image" content={HOME_OG_IMAGE_URL} />
      </Head>
    );
}
