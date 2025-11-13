import React from 'react'
import {
  PortableText,
  PortableTextReactComponents,
} from '@portabletext/react'
import { getClient } from '~/lib/sanity.client'
import DynamicComponent from './DynamicComponent'
import ListingBlock from './ListingBlock'
import BrowserBlock from './BrowserBlock'
import TabsListingComponent from '../dynamic/TabsListingComponent'
import CustomComponent from '../dynamic/CustomComponent'
import ListingComponent from '../dynamic/ListingComponent'
import ComparisonSchema from '../dynamic/ComparisonSchema'
import WarningIcon from '../icons/WarningIcon'

interface SanityPortableTextProps {
  content: any
  draftMode?: boolean
  token?: string
}

const SanityPortableText: React.FC<SanityPortableTextProps> = ({
  content,
  draftMode = false,
  token = '',
}) => {
  const portableTextComponents: Partial<PortableTextReactComponents> = {
    marks: {
      link: ({ value, children }) => {
        return value?.href ? (
          <a href={value.href} target="_blank" className="!text-blue-500">
            {children}
          </a>
        ) : (
          <span className="!text-blue-500">
            {children}
          </span>
        )
      },
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span style={{ backgroundColor: 'yellow', fontWeight: 'semibold' }}>
          {children}
        </span>
      ),
    },

    block: {
      normal: ({ children }) => {
        return <p className="text-gray-700 leading-[1.6] text-[16px]">{children}</p>
      },
      // Blockquote
      blockquote: ({ children }) => {
        return (
          <blockquote className="p-4 md:p-6 rounded-[8px] md:rounded-[12px] bg-yellow-100 flex gap-3 md:gap-6 items-center text-sm md:text-base text-[#78350F]">
            <WarningIcon className='text-[#78350F] flex-shrink-0 w-5 md:w-8'></WarningIcon><div>{children}</div>
          </blockquote>
        )
      },
    },
    types: {
      // image: ({ value }) => {
      //   if (!value?.asset) return null;
      //   return (
      //     <ImageLoader
      //       image={value.asset}
      //       priority={true}
      //       altText={value?.asset?.altText || 'Post image'}
      //       title={value.asset.title || 'Post image'}
      //       imageClassName="w-full"
      //       fixed={false}
      //       client={getClient(draftMode ? { token } : undefined)}
      //        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      //     />
      //   )
      // },

      // table: ({ value }) => {
      //   return <DecoratorTable>{value}</DecoratorTable>
      // },
      htmlCode: ({ value }) => {
        return (
          <div
            className="content-wrapper w-full"
            dangerouslySetInnerHTML={{ __html: value.htmlCode }}
          />
        )
      },
      dynamicComponent: ({ value }) => {        
        if (!value) return null;
        return (
          <DynamicComponent
            {...value}
            client={getClient(draftMode ? { token } : undefined)}
          />
        )
      },
      listingBlock: ({ value }) => {
        if (!value) return null;
        return (
          <ListingBlock
            itemHeading={value.itemHeading}
            listingItem={value.listingItem}
          />
        )
      },
      browserList: ({ value }) => {
        if (!value) return null;
        return (
          <BrowserBlock
            mainHeading={value.mainHeading}
            listingItem={value.listingItem}
          />
        )
      },
      // Dynamic component types from customContentNew
      tabsListingComponent: ({ value }) => {
        if (!value) return null;
        return (
          <TabsListingComponent 
            data={value} 
            slugData={{ slug: value?.slug?.current || value?.slug }}
          />
        )
      },
      genericListingComponent: ({ value }) => {
        if (!value) return null;
        // Map genericListingComponent data to listingComponent format
        const listingData = {
          title: value.heading,
          description: value.description,
          items: value.items || [],
          layout: 'vertical' // default layout
        };
        return (
          <ListingComponent 
            data={listingData} 
            slugData={{}}
          />
        )
      },
      customComponent: ({ value }) => {
        if (!value) return null;
        return (
          <CustomComponent 
            data={value} 
            slugData={{}}
          />
        )
      },
      heroComponent: ({ value }) => {
        if (!value) return null;
        // Hero component rendering - using a simple placeholder for now
        // You may want to create a proper HeroComponent renderer
        return (
          <div className="py-8 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Hero Component</h3>
              <p className="text-blue-600">Hero component rendering - implement as needed</p>
            </div>
          </div>
        )
      },
      comparisonSchema: ({ value }) => {
        if (!value) return null;
        return (
          <ComparisonSchema 
            data={value} 
            slugData={{}}
          />
        )
      },
    },
  }

  return <PortableText value={content} components={portableTextComponents} />
}

export default SanityPortableText
