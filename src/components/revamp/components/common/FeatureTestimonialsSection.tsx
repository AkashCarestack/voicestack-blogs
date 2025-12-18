import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from './sectionHeaderV2'
import Image from 'next/image'

export default function FeatureTestimonialsSection({ data }: { data: any }) {
  console.log('fee', data)
  return (
    <Section className="bg-[#ffffff]" border="t">
      <Container type="V2" border="b-0">
        <div className="flex-col relative w-full flex gap-16">
          <SectionHeaderV2
            heading={data?.heading}
            description={data?.description}
            className="xl:px-12 md:px-6 px-4"
          />

          <div className="grid  lg:grid-cols-3">
            {data?.items?.map((item: any) => (
              <div
                key={item._key}
                className="flex h-full flex-col border-y border-r last:border-r-0 border-gray-200 bg-white md:p-12 p-6 text-center shadow-sm"
              >
                {/* Logo */}
                {item?.testimonial?.logo?.url && (
                  <div className="mb-12 md:mb-12 h-10">
                    <Image
                      src={item?.testimonial?.logo?.url}
                      alt={item?.testimonial?.logo?.altText || 'Company logo'}
                      width={140}
                      height={32}
                      className="mx-auto object-contain"
                    />
                  </div>
                )}

                {/* Quote */}
                <div
                  className="mb-10 text-sm md:text-lg leading-relaxed text-gray-500 font-medium [&_span]:text-gray-950"
                  dangerouslySetInnerHTML={{
                    __html: `&ldquo;${item.description}&rdquo;`,
                  }}
                />

                {/* Author */}
                <div className="mt-auto flex flex-col items-center">
                  {item.testimonial?.secondaryTestimonialImage?.url && (
                    <div className="mb-5 h-[60px] w-[60px] overflow-hidden rounded-[6px] md:rounded-[12px] bg-img-gray-secondary">
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

                  <p className="text-sm md:text-base font-medium text-gray-950">
                    {item.testimonial?.name}
                  </p>
                  <p className="text-sm md:text-base font-normal text-gray-500">
                    {item.testimonial?.designation}
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
