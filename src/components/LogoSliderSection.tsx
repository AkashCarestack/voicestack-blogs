import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'

import Container from './structure/Container'
import Section from './structure/Section'

const LogoSliderSection = ({ data, refer = null }) => {
  const [isUk, setIsUk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])

  return (
    <Section className="py-sm md:py-md bg-[#F9F9F9]">
      <Container>
        <div className="flex flex-col items-center w-full">
          {/* Carousel Version of Logos */}
          {data?.image && data.image?.length > 0 && (
            <div className="w-full max-w-[1200px]">
              <Slider
                {...{
                  dots: false,
    infinite: true,
    speed: 2000, // higher = slower scroll
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false, // prevent pause
    draggable: false,    // prevents drag "jerk"
    variableWidth: false, // helps with smooth flow
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 }
      }
    ]
                }}
              >
                {[...data.image,...data.image,...data.image].map((logo: any, i) => (
                  <div key={logo?._id} className="px-4">
                    <div className="flex justify-center items-center">
                      <Image
                        src={logo.url}
                        alt={logo.altText || 'organization Logo'}
                        title={logo.altText}
                        width={logo?.metadata?.dimensions?.width}
                        height={logo?.metadata?.dimensions?.height}
                        className={`${isUk ? 'h-[52px]' : 'h-10'} w-auto opacity-70 hover:opacity-100 transition-opacity duration-300`}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

export default LogoSliderSection
