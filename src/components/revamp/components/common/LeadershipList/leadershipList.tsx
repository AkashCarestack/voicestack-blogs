import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import SectionHeader from '../sectionHeader'

export default function LeadershipList({ data }: { data: any }) {
  return (
    <Section className="relative py-sm md:py-md  bg-[#F9F9F9]">
      <Container className="w-full justify-center">
        <div className="font-sans flex flex-col gap-16">
          <SectionHeader heading={data?.heading} />
          <div
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4"
            style={{ columnGap: '1.5rem' }}
          >
            {data?.testimonial?.map((item: any) => (
              <div key={item._key} className="break-inside-avoid mb-6">
                <div
                  className="w-full rounded-[6px] lg:rounded-[14px] overflow-hidden mb-3"
                  style={{
                    height: `257px`,
                    width: `${
                      257 *
                      (item?.testimonialImage?.metadata?.dimensions
                        ?.aspectRatio || 1)
                    }px`,
                    maxWidth: '100%',
                  }}
                >
                  <ImageLoader
                    image={item?.testimonialImage}
                    imageClassName="w-full h-full object-cover rounded-[6px] lg:rounded-[14px]"
                    alt={item.name || item.designation || 'Feature image'}
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-base text-gray-600">
                    {item.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
