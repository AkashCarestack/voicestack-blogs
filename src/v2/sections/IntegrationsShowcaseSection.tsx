import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/router'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'

import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { urlForImage } from '~/lib/sanity.image'
import Button from '~/components/common/Button'
import { cn } from '~/lib/utils'
import ImageLoader from '~/components/common/imageLoader/imageLoader'

interface Integration {
  _id: string
  title: string
  headline?: string
  description?: any
  shortDescription?: string
  image?: {
    asset?: {
      _id: string
      url: string
      altText?: string
    }
  }
  link?: string
  order?: number
  language?: string
  integrationCategory?: {
    _id: string
    name: string
    subheading?: string
    description?: string
    mainImage?: any
    icon?: any
    iconSvgCode?: string
  }
}

interface IntegrationsGridProps {
  className?: string
  data: any
  theme?: 'light' | 'dark'
  sectionBorder?: 't' | 'b' | 'y'
  demoOnly?: boolean
}

const IntegrationsShowcaseSection: React.FC<IntegrationsGridProps> = ({
  className = '',
  data,
  theme,
  sectionBorder = 'b',
  demoOnly = false,
}) => {
  const router = useRouter()
  const locale = router.locale || 'en'
  const isIntegrationsPage = (router.asPath ?? '').endsWith('/integrations')

  // Default CTA items for the section - use dental-phones for en-AU, phone-system for others
  const defaultCtaListItems = React.useMemo(() => [
    {
      ctaText: 'See All Integrations',
      ctaLink: (locale === 'en-AU' || locale === 'en-GB') ? '/dental-phones/integrations' : '/phone-system/integrations',
      ctaType: 'secondaryWhite',
    },
    {
      ctaText: 'Book Free Demo',
      ctaLink: '/demo',
      ctaType: 'primary',
    },
  ], [locale])

  // On the integrations page, hide "See All Integrations" button
  const ctaListItems = React.useMemo(() => {
    if (demoOnly) {
      return [{ ctaText: 'Book Free Demo', ctaLink: '/demo', ctaType: 'primary' as const }]
    }
    if (isIntegrationsPage) {
      return defaultCtaListItems.filter((cta) => cta.ctaText !== 'See All Integrations')
    }
    return defaultCtaListItems
  }, [demoOnly, isIntegrationsPage, defaultCtaListItems])
  
  // Use CTA items from data or fall back to defaults

  const sortedIntegrations = React.useMemo(() => {
    const integrations =
      data?.refData?.integrationListing?.integrationList || []
    const sorted = [...integrations].sort((a: any, b: any) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
    return sorted.filter((item: any) => item?.colorImage?.url)
  }, [data])

  // Don't render if no integrations
  if (!data || !sortedIntegrations || sortedIntegrations.length === 0) {
    return null
  }

  // Grid configuration - dynamically sized based on integration count
  const emptyRowsTop = 1 // Empty row at top
  // Dynamic rows: 1 row if < 8 integrations, 2 rows if >= 8
  const integrationRows = sortedIntegrations.length < 8 ? 1 : 2
  const emptyRowsBottom = 1 // Empty row at bottom
  const totalRows = emptyRowsTop + integrationRows + emptyRowsBottom

  // Calculate how many integrations per row based on total integrations
  const integrationsPerRow = Math.ceil(
    sortedIntegrations.length / integrationRows,
  )
  const centerCols = integrationsPerRow

  // Filler columns on left/right so grid extends to section max width (~1372px / 78px ≈ 18 per side; use 24 to be safe)
  const sideFillerCols = 24
  const totalSideCells = sideFillerCols * totalRows

  const emptyCellStyle = {
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.20)',
    background: 'rgba(255,255,255,0.10)',
    width: '70px',
    height: '70px',
  }

  // Build left filler cells (same style as empty grid cells)
  const leftFillerCells = Array.from({ length: totalSideCells }, (_, i) => (
    <div key={`left-${i}`} style={emptyCellStyle} className="flex items-center justify-center shrink-0" />
  ))

  // Build right filler cells
  const rightFillerCells = Array.from({ length: totalSideCells }, (_, i) => (
    <div key={`right-${i}`} style={emptyCellStyle} className="flex items-center justify-center shrink-0" />
  ))

  // Build the center grid structure (integrations only, with empty rows top/bottom)
  const getCenterGridCells = () => {
    const cells = []
    let integrationIndex = 0

    for (let row = 0; row < totalRows; row++) {
      const isIntegrationRow =
        row >= emptyRowsTop && row < emptyRowsTop + integrationRows

      for (let col = 0; col < centerCols; col++) {
        const cellKey = `center-${row}-${col}`

        if (row < emptyRowsTop || row >= emptyRowsTop + integrationRows) {
          cells.push({ type: 'empty', key: cellKey })
          continue
        }

        if (integrationIndex < sortedIntegrations.length) {
          cells.push({
            type: 'integration',
            data: sortedIntegrations[integrationIndex],
            key: sortedIntegrations[integrationIndex]._id,
          })
          integrationIndex++
        } else {
          cells.push({ type: 'empty', key: cellKey })
        }
      }
    }
    return cells
  }

  const gridCells = getCenterGridCells()
  const isDark = theme === 'dark'
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200'
  const bgColor = isDark ? 'bg-gray-950' : 'bg-white'
  const textColor = isDark ? 'text-white' : 'text-gray-950'
  const heading = data?.refData?.integrationListing?.title
  const description = data?.refData?.integrationListing?.description
  // console.log(data, 'data integrations section')
  return (
    <Section className={`relative overflow-hidden bg-[#030712] ${className}`} border={sectionBorder} isDark={isDark}>
      <Container
        className="flex-col relative pt-16 md:pt-20 lg:pt-24 "
        type="V2"
        border="y-0"
        darkTheme={isDark}
      >
        <div className="flex flex-col gap-8 items-center relative w-full">
          <SectionHeaderV2
            heading={data?.heading || heading}
            description={data?.description || description || 'VoiceStack seamlessly integrates with leading PMS, CRM, and analytics platforms, giving you effortless visibility across your operations.'}
            isWhite={true}
            ctaListItems={ctaListItems}
            className="md:px-6 xl:px-12 px-4"
          />

          <div className="relative w-full overflow-hidden">
            {/* Dark vignette */}
            <div
              className="hidden md:block pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  'radial-gradient(69.02% 70% at 50% 50%, rgba(3, 7, 18, 0.00) 15%, #030712 100%)',
              }}
            />

            {/* Left dark gradient */}
            <div
              className="hidden md:block pointer-events-none absolute inset-y-0 left-0 w-[30%] z-[1]"
              style={{
                background:
                  'linear-gradient(to right, #030712 0%, rgba(3, 7, 18, 0) 100%)',
              }}
            />

            {/* Right dark gradient */}
            <div
              className="hidden md:block pointer-events-none absolute inset-y-0 right-0 w-[30%] z-[1]"
              style={{
                background:
                  'linear-gradient(to left, #030712 0%, rgba(3, 7, 18, 0) 100%)',
              }}
            />

            {/* Blur vignette - radial for sides */}
            <div
              className="hidden md:block pointer-events-none absolute inset-0 z-[2] backdrop-blur-[10px]
  [mask-image:radial-gradient(55%_55%_at_50%_50%,transparent_0%,transparent_85%,black_90%,black_100%)]
  [-webkit-mask-image:radial-gradient(65%_55%_at_50%_50%,transparent_0%,transparent_85%,black_90%,black_100%)]"
            />

            {/* Bottom blur vignette */}
            {data?.items && data?.items?.length > 0 && (
              <div
                className="hidden md:block pointer-events-none absolute inset-0 z-[2] backdrop-blur-[10px]
  [mask-image:linear-gradient(to_top,black_10%,black_40%,transparent_60%,transparent_70%)]
  [-webkit-mask-image:linear-gradient(to_top,black_10%,black_40%,transparent_60%,transparent_70%)]"
              />
            )}

            {/* Mobile Grid - Vertical layout (below md) */}
            <div className="relative mx-auto flex flex-wrap justify-center gap-2 md:hidden px-4 pb-6">
              {sortedIntegrations.map((integration: any) => (
                <div
                  key={integration._id}
                  className="flex items-center justify-center group relative transition-all duration-300 overflow-hidden"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.20)',
                    background: 'rgba(255,255,255,0.10)',
                    width: '50px',
                    height: '50px',
                  }}
                >
                  {integration.colorImage?.url && (
                    <Image
                      src={integration.colorImage.url}
                      alt={integration.title}
                      width={50}
                      height={50}
                      className="w-full h-full object-contain rounded-[8px]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Grid - Full width: left grid | center integrations | right grid (md and above) */}
            <div className="relative w-full hidden md:flex items-start overflow-hidden gap-2">
              {/* Top gradient overlay */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[80px] z-[3]"
                style={{
                  background:
                    'linear-gradient(to bottom, #030712 0%, rgba(3, 7, 18, 0) 100%)',
                }}
              />
              {/* Bottom gradient overlay */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[80px] z-[3]"
                style={{
                  background:
                    'linear-gradient(to top, #030712 0%, rgba(3, 7, 18, 0) 100%)',
                }}
              />

              {/* Left grid - extends to section left edge */}
              <div className="flex-1 min-w-0 overflow-hidden flex justify-end">
                <div
                  className="grid shrink-0"
                  style={{
                    gridTemplateColumns: `repeat(${sideFillerCols}, 70px)`,
                    gridTemplateRows: `repeat(${totalRows}, 70px)`,
                    gap: '8px',
                  }}
                >
                  {leftFillerCells}
                </div>
              </div>

              {/* Center - integration icons */}
              <div
                className="grid shrink-0"
                style={{
                  gridTemplateColumns: `repeat(${centerCols}, 70px)`,
                  gridTemplateRows: `repeat(${totalRows}, 70px)`,
                  gap: '8px',
                }}
              >
                {gridCells.map((cell) => (
                  <div
                    key={cell.key}
                    className={`flex items-center justify-center ${cell.type === 'integration'
                        ? 'group relative transition-all duration-300'
                        : ''
                      }`}
                    style={emptyCellStyle}
                  >
                    {cell.type === 'integration' && cell.data?.colorImage?.url && (
                      <>
                        <Image
                          src={cell.data.colorImage.url}
                          alt={cell.data.title}
                          width={70}
                          height={70}
                          className="w-full h-full object-contain rounded-[8px]"
                        />
                        <div className="absolute bg-[#efeeea] bottom-0 px-2 py-1 rounded-sm align-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                          <p className="font-['Geist',_sans-serif] font-normal text-xs text-[#52525c] text-center">
                            {cell.data.title}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Right grid - extends to section right edge */}
              <div className="flex-1 min-w-0 overflow-hidden flex justify-start">
                <div
                  className="grid shrink-0"
                  style={{
                    gridTemplateColumns: `repeat(${sideFillerCols}, 70px)`,
                    gridTemplateRows: `repeat(${totalRows}, 70px)`,
                    gap: '8px',
                  }}
                >
                  {rightFillerCells}
                </div>
              </div>
            </div>

            {data?.items && data.items.length > 0 && (
              <div className="flex flex-col md:flex-row flex-wrap w-full pt-4 lg:pt-0">
                {data.items.map((item: any) => (
                  <div
                    key={item._key || item._id}
                    className="flex flex-col flex-1 gap-3 relative z-10 p-6 md:p-12 border-t md:border-r border-gray-800 md:last:border-r-0 lg:min-w-0 md:min-w-[50%]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.3631 3.32223C13.4259 3.36993 13.4787 3.42956 13.5185 3.49769C13.5582 3.56583 13.5842 3.64114 13.5948 3.71931C13.6054 3.79748 13.6005 3.87698 13.5804 3.95325C13.5603 4.02953 13.5253 4.10109 13.4775 4.16383L7.07747 12.5638C7.02556 12.6319 6.95969 12.688 6.88429 12.7285C6.80889 12.769 6.72569 12.7929 6.6403 12.7986C6.5549 12.8042 6.46928 12.7916 6.38918 12.7615C6.30907 12.7313 6.23635 12.6844 6.17587 12.6238L2.57587 9.02383C2.46989 8.91009 2.41219 8.75965 2.41493 8.60421C2.41768 8.44877 2.48065 8.30046 2.59058 8.19053C2.70051 8.0806 2.84882 8.01763 3.00426 8.01489C3.1597 8.01215 3.31013 8.06985 3.42387 8.17583L6.53907 11.2902L12.5231 3.43663C12.6194 3.31019 12.7619 3.22713 12.9194 3.20569C13.0769 3.18424 13.2365 3.22615 13.3631 3.32223Z"
                        fill="#42BA78"
                      />
                    </svg>
                    <p className="text-gray-300 text-sm md:text-base leading-[150%] tracking-normal">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default IntegrationsShowcaseSection
