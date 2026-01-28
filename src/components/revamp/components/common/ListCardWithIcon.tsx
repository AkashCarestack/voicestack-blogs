import React from 'react'

interface ListCardWithIconProps {
    heading: string
    key: string
    data: Array<{
        itemHeading: string
        dynamicSvgCode: string
    }>

}
export default function ListCardWithIcon({ heading, data }: ListCardWithIconProps) {
    return (
        <div className='md:px-12 md:py-12 py-4 flex-1 first:md:border-r first:border-r-gray-200'>
            <h3 className='text-gray-950 text-xl font-medium leading-[140%]font-geist md:mb-6 mb-4'>{heading}</h3>
            {
                data && data?.length > 0 && data?.map((item: any) => {
                    return (
                        <ul className='flex items-center border-b border-b-gray-200 gap-3 md:py-2 py-1.5' key={item._key}>
                            <span dangerouslySetInnerHTML={{ __html: item.dynamicSvgCode }}></span>
                            <li className="text-gray-500 md:text-base text-sm ">{item.itemHeading}</li>
                        </ul>
                    )
                })
            }
        </div>
    )
}
