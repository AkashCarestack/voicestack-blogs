import React, { useContext, useEffect, useState } from 'react'
import Section from './structure/Section'
import Container from './structure/Container'
import { useRouter } from 'next/router'
import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
import HeroInner from './common/HeroInner'
import HeroSection from './revamp/components/common/HeroSection/heroSection'
import HeroWrapper from './revamp/components/common/HeroWrapper'
import FeatureHero from '~/v2/sections/FeatureHero'

const ContentSection = ({ content, draftMode, token, slugData }) => {
  const router = useRouter()


  return (
    <>
      {slugData !== 'app-download' &&     
      <FeatureHero   data={content} type="feature" isCentered={true} />

      // // <HeroWrapper>
      //   <HeroSection data={content} isCentered={true} />
      // // </HeroWrapper>
      
      }

      <Section 
        className="py-sm md:py-md relative scroll-smooth scroll-m-16" 
        style={{ 
          background: slugData === 'app-download' 
            ? 'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)' 
            : undefined 
        }}
      >
        {slugData === 'app-download' ? (
          <>
            <div className="flex justify-center w-full ">
              <div className="flex flex-col w-full gap-6">
                <SanityPortableText
                  content={content?.contentArea}
                  draftMode={draftMode}
                  token={token}
                />
              </div>
            </div>
          </>
        ) : (
          <Container className='justify-center'>
            <div className="flex justify-center w-full max-w-[822px]">
              <div className="flex flex-col w-full gap-12">
                <SanityPortableText
                  content={content?.contentArea}
                  draftMode={draftMode}
                  token={token}
                />
              </div>
            </div>
          </Container>
        )}
      </Section>
    </>
  )
}

export default ContentSection
