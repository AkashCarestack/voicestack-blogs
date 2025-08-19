import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import H2 from '../typography/H2'

interface BrowserBlockProps {
  mainHeading: string
  listingItem: any[]
}

const BrowserBlock = ({ mainHeading, listingItem: browserList }: BrowserBlockProps) => {

  return (
    <div className="flex flex-col gap-3">
      <H2 className='mb-3'>{mainHeading}</H2>
      <div className="grid gap-3 grid-cols-3">
        {browserList && browserList.length > 0 && (
          browserList.map((browser:any, index:number) => {
            return(
              <div className='flex flex-col items-center gap-[18px] px-3 py-4 md:py-6 rounded-[12px] bg-gray-50' key={browser._key}>
                <Image className='max-w-[60%] h-auto' src={browser.image.url} alt={browser.altText}
                  title={browser.image.altText}
                  width={browser?.image.metadata?.dimensions?.width}
                  height={browser?.image.metadata?.dimensions?.height}
                />
                <span className='text-center text-gray-600 text-sm md:text-base'>{browser.name}</span>
              </div>
            )
          })
        )}
        
      </div>
    </div>
  )
}

export default BrowserBlock
