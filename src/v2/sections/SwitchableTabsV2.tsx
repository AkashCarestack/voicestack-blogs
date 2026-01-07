import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { IdataProps } from '~/components/revamp/components/common/interface/common'
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs'
import GroupedCardsGridSection from './GroupedCardsGridSection'
import GroupedCardsGrid from '../components/GroupedCardsGrid'
import Container from '~/components/structure/Container'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import Image from 'next/image'
import { urlForImage } from '~/lib/sanity.image'
import Section from '~/components/structure/Section'

export default function SwitchableTabsV2({ data, showTabs = true }: { data: any, showTabs?: boolean }) {
  // Get initial tab data - check both tabs array and customListingItems
  const initialTab = data?.tabs?.[0]
  const initialCustomItem = data?.customListingItems?.[0]

  // Get initial items - prioritize customListingItem if it exists
  const initialItems = useMemo(
    () =>
      data?.customListingItems?.[0]?.listItems ||
      data?.customListingItems?.[0]?.items ||
      initialTab?.items ||
      initialTab?.listItems ||
      data?.items ||
      [],
    [data, initialTab],
  )

  const [activeTabValue, setActiveTabValue] = useState<string | undefined>(
    undefined,
  )

  // Helper function to extract text from PortableText content
  const extractTextFromContent = useCallback(
    (content: any[]): { heading: string; description: string } => {
      if (!content || !Array.isArray(content) || content.length === 0) {
        return { heading: '', description: '' }
      }

      let heading = ''
      let description = ''

      // Find heading (first block with strong mark)
      const headingBlockIndex = content.findIndex((block: any) =>
        block.children?.some((child: any) => child.marks?.includes('strong')),
      )

      if (headingBlockIndex >= 0) {
        const headingBlock = content[headingBlockIndex]
        if (headingBlock?.children) {
          heading = headingBlock.children
            .map((child: any) => child.text || '')
            .join('')
            .trim()
        }
      } else if (content[0]?.children) {
        // Fallback: use first block if no strong mark found
        heading = content[0].children
          .map((child: any) => child.text || '')
          .join('')
          .trim()
      }

      // Find description (next block after heading, or first block without strong)
      let descriptionBlock = null
      if (headingBlockIndex >= 0 && headingBlockIndex < content.length - 1) {
        // Use the block after the heading
        descriptionBlock = content[headingBlockIndex + 1]
      } else {
        // Find first block without strong mark
        descriptionBlock =
          content.find(
            (block: any, index: number) =>
              index !== headingBlockIndex &&
              !block.children?.some((child: any) =>
                child.marks?.includes('strong'),
              ),
          ) || content[0]
      }

      if (descriptionBlock?.children) {
        description = descriptionBlock.children
          .map((child: any) => child.text || '')
          .join('')
          .trim()
      }

      return { heading, description }
    },
    [],
  )

  // Map items similar to CategoryFeatureTabsSection logic
  const mapItemsToCardData = useCallback(
    (items: any[]) => {
      if (!items || !Array.isArray(items)) return []

      return items.map((item) => {
        // If item already has the correct structure (heading, description, dynamicSvg), return as-is
        // Note: Items with subfeatureHeading/subfeatureDescription will be processed to normalize field names
        if (
          item.heading &&
          (item.description !== undefined || item.dynamicSvg)
        ) {
          return item
        }

        // Handle PortableText content structure
        let heading = ''
        let description = ''

        if (item.content && Array.isArray(item.content)) {
          const extracted = extractTextFromContent(item.content)
          heading = extracted.heading
          description = extracted.description
        }

        // Get SVG code from item - check multiple possible locations
        const iconSvg =
          item.dynamicSvg ||
          item.dynamicSvgCode || // Add support for dynamicSvgCode
          item.basicInfo?.dynamicSvg ||
          (item.basicInfo?.icon as any)?.iconSvgCode ||
          (item.basicInfo?.icon as any)?.icon ||
          item.featureCategory?.iconSvgCode ||
          item.iconSvgCode ||
          // Default SVG if none provided
          '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8V16L21.3333 18.6667" stroke="#6A7282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.3334 16.0002C29.3334 13.4199 28.5847 10.8951 27.1781 8.73199C25.7716 6.56885 23.7676 4.86028 21.4093 3.81351C19.0509 2.76674 16.4395 2.42674 13.8917 2.83475C11.3439 3.24276 8.96929 4.38124 7.05575 6.11212C5.14221 7.84301 3.772 10.0919 3.11129 12.5861C2.45058 15.0803 2.52777 17.7127 3.33348 20.1639C4.1392 22.6151 5.63883 24.7798 7.6505 26.3956C9.66217 28.0114 12.0995 29.0088 14.6667 29.2668" stroke="#6A7282" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.3334 21.3335L22.0001 28.6668L18.6667 25.3335" stroke="#030712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

        // Get slug from basicInfo or direct slug
        const itemSlug = item.basicInfo?.slug?.current || item.slug?.current

        // Return mapped structure for simpleListingData mode
        return {
          heading:
            heading ||
            item.subfeatureHeading ||
            item.basicInfo?.title ||
            item.title ||
            item.heading ||
            item.itemHeading ||
            'Untitled Item',
          description:
            description ||
            item.subfeatureDescription ||
            item.basicInfo?.description ||
            item.shortDescription ||
            item.heroSubtitle ||
            item.description ||
            '',
          dynamicSvg: iconSvg,
          _key: item._key,
          image: item.image,
          link: item.link,
          slug: itemSlug,
        }
      })
    },
    [extractTextFromContent],
  )

  // Store raw items in state - update when activeTabValue changes
  const [cardData, setCardData] = useState<any[]>(initialItems)

  // Update cardData when activeTabValue is set initially
  useEffect(() => {
    if (activeTabValue && cardData.length === 0 && initialItems.length > 0) {
      setCardData(initialItems)
    }
  }, [activeTabValue, initialItems, cardData.length])

  // Set initial active tab value - prioritize customListingItems _key
  useEffect(() => {
    if (!activeTabValue) {
      if (data?.customListingItems?.[0]?._key) {
        setActiveTabValue(data.customListingItems[0]._key)
      } else if (initialTab?._key) {
        setActiveTabValue(initialTab._key)
      } else if (data?.customListingItems?.[0] || data?.tabs?.[0]) {
        setActiveTabValue('0')
      }
    }
  }, [activeTabValue, initialTab, data])

  const handleCategoryClick = (tab: string) => {
    setActiveTabValue(tab)

    // Find the tab by _key - check both tabs array and customListingItems
    const selectedTab = data?.tabs?.find((e: any) => e?._key === tab)
    const selectedCustomItem = data?.customListingItems?.find(
      (e: any) => e?._key === tab,
    )

    // Get items from the tab or from the customListingItem's listItems
    const selectedItems =
      selectedTab?.items ||
      selectedTab?.listItems ||
      selectedCustomItem?.listItems ||
      selectedCustomItem?.items ||
      []

    setCardData(selectedItems)
  }

  // Memoize mapped card data to avoid unnecessary re-renders and deduplicate
  const mappedCardData = useMemo(() => {
    const mapped = mapItemsToCardData(cardData)
    // Deduplicate by _key to prevent looping/duplicate items
    const seen = new Set()
    const unique = mapped.filter((item: any) => {
      const key = item._key
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
    return unique
  }, [cardData, mapItemsToCardData])

  // Early return checks - must be after all hooks
  if (!data) {
    console.warn('SwitchableTabsV2: No data provided')
    return null
  }

  // Check if we have tabs data
  const hasTabs = data?.tabs && data.tabs.length > 0
  const hasCustomListingItems =
    data?.customListingItems && data.customListingItems.length > 0

  if (!hasTabs && !hasCustomListingItems) {
    console.warn('SwitchableTabsV2: No tabs or customListingItems found')
    return null
  }

  // Get the currently selected tab/customListingItem for image display
  const selectedTab = activeTabValue
    ? data?.tabs?.find((e: any) => e?._key === activeTabValue)
    : null
  const selectedCustomItem = activeTabValue
    ? data?.customListingItems?.find((e: any) => e?._key === activeTabValue)
    : null

  // Get image from selected tab or customListingItem
  const selectedTabImage =
    selectedTab?.image || selectedCustomItem?.image || null
  const imageUrl = selectedTabImage?.url 
  const hasImage = !!imageUrl

  return (
    <Section className='bg-[#ffffff]'>
    <Container type="V2" border="b-0" className='pt-sm md:pt-md lg:pt-lg pb-sm md:pb-md'>
    <div className="flex-col relative w-full flex gap-16">
      <SectionHeaderV2  heading={data?.heading || data?.headline} description={data?.description || data?.subDescription} />
      
        {/* <div className="sticky top-[60px] md:top-[50px] z-[100] w-full bg-transparent overflow-visible justify-center items-center mx-auto px-4 md:px-0"> */}
          {data?.customListingItems && data?.customListingItems?.length > 0 && <SwitchableTabs
            data={data?.customListingItems?.map(
              (category: any, index: number) => ({
                id: category?._key || String(index),
                key: category?._key || String(index),
                title: category?.heading || `Tab ${index + 1}`,
                testimonial: null,
                setActiveTab: handleCategoryClick,
              }),
            )}
            setActiveTab={handleCategoryClick}
            activeTab={activeTabValue}
            isSticky={true}
            className="md:py-8 py-4 bg-transparent !shadow-none !border-none"
            isShowImage={false}
            shadow={false}
          />}
        {/* </div> */}

         {/* ****************
         if referenced from any section else bottom 
         *****************/}
        {
          data?.tabs && data?.tabs?.length > 0 && <SwitchableTabs
            data={data?.tabs?.map(
              (tab: any, index: number) => ({
                id: tab?._key || String(index),
                key: tab?._key || String(index),
                title: tab?.tabHeading || `Tab ${index + 1}`,
              }),
            )}
            setActiveTab={handleCategoryClick}
            activeTab={activeTabValue}
            isSticky={true}
            className="bg-transparent !shadow-none !border-none"
            isShowImage={false}
            shadow={false}
          />
        }
      
      
        {hasImage && imageUrl && (
          <div className="w-auto h-auto ">
            <Image
              src={imageUrl}
              alt={selectedCustomItem?.heading || selectedTab?.tabHeading || data?.heading || 'Tab image'}
              width={1300}
              height={500}
              className=" md:max-w-[1334px] md:max-h-[500px] object-cover rounded-lg"
            />
          </div>
        )}
        {mappedCardData.length > 0 && (
          <GroupedCardsGrid
            customListingItems={mappedCardData}
            theme={'light'}
            simpleListingData={true}
            columnCount={4}
            showBorderBottom={true}
            key={activeTabValue || data?.tabs?.[0]?._key || 'default'}
          />
        )}
        {mappedCardData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No items to display
          </div>
        )}
    </div>
    </Container>
    </Section>
  )
}
