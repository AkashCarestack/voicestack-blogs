import { PortableText } from "@portabletext/react"
import Button from "~/components/common/Button"
import ImageLoader from "~/components/common/imageLoader/imageLoader"

export default function CardsWithTestimonial({ data }: { data: any }) {  
    const components: any = {
        block: {
          normal: ({ children }: { children: React.ReactNode }) => (
            <p className="text-xl md:text-[32px] font-medium leading-[40px] font-manrope">
              &ldquo;{children}&rdquo;
            </p>
          ),
          blockquote: ({ children }: { children: React.ReactNode }) => (
            <blockquote className="text-xl md:text-[32px] font-medium leading-[40px] font-manrope">
              &ldquo;{children}&rdquo;
            </blockquote>
          ),
        },
        marks: {
          highlight: ({ children }: { children: React.ReactNode }) => (
            <span className="text-[#B5EB92]">{children}</span>
          ),
        },
      }  
    return (
      <div className="relative h-full md:mb-0 mb-4">
        {/* desktop */}
        <div className="relative flex-1 text-white flex w-full h-full justify-between">
          <div className="flex flex-col gap-3 py-8 px-6">
            {/* Company Logo */}
            <div className="flex flex-1">
              <div
                className=""
                style={{
                  height: `50px`,
                  width: `${
                    50 *
                    data?.testimonial?.secondaryLogo?.metadata
                      ?.dimensions?.aspectRatio
                  }px`,
                }}
              >
                <ImageLoader
                  image={data?.testimonial?.secondaryLogo?.url}
                  alt={
                    data?.testimonial?.secondaryLogo?.altText ||
                    'Brand Logo'
                  }
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {/* Metrics overlay */}
            <div className="flex flex-col gap-12">
              {data?.testimonial?.listItems?.length > 0 ? (
                <div className="relative z-10 grid grid-cols-2  gap-y-3 gap-x-6 md:gap-x-12">
                  {data?.testimonial?.listItems?.map(
                    (metric, index) => {
                      // Check if item has 'after' value (metric) or only 'description' (quote)
                      // 'after' is a string, 'description' is blockContent (array)
                      const hasAfter = metric?.after && (typeof metric.after === 'string' ? metric.after.trim() !== '' : true)
                      const hasDescription = metric?.description && (
                        Array.isArray(metric.description) 
                          ? metric.description.length > 0 
                          : (typeof metric.description === 'string' ? metric.description.trim() !== '' : false)
                      )
                      const isDescriptionOnly = !hasAfter && hasDescription
                      
                      return (
                        <div
                          key={index}
                          className={`text-white py-3 border-b border-white/30 ${
                            isDescriptionOnly ? 'col-span-2' : ''
                          }`}
                        >
                          {isDescriptionOnly ? (
                            // Single line quote format for description-only items (blockContent)
                            <PortableText value={metric.description} components={components} />
                          ) : (
                            // Metric format with large number and label
                            <>
                              {/* Main metric value - large and prominent */}
                              <div
                                className="text-lg md:text-[32px] font-semibold testimonial-metric inline font-manrope"
                                dangerouslySetInnerHTML={{
                                  __html: metric?.after || '',
                                }}
                              />
                              
                              {/* Heading/Label - below the metric */}
                              <div className="text-sm md:text-base text-white opacity-70 mt-1">
                                {metric?.listHeading || metric.heading || ''}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    },
                  )}
                </div>
              ) : (
                <div className="relative z-10 flex text-lg text-white">
                  <div className="text-lg md:text-[32px] font-semibold leading-[120%] font-manrope">
                    {data?.testimonial?.testimonialdescription}
                  </div>
                </div>
              )}
              <div className="items-center gap-4 flex sm:hidden">
                <div className="relative w-14 h-14 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center">
                    <ImageLoader
                      key={`testimonial-image-${data?.testimonial?._id}`}
                      image={data?.testimonial?.testimonialImage}
                      width={56}
                      height={56}
                      imageClassName="w-full h-auto object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-white text-sm font-semibold z-10">
                  <p className="font-semibold">
                    {data?.testimonial?.name}
                  </p>
                  <p className=" text-white/60">
                    {data?.testimonial?.designation}
                  </p>
                  
                  <p className="text-white/60 text-base font-normal">
                  {data?.testimonial?.place} {data?.testimonial?.region ? ',' : ''}{data?.testimonial?.region}
                </p>
                  
                </div>
              </div>

              <Button type="primary" link="/demo" className="w-fit">
                <span className="text-base font-medium">{`Book Free Demo`}</span>
              </Button>
            </div>
          </div>
          <div className="relative w-full max-w-[440px]  items-end justify-end hidden sm:flex">
            <div
              className=""
              style={{
                height: `460px`,
                width: `${
                  460 *
                  data?.testimonial?.testimonialImage?.metadata
                    ?.dimensions?.aspectRatio
                }px`,
              }}
            >
              <ImageLoader
                key={`testimonial-image-${data?.testimonial?._id}`}
                image={data?.testimonial?.testimonialImage}
                imageClassName="w-full h-auto object-contain"
              />
            </div>
            <div className="absolute bottom-8 right-0 w-[310px]">
              <div className="flex flex-col py-6 pl-6 pr-8 rounded-l-[12px] rounded-r-none bg-white/5 backdrop-blur-[20px]">
                <p className="font-medium text-lg text-white">
                  {data?.testimonial?.name}
                </p>
                <p className=" text-white/60 text-base font-normal">
                  {data?.testimonial?.designation}
                </p>
                <p className="text-white/60 text-base font-normal">
                  {data?.testimonial?.place} , {data?.testimonial?.region}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }