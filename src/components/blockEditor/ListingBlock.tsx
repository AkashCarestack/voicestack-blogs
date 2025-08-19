import Link from 'next/link'
import React from 'react'
import H2 from '../typography/H2'


interface ListingBlockProps {
  itemHeading: string | null
  listingItem: any[]
}

const ListingBlock: React.FC<ListingBlockProps> = ({ itemHeading, listingItem }) => {

  
  return (
    <div className="flex flex-col gap-3">
      <H2>{itemHeading}</H2>
      <div>
        {listingItem && listingItem.length > 0 && (
          listingItem.map((item:any, index:number) => {
            return(
              <div className='flex p-3 items-center border-b border-gray-200 gap-4 md:gap-8' key={item._key}>
                <div className='w-[150px] md:w-[207px] text-gray-600 leading-[1.45] flex-shrink-0 text-sm md:text-base'>{item.key}</div>
                <div className='text-gray-600 leading-[1.45] text-sm md:text-base'>{item.value}</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ListingBlock
