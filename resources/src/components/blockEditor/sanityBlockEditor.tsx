import {
  PortableText,
  PortableTextReactComponents,
  toPlainText,
} from '@portabletext/react'
import React, { useMemo } from 'react'
import slugify from 'slugify'

import DecoratorTable from '~/resources/components/DecoratorTable'
import DynamicComponent from '~/resources/layout/DynamicComponent'
import { getClient } from '~/resources/lib/sanity.client'

import ImageLoader from '../commonSections/ImageLoader'
import { VideoModal } from '../commonSections/VideoModal'

interface SanityPortableTextProps {
  content: any
  draftMode?: boolean
  token?: string
  siteSettings?: any
}

/**
 * Portable Text list items with block styles h1–h6 render as real headings inside <li>,
 * which is invalid and hurts layout. Demote to normal blocks and bold the first span.
 */
function demoteListItemHeadings(content: unknown): unknown {
  if (!Array.isArray(content)) return content
  return content.map((block: any) => {
    if (
      block?._type !== 'block' ||
      !block.listItem ||
      !block.style ||
      block.style === 'normal'
    ) {
      return block
    }
    if (!/^h[1-6]$/.test(block.style)) {
      return block
    }
    let strongApplied = false
    const children = Array.isArray(block.children)
      ? block.children.map((child: any) => {
          if (!strongApplied && child?._type === 'span') {
            strongApplied = true
            const marks = [...(child.marks || [])]
            if (!marks.includes('strong')) marks.push('strong')
            return { ...child, marks }
          }
          return child
        })
      : block.children
    return {
      ...block,
      style: 'normal',
      children,
    }
  })
}

const SanityPortableText: React.FC<SanityPortableTextProps> = ({
  content,
  draftMode = false,
  token = '',
  siteSettings,
}) => {
  const normalizedContent = useMemo(() => demoteListItemHeadings(content), [content])

  const portableTextComponents: Partial<PortableTextReactComponents> = {
    marks: {
      link: ({ value, children }) => {
        return (
          <a href={value?.href} target="_blank" className="!text-blue-500">
            {children}
          </a>
        )
      },
    },
    // list: {
    //   bullet: ({children}) => <ul >{children}</ul>,
    //   number: ({children}) => <ol >{children}</ol>,
    // },
    // listItem: {
    //   bullet: ({children, index}) => (
    //     <ListItem
    //       node={{ children }}
    //       index={index ?? 0}
    //       isOrdered={false}
    //     />
    //   ),
    //   number: ({children, index}) => (
    //     <ListItem
    //       node={{ children }}
    //       index={index ?? 0}
    //       isOrdered={true}
    //     />
    //   ),
    // },
    block: {
      h2: ({ children, value }) => {
        // `value` is the single Portable Text block for this header
        const slug = slugify(toPlainText(value))
        return (
          <h2 className="scroll-my-24" id={slug}>
            {children}
          </h2>
        )
      },
    },
    types: {
      image: ({ value }) => {
        // Add null checks for the asset
        if (!value?.asset) {
          console.warn('SanityBlockEditor: image asset is null or undefined')
          return null
        }
        
        return (
          <ImageLoader
            image={value.asset}
            priority={true}
            altText={value?.asset?.altText || 'Post image'}
            title={value?.asset?.title || 'Post image'}
            imageClassName="w-full"
            fixed={false}
            client={getClient(draftMode ? { token } : undefined)}
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )
      },
      videoReference: ({ value }) => {
        return (
          <VideoModal
            {...value}
            client={getClient(draftMode ? { token } : undefined)}
          />
        )
      },
      table: ({ value }) => {
        return <DecoratorTable>{value}</DecoratorTable>
      },
      htmlCode: ({ value }) => {
        return (
          <div
            className="content-wrapper w-full"
            dangerouslySetInnerHTML={{ __html: value.htmlCode }}
          />
        )
      },
      dynamicComponent: ({ value }) => {
        return (
          <DynamicComponent
            {...value}
            siteSettings={siteSettings}
            client={getClient(draftMode ? { token } : undefined)}
          />
        )
      },
    },
  }

  return (
    <PortableText
      value={normalizedContent as SanityPortableTextProps['content']}
      components={portableTextComponents}
    />
  )
}

export default SanityPortableText
