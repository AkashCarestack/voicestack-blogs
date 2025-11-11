import { Butcherman } from 'next/font/google'
import React from 'react'
import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { urlForImage } from '~/lib/sanity.image'

export default function SingleCardWithList({ data }: { data: any }) {
    const TickIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3623 3.32248C13.4251 3.37018 13.4779 3.4298 13.5177 3.49794C13.5575 3.56607 13.5834 3.64138 13.594 3.71955C13.6047 3.79772 13.5998 3.87722 13.5796 3.9535C13.5595 4.02977 13.5245 4.10133 13.4767 4.16408L7.0767 12.5641C7.02478 12.6321 6.95891 12.6883 6.88351 12.7288C6.80811 12.7692 6.72492 12.7931 6.63952 12.7988C6.55412 12.8045 6.4685 12.7918 6.3884 12.7617C6.3083 12.7316 6.23557 12.6846 6.1751 12.6241L2.5751 9.02408C2.46911 8.91034 2.41141 8.7599 2.41416 8.60446C2.4169 8.44902 2.47987 8.30071 2.5898 8.19078C2.69973 8.08085 2.84804 8.01788 3.00348 8.01513C3.15892 8.01239 3.30936 8.07009 3.4231 8.17608L6.5383 11.2905L12.5223 3.43688C12.6186 3.31044 12.7611 3.22738 12.9186 3.20593C13.0761 3.18448 13.2357 3.2264 13.3623 3.32248Z" fill="#030712" />
            </svg>
        )
    }

    return (

        <Section className='py-sm md:py-md lg:py-lg bg-[#F9F9F9]'>
            <Container className='flex flex-col gap-6'>
                <div className='flex lg:flex-row flex-col lg:gap-24 gap-8'>
                    <div className='lg:w-[608px] flex-shrink-0 w-full h-[400px] lg:h-[608px]'>
                        {data.cardImage?.url && <ImageLoader
                            image={data. cardImage?.url}
                            radius={12}
                            alt={data?.headline}
                            title={data?.headline}
                            width={608}
                            height={608}
                            fixed={true}
                            className='h-auto w-full object-cover'
                        />
                        }
                    </div>
                    <div>
                        <div className='flex flex-col gap-3'>
                            <h4 className="text-gray-900 lg:text-[40px] md:text-3xl text-2xl leading-[120%] font-semibold font-manrope">{data?.headline}</h4>
                            <p className="text-gray-700 lg:text-base text-sm leading-[155%] font-normal font-geist mb-6">{data?.subheadline}</p>
                        </div>
                        <span className="text-[#4A3CE1] max-w-max flex px-3 py-1 bg-[#F3F1FA] lg:text-base text-sm leading-[150%] font-medium font-geist">{data?.subDescription}</span>
                        <div className='mt-3'>
                            {
                                data?.tabs.map((e: any) => {
                                    return (
                                        <div className="py-[14px] text-gray-950 flex flex-row gap-3 border-b border-b-[#E1E2E3] last:border-b-0 leading-[150%] lg:text-base text-sm" key={e?._id}><TickIcon />{e?.tabHeading}</div>
                                    )
                                })
                            }
                            <Button type='primary' className='md:w-[172px] w-full mt-6'><span>Book Free Demo</span></Button>
                        </div>

                    </div>
                </div>
            </Container>
        </Section>

    )
}
