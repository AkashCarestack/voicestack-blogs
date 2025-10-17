import React from 'react'
import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import useMediaQuery from '~/utils/mediaQuery'
import Link from 'next/link'

export default function ClickableCards({ data }: any) {
  console.log({ data })
  const isMobile = useMediaQuery(767)
  const logoHeight = isMobile ? 40 : 40
  return (
   
      <Container className="flex-col  bg-[#F9F9F9] ">
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {data.map((item: any) => (
            <div key={item._key} className="md:p-3 p-2  flex flex-col gap-3">
              <div className="md:w-[373px] w-full h-[200px] md:rounded-[12px] rounded-[8px] overflow-auto">
                <ImageLoader
                  className="object-cover"
                  image={item.image}
                  alt={item.heading}
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col gap-2 p-2">
                <div
                  className="justify-items-center md:pl-2"
                  style={{
                    height: `${logoHeight}px`,
                    width: `${
                      logoHeight * item.icon?.metadata?.dimensions?.aspectRatio
                    }px`,
                  }}
                >
                  <ImageLoader
                    className="contain"
                    src={item.icon}
                    alt={item.heading}
                    width={item.icon.metadata.dimensions.width}
                    height={item.icon.metadata.dimensions.height}
                    image={item.icon}
                  />
                </div>
                <div className="md:p-3 flex flex-col md:gap-2 gap-1.5">
                  <h4 className="md:text-2xl text-xl font-bold font-manrope text-gray-950 leading-[133.33%] md:pb-1">
                    {item.heading}
                  </h4>
                  <p className="md:text-base text-sm font-normal font-geist text-gray-700 leading-[150%]">
                    {item.description}
                  </p>
                  {item.link.url && (
                  <div>
                    <Button
                      href={item.link.url}
                      text={item.link.text}
                      type="underline"
                    >
                      <Link href={item.link.url}>{item.link.text}</Link>
                    </Button>
                  </div>
                )}
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </Container>
  )
}
