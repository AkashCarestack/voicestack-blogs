import React from 'react'
import Image from 'next/image'

export interface CardItemProps {
  _key?: string
  heading?: string
  subheading?: string
  description?: string
  link?: {
    url?: string
    text?: string
    buttonType?: string
  }
  dynamicSvg?: string
  image?: any
  icon?: any
}

interface CardItemComponentProps {
  item: CardItemProps
}

const CardItemComponent = ({ item }: CardItemComponentProps) => {
  const hasImage = item.image?.url
  
  return (
    <div className={`h-full col-span-2 flex flex-col gap-6 justify-between transition-all group`}>
      <div className="flex flex-col">
        {/* Image - renders at top level without padding wrapper */}
        {hasImage && (
          <div className="w-full">
            <Image
              src={item.image.url}
              alt={item.heading || ''}
              width={item.image.metadata.dimensions.width}
              height={item.image.metadata.dimensions.height}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="xl:p-12 p-6 flex flex-col gap-8">
          {/* Dynamic SVG */}
          {item.dynamicSvg && (
            <div 
              className="flex items-center justify-center self-start w-8 h-8"
              dangerouslySetInnerHTML={{ __html: item.dynamicSvg }}
            />
          )}

          {/* Content */}
          <div className="flex flex-col gap-[6px]">
            {item.heading && (
              <h3 className="md:text-xl text-lg font-medium text-gray-950 leading-normal [&>span]:text-vs-blue"
                dangerouslySetInnerHTML={{__html:item.heading}}
              ></h3>
            )}
            {item.description && (
              <p className="text-base text-gray-500 leading-normal">
                {item.description}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Link Text */}
      {item.link?.url && item.link?.text && (
        <div className="learn-more">
          {item.link.text}
        </div>
      )}
    </div>
  )
}

export default CardItemComponent

