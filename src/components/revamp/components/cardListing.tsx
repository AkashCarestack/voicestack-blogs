import React from 'react'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { urlForImage } from '~/lib/sanity.image'
import SectionHeader from './common/sectionHeader'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'

export default function CardListing({ data }: any) {
  return (
    <Container className="flex-col ">
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
                    className="w-full h-full object-cover md:rounded-[24px] !rounded-[12px] overflow-hidden"
                  />
                </div>
                <div className="md:py-8 py-4 md:px-3 px-2">
                  <div className="md:text-2xl text-xl md:font-bold font-semibold">
                    {e.tabHeading}
                  </div>
                  <div className="md:text-lg text-base md:font-bold font-semibold">
                    {e.tabSubHeading}
                  </div>
                  <div className="md:text-base text-sm font-normal leading-[150%] md:pt-3 pt-2">
                    {e.description}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </Container>
  )
}
