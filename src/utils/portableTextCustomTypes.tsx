import React from 'react'
import ComparisonSchema from '~/components/dynamic/ComparisonSchema'
import ListingBlock from '~/components/blockEditor/ListingBlock'

export function parseSchemaJson(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export const portableTextCustomTypes = {
  comparisonSchema: ({ value }: { value: any }) => {
    if (!value) return null
    return <ComparisonSchema data={value} slugData={{}} />
  },
  listingBlock: ({ value }: { value: any }) => {
    if (!value) return null
    return (
      <ListingBlock
        itemHeading={value.itemHeading}
        listingItem={value.listingItem}
      />
    )
  },
}
