import fs from 'fs'
import type { GetStaticProps } from 'next'
import path from 'path'

import LegalMarkdown from '~/components/legal/LegalMarkdown'
import Section from '~/components/structure/Section'

type Props = {
  markdown: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const markdown = fs.readFileSync(
    path.join(
      process.cwd(),
      'src/pages/legal/voicebot/2026-2/terms-and-conditions/terms-body.md',
    ),
    'utf8',
  )
  return { props: { markdown } }
}

function TermsAndConditionsPage({ markdown }: Props) {
  return (
    <div className="w-full flex justify-center border py-40 px-8">
      <Section className=" w-full md:max-w-5xl flex flex-col">
        <div className="flex flex-col text-center justify-center mb-10">
          <h1 className="text-4xl font-semibold">TERMS AND CONDITIONS</h1>
          <h2 className="text-3xl font-semibold mt-4">SAAS CUSTOMER AGREEMENT</h2>
        </div>

        <div className="legal-content">
          <LegalMarkdown>{markdown}</LegalMarkdown>
        </div>
      </Section>
    </div>
  )
}

export default TermsAndConditionsPage
