import React from 'react'
import Image from 'next/image'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { urlForImage } from '~/lib/sanity.image'
import Button from '~/components/common/Button'
import SectionHeader from './sectionHeader'
import { GridPattern } from '~/components/ui/grid-pattern'
import TickIcon from '~/components/icons/TickIcon'
import Tick from '~/components/icons/Tick'
import TickSolidIcon from '~/components/icons/TickSolidIcon'

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
}

const IntegrationsShowcaseSection: React.FC<IntegrationsGridProps> = ({
  className = '',
  data,
}) => {
  console.log(data)
  // Sort integrations by order field (ascending), with items without order at the end
  // Hook must be called before any early returns
  const sortedIntegrations = React.useMemo(() => {
    const integrations =
      data?.refData?.integrationListing?.integrationList || []
    return [...integrations].sort((a: any, b: any) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
  }, [data])

  // Don't render if no integrations
  if (!data || !sortedIntegrations || sortedIntegrations.length === 0) {
    return null
  }

  // Grid configuration - matching the design
  const leftEmptyCols = 3 // Empty columns on left side
  const rightEmptyCols = 3 // Empty columns on right side
  const centerCols = 8 // Columns for integrations
  const totalCols = leftEmptyCols + centerCols + rightEmptyCols // 14 total
  const emptyRowsTop = 1 // Empty row at top
  const integrationRows = 2 // Rows with icons
  const emptyRowsBottom = 1 // Empty row at bottom
  const totalRows = emptyRowsTop + integrationRows + emptyRowsBottom // 4 total

  // Calculate how many integrations per row
  const integrationsPerRow = Math.ceil(
    sortedIntegrations.length / integrationRows,
  )

  // Build the grid structure
  const getGridCells = () => {
    const cells = []
    let integrationIndex = 0

    for (let row = 0; row < totalRows; row++) {
      // Check if this is an integration row
      const isIntegrationRow =
        row >= emptyRowsTop && row < emptyRowsTop + integrationRows
      const integrationRowIndex = row - emptyRowsTop

      // Get integrations for this row
      const startIdx = integrationRowIndex * integrationsPerRow
      const endIdx = Math.min(
        startIdx + integrationsPerRow,
        sortedIntegrations.length,
      )
      const integrationsInThisRow = isIntegrationRow ? endIdx - startIdx : 0

      // Center integrations within the center columns area
      const centerStartCol = leftEmptyCols
      const centerEndCol = leftEmptyCols + centerCols
      const integrationStartCol = centerStartCol + Math.floor((centerCols - integrationsInThisRow) / 2)
      const integrationEndCol = integrationStartCol + integrationsInThisRow

      for (let col = 0; col < totalCols; col++) {
        const cellKey = `cell-${row}-${col}`

        // Top empty row or bottom empty row - all cells are empty
        if (row < emptyRowsTop || row >= emptyRowsTop + integrationRows) {
          cells.push({ type: 'empty', key: cellKey })
          continue
        }

        // Left empty columns (first 3)
        if (col < leftEmptyCols) {
          cells.push({ type: 'empty', key: cellKey })
          continue
        }

        // Right empty columns (last 3)
        if (col >= totalCols - rightEmptyCols) {
          cells.push({ type: 'empty', key: cellKey })
          continue
        }

        // Integration rows - place icons centered in middle area
        if (
          col >= integrationStartCol &&
          col < integrationEndCol &&
          integrationIndex < sortedIntegrations.length
        ) {
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

  const gridCells = getGridCells()

  return (
    <Section className={`relative overflow-hidden bg-[#030712] ${className}`}>
      <Container
        className="flex-col relative pt-16 md:pt-20 lg:pt-24 "
        type="V2"
        border="y-0"
        darkTheme={true}
      >
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 items-center relative w-full">
          <SectionHeader
            heading={data.refData.integrationListing.title}
            description={data.refData.integrationListing.description}
            isWhite={true}
            className="px-12"
          />

          <div className="relative w-full overflow-hidden">
            {/* Dark vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  'radial-gradient(49.02% 50% at 50% 50%, rgba(3, 7, 18, 0.00) 15%, #030712 100%)',
              }}
            />

            {/* Blur vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-[2] backdrop-blur-[10px]
  [mask-image:radial-gradient(65%_55%_at_50%_50%,transparent_0%,transparent_85%,black_90%,black_100%)]
  [-webkit-mask-image:radial-gradient(65%_55%_at_50%_50%,transparent_0%,transparent_85%,black_90%,black_100%)]"
            />

            {/* Mobile Grid - Vertical layout (below md) */}
            <div className="relative mx-auto flex flex-wrap justify-center gap-2 md:hidden px-4">
              {sortedIntegrations.map((integration: any) => (
                <div
                  key={integration._id}
                  className="flex items-center justify-center group relative transition-all duration-300"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.20)',
                    background: 'rgba(255,255,255,0.10)',
                    width: '60px',
                    height: '60px',
                  }}
                >
                  {integration.image?.url && (
                    <Image
                      src={integration.image.url}
                      alt={integration.title}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Grid - Full layout (md and above) */}
            <div
              className="relative mx-auto hidden md:grid"
              style={{
                gridTemplateColumns: 'repeat(14, 70px)',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              {gridCells.map((cell) => (
                <div
                  key={cell.key}
                  className={`flex items-center justify-center ${
                    cell.type === 'integration'
                      ? 'group relative transition-all duration-300'
                      : ''
                  }`}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.20)',
                    background: 'rgba(255,255,255,0.10)',
                    width: '70px',
                    height: '70px',
                  }}
                >
                  {cell.type === 'integration' && cell.data?.image?.url && (
                    <Image
                      src={cell.data.image.url}
                      alt={cell.data.title}
                      width={70}
                      height={70}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                                  {/* Tooltip */}
                <div className="absolute bg-[#efeeea] bottom-[-20px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                  <p className="font-['Geist',_sans-serif] font-normal text-xs text-[#52525c]">
                    {cell.data?.title}
                  </p>
                </div>
                </div>
              ))}
            </div>
            
            {data?.items && data.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {data.items.map((item: any) => (
                  <div
                    key={item._key || item._id}
                    className="flex flex-col gap-2 relative z-10 p-6 md:p-12 border-t border-r border-gray-800 last:border-r-0"
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
