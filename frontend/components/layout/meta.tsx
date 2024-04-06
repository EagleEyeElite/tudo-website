import Head from 'next/head'

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
          <link rel="manifest" href={`/favicon/site.webmanifest`} />
          <link
            rel="mask-icon"
            href={`${folderPath}safari-pinned-tab.svg`}
            color="#000000"
          />
          <link rel="shortcut icon" href={`${folderPath}favicon.ico`} />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-config" content={`${folderPath}browserconfig.xml`} />
          <meta name="theme-color" content="#000" />
          <meta
            name="description"
            content="Das TuDo Makerspace an der Technischen Universität Berlin kombiniert eine gemütliche Café-Atmosphäre mit einer innovativen Makerspace-Ausstattung, einschließlich Holzwerkstatt und Lötbereich, ideal für kreative Projekte und Zusammenkünfte."
          />
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/og`} />
      </Head>
    );
}
