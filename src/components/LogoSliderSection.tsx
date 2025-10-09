import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import Slider from 'react-slick' // Commented out - using custom CSS slider

import Container from './structure/Container'
import Section from './structure/Section'
import Slider from 'react-slick'

const LogoSliderSection = ({ data, refer = null }) => {
  const [isUk, setIsUk] = useState(false)
  const router = useRouter()

  // Commented out react-slick settings - using custom CSS slider
  const [settings] = useState({
    dots: false,
    infinite: true,
    speed: 1500, // higher = slower scroll
    slidesToShow: 8,
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
  });

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])

  return (
    <Section className="py-sm md:py-md bg-[#F9F9F9]">
      {/* <Container> */}
        <div className="flex flex-col items-center w-full">
          {/* Custom CSS Infinite Slider for Logos */}
          {data?.image && data.image?.length > 0 && (
            <div className="w-full overflow-hidden">
              {/* <Slider {...settings}>
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
              </Slider> */}
              <div className="logo-slider">
                <div className="logo-slider-track gap-16">
                  {/* First set of logos */}
                  {data.image.map((logo: any, i) => (
                    <div key={`first-${logo?._id}-${i}`} className="logo-slide">
                      <div className="flex justify-center items-center px-4">
                        <Image
                          src={logo.url}
                          alt={logo.altText || 'organization Logo'}
                          title={logo.altText}
                          width={logo?.metadata?.dimensions?.width}
                          height={logo?.metadata?.dimensions?.height}
                          className={`h-[52px] w-auto filter grayscale hover:filter-none transition-opacity duration-300`}
                        />
                      </div>
                    </div>
                  ))}
                  {/* Second set of logos for seamless loop */}
                  {data.image.map((logo: any, i) => (
                    <div key={`second-${logo?._id}-${i}`} className="logo-slide">
                      <div className="flex justify-center items-center px-4">
                        <Image
                          src={logo.url}
                          alt={logo.altText || 'organization Logo'}
                          title={logo.altText}
                          width={logo?.metadata?.dimensions?.width}
                          height={logo?.metadata?.dimensions?.height}
                          className={`h-[52px] w-auto filter grayscale hover:filter-none transition-opacity duration-300`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      {/* </Container> */}
      
      {/* Custom CSS for infinite slider */}
      <style jsx>{`
        .logo-slider {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .logo-slider-track {
          display: flex;
          animation: scroll 35s linear infinite;
          width: fit-content;
        }
        
        .logo-slide {
          flex-shrink: 0;
          min-width: 120px; /* Adjust based on your logo sizes */
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .logo-slide {
            min-width: 150px;
          }
        }
        
        @media (max-width: 768px) {
          .logo-slide {
            min-width: 200px;
          }
        }
        
        @media (max-width: 480px) {
          .logo-slide {
            min-width: 250px;
          }
        }
        
        /* Pause animation on hover */
        .logo-slider:hover .logo-slider-track {
          animation-play-state: paused;
        }
      `}</style>
    </Section>
  )
}

export default LogoSliderSection
