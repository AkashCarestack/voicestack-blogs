import { Head, Html, Main, NextScript } from 'next/document'

import { ResourcesDocumentHead } from '~/resources/integration/documentHead'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ResourcesDocumentHead />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
