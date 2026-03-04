import ImageLoader from '~/components/common/imageLoader/imageLoader'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import StatisticsSection from './StatisticsSection'
import SectionHeaderV2 from '../components/common/sectionHeaderV2'


export default function LeadershipList({ data }: { data: any }) {

  return (
    <>
    <Section className="relative py-sm md:py-md  bg-[#F9F9F9]" border='b'>
      <Container className="w-full justify-center">
        <div className="font-sans flex flex-col gap-16">
          <SectionHeaderV2 heading={data?.heading || data?.title} />
          <div
            className="flex flex-wrap justify-center gap-6"
            style={{ columnGap: '1.5rem', rowGap: '1.5rem' }}
          >
            {data?.testimonial?.map((item: any) => (
              <div key={item._key} className="break-inside-avoid mb-6 flex flex-col">
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
                    imageClassName="w-full h-full bg-[#DDDCDF] object-cover rounded-[6px] lg:rounded-[14px]"
                    alt={item.name || item.designation || 'Feature image'}
                  />
                </div>
                <div className="text-left">
                  <h3 className="md:text-[21px] text-base leading-[120%] font-manrope font-semibold text-gray-900 mb-1.5">
                    {item.name}
                  </h3>
                  <p className="text-[17px] md:leading-6 font-geist font-normal text-gray-600">
                    {item.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
       
        </div>
      </Container>
    </Section>
    <div className='w-full'>
    <StatisticsSection/>
    </div>
    </>
  )
}
