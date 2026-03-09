import Image from 'next/image'
import React, { useMemo } from 'react'
import Container from '../../components/structure/Container'
import Section from '../../components/structure/Section'
// import OverlappingStars from '../assets/overlapping-stars.png'

interface LogoListingV2Props {
  data: any;
}

// Logo height constant
const LOGO_HEIGHT = 134

const LogoListingV2 = ({ data }: LogoListingV2Props) => {
  // Divide logos into 4 columns
  const logoColumns = useMemo(() => {
    if (!data?.image || data.image.length === 0) return [[], [], [], []]
    
    const logos = data.image
    const columns: typeof logos[] = [[], [], [], []]
    
    // Distribute logos evenly across 4 columns
    logos.forEach((logo, index) => {
      columns[index % 4].push(logo)
    })
    
    return columns
  }, [data?.image])

  // Calculate animation duration based on number of logos
  // Each logo shows for 2.5 seconds, scroll transition is 0.5s
  // Total per logo: 3 seconds
  const getAnimationDuration = (logoCount: number) => {
    if (logoCount === 0) return 0
    return logoCount * 5 // 5 seconds per logo (4.5s pause + 0.5s scroll)
  }

  // Generate keyframes for scrolling with pauses
  const generateKeyframes = (logoCount: number) => {
    if (logoCount === 0) return ''
    
    const keyframes: string[] = []
    const pauseRatio = 0.8 // 4.5s out of 5s = 90%
    const scrollRatio = 0.1 // 0.5s out of 5s = 10%
    
    // Always start at 0% with first logo at top
    keyframes.push(`0% { transform: translateY(0px); }`)
    
    for (let i = 0; i < logoCount; i++) {
      const logoStartPercent = (i * 100) / logoCount
      const pauseEndPercent = logoStartPercent + (pauseRatio * 100 / logoCount)
      const scrollEndPercent = ((i + 1) * 100) / logoCount
      const currentY = -i * LOGO_HEIGHT // Current logo position
      const nextY = -(i + 1) * LOGO_HEIGHT // Next logo position
      
      // For first logo, we already set 0%, so skip the start
      if (i > 0) {
        keyframes.push(`${logoStartPercent.toFixed(2)}% { transform: translateY(${currentY}px); }`)
      }
      // End pause (start scroll)
      keyframes.push(`${pauseEndPercent.toFixed(2)}% { transform: translateY(${currentY}px); }`)
      // End scroll (start next pause)
      if (i < logoCount - 1) {
        keyframes.push(`${scrollEndPercent.toFixed(2)}% { transform: translateY(${nextY}px); }`)
      }
    }
    
    // Ensure we end at the right position for seamless loop
    keyframes.push(`100% { transform: translateY(-${logoCount * LOGO_HEIGHT}px); }`)
    
    return keyframes.join('\n          ')
  }

  // Generate logo elements for a column (duplicated for seamless loop)
  const renderLogoColumn = (logos: typeof logoColumns[0], columnIndex: number) => {
    if (logos.length === 0) return null
    
    return (
      <>
        {/* First set of logos */}
        {logos.map((logo, i) => (
          <div 
            key={`col-${columnIndex}-first-${logo?._id || i}`} 
            className="logo-column-item"
            style={{ height: `${LOGO_HEIGHT}px` }}
          >
            <div className="flex justify-center items-center w-full h-full px-3">
              <Image
                src={logo.url}
                alt={logo.altText || 'organization Logo'}
                title={logo.altText}
                width={logo?.metadata?.dimensions?.width}
                height={logo?.metadata?.dimensions?.height}
                className="md:h-10 max-h-[60px] h-auto max-w-full w-auto grayscale opacity-60"
              />
            </div>
          </div>
        ))}
        {/* Second set for seamless loop */}
        {logos.map((logo, i) => (
          <div 
            key={`col-${columnIndex}-second-${logo?._id || i}`} 
            className="logo-column-item"
            style={{ height: `${LOGO_HEIGHT}px` }}
          >
            <div className="flex justify-center items-center w-full h-full px-3">
              <Image
                src={logo.url}
                alt={logo.altText || 'organization Logo'}
                title={logo.altText}
                width={logo?.metadata?.dimensions?.width}
                height={logo?.metadata?.dimensions?.height}
                className="md:h-10 max-h-[60px] h-auto max-w-full w-auto grayscale opacity-60"
              />
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <Section className="bg-white" border="b">
      <Container type="V2" border="y-0" className="w-full">
        <div className="flex flex-wrap gap-px bg-white w-full items-center ">
          {/* Heading Section */}
          <div className="bg-white flex flex-col gap-1.5 items-start px-6 xl:pl-12 py-6 md:flex-1 flex-auto md:border-r border-gray-200 md:w-auto w-full md:border-b-0 border-b">
            <div className="h-6 w-[30px] flex items-center">
              {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FBBF24" className="w-[30px] h-6">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg> */}
              <Image src={'/assets/overlapping-stars.png'} alt="Overlapping Stars" width={30} height={24} />
            </div>
            <div className="flex flex-col font-medium md:text-lg text-base leading-[155%] text-zinc-950">
              <p 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: data?.logoSectionHeader || '' }}
              />
                {/* {`Trusted by `}
                <br aria-hidden="true" />
                {`3000+ Dental Practices `} */}
            </div>
          </div>

          {/* Logo Columns */}
          {logoColumns.map((columnLogos, columnIndex) => (
            <div
              key={`column-${columnIndex}`}
              className={`bg-white flex-1 max-w-[237px] overflow-hidden relative border-r border-gray-200 last:border-r-0 ${
                columnIndex === 3 ? 'hidden md:block' : ''
              }`}
              style={{
                height: `${LOGO_HEIGHT}px`,
              }}
            >
              {/* Scrolling Logo Column */}
              <div
                className={`logo-column-track logo-column-${columnIndex}`}
                style={{
                  animationDelay: `${columnIndex * 0.8}s`,
                  animationDuration: `${getAnimationDuration(columnLogos.length)}s`,
                }}
              >
                {renderLogoColumn(columnLogos, columnIndex)}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Custom CSS for scrolling animation with pauses */}
      <style jsx>{`
        .logo-column-track {
          display: flex;
          flex-direction: column;
          will-change: transform;
          transform: translateY(0);
        }

        .logo-column-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        
        ${logoColumns.map((columnLogos, columnIndex) => {
          if (columnLogos.length === 0) return ''
          const keyframes = generateKeyframes(columnLogos.length)
          return `
        @keyframes scrollUpColumn${columnIndex} {
          ${keyframes}
        }
        
        .logo-column-${columnIndex} {
          animation: scrollUpColumn${columnIndex} linear infinite;
        }`
        }).join('')}
        
        /* Ensure smooth rendering */
        .logo-column-item img {
          max-width: none;
          height: auto;
          display: block;
        }

        /* Force hardware acceleration */
        .logo-column-track {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        /* Pause animation on hover */
        // .logo-column-track:hover {
        //   animation-play-state: paused;
        // }
      `}</style>
    </Section>
  )
}

export default LogoListingV2

