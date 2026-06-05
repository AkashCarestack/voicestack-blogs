import React from 'react'
import { decodeHtmlEntities, preventWidows } from '~/utils/decodeHtmlEntities'

export function decodePortableTextChildren(
  children: React.ReactNode,
  options?: { preventWidows?: boolean },
): React.ReactNode {
  if (typeof children === 'string') {
    const decoded = decodeHtmlEntities(children)
    return options?.preventWidows ? preventWidows(decoded) : decoded
  }

  if (Array.isArray(children)) {
    return children.map((child) => decodePortableTextChildren(child, options))
  }

  if (React.isValidElement(children)) {
    const elementChildren = (children.props as { children?: React.ReactNode }).children

    if (elementChildren !== undefined) {
      return React.cloneElement(children, {}, decodePortableTextChildren(elementChildren, options))
    }
  }

  return children
}
