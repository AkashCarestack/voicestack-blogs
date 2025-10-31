import React from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from './sectionHeader'

export default function CardsWithSvg({ data }: { data: any }) {
    return (
        <Section className='py-sm md:py-md lg:py-lg bg-white '>
            <Container className='flex-col'>
                <SectionHeader
                    heading={data.heading}
                    description={data.description}
                />
                <div className='flex md:flex-row flex-col gap-6'>
                    {
                        data.componentData?.items?.map((item: any) => {
                            return (
                                <div key={item._key} className='flex bg-[#F4F3FA] flex-col items-start md:rounded-[24px] rounded-[12px] text-left md:p-6 p-4'>
                                    <div className="w-auto md:mb-6 mb-4 bg-[#E0DDFF] md:px-6 px-4 md:py-3 py-2 rounded-full" dangerouslySetInnerHTML={{ __html: item.dynamicSvg }} />
                                    <h3 className='md:text-lg w-full text-base font-bold leading-[120%] text-gray-950'>{item.heading}</h3>
                                    <p className='leading-[150%] text-gray-700 md:text-base text-sm mt-2'>{item.description}</p>

                                </div>
                            )
                        })
                    }
                </div>

            </Container>

        </Section>
    )
}
