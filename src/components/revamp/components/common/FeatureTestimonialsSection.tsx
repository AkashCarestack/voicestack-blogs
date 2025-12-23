import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import Image from 'next/image'
import SectionHeader from './sectionHeader'
import SectionHeaderV2 from './sectionHeaderV2'

export default function FeatureTestimonialsSection({ data }: { data: any }) {
  const itemsLength = data?.items?.length || 0
  
  // Conditional padding based on items count
  const containerPadding = itemsLength === 1 ? 'lg:px-12' : 'lg:px-0'
  
  // Conditional grid columns based on items count
  const gridCols = 
    itemsLength === 1 ? 'lg:grid-cols-1' : 
    itemsLength === 2 ? 'lg:grid-cols-2' : 
    'lg:grid-cols-3'

  return (
    <Section className="bg-[#ffffff]" border="t">
      <Container
        className="w-full"
        type="V2"
        border="b-0"
      >
        <div className="flex-col relative w-full flex gap-16">
          {/* <SectionHeaderV2
            heading={data?.heading}
            description={data?.description}
            className="xl:px-12 md:px-6 px-4"
          /> */}
          <div
            className={`${containerPadding} px-6 lg:py-12 py-6`}
            style={{
              backgroundImage: `url('/assets/Bg/pattern.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%',
            }}
          >
            <div className={`grid bg-white border-x border-gray-200 ${gridCols}`}>
              {data?.items?.map((item: any) => (
                <div
                  key={item._key}
                  style={{
                    backgroundColor:
                      'linear-gradient(180deg, #FFF 0%, #F9FAFB 100%)',
                  }}
                  className="flex h-full flex-col border-y border-r last:border-r-0 border-gray-200 p-6 md:px-12 md:py-16 text-center shadow-sm"
                >
                  {/* Logo */}
                  {/* {item?.testimonial?.logo?.url && (
                  <div className="mb-12 md:mb-12 h-10">
                    <Image
                      src={item?.testimonial?.logo?.url}
                      alt={item?.testimonial?.logo?.altText || 'Company logo'}
                      width={140}
                      height={32}
                      className="mx-auto object-contain"
                    />
                  </div>
                )} */}
                  {/* Author */}
                  <div className="flex flex-col items-center gap-3 md:gap-6">
                    {item.testimonial?.secondaryTestimonialImage?.url && (
                      <div className="h-[100px] w-[100px] overflow-hidden rounded-[4px] md:rounded-[8px] bg-img-gray-secondary">
                        <Image
                          src={item.testimonial?.secondaryTestimonialImage?.url}
                          alt={
                            item.testimonial?.secondaryTestimonialImage
                              ?.altText || 'Company logo'
                          }
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-1">
                    <p className="text-sm md:text-base font-medium text-gray-950">
                      {item.testimonial?.name} <span className="bg-gray-100 text-gray-600 rounded-[4px] px-1.5 py-0.5">  {item.testimonial?.designation}</span>
                    </p>
                    <p className="text-sm md:text-base font-normal text-gray-500">
                      {item.testimonial?.practiceName}
                    </p>
                    </div>
                  </div>
                  {/* Quote */}
                  <div
                    className="mt-6 text-sm md:text-xl leading-relaxed text-gray-500 font-medium [&_span]:text-gray-950 max-w-[800px] mx-auto"
                    dangerouslySetInnerHTML={{
                      __html: `&ldquo;${item.description}&rdquo;`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
