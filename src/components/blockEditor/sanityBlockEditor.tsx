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
import AppDownloadHero from '../dynamic/AppDownloadHero'
import WarningIcon from '../icons/WarningIcon'
import H2 from '../typography/H2'
import H3 from '../typography/H3'
import Paragraph from '../typography/Paragraph'

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
      underline: ({ children }: { children: React.ReactNode }) => (
        <span style={{ textDecoration: 'underline' }}>
          {children}
        </span>
      ),
    },

    block: {
      normal: ({ children }) => {
        return (
            <Paragraph className=''>{children}</Paragraph>
        )
      },
      h2: ({ children }) => {
        return (
            <H2 className='text-center'>{children}</H2>
        )
      },
      h3: ({ children }) => {
        return (
            <H3 className='!font-manrope !text-2xl'>{children}</H3>
        )
      },
      h4: ({ children }) => {
        return (
            <h4 className="text-2xl font-bold text-gray-900 font-manrope">{children}</h4>
        )
      },
      h5: ({ children }) => {
        return (
            <h5 className="text-xl font-bold text-gray-900 font-manrope">{children}</h5>
        )
      },
      h6: ({ children }) => {
        return (
            <h6 className="text-lg font-bold text-gray-900 font-manrope">{children}</h6>
        )
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
        return (
          <AppDownloadHero 
            data={value} 
            slugData={{}}
          />
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
