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
      'src/pages/legal/2026-1/terms-of-use/terms-body.md',
    ),
    'utf8',
  )
  return { props: { markdown } }
}

function TermsOfUsePage({ markdown }: Props) {
  return (
    <div className="w-full flex justify-center border py-40 px-8">
      <Section className=" w-full md:max-w-5xl flex flex-col">
        <div className="flex flex-col text-center justify-center mb-10">
          <h1 className="text-4xl font-semibold">VoiceStack Terms of Use</h1>
        </div>

        <div className="legal-content">
          <LegalMarkdown>{markdown}</LegalMarkdown>
        </div>
      </Section>
    </div>
  )
}

export default TermsOfUsePage
