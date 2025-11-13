import React, { useContext, useEffect, useState } from 'react'
import Section from './structure/Section'
import Container from './structure/Container'
import { useRouter } from 'next/router'
import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
import HeroInner from './common/HeroInner'

const ContentSection = ({ content, draftMode, token }) => {
  const router = useRouter()


  return (
    <>
      <HeroInner data={content}/>
      <Section className="py-sm md:py-md relative scroll-smooth scroll-m-16">
        <Container className='justify-center'>
          <div className="flex justify-center w-full max-w-[822px]">
            <div className="flex flex-col  w-full">
              <SanityPortableText
                content={content?.contentArea}
                draftMode={draftMode}
                token={token}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ContentSection
