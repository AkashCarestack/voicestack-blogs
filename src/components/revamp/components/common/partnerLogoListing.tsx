import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

const PartnerLogoListing = ({ data, refer = null, header = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [isUk, setIsUk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])

  // Handle reference data - transform blocksListingData to items format
  const useReferenceData = data?.useReference && refer
  let displayItems = []
  let displayHeading = data?.heading

  if (useReferenceData && refer) {
    displayHeading = refer?.logoSectionHeader || refer?.heading || displayHeading
    const imageArray = refer?.partnerImage || refer?.image || []
    const secondaryImageArray = refer?.partnerSecondaryImage || []
    displayItems = imageArray.map((img: any, index: number) => {
      const displayImage = secondaryImageArray[index] || img
      return {
        _id: img._id || `partner-${index}`,
        image: {
          url: displayImage.url,
          altText: displayImage.altText || img.altText,
          metadata: displayImage.metadata || img.metadata
        }
      }
    })
  } else {
    displayItems = data?.items || []
  }

  return (
    <Section className="py-sm md:py-md md:pb-16">
      <Container>
        <div className="flex flex-col items-center w-full gap-16">
          <h3 className='text-lg md:text-2xl font-medium leading-[133%] tracking-normal'>{displayHeading}</h3>

          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 max-w-[1034px]">
            {displayItems &&
              displayItems?.length &&
              displayItems?.map((item: any, i) => {
                return (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || 'organization Logo'}
                    title={item.image.altText}
                    width={item.image?.metadata?.dimensions?.width}
                    height={item.image?.metadata?.dimensions?.height}
                    className={`${isUk ? 'h-[52px]' : 'h-10'} w-auto invert`}
                    key={item?._id || i}
                  />
                )
              })}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default PartnerLogoListing
