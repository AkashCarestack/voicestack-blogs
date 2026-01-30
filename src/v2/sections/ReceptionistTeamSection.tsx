import React from 'react'
import Image from 'next/image'
import { urlForImage } from '~/lib/sanity.image'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import { PortableText, PortableTextReactComponents } from '@portabletext/react'
import Slider from 'react-slick'
import { cn } from '~/lib/utils'

// Import slick carousel css
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface ReceptionistItem {
    _key: string
    heading?: string // The name (Cleo, Sam, Sarah)
    subheading?: string // The badge text
    description?: string // The heading below image
    image?: any
    content?: any // Portable text for the list items
}

interface ReceptionistTeamSectionProps {
    data: {
        heading?: string
        sectionHeadingDynamic?: any
        description?: string
        ctaListItems?: any[]
        items?: ReceptionistItem[]
        customListingItems?: any[] // Support both for flexibility
    }
}

const TickIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const ArrowIcon = ({ className, direction = 'right' }: { className?: string; direction?: 'left' | 'right' }) => (
    <svg
        width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        className={cn(className, direction === 'left' ? 'rotate-180' : '')}
    >
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const NextArrow = (props: any) => {
    const { onClick } = props
    return (
        <button
            onClick={onClick}
            className="absolute -right-2 md:-right-6 top-[40%] -translate-y-1/2 z-50 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 transition-all hover:bg-gray-50 hover:border-vs-purple text-gray-400 hover:text-vs-purple"
            aria-label="Next slide"
        >
            <ArrowIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>
    )
}

const PrevArrow = (props: any) => {
    const { onClick } = props
    return (
        <button
            onClick={onClick}
            className="absolute -left-2 md:-left-6 top-[40%] -translate-y-1/2 z-50 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 transition-all hover:bg-gray-50 hover:border-vs-purple text-gray-400 hover:text-vs-purple"
            aria-label="Previous slide"
        >
            <ArrowIcon direction="left" className="w-5 h-5 md:w-6 md:h-6" />
        </button>
    )
}

const portableTextComponents: Partial<PortableTextReactComponents> = {
    list: {
        bullet: ({ children }) => <ul className="space-y-3 w-full">{children}</ul>,
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="flex gap-3 items-start">
                <div className="mt-1 shrink-0">
                    <TickIcon />
                </div>
                <span className="text-sm md:text-base text-gray-500 font-normal leading-relaxed">{children}</span>
            </li>
        ),
    },
    marks: {
        // Highlight strong and underline with vs-purple
        strong: ({ children }) => <strong className="font-semibold text-vs-purple">{children}</strong>,
        underline: ({ children }) => <span className="text-vs-purple underline underline-offset-4 decoration-vs-purple/30">{children}</span>,
        highlight: ({ children }) => <span className="text-vs-purple font-medium">{children}</span>,
    }
}

export default function ReceptionistTeamSection({ data }: ReceptionistTeamSectionProps) {
    if (!data) return null

    // Support both direct items and groups from customListingItems
    const displayItems: any[] = []

    if (data.items) {
        displayItems.push(...data.items)
    } else if (data.customListingItems) {
        data.customListingItems.forEach((group: any) => {
            // If the group has listItems, each listItem is a card
            if (group.listItems && group.listItems.length > 0) {
                group.listItems.forEach((item: any) => {
                    displayItems.push({
                        ...item,
                        // Data Mapping:
                        // Group level 'heading' matches the badge (Front Desk Assistant)
                        badge: group.heading || group.subheading,
                        // Pull SVG code from item or group
                        svgCode: item.dynamicSvgCode || group.listIconSvgCode,
                        // ListItem 'itemHeading' matches the Name (Cleo, Sam, Sarah)
                        name: item.itemHeading,
                        // ListItem 'subTitle' matches the bold heading ("I can handle...")
                        boldHeader: item.subTitle || group.description,
                        // Use item.image if available, fallback to group.image
                        cardImage: item.image || group.image
                    })
                })
            } else {
                // Fallback for flat structure
                displayItems.push(group)
            }
        })
    }

    const sectionHeading = data.heading || data.sectionHeadingDynamic

    // Slider settings for 3 items with arrows and no dots
    const settings = {
        dots: false,
        infinite: displayItems.length > 3,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: true
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true
                }
            }
        ]
    }

    return (
        <Section className="bg-white" border="none">
            <Container type="V2" className="py-16 md:py-24 relative px-12 md:px-0">
                <SectionHeaderV2
                    heading={sectionHeading}
                    description={data.description || ''}
                    ctaListItems={data.ctaListItems}
                    demoButton={true}
                    className="mb-16 md:px-12"
                />

                <div className="receptionist-slider-wrapper">
                    <Slider {...settings}>
                        {displayItems.map((item: any, index: number) => {
                            // Fix: Check for .url property first, as Sanity images might be already dereferenced in the query
                            const getImageUrl = (img: any) => {
                                if (!img) return null
                                return img.url || urlForImage(img)
                            }

                            const imageUrl = getImageUrl(item.cardImage) || getImageUrl(item.image)
                            const name = item.name || item.itemHeading || item.heading
                            const badge = item.badge || item.subheading
                            const cardHeader = item.boldHeader || item.subTitle || item.description

                            return (
                                <div key={item._key || index} className="px-4 h-full outline-none">
                                    <div className="flex flex-col group h-full">
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-8 bg-[#FDF7F2]">
                                            {/* Background Name */}
                                            {name && (
                                                <div className="absolute inset-0 flex items-start justify-center pt-12 pointer-events-none opacity-[0.08]">
                                                    <span className="text-[120px] font-bold text-gray-900 select-none uppercase tracking-tight">
                                                        {name}
                                                    </span>
                                                </div>
                                            )}

                                            {imageUrl && (
                                                <Image
                                                    src={imageUrl}
                                                    alt={name || 'AI Receptionist'}
                                                    fill
                                                    className="object-cover object-center z-10"
                                                />
                                            )}

                                            {/* Badge */}
                                            {badge && (
                                                <div
                                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 bg-white flex items-center justify-center gap-1 shadow-sm whitespace-nowrap"
                                                    style={{
                                                        padding: '10px 32px 2px 32px',
                                                        borderRadius: '20px 20px 0 0',
                                                    }}
                                                >
                                                    <Image
                                                        src="https://cdn.sanity.io/images/76tr0pyh/develop/7a6fb5c3f544aa8b254691ee7d7537a586e7971a-19x18.png"
                                                        width={19}
                                                        height={18}
                                                        alt="Icon"
                                                        className="w-[19px] h-[18px]"
                                                    />
                                                    <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{badge}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="px-2 pb-8">
                                            {cardHeader && (
                                                <h3
                                                    className="text-xl md:text-2xl font-semibold mb-6 leading-tight text-gray-950 [&>span]:text-vs-purple [&>strong]:text-vs-purple [&>strong]:font-semibold"
                                                    dangerouslySetInnerHTML={{
                                                        __html: cardHeader.replace(/"/g, '&quot;')
                                                    }}
                                                />
                                            )}

                                            {item.content && (
                                                <PortableText value={item.content} components={portableTextComponents} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Slider>
                </div>
            </Container>
            <style jsx global>{`
        .receptionist-slider-wrapper .slick-track {
          display: flex !important;
        }
        .receptionist-slider-wrapper .slick-slide {
          height: inherit !important;
        }
        .receptionist-slider-wrapper .slick-slide > div {
          height: 100%;
        }
        .receptionist-slider-wrapper .slick-list {
          overflow: hidden;
          margin: 0 -16px;
        }
        .receptionist-slider-wrapper .slick-slider {
          position: relative;
        }
      `}</style>
        </Section>
    )
}
