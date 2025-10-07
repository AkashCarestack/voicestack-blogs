import React from 'react'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { urlForImage } from '~/lib/sanity.image'
import SectionHeader from './common/sectionHeader'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import { PortableText } from '@portabletext/react'

export default function CardListing({ data }: any) {
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="md:text-base text-sm font-normal leading-[150%] text-gray-700">
          {children}
        </p>
      ),
    },
    marks: {
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="font-medium">{children}</span>
      ),
    },
  }
  return (
    <Section className="py-sm md:py-md lg:py-lg bg-white ">
      <Container className="flex-col">
        <SectionHeader
          heading={data?.headline}
          description={data?.subDescription}
        />
        <div className="grid lg:grid-cols-2 md:pt-16 pt-8 gap-6 justify-center">
          {data?.tabs?.length &&
            data?.tabs?.map((e: any) => {
              return (
                <div key={e._key} className="md:max-w-[608px] md:gap-6 gap-4">
                  <div className="md:max-w-[608px] h-[350] w-full">
                    <ImageLoader
                      image={urlForImage(e?.image)}
                      className="w-full h-full object-cover md:rounded-[24px] rounded-[12px] overflow-hidden"
                    />
                  </div>
                  <div className="flex flex-col gap-3 md:py-8 py-4 md:px-3 px-2">
                    <div className="text-sm  font-normal text-gray-950 uppercase opacity-70">
                      {e.tabHeading}
                    </div>
                    <div className="md:text-2xl text-xl font-bold text-gray-950 leading-[133.33%] font-manrope">
                      {e.tabSubHeading}
                    </div>

                    {e.description && (
                      Array.isArray(e.description) ? (
                        <PortableText
                          value={e.description}
                          components={components}
                        />
                      ) : (
                        <p className="md:text-base text-sm font-normal leading-[150%] text-gray-700">
                          {e.description}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </Container>
    </Section>
  )
}
