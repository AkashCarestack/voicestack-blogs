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

const PrevArrow = ({ onClick, currentSlide }: any) => {
    const isDisabled = currentSlide === 0

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`w-8 h-8 sm:w-12 sm:h-12 xl:w-16 xl:h-16 bg-white  border border-gray-200 flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-[-30px] xl:left-[-25px] z-10
        ${isDisabled ? ' cursor-not-allowed' : ' bg-white hover:bg-gray-100 transition-colors'}`}
            aria-label="Previous"
        >
            <svg className={`${isDisabled ? 'opacity-50' : 'opacity-100'}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.8333 10H4.16658" stroke="#030712" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 4.16699L4.16667 10.0003L10 15.8337" stroke="#030712" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

const NextArrow = ({ onClick, currentSlide, slideCount }: any) => {
    const isDisabled = currentSlide >= slideCount - 3

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`w-8 h-8 sm:w-12 sm:h-12 xl:w-16 xl:h-16 bg-white flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-[-35px] xl:right-[-30px] z-10 border border-gray-200
        ${isDisabled ? ' cursor-not-allowed ' : 'bg-white hover:bg-gray-100 transition-colors'}`}
            aria-label="Next"
        >
            <svg className={`${isDisabled ? 'opacity-50' : 'opacity-100'}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.16675 10H15.8334" stroke="#030712" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 4.16699L15.8333 10.0003L10 15.8337" stroke="#030712" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

const portableTextComponents: Partial<PortableTextReactComponents> = {
    block: {
        normal: ({ children }) => (
            <p className="text-xl font-geist font-medium leading-7 tracking-normal text-gray-950 mb-6 [&>span]:text-vs-purple [&>strong]:text-vs-purple [&>strong]:font-semibold">
                {children}
            </p>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="space-y-3 w-full">{children}</ul>,
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="flex gap-3 items-start">
                <div className="mt-1 shrink-0">
                    <TickIcon />
                </div>
                <span className="text-base text-gray-700 font-geist font-normal leading-6 tracking-normal">{children}</span>
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
            <Container type="V2" className=" md:py-[66px] relative  md:px-0" border="t-0" >
                <SectionHeaderV2
                    heading={sectionHeading}
                    description={data.description || ''}
                    ctaListItems={data.ctaListItems}
                    demoButton={true}
                    className="mb-16 md:px-12"
                />

                <div className="receptionist-slider-wrapper ">
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
                                <div key={item._key || index} className="h-full outline-none">
                                    <div className="flex flex-col group h-full  border border-r-0 border-gray-200 slick-item-inner">
                                        {/* Image Container */}
                                        <div className="relative  overflow-hidden mb-8   md:p-[10px]">
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
                                                    width={500}
                                                    height={500}
                                                    className="object-cover object-center z-10 w-full h-full md:rounded-[12px]"
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

                                                    <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{badge}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="md:px-12 md:py-6 p-6">
                                            {cardHeader && (
                                                <h3
                                                    className="text-xl font-geist font-medium leading-7 tracking-normal text-gray-950 mb-6 [&>span]:text-vs-purple [&>strong]:text-vs-purple [&>strong]:font-semibold"
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
          margin: 0;
        }
        .receptionist-slider-wrapper .slick-slider {
          position: relative;
        }
          .slick-track > .slick-slide.slick-active:nth-child(3n + 1) .slick-item-inner {
           border-left: none !important;
        } 
      `}</style>
        </Section>
    )
}
