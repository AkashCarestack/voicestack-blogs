import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import Anchor from '~/components/common/anchor'
import Container from '~/components/structure/Container'

interface BreadcrumbProps {
  breadCrumb?: any
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  breadCrumb,
  className = '',
}) => {
  const router = useRouter()

  // Parse breadcrumb items from URL or Sanity override
  const breadcrumbItems = useMemo(() => {
    const excludedSegments = ['en', 'en-GB', 'en-AU']
    
    // Remove query parameters and hash from asPath to prevent hydration mismatch
    const pathWithoutQuery = router.asPath.split('?')[0]
    const pathWithoutHash = pathWithoutQuery.split('#')[0]
    const pathSegments = pathWithoutHash
      .split('/')
      .filter((segment) => {
        // Remove query params from individual segments and filter out empty/excluded segments
        const cleanSegment = segment.split('?')[0].split('#')[0]
        return cleanSegment !== '' && !excludedSegments.includes(cleanSegment)
      })
      .map((segment) => segment.split('?')[0].split('#')[0]) // Clean any remaining query params from segments
    // If Sanity override exists, parse it
    if (breadCrumb && breadCrumb.trim()) {
      const overrideLabels = breadCrumb
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')

      // Map override labels to URL segments
      // If we have more labels than segments, use all labels but generate links from segments
      // If we have fewer labels, use URL-based labels for missing ones
      return overrideLabels.map((label, index) => {
        const segment = pathSegments[index]
        const href = segment
          ? `/${pathSegments.slice(0, index + 1).join('/')}`
          : '#'
        
        return {
          label,
          href,
        }
      })
    }

    // Generate breadcrumb from URL
    return pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`
      // Convert hyphenated segments to readable labels
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      return {
        label,
        href,
      }
    })
  }, [router.asPath.split('?')[0].split('#')[0], breadCrumb])

  // Don't render if we're on the home page
  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <Container className={`py-0 ${className}`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .breadcrumb-nav::-webkit-scrollbar {
            height: 4px;
          }
          .breadcrumb-nav::-webkit-scrollbar-track {
            background: transparent;
          }
          .breadcrumb-nav::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
          }
          .breadcrumb-nav::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }
          .breadcrumb-nav {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
          }
        `
      }} />
      <nav aria-label="Breadcrumb" className="breadcrumb-nav flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        {/* Home Icon */}
        <Anchor href="/" className="flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 rounded-[4px] bg-[#4A3CE11A]/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.875 9.99994L9.33667 2.53744C9.70333 2.1716 10.2967 2.1716 10.6625 2.53744L18.125 9.99994M3.75 8.12494V16.5624C3.75 17.0799 4.17 17.4999 4.6875 17.4999H8.125V13.4374C8.125 12.9199 8.545 12.4999 9.0625 12.4999H10.9375C11.455 12.4999 11.875 12.9199 11.875 13.4374V17.4999H15.3125C15.83 17.4999 16.25 17.0799 16.25 16.5624V8.12494M6.875 17.4999H13.75" stroke="#030712" strokeWidth="1.4881" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Anchor>

        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <React.Fragment key={`${item.href}-${index}`}>
              {/* Arrow Separator */}
              {/* <span className="text-black">&gt;</span> */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.21934 5.21934C8.35997 5.07889 8.55059 5 8.74934 5C8.94809 5 9.13871 5.07889 9.27934 5.21934L13.5293 9.46934C13.6698 9.60997 13.7487 9.80059 13.7487 9.99934C13.7487 10.1981 13.6698 10.3887 13.5293 10.5293L9.27934 14.7793C9.13716 14.9118 8.94912 14.9839 8.75482 14.9805C8.56052 14.9771 8.37513 14.8984 8.23772 14.761C8.10031 14.6235 8.02159 14.4382 8.01816 14.2439C8.01474 14.0496 8.08686 13.8615 8.21934 13.7193L11.9393 9.99934L8.21934 6.27934C8.07889 6.13871 8 5.94809 8 5.74934C8 5.55059 8.07889 5.35997 8.21934 5.21934Z" fill="#030712"/>
              </svg>

              {/* Breadcrumb Item */}
              {isLast ? (
                <span className="text-gray-950/60 font-medium text-sm whitespace-nowrap">
                  {item.label}
                </span>
              ) : (
                <Anchor
                  href={item.href}
                  className="text-gray-950 font-normal hover:text-gray-950/60 text-sm whitespace-nowrap"
                >
                  {item.label}
                </Anchor>
              )}
            </React.Fragment>
          )
        })}
      </nav>
    </Container>
  )
}

export default Breadcrumb


