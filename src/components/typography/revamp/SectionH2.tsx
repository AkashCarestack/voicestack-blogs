import React from 'react'
import { PortableText } from '@portabletext/react'
import { PortableTextReactComponents } from '@portabletext/react'

interface SectionH2Props {
  content: any // Portable text content (customBlockContent)
  className?: string
  isWhite?: boolean
  headingSm?: boolean
  showFullLength?: boolean
}

const SectionH2: React.FC<SectionH2Props> = ({
  content,
  className = '',
  isWhite = false,
  headingSm = false,
  showFullLength = false,
}) => {
  // Portable text components configuration
  const components: Partial<PortableTextReactComponents> = {
    block: {
      normal: ({ children }) => (
        <span className="[&_br]:hidden md:[&_br]:block">{children}</span>
      ),
    },
    marks: {
      highlight: ({ children }) => (
        <span className="text-gray-400">{children}</span>
      ),
      strong: ({ children }) => <strong>{children}</strong>,
      underline: ({ children }) => <span className="underline">{children}</span>,
      link: ({ value, children }) => {
        const target = value?.blank ? '_blank' : undefined
        const rel = value?.blank ? 'noopener noreferrer' : undefined
        return (
          <a href={value?.href} target={target} rel={rel} className="underline hover:opacity-80">
            {children}
          </a>
        )
      },
    },
  }

  // Base classes matching sectionHeaderV2 h2 styling
  // Note: width constraint removed from h2 as parent div handles it
  const baseClasses = `[&_br]:hidden md:[&_br]:block !leading-[116%] mb-3 tracking-[-0.8px] font-manrope font-semibold `
  
  const sizeClasses = headingSm 
    ? 'text-xl lg:text-2xl font-medium' 
    : 'lg:text-5xl text-3xl'
  
  const colorClasses = isWhite ? 'text-white' : 'text-gray-950'
  
  const combinedClasses = `${baseClasses} ${sizeClasses} ${colorClasses} ${className}`
  

  // Check if content is valid portable text
  if (!content) {
    return null
  }

  return (
    <h2 className={combinedClasses}>
      {Array.isArray(content) ? (
        <PortableText value={content} components={components} />
      ) : (
        <span dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </h2>
  )
}

export default SectionH2

