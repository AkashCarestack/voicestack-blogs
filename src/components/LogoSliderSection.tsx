import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useMemo } from 'react'
// import Slider from 'react-slick' // Commented out - using custom CSS slider

import Container from './structure/Container'
import Section from './structure/Section'
// import Slider from 'react-slick' // Commented out - using custom CSS slider

const LogoSliderSection = React.memo(({ data, refer = null }: { data: any, refer?: any }) => {
  const [isUk, setIsUk] = useState(false)
  const router = useRouter()

  // Memoize the logo data to prevent unnecessary re-renders
  const memoizedLogos = useMemo(() => {
    if (!data?.image || data.image.length === 0) return [];
    return data.image;
  }, [data?.image]);

  // Memoize the logo components to prevent re-renders
  const logoElements = useMemo(() => {
    if (memoizedLogos.length === 0) return null;
    
    return (
      <>
        {/* First set of logos */}
        {memoizedLogos.map((logo: any, i) => (
          <div key={`first-${logo?._id}-${i}`} className="logo-slide">
            <div className="flex justify-center items-center px-8">
              <Image
                src={logo.url}
                alt={logo.altText || 'organization Logo'}
                title={logo.altText}
                width={logo?.metadata?.dimensions?.width}
                height={logo?.metadata?.dimensions?.height}
                className={`h-[52px] w-auto filter grayscale hover:filter-none transition-all duration-300`}
                // priority={i < 4} // Prioritize first few images
              />
            </div>
          </div>
        ))}
        {/* Second set of logos for seamless loop */}
        {memoizedLogos.map((logo: any, i) => (
          <div key={`second-${logo?._id}-${i}`} className="logo-slide">
            <div className="flex justify-center items-center px-8">
              <Image
                src={logo.url}
                alt={logo.altText || 'organization Logo'}
                title={logo.altText}
                width={logo?.metadata?.dimensions?.width}
                height={logo?.metadata?.dimensions?.height}
                className={`h-[52px] w-auto filter grayscale hover:filter-none transition-all duration-300`}
              />
            </div>
          </div>
        ))}
      </>
    );
  }, [memoizedLogos]);

  // Commented out react-slick settings - using custom CSS slider
  // const [settings] = useState({
  //   dots: false,
  //   infinite: true,
  //   speed: 1500, // higher = slower scroll
  //   slidesToShow: 8,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 0,
  //   cssEase: "linear",
  //   arrows: false,
  //   pauseOnHover: false, // prevent pause
  //   draggable: false,    // prevents drag "jerk"
  //   variableWidth: false, // helps with smooth flow
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: { slidesToShow: 4 }
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: { slidesToShow: 3 }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: { slidesToShow: 2 }
  //     }
  //   ]
  // });

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])

  return (
    <Section className="py-sm md:py-md bg-[#F9F9F9]">
      {/* <Container> */}
        <div className="flex flex-col items-center w-full">
          {/* Custom CSS Infinite Slider for Logos */}
          {logoElements && (
            <div className="w-full overflow-hidden">
              <div className="logo-slider">
                <div className="logo-slider-track">
                  {logoElements}
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
          mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
          -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
        }
        
        .logo-slider-track {
          display: flex;
          animation: marquee 20s linear infinite;
          width: max-content;
        }
        
        .logo-slide {
          flex-shrink: 0;
          width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2rem;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .logo-slide {
            width: 250px;
            padding: 0 1.5rem;
          }
          .logo-slider-track {
            animation-duration: 25s;
          }
        }
        
        @media (max-width: 768px) {
          .logo-slide {
            width: 300px;
            padding: 0 1rem;
          }
          .logo-slider-track {
            animation-duration: 30s;
          }
        }
        
        @media (max-width: 480px) {
          .logo-slide {
            width: 350px;
            padding: 0 0.5rem;
          }
          .logo-slider-track {
            animation-duration: 35s;
          }
        }
        
        /* Pause animation on hover */
        .logo-slider:hover .logo-slider-track {
          animation-play-state: paused;
        }
        
        /* Ensure smooth rendering */
        .logo-slide img {
          max-width: none;
          height: auto;
          display: block;
        }
        
        /* Force hardware acceleration */
        .logo-slider-track {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
      `}</style>
    </Section>
  )
})

export default LogoSliderSection
