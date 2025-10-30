import React from 'react'
import SectionHeader from './sectionHeader'
import Container from '~/components/structure/Container'
import Image from 'next/image'
import Section from '~/components/structure/Section'
import Link from 'next/link'
import Button from '~/components/common/Button'

interface MasonryCardGridSectionProps {
    data: {
        heading?: string
        description?: string
        ctaListItems?: Array<{
            ctaLink?: string
            ctaText?: string
            ctaType?: string
        }>
        items?: Array<{
            _key: string
            image?: { url: string }
            icon?: { url: string }
            category?: string
            subheading?: string
            description?: string
        }>
    }
}

export default function MasonryCardGridSection({ data }: MasonryCardGridSectionProps) {
    const items = data?.items || []

    return (
        <Section className='py-sm md:py-md lg:py-lg'>
            <Container className='flex-col w-full gap-16'>
                <div className='flex flex-col gap-16 w-full'>
                    <SectionHeader
                        heading={data?.heading}
                        description={data?.description}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-4'>
                        {items.map((item, index) => (
                            <div key={item._key || index} className={`${index === 2 ? 'lg:row-span-2' : 'row-span-1'} ${index === 3 ? 'lg:col-span-2' : 'col-span-1'}`}>
                                <CardItem item={item} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Button className='w-fit' type={'primary'} link={data?.ctaListItems?.[0]?.ctaLink}><span>{data?.ctaListItems?.[0]?.ctaText}</span></Button>
                </div>
            </Container>

        </Section>
    )
}



function CardItem({ item, dimension }: { item: any, dimension?: any }) {
    if (!item) return null

    const { image, icon, subheading, description, link } = item

    return (
        <div
            className='relative h-full w-full rounded-lg overflow-hidden shadow-lg cursor-pointer min-h-[377px]'
            style={{
                backgroundImage: `url(${image?.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >

            <div className='absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-700/70 to-purple-500/30' />
            <div className='relative z-10 p-6 md:gap-7 flex flex-col h-full justify-between'>
                <div className='flex items-center space-x-2 mb-4'>
                    <div className='flex items-center justify-center'>
                        {icon?.url && <Image
                            width={icon?.metadata?.dimensions?.width}
                            height={icon?.metadata?.dimensions?.height}
                            src={icon?.url}
                            alt='Logo'
                            className='w-full h-full md:h-[34px] object-contain'
                        />
                        }
                    </div>
                </div>
                <div className='flex flex-col gap-2 absolute inset-0 p-8 top-auto bg-blur-pattern backdrop-blur-[10px]  mix-blend-darken'>
                    <div >
                        <span className='inline-block leading-[142.857%] bg-vs-blue-purple text-white md:text-sm text-xs font-medium px-2 py-1 rounded-[6px]'>
                            {subheading}
                        </span>
                    </div>
                    <div className='flex-1 flex items-center'>
                        <h3 className='text-white md:text-2xl text-base font-bold font-manrope leading-[133.33%]'>
                            {description}
                        </h3>
                    </div>
                    <Link
                        href={link?.url ?? '/'}
                        className='text-white md:text-base text-sm font-normal leading-6 tracking-normal underline decoration-dotted decoration-[12%] underline-offset-[25%] underline-position-auto'
                        style={{
                            textDecorationSkipInk: 'none',
                            textDecorationThickness: '12%'
                        }}
                    >
                        {link?.text ?? 'Read Story'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
