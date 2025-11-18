import Link from 'next/link'
import React from 'react'
import H2 from '../typography/H2'


interface ListingBlockProps {
  itemHeading: string | null
  listingItem: any[]
  page?: string
}

const ListingBlock: React.FC<ListingBlockProps> = ({ itemHeading, listingItem, page }) => {
  const isCaseStudy = page === 'case-study' 

  if (isCaseStudy) {
    return (
      <div className="flex flex-col gap-3 md:mt-16 mt-8 md:mb-[40px] mb-[16px]">
        {itemHeading && <H2>{itemHeading}</H2>}
        <div className="flex">
          {listingItem && listingItem.length > 0 && (
            listingItem.map((item: any, index: number) => {
              return (
                <div
                  key={item._key || index}
                  className="flex flex-col gap-1 items-start px-[25px] py-3 border-l-2 last:border-r-0 "
                  style={{
                    borderColor: 'rgba(0, 0, 0, 0.30)',
                  }}
                >
                  <div className="text-[#4A3CE1] font-manrope text-[36px] font-semibold leading-[111.11%]">
                    {item.key}
                  </div>
                  <div className="text-black/70 font-geist text-base font-normal !leading-[150%] tracking-normal">
                    {item.value}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Default vertical layout
  return (
    <div className="flex flex-col gap-3">
      {itemHeading && <H2>{itemHeading}</H2>}
      <div>
        {listingItem && listingItem.length > 0 && (
          listingItem.map((item: any, index: number) => {
            return (
              <div className='flex p-3 items-center border-b border-gray-200 gap-4 md:gap-8' key={item._key || index}>
                <div className='w-[150px] md:w-[207px] text-gray-600 leading-[1.45] flex-shrink-0 text-sm md:text-base'>{item.key}</div>
                <div className='text-gray-600 leading-[1.45] text-sm md:text-base'>{item.value}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ListingBlock
