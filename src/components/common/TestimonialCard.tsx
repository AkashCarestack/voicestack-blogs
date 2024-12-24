import Image from "next/image";
import React, { forwardRef, useState } from "react";
import { VideoItem, VideoModal } from "./VideoModal";
import TickIcon from "../icons/TickIcon";
import VideoPlayIcon from "../icons/VideoPlayIcon";
import useMediaQuery from "~/utils/mediaQuery";

type TestimonialCardProps = {
  data: any
  index?: number
  onOpenVideo?: (video: VideoItem) => void
  activeIndex?: number | null
  scale?: any
  isSticky?: boolean
}

const TestimonialCard = forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ data, index, activeIndex, isSticky, scale, onOpenVideo }, ref) => {
    
    const isMobile = useMediaQuery(767);

    const topValue = isMobile ? 80 + (index * 20) : 160 + (index * 20);

  
  const video  = data.video
  return (
    <div className={`md:sticky testimonial-card shadow-[0px_-4px_40px_0px_rgba(0,0,0,0.05)]`} ref={ref} id={`${index}`}  data-index={index}
      style={{
        top:topValue,
        transform: (isSticky && !isMobile) ? `scale(${scale})` : "scale(1)",
        // opacity: isSticky ? 1 : 0.8,
        transition: "transform 0.3s ease, opacity 0.3s ease",
      }}
    >

      <div className={`rounded-[20px] shadow-md max-w-[1032px] mx-auto ${index % 2 === 0 ? 'bg-white': 'bg-white'}`}>

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          {data?.image?.url && (
            <div className="flex-1 md:max-w-[250px] lg:max-w-[343px] overflow-hidden relative md:self-end">
              <Image
                width={293}
                height={407}
                src={data.image.url}
                alt={`${data?.name || "Testimonial"}`}
                className="w-full h-full object-cover"
              />
              
              {data?.video && data?.video[0] && data.video[0].videoId && (
                <div className="cursor-pointer absolute bottom-3 right-3 flex gap-2 font-medium text-base
                  items-center rounded-full py-2 pr-4 pl-2 bg-white text-gray-900 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.20)]" onClick={() => onOpenVideo(data.video[0])}>
                  <span><VideoPlayIcon/></span>Watch
                </div>
              )}
            </div>
          )}
          
          
          <div className="flex-1 flex flex-col md:flex-row justify-between">
            {/*  */}
              <div className="flex flex-col flex-1 pt-6 pb-3 px-4 md:p-8">
                {data.listItems &&
                  data.listItems.length > 0 &&
                  data.listItems.map((item: any, index: number) => {
                    return (
                      <div
                        className="py-3 border-b border-gray-200 last:border-none gap-1 flex flex-col"
                        key={index}
                      >
                        <span className="text-gray-900 text-base font-normal leading-[160%]">
                          {item.listHeading}
                        </span>

                        {item.after && (
                          <div className="flex gap-2">
                            {item.before && (
                              <div className="flex gap-2 items-center">
                                <span className="text-gray-900 font-manrope text-[24px] lg:text-[30px] font-bold leading-[1.2]">{item.before}</span>
                                <span className="text-gray-900 font-manrope text-[24px] lg:text-[30px] font-bold leading-[1.2]">{`->`}</span>
                              </div>
                            )}
                            {item.after && (
                              <div className="flex gap-2 items-center">
                                <span className="text-vs-blue font-manrope text-[24px] lg:text-[30px] font-bold leading-[1.2]">{item.after}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {item.description && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                            className="[&_span]:text-gray-900 [&_span]:font-medium [&_span]:text-[20px] 
                             text-vs-blue font-manrope text-[24px] lg:text-[30px] font-bold leading-[1.2]"
                          ></div>
                        )}
                      </div>
                    )
                  })}
                {data.testimonialdescription && (
                  <p
                    className="text-gray-900 font-manrope text-[24px] lg:text-3xl font-bold leading-[120%] [&_span]:text-vs-blue"
                    dangerouslySetInnerHTML={{ __html: data?.testimonialdescription 
                       || "" }}
                  ></p>
                )}
              </div>

              {data.keyFeatures && data.keyFeatures.length > 0 && (
                <div className="flex-1 flex flex-col  py-6 px-4 md:px-6 md:pt-12 md:pb-8 gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-gray-200 md:max-w-[200px] lg:max-w-[270px]">
                    <h3 className="text-gray-500 font-inter text-sm font-medium leading-[110%]">Key Features Used</h3>
                    <ul className="flex flex-wrap gap-3">
                      {data.keyFeatures.map((item:any, index:number) => {
                        return(
                          <li key={index+item} className="flex items-center justify-center px-2 py-[6px] border border-gray-200 text-gray-700 text-sm leading-[1.3] rounded-full">
                            {item}
                          </li>
                        )
                      })}
                      
                    </ul>
                </div>
              )}
            </div>
          </div>

        {/* Testimonee Details bottom strip */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 border-t border-dashed border-gray-300 px-4 py-6 md:py-4 md:px-8 justify-between">
          {/* name and designation */}
          <div>
            <p className="text-base text-gray-900 font-semibold leading-[140%]">{data?.name || ""}</p>
            <p className="text-sm text-gray-500 font-medium leading-[140%]">
              {data?.designation}
            </p>
          </div>

          <div className="flex items-center gap-8 md:justify-between flex-grow max-w-[320px]">
            
            {/* region */}
            <div className="flex flex-col gap-1">
              <span className="text-gray-900 text-base font-semibold leading-[140%]">{data?.place}</span>
              <span className="text-gray-500 text-sm font-medium leading-[140%]">{data?.region }</span>
            </div>

            {/* no of locations */}
            {data.locations && (
              <div className="flex flex-col gap-1">
                <span className="text-gray-900 text-base font-semibold leading-[140%]">
                  {data?.locations}
                </span>
                <span className="text-gray-500 text-sm font-medium leading-[140%]">
                  Locations
                </span>
              </div>
            )}
          </div>

          {/* Logo */}
          {data?.logo && data.logo.url && (
            <div className="flex-shrink-0">
              <Image
                src={`${data.logo.url}`}
                alt="Company Logo"
                className="max-w-full"
                width={188}
                height={64}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    )
  },
)
TestimonialCard.displayName = 'TestimonialCard'
export default TestimonialCard
